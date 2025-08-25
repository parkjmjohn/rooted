export const Sections = {
  tabs: '(tabs)',
  onboarding: '(onboarding)',
  auth: '(auth)',
} as const;

export const TabNames = {
  SIGNIN: 'signIn',
  SIGNUP: 'signUp',

  MYCLASSES: 'myClasses',
  DISCOVERY: 'discovery',
  MESSAGING: 'messaging',
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
  MYCLASSES: '/' + Sections.tabs + '/' + TabNames.MYCLASSES,
  DISCOVERY: '/' + Sections.tabs + '/' + TabNames.DISCOVERY,
  MESSAGING: '/' + Sections.tabs + '/' + TabNames.MESSAGING,
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
  [TabNames.MYCLASSES]: 'My Classes',
  [TabNames.DISCOVERY]: 'Discovery',
  [TabNames.MESSAGING]: 'Messages',
  [TabNames.PROFILE]: 'Profile',
} as const;

// Define the specific icon names that Ionicons supports
export const TabIcons = {
  [TabNames.DISCOVERY]: 'search' as const,
  [TabNames.MYCLASSES]: 'calendar' as const,
  [TabNames.MESSAGING]: 'chatbubbles' as const,
  [TabNames.PROFILE]: 'person' as const,
} as const;

// Create a union type of all valid icon names
export type TabIconName = (typeof TabIcons)[keyof typeof TabIcons];
