const languageBtn = document.getElementById("languageBtn");
const form = document.getElementById("bookingForm");
const tripSelect = document.getElementById("trip");
const dateInput = document.getElementById("date");
const peopleInput = document.getElementById("people");
const paymentMethod = document.getElementById("paymentMethod");
const message = document.getElementById("message");
const checkoutWrap = document.getElementById("paypalCheckoutWrap");
const paypalContainer = document.getElementById("paypal-button-container");

let language = "ar";
let paypalSdkPromise;
let checkoutData;
let buttonsRendered = false;
const CURRENCY = "EUR";
const tripPrices = { merzouga: 150, marrakech: 100, chefchaouen: 75 };
const tripNames = {
  ar: { merzouga: "مرزوكة", marrakech: "مراكش", chefchaouen: "شفشاون" },
  fr: { merzouga: "Merzouga", marrakech: "Marrakech", chefchaouen: "Chefchaouen" },
};
const uiText = {
  ar: {
    language: "Français", paypalRequired: "أكمل بيانات الحجز ثم اضغط زر PayPal لإتمام الدفع.",
    invalidDate: "يرجى اختيار تاريخ سفر مستقبلي.", invalidPhone: "يرجى إدخال رقم هاتف صحيح.",
    sdkError: "تعذر تحميل PayPal. تحقق من الإعدادات وحاول مجدداً.",
    configError: "PayPal غير مهيأ بعد. أضف بيانات الاعتماد وإعدادات الخادم الموضحة في PAYPAL_SETUP.md.",
    cancel: "تم إلغاء الدفع. لم يتم تأكيد الحجز.", error: "تعذر إتمام الدفع. لم يتم تأكيد الحجز؛ حاول مرة أخرى.",
    success: "اكتمل الدفع وتم تأكيد الحجز. رقم الطلب: ", loading: "جارٍ تجهيز الدفع الآمن…",
  },
  fr: {
    language: "العربية", paypalRequired: "Complétez la réservation puis utilisez le bouton PayPal pour payer.",
    invalidDate: "Veuillez choisir une date de voyage future.", invalidPhone: "Veuillez saisir un numéro de téléphone valide.",
    sdkError: "PayPal n’a pas pu être chargé. Vérifiez la configuration et réessayez.",
    configError: "PayPal n’est pas encore configuré. Ajoutez les identifiants et paramètres serveur indiqués dans PAYPAL_SETUP.md.",
    cancel: "Paiement annulé. La réservation n’est pas confirmée.", error: "Le paiement a échoué. La réservation n’est pas confirmée ; réessayez.",
    success: "Paiement effectué et réservation confirmée. Référence : ", loading: "Préparation du paiement sécurisé…",
  },
};

function formatPrice(value) {
  return new Intl.NumberFormat(language === "ar" ? "fr-FR" : "fr-FR", { style: "currency", currency: CURRENCY }).format(value);
}

function updateSummary() {
  const trip = tripSelect.value;
  const travelers = Math.min(50, Math.max(1, Number(peopleInput.value) || 1));
  const name = tripNames[language][trip] || trip;
  const tripSummary = document.getElementById("summaryTrip");
  const peopleSummary = document.getElementById("summaryPeople");
  const totalSummary = document.getElementById("summaryTotal");
  if (tripSummary) tripSummary.textContent = name;
  if (peopleSummary) peopleSummary.textContent = String(travelers);
  if (totalSummary) totalSummary.textContent = formatPrice((tripPrices[trip] || 0) * travelers);
}

function setMessage(text, error = false) {
  message.textContent = text;
  message.style.color = error ? "var(--danger)" : "var(--success)";
}

