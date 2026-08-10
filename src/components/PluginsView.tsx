import { useState, useEffect } from 'react';

interface PluginState {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const DEFAULT_PLUGINS: PluginState[] = [
  {
    id: 'gemini',
    title: 'Gemini AI Engine',
    description: 'Menghubungkan aplikasi ke server Google Gemini untuk pemrosesan kecerdasan buatan tingkat lanjut.',
    enabled: true,
  },
  {
    id: 'local_brain',
    title: 'Local Brain (Offline)',
    description: 'Pengetahuan bawaan sistem untuk menjawab pertanyaan dasar pemrograman tanpa koneksi internet.',
    enabled: true,
  },
  {
    id: 'wiki_search',
    title: 'Wikipedia Search',
    description: 'Mengizinkan AI untuk mencari informasi ensiklopedia terbaru dari internet saat menjawab.',
    enabled: true,
  }
];

export const getPlugins = (): PluginState[] => {
  try {
    const data = localStorage.getItem('appforge_plugins');
    if (data) {
      const parsed = JSON.parse(data);
      // Merge with default to ensure all exist
      return DEFAULT_PLUGINS.map(p => {
        const existing = parsed.find((ep: any) => ep.id === p.id);
        return existing ? existing : p;
      });
    }
  } catch (e) { }
  return DEFAULT_PLUGINS;
};

export const savePlugins = (plugins: PluginState[]) => {
  localStorage.setItem('appforge_plugins', JSON.stringify(plugins));
};

export default function PluginsView() {
  const [plugins, setPlugins] = useState<PluginState[]>([]);

  useEffect(() => {
    setPlugins(getPlugins());
  }, []);

  const togglePlugin = (id: string) => {
    const updated = plugins.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p);
    setPlugins(updated);
    savePlugins(updated);
  };

  const renderPluginIcon = (id: string) => {
    switch(id) {
      case 'gemini': 
        return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>;
      case 'local_brain':
        return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
      case 'wiki_search':
        return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>;
      default:
        return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>;
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Manajer Plugin</h2>
        <p>Atur sumber kecerdasan (Intelligence Layers) yang digunakan oleh AppForge AI.</p>
      </div>

      <div className="plugins-list">
        {plugins.map(plugin => (
          <div key={plugin.id} className="plugin-item">
            <div className="plugin-icon">{renderPluginIcon(plugin.id)}</div>
            <div className="plugin-info">
              <h3>{plugin.title}</h3>
              <p>{plugin.description}</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={plugin.enabled} 
                onChange={() => togglePlugin(plugin.id)} 
              />
              <span className="slider round"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
