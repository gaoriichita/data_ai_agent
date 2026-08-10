import type { ChatSession } from '../services/chatHistoryService';

export type AppView = 'chat' | 'pustaka' | 'plugin' | 'proyek';

interface Props {
  history: ChatSession[];
  currentSessionId: string;
  activeView: AppView;
  onNavClick: (view: AppView) => void;
  onNewChat: () => void;
  onSelectSession: (session: ChatSession) => void;
  onOpenSettings: () => void;
  onCloseSidebar: () => void;
}

export default function Sidebar({ history, currentSessionId, activeView, onNavClick, onNewChat, onSelectSession, onOpenSettings, onCloseSidebar }: Props) {

  return (
    <div className="app-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
          </svg>
        </div>
        <div className="sidebar-actions">
          <button className="sidebar-icon-btn" title="Cari">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button className="sidebar-icon-btn" title="Tutup Sidebar" onClick={onCloseSidebar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          </button>
        </div>
      </div>

      <div className="sidebar-nav">
        <button className={`sidebar-nav-item ${activeView === 'chat' ? 'active' : ''}`} onClick={onNewChat}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Obrolan baru
        </button>
        <button className={`sidebar-nav-item ${activeView === 'pustaka' ? 'active' : ''}`} onClick={() => onNavClick('pustaka')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          Pustaka
        </button>
        <button className={`sidebar-nav-item ${activeView === 'plugin' ? 'active' : ''}`} onClick={() => onNavClick('plugin')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
          Plugin
        </button>
        <button className={`sidebar-nav-item ${activeView === 'proyek' ? 'active' : ''}`} onClick={() => onNavClick('proyek')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          Proyek
        </button>
        <button className="sidebar-nav-item" onClick={onOpenSettings}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Pengaturan
        </button>
      </div>

      <div className="sidebar-history">
        <div className="history-label">Terkini</div>
        <div className="history-list">
          {history.length === 0 ? (
            <div className="history-empty">Belum ada obrolan</div>
          ) : (
            history.map((session) => (
              <button
                key={session.id}
                className={`history-item ${activeView === 'chat' && session.id === currentSessionId ? 'active' : ''}`}
                onClick={() => {
                  onSelectSession(session);
                  onNavClick('chat');
                }}
                title={session.title}
              >
                {session.title}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
