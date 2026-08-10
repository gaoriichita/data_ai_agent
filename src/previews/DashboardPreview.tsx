import { useEffect, useState } from 'react';

interface Props {
  description?: string;
}

export default function DashboardPreview({ description }: Props) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use the user's prompt to slightly change the title or theme to make it feel "dynamic"
  const title = description && description.toLowerCase().includes('penjualan') 
    ? '📈 Sales & Revenue Analytics' 
    : '📊 Executive Analytics Dashboard';

  return (
    <div style={{ 
      padding: '24px 32px', 
      fontFamily: "'Inter', sans-serif", 
      color: '#fff', 
      background: 'radial-gradient(circle at top left, #0e1e27, #060d13)', 
      minHeight: '100%',
      transition: 'opacity 0.6s ease',
      opacity: mounted ? 1 : 0
    }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 32,
        paddingBottom: 16,
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</h1>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ 
              background: 'rgba(76, 175, 80, 0.1)', 
              color: '#4caf50', 
              padding: '4px 10px', 
              borderRadius: 20, 
              fontSize: 11, 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              ● Live Data connected
            </span>
            <span style={{ color: '#6b8299', fontSize: 13 }}>Last updated: Just now</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ background: '#132836', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Export PDF</button>
          <button style={{ background: '#B68D40', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Share View</button>
        </div>
      </header>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        {[
          { t: 'Total Revenue', v: 'Rp 847.2M', c: '+12.5%', isUp: true, icon: '💵' },
          { t: 'Active Orders', v: '2,847', c: '+8.2%', isUp: true, icon: '📦' },
          { t: 'Customer Growth', v: '1,294', c: '+15.4%', isUp: true, icon: '👥' },
          { t: 'Bounce Rate', v: '24.1%', c: '-2.4%', isUp: false, icon: '📉' }
        ].map((k, i) => (
          <div key={k.t} style={{ 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.05)',
            padding: 24, 
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.2s ease',
            cursor: 'default',
            animation: `slideUp 0.5s ease forwards ${i * 0.1}s`,
            opacity: 0,
            transform: 'translateY(10px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ color: '#8fa3b0', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{k.t}</div>
              <div style={{ fontSize: 16 }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>{k.v}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <span style={{ 
                color: k.isUp ? '#4caf50' : '#f44336', 
                background: k.isUp ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
                padding: '2px 6px',
                borderRadius: 4,
                fontWeight: 600
              }}>{k.isUp ? '↑' : '↓'} {k.c}</span>
              <span style={{ color: '#5b7185' }}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Main Chart Area */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)',
          padding: 24, 
          borderRadius: 16,
          animation: 'slideUp 0.5s ease forwards 0.4s',
          opacity: 0
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#e0e7ed' }}>Revenue Overview</h3>
            <select style={{ background: '#132836', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 6, outline: 'none' }}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div style={{ height: 240, display: 'flex', alignItems: 'flex-end', gap: '3%', position: 'relative' }}>
            {/* Grid lines */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 0, opacity: 0.1, pointerEvents: 'none' }}>
              {[...Array(5)].map((_, i) => <div key={i} style={{ height: 1, background: '#fff', width: '100%' }} />)}
            </div>

            {[45, 60, 48, 85, 65, 95, 75].map((h, i) => (
              <div key={i} style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', zIndex: 1 }}>
                <div style={{ 
                  width: '100%', 
                  background: `linear-gradient(180deg, #B68D40 0%, rgba(182, 141, 64, 0.2) 100%)`, 
                  height: `${h}%`, 
                  borderRadius: '6px 6px 0 0',
                  transition: 'all 0.3s ease',
                  borderTop: '2px solid #ffcc66'
                }} className="bar-hover" />
                <div style={{ position: 'absolute', bottom: -25, width: '100%', textAlign: 'center', color: '#6b8299', fontSize: 12 }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)',
          padding: 24, 
          borderRadius: 16,
          animation: 'slideUp 0.5s ease forwards 0.5s',
          opacity: 0
        }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: 15, fontWeight: 600, color: '#e0e7ed' }}>Top Categories</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { n: 'Electronics', v: 45, c: '#B68D40' },
              { n: 'Furniture', v: 30, c: '#4caf50' },
              { n: 'Software', v: 15, c: '#2196f3' },
              { n: 'Accessories', v: 10, c: '#9c27b0' }
            ].map(cat => (
              <div key={cat.n}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#e0e7ed' }}>{cat.n}</span>
                  <span style={{ fontWeight: 600 }}>{cat.v}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${cat.v}%`, background: cat.c, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bar-hover:hover {
          filter: brightness(1.2);
          transform: scaleY(1.02);
          transform-origin: bottom;
        }
      `}} />
    </div>
  );
}
