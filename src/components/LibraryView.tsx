import { useState, useRef, useEffect } from 'react';
import { getLibraryFiles, addLibraryFile, formatFileSize, formatFileDate } from '../services/libraryService';
import type { LibraryFile } from '../services/libraryService';

export default function LibraryView() {
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'document'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshFiles = () => setFiles(getLibraryFiles());

  // Load files on mount
  useEffect(() => {
    refreshFiles();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const type = file.type.startsWith('image/') ? 'image' : 
                   file.type.includes('pdf') || file.type.includes('text') || file.type.includes('document') ? 'document' : 'other';
      
      const newFile: LibraryFile = {
        id: Date.now().toString(),
        name: file.name,
        type: type as any,
        size: file.size,
        updatedAt: Date.now()
      };
      
      addLibraryFile(newFile);
      setFiles(getLibraryFiles());
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || f.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const renderFileIcon = (type: string) => {
    if (type === 'image') return <div className="file-icon img-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>;
    return <div className="file-icon doc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>;
  };

  return (
    <div className="lib-container">
      <div className="lib-header">
        <h2>Perpustakaan</h2>
        <div className="lib-header-actions">
          <div className="lib-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Cari" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="lib-new-btn" onClick={() => fileInputRef.current?.click()}>
            Baru
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
            multiple={false} 
          />
        </div>
      </div>

      <div className="lib-toolbar">
        <div className="lib-tabs">
          <button className={`lib-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>Semua</button>
          <button className={`lib-tab ${activeTab === 'image' ? 'active' : ''}`} onClick={() => setActiveTab('image')}>Gambar</button>
          <button className={`lib-tab ${activeTab === 'document' ? 'active' : ''}`} onClick={() => setActiveTab('document')}>Dokumen</button>
        </div>
        <div className="lib-view-controls">
          <button className="lib-icon-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="16" y2="6"/><line x1="4" y1="12" x2="10" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg></button>
          <div className="lib-divider"></div>
          <button className="lib-icon-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></button>
          <button className="lib-icon-btn active"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></button>
        </div>
      </div>

      <div className="lib-table-container">
        <table className="lib-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Diubah</th>
              <th>Ukuran</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  Tidak ada file ditemukan.
                </td>
              </tr>
            ) : (
              filteredFiles.map(file => (
                <tr key={file.id}>
                  <td>
                    <div className="file-name-cell">
                      {renderFileIcon(file.type)}
                      <span>{file.name}</span>
                    </div>
                  </td>
                  <td>{formatFileDate(file.updatedAt)}</td>
                  <td>{formatFileSize(file.size)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
