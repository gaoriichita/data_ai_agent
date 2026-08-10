/* ═══════════════════════════════════════════════════════════════
   OpenAI Service — Secondary LLM Intelligence Layer
   ═══════════════════════════════════════════════════════════════ */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-4o-mini';

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

export interface OpenAIResponse {
  text: string;
  error?: string;
}

export function getOpenAIApiKey(): string {
  return localStorage.getItem('appforge_openai_key') || '';
}

export function setOpenAIApiKey(key: string): void {
  localStorage.setItem('appforge_openai_key', key);
}

export function hasOpenAIApiKey(): boolean {
  return getOpenAIApiKey().length > 0;
}

export function getPrimaryProvider(): 'gemini' | 'openai' {
  return (localStorage.getItem('appforge_primary_llm') as 'gemini' | 'openai') || 'gemini';
}

export function setPrimaryProvider(provider: 'gemini' | 'openai'): void {
  localStorage.setItem('appforge_primary_llm', provider);
}

export async function askOpenAI(
  userMessage: string, 
  conversationHistory?: { role: string; content: string }[]
): Promise<OpenAIResponse> {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    return { text: '', error: 'NO_KEY' };
  }

  const messages: any[] = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];

  if (conversationHistory && conversationHistory.length > 0) {
    const recent = conversationHistory.slice(-10);
    for (const msg of recent) {
      messages.push({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content
      });
    }
  }

  messages.push({
    role: 'user',
    content: userMessage
  });

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || response.statusText;
      
      if (response.status === 429 || errMsg.toLowerCase().includes('quota')) {
        return { text: '', error: 'QUOTA_EXCEEDED' };
      }
      if (response.status === 401 || response.status === 403) {
        return { text: '', error: 'INVALID_KEY' };
      }
      return { text: '', error: errMsg };
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return { text: '', error: 'OpenAI tidak mengembalikan respons.' };
    }

    return { text };
  } catch (err: any) {
    return { text: '', error: `Network error: ${err.message}` };
  }
}
