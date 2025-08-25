import { Stack } from 'expo-router';

import { TabNames } from '../../constants/Navigation';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name={TabNames.SIGNIN} />
      <Stack.Screen name={TabNames.SIGNUP} />
    </Stack>
  );
}
