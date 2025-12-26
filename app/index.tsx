import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { useColorScheme } from 'react-native';

import { useAppSelector } from '../lib/store';
import { getCommonStyles } from '../constants/CommonStyles';
import { Sections, NavigationRoutes } from '../constants/Navigation';

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);
  const { user, initializing } = useAppSelector(s => s.auth);
  const {
    profile,
    loading: profileLoading,
    hasFetched,
  } = useAppSelector(s => s.profile);

  useEffect(() => {
    if (initializing) {
      return;
    }
    const handleNavigation = async () => {
      try {
        if (user) {
          // Wait until profile fetch has completed at least once
          if (!hasFetched || profileLoading) {
            return;
          }
          if (profile?.onboarding_completed_at) {
            router.replace(NavigationRoutes.ACTIVITIES);
          } else {
            router.replace(
              '/' +
                Sections.onboarding +
                '/' +
                (profile?.onboarding_step ?? 'emailVerification')
            );
          }
        } else {
          // User is not authenticated, redirect to auth
          router.replace(NavigationRoutes.AUTH);
        }
      } catch (err) {
        console.error('Navigation error:', err);
        // On error, redirect to auth as fallback
        router.replace(NavigationRoutes.AUTH);
      }
    };

    handleNavigation();
  }, [initializing, user, profile, hasFetched, profileLoading, router]);

  if (initializing || (user && (!hasFetched || profileLoading))) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={[styles.text, styles.textCenter, styles.marginTop]}>
          Checking authentication...
        </Text>
      </View>
    );
  }

  // This should rarely be shown since navigation happens automatically
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
      <Text style={[styles.text, styles.textCenter, styles.marginTop]}>
        Redirecting...
      </Text>
    </View>
  );
}
