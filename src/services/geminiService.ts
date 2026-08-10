/* ═══════════════════════════════════════════════════════════════
   Gemini API Service — Real LLM Intelligence Layer
   ═══════════════════════════════════════════════════════════════ */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `Kamu adalah AppForge AI, sebuah asisten kecerdasan buatan yang sangat cerdas, berpengetahuan luas, dan profesional.

## IDENTITAS
- Nama: AppForge AI
- Peran: Asisten AI cerdas untuk menjawab pertanyaan dan membangun aplikasi web
- Kepribadian: Profesional, tajam, terstruktur, namun tetap ramah dan mudah dipahami

## PROSES BERPIKIR
Untuk setiap pertanyaan, lakukan proses ini secara internal sebelum menjawab:
1. Pahami apa yang sebenarnya ditanyakan pengguna (bukan hanya kata-katanya, tapi maksud di baliknya).
2. Identifikasi topik utama dan sub-topik yang relevan.
3. Jika pertanyaan ambigu, interpretasikan secara wajar berdasarkan konteks percakapan.
4. Susun jawaban yang logis, terstruktur, dan informatif.
5. Periksa kembali jawaban sebelum mengirim — pastikan akurat dan lengkap.

## ATURAN BAHASA
- Jawab dalam bahasa yang sama dengan pertanyaan pengguna (biasanya Bahasa Indonesia).
- JANGAN gunakan singkatan informal. Tulis kata secara lengkap dan baku.
  - Benar: "tidak", "sudah", "yang", "dengan"
  - Salah: "gak", "udah", "yg", "dgn"
- JANGAN gunakan kata-kata yang tidak perlu seperti "Hmm", "Well", "Nah".
- Gunakan kalimat yang padat dan bermakna. Hindari pengulangan.

## FORMAT RESPONS
- Gunakan Markdown: **bold**, *italic*, bullet points, numbered lists, code blocks.
- Untuk topik teknis, sertakan contoh kode jika relevan.
- Gunakan heading (##) untuk membagi bagian jika jawaban panjang.
- Gunakan tabel jika membandingkan beberapa hal.
- Akhiri jawaban dengan ringkasan atau ajakan bertanya lebih lanjut jika sesuai.

## KEAHLIAN
Kamu memiliki pengetahuan mendalam tentang:
- Pemrograman (JavaScript, TypeScript, Python, PHP, Java, C#, Rust, Go, dan lainnya)
- Framework & Library (React, Vue, Angular, Laravel, Django, Spring Boot, Express, Next.js)
- Database (SQL, PostgreSQL, MySQL, MongoDB, Redis)
- DevOps (Docker, Kubernetes, CI/CD, Git)
- Kecerdasan Buatan & Machine Learning
- Sains, Matematika, Fisika, Kimia, Biologi
- Sejarah, Geografi, Tokoh Dunia
- Bisnis, Ekonomi, Teknologi
- Dan topik umum lainnya

## ATURAN KHUSUS
- Jika pengguna bertanya tentang membangun/membuat aplikasi, arahkan mereka untuk mengetik perintah seperti "Buatkan toko sepatu online warna merah".
- Jika kamu tidak yakin dengan jawaban, katakan dengan jujur bahwa kamu tidak memiliki informasi yang cukup.
- Jangan pernah mengarang fakta atau angka.
- Jika pertanyaan mengandung typo, pahami maksudnya dan jawab dengan benar tanpa mengomentari typo tersebut.
- Jika ada kode, SELALU gunakan code block dengan syntax highlighting yang tepat.`;


export interface GeminiResponse {
  text: string;
  error?: string;
}

export function getApiKey(): string {
  return localStorage.getItem('appforge_gemini_key') || '';
}

export function setApiKey(key: string): void {
  localStorage.setItem('appforge_gemini_key', key);
}

export function hasApiKey(): boolean {
  return getApiKey().length > 0;
}

export async function askGemini(userMessage: string, conversationHistory?: { role: string; content: string }[]): Promise<GeminiResponse> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { text: '', error: 'NO_KEY' };
  }

  // Build conversation contents for Gemini API
  const contents: any[] = [];

  // Add conversation history for context (last 10 messages max)
  if (conversationHistory && conversationHistory.length > 0) {
    const recent = conversationHistory.slice(-10);
    for (const msg of recent) {
      contents.push({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }
  }

  // Add the current user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents,
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || response.statusText;
      
      if (response.status === 429 || errMsg.toLowerCase().includes('quota')) {
        return { text: '', error: 'QUOTA_EXCEEDED' };
      }
      if (response.status === 400 || response.status === 403) {
        return { text: '', error: 'INVALID_KEY' };
      }
      return { text: '', error: errMsg };
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return { text: '', error: 'Gemini tidak mengembalikan respons.' };
    }

    return { text };
  } catch (err: any) {
    return { text: '', error: `Network error: ${err.message}` };
  }
}

// ── Public Search Intelligence Fallback ──
export async function searchPublicKnowledge(query: string): Promise<string | null> {
  // Extract main keyword from query
  // e.g., "apa itu machine learning" -> "machine learning"
  // "siapa presiden indonesia" -> "presiden indonesia"
  let keyword = query.toLowerCase()
    .replace(/^(apa itu|siapa|jelaskan tentang|pengertian|arti dari|siapakah|ceritakan tentang|beritahu saya tentang|tahu gak tentang|bagaimana tentang|apa yang dimaksud dengan|apa sih|siapa sih)\s+/i, '')
    .replace(/[?.,!"']/g, '')
    .trim();
    
  if (!keyword) return null;

  try {
    const url = `https://id.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&origin=*&titles=${encodeURIComponent(keyword)}`;
    const res = await fetch(url);
    const data = await res.json();
    
    const pages = data?.query?.pages;
    if (!pages) return null;
    
    const pageId = Object.keys(pages)[0];
    if (pageId === '-1') {
      // Try searching via opensearch if exact title match fails
      const searchUrl = `https://id.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(keyword)}&limit=1&format=json&origin=*`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      
      if (searchData[1] && searchData[1].length > 0) {
        const exactTitle = searchData[1][0];
        const exactUrl = `https://id.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&origin=*&titles=${encodeURIComponent(exactTitle)}`;
        const exactRes = await fetch(exactUrl);
        const exactResultData = await exactRes.json();
        const pId = Object.keys(exactResultData.query.pages)[0];
        const summary = exactResultData.query.pages[pId]?.extract;
        if (summary) return summary;
      }
      return null;
    }
    
    return pages[pageId].extract;
  } catch (err) {
    return null;
  }
}

