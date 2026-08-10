/* ═══════════════════════════════════════════════════════════════
   Query Preprocessor — Input Normalization & Entity Extraction
   Normalizes user input before it enters the AI pipeline.
   ═══════════════════════════════════════════════════════════════ */

export interface ProcessedQuery {
  /** Cleaned, normalized version of the input */
  normalized: string;
  /** Original input, untouched */
  original: string;
  /** Main extracted keywords/topics */
  keywords: string[];
  /** Detected question type */
  questionType: QuestionType;
  /** The core subject the user is asking about */
  subject: string;
  /** Whether this looks like a follow-up to a previous message */
  isFollowUp: boolean;
  /** Language detected */
  language: 'id' | 'en' | 'mixed';
}

export type QuestionType =
  | 'definition'     // "apa itu X"
  | 'explanation'    // "jelaskan tentang X"
  | 'comparison'     // "perbedaan X dan Y"
  | 'howto'          // "bagaimana cara X"
  | 'identity'       // "siapa X"
  | 'opinion'        // "menurut kamu X"
  | 'list'           // "sebutkan X" / "apa saja X"
  | 'followup'       // "lanjutkan" / "jelaskan lebih lanjut"
  | 'greeting'       // "halo" / "hai"
  | 'create'         // "buatkan X"
  | 'general';       // everything else

// ── Abbreviation Expansion Map ─────────────────────────────────
const ABBREVIATIONS: Record<string, string> = {
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'rb': 'ruby',
  'db': 'database',
  'env': 'environment variable',
  'api': 'api',
  'ui': 'user interface',
  'ux': 'user experience',
  'css': 'css',
  'html': 'html',
  'ml': 'machine learning',
  'ai': 'artificial intelligence',
  'dl': 'deep learning',
  'oop': 'object oriented programming',
  'fp': 'functional programming',
  'os': 'operating system',
  'vps': 'virtual private server',
  'cdn': 'content delivery network',
  'ci': 'continuous integration',
  'cd': 'continuous deployment',
  'devops': 'devops',
  'k8s': 'kubernetes',
  'npm': 'npm',
  'cli': 'command line interface',
  'gui': 'graphical user interface',
  'ide': 'integrated development environment',
  'sdk': 'software development kit',
  'seo': 'search engine optimization',
  'ssr': 'server side rendering',
  'ssg': 'static site generation',
  'spa': 'single page application',
  'pwa': 'progressive web app',
  'orm': 'object relational mapping',
  'mvc': 'model view controller',
  'jwt': 'json web token',
  'dns': 'domain name system',
  'ssl': 'ssl',
  'tls': 'tls',
  'tcp': 'tcp',
  'ip': 'internet protocol',
  'http': 'http',
  'https': 'https',
  'sql': 'sql',
  'nosql': 'nosql',
  'crud': 'create read update delete',
  'rest': 'rest api',
  'gpu': 'graphics processing unit',
  'cpu': 'central processing unit',
  'ram': 'random access memory',
  'ssd': 'solid state drive',
  'hdd': 'hard disk drive',
};

// ── Common Typo Corrections ────────────────────────────────────
const TYPO_MAP: Record<string, string> = {
  'needjs': 'nodejs',
  'nodjs': 'nodejs',
  'reactjs': 'react',
  'javscript': 'javascript',
  'javasript': 'javascript',
  'javascrip': 'javascript',
  'javascrit': 'javascript',
  'typescrip': 'typescript',
  'typesript': 'typescript',
  'pytho': 'python',
  'pyton': 'python',
  'phyton': 'python',
  'larave': 'laravel',
  'laravell': 'laravel',
  'larvael': 'laravel',
  'boostrap': 'bootstrap',
  'bootrap': 'bootstrap',
  'tailwnd': 'tailwind',
  'tailwindd': 'tailwind',
  'angualr': 'angular',
  'agular': 'angular',
  'veu': 'vue',
  'fluter': 'flutter',
  'fltter': 'flutter',
  'mongdb': 'mongodb',
  'monggodb': 'mongodb',
  'postgressql': 'postgresql',
  'postgre': 'postgresql',
  'msql': 'mysql',
  'mysqll': 'mysql',
  'expres': 'express',
  'expresss': 'express',
  'ngnix': 'nginx',
  'ngix': 'nginx',
  'ubunt': 'ubuntu',
  'ubutu': 'ubuntu',
  'kuberntes': 'kubernetes',
  'kubenetes': 'kubernetes',
  'doker': 'docker',
  'dokcer': 'docker',
  'pemrogramman': 'pemrograman',
  'pemograman': 'pemrograman',
  'programing': 'programming',
  'programmin': 'programming',
  'progaming': 'programming',
  'algoritm': 'algoritma',
  'algortima': 'algoritma',
  'machne': 'machine',
  'machin': 'machine',
  'inteligence': 'intelligence',
  'artficial': 'artificial',
  'databse': 'database',
  'datbase': 'database',
  'framwork': 'framework',
  'framewok': 'framework',
  'librry': 'library',
  'libary': 'library',
  'kompuer': 'komputer',
  'komuter': 'komputer',
  'intrnet': 'internet',
  'interntet': 'internet',
  'teknolgi': 'teknologi',
  'teknoogi': 'teknologi',
};

