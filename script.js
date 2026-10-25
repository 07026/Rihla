const languageBtn = document.getElementById("languageBtn");
const form = document.getElementById("bookingForm");
const tripSelect = document.getElementById("trip");
const dateInput = document.getElementById("date");
const message = document.getElementById("message");

let language = "ar";

const translations = {
  ar: {
    languageBtn: "Français",
    homeLink: "الرئيسية",
    tripsLink: "الرحلات",
    bookingLink: "الحجز",
    eyebrow: "من أجمل الوجهات في شمال إفريقيا",
    heroTitle: "اكتشف جمال المغرب",
    heroText: "رحلات مميزة بين المدن التاريخية، الصحراء الذهبية والشواطئ الخضراء.",
    exploreBtn: "اكتشف الرحلات",
    planBtn: "خطط رحلتك",
    statTravelers: "مسافر سنوياً",
    statCities: "مدينة",
    statRating: "تقييم المسافرين",
    visualTitle: "الريف والجبال",
    visualCity: "مراكش",
    tripsIntro: "وجهاتنا السياحية",
    tripsTitle: "اكتشف مغربك المثالي",
    merzougaTitle: "مرزوكة",
    merzougaText: "اكتشف سحر الصحراء المغربية في أجواء هادئة ومميزة.",
    marrakechTitle: "مراكش",
    marrakechText: "استمتع بالأسواق التقليدية والمعالم التاريخية والحدائق.",
    chefchaouenTitle: "شفشاون",
    chefchaouenText: "اكتشف الأزقة الزرقاء والمناظر الطبيعية الخلابة.",
    merzougaBtn: "احجز رحلة",
    marrakechBtn: "احجز رحلة",
    chefchaouenBtn: "احجز رحلة",
    featureExploreTitle: "رحلات مخصصة",
    featureExploreText: "نصمم لك برنامجاً يتناسب مع ذوقك وميزانيتك.",
    featureStayTitle: "إقامات فاخرة",
    featureStayText: "منزل أنيق، فندق فاخر، أو منتجع شاطئي حسب رغبتك.",
    featureGuideTitle: "مرشدون محليون",
    featureGuideText: "خبراء محليون يرافقونك في كل خطوة من رحلتك.",
    bookingIntro: "حجز سريع",
    bookingTitle: "احجز رحلتك إلى المغرب",
    bookingText: "اختر الوجهة المناسبة لك وسنقوم بالتأكيد في أقل من 24 ساعة.",
    formTitle: "طلب حجز رحلة",
    nameLabel: "الاسم الكامل",
    tripLabel: "الرحلة",
    dateLabel: "تاريخ الرحلة",
    peopleLabel: "عدد المسافرين",
    submitBtn: "إرسال طلب الحجز",
    footerText: "Morocco Travel — اكتشف المغرب",
    options: ["مرزوكة", "مراكش", "شفشاون"],
    success: (customer, trip) => `شكرًا ${customer}! تم تسجيل طلبك لحجز ${trip}.`,
    tripError: "يرجى إدخال اسمك الكامل قبل إرسال الحجز.",
    defaultMessage: "تم إرسال طلبك بنجاح. سنتواصل معك قريباً."
  },
  fr: {
    languageBtn: "العربية",
    homeLink: "Accueil",
    tripsLink: "Excursions",
    bookingLink: "Réservation",
    eyebrow: "Parmi les plus belles destinations d’Afrique du Nord",
    heroTitle: "Découvrez la beauté du Maroc",
    heroText: "Des voyages entre villes historiques, désert doré et plages magnifiques.",
    exploreBtn: "Découvrir les excursions",
    planBtn: "Planifier un voyage",
    statTravelers: "voyageurs / an",
    statCities: "villes",
    statRating: "note des voyageurs",
    visualTitle: "Campagnes et montagnes",
    visualCity: "Marrakech",
    tripsIntro: "Nos destinations",
    tripsTitle: "Trouvez le Maroc qui vous ressemble",
    merzougaTitle: "Merzouga",
    merzougaText: "Découvrez la magie du désert marocain dans un cadre paisible.",
    marrakechTitle: "Marrakech",
    marrakechText: "Profitez des souks, des monuments historiques et des jardins.",
    chefchaouenTitle: "Chefchaouen",
    chefchaouenText: "Explorez les ruelles bleues et les paysages époustouflants.",
    merzougaBtn: "Réserver",
    marrakechBtn: "Réserver",
    chefchaouenBtn: "Réserver",
    featureExploreTitle: "Voyages personnalisés",
    featureExploreText: "Nous concevons un programme sur mesure selon vos goûts et votre budget.",
    featureStayTitle: "Hébergement haut de gamme",
    featureStayText: "Maison élégante, hôtel de luxe ou station balnéaire selon votre choix.",
    featureGuideTitle: "Guides locaux",
    featureGuideText: "Des experts locaux vous accompagnent à chaque étape du voyage.",
    bookingIntro: "Réservation rapide",
    bookingTitle: "Réservez votre voyage au Maroc",
    bookingText: "Choisissez votre destination et nous vous confirmerons sous 24 heures.",
    formTitle: "Demande de réservation",
    nameLabel: "Nom complet",
    tripLabel: "Voyage",
    dateLabel: "Date du voyage",
    peopleLabel: "Nombre de voyageurs",
    submitBtn: "Envoyer la demande",
    footerText: "Morocco Travel — Découvrez le Maroc",
    options: ["Merzouga", "Marrakech", "Chefchaouen"],
    success: (customer, trip) => `Merci ${customer} ! Votre demande de réservation pour ${trip} a bien été enregistrée.`,
    tripError: "Veuillez saisir votre nom complet avant d’envoyer la demande.",
    defaultMessage: "Votre demande a bien été envoyée. Nous vous répondrons très prochainement."
  }
};

