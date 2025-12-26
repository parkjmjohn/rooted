export const Sections = {
  tabs: '(tabs)',
  onboarding: '(onboarding)',
  auth: '(auth)',
} as const;

export const TabNames = {
  SIGNIN: 'signIn',
  SIGNUP: 'signUp',

  ACTIVITIES: 'activities',
  PROFILE: 'profile',

  EMAILVERIFICATION: 'emailVerification',
  USERTYPE: 'userType',
  BASICINFO: 'basicInfo',
  LOCATION: 'location',
  BIO: 'bio',
  NOTIFICATIONS: 'notifications',
} as const;

export const NavigationRoutes = {
  // Auth routes
  AUTH: '/' + Sections.auth,
  SIGNIN: '/' + Sections.auth + '/' + TabNames.SIGNIN,
  SIGNUP: '/' + Sections.auth + '/' + TabNames.SIGNUP,

  // Tab routes
  ACTIVITIES: '/' + Sections.tabs + '/' + TabNames.ACTIVITIES,
  PROFILE: '/' + Sections.tabs + '/' + TabNames.PROFILE,

  // Onboarding Routes
  EMAILVERIFICATION:
    '/' + Sections.onboarding + '/' + TabNames.EMAILVERIFICATION,
  USERTYPE: '/' + Sections.onboarding + '/' + TabNames.USERTYPE,
  BASICINFO: '/' + Sections.onboarding + '/' + TabNames.BASICINFO,
  LOCATION: '/' + Sections.onboarding + '/' + TabNames.LOCATION,
  BIO: '/' + Sections.onboarding + '/' + TabNames.BIO,
  NOTIFICATIONS: '/' + Sections.onboarding + '/' + TabNames.NOTIFICATIONS,
} as const;

export const TabTitles = {
  [TabNames.ACTIVITIES]: 'Activities',
  [TabNames.PROFILE]: 'Profile',
} as const;

// Define the specific icon names that Ionicons supports
export const TabIcons = {
  [TabNames.ACTIVITIES]: 'walk-outline' as const,
  [TabNames.PROFILE]: 'person-outline' as const,
} as const;

// Create a union type of all valid icon names
export type TabIconName = (typeof TabIcons)[keyof typeof TabIcons];
