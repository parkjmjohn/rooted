import { supabase } from './supabase';
import { Profile } from './types/profile';

export const fetchProfileById = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id, full_name, username, avatar_url, bio, city, country, is_teacher, onboarding_completed_at, onboarding_step'
    )
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw error ?? new Error('Profile not found');
  }

  return data as Profile;
};
