import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme, AppState } from 'react-native';
import { Provider } from 'react-redux';

import { Sections } from '../constants/Navigation';
import { store, useAppDispatch, useAppSelector, RootState } from '../lib/store';
import {
  initSession,
  listenToAuthChanges,
} from '../lib/store/slices/authSlice';
import { fetchProfile } from '../lib/store/slices/profileSlice';
import { supabase } from '../lib/supabase';

function RootNavigator() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s: RootState) => !!s.auth.user);
  const userId = useAppSelector((s: RootState) => s.auth.user?.id ?? null);

  useEffect(() => {
    dispatch(initSession());
    dispatch(listenToAuthChanges());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
    }
  }, [dispatch, userId]);

  // Handle Supabase auth token refresh based on app state
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    // Start auto refresh initially
    supabase.auth.startAutoRefresh();

    return () => {
      subscription?.remove();
      supabase.auth.stopAutoRefresh();
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
        },
        headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name={Sections.auth} />
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name={Sections.onboarding} />
        <Stack.Screen name={Sections.tabs} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
