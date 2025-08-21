import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="email-verification" />
      <Stack.Screen name="user-type" />
      <Stack.Screen name="basic-info" />
      <Stack.Screen name="location" />
      <Stack.Screen name="bio" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
