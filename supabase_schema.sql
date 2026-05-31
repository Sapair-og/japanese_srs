-- ==========================================
-- JAPANESE VOCABULARY SRS QUIZZER - SCHEMA
-- Run these queries in your Supabase SQL Editor.
-- ==========================================

-- 1. Create table for vocabulary cards
create table if not exists public.vocabulary (
  id uuid default gen_random_uuid() primary key,
  hiragana text not null,
  kanji text not null,
  "group" text not null,
  english text not null,
  romaji text not null,
  lesson text default 'General' not null,
  audio_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Migration query to run for existing databases:
-- alter table public.vocabulary add column if not exists lesson text default 'General' not null;
-- alter table public.vocabulary add column if not exists audio_url text;

-- 2. Create table for user profile/settings
create table if not exists public.user_profile (
  id text primary key, -- 'default_user' for single-user mode
  name text default 'Luna-chan' not null,
  title text default 'Chibi Student' not null,
  avatar_seed text default 'Luna' not null,
  avatar_style text default 'adventurer' not null,
  theme text default 'theme-claude-light' not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create table for user lifetime study stats
create table if not exists public.user_stats (
  id text primary key references public.user_profile(id) on delete cascade,
  streak integer default 0 not null,
  total_attempts integer default 0 not null,
  total_correct integer default 0 not null,
  last_studied_date date,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table public.vocabulary enable row level security;
alter table public.user_profile enable row level security;
alter table public.user_stats enable row level security;

-- 5. Create RLS Policies (allows anyone with the public key to perform operations, perfect for single-user web app)
create policy "Allow public select on vocabulary" on public.vocabulary for select using (true);
create policy "Allow public insert on vocabulary" on public.vocabulary for insert with check (true);
create policy "Allow public update on vocabulary" on public.vocabulary for update using (true);
create policy "Allow public delete on vocabulary" on public.vocabulary for delete using (true);

create policy "Allow public select on user_profile" on public.user_profile for select using (true);
create policy "Allow public insert on user_profile" on public.user_profile for insert with check (true);
create policy "Allow public update on user_profile" on public.user_profile for update using (true);

create policy "Allow public select on user_stats" on public.user_stats for select using (true);
create policy "Allow public insert on user_stats" on public.user_stats for insert with check (true);
create policy "Allow public update on user_stats" on public.user_stats for update using (true);
