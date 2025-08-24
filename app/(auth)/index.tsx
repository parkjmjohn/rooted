import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';

import { supabase } from '../../lib/supabase';
import { NavigationRoutes } from '../../constants/Navigation';
import { getCommonStyles } from '../../constants/CommonStyles';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);

  async function signInWithEmail() {
    setLoading(true);

    const { error, data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }

    // Check if user has completed onboarding
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_step')
        .eq('id', data.user.id)
        .single();

      if (profile?.onboarding_step === 'completed') {
        // User has completed onboarding, go to main app
        router.replace(NavigationRoutes.MYCLASSES);
      } else {
        // User needs to complete onboarding
        router.replace('/(onboarding)/' + profile?.onboarding_step);
      }
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }

    if (session) {
      router.replace(NavigationRoutes.EMAILVERIFICATION);
    }
    setLoading(false);
  }

  return (
    <View style={[styles.container, styles.padding, styles.marginTop]}>
      <View style={styles.inputContainer}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text: string) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text: string) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sign in" disabled={loading} onPress={signInWithEmail} />
      </View>
      <View style={styles.inputContainer}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </View>
    </View>
  );
}
