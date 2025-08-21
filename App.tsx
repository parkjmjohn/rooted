import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { supabase } from './lib/supabase';
import { useAuth } from './lib/useAuth';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, loading } = useAuth();

  // Handle Supabase auth token refresh based on app state
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };

    // Add event listener for app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    // Start auto refresh initially
    supabase.auth.startAutoRefresh();

    // Cleanup function
    return () => {
      subscription?.remove();
      supabase.auth.stopAutoRefresh();
    };
  }, []);

  if (loading) {
    return null; // Or a loading screen
  }

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
      {/* Public routes - always accessible */}
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      {/* Protected routes - only accessible when authenticated */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
