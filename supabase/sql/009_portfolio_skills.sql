-- Skills (rubriker + kategorier). Kör efter 008_portfolio_social.sql.

create table if not exists public.portfolio_skills (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

comment on table public.portfolio_skills is 'Portfolio: innehåll för Skills-sektionen (JSON). Rad id = default.';

alter table public.portfolio_skills enable row level security;
