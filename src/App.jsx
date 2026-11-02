import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUpLeft, CalendarDays, Check, ChevronLeft, Compass, MapPin, Menu, MessageSquareQuote, ShieldCheck, Sparkles, Star, Users, X } from "lucide-react";

const trips = [
  { id: "chefchaouen", name: "شفشاون", region: "جبال الريف", price: 75, days: "يومان", image: "https://images.unsplash.com/photo-1565689478170-6624de9575e0?auto=format&fit=crop&w=1100&q=85", alt: "الأزقة الزرقاء في شفشاون بين جبال الريف", tag: "الأكثر حباً", emoji: "💙" },
  { id: "marrakech", name: "مراكش", region: "قلب المدينة الحمراء", price: 100, days: "3 أيام", image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1100&q=85", alt: "مباني مراكش المغربية", tag: "ثقافة وحياة", emoji: "🧡" },
  { id: "merzouga", name: "مرزوكة", region: "صحراء المغرب", price: 150, days: "ليلتان", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1100&q=85", alt: "الكثبان الذهبية في الصحراء المغربية", tag: "تحت النجوم", emoji: "✨" },
];

const experiences = [
  { title: "رحلات مخصصة", text: "خطة ذكية تناسب أهواءك وميزانيتك من اليوم الأول." },
  { title: "إقامات فاخرة", text: "فنادق وبيوتات أنيقة توفر لك الراحة والدفء في كل مدينة." },
  { title: "مرشدون محليون", text: "خبرة محلية تغني رحلتك بملاحظات واهتمامات حقيقية." },
];

const testimonials = [
  { name: "سارة م.", note: "من أجمل الرحلات التي قمت بها في حياتي. كل تفاصيل الرحلة كانت مرتبة ومريحة." },
  { name: "أحمد ز.", note: "من البداية حتى النهاية، كل شيء كان احترافياً. ربطنا بين الثقافة والراحة بشكل رائع." },
  { name: "ليلى ع.", note: "الاستقبال كان ممتازاً، والطبيعة في شفشاون لا تُوصف. سنعود حتماً." },
];

const faqs = [
  { q: "هل يمكن تعديل الحجز بعد التأكيد؟", a: "نعم، يمكن تعديل بعض التفاصيل في حالة توفر أماكن مناسبة، وسيتم التواصل مباشرة." },
  { q: "هل تشمل الرحلة الإقامة؟", a: "تعتمد الخطة المختارة على الرحلة، ويمكن إضافة الإقامة مع باقات مخصصة." },
  { q: "هل الدفع آمن؟", a: "نعم، جميع الحجوزات تتم مع تأكيد الدفع عبر PayPal بشكل آمن ومؤمن." },
];

const money = (amount) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
const today = new Date().toISOString().slice(0, 10);

function Brand({ light = false }) {
  return (
    <a href="#home" className={`inline-flex items-center gap-2.5 font-bold tracking-tight ${light ? "text-white" : "text-ink"}`} aria-label="Rihla — الصفحة الرئيسية">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-forest text-lg text-white shadow-soft">R</span>
      <span className="text-[1.35rem]">Rihla<span className="text-terracotta">.</span></span>
    </a>
  );
}

function PaypalCheckout({ booking, onSuccess, onError }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    let buttons;

    async function init() {
      try {
        const configResponse = await fetch("/api/paypal/config", { headers: { Accept: "application/json" } });
        const config = await configResponse.json();
        if (!configResponse.ok || !config.clientId) throw new Error("config");

        if (!window.paypal) {
          await new Promise((resolve, reject) => {
            const existing = document.querySelector("script[data-paypal-sdk]");
            if (existing) {
              if (window.paypal) return resolve();
              existing.addEventListener("load", resolve, { once: true });
              existing.addEventListener("error", reject, { once: true });
              return;
            }

            const script = document.createElement("script");
            script.dataset.paypalSdk = "true";
            script.src = `https://www.paypal.com/sdk/js?${new URLSearchParams({ "client-id": config.clientId, currency: "EUR", intent: "capture", components: "buttons" })}`;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        if (cancelled || !window.paypal) return;

        buttons = window.paypal.Buttons({
          style: { shape: "pill", color: "gold", layout: "vertical", label: "paypal", height: 48 },
          createOrder: async () => {
            const response = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify(booking),
            });
            const result = await response.json();
            if (!response.ok || !result.orderId) throw new Error(result.error || "Order creation failed");
            return result.orderId;
          },
          onApprove: async (data) => {
            const response = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            });
            const result = await response.json();
            if (!response.ok || result.status !== "paid") throw new Error(result.error || "Payment verification failed");
            onSuccess(data.orderID);
          },
          onCancel: () => setStatus("cancelled"),
          onError: (error) => {
            console.error("PayPal checkout error", error);
            setStatus("error");
            onError();
          },
        });

        await buttons.render("#paypal-buttons");
        if (!cancelled) setStatus("ready");
      } catch (error) {
        console.error("PayPal setup error", error);
        if (!cancelled) setStatus(error.message === "config" ? "config" : "error");
      }
    }

    init();
    return () => {
      cancelled = true;
      buttons?.close?.();
    };
  }, [booking, onError, onSuccess]);

  const messages = {
    loading: "جارٍ تجهيز الدفع الآمن…",
    config: "لم يتم إعداد PayPal بعد. أضف متغيرات البيئة الموضحة في PAYPAL_SETUP.md.",
    error: "تعذر تحميل الدفع. تحقق من اتصالك وإعدادات PayPal ثم حاول مجدداً.",
    cancelled: "أُلغيت عملية الدفع. لم يتم تأكيد الحجز.",
  };

  return (
    <div className="mt-5 rounded-2xl border border-sand-200 bg-sand-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-bold text-ink">الدفع الآمن عبر PayPal</p>
          <p className="mt-1 text-xs text-muted">لن نطلب منك بيانات البطاقة على هذا الموقع.</p>
        </div>
        <ShieldCheck className="h-6 w-6 shrink-0 text-forest" aria-hidden="true" />
      </div>
      <div id="paypal-buttons" />
      {status !== "ready" && (
        <p className={`text-center text-sm ${["error", "config", "cancelled"].includes(status) ? "text-red-700" : "text-muted"}`} role="status">
          {messages[status]}
        </p>
      )}
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState("chefchaouen");
  const [travelers, setTravelers] = useState(1);
  const [booking, setBooking] = useState(null);
  const [notice, setNotice] = useState("");

  const selected = useMemo(() => trips.find((trip) => trip.id === selectedTrip) || trips[0], [selectedTrip]);

  const onPaymentSuccess = useCallback((orderId) => {
    setBooking(null);
    document.getElementById("booking-form")?.reset();
    setTravelers(1);
    setNotice(`تم الدفع وتأكيد الحجز بنجاح. رقم الطلب: ${orderId}`);
  }, []);

  const onPaymentError = useCallback(() => setNotice("تعذر إتمام الدفع. لم يتم تأكيد الحجز؛ يمكنك المحاولة مرة أخرى."), []);

  function submitBooking(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextBooking = {
      customer: String(data.get("customer")).trim(),
      email: String(data.get("email")).trim(),
      phone: String(data.get("phone")).trim(),
      trip: String(data.get("trip")),
      date: String(data.get("date")),
      travelers: Number(data.get("travelers")),
    };
    setSelectedTrip(nextBooking.trip);
    setBooking(nextBooking);
    setNotice("");
  }

  return (
    <div className="min-h-screen overflow-hidden bg-sand-50 text-ink">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Brand light />
          <nav className="hidden items-center gap-9 text-sm font-medium text-white/85 md:flex" aria-label="التنقل الرئيسي">
            <a className="hover:text-white" href="#destinations">وجهاتنا</a>
            <a className="hover:text-white" href="#story">عن الرحلة</a>
            <a className="hover:text-white" href="#reviews">آراء العملاء</a>
            <a className="hover:text-white" href="#booking">الحجز</a>
          </nav>
          <a href="#booking" className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-bold text-forest transition hover:bg-sand-100 sm:inline-flex">
            خطط رحلتك <ArrowLeft className="mr-2 h-4 w-4" />
          </a>
          <button className="rounded-xl bg-white/15 p-2 text-white md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mx-5 rounded-2xl bg-white p-4 text-ink shadow-xl md:hidden" aria-label="قائمة الهاتف">
            <a className="block rounded-xl p-3 hover:bg-sand-100" href="#destinations" onClick={() => setMenuOpen(false)}>وجهاتنا</a>
            <a className="block rounded-xl p-3 hover:bg-sand-100" href="#story" onClick={() => setMenuOpen(false)}>عن الرحلة</a>
            <a className="block rounded-xl p-3 hover:bg-sand-100" href="#reviews" onClick={() => setMenuOpen(false)}>آراء العملاء</a>
            <a className="block rounded-xl p-3 hover:bg-sand-100" href="#booking" onClick={() => setMenuOpen(false)}>الحجز</a>
          </nav>
        )}
      </header>

      <main>
        <section id="home" className="relative flex min-h-[720px] items-end overflow-hidden bg-[#1d302d] sm:min-h-[780px]">
          <img className="absolute inset-0 h-full w-full object-cover object-center" src="https://images.unsplash.com/photo-1565689478170-6624de9575e0?auto=format&fit=crop&w=2400&q=90" alt="مشهد بانورامي للأزقة الزرقاء في شفشاون" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101d1a]/85 via-[#14221f]/35 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#101d1a]/35 to-transparent" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-40 sm:px-8 sm:pb-24 lg:px-12">
            <div className="max-w-3xl text-white">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
                <MapPin className="h-4 w-4 text-[#f3c68b]" /> شفشاون، المغرب <span className="mx-1 text-white/50">·</span> 35°10′ شمالاً
              </div>
              <h1 className="font-display text-5xl font-semibold leading-[1.18] tracking-tight sm:text-6xl lg:text-8xl">
                هناك أماكن<br />تُشبه <span className="text-[#f3c68b]">الحلم.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
                دع الأزرق يقودك إلى شفشاون، واكتشف المغرب بتأنٍّ؛ حكايات دافئة، دروب قديمة، ولحظات تبقى معك.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href="#destinations" className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 font-bold text-forest shadow-lg transition hover:-translate-y-0.5 hover:bg-sand-100">
                  اكتشف الوجهات <ArrowLeft className="h-4 w-4" />
                </a>
                <a href="#story" className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white/90">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/40"><ArrowDown className="h-4 w-4" /></span>
                  حكاية المغرب
                </a>
              </div>
            </div>

            <div className="mt-16 flex items-center justify-between border-t border-white/25 pt-5 text-xs text-white/75 sm:text-sm">
              <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#f3c68b]" /> تجارب محلية، بذكريات استثنائية</span>
              <span className="hidden sm:inline">01 — 03 <span className="mx-2 text-white/35">|</span> شفشاون</span>
            </div>
          </div>
          <div className="absolute bottom-28 left-8 hidden -rotate-90 text-[10px] tracking-[.35em] text-white/60 lg:block">RIHLA · اكتشف · تمهّل</div>
        </section>

        <section id="story" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[.8fr_1.2fr] lg:items-end lg:px-12">
          <div>
            <p className="section-kicker"><span /> السفر كما ينبغي أن يكون</p>
            <h2 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
              ليس مجرد وجهة.<br /><span className="text-terracotta">إنها حكاية تعيشها.</span>
            </h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-lg leading-9 text-muted">من أول رشفة شاي بالنعناع إلى آخر ضوء يغيب خلف الكثبان؛ نرتب لك تجارب صادقة، صغيرة التفاصيل، وكبيرة في أثرها.</p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="rounded-full bg-white px-4 py-2.5 shadow-soft">✦ مرشدون من أهل المكان</span>
              <span className="rounded-full bg-white px-4 py-2.5 shadow-soft">✦ مجموعات صغيرة</span>
              <span className="rounded-full bg-white px-4 py-2.5 shadow-soft">✦ خطط مرنة</span>
            </div>
          </div>
        </section>

        <section id="destinations" className="bg-[#f0eee7] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
              <div>
                <p className="section-kicker"><span /> اختياراتنا لهذا الموسم</p>
                <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">وجهات تُناديك</h2>
              </div>
              <a href="#booking" className="group inline-flex items-center gap-2 text-sm font-bold text-forest">
                كل الرحلات تبدأ بخطوة <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              </a>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {trips.map((trip, index) => (
                <article key={trip.id} className={`group overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift ${index === 1 ? "md:mt-8" : ""}`}>
                  <div className="relative h-72 overflow-hidden sm:h-80">
                    <img src={trip.image} alt={trip.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink backdrop-blur">{trip.tag}</span>
                    <span className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-xl">{trip.emoji}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                      <MapPin className="h-3.5 w-3.5" />{trip.region}
                      <span className="mx-1">·</span>
                      <CalendarDays className="h-3.5 w-3.5" />{trip.days}
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <h3 className="font-display text-2xl font-semibold">{trip.name}</h3>
                        <p className="mt-1 text-sm text-muted">مناظر، مذاقات ولقاءات محلية</p>
                      </div>
                      <div className="text-left">
                        <span className="text-xs text-muted">ابتداءً من</span>
                        <p className="font-bold text-forest">{money(trip.price)}<span className="text-xs font-normal text-muted"> / شخص</span></p>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedTrip(trip.id); document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" }); }} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-sand-200 py-3 text-sm font-bold text-forest transition hover:border-forest hover:bg-forest hover:text-white">
                      اختر هذه الرحلة <ArrowLeft className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
          <div className="mb-10 flex items-end justify-between gap-5">
            <div>
              <p className="section-kicker"><span /> تجاربنا</p>
              <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">ماذا يقدّم لك Rihla؟</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {experiences.map((item, idx) => (
              <article key={item.title} className="rounded-[1.5rem] border border-sand-200 bg-white p-6 shadow-soft">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-lg text-white">{idx + 1}</div>
                <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-base leading-8 text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-forest py-16 text-white sm:py-20">
          <div className="absolute -left-20 -top-32 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -left-8 -top-20 h-56 w-56 rounded-full border border-white/10" />
          <div className="relative mx-auto grid max-w-7xl gap-9 px-5 sm:px-8 md:grid-cols-3 lg:px-12">
            <div className="md:col-span-1">
              <p className="text-sm font-semibold text-[#f3c68b]">لماذا Rihla؟</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">المغرب، كما يعرفه أهله.</h2>
            </div>
            <div className="grid gap-7 sm:grid-cols-2 md:col-span-2">
              <div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10"><Compass /></span><div><h3 className="font-bold">اختيارات محلية</h3><p className="mt-1 text-sm leading-6 text-white/65">أماكن يعرفها أهلها، لا خرائط السياح فقط.</p></div></div>
              <div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10"><Users /></span><div><h3 className="font-bold">على مقاسك</h3><p className="mt-1 text-sm leading-6 text-white/65">رحلات مرنة ومجموعات صغيرة لتستمتع بكل لحظة.</p></div></div>
              <div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10"><ShieldCheck /></span><div><h3 className="font-bold">حجز مطمئن</h3><p className="mt-1 text-sm leading-6 text-white/65">دفع PayPal آمن وتأكيد واضح لحجزك.</p></div></div>
              <div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10"><Sparkles /></span><div><h3 className="font-bold">تفاصيل تصنع الفرق</h3><p className="mt-1 text-sm leading-6 text-white/65">نهتم بالتفاصيل الصغيرة لتبقى الرحلة في ذاكرتك.</p></div></div>
            </div>
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
          <div className="mb-10">
            <p className="section-kicker"><span /> آراء المسافرين</p>
            <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">رحلات تُذكر</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((person) => (
              <article key={person.name} className="rounded-[1.5rem] border border-sand-200 bg-white p-6 shadow-soft">
                <div className="mb-4 flex items-center gap-1 text-[#dba350]">
                  {Array.from({ length: 5 }).map((_, idx) => <Star key={idx} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-lg leading-8 text-muted">“{person.note}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-sand-100 text-xs font-bold text-forest">{person.name.slice(0, 2)}</span>
                  <div>
                    <p className="font-bold text-ink">{person.name}</p>
                    <p className="text-xs text-muted">مسافر من Rihla</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#f7f3eb] py-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12">
            <div className="mb-10 text-center">
              <p className="section-kicker justify-center"><span /> الأسئلة المتكررة</p>
              <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">الأسئلة الشائعة</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-[1.3rem] border border-sand-200 bg-white p-5 shadow-soft">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-bold text-ink">{item.q}</p>
                    <ChevronLeft className="h-5 w-5 text-forest" />
                  </div>
                  <p className="mt-3 leading-8 text-muted">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="booking" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[.8fr_1.2fr] lg:px-12">
          <div className="lg:pt-8">
            <p className="section-kicker"><span /> خطوتك التالية</p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              دعنا نخطط<br />لشيء <span className="text-terracotta">جميل.</span>
            </h2>
            <p className="mt-5 max-w-md leading-8 text-muted">أخبرنا بما تحب، وسنجهز لك بداية رحلة تستحق الانتظار. الأسعار باليورو للشخص الواحد.</p>
            <div className="mt-8 flex items-center gap-3 text-sm text-muted"><span className="grid h-10 w-10 place-items-center rounded-full bg-white text-forest shadow-soft"><ShieldCheck className="h-5 w-5" /></span> الدفع لا يتم إلا عبر PayPal الآمن</div>
            <div className="mt-3 flex items-center gap-3 text-sm text-muted"><span className="grid h-10 w-10 place-items-center rounded-full bg-white text-forest shadow-soft"><Check className="h-5 w-5" /></span> تأكيد الحجز بعد التحقق من الدفع</div>
          </div>

          <div className="rounded-[1.75rem] border border-sand-200 bg-white p-5 shadow-soft sm:p-8">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold">طلب حجز رحلة</h3>
                <p className="mt-1 text-sm text-muted">املأ التفاصيل لنجهز لك الحجز</p>
              </div>
              <span className="rounded-full bg-sand-100 px-3 py-1.5 text-xs font-bold text-forest">خطوة 1 من 2</span>
            </div>

            <form id="booking-form" onSubmit={submitBooking} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><label htmlFor="customer" className="form-label">الاسم الكامل</label><input id="customer" name="customer" className="form-input" required maxLength="80" autoComplete="name" placeholder="مثال: سلمى العلوي" /></div>
              <div><label htmlFor="email" className="form-label">البريد الإلكتروني</label><input id="email" name="email" type="email" className="form-input" required maxLength="120" autoComplete="email" placeholder="name@example.com" /></div>
              <div><label htmlFor="phone" className="form-label">رقم الهاتف</label><input id="phone" name="phone" type="tel" className="form-input" required maxLength="20" autoComplete="tel" placeholder="+212 6 00 00 00 00" /></div>
              <div><label htmlFor="trip" className="form-label">الوجهة</label><select id="trip" name="trip" className="form-input" value={selectedTrip} onChange={(event) => setSelectedTrip(event.target.value)}>{trips.map((trip) => <option value={trip.id} key={trip.id}>{trip.name} — {money(trip.price)}</option>)}</select></div>
              <div><label htmlFor="travel-date" className="form-label">تاريخ الرحلة</label><input id="travel-date" name="date" type="date" min={today} className="form-input" required /></div>
              <div><label htmlFor="travelers" className="form-label">عدد المسافرين</label><input id="travelers" name="travelers" type="number" min="1" max="50" value={travelers} onChange={(event) => setTravelers(Number(event.target.value) || 1)} className="form-input" required /></div>
              <div className="flex items-end">
                <div className="flex w-full items-center justify-between rounded-xl bg-sand-50 px-4 py-3">
                  <span className="text-sm text-muted">الإجمالي التقديري</span>
                  <span className="font-bold text-forest">{money(selected.price * travelers)}</span>
                </div>
              </div>
              <label className="checkbox-row sm:col-span-2"><input type="checkbox" required /><span>أوافق على شروط الحجز وسياسة الخصوصية.</span></label>
              <div className="sm:col-span-2"><button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 font-bold text-white transition hover:bg-[#173d34]" type="submit">متابعة إلى الدفع الآمن <ArrowLeft className="h-4 w-4" /></button></div>
            </form>

            {booking && <PaypalCheckout key={`${booking.trip}-${booking.travelers}-${booking.date}`} booking={booking} onSuccess={onPaymentSuccess} onError={onPaymentError} />}
            {notice && <p className="mt-4 rounded-xl bg-sand-50 px-4 py-3 text-sm font-medium text-forest" role="status" aria-live="polite">{notice}</p>}
            <p className="mt-4 text-center text-xs leading-6 text-muted"><ShieldCheck className="ml-1 inline h-3.5 w-3.5" /> لن يتم تأكيد الحجز إلا بعد التحقق من PayPal على الخادم.</p>
          </div>
        </section>
      </main>

      <footer className="bg-[#172a25] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <Brand light />
          <p className="text-sm text-white/60">Rihla — المغرب أقرب مما تتخيل.</p>
          <a href="#home" className="inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-white">إلى الأعلى <ArrowUpLeft className="h-4 w-4" /></a>
        </div>
      </footer>
    </div>
  );
}
