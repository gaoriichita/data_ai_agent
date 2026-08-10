export default function LMSPreview() {
  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#fff', background: '#111', height: '100%' }}>
      <h1 style={{ marginBottom: 30 }}>🎓 SchoolHub LMS</h1>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <button style={{ padding: '8px 16px', background: '#B68D40', border: 'none', borderRadius: 6, fontWeight: 'bold' }}>Students</button>
        <button style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #333', color: '#888', borderRadius: 6 }}>Courses</button>
      </div>
      <div style={{ background: '#1a1a1a', borderRadius: 10, padding: 20 }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
              <th style={{ padding: 10 }}>Name</th><th style={{ padding: 10 }}>Grade</th><th style={{ padding: 10 }}>Course</th><th style={{ padding: 10 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { n: 'Andi Pratama', g: '10-A', c: 'Math', s: 'Active' },
              { n: 'Siti Rahma', g: '10-B', c: 'Science', s: 'Active' },
              { n: 'Rizky Fauzi', g: '12-A', c: 'Physics', s: 'On Leave' }
            ].map(s => (
              <tr key={s.n} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: 10 }}>{s.n}</td><td style={{ padding: 10 }}>{s.g}</td><td style={{ padding: 10 }}>{s.c}</td>
                <td style={{ padding: 10 }}><span style={{ background: '#1a3a1a', color: '#4caf50', padding: '2px 8px', borderRadius: 4 }}>{s.s}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
