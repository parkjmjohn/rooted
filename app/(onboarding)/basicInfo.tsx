import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';

import { supabase } from '../../lib/supabase';
import { getCommonStyles } from '../../constants/CommonStyles';
import { NavigationRoutes } from '../../constants/Navigation';

export default function BasicInfo() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);

  const handleNext = async () => {
    if (!fullName.trim() || !username.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters long');
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
          full_name: fullName.trim(),
          username: username.trim().toLowerCase(),
          onboarding_step: 'location',
        })
        .eq('id', user.id);

      if (error) {
        if (error.code === '23505') {
          Alert.alert(
            'Error',
            'Username already taken. Please choose another one.'
          );
        } else {
          Alert.alert('Error', error.message);
        }
      } else {
        router.replace(NavigationRoutes.LOCATION);
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
          Let&apos;s get to know you better
        </Text>

        <Text style={[styles.text, styles.textCenter, styles.marginBottom]}>
          Please provide your basic information
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Input
          label="Full Name"
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          onChangeText={setFullName}
          value={fullName}
          placeholder="Enter your full name"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          label="Username"
          leftIcon={{ type: 'font-awesome', name: 'at' }}
          onChangeText={setUsername}
          value={username}
          placeholder="Choose a username"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={loading || !fullName.trim() || !username.trim()}
        />
      </View>
    </View>
  );
}
