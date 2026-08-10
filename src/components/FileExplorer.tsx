import type { ProjectFile } from '../engine/projectEngine';
import { getFileIcon } from '../engine/projectEngine';

interface Props {
  files: ProjectFile[];
  onFileSelect: (file: ProjectFile) => void;
  activeFile: ProjectFile | null;
}

export default function FileExplorer({ files, onFileSelect, activeFile }: Props) {
  return (
    <div className="file-explorer">
      <div className="panel-header">
        <h3>Project Files</h3>
      </div>
      <div className="file-tree">
        {files.length === 0 ? (
          <div className="empty-tree">No project loaded</div>
        ) : (
          <FileNode nodes={files} level={0} onSelect={onFileSelect} active={activeFile} />
        )}
      </div>
    </div>
  );
}

interface NodeProps {
  nodes: ProjectFile[];
  level: number;
  onSelect: (f: ProjectFile) => void;
  active: ProjectFile | null;
}

function FileNode({ nodes, level, onSelect, active }: NodeProps) {
  return (
    <>
      {nodes.map(node => {
        const isActive = active?.path === node.path;
        return (
          <div key={node.path}>
            <div
              className={`file-item ${isActive ? 'active' : ''}`}
              style={{ paddingLeft: `${level * 12 + 12}px` }}
              onClick={() => {
                if (!node.isDirectory) onSelect(node);
              }}
            >
              <span className="file-icon">{getFileIcon(node.name, node.isDirectory)}</span>
              <span className="file-name">{node.name}</span>
            </div>
            {node.isDirectory && node.children && (
              <FileNode nodes={node.children} level={level + 1} onSelect={onSelect} active={active} />
            )}
          </div>
        );
      })}
    </>
  );
}