// ── Question Type Detection Patterns ───────────────────────────
const QUESTION_PATTERNS: { type: QuestionType; patterns: RegExp[] }[] = [
  {
    type: 'definition',
    patterns: [
      /^apa\s+(itu|yang dimaksud|sih|artinya|arti|pengertian)\b/i,
      /^(pengertian|definisi|arti)\s+(dari\s+)?/i,
      /\bapa\s+itu\b/i,
      /^what\s+is\b/i,
    ]
  },
  {
    type: 'explanation',
    patterns: [
      /^(jelaskan|ceritakan|terangkan|uraikan|deskripsikan)\s+(tentang\s+)?/i,
      /^(explain|describe|tell me about)\b/i,
      /^(bisa|boleh|tolong)\s+(jelaskan|ceritakan)/i,
    ]
  },
  {
    type: 'comparison',
    patterns: [
      /\b(perbedaan|beda(nya)?|perbandingan|bandingkan)\b.*\b(dan|dengan|vs|sama|atau)\b/i,
      /\b(compare|difference|versus)\b/i,
      /\bvs\.?\b/i,
    ]
  },
  {
    type: 'howto',
    patterns: [
      /^(bagaimana|gimana|caranya|cara)\s+(cara\s+)?(untuk\s+)?/i,
      /^(how\s+to|how\s+do|how\s+can)\b/i,
      /\bcaranya\b/i,
    ]
  },
  {
    type: 'identity',
    patterns: [
      /^siapa(kah)?\s+(itu\s+)?/i,
      /^who\s+is\b/i,
    ]
  },
  {
    type: 'list',
    patterns: [
      /^(sebutkan|apa saja|list(kan)?|berikan contoh)\b/i,
      /^(list|name|enumerate)\b/i,
    ]
  },
  {
    type: 'followup',
    patterns: [
      /^(lanjutkan|lanjut|teruskan|jelaskan lebih|lebih detail|lebih lanjut|contohnya|misalnya|elaborasi|bisa lebih|maksudnya|expand)/i,
      /^(continue|go on|more detail|elaborate|example)\b/i,
      /^(terus|lalu|kemudian|selanjutnya)\b/i,
    ]
  },
  {
    type: 'greeting',
    patterns: [
      /^(halo|hai|hi|hey|hello|hallo|pagi|siang|sore|malam|selamat|p|woi|yo)\s*[!.?]?$/i,
    ]
  },
  {
    type: 'create',
    patterns: [
      /\b(buat|bikin|buatkan|bikinkan|bangun|create|build|make|generate|bikinin)\b/i,
    ]
  },
];

// ── Follow-Up Detection ────────────────────────────────────────
const FOLLOWUP_INDICATORS = [
  'lanjutkan', 'lanjut', 'teruskan', 'terus', 'lalu',
  'jelaskan lebih', 'lebih detail', 'lebih lanjut',
  'contohnya', 'misalnya', 'contoh',
  'maksudnya', 'maksudmu', 'artinya',
  'kenapa', 'mengapa', 'alasannya',
  'gimana', 'bagaimana',
  'iya', 'ya', 'betul', 'benar',
  'oke', 'ok', 'okee',
  'selanjutnya', 'kemudian',
  'elaborate', 'continue', 'go on', 'more',
  'bisa lebih', 'expand', 'detail',
];

// ── Stopwords for Subject Extraction ───────────────────────────
const EXTRACTION_STOPWORDS = new Set([
  'apa', 'itu', 'yang', 'dimaksud', 'dengan', 'tentang', 'dari',
  'adalah', 'merupakan', 'sih', 'dong', 'ya', 'kan', 'tuh', 'nih',
  'bisa', 'boleh', 'tolong', 'jelaskan', 'ceritakan', 'sebutkan',
  'bagaimana', 'gimana', 'cara', 'caranya', 'untuk',
  'siapa', 'siapakah', 'di', 'ke', 'dan', 'atau', 'saya', 'aku',
  'kamu', 'kita', 'mereka', 'dia', 'ini', 'mau', 'ingin', 'pengen',
  'the', 'is', 'what', 'how', 'who', 'a', 'an', 'of', 'in', 'on',
  'it', 'tell', 'me', 'about', 'explain', 'describe', 'please',
]);

// ═══════════════════════════════════════════════════════════════
// Main Preprocessing Function
// ═══════════════════════════════════════════════════════════════

