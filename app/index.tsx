import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // User is authenticated, redirect to discovery tab
        router.replace('/discovery');
      } else {
        // User is not authenticated, redirect to auth
        router.replace('/auth');
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/discovery');
      } else {
        router.replace('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
