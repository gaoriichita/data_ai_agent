import { useState, useEffect } from 'react';
import { getApiKey, setApiKey } from '../services/geminiService';
import { getOpenAIApiKey, setOpenAIApiKey, getPrimaryProvider, setPrimaryProvider } from '../services/openaiService';
import './SettingsModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setGeminiKey(getApiKey());
      setOpenaiKey(getOpenAIApiKey());
      setProvider(getPrimaryProvider());
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(geminiKey.trim());
    setOpenAIApiKey(openaiKey.trim());
    setPrimaryProvider(provider);
    setSaved(true);
    setTimeout(() => onClose(), 800);
  };

  const handleClear = () => {
    setApiKey('');
    setGeminiKey('');
    setOpenAIApiKey('');
    setOpenaiKey('');
    setSaved(false);
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ Pengaturan AI</h2>
          <button className="settings-close" onClick={onClose}>×</button>
        </div>

        <div className="settings-body">
          <div className="settings-section">
            <label className="settings-label">Penyedia AI Utama</label>
            <select 
              className="settings-input" 
              value={provider} 
              onChange={e => setProvider(e.target.value as 'gemini' | 'openai')}
              style={{ marginBottom: '16px' }}
            >
              <option value="gemini">Google Gemini (Flash)</option>
              <option value="openai">OpenAI (GPT-4o Mini)</option>
            </select>
          </div>

          <div className="settings-section">
            <label className="settings-label">Google Gemini API Key</label>
            <p className="settings-hint">
              Dapatkan gratis di{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                aistudio.google.com/apikey
              </a>
            </p>
            <input
              type="password"
              className="settings-input"
              placeholder="Masukkan Gemini API Key..."
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
            />
          </div>

          <div className="settings-section">
            <label className="settings-label">OpenAI API Key</label>
            <p className="settings-hint">
              Dapatkan di{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                platform.openai.com
              </a>
            </p>
            <input
              type="password"
              className="settings-input"
              placeholder="Masukkan OpenAI API Key..."
              value={openaiKey}
              onChange={e => setOpenaiKey(e.target.value)}
            />
          </div>

          <div className="settings-actions">
            <button className="settings-btn-clear" onClick={handleClear} disabled={!geminiKey && !openaiKey}>
              Hapus Semua Key
            </button>
            <button className="settings-btn-save" onClick={handleSave}>
              {saved ? '✅ Tersimpan!' : 'Simpan'}
            </button>
          </div>

          <div className="settings-info">
            <div className="info-card">
              <strong>🔒 Privasi</strong>
              <p>API key hanya disimpan di browser Anda (localStorage). Tidak dikirim ke server manapun.</p>
            </div>
            <div className="info-card">
              <strong>💡 Tanpa API Key</strong>
              <p>AI tetap bisa membangun aplikasi, tapi menggunakan mode offline untuk menjawab pertanyaan umum.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
