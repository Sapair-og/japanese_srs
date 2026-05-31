-- ==========================================
-- JAPANESE VOCABULARY SRS QUIZZER - SCHEMA (MULTI-USER & ADMIN)
-- Run these queries in your Supabase SQL Editor.
-- Make sure to replace 'admin@example.com' with your actual administrator email!
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

-- 2. Create table for user profile/settings
create table if not exists public.user_profile (
  id text primary key, -- session.user.id
  name text default 'Luna-chan' not null,
  title text default 'Chibi Student' not null,
  avatar_seed text default 'Luna' not null,
  avatar_style text default 'adventurer' not null,
  theme text default 'theme-claude-light' not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create table for user study stats
create table if not exists public.user_stats (
  id text primary key references public.user_profile(id) on delete cascade,
  streak integer default 0 not null,
  total_attempts integer default 0 not null,
  total_correct integer default 0 not null,
  last_studied_date date,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create table to store user study heatmap log dates (synced database table)
create table if not exists public.user_study_dates (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references public.user_profile(id) on delete cascade,
  studied_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, studied_date)
);

-- Enable Row Level Security (RLS) on all tables
alter table public.vocabulary enable row level security;
alter table public.user_profile enable row level security;
alter table public.user_stats enable row level security;
alter table public.user_study_dates enable row level security;

-- Clean up old public access policies if they exist
drop policy if exists "Allow public select on vocabulary" on public.vocabulary;
drop policy if exists "Allow public insert on vocabulary" on public.vocabulary;
drop policy if exists "Allow public update on vocabulary" on public.vocabulary;
drop policy if exists "Allow public delete on vocabulary" on public.vocabulary;

drop policy if exists "Allow public select on user_profile" on public.user_profile;
drop policy if exists "Allow public insert on user_profile" on public.user_profile;
drop policy if exists "Allow public update on user_profile" on public.user_profile;

drop policy if exists "Allow public select on user_stats" on public.user_stats;
drop policy if exists "Allow public insert on user_stats" on public.user_stats;
drop policy if exists "Allow public update on user_stats" on public.user_stats;

drop policy if exists "Users can read their own study dates" on public.user_study_dates;
drop policy if exists "Users can insert their own study dates" on public.user_study_dates;
drop policy if exists "Users can delete their own study dates" on public.user_study_dates;

-- 5. Create Secure Row Level Security (RLS) Policies

-- Vocabulary: SELECT read access allowed for anyone; INSERT/UPDATE/DELETE allowed only for Admin Email
-- [ACTION REQUIRED] Replace 'admin@example.com' with your actual account sign-up email!
create policy "Allow read access to vocabulary for everyone" on public.vocabulary
  for select using (true);

create policy "Allow insert vocabulary for admin only" on public.vocabulary
  for insert with check (auth.jwt() ->> 'email' = 'admin@example.com');

create policy "Allow update vocabulary for admin only" on public.vocabulary
  for update using (auth.jwt() ->> 'email' = 'admin@example.com');

create policy "Allow delete vocabulary for admin only" on public.vocabulary
  for delete using (auth.jwt() ->> 'email' = 'admin@example.com');

-- User Profile: Each user can read/write their own profile row only
create policy "Users can read their own profile" on public.user_profile
  for select using (auth.uid()::text = id);

create policy "Users can insert their own profile" on public.user_profile
  for insert with check (auth.uid()::text = id);

create policy "Users can update their own profile" on public.user_profile
  for update using (auth.uid()::text = id);

-- User Stats: Each user can read/write their own stats row only
create policy "Users can read their own stats" on public.user_stats
  for select using (auth.uid()::text = id);

create policy "Users can insert their own stats" on public.user_stats
  for insert with check (auth.uid()::text = id);

create policy "Users can update their own stats" on public.user_stats
  for update using (auth.uid()::text = id);

-- User Study Dates: Each user can read/write their own log records only
create policy "Users can read their own study dates" on public.user_study_dates
  for select using (auth.uid()::text = user_id);

create policy "Users can insert their own study dates" on public.user_study_dates
  for insert with check (auth.uid()::text = user_id);

create policy "Users can delete their own study dates" on public.user_study_dates
  for delete using (auth.uid()::text = user_id);
