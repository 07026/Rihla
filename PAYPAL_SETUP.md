# PayPal checkout deployment

This project is a static Arabic/French website with Vercel serverless API routes. PayPal card/account checkout is hosted by PayPal; the site never receives card details. The server calculates the price from a fixed trip catalog (EUR), stores a pending reservation in Supabase, creates the PayPal order, then verifies the completed order/capture with PayPal before marking the reservation paid.

## Prices

The current EUR prices are €150 per traveler for Merzouga, €100 for Marrakech, and €75 for Chefchaouen. These are explicit example prices, not currency conversions from the old MAD prices. Update the catalog in `api/_lib/payments.js` and the frontend display in `script.js` together before launch.

## Setup

1. Create a PayPal Business account and an app in the PayPal Developer Dashboard. Copy the Client ID and Secret for **Sandbox** first.
2. Create a Supabase project. In its SQL editor, run `supabase/schema.sql`. Keep row-level security enabled and do not add anonymous policies for reservations.
3. Copy `.env.example` to `.env.local` and fill in the values. The `SUPABASE_SERVICE_ROLE_KEY` and `PAYPAL_CLIENT_SECRET` are secrets: set them only in local server environment/Vercel project settings, never in browser code or Git. `APP_BASE_URL` must be the exact site origin (for local development, `http://localhost:3000`; production must use HTTPS).
4. Install and run locally: `npm install`, `npx vercel dev`. Visit the local site, select PayPal, complete the booking fields and use a Sandbox buyer account.
5. Deploy the repository to Vercel. Add the same environment variables in Project Settings → Environment Variables, set `APP_BASE_URL` to the production origin and `PAYPAL_ENV=sandbox`. Redeploy after setting variables.
6. For real payments, confirm PayPal account eligibility and EUR support for the merchant account, switch to the Live app credentials and `PAYPAL_ENV=live`, set the production origin, and redeploy. Never use live credentials in local/test environments.

## Environment variables

- `PAYPAL_ENV`: `sandbox` (default behavior) or `live`.
- `PAYPAL_CLIENT_ID`: public identifier, served to the browser only by `/api/paypal/config`.
- `PAYPAL_CLIENT_SECRET`: private PayPal credential, server only.
- `SUPABASE_URL`: project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only Supabase service key; bypasses RLS, so protect it carefully.
- `APP_BASE_URL`: exact application origin used for origin checks and PayPal return URLs.

## Notes

- Do not trust an amount, currency, trip name, or status sent by the browser. The create-order endpoint accepts only a trip identifier and traveler count and prices them on the server.
- The capture endpoint looks up the server-created reservation and verifies PayPal's order state, reservation reference, capture status, exact amount and EUR currency before marking it paid.
- Supabase is the durable booking record. Do not treat browser local storage or a PayPal return URL as proof of payment.
- Add monitoring, a retention policy for customer personal data, and a PayPal webhook for robust asynchronous/refund/dispute handling before a high-volume production launch. API checkout confirmation itself verifies payment directly with PayPal.
- `index.html` can be hosted as a static Vercel site; `/api/*` routes run as serverless functions.
