const languageBtn = document.getElementById("languageBtn");
const form = document.getElementById("bookingForm");
const tripSelect = document.getElementById("trip");
const dateInput = document.getElementById("date");
const peopleInput = document.getElementById("people");
const paymentMethod = document.getElementById("paymentMethod");
const message = document.getElementById("message");

let language = "ar";

const tripPrices = {
  merzouga: 1800,
  marrakech: 1200,
  chefchaouen: 900,
};

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
    secureHead: "دفع آمن",
    secureText: "معلوماتك محمية باستخدام تشفير متقدم.",
    formTitle: "طلب حجز رحلة",
    nameLabel: "الاسم الكامل",
    emailLabel: "البريد الإلكتروني",
    phoneLabel: "رقم الهاتف",
    tripLabel: "الرحلة",
    dateLabel: "تاريخ الرحلة",
    peopleLabel: "عدد المسافرين",
    paymentLabel: "طريقة الدفع",
    summaryTripLabel: "الرحلة:",
    summaryPeopleLabel: "المسافرون:",
    summaryTotalLabel: "إجمالي المبلغ:",
    termsText: "أوافق على الشروط وسياسة الخصوصية.",
    submitBtn: "إرسال طلب الحجز",
    footerText: "Morocco Travel — اكتشف المغرب",
    options: ["مرزوكة", "مراكش", "شفشاون"],
    paymentOptions: ["بطاقة فيزا", "باي بال", "Apple Pay", "الدفع عند الوصول"],
    emptyName: "يرجى إدخال الاسم الكامل قبل إرسال الحجز.",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
    invalidPhone: "يرجى إدخال رقم هاتف صحيح.",
    invalidDate: "يرجى اختيار تاريخ سفر مستقبلي.",
    termsRequired: "يجب الموافقة على الشروط قبل إتمام الحجز.",
    success: (customer, trip, method, total) => `تم تأكيد حجز ${customer} بنجاح لرحلة ${trip} عبر ${method} بقيمة ${total} درهم. سيصلك تأكيد الحجز عبر البريد الإلكتروني في أقرب وقت.`
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
    secureHead: "Paiement sécurisé",
    secureText: "Vos informations sont protégées par un chiffrement avancé.",
    formTitle: "Demande de réservation",
    nameLabel: "Nom complet",
    emailLabel: "E-mail",
    phoneLabel: "Téléphone",
    tripLabel: "Voyage",
    dateLabel: "Date du voyage",
    peopleLabel: "Nombre de voyageurs",
    paymentLabel: "Mode de paiement",
    summaryTripLabel: "Voyage :",
    summaryPeopleLabel: "Voyageurs :",
    summaryTotalLabel: "Montant total :",
    termsText: "J’accepte les conditions et la politique de confidentialité.",
    submitBtn: "Envoyer la demande",
    footerText: "Morocco Travel — Découvrez le Maroc",
    options: ["Merzouga", "Marrakech", "Chefchaouen"],
    paymentOptions: ["Carte Visa", "PayPal", "Apple Pay", "Paiement à l’arrivée"],
    emptyName: "Veuillez saisir votre nom complet avant de valider la réservation.",
    invalidEmail: "Veuillez saisir une adresse e-mail valide.",
    invalidPhone: "Veuillez saisir un numéro de téléphone valide.",
    invalidDate: "Veuillez sélectionner une date de voyage future.",
    termsRequired: "Vous devez accepter les conditions avant de confirmer la réservation.",
    success: (customer, trip, method, total) => `La réservation de ${customer} a bien été confirmée pour ${trip} via ${method} pour un montant total de ${total} MAD. Vous recevrez une confirmation par e-mail rapidement.`
  }
};

function getSelectedTrip() {
  return tripSelect.value;
}

function getPriceForTrip(trip) {
  return tripPrices[trip] || 0;
}

function formatPrice(value) {
  return `${value.toLocaleString("fr-FR")} درهم`;
}

