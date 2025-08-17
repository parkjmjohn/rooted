export const Theme = {
  colors: {
    // Light theme colors
    light: {
      primary: '#007AFF',
      background: '#f8f9fa',
      surface: '#ffffff',
      text: '#1a1a1a',
      textSecondary: '#666666',
      textTertiary: '#999999',
      border: '#e0e0e0',
      borderDark: '#333333',
      success: '#34C759',
      error: '#FF3B30',
      warning: '#FF9500',
    },
    // Dark theme colors
    dark: {
      primary: '#0A84FF',
      background: '#1a1a1a',
      surface: '#2c2c2c',
      text: '#ffffff',
      textSecondary: '#ffffff',
      textTertiary: '#666666',
      border: '#333333',
      borderDark: '#666666',
      success: '#30D158',
      error: '#FF453A',
      warning: '#FF9F0A',
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },

  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
    },
    small: {
      fontSize: 12,
      fontWeight: 'normal',
    },
  },

  tabBar: {
    height: 60,
    paddingVertical: 5,
  },

  header: {
    height: 44,
  },

  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
  },
};

// Helper function to get theme-aware colors
export const getThemeColors = (colorScheme: 'light' | 'dark' | null) => {
  return colorScheme === 'dark' ? Theme.colors.dark : Theme.colors.light;
};
