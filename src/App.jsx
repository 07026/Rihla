import { useMemo, useState } from "react";
import { ArrowLeft, Heart, Menu, Search, ShoppingBag, Star, X } from "lucide-react";

const money = (amount) => `${amount} د.م`;

const products = [
  { id: 1, name: "سَوْن الكوربورال بالفاكهة الحمراء", category: "عناية بالجسم", price: 129, volume: "100 مل", rating: 4.9, badge: "الأكثر مبيعاً", image: "__IMAGE_1__", color: "#fff1df" },
  { id: 2, name: "دوشا بالخَوْخ والورد", category: "استحمام", price: 89, volume: "400 مل", rating: 4.8, badge: "جديد", image: "__IMAGE_2__", color: "#fbd0e5" },
  { id: 3, name: "باقة النيلة والصخرة", category: "عناية تقليدية", price: 65, volume: "عبوتان", rating: 4.7, badge: "مختارات", image: "__IMAGE_3__", color: "#f2b4ca" },
  { id: 4, name: "زيت الورد الأصيل", category: "زيوت طبيعية", price: 75, volume: "100 مل", rating: 5.0, badge: "مميز", image: "__IMAGE_4__", color: "#ffdce8" },
];

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() =>
    products.filter((p) => `${p.name} ${p.category}`.includes(query)), [query]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      return found
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
    });
  }

  function changeQuantity(id, change) {
    setCart((current) => current
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0));
  }

  return (
    <div className="store min-h-screen" dir="rtl">
      <header className="nav">
        <a className="brand" href="#home" aria-label="Areej-Rose الرئيسية">
          <span className="brand-mark">A</span>
          <span>Areej<span>Rose</span></span>
        </a>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#home" onClick={() => setMenuOpen(false)}>الرئيسية</a>
          <a href="#products" onClick={() => setMenuOpen(false)}>المنتجات</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>قصتنا</a>
        </nav>

        <div className="nav-actions">
          <button className="icon-btn search-icon" aria-label="بحث" onClick={() => document.getElementById("product-search")?.focus()}><Search /></button>
          <button className="cart-btn" aria-label="فتح السلة" onClick={() => setCartOpen(true)}>
            <ShoppingBag />
            {count > 0 && <span className="cart-count">{count}</span>}
          </button>
          <button className="menu-btn" aria-label="القائمة" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow"><span /> أريج الطبيعة المغربية</p>
            <h1>جمالكِ<br /><em>بلمسة وردية</em></h1>
            <p className="hero-text">اكتشفي عناية الاستحمام والعناية بالجسم بمكونات طبيعية وألوان أنثوية هادئة.</p>
            <a className="primary-btn" href="#products">تسوّقي الآن <ArrowLeft /></a>
          </div>
          <div className="hero-art" aria-label="منتجات Areej-Rose">
            <div className="rose rose-one">🌹</div>
            <div className="rose rose-two">🌹</div>
            <div className="hero-bottle">
              <img src="{__IMAGE_2__}" alt="دوشا بالخَوْخ والورد" />
            </div>
          </div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span /> مختاراتنا</p>
              <h2>منتجات تحبها بشرتك</h2>
            </div>
            <label className="search-box">
              <Search />
              <input id="product-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحثي عن منتج…" />
            </label>
          </div>

          <div className="product-grid">
            {filtered.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image" style={{ background: product.color }}>
                  <span className="badge">{product.badge}</span>
                  <button className="heart" aria-label="إضافة للمفضلة"><Heart /></button>
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <p className="category">{product.category} · {product.volume}</p>
                  <h3>{product.name}</h3>
                  <div className="rating"><Star fill="currentColor" /> <span>{product.rating}</span></div>
                  <div className="buy-row">
                    <strong>{money(product.price)}</strong>
                    <button onClick={() => addToCart(product)} aria-label={`إضافة ${product.name} للسلة`}>
                      <ShoppingBag /> أضيفي للسلة
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="story" id="story">
          <p>Beauty is self-care</p>
          <h2>خلي كل يوم لحظة ��مال لكِ</h2>
          <span>منتجات مختارة بعناية · مكونات طبيعية · عناية أنثوية</span>
        </section>
      </main>

      <aside className={cartOpen ? "cart-drawer open" : "cart-drawer"} aria-hidden={!cartOpen}>
        <div className="cart-head"><h2>سلة مشترياتك</h2><button onClick={() => setCartOpen(false)} aria-label="إغلاق"><X /></button></div>
        <div className="cart-items">
          {cart.length === 0 ? <div className="empty">سلتك فارغة حاليًا 🌸</div> : cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt="" />
              <div><strong>{item.name}</strong><span>{money(item.price)}</span></div>
              <div className="quantity"><button onClick={() => changeQuantity(item.id, -1)}>−</button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.id, 1)}>+</button></div>
            </div>
          ))}
        </div>
        {cart.length > 0 && <div className="cart-footer"><div><span>المجموع</span><strong>{money(total)}</strong></div><button onClick={() => alert("سيتم ربط الدفع مع بوابة الدفع قريبًا.")}>إتمام الطلب</button></div>}
      </aside>
      {cartOpen && <button className="overlay" onClick={() => setCartOpen(false)} aria-label="إغلاق السلة" />}
    </div>
  );
}

export default App;
