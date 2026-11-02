const { send, readJson, checkRequest, requiredEnv, paypalRequest, supabase, errorResponse } = require("../_lib/payments");

module.exports = async function handler(req, res) {
  if (!checkRequest(req, res)) return;
  try {
    requiredEnv();
    const { orderId } = await readJson(req);
    if (typeof orderId !== "string" || !/^[A-Z0-9-]{10,40}$/i.test(orderId)) {
      return send(res, 400, { error: "Invalid PayPal order ID" });
    }
    const rows = await supabase(`reservations?select=id,amount,currency,status,paypal_order_id&paypal_order_id=eq.${encodeURIComponent(orderId)}&limit=1`);
    const reservation = rows[0];
    if (!reservation) return send(res, 404, { error: "Reservation for this order was not found" });
    if (reservation.status === "paid") return send(res, 200, { status: "paid", orderId });
    if (reservation.status !== "pending") return send(res, 409, { error: "This reservation cannot be captured" });

    let order = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}`, { method: "GET" });
    if (order.status === "APPROVED") {
      await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
        method: "POST",
        body: "{}",
        requestId: `capture-${orderId}`,
      });
      order = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}`, { method: "GET" });
    }

    const unit = order.purchase_units?.[0];
    if (order.status !== "COMPLETED" || order.purchase_units?.length !== 1 || !unit || unit.custom_id !== reservation.id ||
        unit.amount?.currency_code !== reservation.currency || unit.amount?.value !== Number(reservation.amount).toFixed(2)) {
      return send(res, 409, { error: "PayPal could not verify the completed payment" });
    }
    const capture = unit.payments?.captures?.find((item) => item.status === "COMPLETED");
    if (!capture) return send(res, 409, { error: "PayPal payment capture is not completed" });

    await supabase(`reservations?id=eq.${encodeURIComponent(reservation.id)}&status=eq.pending`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ status: "paid", paypal_capture_id: capture.id, paid_at: new Date().toISOString() }),
    });
    send(res, 200, { status: "paid", orderId, trip: unit.description, amount: reservation.amount, currency: reservation.currency });
  } catch (error) {
    errorResponse(res, error);
  }
};
