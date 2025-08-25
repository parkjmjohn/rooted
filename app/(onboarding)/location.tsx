import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Button, Input } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';

import { NavigationRoutes } from '../../constants/Navigation';
import { getCommonStyles } from '../../constants/CommonStyles';

export default function Location() {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);

  const handleNext = async () => {
    if (!city.trim() || !country.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
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
          city: city.trim(),
          country: country.trim(),
          onboarding_step: 'bio',
        })
        .eq('id', user.id);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        router.replace(NavigationRoutes.BIO);
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
          Where are you located?
        </Text>

        <Text style={[styles.text, styles.textCenter, styles.marginBottom]}>
          This helps us connect you with people in your area
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Input
          label="City"
          leftIcon={{ type: 'font-awesome', name: 'map-marker' }}
          onChangeText={setCity}
          value={city}
          placeholder="Enter your city"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          label="Country"
          leftIcon={{ type: 'font-awesome', name: 'globe' }}
          onChangeText={setCountry}
          value={country}
          placeholder="Enter your country"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={loading || !city.trim() || !country.trim()}
        />
      </View>
    </View>
  );
}
