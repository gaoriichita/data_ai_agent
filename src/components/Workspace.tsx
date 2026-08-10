import { useState } from 'react';
import type { ProjectType, ProjectFile } from '../engine/projectEngine';
import PreviewPanel from './PreviewPanel';
import FileExplorer from './FileExplorer';
import CodeViewer from './CodeViewer';

interface Props {
  projectType: ProjectType | null;
  buildStatus: string;
  description: string;
  files: ProjectFile[];
}

export default function Workspace({ projectType, buildStatus, description, files }: Props) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);

  if (!projectType || buildStatus !== 'complete') {
    return (
      <div className="workspace-empty">
        <div className="workspace-placeholder">
          <div className="pulse-circle"></div>
          <p>Describe your app in the chat to start building...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace-container">
      <div className="workspace-header">
        <div className="workspace-tabs">
          <button 
            className={`ws-tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            Preview
          </button>
          <button 
            className={`ws-tab ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('code');
              if (!activeFile && files.length > 0) {
                // Auto-select first non-dir file if possible, or just the first file
                const firstFile = files.find(f => !f.isDirectory) || files[0];
                setActiveFile(firstFile);
              }
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            Code
          </button>
        </div>
        <div className="workspace-actions">
          <button className="btn-icon" title="Refresh"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l5.67-5.67"/></svg></button>
          <button className="btn-icon" title="Open in New Tab"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></button>
        </div>
      </div>
      
      <div className="workspace-content">
        {activeTab === 'preview' ? (
          <PreviewPanel 
            projectType={projectType} 
            buildStatus={buildStatus} 
            description={description} 
          />
        ) : (
          <div className="code-workspace">
            <div className="code-sidebar">
              <FileExplorer 
                files={files} 
                onFileSelect={setActiveFile} 
                activeFile={activeFile} 
              />
            </div>
            <div className="code-editor-area">
              <CodeViewer 
                file={activeFile} 
                onClose={() => setActiveFile(null)} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
