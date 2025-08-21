import { StyleSheet } from 'react-native';
import { Theme } from './Theme';

export const CommonStyles = StyleSheet.create({
  // Layout styles
  buttonContainer: {
    marginTop: Theme.spacing.xl,
  },

  // Card styles
  card: {
    backgroundColor: Theme.colors.light.surface,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
    padding: Theme.spacing.md,
    ...Theme.shadows.small,
  },

  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    backgroundColor: Theme.colors.light.background,
    flex: 1,
  },

  fullScreen: {
    flex: 1,
    height: '100%',
    width: '100%',
  },

  // Form styles
  inputContainer: {
    marginBottom: Theme.spacing.md,
  },

  // List styles
  listItem: {
    borderBottomColor: Theme.colors.light.border,
    borderBottomWidth: 1,
    paddingVertical: Theme.spacing.sm,
  },

  // Loading styles
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  // Spacing styles
  marginBottom: {
    marginBottom: Theme.spacing.xl,
  },

  marginTop: {
    marginTop: Theme.spacing.xl,
  },

  padding: {
    padding: Theme.spacing.md,
  },

  paddingHorizontal: {
    paddingHorizontal: Theme.spacing.md,
  },

  paddingVertical: {
    paddingVertical: Theme.spacing.md,
  },

  subtitle: {
    color: Theme.colors.light.textSecondary,
    fontSize: Theme.typography.body.fontSize,
  },

  // Text styles
  text: {
    color: Theme.colors.light.text,
    fontSize: Theme.typography.body.fontSize,
  },

  textCenter: {
    textAlign: 'center',
  },

  title: {
    fontSize: Theme.typography.h2.fontSize,
    fontWeight: Theme.typography.h2.fontWeight,
    marginBottom: Theme.spacing.sm,
  },
});

// Helper function to get theme-aware common styles
export const getCommonStyles = (
  colorScheme: 'light' | 'dark' | null | undefined
) => {
  const colors =
    colorScheme === 'dark' ? Theme.colors.dark : Theme.colors.light;

  return StyleSheet.create({
    ...CommonStyles,
    card: {
      ...CommonStyles.card,
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
    },
    container: {
      ...CommonStyles.container,
      backgroundColor: colors.background,
    },
    listItem: {
      ...CommonStyles.listItem,
      borderBottomColor: colors.border,
    },
    subtitle: {
      ...CommonStyles.subtitle,
      color: colors.textSecondary,
    },
    text: {
      ...CommonStyles.text,
      color: colors.text,
    },
  });
};
