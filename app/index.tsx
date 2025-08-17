import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { NavigationRoutes } from '../constants/Navigation';
import { getCommonStyles } from '../constants/CommonStyles';
import { useColorScheme } from 'react-native';

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // User is authenticated, redirect to discovery tab
        router.replace(NavigationRoutes.DISCOVERY);
      } else {
        // User is not authenticated, redirect to auth
        router.replace(NavigationRoutes.AUTH);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace(NavigationRoutes.DISCOVERY);
      } else {
        router.replace(NavigationRoutes.AUTH);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
    </View>
  );
}
