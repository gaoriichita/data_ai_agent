export default function TodoPreview() {
  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#fff', background: '#111', height: '100%' }}>
      <h1 style={{ marginBottom: 20 }}>✅ Todo App</h1>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input placeholder="Add a new task..." style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #333', background: '#222', color: '#fff' }} />
        <button style={{ padding: '10px 20px', background: '#B68D40', border: 'none', borderRadius: 6, fontWeight: 'bold' }}>Add</button>
      </div>
      <div style={{ background: '#1a1a1a', padding: 20, borderRadius: 10 }}>
        {['Design database schema', 'Build REST API', 'Write unit tests'].map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '1px solid #333' : 'none' }}>
            <div style={{ width: 20, height: 20, border: '2px solid #555', borderRadius: '50%' }} />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
