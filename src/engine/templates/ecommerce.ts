/* Ecommerce Template Synthesizer */
import type { ProjectFile, ExtractedContext } from '../projectEngine';

export function generateEcommerceFiles(context?: ExtractedContext): ProjectFile[] {
  const topic = context?.topic || "Produk";
  const color = context?.themeColor || "blue";

  // Dynamic CSS Variables based on extracted color
  const colorMap: any = {
    red: { p: '#ef4444', h: '#dc2626' },
    blue: { p: '#3b82f6', h: '#2563eb' },
    green: { p: '#22c55e', h: '#16a34a' },
    yellow: { p: '#eab308', h: '#ca8a04' },
    purple: { p: '#a855f7', h: '#9333ea' },
    brown: { p: '#8b5a2b', h: '#5c4033' }, // Coffee brown
    dark: { p: '#3f3f46', h: '#27272a' },
    pink: { p: '#ec4899', h: '#db2777' },
    orange: { p: '#f97316', h: '#ea580c' },
  };

  const c = colorMap[color] || colorMap.blue;

  // Dynamic products based on topic
  let productData = `[
    { id: 1, name: "Premium ${topic} 1", price: "Rp 250.000", image: "📦" },
    { id: 2, name: "${topic} Klasik", price: "Rp 150.000", image: "🛍️" },
    { id: 3, name: "${topic} Eksklusif", price: "Rp 450.000", image: "✨" },
    { id: 4, name: "Paket ${topic}", price: "Rp 350.000", image: "🎁" }
  ]`;

  if (topic.toLowerCase() === 'kopi') {
    productData = `[
      { id: 1, name: "Espresso Roast", price: "Rp 45.000", image: "☕" },
      { id: 2, name: "Vanilla Latte", price: "Rp 35.000", image: "🧋" },
      { id: 3, name: "Caramel Macchiato", price: "Rp 40.000", image: "🧊" },
      { id: 4, name: "Arabica Beans 250g", price: "Rp 85.000", image: "🌾" }
    ]`;
  } else if (topic.toLowerCase() === 'sepatu') {
    productData = `[
      { id: 1, name: "Air Runners Max", price: "Rp 850.000", image: "👟" },
      { id: 2, name: "Classic Canvas", price: "Rp 350.000", image: "👞" },
      { id: 3, name: "Sport Pro X", price: "Rp 1.250.000", image: "🏃‍♂️" },
      { id: 4, name: "Leather Boots", price: "Rp 950.000", image: "🥾" }
    ]`;
  }

  return [
    { path: 'src', name: 'src', content: '', language: '', isDirectory: true },
    { path: 'src/components', name: 'components', content: '', language: '', isDirectory: true },
    {
      path: 'package.json', name: 'package.json', isDirectory: false, language: 'JSON',
      content: `{\n  "name": "ecommerce-${topic.toLowerCase()}",\n  "version": "1.0.0",\n  "dependencies": { "react": "^19.0.0" }\n}`,
    },
    {
      path: 'src/App.tsx', name: 'App.tsx', isDirectory: false, language: 'TypeScript React',
      content: `import { useState } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import CartModal from './components/CartModal';
import './App.css';

export default function App() {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="store-container">
      <Header 
        cartCount={cart.length} 
        onOpenCart={() => setIsCartOpen(true)} 
        storeName="Toko ${topic}"
      />
      <main className="store-main">
        <div className="hero-banner">
          <h1>Welcome to Toko ${topic}</h1>
          <p>Koleksi ${topic} terbaik dengan kualitas premium.</p>
        </div>
        <ProductGrid onAddToCart={(p) => setCart([...cart, p])} />
      </main>
      {isCartOpen && (
        <CartModal 
          cart={cart} 
          onClose={() => setIsCartOpen(false)} 
        />
      )}
    </div>
  );
}`,
    },
    {
      path: 'src/components/Header.tsx', name: 'Header.tsx', isDirectory: false, language: 'TypeScript React',
      content: `export default function Header({ cartCount, onOpenCart, storeName }: any) {
  return (
    <header className="store-header">
      <div className="logo">{storeName}</div>
      <div className="nav-links">
        <button className="nav-btn">Home</button>
        <button className="nav-btn">Katalog</button>
      </div>
      <button className="cart-btn" onClick={onOpenCart}>
        🛒 Keranjang
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>
    </header>
  );
}`,
    },
    {
      path: 'src/components/ProductGrid.tsx', name: 'ProductGrid.tsx', isDirectory: false, language: 'TypeScript React',
      content: `const PRODUCTS = ${productData};

export default function ProductGrid({ onAddToCart }: any) {
  return (
    <div className="product-grid">
      {PRODUCTS.map(p => (
        <div key={p.id} className="product-card">
          <div className="product-img">{p.image}</div>
          <div className="product-info">
            <h3>{p.name}</h3>
            <p className="price">{p.price}</p>
            <button className="add-btn" onClick={() => onAddToCart(p)}>+ Tambah</button>
          </div>
        </div>
      ))}
    </div>
  );
}`,
    },
    {
      path: 'src/components/CartModal.tsx', name: 'CartModal.tsx', isDirectory: false, language: 'TypeScript React',
      content: `export default function CartModal({ cart, onClose }: any) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Keranjang Anda</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="cart-list">
          {cart.length === 0 ? (
            <p className="empty-cart">Keranjang masih kosong.</p>
          ) : (
            cart.map((item: any, i: number) => (
              <div key={i} className="cart-item">
                <span>{item.image} {item.name}</span>
                <span className="cart-price">{item.price}</span>
              </div>
            ))
          )}
        </div>
        <div className="modal-footer">
          <button className="checkout-btn" disabled={cart.length === 0}>Checkout</button>
        </div>
      </div>
    </div>
  );
}`,
    },
    {
      path: 'src/App.css', name: 'App.css', isDirectory: false, language: 'CSS',
      content: `:root {
  --primary: ${c.p};
  --primary-hover: ${c.h};
  --bg: #f8fafc;
  --text: #0f172a;
  --card-bg: #ffffff;
}

body {
  margin: 0; font-family: 'Inter', sans-serif;
  background-color: var(--bg); color: var(--text);
}

.store-container { min-height: 100vh; }
.store-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 32px; background: var(--card-bg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  position: sticky; top: 0; z-index: 100;
}
.logo { font-size: 20px; font-weight: 800; color: var(--primary); letter-spacing: -0.5px; }
.nav-links { display: flex; gap: 16px; }
.nav-btn { background: none; border: none; cursor: pointer; color: #475569; font-weight: 500; }
.nav-btn:hover { color: var(--primary); }
.cart-btn {
  background: var(--primary); color: white; border: none;
  padding: 8px 16px; border-radius: 8px; cursor: pointer;
  display: flex; align-items: center; gap: 8px; font-weight: 600;
  transition: 0.2s;
}
.cart-btn:hover { background: var(--primary-hover); }
.cart-badge { background: white; color: var(--primary); padding: 2px 6px; border-radius: 10px; font-size: 12px; }

.store-main { padding: 32px; max-width: 1200px; margin: 0 auto; }
.hero-banner { text-align: center; margin-bottom: 48px; padding: 48px; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%); color: white; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
.hero-banner h1 { margin: 0 0 16px 0; font-size: 42px; }

.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; }
.product-card { background: var(--card-bg); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: 0.3s; }
.product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
.product-img { height: 180px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 64px; }
.product-info { padding: 20px; }
.product-info h3 { margin: 0 0 8px 0; font-size: 16px; color: #334155; }
.price { font-size: 18px; font-weight: 700; color: var(--primary); margin: 0 0 16px 0; }
.add-btn { width: 100%; background: #f1f5f9; color: var(--primary); border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.2s; }
.add-btn:hover { background: var(--primary); color: white; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
.modal-content { background: var(--card-bg); width: 400px; max-width: 90%; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2); animation: slideUp 0.3s ease; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #e2e8f0; }
.modal-header h2 { margin: 0; font-size: 18px; }
.close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #94a3b8; }
.cart-list { padding: 20px; max-height: 300px; overflow-y: auto; }
.empty-cart { text-align: center; color: #94a3b8; }
.cart-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; }
.cart-price { font-weight: 600; color: var(--primary); }
.modal-footer { padding: 20px; border-top: 1px solid #e2e8f0; }
.checkout-btn { width: 100%; background: var(--primary); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; transition: 0.2s; }
.checkout-btn:hover { background: var(--primary-hover); }
.checkout-btn:disabled { background: #cbd5e1; cursor: not-allowed; }

@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`,
    },
  ];
}
