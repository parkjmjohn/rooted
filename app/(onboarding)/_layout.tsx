import { Stack } from 'expo-router';

import { TabNames } from '../../constants/Navigation';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name={TabNames.EMAILVERIFICATION} />
      <Stack.Screen name={TabNames.BASICINFO} />
      <Stack.Screen name={TabNames.LOCATION} />
      <Stack.Screen name={TabNames.BIO} />
      <Stack.Screen name={TabNames.NOTIFICATIONS} />
    </Stack>
  );
}
