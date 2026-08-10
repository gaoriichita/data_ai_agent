import type { ProjectFile } from '../engine/projectEngine';
import { detectLanguage } from '../engine/projectEngine';

interface Props {
  file: ProjectFile | null;
  onClose: () => void;
}

export default function CodeViewer({ file, onClose }: Props) {
  if (!file) return null;

  const lines = file.content.split('\n');

  return (
    <div className="code-viewer">
      <div className="code-header">
        <div className="code-tabs">
          <div className="code-tab active">
            {file.name}
            <button onClick={onClose}>×</button>
          </div>
        </div>
        <div className="code-lang-badge">{detectLanguage(file.name)}</div>
      </div>
      <div className="code-content">
        <pre>
          <code>
            {lines.map((line, i) => (
              <div key={i} className="code-line">
                <span className="line-number">{i + 1}</span>
                <span className="line-text">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
