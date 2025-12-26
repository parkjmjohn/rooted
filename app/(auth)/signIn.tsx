import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../lib/store';
import { signInWithEmail } from '../../lib/store/slices/authSlice';
import { NavigationRoutes } from '../../constants/Navigation';
import { getCommonStyles } from '../../constants/CommonStyles';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const loading = useAppSelector(s => s.auth.loading);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);

  async function handleSignIn() {
    const result = await dispatch(
      signInWithEmail({ email: email, password: password })
    );
    if (signInWithEmail.rejected.match(result)) {
      const msg = (result.payload as string) ?? 'Failed to sign in';
      Alert.alert(msg);
      return;
    }
    router.replace(NavigationRoutes.ACTIVITIES);
  }

  return (
    <View style={[styles.container, styles.padding, styles.marginTop]}>
      <View style={styles.inputContainer}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text: string) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text: string) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sign in" disabled={loading} onPress={handleSignIn} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Back"
          onPress={() => router.replace(NavigationRoutes.AUTH)}
        />
      </View>
    </View>
  );
}
