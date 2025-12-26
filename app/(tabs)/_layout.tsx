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
        name={TabNames.ACTIVITIES}
        options={{
          title: TabTitles[TabNames.ACTIVITIES],
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={TabIcons[TabNames.ACTIVITIES]}
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
