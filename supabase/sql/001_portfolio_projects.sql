-- Kör detta i Supabase: SQL Editor → New query → Run
-- Lagrar hela projektlistan som JSON (samma modell som tidigare Redis-nyckel).
-- Vid spar skriver appen alltid hit. Valfritt: kör 003_portfolio_project_rows.sql för en rad per projekt i Table Editor.

create table if not exists public.portfolio_projects (
  id text primary key,
  projects jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.portfolio_projects is 'Portfolio: lista med projekt (JSON). Rad id = default.';

-- Valfritt: RLS påslaget. Service role (server) kringgår RLS.
alter table public.portfolio_projects enable row level security;

-- Ingen policy för anon = ingen direktåtkomst med anon-nyckel till denna tabell från klienten.
-- All läsning/skrivning sker via servern med SUPABASE_SERVICE_ROLE_KEY.
