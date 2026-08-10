/* ═══════════════════════════════════════════════════════════════
   Intent Parser — Deep Pseudo-NLP Tokenizer + LLM Router
   ═══════════════════════════════════════════════════════════════ */

import type { ProjectType, ExtractedContext } from './projectEngine';

export type IntentAction = 'create' | 'chat' | 'unknown';

export interface ParsedIntent {
  action: IntentAction;
  template?: ProjectType;
  details: string;
  original: string;
  chatResponse?: string;
  context?: ExtractedContext;
  needsLLM?: boolean;  // true = send to Gemini API
}

const TEMPLATES: { type: ProjectType; keywords: string[] }[] = [
  { type: 'todo', keywords: ['todo', 'task', 'tugas', 'catatan', 'note', 'checklist', 'nyatet'] },
  { type: 'ecommerce', keywords: ['store', 'shop', 'ecommerce', 'toko', 'belanja', 'marketplace', 'jualan', 'jual', 'keranjang', 'cart'] },
  { type: 'lms', keywords: ['lms', 'school', 'student', 'sekolah', 'siswa', 'mahasiswa', 'course', 'kursus', 'learning', 'akademik', 'kampus'] },
  { type: 'dashboard', keywords: ['dashboard', 'analytics', 'analitik', 'report', 'laporan', 'chart', 'kpi', 'grafik'] },
];

const STOPWORDS = new Set([
  'saya','aku','gue','gw','pengen','ingin','mau','tolong','bikinin','buatkan','bikin',
  'buat','web','website','aplikasi','app','dong','tuh','sih','pokoknya','aja','saja',
  'yang','di','ke','dari','untuk','buat','sama','dengan','warna','warnanya','tema',
  'temanya','keren','bagus','mantap','ya','kalo','kalau','terus','habis','itu','ini',
  'dan','atau','tapi','karena','soalnya','biar','agar','supaya','seperti','kaya','kayak',
  'macam','mirip','bisa','nggak','gak','enggak','tidak','bukan','belum','sudah','udah'
]);

const CREATE_VERBS = /\b(buat|bikin|buatkan|bikinkan|bangun|create|build|make|generate|bikinin)\b/;

// ── Deep NLP Extractor ────────────────────────────────────────

function extractContext(input: string): ExtractedContext {
  const q = input.toLowerCase().replace(/[.,!?]/g, '');
  const tokens = q.split(/\s+/);
  
  let themeColor = "blue";
  if (q.includes('merah') || q.includes('red')) themeColor = "red";
  else if (q.includes('pink') || q.includes('merah muda')) themeColor = "pink";
  else if (q.includes('hijau') || q.includes('green')) themeColor = "green";
  else if (q.includes('kuning') || q.includes('yellow')) themeColor = "yellow";
  else if (q.includes('ungu') || q.includes('purple')) themeColor = "purple";
  else if (q.includes('coklat') || q.includes('brown')) themeColor = "brown";
  else if (q.includes('hitam') || q.includes('gelap') || q.includes('dark')) themeColor = "dark";
  else if (q.includes('oranye') || q.includes('orange')) themeColor = "orange";

  const colorWords = ['merah','biru','hijau','kuning','hitam','gelap','terang','coklat','ungu','pink','oranye','red','blue','green','dark'];
  const meaningfulWords = tokens.filter(w => !STOPWORDS.has(w) && w.length > 2 && !colorWords.includes(w));
  
  let topic = meaningfulWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  if (!topic || topic.trim() === '') {
    topic = "Proyek Baru";
  }

  return { topic, themeColor, features: meaningfulWords };
}

// ── Parser ────────────────────────────────────────────────────

export function parseIntent(input: string): ParsedIntent {
  const q = input.toLowerCase().trim();

  // Check if the user wants to BUILD something
  const isCreate = CREATE_VERBS.test(q);
  
  if (isCreate) {
    // This is a build/create request → use local synthesizer
    let template: ProjectType = 'universal';
    let bestScore = 0;

    for (const entry of TEMPLATES) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (q.includes(kw)) score += kw.length;
      }
      if (score > bestScore && score > 3) {
        bestScore = score;
        template = entry.type;
      }
    }

    const context = extractContext(input);
    return { action: 'create', template, details: input.trim(), original: input, context, needsLLM: false };
  }

  // Everything else → send to Gemini LLM for a smart answer
  return { action: 'chat', details: input.trim(), original: input, needsLLM: true };
}

