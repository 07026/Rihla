const { randomUUID } = require("node:crypto");
const { send, readJson, checkRequest, validateBooking, requiredEnv, paypalRequest, supabase, errorResponse } = require("./_lib/payments");

module.exports = async function handler(req, res) {
  if (!checkRequest(req, res)) return;
  try {
    requiredEnv();
    const booking = validateBooking(await readJson(req));
    const reservationId = randomUUID();
    const baseUrl = new URL(process.env.APP_BASE_URL).origin;
    await supabase("reservations", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        id: reservationId,
        customer_name: booking.customer,
        email: booking.email,
        phone: booking.phone,
        trip_id: booking.trip,
        trip_name: booking.tripName,
        travel_date: booking.travelDate,
        travelers: booking.travelers,
        amount: booking.amount,
        currency: booking.currency,
        status: "pending",
      }),
    });

    let order;
    try {
      order = await paypalRequest("/v2/checkout/orders", {
        method: "POST",
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{
            reference_id: reservationId,
            custom_id: reservationId,
            description: `Rihla — ${booking.tripName} trip for ${booking.travelers} traveler(s)`,
            amount: { currency_code: "EUR", value: booking.amount },
          }],
          application_context: {
            brand_name: "Rihla",
            landing_page: "LOGIN",
            user_action: "PAY_NOW",
            return_url: `${baseUrl}/?paypal=return`,
            cancel_url: `${baseUrl}/?paypal=cancel`,
          },
        }),
        requestId: reservationId,
      });
      await supabase(`reservations?id=eq.${encodeURIComponent(reservationId)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ paypal_order_id: order.id }),
      });
    } catch (error) {
      await supabase(`reservations?id=eq.${encodeURIComponent(reservationId)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ status: "failed" }),
      }).catch(() => {});
      throw error;
    }

    send(res, 201, { orderId: order.id });
  } catch (error) {
    errorResponse(res, error);
  }
};
