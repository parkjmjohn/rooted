import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { supabase } from '../../supabase';
import { Profile } from '../../types/profile';

interface ProfileState {
  loading: boolean;
  error: string | null;
  profile: Profile | null;
  hasFetched: boolean;
}

const initialState: ProfileState = {
  loading: false,
  error: null,
  profile: null,
  hasFetched: false,
};

export const fetchProfile = createAsyncThunk<
  Profile | null,
  string,
  { rejectValue: string }
>('profile/fetchProfile', async (userId, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(
        'id, full_name, username, avatar_url, bio, city, country, is_teacher, onboarding_completed_at, onboarding_step'
      )
      .eq('id', userId)
      .single();
    if (error) throw error;
    return (data as Profile) ?? null;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to fetch profile';
    return rejectWithValue(message);
  }
});

export const upsertProfile = createAsyncThunk<
  Profile,
  Partial<Profile> & { id: string },
  { rejectValue: string }
>('profile/upsertProfile', async (updates, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ ...updates, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to update profile';
    return rejectWithValue(message) as unknown as Profile;
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile | null>) {
      state.profile = action.payload;
    },
    resetProfile() {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProfile.pending, state => {
        state.loading = true;
        state.error = null;
        state.hasFetched = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Fetch profile failed';
      })
      .addCase(upsertProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upsertProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload as Profile;
      })
      .addCase(upsertProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Update profile failed';
      });
  },
});

export const { setProfile, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
