
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
                      heroTitle: "اكتشف جمال المغرب",
                          heroText: "رحلات مميزة بين المدن التاريخية والصحراء والشواطئ.",
                              exploreBtn: "اكتشف الرحلات",
                                  tripsTitle: "وجهاتنا السياحية",
                                      merzougaTitle: "مرزوكة",
                                          merzougaText: "اكتشف سحر الصحراء المغربية.",
                                              marrakechTitle: "مراكش",
                                                  marrakechText: "اكتشف الأسواق والتراث التاريخي.",
                                                      chefchaouenTitle: "شفشاون",
                                                          chefchaouenText: "استمتع بالأزقة الزرقاء الجميلة.",
                                                              merzougaBtn: "احجز رحلة",
                                                                  marrakechBtn: "احجز رحلة",
                                                                      chefchaouenBtn: "احجز رحلة",
                                                                          formTitle: "طلب حجز رحلة",
                                                                              nameLabel: "الاسم الكامل",
                                                                                  tripLabel: "الرحلة",
                                                                                      dateLabel: "تاريخ الرحلة",
                                                                                          peopleLabel: "عدد المسافرين",
                                                                                              submitBtn: "إرسال طلب الحجز",
                                                                                                  footerText: "Morocco Travel — اكتشف المغرب",
                                                                                                      options: ["مرزوكة", "مراكش", "شفشاون"]
                                                                                                        },
                                                                                                          fr: {
                                                                                                              languageBtn: "العربية",
                                                                                                                  homeLink: "Accueil",
                                                                                                                      tripsLink: "Excursions",
                                                                                                                          bookingLink: "Réservation",
                                                                                                                              heroTitle: "Découvrez la beauté du Maroc",
                                                                                                                                  heroText: "Des voyages entre villes historiques, désert et plages.",
                                                                                                                                      exploreBtn: "Découvrir les excursions",
                                                                                                                                          tripsTitle: "Nos destinations",
                                                                                                                                              merzougaTitle: "Merzouga",
                                                                                                                                                  merzougaText: "Découvrez la magie du désert marocain.",
                                                                                                                                                      marrakechTitle: "Marrakech",
                                                                                                                                                          marrakechText: "Explorez les souks et le patrimoine historique.",
                                                                                                                                                              chefchaouenTitle: "Chefchaouen",
                                                                                                                                                                  chefchaouenText: "Profitez des magnifiques ruelles bleues.",
                                                                                                                                                                      merzougaBtn: "Réserver",
                                                                                                                                                                          marrakechBtn: "Réserver",
                                                                                                                                                                              chefchaouenBtn: "Réserver",
                                                                                                                                                                                  formTitle: "Demande de réservation",
                                                                                                                                                                                      nameLabel: "Nom complet",
                                                                                                                                                                                          tripLabel: "Excursion",
                                                                                                                                                                                              dateLabel: "Date du voyage",
                                                                                                                                                                                                  peopleLabel: "Nombre de voyageurs",
                                                                                                                                                                                                      submitBtn: "Envoyer la demande",
                                                                                                                                                                                                          footerText: "Morocco Travel — Découvrez le Maroc",
                                                                                                                                                                                                              options: ["Merzouga", "Marrakech", "Chefchaouen"]
                                                                                                                                                                                                                }
                                                                                                                                                                                                                };

                                                                                                                                                                                                                function changeLanguage() {
                                                                                                                                                                                                                  language = language === "ar" ? "fr" : "ar";
                                                                                                                                                                                                                    const t = translations[language];

                                                                                                                                                                                                                      document.documentElement.lang = language;
                                                                                                                                                                                                                        document.documentElement.dir =
                                                                                                                                                                                                                            language === "ar" ? "rtl" : "ltr";

                                                                                                                                                                                                                              Object.keys(t).forEach(key => {
                                                                                                                                                                                                                                  const element = document.getElementById(key);
                                                                                                                                                                                                                                      if (element && key !== "options") {
                                                                                                                                                                                                                                            element.textContent = t[key];
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                  });

                                                                                                                                                                                                                                                    [...tripSelect.options].forEach((option, index) => {
                                                                                                                                                                                                                                                        option.textContent = t.options[index];
                                                                                                                                                                                                                                                          });

                                                                                                                                                                                                                                                            message.textContent = "";
                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                            languageBtn.addEventListener("click", changeLanguage);

                                                                                                                                                                                                                                                            document.querySelectorAll(".bookBtn").forEach(button => {
                                                                                                                                                                                                                                                              button.addEventListener("click", () => {
                                                                                                                                                                                                                                                                  tripSelect.value = button.dataset.trip;
                                                                                                                                                                                                                                                                      document.getElementById("booking").scrollIntoView();
                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                        });

                                                                                                                                                                                                                                                                        const today = new Date();
                                                                                                                                                                                                                                                                        const localToday = new Date(
                                                                                                                                                                                                                                                                          today.getTime() - today.getTimezoneOffset() * 60000
                                                                                                                                                                                                                                                                          ).toISOString().slice(0, 10);

                                                                                                                                                                                                                                                                          dateInput.min = localToday;

                                                                                                                                                                                                                                                                          form.addEventListener("submit", event => {
                                                                                                                                                                                                                                                                            event.preventDefault();

                                                                                                                                                                                                                                                                              message.textContent = language === "ar"
                                                                                                                                                                                                                                                                                  ? "تم التحقق من النموذج فقط. لم يتم إرسال الحجز أو حفظه بعد."
                                                                                                                                                                                                                                                                                      : "Formulaire vérifié uniquement. La réservation n’a pas encore été envoyée ni enregistrée.";
                                                                                                                                                                                                                                                                                      });
                                                                                                                                                                                                                                                                                      