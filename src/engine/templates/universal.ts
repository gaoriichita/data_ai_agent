/* Universal Template Synthesizer */
import type { ProjectFile, ExtractedContext } from '../projectEngine';

export function generateUniversalFiles(context?: ExtractedContext): ProjectFile[] {
  const topic = context?.topic || "Aplikasi Kustom";
  const color = context?.themeColor || "dark";

  // Dynamic CSS Variables
  const colorMap: any = {
    red: { p: '#ef4444', h: '#dc2626' },
    blue: { p: '#3b82f6', h: '#2563eb' },
    green: { p: '#22c55e', h: '#16a34a' },
    yellow: { p: '#eab308', h: '#ca8a04' },
    purple: { p: '#a855f7', h: '#9333ea' },
    brown: { p: '#8b5a2b', h: '#5c4033' },
    dark: { p: '#27272a', h: '#18181b' },
    pink: { p: '#ec4899', h: '#db2777' },
    orange: { p: '#f97316', h: '#ea580c' },
  };
  const c = colorMap[color] || colorMap.dark;

  // Generate dynamic sections based on features
  const subFeatures = context?.features || [];
  const featureBlocks = subFeatures.slice(0, 3).map(feat => {
    const fTitle = feat.charAt(0).toUpperCase() + feat.slice(1);
    return `
      <div className="feature-card">
        <div className="feat-icon">✨</div>
        <h3>Modul ${fTitle}</h3>
        <p>Sistem ini telah dikonfigurasi untuk mendukung fitur ${feat} secara terintegrasi.</p>
      </div>`;
  }).join('');

  return [
    { path: 'src', name: 'src', content: '', language: '', isDirectory: true },
    {
      path: 'package.json', name: 'package.json', isDirectory: false, language: 'JSON',
      content: `{\n  "name": "universal-app",\n  "version": "1.0.0",\n  "dependencies": { "react": "^19.0.0" }\n}`,
    },
    {
      path: 'src/App.tsx', name: 'App.tsx', isDirectory: false, language: 'TypeScript React',
      content: `import './App.css';

export default function App() {
  return (
    <div className="app-shell">
      <header className="hero-header">
        <nav className="navbar">
          <div className="nav-logo">
            <span className="logo-icon">🚀</span>
            <strong>${topic}</strong>
          </div>
          <div className="nav-menu">
            <a href="#">Beranda</a>
            <a href="#">Fitur</a>
            <a href="#">Tentang</a>
            <button className="cta-btn">Mulai Sekarang</button>
          </div>
        </nav>
        
        <div className="hero-content">
          <h1>Sistem Terpadu untuk <br/><span className="highlight">${topic}</span></h1>
          <p>Aplikasi web modern yang dirakit khusus untuk kebutuhan Anda. Cepat, responsif, dan elegan.</p>
          <div className="hero-actions">
            <button className="primary-btn">Pelajari Lebih Lanjut</button>
            <button className="secondary-btn">Hubungi Kami</button>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="section-title">
          <h2>Fitur Unggulan</h2>
          <p>Didesain secara spesifik untuk mendukung ekosistem ${topic}.</p>
        </div>
        
        <div className="features-grid">
          ${featureBlocks || `
          <div className="feature-card">
            <div className="feat-icon">⚡</div>
            <h3>Performa Tinggi</h3>
            <p>Dibuat menggunakan React dan arsitektur modern yang ringan dan cepat.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon">🔒</div>
            <h3>Keamanan Data</h3>
            <p>Standar keamanan mutakhir untuk melindungi semua informasi Anda.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon">📱</div>
            <h3>Desain Responsif</h3>
            <p>Tampilan yang sempurna baik di perangkat desktop maupun seluler.</p>
          </div>
          `}
        </div>
      </main>
      
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} ${topic} Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}`,
    },
    {
      path: 'src/App.css', name: 'App.css', isDirectory: false, language: 'CSS',
      content: `:root {
  --primary: ${c.p};
  --primary-hover: ${c.h};
  --bg-main: #f8fafc;
  --bg-card: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
}

body {
  margin: 0; font-family: 'Inter', sans-serif;
  background: var(--bg-main); color: var(--text-main);
}

.app-shell { display: flex; flex-direction: column; min-height: 100vh; }

.hero-header {
  background: linear-gradient(135deg, var(--bg-card) 0%, #f1f5f9 100%);
  padding: 0 48px 80px; border-bottom: 1px solid #e2e8f0;
}

.navbar { display: flex; justify-content: space-between; align-items: center; padding: 24px 0; }
.nav-logo { display: flex; align-items: center; gap: 12px; font-size: 20px; color: var(--primary); }
.logo-icon { font-size: 28px; }
.nav-menu { display: flex; gap: 32px; align-items: center; }
.nav-menu a { text-decoration: none; color: var(--text-muted); font-weight: 500; transition: 0.2s; }
.nav-menu a:hover { color: var(--primary); }
.cta-btn { background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.cta-btn:hover { background: var(--primary-hover); transform: translateY(-2px); }

.hero-content { max-width: 800px; margin: 80px auto 0; text-align: center; }
.hero-content h1 { font-size: 56px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; color: #1e293b; letter-spacing: -0.03em; }
.highlight { color: var(--primary); }
.hero-content p { font-size: 20px; color: var(--text-muted); margin-bottom: 40px; line-height: 1.6; }
.hero-actions { display: flex; gap: 16px; justify-content: center; }
.primary-btn { background: var(--primary); color: white; border: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.2s; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
.primary-btn:hover { background: var(--primary-hover); transform: translateY(-3px); }
.secondary-btn { background: white; color: var(--text-main); border: 2px solid #e2e8f0; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.secondary-btn:hover { border-color: var(--primary); color: var(--primary); }

.main-content { max-width: 1200px; margin: 0 auto; padding: 80px 48px; flex: 1; }
.section-title { text-align: center; margin-bottom: 64px; }
.section-title h2 { font-size: 36px; font-weight: 800; margin-bottom: 16px; }
.section-title p { font-size: 18px; color: var(--text-muted); }

.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
.feature-card { background: var(--bg-card); padding: 40px; border-radius: 24px; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05); transition: 0.3s; border: 1px solid #f1f5f9; }
.feature-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); border-color: var(--primary); }
.feat-icon { font-size: 40px; margin-bottom: 24px; display: inline-block; padding: 16px; background: #f8fafc; border-radius: 16px; }
.feature-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #1e293b; }
.feature-card p { color: var(--text-muted); line-height: 1.6; }

.footer { text-align: center; padding: 40px; border-top: 1px solid #e2e8f0; color: var(--text-muted); font-size: 14px; }
`,
    },
  ];
}