function applyTranslations() {
  const t = translations[language];

  const textTargets = {
    homeLink: "homeLink",
    tripsLink: "tripsLink",
    bookingLink: "bookingLink",
    eyebrow: "eyebrow",
    heroTitle: "heroTitle",
    heroText: "heroText",
    exploreBtn: "exploreBtn",
    planBtn: "planBtn",
    statTravelers: "statTravelers",
    statCities: "statCities",
    statRating: "statRating",
    visualTitle: "visualTitle",
    visualCity: "visualCity",
    tripsIntro: "tripsIntro",
    tripsTitle: "tripsTitle",
    merzougaTitle: "merzougaTitle",
    merzougaText: "merzougaText",
    marrakechTitle: "marrakechTitle",
    marrakechText: "marrakechText",
    chefchaouenTitle: "chefchaouenTitle",
    chefchaouenText: "chefchaouenText",
    merzougaBtn: "merzougaBtn",
    marrakechBtn: "marrakechBtn",
    chefchaouenBtn: "chefchaouenBtn",
    featureExploreTitle: "featureExploreTitle",
    featureExploreText: "featureExploreText",
    featureStayTitle: "featureStayTitle",
    featureStayText: "featureStayText",
    featureGuideTitle: "featureGuideTitle",
    featureGuideText: "featureGuideText",
    bookingIntro: "bookingIntro",
    bookingTitle: "bookingTitle",
    bookingText: "bookingText",
    formTitle: "formTitle",
    nameLabel: "nameLabel",
    tripLabel: "tripLabel",
    dateLabel: "dateLabel",
    peopleLabel: "peopleLabel",
    submitBtn: "submitBtn",
    footerText: "footerText"
  };

  Object.entries(textTargets).forEach(([key, id]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = t[key];
    }
  });

  languageBtn.textContent = t.languageBtn;

  const tripOptions = [...tripSelect.options];
  tripOptions.forEach((option, index) => {
    option.textContent = t.options[index];
  });

  document.documentElement.lang = language;
  document.documentElement.dir = "rtl";
}

languageBtn.addEventListener("click", () => {
  language = language === "ar" ? "fr" : "ar";
  applyTranslations();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const customer = document.getElementById("customer").value.trim();

  if (!customer) {
    message.textContent = translations[language].tripError;
    return;
  }

  const tripKey = tripSelect.value;
  const tripName = translations[language].options[tripSelect.selectedIndex];
  message.textContent = translations[language].success(customer, tripName);

  form.reset();
  tripSelect.value = tripKey;
});

[...document.querySelectorAll(".bookBtn")].forEach((button) => {
  button.addEventListener("click", () => {
    const trip = button.dataset.trip;
    tripSelect.value = trip;
    document.getElementById("booking").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

applyTranslations();
