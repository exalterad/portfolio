-- Tidslinje (rubrik + milstolpar). Kör efter 004_portfolio_about.sql.

create table if not exists public.portfolio_experience (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

comment on table public.portfolio_experience is 'Portfolio: innehåll för Tidslinje-sektionen (JSON). Rad id = default.';

alter table public.portfolio_experience enable row level security;