function validateBooking() {
  if (!form.reportValidity()) return false;
  const chosenDate = new Date(`${dateInput.value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (chosenDate <= today) {
    setMessage(uiText[language].invalidDate, true);
    dateInput.focus();
    return false;
  }
  if (!/^\+?[0-9\s-]{8,20}$/.test(document.getElementById("phone").value.trim())) {
    setMessage(uiText[language].invalidPhone, true);
    document.getElementById("phone").focus();
    return false;
  }
  if (!document.getElementById("terms").checked) return false;
  return true;
}

async function loadPayPalSdk() {
  if (window.paypal) return window.paypal;
  if (!paypalSdkPromise) {
    paypalSdkPromise = fetch("/api/paypal/config", { headers: { Accept: "application/json" } })
      .then(async (response) => {
        const config = await response.json();
        if (!response.ok || !config.clientId) throw new Error("config");
        const script = document.createElement("script");
        const params = new URLSearchParams({ "client-id": config.clientId, currency: config.currency || CURRENCY, intent: "capture", components: "buttons", "disable-funding": "paylater" });
        script.src = `https://www.paypal.com/sdk/js?${params}`;
        script.async = true;
        document.head.appendChild(script);
        await new Promise((resolve, reject) => {
          script.addEventListener("load", resolve, { once: true });
          script.addEventListener("error", reject, { once: true });
        });
        if (!window.paypal) throw new Error("sdk");
        return window.paypal;
      });
  }
  try {
    return await paypalSdkPromise;
  } catch (error) {
    paypalSdkPromise = null;
    throw error;
  }
}

async function renderPayPalButtons() {
  if (buttonsRendered || !checkoutData) return;
  buttonsRendered = true;
  paypalContainer.replaceChildren();
  setMessage(uiText[language].loading);
  try {
    const paypal = await loadPayPalSdk();
    await paypal.Buttons({
      createOrder: async () => {
        const response = await fetch("/api/paypal/create-order", {
          method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(checkoutData),
        });
        const result = await response.json();
        if (!response.ok || !result.orderId) throw new Error(result.error || "Order creation failed");
        return result.orderId;
      },
      onApprove: async (data) => {
        const response = await fetch("/api/paypal/capture-order", {
          method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ orderId: data.orderID }),
        });
        const result = await response.json();
        if (!response.ok || result.status !== "paid") throw new Error(result.error || "Payment verification failed");
        setMessage(`${uiText[language].success}${data.orderID}`);
        form.reset();
        tripSelect.value = "merzouga";
        peopleInput.value = "1";
        checkoutData = null;
        checkoutWrap.classList.add("hidden");
        updateSummary();
      },
      onCancel: () => setMessage(uiText[language].cancel, true),
      onError: (error) => {
        console.error("PayPal checkout error", error);
        setMessage(uiText[language].error, true);
      },
    }).render(paypalContainer);
    setMessage("");
  } catch (error) {
    console.error("PayPal setup error", error);
    setMessage(error.message === "config" ? uiText[language].configError : uiText[language].sdkError, true);
    buttonsRendered = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateBooking()) return;
  checkoutData = {
    customer: document.getElementById("customer").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    trip: tripSelect.value,
    date: dateInput.value,
    travelers: Number(peopleInput.value),
  };
  checkoutWrap.classList.remove("hidden");
  setMessage(uiText[language].paypalRequired);
  renderPayPalButtons();
});

languageBtn.addEventListener("click", () => {
  language = language === "ar" ? "fr" : "ar";
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  languageBtn.textContent = uiText[language].language;
  tripSelect.options[0].textContent = tripNames[language].merzouga;
  tripSelect.options[1].textContent = tripNames[language].marrakech;
  tripSelect.options[2].textContent = tripNames[language].chefchaouen;
  updateSummary();
});

tripSelect.addEventListener("change", updateSummary);
peopleInput.addEventListener("input", updateSummary);

document.querySelectorAll(".bookBtn").forEach((button) => {
  button.addEventListener("click", () => {
    tripSelect.value = button.dataset.trip;
    updateSummary();
    document.getElementById("booking").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

updateSummary();
