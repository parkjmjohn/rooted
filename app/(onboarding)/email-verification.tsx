import { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { Button } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { getCommonStyles } from '../../constants/CommonStyles';
import { useColorScheme } from 'react-native';

export default function EmailVerification() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkEmailVerification = useCallback(async () => {
    setChecking(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        const { error } = await supabase
          .from('profiles')
          .update({
            onboarding_step: 'user_type',
          })
          .eq('id', user.id);
        if (!error) {
          router.replace('/(onboarding)/user-type');
        }
      }
    } catch (error) {
      console.error('Error checking email verification:', error);
    } finally {
      setChecking(false);
    }
  }, [router]);

  useEffect(() => {
    // Check if user is already verified
    checkEmailVerification();
  }, [checkEmailVerification]);

  const resendVerificationEmail = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        Alert.alert('Error', 'Unable to retrieve user email.');
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Verification email sent!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend verification email');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <View style={[styles.container, styles.padding, styles.marginTop]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Checking verification status...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.padding, styles.marginTop]}>
      <View style={styles.inputContainer}>
        <Text style={[styles.text, styles.textCenter, styles.marginBottom]}>
          Please check your email and click the verification link to continue.
        </Text>

        <Text style={[styles.text, styles.textCenter, styles.marginBottom]}>
          Once verified, you&apos;ll be able to complete your profile setup.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="I've verified my email"
          onPress={checkEmailVerification}
          disabled={loading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Resend verification email"
          onPress={resendVerificationEmail}
          disabled={loading}
          type="outline"
        />
      </View>
    </View>
  );
}
