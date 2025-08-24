import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Button, Input } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';

import { getCommonStyles } from '../../constants/CommonStyles';
import { NavigationRoutes } from '../../constants/Navigation';

export default function Bio() {
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          bio: bio.trim(),
          onboarding_step: 'notifications',
        })
        .eq('id', user.id);

      if (error) {
        Alert.alert('Error', error.message);
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
