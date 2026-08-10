/* Dashboard Template */
import type { ProjectFile } from '../projectEngine';

export function generateDashboardFiles(): ProjectFile[] {
  return [
    { path: 'src', name: 'src', content: '', language: '', isDirectory: true },
    { path: 'src/components', name: 'components', content: '', language: '', isDirectory: true },
    {
      path: 'package.json', name: 'package.json', isDirectory: false, language: 'JSON',
      content: `{\n  "name": "analytics-dashboard",\n  "version": "1.0.0",\n  "dependencies": { "react": "^19.0.0" }\n}`,
    },
    {
      path: 'src/App.tsx', name: 'App.tsx', isDirectory: false, language: 'TypeScript React',
      content: `import { useEffect, useState } from 'react';
import KPICards from './components/KPICards';
import SalesChart from './components/SalesChart';
import CategoryPanel from './components/CategoryPanel';
import './App.css';

export default function App() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className={\`dashboard \${mounted ? 'mounted' : ''}\`}>
      <header className="dash-header">
        <div>
          <h1>📈 Executive Analytics Dashboard</h1>
          <div className="status-badges">
            <span className="badge-live">● Live Data connected</span>
            <span className="last-updated">Last updated: Just now</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Export PDF</button>
          <button className="btn-primary">Share View</button>
        </div>
      </header>

      <KPICards />
      
      <div className="grid-layout">
        <SalesChart />
        <CategoryPanel />
      </div>
    </div>
  );
}`,
    },
    {
      path: 'src/components/KPICards.tsx', name: 'KPICards.tsx', isDirectory: false, language: 'TypeScript React',
      content: `const KPIS = [
  { t: 'Total Revenue', v: 'Rp 847.2M', c: '+12.5%', isUp: true, icon: '💵' },
  { t: 'Active Orders', v: '2,847', c: '+8.2%', isUp: true, icon: '📦' },
  { t: 'Customer Growth', v: '1,294', c: '+15.4%', isUp: true, icon: '👥' },
  { t: 'Bounce Rate', v: '24.1%', c: '-2.4%', isUp: false, icon: '📉' }
];

export default function KPICards() {
  return (
    <div className="kpi-grid">
      {KPIS.map((k, i) => (
        <div key={k.t} className="kpi-card" style={{ animationDelay: \`\${i * 0.1}s\` }}>
          <div className="kpi-header">
            <span className="kpi-title">{k.t}</span>
            <span className="kpi-icon">{k.icon}</span>
          </div>
          <div className="kpi-value">{k.v}</div>
          <div className="kpi-meta">
            <span className={\`kpi-change \${k.isUp ? 'up' : 'down'}\`}>
              {k.isUp ? '↑' : '↓'} {k.c}
            </span>
            <span className="kpi-compare">vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}`,
    },
    {
      path: 'src/components/SalesChart.tsx', name: 'SalesChart.tsx', isDirectory: false, language: 'TypeScript React',
      content: `const DATA = [45, 60, 48, 85, 65, 95, 75];
const LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function SalesChart() {
  return (
    <div className="panel chart-panel">
      <div className="panel-header">
        <h3>Revenue Overview</h3>
        <select className="date-select">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>
      
      <div className="chart-container">
        <div className="grid-lines">
          {[...Array(5)].map((_, i) => <div key={i} className="grid-line" />)}
        </div>

        {DATA.map((h, i) => (
          <div key={i} className="chart-col">
            <div className="bar-wrapper">
              <div className="bar" style={{ height: \`\${h}%\` }} />
            </div>
            <div className="chart-label">{LABELS[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    },
    {
      path: 'src/components/CategoryPanel.tsx', name: 'CategoryPanel.tsx', isDirectory: false, language: 'TypeScript React',
      content: `const CATS = [
  { n: 'Electronics', v: 45, c: '#B68D40' },
  { n: 'Furniture', v: 30, c: '#4caf50' },
  { n: 'Software', v: 15, c: '#2196f3' },
  { n: 'Accessories', v: 10, c: '#9c27b0' }
];

export default function CategoryPanel() {
  return (
    <div className="panel cat-panel">
      <h3>Top Categories</h3>
      <div className="cat-list">
        {CATS.map(cat => (
          <div key={cat.n} className="cat-item">
            <div className="cat-header">
              <span>{cat.n}</span>
              <span className="cat-val">{cat.v}%</span>
            </div>
            <div className="cat-track">
              <div className="cat-fill" style={{ width: \`\${cat.v}%\`, background: cat.c }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    },
    {
      path: 'src/App.css', name: 'App.css', isDirectory: false, language: 'CSS',
      content: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

:root {
  --bg: #060d13;
  --bg-gradient: radial-gradient(circle at top left, #0e1e27, #060d13);
  --panel-bg: rgba(255,255,255,0.02);
  --panel-border: rgba(255,255,255,0.05);
  --text-main: #fff;
  --text-muted: #8fa3b0;
  --accent: #B68D40;
  --green: #4caf50;
  --red: #f44336;
}

body {
  margin: 0;
  background: var(--bg-gradient);
  color: var(--text-main);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.dashboard { padding: 32px; opacity: 0; transition: opacity 0.6s ease; }
.dashboard.mounted { opacity: 1; }

.dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 1px solid var(--panel-border); }
.dash-header h1 { margin: 0 0 8px 0; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }

.status-badges { display: flex; gap: 12px; align-items: center; }
.badge-live { background: rgba(76, 175, 80, 0.1); color: var(--green); padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.last-updated { color: #6b8299; font-size: 13px; }

.header-actions { display: flex; gap: 12px; }
.btn-secondary { background: #132836; color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; }
.btn-primary { background: var(--accent); color: #000; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; }

.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
.kpi-card { background: var(--panel-bg); border: 1px solid var(--panel-border); padding: 24px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); backdrop-filter: blur(10px); animation: slideUp 0.5s ease forwards; opacity: 0; transform: translateY(10px); }
.kpi-header { display: flex; justify-content: space-between; margin-bottom: 16px; }
.kpi-title { color: var(--text-muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
.kpi-icon { font-size: 16px; }
.kpi-value { font-size: 28px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.02em; }
.kpi-meta { display: flex; alignItems: center; gap: 6px; font-size: 13px; }
.kpi-change { padding: 2px 6px; border-radius: 4px; font-weight: 600; }
.kpi-change.up { color: var(--green); background: rgba(76,175,80,0.1); }
.kpi-change.down { color: var(--red); background: rgba(244,67,54,0.1); }
.kpi-compare { color: #5b7185; }

.grid-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px; }
.panel { background: var(--panel-bg); border: 1px solid var(--panel-border); padding: 24px; border-radius: 16px; animation: slideUp 0.5s ease forwards 0.4s; opacity: 0; }

.chart-panel .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.panel h3 { margin: 0; font-size: 15px; font-weight: 600; color: #e0e7ed; }
.date-select { background: #132836; color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 6px; outline: none; }

.chart-container { height: 240px; display: flex; align-items: flex-end; gap: 3%; position: relative; }
.grid-lines { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; opacity: 0.1; pointer-events: none; z-index: 0; }
.grid-line { height: 1px; background: #fff; width: 100%; }

.chart-col { flex: 1; position: relative; height: 100%; display: flex; align-items: flex-end; z-index: 1; }
.bar-wrapper { width: 100%; height: 100%; display: flex; align-items: flex-end; }
.bar { width: 100%; background: linear-gradient(180deg, var(--accent) 0%, rgba(182, 141, 64, 0.2) 100%); border-radius: 6px 6px 0 0; transition: all 0.3s ease; border-top: 2px solid #ffcc66; }
.bar:hover { filter: brightness(1.2); transform: scaleY(1.02); transform-origin: bottom; }
.chart-label { position: absolute; bottom: -25px; width: 100%; text-align: center; color: #6b8299; font-size: 12px; }

.cat-panel { animation-delay: 0.5s; }
.cat-list { display: flex; flex-direction: column; gap: 20px; margin-top: 24px; }
.cat-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: #e0e7ed; }
.cat-val { font-weight: 600; }
.cat-track { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
.cat-fill { height: 100%; border-radius: 3px; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}`,
    },
  ];
}
