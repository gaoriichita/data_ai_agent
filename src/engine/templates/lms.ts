/* LMS Template */
import type { ProjectFile } from '../projectEngine';

export function generateLMSFiles(): ProjectFile[] {
  return [
    { path: 'src', name: 'src', content: '', language: '', isDirectory: true },
    { path: 'src/components', name: 'components', content: '', language: '', isDirectory: true },
    { path: 'server', name: 'server', content: '', language: '', isDirectory: true },
    { path: 'database', name: 'database', content: '', language: '', isDirectory: true },
    {
      path: 'package.json', name: 'package.json', isDirectory: false, language: 'JSON',
      content: `{\n  "name": "lms-app",\n  "version": "1.0.0",\n  "dependencies": { "react": "^19.0.0", "react-dom": "^19.0.0" }\n}`,
    },
    {
      path: 'src/App.tsx', name: 'App.tsx', isDirectory: false, language: 'TypeScript React',
      content: `import { useState } from 'react';
import StudentList from './components/StudentList';
import CourseList from './components/CourseList';
import AddStudent from './components/AddStudent';
import './App.css';

export interface Student { id: number; name: string; email: string; grade: string; course: string; gpa: number; status: string; }
export interface Course { id: number; name: string; teacher: string; students: number; category: string; }

const STUDENTS: Student[] = [
  { id: 1, name: 'Andi Pratama', email: 'andi@school.id', grade: '10-A', course: 'Mathematics', gpa: 3.8, status: 'Active' },
  { id: 2, name: 'Siti Rahma', email: 'siti@school.id', grade: '10-B', course: 'Science', gpa: 3.9, status: 'Active' },
  { id: 3, name: 'Budi Santoso', email: 'budi@school.id', grade: '11-A', course: 'English', gpa: 3.5, status: 'Active' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi@school.id', grade: '11-B', course: 'History', gpa: 3.7, status: 'Active' },
  { id: 5, name: 'Rizky Fauzi', email: 'rizky@school.id', grade: '12-A', course: 'Physics', gpa: 3.6, status: 'On Leave' },
];

const COURSES: Course[] = [
  { id: 1, name: 'Mathematics', teacher: 'Dr. Surya', students: 32, category: 'Science' },
  { id: 2, name: 'Physics', teacher: 'Prof. Hadi', students: 28, category: 'Science' },
  { id: 3, name: 'English Literature', teacher: 'Ms. Diana', students: 35, category: 'Language' },
  { id: 4, name: 'Indonesian History', teacher: 'Mr. Bambang', students: 30, category: 'Social' },
];

export default function App() {
  const [students, setStudents] = useState(STUDENTS);
  const [tab, setTab] = useState<'students' | 'courses'>('students');
  const [search, setSearch] = useState('');

  const addStudent = (s: Omit<Student, 'id'>) => setStudents(prev => [...prev, { ...s, id: Date.now() }]);
  const deleteStudent = (id: number) => setStudents(prev => prev.filter(s => s.id !== id));
  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="app">
      <header className="lms-header">
        <h1>🎓 SchoolHub LMS</h1>
        <nav className="lms-nav">
          <button className={tab === 'students' ? 'active' : ''} onClick={() => setTab('students')}>Students</button>
          <button className={tab === 'courses' ? 'active' : ''} onClick={() => setTab('courses')}>Courses</button>
        </nav>
      </header>
      {tab === 'students' ? (
        <>
          <AddStudent onAdd={addStudent} />
          <input className="search" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
          <StudentList students={filtered} onDelete={deleteStudent} />
        </>
      ) : <CourseList courses={COURSES} />}
    </div>
  );
}`,
    },
    {
      path: 'src/components/StudentList.tsx', name: 'StudentList.tsx', isDirectory: false, language: 'TypeScript React',
      content: `import type { Student } from '../App';
export default function StudentList({ students, onDelete }: { students: Student[]; onDelete: (id: number) => void }) {
  return (
    <table className="data-table"><thead><tr><th>Name</th><th>Email</th><th>Grade</th><th>Course</th><th>GPA</th><th>Status</th><th></th></tr></thead>
    <tbody>{students.map(s => (
      <tr key={s.id}><td>{s.name}</td><td>{s.email}</td><td>{s.grade}</td><td>{s.course}</td>
      <td><span className="gpa">{s.gpa}</span></td><td><span className={\`status \${s.status.toLowerCase().replace(' ','-')}\`}>{s.status}</span></td>
      <td><button className="del-btn" onClick={() => onDelete(s.id)}>×</button></td></tr>
    ))}</tbody></table>
  );
}`,
    },
    {
      path: 'src/components/CourseList.tsx', name: 'CourseList.tsx', isDirectory: false, language: 'TypeScript React',
      content: `import type { Course } from '../App';
export default function CourseList({ courses }: { courses: Course[] }) {
  return (
    <div className="course-grid">{courses.map(c => (
      <div key={c.id} className="course-card"><h3>{c.name}</h3>
      <p>👨‍🏫 {c.teacher}</p><p>👥 {c.students} students</p>
      <span className="course-cat">{c.category}</span></div>
    ))}</div>
  );
}`,
    },
    {
      path: 'src/components/AddStudent.tsx', name: 'AddStudent.tsx', isDirectory: false, language: 'TypeScript React',
      content: `import { useState } from 'react';
import type { Student } from '../App';
export default function AddStudent({ onAdd }: { onAdd: (s: Omit<Student,'id'>) => void }) {
  const [name, setName] = useState('');
  const submit = (e: React.FormEvent) => { e.preventDefault(); if(!name.trim()) return;
    onAdd({ name, email: name.toLowerCase().replace(' ','.')+'@school.id', grade: '10-A', course: 'Mathematics', gpa: 3.5, status: 'Active' }); setName(''); };
  return (<form className="add-form" onSubmit={submit}><input placeholder="Student name..." value={name} onChange={e=>setName(e.target.value)} className="add-input"/><button type="submit" className="add-btn">+ Add Student</button></form>);
}`,
    },
    {
      path: 'src/App.css', name: 'App.css', isDirectory: false, language: 'CSS',
      content: `.app { max-width: 900px; margin: 0 auto; padding: 2rem; font-family: 'Inter',sans-serif; }
.lms-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; }
.lms-header h1 { font-size:1.5rem; }
.lms-nav button { padding:8px 16px; background:none; border:1px solid #333; color:#888; border-radius:6px; margin-left:8px; cursor:pointer; }
.lms-nav button.active { background:#B68D40; color:#000; border-color:#B68D40; }
.add-form { display:flex; gap:8px; margin-bottom:1rem; }
.add-input { flex:1; padding:10px 14px; background:#1a1a1a; border:1px solid #333; border-radius:8px; color:#fff; }
.add-btn { padding:10px 20px; background:#B68D40; color:#000; border:none; border-radius:8px; font-weight:600; cursor:pointer; }
.search { width:100%; padding:10px 14px; background:#1a1a1a; border:1px solid #333; border-radius:8px; color:#fff; margin-bottom:1rem; }
.data-table { width:100%; border-collapse:collapse; }
.data-table th { text-align:left; padding:10px 12px; color:#888; font-size:0.8rem; text-transform:uppercase; border-bottom:1px solid #333; }
.data-table td { padding:10px 12px; border-bottom:1px solid #1a1a1a; font-size:0.9rem; }
.gpa { background:#1a2a1a; color:#4caf50; padding:2px 8px; border-radius:4px; font-weight:600; }
.status { padding:2px 8px; border-radius:4px; font-size:0.8rem; }
.status.active { background:#1a2a1a; color:#4caf50; }
.status.on-leave { background:#3a2a1a; color:#ffc107; }
.del-btn { background:none; border:none; color:#555; font-size:1.2rem; cursor:pointer; }
.del-btn:hover { color:#f44; }
.course-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }
.course-card { background:#151515; border:1px solid #222; border-radius:12px; padding:20px; }
.course-card h3 { margin-bottom:8px; font-size:1rem; }
.course-card p { color:#888; font-size:0.85rem; margin:4px 0; }
.course-cat { display:inline-block; background:#1a1a2a; color:#6ab7ff; padding:2px 8px; border-radius:4px; font-size:0.75rem; margin-top:8px; }`,
    },
    {
      path: 'database/schema.sql', name: 'schema.sql', isDirectory: false, language: 'SQL',
      content: `CREATE TABLE students (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE, grade VARCHAR(10), gpa DECIMAL(3,2), status VARCHAR(50) DEFAULT 'Active');
CREATE TABLE courses (id SERIAL PRIMARY KEY, name VARCHAR(255), teacher VARCHAR(255), category VARCHAR(100));
CREATE TABLE enrollments (id SERIAL PRIMARY KEY, student_id INT REFERENCES students(id), course_id INT REFERENCES courses(id), enrolled_at TIMESTAMP DEFAULT NOW());
CREATE TABLE grades (id SERIAL PRIMARY KEY, student_id INT REFERENCES students(id), course_id INT REFERENCES courses(id), score DECIMAL(5,2), grade_letter VARCHAR(2));`,
    },
  ];
}
