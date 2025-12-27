-- ======================================
-- CLEAN START (local only)
-- ======================================
truncate table
  public.activity_participants,
  public.activities,
  public.user_settings,
  public.profiles
restart identity cascade;

-- Optional: also clear these (local-only) to avoid duplicates:
-- truncate table auth.identities, auth.users restart identity cascade;

-- ======================================
-- 1) SEED AUTH USERS (required for profiles FK)
-- ======================================
-- Note: This uses bcrypt via crypt(..., gen_salt('bf')) which is a typical Supabase pattern. :contentReference[oaicite:1]{index=1}

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  last_sign_in_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) values
(
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'john@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"sub":"00000000-0000-0000-0000-000000000001","email":"john@test.com"}',
  now(), now(), now(),
  '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000002',
  'authenticated',
  'authenticated',
  'alice@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"sub":"00000000-0000-0000-0000-000000000002","email":"alice@test.com"}',
  now(), now(), now(),
  '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000003',
  'authenticated',
  'authenticated',
  'sam@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"sub":"00000000-0000-0000-0000-000000000003","email":"sam@test.com"}',
  now(), now(), now(),
  '', '', '', ''
);

insert into auth.identities (
  id,
  user_id,
  provider,
  identity_data,
  created_at,
  updated_at,
  last_sign_in_at,
  provider_id
) values
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'email',
  '{"sub":"00000000-0000-0000-0000-000000000001","email":"john@test.com"}',
  now(), now(), now(),
  '00000000-0000-0000-0000-000000000001'
),
(
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000002',
  'email',
  '{"sub":"00000000-0000-0000-0000-000000000002","email":"alice@test.com"}',
  now(), now(), now(),
  '00000000-0000-0000-0000-000000000002'
),
(
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000003',
  'email',
  '{"sub":"00000000-0000-0000-0000-000000000003","email":"sam@test.com"}',
  now(), now(), now(),
  '00000000-0000-0000-0000-000000000003'
);

-- ======================================
-- 2) PATCH PROFILES CREATED BY YOUR TRIGGER
-- (on_auth_user_created -> handle_new_user)
-- ======================================
update public.profiles
set
  username = 'johnpark',
  full_name = 'John Park',
  bio = 'Early morning runs and long rides.',
  city = 'San Francisco',
  country = 'USA',
  onboarding_step = 'completed',
  onboarding_completed_at = now()
where id = '00000000-0000-0000-0000-000000000001';

update public.profiles
set
  username = 'alice',
  full_name = 'Alice Chen',
  bio = 'Trail running & hiking enthusiast.',
  city = 'Berkeley',
  country = 'USA',
  onboarding_step = 'completed',
  onboarding_completed_at = now()
where id = '00000000-0000-0000-0000-000000000002';

update public.profiles
set
  username = 'sam',
  full_name = 'Sam Rivera',
  bio = 'Casual rides and weekend adventures.',
  city = 'Oakland',
  country = 'USA',
  onboarding_step = 'completed',
  onboarding_completed_at = now()
where id = '00000000-0000-0000-0000-000000000003';

-- ======================================
-- 3) USER SETTINGS (your trigger inserts rows already; update them)
-- ======================================
update public.user_settings set push_opt_in = true
where user_id in (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002'
);


-- ======================================
-- ACTIVITIES
-- ======================================
insert into public.activities (
  id,
  host_id,
  name,
  sport,
  time,
  completed,
  details,
  groups,
  group_size
) values
-- Upcoming (hosted by John)
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  'Morning Golden Gate Run',
  'running',
  now() + interval '1 day',
  false,
  'Easy pace, all levels welcome.',
  'open',
  8
),

-- Upcoming (hosted by Alice)
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000002',
  'Trail Run in Tilden',
  'trail running',
  now() + interval '2 days',
  false,
  'Hilly route, bring water.',
  'women-only',
  6
),

-- Upcoming (hosted by Sam)
(
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000003',
  'Weekend Gravel Ride',
  'gravel biking',
  now() + interval '4 days',
  false,
  'Mixed terrain, moderate pace.',
  'open',
  10
),

-- Past activity (should NOT appear)
(
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000002',
  'Sunset Hike',
  'hiking',
  now() - interval '2 days',
  true,
  'Chill evening hike.',
  'open',
  12
),

-- Upcoming but small group
(
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000001',
  'Non-binary MTB Ride',
  'mountain biking',
  now() + interval '6 days',
  false,
  'Inclusive ride, intermediate trails.',
  'non-binary-only',
  5
);

-- ======================================
-- ACTIVITY PARTICIPANTS
-- ======================================

-- Hosts
insert into public.activity_participants (activity_id, user_id, role) values
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'host'),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', 'host'),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003', 'host'),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000002', 'host'),
('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001', 'host');

-- Participants
insert into public.activity_participants (activity_id, user_id) values
-- John joins Alice’s trail run
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001'),

-- Alice joins John’s run
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002'),

-- Sam joins John’s run
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003');
