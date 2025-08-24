import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Button } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { getCommonStyles } from '../../constants/CommonStyles';
import * as Notifications from 'expo-notifications';

export default function NotificationsSetup() {
  const [loading, setLoading] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    boolean | null
  >(null);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationPermission(status === 'granted');
  };

  const requestNotificationPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotificationPermission(status === 'granted');

      if (status === 'granted') {
        // Get the token for push notifications
        const token = await Notifications.getExpoPushTokenAsync();
        console.log('Push token:', token);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      // Update profile to mark onboarding as completed
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          onboarding_step: 'completed',
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) {
        Alert.alert('Error', profileError.message);
        return;
      }

      // Update user settings for notifications
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          push_opt_in: notificationPermission || false,
        });

      if (settingsError) {
        console.error('Error updating user settings:', settingsError);
      }

      // Navigate to main app
      router.replace('/(tabs)/myClasses');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete onboarding');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const skipNotifications = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      // Update profile to mark onboarding as completed
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          onboarding_step: 'completed',
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) {
        Alert.alert('Error', profileError.message);
        return;
      }

      // Update user settings for notifications (opt out)
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          push_opt_in: false,
        });

      if (settingsError) {
        console.error('Error updating user settings:', settingsError);
      }

      // Navigate to main app
      router.replace('/(tabs)/myClasses');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete onboarding');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, styles.padding, styles.marginTop]}>
      <View style={styles.inputContainer}>
        <Text style={[styles.text, styles.textCenter, styles.marginBottom]}>
          Enable Notifications
        </Text>

        <Text style={[styles.text, styles.textCenter, styles.marginBottom]}>
          Notifications help teachers communicate with students and keep you
          updated on important activities.
        </Text>

        <Text style={[styles.text, styles.textCenter, styles.marginBottom]}>
          You can change this setting later in your profile.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {notificationPermission === null ? (
          <Button
            title="Request Permission"
            onPress={requestNotificationPermission}
            disabled={loading}
          />
        ) : notificationPermission ? (
          <Button
            title="Notifications Enabled ✓"
            disabled={true}
            type="outline"
          />
        ) : (
          <Button
            title="Enable Notifications"
            onPress={requestNotificationPermission}
            disabled={loading}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Complete Setup"
          onPress={completeOnboarding}
          disabled={loading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Skip for now"
          onPress={skipNotifications}
          disabled={loading}
          type="clear"
        />
      </View>
    </View>
  );
}
