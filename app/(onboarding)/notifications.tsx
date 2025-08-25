import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import * as Notifications from 'expo-notifications';

import { supabase } from '../../lib/supabase';
import { getCommonStyles } from '../../constants/CommonStyles';
import { NavigationRoutes } from '../../constants/Navigation';
import { useAppDispatch, useAppSelector } from '../../lib/store';
import { upsertProfile } from '../../lib/store/slices/profileSlice';

export default function NotificationsSetup() {
  const [loading, setLoading] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    boolean | null
  >(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
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
      if (!user?.id) {
        Alert.alert('Error', 'User not found');
        return;
      }
      const result = await dispatch(
        upsertProfile({
          id: user.id,
          onboarding_step: 'completed',
          onboarding_completed_at: new Date().toISOString(),
        })
      );
      if (upsertProfile.rejected.match(result)) {
        const msg =
          (result.payload as string) ?? 'Failed to complete onboarding';
        Alert.alert('Error', msg);
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
      router.replace(NavigationRoutes.MYCLASSES);
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
      if (!user?.id) {
        Alert.alert('Error', 'User not found');
        return;
      }
      const result = await dispatch(
        upsertProfile({
          id: user.id,
          onboarding_step: 'completed',
          onboarding_completed_at: new Date().toISOString(),
        })
      );
      if (upsertProfile.rejected.match(result)) {
        const msg =
          (result.payload as string) ?? 'Failed to complete onboarding';
        Alert.alert('Error', msg);
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
      router.replace(NavigationRoutes.MYCLASSES);
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
