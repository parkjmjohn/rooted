import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../lib/store';
import { upsertProfile } from '../../lib/store/slices/profileSlice';
import { Button, Input } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';

import { getCommonStyles } from '../../constants/CommonStyles';
import { NavigationRoutes } from '../../constants/Navigation';

export default function Bio() {
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);

  const handleNext = async () => {
    if (!bio.trim()) {
      Alert.alert('Error', 'Please enter your bio');
      return;
    }

    if (bio.length < 10) {
      Alert.alert('Error', 'Bio must be at least 10 characters long');
      return;
    }

    setLoading(true);
    try {
      if (!user?.id) {
        Alert.alert('Error', 'User not found');
        return;
      }
      const result = await dispatch(
        upsertProfile({
          id: user.id,
          bio: bio.trim(),
          onboarding_step: 'notifications',
        })
      );
      if (upsertProfile.rejected.match(result)) {
        const msg = (result.payload as string) ?? 'Failed to update profile';
        Alert.alert('Error', msg);
      } else {
        router.replace(NavigationRoutes.NOTIFICATIONS);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, styles.padding, styles.marginTop]}>
      <View style={styles.inputContainer}>
        <Text style={[styles.text, styles.textCenter, styles.marginBottom]}>
          Tell us about yourself
        </Text>

        <Text style={[styles.text, styles.textCenter, styles.marginBottom]}>
          Share a bit about your interests, experience, or what you&apos;re
          looking for
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Input
          label="Bio"
          leftIcon={{ type: 'font-awesome', name: 'comment' }}
          onChangeText={setBio}
          value={bio}
          placeholder="Tell us about yourself..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={loading || !bio.trim() || bio.length < 10}
        />
      </View>
    </View>
  );
}