export function preprocessQuery(input: string): ProcessedQuery {
  const original = input;
  let text = input.trim();

  // Step 1: Basic normalization
  text = text.toLowerCase();
  text = text.replace(/[!]{2,}/g, '!');
  text = text.replace(/[?]{2,}/g, '?');
  text = text.replace(/[.]{3,}/g, '...');

  // Step 2: Apply typo corrections
  const words = text.split(/\s+/);
  const correctedWords = words.map(w => {
    const clean = w.replace(/[?.,!'"]/g, '');
    if (TYPO_MAP[clean]) {
      return w.replace(clean, TYPO_MAP[clean]);
    }
    return w;
  });
  text = correctedWords.join(' ');

  // Step 3: Expand standalone abbreviations (only if the word IS the abbreviation)
  const expandedWords = text.split(/\s+/).map(w => {
    const clean = w.replace(/[?.,!'"]/g, '');
    // Only expand if it's a standalone abbreviation AND it's short (≤4 chars)
    // Don't expand words that are already meaningful
    if (ABBREVIATIONS[clean] && clean.length <= 4 && clean !== ABBREVIATIONS[clean]) {
      return ABBREVIATIONS[clean];
    }
    return w;
  });
  const normalized = expandedWords.join(' ');

  // Step 4: Detect question type
  const questionType = detectQuestionType(normalized);

  // Step 5: Extract subject/keywords
  const keywords = extractKeywords(normalized);
  const subject = extractSubject(normalized, questionType);

  // Step 6: Detect follow-up
  const isFollowUp = detectFollowUp(normalized);

  // Step 7: Detect language
  const language = detectLanguage(normalized);

  return {
    normalized,
    original,
    keywords,
    questionType,
    subject,
    isFollowUp,
    language,
  };
}

// ── Helper Functions ───────────────────────────────────────────

function detectQuestionType(text: string): QuestionType {
  for (const { type, patterns } of QUESTION_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(text)) return type;
    }
  }
  return 'general';
}

function extractKeywords(text: string): string[] {
  const words = text
    .replace(/[?.,!'"()[\]{}]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !EXTRACTION_STOPWORDS.has(w));

  // Deduplicate while preserving order
  return [...new Set(words)];
}

function extractSubject(text: string, questionType: QuestionType): string {
  let cleaned = text;

  // Remove question-type prefixes to isolate the subject
  const prefixPatterns: RegExp[] = [
    /^apa\s+(itu|yang dimaksud dengan|sih|artinya)\s+/i,
    /^(pengertian|definisi|arti)\s+(dari\s+)?/i,
    /^(jelaskan|ceritakan|terangkan)\s+(tentang\s+)?/i,
    /^siapa(kah)?\s+(itu\s+)?/i,
    /^(bagaimana|gimana)\s+(cara(nya)?\s+)?(untuk\s+)?/i,
    /^(bisa|boleh|tolong)\s+(jelaskan|ceritakan)\s+(tentang\s+)?/i,
    /^(what|who)\s+(is|are)\s+/i,
    /^(how\s+to|how\s+do\s+(i|you))\s+/i,
    /^(explain|describe|tell\s+me\s+about)\s+/i,
  ];

  for (const pattern of prefixPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Remove trailing punctuation
  cleaned = cleaned.replace(/[?!.]+$/, '').trim();

  // If the subject is empty after cleaning, return the keywords joined
  if (!cleaned || cleaned.length < 2) {
    const kw = extractKeywords(text);
    return kw.join(' ') || text.trim();
  }

  return cleaned;
}

function detectFollowUp(text: string): boolean {
  const lower = text.toLowerCase().trim();

  // Very short messages are likely follow-ups
  if (lower.length < 15) {
    for (const indicator of FOLLOWUP_INDICATORS) {
      if (lower.includes(indicator)) return true;
    }
  }

  // Pronoun-heavy start without a clear topic = follow-up
  if (/^(itu|dia|mereka|nya|tersebut)\b/.test(lower)) return true;

  // Direct follow-up markers
  for (const indicator of FOLLOWUP_INDICATORS) {
    if (lower.startsWith(indicator)) return true;
  }

  return false;
}

function detectLanguage(text: string): 'id' | 'en' | 'mixed' {
  const idIndicators = ['apa', 'itu', 'yang', 'dan', 'dari', 'untuk', 'dengan', 'adalah', 'atau', 'ini', 'bisa'];
  const enIndicators = ['the', 'is', 'what', 'how', 'and', 'for', 'with', 'this', 'that', 'are'];

  const words = text.toLowerCase().split(/\s+/);
  let idScore = 0;
  let enScore = 0;

  for (const w of words) {
    if (idIndicators.includes(w)) idScore++;
    if (enIndicators.includes(w)) enScore++;
  }

  if (idScore > 0 && enScore > 0) return 'mixed';
  if (enScore > idScore) return 'en';
  return 'id';
}
