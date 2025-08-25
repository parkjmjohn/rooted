import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { useColorScheme } from 'react-native';

import { useAuth } from '../lib/useAuth';
import { supabase } from '../lib/supabase';
import { getCommonStyles } from '../constants/CommonStyles';
import { Sections, NavigationRoutes } from '../constants/Navigation';

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);
  const { isAuthenticated, loading: authLoading, user } = useAuth();

  useEffect(() => {
    if (authLoading) {
      return;
    }
    const handleNavigation = async () => {
      try {
        if (isAuthenticated && user) {
          // User is authenticated, check onboarding status
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed_at, onboarding_step')
            .eq('id', user.id)
            .single();
          // User has completed onboarding, redirect to main app
          if (profile?.onboarding_completed_at) {
            router.replace(NavigationRoutes.MYCLASSES);
          } else {
            // User needs to complete onboarding
            router.replace(
              '/' + Sections.onboarding + '/' + profile?.onboarding_step
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
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading) {
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
