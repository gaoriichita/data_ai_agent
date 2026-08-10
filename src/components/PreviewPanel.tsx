import type { ProjectType } from '../engine/projectEngine';
import TodoPreview from '../previews/TodoPreview';
import EcommercePreview from '../previews/EcommercePreview';
import LMSPreview from '../previews/LMSPreview';
import DashboardPreview from '../previews/DashboardPreview';

interface Props {
  projectType: ProjectType | null;
  buildStatus: string;
  description: string;
}

export default function PreviewPanel({ projectType, buildStatus, description }: Props) {
  if (!projectType || buildStatus !== 'complete') {
    return (
      <div className="preview-empty">
        <div className="preview-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <p>Live preview will appear here</p>
        </div>
      </div>
    );
  }

  // Render the actual React component representing the generated app
  return (
    <div className="preview-container">
      <div className="preview-browser-bar">
        <div className="browser-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <div className="browser-url">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          localhost:3000
        </div>
      </div>
      <div className="preview-content">
        {projectType === 'todo' && <TodoPreview />}
        {projectType === 'ecommerce' && <EcommercePreview />}
        {projectType === 'lms' && <LMSPreview />}
        {projectType === 'dashboard' && <DashboardPreview description={description} />}
      </div>
    </div>
  );
}
