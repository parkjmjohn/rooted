import { Theme } from './Theme';

export const getTabBarStyles = (
  colorScheme: 'light' | 'dark' | null | undefined
) => {
  const colors =
    colorScheme === 'dark' ? Theme.colors.dark : Theme.colors.light;

  return {
    tabBarActiveTintColor: colors.text,
    tabBarInactiveTintColor: colors.textTertiary,
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: Theme.tabBar.height,
      paddingBottom: Theme.tabBar.paddingVertical,
      paddingTop: Theme.tabBar.paddingVertical,
    },
    headerStyle: {
      backgroundColor: colors.surface,
    },
    headerTintColor: colors.text,
  };
};
