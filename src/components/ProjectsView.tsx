import type { ChatSession } from '../services/chatHistoryService';

interface Props {
  history: ChatSession[];
  onSelectProject: (session: ChatSession) => void;
}

export default function ProjectsView({ history, onSelectProject }: Props) {
  // Only show sessions that actually have a project built
  const projects = history.filter(session => session.project !== null);

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Proyek Anda</h2>
        <p>Semua aplikasi yang pernah Anda bangun dengan AppForge AI.</p>
      </div>

      {projects.length === 0 ? (
        <div className="view-empty">
          <div className="pulse-circle">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3>Belum ada proyek</h3>
          <p>Mulai obrolan baru dan minta AI membuatkan aplikasi untuk Anda!</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(session => (
            <div key={session.id} className="project-card" onClick={() => onSelectProject(session)}>
              <div className="project-card-header">
                <span className="project-type-badge">{session.project?.type || 'App'}</span>
                <span className="project-date">
                  {new Date(session.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h3>{session.title}</h3>
              <p>{session.project?.description || 'Aplikasi buatan AI.'}</p>
              <div className="project-card-footer">
                <span>{session.project?.files?.length || 0} File</span>
                <button>Buka Proyek &rarr;</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
