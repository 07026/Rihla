const { send } = require("./_lib/payments");

module.exports = function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "Method not allowed" });
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return send(res, 503, { error: "PayPal is not configured" });
  }
  send(res, 200, { clientId: process.env.PAYPAL_CLIENT_ID, currency: "EUR", environment: process.env.PAYPAL_ENV === "live" ? "live" : "sandbox" });
};
