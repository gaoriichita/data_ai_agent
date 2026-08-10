/* ═══════════════════════════════════════════════════════════════
   Project Engine — Core types, state, and project management
   ═══════════════════════════════════════════════════════════════ */

// ── Types ─────────────────────────────────────────────────────

export interface ProjectFile {
  path: string;
  name: string;
  content: string;
  language: string;
  isDirectory: boolean;
  children?: ProjectFile[];
}

export type ProjectType = 'todo' | 'ecommerce' | 'lms' | 'dashboard' | 'universal';
export type BuildStatus = 'idle' | 'analyzing' | 'planning' | 'generating' | 'building' | 'testing' | 'running' | 'complete' | 'error';

export interface BuildStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  detail?: string;
}

export interface ExtractedContext {
  topic: string;
  themeColor: string;
  features: string[];
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  description: string;
  context?: ExtractedContext;
  files: ProjectFile[];
  buildStatus: BuildStatus;
  buildSteps: BuildStep[];
  createdAt: Date;
  features: string[];
}

// ── Build Steps Template ──────────────────────────────────────

export function createBuildSteps(projectName: string): BuildStep[] {
  return [
    { id: 'analyze', label: 'Analyzing requirements', status: 'pending' },
    { id: 'plan', label: 'Planning architecture', status: 'pending' },
    { id: 'generate', label: `Generating ${projectName}`, status: 'pending' },
    { id: 'build', label: 'Building application', status: 'pending' },
    { id: 'test', label: 'Testing functionality', status: 'pending' },
    { id: 'run', label: 'Starting preview server', status: 'pending' },
  ];
}

// ── File tree builder ─────────────────────────────────────────

export function buildFileTree(files: ProjectFile[]): ProjectFile[] {
  const root: ProjectFile[] = [];
  const dirs = new Map<string, ProjectFile>();

  // Sort so directories come first
  const sorted = [...files].sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.path.localeCompare(b.path);
  });

  for (const file of sorted) {
    const parts = file.path.split('/');
    if (parts.length === 1) {
      root.push(file);
      if (file.isDirectory) dirs.set(file.path, file);
    } else {
      const parentPath = parts.slice(0, -1).join('/');
      const parent = dirs.get(parentPath);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(file);
        if (file.isDirectory) dirs.set(file.path, file);
      } else {
        root.push(file);
      }
    }
  }

  return root;
}

// ── Language detection ────────────────────────────────────────

export function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const map: Record<string, string> = {
    tsx: 'TypeScript React',
    ts: 'TypeScript',
    jsx: 'JavaScript React',
    js: 'JavaScript',
    css: 'CSS',
    html: 'HTML',
    json: 'JSON',
    md: 'Markdown',
    sql: 'SQL',
    env: 'Environment',
    yml: 'YAML',
    yaml: 'YAML',
  };
  return map[ext] || 'Text';
}

// ── File icon ─────────────────────────────────────────────────

export function getFileIcon(filename: string, isDir: boolean): string {
  if (isDir) return '📁';
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const icons: Record<string, string> = {
    tsx: '⚛️',
    ts: '🔷',
    jsx: '⚛️',
    js: '🟨',
    css: '🎨',
    html: '🌐',
    json: '📋',
    md: '📝',
    sql: '🗄️',
    env: '🔒',
    svg: '🖼️',
  };
  return icons[ext] || '📄';
}

// ── Project metadata helpers ──────────────────────────────────

export function getProjectDisplayName(type: ProjectType): string {
  const names: Record<ProjectType, string> = {
    todo: 'Todo Application',
    ecommerce: 'E-Commerce Store',
    lms: 'Learning Management System',
    dashboard: 'Analytics Dashboard',
    universal: 'Universal Application',
  };
  return names[type];
}

export function getProjectFeatures(type: ProjectType): string[] {
  const features: Record<ProjectType, string[]> = {
    todo: [
      'Add, edit, delete tasks',
      'Mark tasks complete',
      'Category filtering',
      'Priority levels',
      'Due dates',
      'Search functionality',
      'Responsive design',
    ],
    ecommerce: [
      'Product catalog with grid view',
      'Shopping cart',
      'Product categories & filtering',
      'Search functionality',
      'Checkout flow',
      'Admin dashboard',
      'Order management',
      'Responsive design',
    ],
    lms: [
      'Student management',
      'Course catalog',
      'Grade tracking',
      'Assignment submission',
      'Teacher dashboard',
      'Role-based access',
      'Search & filter students',
      'Responsive design',
    ],
    dashboard: [
      'Interactive charts (Bar, Line, Pie)',
      'Real-time data simulation',
      'KPI summary cards',
      'Data table with filtering',
      'Export functionality',
      'Responsive grid layout',
      'Dark mode UI',
    ],
    universal: [
      'Dynamic Core Framework',
      'Custom Context Injection',
      'Universal Layout System',
      'Adaptive Styling'
    ],
  };
  return features[type];
}
