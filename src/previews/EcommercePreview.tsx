export default function EcommercePreview() {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#fff', background: '#111', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: 20, borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>🛍️ StyleStore</h2>
        <div style={{ background: '#222', padding: '8px 16px', borderRadius: 20 }}>🛒 Cart (2)</div>
      </header>
      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ width: 200, padding: 20, borderRight: '1px solid #333' }}>
          <div style={{ color: '#888', marginBottom: 10 }}>Categories</div>
          {['Clothing', 'Footwear', 'Accessories'].map(c => <div key={c} style={{ padding: '8px 0' }}>{c}</div>)}
        </div>
        <div style={{ flex: 1, padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          {[
            { n: 'Classic Shirt', p: 'Rp299.000', i: '👔' },
            { n: 'Slim Jeans', p: 'Rp459.000', i: '👖' },
            { n: 'Running Shoes', p: 'Rp899.000', i: '👟' }
          ].map(p => (
            <div key={p.n} style={{ background: '#1a1a1a', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>{p.i}</div>
              <h4 style={{ margin: '0 0 10px 0' }}>{p.n}</h4>
              <div style={{ color: '#B68D40', fontWeight: 'bold' }}>{p.p}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
