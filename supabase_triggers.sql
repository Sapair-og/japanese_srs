-- =============================================================
-- AUTOMATED USER INITIALIZATION TRIGGER (PL/pgSQL)
-- Run these queries in your Supabase SQL Editor.
-- =============================================================

-- 1. Create the trigger handler function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Insert profile record with defaults and optional signup name metadata
  insert into public.user_profile (id, name, title, avatar_seed, avatar_style, theme)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Luna-chan'),
    'Chibi Student',
    'Luna',
    'adventurer',
    'liyue-light'
  )
  on conflict (id) do nothing;

  -- Insert stats record linked to profile
  insert into public.user_stats (id, streak, total_attempts, total_correct, last_studied_date)
  values (new.id, 0, 0, 0, null)
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- 2. Bind trigger to auth.users table inserts
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
