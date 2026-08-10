/* ═══════════════════════════════════════════════════════════════
   Reasoning Engine — Central AI Orchestration Pipeline
   Processes user input through multiple cognitive stages:
   1. Preprocess → 2. Context → 3. Classify → 4. Route → 5. Respond
   ═══════════════════════════════════════════════════════════════ */

import { preprocessQuery } from './queryPreprocessor';
import type { ProcessedQuery } from './queryPreprocessor';
import { recordUserMessage, recordAIMessage, enrichWithContext, getContext } from './contextManager';
import { searchLocalBrainMulti } from './localBrain';
import type { BrainMatch } from './localBrain';
import { parseIntent, generateCreateResponse } from './intentParser';
import type { ParsedIntent } from './intentParser';
import { askGemini, hasApiKey, searchPublicKnowledge } from '../services/geminiService';

import { askOpenAI, hasOpenAIApiKey, getPrimaryProvider } from '../services/openaiService';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

export interface ReasoningResult {
  /** The final response text to display */
  response: string;
  /** The source that generated the response */
  source: 'gemini' | 'openai' | 'local_brain' | 'local_brain_multi' | 'wikipedia' | 'fallback' | 'create';
  /** The parsed intent (for create actions) */
  intent?: ParsedIntent;
  /** The processed query (for debugging/logging) */
  processedQuery: ProcessedQuery;
}

// ═══════════════════════════════════════════════════════════════
// Main Reasoning Pipeline
// ═══════════════════════════════════════════════════════════════

/**
 * The main entry point for the AI reasoning pipeline.
 * Processes a user message through multiple cognitive stages.
 *
 * @param userInput - Raw text from the user
 * @param conversationHistory - Previous messages for Gemini context
 * @returns A ReasoningResult with the response and metadata
 */
export async function processWithReasoning(
  userInput: string,
  conversationHistory: { role: string; content: string }[]
): Promise<ReasoningResult> {

  // ── Stage 1: Preprocess ──────────────────────────────────
  const processed = preprocessQuery(userInput);

  // ── Stage 2: Context Enrichment ──────────────────────────
  const enrichedQuery = enrichWithContext(processed.normalized, processed.isFollowUp);

  // Record user message into context manager
  recordUserMessage(processed.original, processed.keywords, processed.subject);

  // ── Stage 3: Intent Classification ───────────────────────
  // Use the ORIGINAL input for intent parsing (it has the create verbs intact)
  const intent = parseIntent(userInput);

  // If this is a CREATE action, return early with the intent
  if (intent.action === 'create' && intent.template && intent.context) {
    const response = generateCreateResponse(intent.template as any, intent.context);
    recordAIMessage(response);
    return {
      response,
      source: 'create',
      intent,
      processedQuery: processed,
    };
  }

  // ── Stage 4: Knowledge Routing ───────────────────────────
  // Try multiple knowledge sources in priority order

  // Layer 1: LLM APIs (OpenAI or Gemini)
  const llmResult = await tryLLM(enrichedQuery, conversationHistory);
  if (llmResult) {
    recordAIMessage(llmResult.response);
    return {
      response: llmResult.response,
      source: llmResult.source,
      processedQuery: processed,
    };
  }

  // Layer 2: Local Brain (multi-match for richer responses)
  const localResult = tryLocalBrain(enrichedQuery, processed);
  if (localResult) {
    recordAIMessage(localResult.response);
    return {
      ...localResult,
      processedQuery: processed,
    };
  }

  // Layer 3: Wikipedia
  const wikiResult = await tryWikipedia(processed.subject || enrichedQuery);
  if (wikiResult) {
    recordAIMessage(wikiResult);
    return {
      response: wikiResult,
      source: 'wikipedia',
      processedQuery: processed,
    };
  }

  // ── Stage 5: Fallback ────────────────────────────────────
  const fallbackResponse = generateFallback(processed);
  recordAIMessage(fallbackResponse);
  return {
    response: fallbackResponse,
    source: 'fallback',
    processedQuery: processed,
  };
}

// ═══════════════════════════════════════════════════════════════
// Knowledge Source Handlers
// ═══════════════════════════════════════════════════════════════

async function tryLLM(
  query: string,
  history: { role: string; content: string }[]
): Promise<{ response: string; source: 'gemini' | 'openai' } | null> {
  const provider = getPrimaryProvider();
  
  try {
    if (provider === 'openai' && hasOpenAIApiKey()) {
      const result = await askOpenAI(query, history);
      if (result.error) {
        return { 
          response: `⚠️ **Koneksi OpenAI Gagal**\n\nSistem AI tidak dapat terhubung ke server OpenAI. Pesan error: \`${result.error}\`\n\nSilakan periksa kembali API Key atau kuota (saldo) akun OpenAI Anda di Pengaturan (⚙️).`, 
          source: 'openai' 
        };
      }
      if (result.text) {
        return { response: result.text, source: 'openai' };
      }
    } else if (hasApiKey()) {
      const result = await askGemini(query, history);
      if (result.error) {
        return { 
          response: `⚠️ **Koneksi Gemini Gagal**\n\nSistem AI tidak dapat terhubung ke server Gemini. Pesan error: \`${result.error}\`\n\nSilakan periksa kembali API Key Anda di Pengaturan (⚙️).`, 
          source: 'gemini' 
        };
      }
      if (result.text) {
        return { response: result.text, source: 'gemini' };
      }
    }
  } catch (err: any) {
    return { 
      response: `⚠️ **Kesalahan Jaringan**\n\nTerjadi kesalahan tidak terduga: \`${err.message}\``, 
      source: provider 
    };
  }

  return null;
}

