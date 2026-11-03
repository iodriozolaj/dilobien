-- Week 5: Public Chatbot / Guided Assistant
-- Run this in the Supabase SQL Editor (same project as Weeks 1-4).

-- Thumbs up/down on a generated message. No personal data, so anon can
-- both insert and read — same RLS shape as research_signals / pricing_signals.
create table if not exists chat_feedback (
  id uuid primary key default gen_random_uuid(),
  scenario_key text not null,
  tone_key text not null,
  rating text not null check (rating in ('up', 'down')),
  created_at timestamp with time zone default now()
);

alter table chat_feedback enable row level security;

create policy "Allow public insert" on chat_feedback
  for insert to anon with check (true);

create policy "Allow public read" on chat_feedback
  for select to anon using (true);

-- Logs every time a guardrail actually blocks something, by category only
-- (never the blocked text itself, to avoid storing anything sensitive).
-- This is what proves the guardrails are live on the deployed page, not
-- just present in the code.
create table if not exists chat_guardrail_events (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('safety', 'offtopic', 'length', 'rate_limit')),
  created_at timestamp with time zone default now()
);

alter table chat_guardrail_events enable row level security;

create policy "Allow public insert" on chat_guardrail_events
  for insert to anon with check (true);

create policy "Allow public read" on chat_guardrail_events
  for select to anon using (true);
