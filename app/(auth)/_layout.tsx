import { Stack } from 'expo-router';

import { NavigationRoutes } from '../../constants/Navigation';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name={NavigationRoutes.SIGNIN} />
      <Stack.Screen name={NavigationRoutes.SIGNUP} />
    </Stack>
  );
}