function tryLocalBrain(
  query: string,
  processed: ProcessedQuery
): { response: string; source: 'local_brain' | 'local_brain_multi' } | null {

  // Get multiple matches from the knowledge base
  const matches = searchLocalBrainMulti(query);

  if (matches.length === 0) return null;

  // If only one strong match, return it directly
  if (matches.length === 1 || matches[0].score > matches[1]?.score * 2) {
    return {
      response: matches[0].response,
      source: 'local_brain',
    };
  }

  // If the question type suggests comparison, combine top 2
  if (processed.questionType === 'comparison' && matches.length >= 2) {
    return {
      response: combineResponses(matches.slice(0, 2), processed, 'comparison'),
      source: 'local_brain_multi',
    };
  }

  // If multiple topics are detected in the query, combine relevant matches
  if (processed.keywords.length >= 2 && matches.length >= 2) {
    // Check if the second match is also strong (not just noise)
    const ratio = matches[1].score / matches[0].score;
    if (ratio > 0.3) {
      return {
        response: combineResponses(matches.slice(0, 2), processed, 'multi_topic'),
        source: 'local_brain_multi',
      };
    }
  }

  // Default: return the best match
  return {
    response: matches[0].response,
    source: 'local_brain',
  };
}

async function tryWikipedia(subject: string): Promise<string | null> {
  try {
    const wikiResult = await searchPublicKnowledge(subject);
    if (wikiResult) {
      const trimmed = wikiResult.length > 800
        ? wikiResult.substring(0, 800) + '...'
        : wikiResult;
      return formatWikipediaResponse(trimmed, subject);
    }
  } catch (_) {
    // Silently fall through
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════
// Response Formatting & Synthesis
// ═══════════════════════════════════════════════════════════════

/**
 * Combines multiple local brain matches into a coherent response.
 */
function combineResponses(
  matches: BrainMatch[],
  processed: ProcessedQuery,
  mode: 'comparison' | 'multi_topic'
): string {
  if (mode === 'comparison') {
    const topicA = matches[0].topKeyword.charAt(0).toUpperCase() + matches[0].topKeyword.slice(1);
    const topicB = matches[1].topKeyword.charAt(0).toUpperCase() + matches[1].topKeyword.slice(1);

    return `Berikut penjelasan mengenai **${topicA}** dan **${topicB}**:\n\n` +
      `---\n\n` +
      `### ${topicA}\n\n${matches[0].response}\n\n` +
      `---\n\n` +
      `### ${topicB}\n\n${matches[1].response}`;
  }

  // multi_topic
  const parts = matches.map(m => m.response);
  const topics = matches.map(m =>
    m.topKeyword.charAt(0).toUpperCase() + m.topKeyword.slice(1)
  );

  return `Saya menemukan informasi relevan mengenai **${topics.join('** dan **')}** dalam pertanyaan Anda:\n\n` +
    parts.join('\n\n---\n\n');
}

/**
 * Formats a Wikipedia result into a structured response.
 */
function formatWikipediaResponse(content: string, subject: string): string {
  const title = subject.charAt(0).toUpperCase() + subject.slice(1);
  return `📖 **${title}**\n\n${content}\n\n_Sumber: Wikipedia Indonesia_`;
}

/**
 * Generates a context-aware fallback response.
 */
function generateFallback(processed: ProcessedQuery): string {
  const context = getContext();
  const subject = processed.subject || processed.original;

  // If there's conversation context, reference it
  if (context.lastTopic && processed.isFollowUp) {
    return `Mohon maaf, saya tidak memiliki informasi lebih lanjut mengenai **${context.lastTopic}** untuk menjawab pertanyaan tersebut.\n\nAnda dapat mencoba:\n- Mengajukan pertanyaan yang lebih spesifik tentang topik ini\n- Menambahkan **API Key Gemini** di menu ⚙️ Pengaturan untuk mengaktifkan kecerdasan penuh\n- Menginstruksikan saya untuk membangun sebuah aplikasi web`;
  }

  return `Mohon maaf, saya belum berhasil menemukan informasi yang cukup mengenai *"${subject}"*.\n\nBeberapa hal yang dapat Anda coba:\n- Ajukan pertanyaan dengan kata kunci yang lebih spesifik\n- Tambahkan **API Key Gemini** melalui menu ⚙️ Pengaturan untuk respons yang lebih mendalam\n- Instruksikan saya untuk membangun aplikasi web, misalnya: *"Buatkan dashboard penjualan dengan grafik"*`;
}
