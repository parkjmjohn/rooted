import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { getCommonStyles } from '../constants/CommonStyles';
import { useColorScheme } from 'react-native';
import { useAuth } from '../lib/useAuth';
import { supabase } from '../lib/supabase';

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (authLoading || hasNavigated) return; // Prevent multiple navigation attempts

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
            setHasNavigated(true);
            router.replace('/(tabs)/my-classes');
          } else {
            // User needs to complete onboarding
            setHasNavigated(true);
            router.replace('/(onboarding)/' + profile?.onboarding_step);
          }
        } else {
          // User is not authenticated, redirect to auth
          setHasNavigated(true);
          router.replace('/(auth)');
        }
      } catch (err) {
        console.error('Navigation error:', err);
        // On error, redirect to auth as fallback
        setHasNavigated(true);
        router.replace('/(auth)');
      }
    };

    handleNavigation();
  }, [isAuthenticated, authLoading, user, hasNavigated, router]);

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
