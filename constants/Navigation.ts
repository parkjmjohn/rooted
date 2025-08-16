export const NavigationRoutes = {
  // Auth routes
  AUTH: '/auth',

  // Tab routes
  DISCOVERY: '/(tabs)/discovery',
  MY_CLASSES: '/(tabs)/my-classes',
  MESSAGING: '/(tabs)/messaging',
  PROFILE: '/(tabs)/profile',
} as const;

export const TabNames = {
  DISCOVERY: 'discovery',
  MY_CLASSES: 'my-classes',
  MESSAGING: 'messaging',
  PROFILE: 'profile',
} as const;

export const TabTitles = {
  [TabNames.DISCOVERY]: 'Discovery',
  [TabNames.MY_CLASSES]: 'My Classes',
  [TabNames.MESSAGING]: 'Messages',
  [TabNames.PROFILE]: 'Profile',
} as const;

// Define the specific icon names that Ionicons supports
export const TabIcons = {
  [TabNames.DISCOVERY]: 'search' as const,
  [TabNames.MY_CLASSES]: 'calendar' as const,
  [TabNames.MESSAGING]: 'chatbubbles' as const,
  [TabNames.PROFILE]: 'person' as const,
} as const;

// Create a union type of all valid icon names
export type TabIconName = (typeof TabIcons)[keyof typeof TabIcons];
