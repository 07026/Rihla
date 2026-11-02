create table if not exists public.reservations (
  id uuid primary key,
  customer_name text not null check (char_length(customer_name) between 1 and 80),
  email text not null,
  phone text not null,
  trip_id text not null check (trip_id in ('merzouga', 'marrakech', 'chefchaouen')),
  trip_name text not null,
  travel_date date not null,
  travelers integer not null check (travelers between 1 and 50),
  amount numeric(10, 2) not null check (amount > 0),
  currency text not null check (currency = 'EUR'),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  paypal_order_id text unique,
  paypal_capture_id text unique,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table public.reservations enable row level security;
-- Do not create public/anon policies. The Vercel API uses the service-role key server-side only.
