# SayItRight

A message generator for hard conversations — pick a situation and a tone, get a ready-to-send message instantly.

Live site: https://sayitrightsite.vercel.app/

## Pages

- **`/` (index.html)** — landing page and waitlist.
- **`/core` (core.html)** — the generative core: pick a situation + tone, generate a message, regenerate for different wording, copy to clipboard. Logs each generation to Supabase (`core_generations`).
- **`/research` (research.html)** — research & benchmarking dashboard: a live problem-validation poll (backed by Supabase, table `research_signals`), a researched competitive-landscape table, a substitutes list, and a gap analysis.

## Stack

Static HTML/CSS/vanilla JS, no build step. Hosted on Vercel (auto-deploys on every push to `main`). Data (message logs and poll responses) stored in Supabase (Postgres + PostgREST), accessed directly from the browser with the public anon key under Row Level Security.

## Local files

- `supabase-config.js` — Supabase project URL + anon key (safe to expose client-side; RLS restricts what the anon role can do).
- `schema.sql` — creates `core_generations` (Week 1).
- `schema-research.sql` — creates `research_signals` (Week 2).
- `vercel.json` — enables clean URLs so `/core` and `/research` resolve without the `.html` extension.

## Weekly build logs

Each week's Build Discipline Packet, Product Spec, architecture notes, test evidence, and decision log are submitted separately as PDF evidence packets alongside this repo.
