CREATE TYPE onboarding_step_type AS ENUM (
  'email-verification',
  'user-type',
  'basic-info',
  'location',
  'bio',
  'notifications',
  'completed'
);

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS onboarding_step onboarding_step_type 
  DEFAULT 'email_verification';

ALTER TABLE public.profiles 
  ADD CONSTRAINT valid_onboarding_step_order 
  CHECK (
    onboarding_step IN (
      'email_verification',
      'user_type_selection',
      'basic_info', 
      'location',
      'bio',
      'notifications',
      'completed'
    )
  );