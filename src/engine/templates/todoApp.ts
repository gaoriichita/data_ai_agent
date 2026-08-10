/* ═══════════════════════════════════════════════════════════════
   Todo App Template — Generates a complete todo application
   ═══════════════════════════════════════════════════════════════ */

import type { ProjectFile } from '../projectEngine';

export function generateTodoFiles(): ProjectFile[] {
  return [
    { path: 'src', name: 'src', content: '', language: '', isDirectory: true },
    { path: 'src/components', name: 'components', content: '', language: '', isDirectory: true },
    { path: 'public', name: 'public', content: '', language: '', isDirectory: true },
    {
      path: 'package.json', name: 'package.json', isDirectory: false,
      language: 'JSON',
      content: `{
  "name": "todo-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  }
}`,
    },
    {
      path: 'src/App.tsx', name: 'App.tsx', isDirectory: false,
      language: 'TypeScript React',
      content: `import { useState } from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import TodoFilter from './components/TodoFilter';
import './App.css';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: Date;
}

type FilterType = 'all' | 'active' | 'completed';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(SAMPLE_TODOS);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const addTodo = (text: string, category: string, priority: Todo['priority'], dueDate: string) => {
    setTodos(prev => [...prev, {
      id: Date.now(), text, completed: false,
      category, priority, dueDate, createdAt: new Date()
    }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const filtered = todos
    .filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .filter(t => categoryFilter === 'all' || t.category === categoryFilter)
    .filter(t => t.text.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>✅ Todo App</h1>
        <p>{stats.active} tasks remaining</p>
      </header>
      <AddTodo onAdd={addTodo} />
      <TodoFilter
        filter={filter} onFilterChange={setFilter}
        search={search} onSearchChange={setSearch}
        category={categoryFilter} onCategoryChange={setCategoryFilter}
        stats={stats}
      />
      <TodoList todos={filtered} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  );
}

const SAMPLE_TODOS: Todo[] = [
  { id: 1, text: 'Design database schema', completed: true, category: 'Work', priority: 'high', dueDate: '2026-08-10', createdAt: new Date() },
  { id: 2, text: 'Build REST API endpoints', completed: false, category: 'Work', priority: 'high', dueDate: '2026-08-12', createdAt: new Date() },
  { id: 3, text: 'Write unit tests', completed: false, category: 'Work', priority: 'medium', dueDate: '2026-08-15', createdAt: new Date() },
  { id: 4, text: 'Buy groceries', completed: false, category: 'Personal', priority: 'low', dueDate: '2026-08-07', createdAt: new Date() },
  { id: 5, text: 'Read "Clean Code" chapter 5', completed: true, category: 'Learning', priority: 'medium', dueDate: '2026-08-08', createdAt: new Date() },
  { id: 6, text: 'Deploy to production', completed: false, category: 'Work', priority: 'high', dueDate: '2026-08-20', createdAt: new Date() },
];`,
    },
    {
      path: 'src/components/TodoList.tsx', name: 'TodoList.tsx', isDirectory: false,
      language: 'TypeScript React',
      content: `import type { Todo } from '../App';

interface Props {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: Props) {
  if (todos.length === 0) {
    return <div className="empty-state">No tasks found.</div>;
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo.id} className={\`todo-item \${todo.completed ? 'completed' : ''} priority-\${todo.priority}\`}>
          <button className="todo-check" onClick={() => onToggle(todo.id)}>
            {todo.completed ? '✓' : ''}
          </button>
          <div className="todo-content">
            <span className="todo-text">{todo.text}</span>
            <div className="todo-meta">
              <span className="todo-category">{todo.category}</span>
              <span className="todo-due">Due: {todo.dueDate}</span>
              <span className={\`todo-priority p-\${todo.priority}\`}>{todo.priority}</span>
            </div>
          </div>
          <button className="todo-delete" onClick={() => onDelete(todo.id)}>×</button>
        </li>
      ))}
    </ul>
  );
}`,
    },
    {
      path: 'src/components/AddTodo.tsx', name: 'AddTodo.tsx', isDirectory: false,
      language: 'TypeScript React',
      content: `import { useState } from 'react';

interface Props {
  onAdd: (text: string, category: string, priority: 'low' | 'medium' | 'high', dueDate: string) => void;
}

export default function AddTodo({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim(), category, priority, new Date().toISOString().split('T')[0]);
    setText('');
  };

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)}
             placeholder="Add a new task..." className="add-input" />
      <select value={category} onChange={e => setCategory(e.target.value)} className="add-select">
        <option>Work</option><option>Personal</option><option>Learning</option>
      </select>
      <select value={priority} onChange={e => setPriority(e.target.value as any)} className="add-select">
        <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
      </select>
      <button type="submit" className="add-btn">Add</button>
    </form>
  );
}`,
    },
    {
      path: 'src/components/TodoFilter.tsx', name: 'TodoFilter.tsx', isDirectory: false,
      language: 'TypeScript React',
      content: `interface Props {
  filter: string; onFilterChange: (f: any) => void;
  search: string; onSearchChange: (s: string) => void;
  category: string; onCategoryChange: (c: string) => void;
  stats: { total: number; active: number; completed: number };
}

export default function TodoFilter({ filter, onFilterChange, search, onSearchChange, category, onCategoryChange, stats }: Props) {
  return (
    <div className="todo-filters">
      <input className="search-input" placeholder="Search tasks..."
             value={search} onChange={e => onSearchChange(e.target.value)} />
      <div className="filter-buttons">
        {(['all', 'active', 'completed'] as const).map(f => (
          <button key={f} onClick={() => onFilterChange(f)}
                  className={\`filter-btn \${filter === f ? 'active' : ''}\`}>
            {f} ({f === 'all' ? stats.total : f === 'active' ? stats.active : stats.completed})
          </button>
        ))}
      </div>
      <select value={category} onChange={e => onCategoryChange(e.target.value)} className="cat-select">
        <option value="all">All Categories</option>
        <option>Work</option><option>Personal</option><option>Learning</option>
      </select>
    </div>
  );
}`,
    },
    {
      path: 'src/App.css', name: 'App.css', isDirectory: false,
      language: 'CSS',
      content: `/* Todo App Styles */
.app { max-width: 700px; margin: 0 auto; padding: 2rem; font-family: 'Inter', sans-serif; }
.app-header h1 { font-size: 1.8rem; margin-bottom: 0.25rem; }
.app-header p { color: #888; font-size: 0.9rem; margin-bottom: 1.5rem; }
.add-todo { display: flex; gap: 8px; margin-bottom: 1rem; }
.add-input { flex: 1; padding: 10px 14px; border: 1px solid #333; border-radius: 8px;
  background: #1a1a1a; color: #fff; font-size: 0.9rem; }
.add-select { padding: 10px; border: 1px solid #333; border-radius: 8px;
  background: #1a1a1a; color: #fff; font-size: 0.85rem; }
.add-btn { padding: 10px 20px; background: #B68D40; color: #000; border: none;
  border-radius: 8px; font-weight: 600; cursor: pointer; }
.todo-filters { display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
.search-input { flex: 1; min-width: 150px; padding: 8px 12px; border: 1px solid #333;
  border-radius: 8px; background: #1a1a1a; color: #fff; font-size: 0.85rem; }
.filter-buttons { display: flex; gap: 4px; }
.filter-btn { padding: 6px 12px; border: 1px solid #333; border-radius: 6px;
  background: transparent; color: #888; cursor: pointer; font-size: 0.8rem; text-transform: capitalize; }
.filter-btn.active { background: #B68D40; color: #000; border-color: #B68D40; }
.cat-select { padding: 8px; border: 1px solid #333; border-radius: 8px;
  background: #1a1a1a; color: #fff; font-size: 0.85rem; }
.todo-list { list-style: none; }
.todo-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px;
  border: 1px solid #222; border-radius: 10px; margin-bottom: 8px; transition: all 0.2s; }
.todo-item:hover { border-color: #444; }
.todo-item.completed .todo-text { text-decoration: line-through; opacity: 0.5; }
.todo-check { width: 24px; height: 24px; border: 2px solid #555; border-radius: 50%;
  background: transparent; color: #B68D40; font-size: 14px; cursor: pointer; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; }
.completed .todo-check { background: #B68D40; border-color: #B68D40; color: #000; }
.todo-content { flex: 1; }
.todo-text { font-size: 0.95rem; }
.todo-meta { display: flex; gap: 8px; margin-top: 4px; font-size: 0.75rem; color: #666; }
.todo-category { background: #1a2a3a; padding: 2px 8px; border-radius: 4px; color: #6ab7ff; }
.todo-priority { padding: 2px 8px; border-radius: 4px; text-transform: uppercase; font-weight: 600; }
.p-high { background: #3a1a1a; color: #ff6b6b; }
.p-medium { background: #3a2a1a; color: #ffc107; }
.p-low { background: #1a3a1a; color: #4caf50; }
.todo-delete { background: none; border: none; color: #555; font-size: 1.4rem; cursor: pointer; padding: 4px 8px; }
.todo-delete:hover { color: #ff4444; }
.empty-state { text-align: center; padding: 3rem; color: #555; }
.priority-high { border-left: 3px solid #ff6b6b; }`,
    },
    {
      path: 'src/main.tsx', name: 'main.tsx', isDirectory: false,
      language: 'TypeScript React',
      content: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>
);`,
    },
    {
      path: 'tsconfig.json', name: 'tsconfig.json', isDirectory: false,
      language: 'JSON',
      content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}`,
    },
  ];
}
