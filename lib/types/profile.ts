export type OnboardingStep =
  | 'email_verification'
  | 'user_type'
  | 'basic_info'
  | 'location'
  | 'bio'
  | 'notifications'
  | 'completed'
  | null;

export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  onboarding_completed_at?: string | null;
  onboarding_step?: OnboardingStep;
}
