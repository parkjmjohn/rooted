import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../lib/store';
import { upsertProfile } from '../../lib/store/slices/profileSlice';
import { getCommonStyles } from '../../constants/CommonStyles';
import { NavigationRoutes } from '../../constants/Navigation';

export default function UserTypeSelection() {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);

  const selectUserType = async (isTeacher: boolean) => {
    setLoading(true);
    try {
      if (!user?.id) {
        Alert.alert('Error', 'User not found');
        return;
      }
      const result = await dispatch(
        upsertProfile({
          id: user.id,
          is_teacher: isTeacher,
          onboarding_step: 'basic_info',
        })
      );
      if (upsertProfile.rejected.match(result)) {
        const msg = (result.payload as string) ?? 'Failed to update user type';
        Alert.alert('Error', msg);
      } else {
        router.replace(NavigationRoutes.BASICINFO);
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