function updateSummary() {
  const trip = getSelectedTrip();
  const people = Number(peopleInput.value) || 1;
  const price = getPriceForTrip(trip);
  const total = price * people;

  const tripName = translations[language].options[tripSelect.selectedIndex] || trip;
  document.getElementById("summaryTrip").textContent = tripName;
  document.getElementById("summaryPeople").textContent = String(people);
  document.getElementById("summaryTotal").textContent = formatPrice(total);
}

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
    secureHead: "secureHead",
    secureText: "secureText",
    formTitle: "formTitle",
    nameLabel: "nameLabel",
    emailLabel: "emailLabel",
    phoneLabel: "phoneLabel",
    tripLabel: "tripLabel",
    dateLabel: "dateLabel",
    peopleLabel: "peopleLabel",
    paymentLabel: "paymentLabel",
    summaryTripLabel: "summaryTripLabel",
    summaryPeopleLabel: "summaryPeopleLabel",
    summaryTotalLabel: "summaryTotalLabel",
    termsText: "termsText",
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

  const paymentOptions = [...paymentMethod.options];
  paymentOptions.forEach((option, index) => {
    option.textContent = t.paymentOptions[index];
  });

  document.documentElement.lang = language;
  document.documentElement.dir = "rtl";

  updateSummary();
}

languageBtn.addEventListener("click", () => {
  language = language === "ar" ? "fr" : "ar";
  applyTranslations();
});

tripSelect.addEventListener("change", updateSummary);
peopleInput.addEventListener("input", updateSummary);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const customer = document.getElementById("customer").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const selectedDate = dateInput.value;
  const selectedTrip = tripSelect.value;
  const selectedPayment = paymentMethod.value;
  const agreed = document.getElementById("terms").checked;

  if (!customer) {
    message.textContent = translations[language].emptyName;
    message.style.color = "var(--danger)";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    message.textContent = translations[language].invalidEmail;
    message.style.color = "var(--danger)";
    return;
  }

  const phoneRegex = /^\+?[0-9\s-]{8,20}$/;
  if (!phoneRegex.test(phone)) {
    message.textContent = translations[language].invalidPhone;
    message.style.color = "var(--danger)";
    return;
  }

  if (!selectedDate) {
    message.textContent = translations[language].invalidDate;
    message.style.color = "var(--danger)";
    return;
  }

  const today = new Date();
  const chosenDate = new Date(selectedDate + "T00:00:00");
  if (chosenDate <= today) {
    message.textContent = translations[language].invalidDate;
    message.style.color = "var(--danger)";
    return;
  }

  if (!agreed) {
    message.textContent = translations[language].termsRequired;
    message.style.color = "var(--danger)";
    return;
  }

  const total = getPriceForTrip(selectedTrip) * Number(peopleInput.value || 1);
  const tripName = translations[language].options[tripSelect.selectedIndex];
  const paymentName = translations[language].paymentOptions[paymentMethod.selectedIndex];

  const reservation = {
    customer,
    email,
    phone,
    trip: tripName,
    date: selectedDate,
    travelers: Number(peopleInput.value || 1),
    payment: paymentName,
    total,
    createdAt: new Date().toISOString(),
  };

  const saved = JSON.parse(localStorage.getItem("moroccoTravelBookings") || "[]");
  saved.push(reservation);
  localStorage.setItem("moroccoTravelBookings", JSON.stringify(saved));

  message.textContent = translations[language].success(customer, tripName, paymentName, total.toLocaleString("fr-FR"));
  message.style.color = "var(--success)";
  form.reset();
  tripSelect.value = selectedTrip;
  peopleInput.value = "1";
  dateInput.value = "";
  updateSummary();
});

[...document.querySelectorAll(".bookBtn")].forEach((button) => {
  button.addEventListener("click", () => {
    const trip = button.dataset.trip;
    tripSelect.value = trip;
    updateSummary();
    document.getElementById("booking").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

applyTranslations();
