/* ═══════════════════════════════════════════════════════════════
   Context Manager — Conversation Context Tracking
   Maintains a sliding window of recent conversation topics
   to enable follow-up question understanding.
   ═══════════════════════════════════════════════════════════════ */

export interface ConversationContext {
  /** The last topic discussed */
  lastTopic: string;
  /** Last few keywords from recent messages */
  recentKeywords: string[];
  /** The last question type */
  lastQuestionType: string;
  /** Number of messages in current topic thread */
  topicDepth: number;
}

interface ContextEntry {
  role: 'user' | 'ai';
  content: string;
  keywords: string[];
  topic: string;
  timestamp: number;
}

const MAX_CONTEXT_WINDOW = 6;

// In-memory context store (per session, resets on page reload)
let contextWindow: ContextEntry[] = [];
let currentTopic: string = '';
let currentTopicDepth: number = 0;

// ═══════════════════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════════════════

/**
 * Records a user message into the context window.
 */
export function recordUserMessage(content: string, keywords: string[], topic: string): void {
  // If the topic changed, reset depth
  if (topic && topic !== currentTopic && topic.length > 2) {
    currentTopic = topic;
    currentTopicDepth = 1;
  } else {
    currentTopicDepth++;
  }

  contextWindow.push({
    role: 'user',
    content,
    keywords,
    topic: topic || currentTopic,
    timestamp: Date.now(),
  });

  // Trim to max window size
  if (contextWindow.length > MAX_CONTEXT_WINDOW) {
    contextWindow = contextWindow.slice(-MAX_CONTEXT_WINDOW);
  }
}

/**
 * Records an AI response into the context window.
 */
export function recordAIMessage(content: string): void {
  contextWindow.push({
    role: 'ai',
    content: content.substring(0, 200), // Only store a summary
    keywords: [],
    topic: currentTopic,
    timestamp: Date.now(),
  });

  if (contextWindow.length > MAX_CONTEXT_WINDOW) {
    contextWindow = contextWindow.slice(-MAX_CONTEXT_WINDOW);
  }
}

/**
 * Gets the current conversation context for follow-up enrichment.
 */
export function getContext(): ConversationContext {
  const recentKeywords: string[] = [];
  for (const entry of contextWindow) {
    if (entry.role === 'user') {
      recentKeywords.push(...entry.keywords);
    }
  }

  // Deduplicate and keep last 10
  const uniqueKeywords = [...new Set(recentKeywords)].slice(-10);

  return {
    lastTopic: currentTopic,
    recentKeywords: uniqueKeywords,
    lastQuestionType: '',
    topicDepth: currentTopicDepth,
  };
}

/**
 * Enriches a follow-up query with context from previous messages.
 * For example, if the user asks "jelaskan lebih lanjut" after asking about React,
 * this function returns "jelaskan lebih lanjut tentang react".
 */
export function enrichWithContext(normalizedQuery: string, isFollowUp: boolean): string {
  if (!isFollowUp || !currentTopic) {
    return normalizedQuery;
  }

  // Check if the query already contains the topic
  if (normalizedQuery.toLowerCase().includes(currentTopic.toLowerCase())) {
    return normalizedQuery;
  }

  // Inject the last topic into the query
  return `${normalizedQuery} tentang ${currentTopic}`;
}

/**
 * Resets the context (used when starting a new chat session).
 */
export function resetContext(): void {
  contextWindow = [];
  currentTopic = '';
  currentTopicDepth = 0;
}

/**
 * Gets the last N user messages for providing conversation history.
 */
export function getRecentUserMessages(n: number = 3): string[] {
  return contextWindow
    .filter(e => e.role === 'user')
    .slice(-n)
    .map(e => e.content);
}
