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
  const profile = useAppSelector(s => s.profile.profile);

  useEffect(() => {
    if (initializing) {
      return;
    }
    const handleNavigation = async () => {
      try {
        if (user) {
          // User is authenticated; use profile in store to route
          if (profile?.onboarding_completed_at) {
            router.replace(NavigationRoutes.MYCLASSES);
          } else {
            // User needs to complete onboarding
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
  }, [initializing, user, profile, router]);

  if (initializing) {
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