export function generateCreateResponse(type: ProjectType, context: ExtractedContext): string {
  const colorMap: Record<string, string> = {
    red: "merah terang", blue: "biru elegan", green: "hijau segar", yellow: "kuning cerah", purple: "ungu eksotis",
    brown: "coklat klasik", dark: "gelap modern", pink: "merah muda lembut", orange: "oranye dinamis"
  };
  const colorName = colorMap[context.themeColor] || "profesional";
  
  const typeStr = type === 'universal' ? "Aplikasi Kustom" : type === 'ecommerce' ? "Toko Online" : type === 'dashboard' ? "Dashboard Analitik" : type === 'lms' ? "Sistem Manajemen Pembelajaran" : "Aplikasi Pengelola Tugas";

  return `Saya memahami instruksi Anda dengan jelas. Berikut adalah analisis yang saya lakukan:\n\n**Jenis Proyek:** ${typeStr}\n**Topik Utama:** ${context.topic}\n**Skema Warna:** ${colorName}\n\nSaya akan segera memulai proses pembangunan — mulai dari perancangan arsitektur komponen, penerapan gaya visual, hingga penyusunan struktur data. Mohon tunggu sebentar.`;
}

// Fallback responses when no API key is configured
export function getFallbackResponse(input: string): string {
  const q = input.toLowerCase();
  
  if (/^(halo|hai|hi|hey|pagi|siang|sore|malam)[\s!.]*$/.test(q)) {
    return "Halo! Saya adalah AppForge AI, asisten kecerdasan buatan yang siap membantu Anda membangun aplikasi web apa pun.\n\n💡 **Catatan:** Untuk mendapatkan jawaban yang lebih mendalam dan kontekstual, Anda dapat menambahkan **API Key Gemini** melalui menu ⚙️ Pengaturan.";
  }
  if (q.includes('siapa') || q.includes('appforge')) {
    return "Saya adalah **AppForge AI**, sebuah sistem kecerdasan buatan yang dirancang untuk menjawab pertanyaan Anda dan membangun aplikasi web secara otomatis.\n\nSaat ini saya beroperasi dalam **Mode Lokal** karena API Gemini belum dikonfigurasi. Meskipun demikian, kemampuan pembangunan aplikasi saya tetap berfungsi sepenuhnya.\n\nSilakan coba instruksikan saya, misalnya: *\"Buatkan saya sebuah portofolio web dengan tema gelap\"*";
  }
  if (q.includes('react')) {
    return "**React** adalah pustaka JavaScript yang dikembangkan oleh Meta (sebelumnya Facebook) untuk membangun antarmuka pengguna. React menggunakan pendekatan berbasis komponen yang dapat digunakan ulang, serta memanfaatkan **Virtual DOM** untuk memastikan pembaruan tampilan berjalan secara efisien. Aplikasi AppForge AI yang sedang Anda gunakan ini juga dibangun menggunakan React. ⚛️";
  }
  if (q.includes('machine learning') || q.includes('ai') || q.includes('kecerdasan buatan')) {
    return "**Machine Learning (Pembelajaran Mesin)** adalah cabang dari kecerdasan buatan di mana sistem komputer belajar mengenali pola dari data, tanpa perlu diprogram secara eksplisit untuk setiap skenario. Alih-alih mengandalkan aturan kondisional yang kaku, model Machine Learning menganalisis data dalam jumlah besar untuk membangun pemahaman statistiknya sendiri.\n\nContoh penerapannya meliputi ChatGPT, pengenalan wajah, rekomendasi Spotify, hingga kendaraan otonom. 🧠";
  }
  if (q.includes('javascript') || q.includes('js')) {
    return "**JavaScript** adalah bahasa pemrograman inti untuk pengembangan web. Bersama dengan HTML dan CSS, JavaScript memungkinkan halaman web menjadi interaktif — mulai dari animasi, penanganan klik tombol, hingga pengolahan data secara dinamis. Pada perkembangan modern, JavaScript juga dapat berjalan di sisi server melalui lingkungan runtime seperti Node.js. 📛";
  }
  
  return "Saat ini, koneksi ke layanan Gemini AI sedang tidak tersedia. Namun, Anda tidak perlu khawatir — sistem **Pembangunan Aplikasi Lokal** saya tetap aktif dan berfungsi sepenuhnya.\n\nSilakan berikan instruksi untuk membangun sebuah aplikasi, misalnya: *\"Buatkan saya sebuah dashboard analitik dengan grafik penjualan\"*";
}
