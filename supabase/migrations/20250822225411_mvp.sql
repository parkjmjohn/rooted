-- =====================
-- UTILS (helper functions)
-- =====================
create or replace function public.set_current_timestamp_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

CREATE TYPE onboarding_step_type AS ENUM (
  'email_verification',
  'user_type',
  'basic_info',
  'location',
  'bio',
  'notifications',
  'completed'
);

-- =====================
-- PROFILES
-- =====================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  city text,
  country text,
  is_teacher boolean not null default false,
  onboarding_step onboarding_step_type default 'email_verification',
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_length check (char_length(username) >= 3)
);

-- trigger to keep updated_at fresh
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_current_timestamp_updated_at();

-- auto-insert a profile row when a new user signs up via Supabase Auth
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================
-- USER SETTINGS
-- =====================
create table public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  push_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_user_settings_updated_at
before update on public.user_settings
for each row execute procedure public.set_current_timestamp_updated_at();

-- =====================
-- RLS POLICIES 
-- =====================
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

alter table public.user_settings enable row level security;
create policy "User can view own settings" on public.user_settings
  for select using (auth.uid() = user_id);
create policy "User can upsert own settings" on public.user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =====================
-- STORAGE (avatars)
-- =====================
insert into storage.buckets (id, name)
  values ('avatars', 'avatars')
  on conflict (id) do nothing;

create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');
create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');
create policy "Anyone can update their own avatar." on storage.objects
  for update using ((select auth.uid()) = owner) with check (bucket_id = 'avatars');
