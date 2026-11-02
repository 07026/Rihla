const TRIPS = Object.freeze({
  merzouga: { name: "Merzouga", priceEUR: 150 },
  marrakech: { name: "Marrakech", priceEUR: 100 },
  chefchaouen: { name: "Chefchaouen", priceEUR: 75 },
});

const MAX_BODY_BYTES = 8 * 1024;

function send(res, status, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}

function originAllowed(req) {
  const configured = process.env.APP_BASE_URL;
  if (!configured) return false;
  const expected = new URL(configured).origin;
  const origin = req.headers.origin;
  return !origin || origin === expected;
}

async function readJson(req) {
  const chunks = [];
  let length = 0;
  for await (const chunk of req) {
    length += chunk.length;
    if (length > MAX_BODY_BYTES) throw Object.assign(new Error("Request too large"), { status: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw Object.assign(new Error("Invalid JSON body"), { status: 400 });
  }
}

function checkRequest(req, res) {
  if (req.method !== "POST") {
    send(res, 405, { error: "Method not allowed" });
    return false;
  }
  if (!originAllowed(req)) {
    send(res, 403, { error: "Request origin is not allowed" });
    return false;
  }
  if (!req.headers["content-type"]?.toLowerCase().includes("application/json")) {
    send(res, 415, { error: "Content-Type must be application/json" });
    return false;
  }
  return true;
}

function validateBooking(input) {
  if (!input || typeof input !== "object") throw Object.assign(new Error("Invalid booking"), { status: 400 });
  const trip = TRIPS[input.trip];
  const travelers = Number(input.travelers);
  const customer = typeof input.customer === "string" ? input.customer.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const date = typeof input.date === "string" ? input.date : "";
  if (!trip) throw Object.assign(new Error("Choose a valid trip"), { status: 400 });
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 50) throw Object.assign(new Error("Traveler count must be between 1 and 50"), { status: 400 });
  if (!customer || customer.length > 80) throw Object.assign(new Error("Enter a valid name"), { status: 400 });
  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Object.assign(new Error("Enter a valid email address"), { status: 400 });
  if (!/^\+?[0-9\s-]{8,20}$/.test(phone)) throw Object.assign(new Error("Enter a valid phone number"), { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date || date <= new Date().toISOString().slice(0, 10)) {
    throw Object.assign(new Error("Choose a future travel date"), { status: 400 });
  }
  return { trip: input.trip, tripName: trip.name, travelers, customer, email, phone, travelDate: date, amount: (trip.priceEUR * travelers).toFixed(2), currency: "EUR" };
}

function requiredEnv() {
  const names = ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "APP_BASE_URL"];
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length) throw Object.assign(new Error(`Server configuration is incomplete: ${missing.join(", ")}`), { status: 503 });
  if (!/^https?:\/\//.test(process.env.APP_BASE_URL)) throw Object.assign(new Error("APP_BASE_URL must be an absolute URL"), { status: 503 });
}

function paypalBase() {
  return process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

async function paypalRequest(path, options = {}) {
  const tokenResponse = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) throw new Error("Could not authenticate with PayPal");
  const response = await fetch(`${paypalBase()}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${tokenData.access_token}`, "Content-Type": "application/json", "PayPal-Request-Id": options.requestId || crypto.randomUUID(), ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "PayPal request failed");
    error.status = response.status;
    throw error;
  }
  return data;
}

async function supabase(path, options = {}) {
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Reservation storage failed (${response.status}): ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : [];
}

function errorResponse(res, error) {
  const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 600 ? error.status : 500;
  if (status >= 500) console.error("PayPal API error:", error.message);
  send(res, status, { error: status >= 500 ? "Payment service temporarily unavailable" : error.message });
}

module.exports = { TRIPS, send, readJson, checkRequest, validateBooking, requiredEnv, paypalRequest, supabase, errorResponse };
