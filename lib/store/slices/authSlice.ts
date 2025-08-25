import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session, User } from '@supabase/supabase-js';

import { supabase } from '../../supabase';

interface AuthState {
  loading: boolean;
  initializing: boolean;
  error: string | null;
  session: Session | null;
  user: User | null;
}

const initialState: AuthState = {
  loading: false,
  initializing: true,
  error: null,
  session: null,
  user: null,
};

export const initSession = createAsyncThunk<
  Session | null,
  void,
  { rejectValue: string }
>('auth/initSession', async (_, { rejectWithValue }) => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session ?? null;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to init session';
    return rejectWithValue(message);
  }
});

export const listenToAuthChanges = createAsyncThunk(
  'auth/listenToAuthChanges',
  async (_, { dispatch }) => {
    supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
      dispatch(setUser(session?.user ?? null));
    });
    return; // avoid returning non-serializable subscription
  }
);

export const refreshUser = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>('auth/refreshUser', async (_, { rejectWithValue }) => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user ?? null;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to refresh user';
    return rejectWithValue(message);
  }
});

// profile responsibilities moved to profileSlice

export const signInWithEmail = createAsyncThunk<
  Session | null,
  { email: string; password: string },
  { rejectValue: string }
>('auth/signInWithEmail', async (payload, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });
    if (error) throw error;
    return data.session ?? null;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to sign in';
    return rejectWithValue(message);
  }
});

export const signUpWithEmail = createAsyncThunk<
  Session | null,
  { email: string; password: string },
  { rejectValue: string }
>('auth/signUpWithEmail', async (payload, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
    });
    if (error) throw error;
    return data.session ?? null;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to sign up';
    return rejectWithValue(message);
  }
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await supabase.auth.signOut();
  return true;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<Session | null>) {
      state.session = action.payload;
      state.user = action.payload?.user ?? null;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },

    resetAuthState() {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(initSession.pending, state => {
        state.initializing = true;
        state.error = null;
      })
      .addCase(initSession.fulfilled, (state, action) => {
        state.initializing = false;
        state.session = action.payload;
        state.user = action.payload?.user ?? null;
      })
      .addCase(initSession.rejected, (state, action) => {
        state.initializing = false;
        state.error = (action.payload as string) ?? 'Init session failed';
      })
      .addCase(signInWithEmail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload as Session | null;
        state.user = action.payload?.user ?? null;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Sign in failed';
      })
      .addCase(signUpWithEmail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload as Session | null;
        state.user = action.payload?.user ?? null;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Sign up failed';
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload as User | null;
      })
      .addCase(signOut.fulfilled, () => {
        return initialState;
      });
  },
});

export const { setSession, setUser, resetAuthState } = authSlice.actions;

export default authSlice.reducer;
