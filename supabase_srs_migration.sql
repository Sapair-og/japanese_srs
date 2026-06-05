-- =============================================================
-- JAPANESE ADAPTIVE SRS LEARNING PLATFORM - MIGRATION SCRIPT
-- Run this script in your Supabase SQL Editor.
-- =============================================================

-- 1. Create table to track user-specific card spaced repetition progress
create table if not exists public.user_card_progress (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references public.user_profile(id) on delete cascade,
  card_id uuid not null references public.vocabulary(id) on delete cascade,
  ease_factor double precision default 2.5 not null,
  interval integer default 0 not null,
  repetitions integer default 0 not null,
  last_reviewed timestamp with time zone,
  next_review timestamp with time zone default now() not null,
  wrong_count integer default 0 not null,
  correct_count integer default 0 not null,
  mastery_score integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, card_id)
);

-- 2. Create table to log overall study session details
create table if not exists public.review_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references public.user_profile(id) on delete cascade,
  session_date date default current_date not null,
  duration_seconds integer default 0 not null,
  cards_reviewed integer default 0 not null,
  accuracy_rate double precision default 0.0 not null,
  xp_earned integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create table to store granular review event history logs (for charts/progress maps)
create table if not exists public.review_history (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references public.user_profile(id) on delete cascade,
  card_id uuid not null references public.vocabulary(id) on delete cascade,
  rating integer not null, -- 0 = Again, 1 = Hard, 2 = Good, 3 = Easy
  reviewed_at timestamp with time zone default now() not null
);

-- 4. Enable Row Level Security (RLS) on the new tables
alter table public.user_card_progress enable row level security;
alter table public.review_sessions enable row level security;
alter table public.review_history enable row level security;

-- 5. Add Secure RLS Policies
-- user_card_progress Policies
drop policy if exists "Users can read their own progress" on public.user_card_progress;
create policy "Users can read their own progress" on public.user_card_progress
  for select using (auth.uid()::text = user_id);

drop policy if exists "Users can insert their own progress" on public.user_card_progress;
create policy "Users can insert their own progress" on public.user_card_progress
  for insert with check (auth.uid()::text = user_id);

drop policy if exists "Users can update their own progress" on public.user_card_progress;
create policy "Users can update their own progress" on public.user_card_progress
  for update using (auth.uid()::text = user_id);

-- review_sessions Policies
drop policy if exists "Users can read their own sessions" on public.review_sessions;
create policy "Users can read their own sessions" on public.review_sessions
  for select using (auth.uid()::text = user_id);

drop policy if exists "Users can insert their own sessions" on public.review_sessions;
create policy "Users can insert their own sessions" on public.review_sessions
  for insert with check (auth.uid()::text = user_id);

-- review_history Policies
drop policy if exists "Users can read their own review history" on public.review_history;
create policy "Users can read their own review history" on public.review_history
  for select using (auth.uid()::text = user_id);

drop policy if exists "Users can insert their own review history" on public.review_history;
create policy "Users can insert their own review history" on public.review_history
  for insert with check (auth.uid()::text = user_id);

-- 6. Add context sentence columns to public.vocabulary table
alter table public.vocabulary add column if not exists context_japanese text;
alter table public.vocabulary add column if not exists context_english text;
