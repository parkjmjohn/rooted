import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Button } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { getCommonStyles } from '../../constants/CommonStyles';

export default function UserTypeSelection() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);

  const selectUserType = async (isTeacher: boolean) => {
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
          is_teacher: isTeacher,
          onboarding_step: 'basic_info',
        })
        .eq('id', user.id);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        router.replace('/(onboarding)/basic-info');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update user type');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, styles.padding, styles.marginTop]}>
      <View style={styles.inputContainer}>
        <Text style={[styles.text, styles.textCenter, styles.marginBottom]}>
          Are you a teacher or a student?
        </Text>

        <Text style={[styles.text, styles.textCenter, styles.marginBottom]}>
          This will help us customize your experience and connect you with the
          right people.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="I'm a Teacher"
          onPress={() => selectUserType(true)}
          disabled={loading}
          size="lg"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="I'm a Student"
          onPress={() => selectUserType(false)}
          disabled={loading}
          size="lg"
          type="outline"
        />
      </View>
    </View>
  );
}
