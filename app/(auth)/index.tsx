import React from 'react';
import { View } from 'react-native';
import { Button } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';

import { NavigationRoutes } from '../../constants/Navigation';
import { getCommonStyles } from '../../constants/CommonStyles';

export default function Auth() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);

  return (
    <View style={[styles.container, styles.padding, styles.marginTop]}>
      <View style={styles.buttonContainer}>
        <Button
          title="Sign in"
          onPress={() => router.replace(NavigationRoutes.SIGNIN)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Button
          title="Sign up"
          onPress={() => router.replace(NavigationRoutes.SIGNUP)}
        />
      </View>
    </View>
  );
}
