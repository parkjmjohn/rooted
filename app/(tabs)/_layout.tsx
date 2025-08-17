import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { getTabBarStyles } from '../../constants/TabBarStyles';
import { TabNames, TabTitles, TabIcons } from '../../constants/Navigation';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs screenOptions={getTabBarStyles(colorScheme)}>
      <Tabs.Screen
        name={TabNames.DISCOVERY}
        options={{
          title: TabTitles[TabNames.DISCOVERY],
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={TabIcons[TabNames.DISCOVERY]}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={TabNames.MY_CLASSES}
        options={{
          title: TabTitles[TabNames.MY_CLASSES],
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={TabIcons[TabNames.MY_CLASSES]}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={TabNames.MESSAGING}
        options={{
          title: TabTitles[TabNames.MESSAGING],
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={TabIcons[TabNames.MESSAGING]}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={TabNames.PROFILE}
        options={{
          title: TabTitles[TabNames.PROFILE],
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={TabIcons[TabNames.PROFILE]}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
