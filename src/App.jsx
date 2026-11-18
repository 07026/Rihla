import { useState } from "react";
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "فستان وردي أنيق",
    category: "الملابس",
    price: 89,
    oldPrice: 110,
    badge: "الأكثر طلباً",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "حقيبة روز كوتور",
    category: "الإكسسوارات",
    price: 64,
    oldPrice: null,
    badge: "جديد",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "عطر وردة المساء",
    category: "العطور",
    price: 72,
    oldPrice: 85,
    badge: "عرض خاص",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "سوار من الورد",
    category: "المجوهرات",
    price: 48,
    oldPrice: null,
    badge: "حصري",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85",
  },
];

const money = (amount) => new Intl.NumberFormat("ar-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 0 }).format(amount);

function Brand() {
  return (
    <a href="#home" className="flex items-center gap-2" aria-label="روز بوتيك — الرئيسية">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-rose-500 text-lg font-bold text-white shadow-[0_8px_24px_rgba(244,114,182,.35)]">R</span>
      <span className="font-display text-xl font-bold text-stone-800">Rose<span className="text-rose-500">.</span></span>
    </a>
  );
}

export default function App() {
  const [cartCount, setCartCount] = useState(2);
  const [favorites, setFavorites] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleFavorite = (id) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#fff8fa] text-stone-800" dir="rtl">
      <header className="sticky top-0 z-50 border-b border-rose-100/70 bg-[#fff8fa]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Brand />
          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a className="text-rose-500" href="#home">الرئيسية</a>
            <a className="transition hover:text-rose-500" href="#products">منتجاتنا</a>
            <a className="transition hover:text-rose-500" href="#story">قصتنا</a>
            <a className="transition hover:text-rose-500" href="#contact">تواصل معنا</a>
          </nav>
          <div className="flex items-center gap-2">
            <button className="relative grid h-10 w-10 place-items-center rounded-full border border-rose-100 bg-white text-stone-700 transition hover:border-rose-300 hover:text-rose-500" aria-label="سلة التسوق">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute -left-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] text-white">{cartCount}</span>}
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-full border border-rose-100 bg-white md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="القائمة">☰</button>
          </div>
        </div>
        {menuOpen && (
          <nav className="mx-5 mb-4 grid gap-2 rounded-2xl border border-rose-100 bg-white p-3 text-sm font-semibold shadow-lg md:hidden">
            <a className="rounded-xl px-3 py-2 text-rose-500" href="#home">الرئيسية</a>
            <a className="rounded-xl px-3 py-2 hover:bg-rose-50" href="#products">منتجاتنا</a>
            <a className="rounded-xl px-3 py-2 hover:bg-rose-50" href="#story">قصتنا</a>
            <a className="rounded-xl px-3 py-2 hover:bg-rose-50" href="#contact">تواصل معنا</a>
          </nav>
        )}
      </header>

      <main>
        <section id="home" className="relative overflow-hidden">
          <div className="absolute -right-28 top-10 h-80 w-80 rounded-full bg-rose-200/45 blur-3xl" />
          <div class="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-pink-100/70 blur-3xl" />
          <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:px-12">
            <div className="relative z-10 max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-bold text-rose-500 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> مجموعة الربيع الجديدة
              </div>
              <h1 className="font-display text-5xl font-bold leading-[1.12] tracking-tight text-stone-800 sm:text-6xl lg:text-7xl">
                اختاري بهاءَكِ من عالمٍ <span className="text-rose-500">زهرية.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-9 text-stone-500">
                تشكيلة مختارة بعناية من الأزياء والإكسسوارات والعطور التي تمنحكِ إطلالة ناعمة ولا تُنسى.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#products" className="inline-flex items-center gap-3 rounded-full bg-rose-500 px-7 py-4 font-bold text-white shadow-[0_14px_30px_rgba(244,114,182,.28)] transition hover:-translate-y-1 hover:bg-rose-600">
                  تسوقي الآن <ArrowLeft className="h-4 w-4" />
                </a>
                <a href="#story" className="inline-flex items-center rounded-full border border-rose-200 bg-white px-7 py-4 font-bold text-stone-700 transition hover:border-rose-300">اكتشفي قصتنا</a>
              </div>
              <div className="mt-10 flex items-center gap-5">
                <div class="flex -space-x-3 space-x-reverse">
                  {["https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80","https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80","https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=100&q=80"].map((src) => <img key={src} src={src} className="h-11 w-11 rounded-full border-4 border-[#fff8fa] object-cover" alt="عميلة" />)}
                </div>
                <div>
                  <div class="flex text-amber-400">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                  <p className="mt-1 text-xs font-bold text-stone-500">أكثر من ١٢٠٠ عميلة سعيدة</p>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute left-2 top-8 h-[90%] w-[82%] rotate-3 rounded-[3rem] bg-rose-200/55" />
              <div className="relative mr-auto h-[520px] w-[88%] overflow-hidden rounded-[2.5rem] rounded-bl-[7rem] border-[10px] border-white shadow-[0_28px_70px_rgba(190,70,110,.18)] sm:h-[600px]">
                <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=90" alt="مجموعة أزياء وردية أنيقة" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-900/25 to-transparent" />
              </div>
              <div className="absolute bottom-8 right-0 rounded-3xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur sm:right-[-1rem]">
                <p className="text-xs text-stone-400">عرض اليوم</p>
                <p className="mt-1 text-xl font-bold text-rose-500">خصم ٣٠٪</p>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="mb-10 flex items-end justify-between gap-5">
              <div>
                <p className="text-sm font-bold text-rose-500">مختاراتنا لهذا الموسم</p>
                <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">أجمل القطع لكِ</h2>
              </div>
              <a href="#products" className="hidden items-center gap-2 text-sm font-bold text-rose-500 sm:flex">عرض الكل <ArrowLeft className="h-4 w-4" /></a>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <article key={product.id} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-rose-50">
                    <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-rose-500 shadow-sm">{product.badge}</span>
                    <button onClick={() => toggleFavorite(product.id)} className={`absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full shadow-sm transition ${favorites.includes(product.id) ? "bg-rose-500 text-white" : "bg-white text-stone-500 hover:text-rose-500"}`} aria-label="إضافة للمفضلة">
                      <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? "fill-current" : ""}`} />
                    </button>
                    <button onClick={() => setCartCount((count) => count + 1)} className="absolute bottom-4 left-4 right-4 translate-y-16 rounded-full bg-stone-900 px-5 py-3.5 text-sm font-bold text-white opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      أضف للسلة
                    </button>
                  </div>
                  <p className="mt-4 text-xs font-bold text-rose-400">{product.category}</p>
                  <h3 className="mt-1 font-display text-lg font-bold">{product.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-bold text-rose-500">{money(product.price)}</span>
                    {product.oldPrice && <span className="text-sm text-stone-400 line-through">{money(product.oldPrice)}</span>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="story" className="bg-[#fff1f5] py-16 sm:py-20">
          <div class="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 md:grid-cols-3 lg:px-12">
            {[ ["توصيل سريع", "يصلك طلبك أينما كنت"], ["دفع آمن", "عمليات شراء محمية بالكامل"], ["منتجات مختارة", "جودة وأناقة في كل قطعة"] ].map(([title, text], index) => (
              <div key={title} className="flex items-center gap-4 rounded-[1.5rem] border border-white bg-white/70 p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rose-100 font-bold text-rose-500">{index + 1}</span>
                <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm text-stone-500">{text}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-[2rem] bg-rose-500 px-6 py-12 text-center text-white sm:px-12">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[40px] border-white/10" />
            <div className="relative">
              <p className="text-sm font-bold text-rose-100">رسائلنا إليكِ أولاً</p>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">اشتركي واحصلي على خصم ١٥٪</h2>
              <form className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventEvent?.()}>
                <input type="email" required placeholder="البريد الإلكتروني" className="min-h-14 flex-1 rounded-full border-0 bg-white px-5 text-stone-800 outline-none placeholder:text-stone-400" />
                <button className="min-h-14 rounded-full bg-stone-900 px-7 font-bold transition hover:bg-stone-800">اشتركي الآن</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-rose-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <Brand />
          <p>© ٢٠٢٦ روز بوتيك. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
