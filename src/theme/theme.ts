import { createTheme, ThemeOptions } from '@mui/material/styles';
import { designTokens } from './tokens';

/**
 * Material UI Theme Configuration
 * Uses design tokens to create a consistent theme
 */

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => {
  const colors = designTokens.colors[mode];

  return {
    palette: {
      mode,
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.secondary,
      },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
        disabled: colors.text.disabled,
      },
      error: {
        main: colors.error,
      },
      success: {
        main: colors.success,
      },
      warning: {
        main: colors.warning,
      },
      divider: colors.border,
    },
    typography: {
      fontFamily: designTokens.typography.fontFamily.primary,
      fontSize: 16,
      fontWeightLight: designTokens.typography.fontWeight.light,
      fontWeightRegular: designTokens.typography.fontWeight.regular,
      fontWeightMedium: designTokens.typography.fontWeight.medium,
      fontWeightBold: designTokens.typography.fontWeight.bold,
      h1: {
        fontSize: designTokens.typography.fontSize['5xl'],
        fontWeight: designTokens.typography.fontWeight.bold,
        lineHeight: designTokens.typography.lineHeight.tight,
      },
      h2: {
        fontSize: designTokens.typography.fontSize['4xl'],
        fontWeight: designTokens.typography.fontWeight.bold,
        lineHeight: designTokens.typography.lineHeight.tight,
      },
      h3: {
        fontSize: designTokens.typography.fontSize['3xl'],
        fontWeight: designTokens.typography.fontWeight.semibold,
        lineHeight: designTokens.typography.lineHeight.tight,
      },
      h4: {
        fontSize: designTokens.typography.fontSize['2xl'],
        fontWeight: designTokens.typography.fontWeight.semibold,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
      h5: {
        fontSize: designTokens.typography.fontSize.xl,
        fontWeight: designTokens.typography.fontWeight.medium,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
      h6: {
        fontSize: designTokens.typography.fontSize.lg,
        fontWeight: designTokens.typography.fontWeight.medium,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
      body1: {
        fontSize: designTokens.typography.fontSize.base,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
      body2: {
        fontSize: designTokens.typography.fontSize.sm,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
    },
    breakpoints: {
      values: {
        xs: designTokens.breakpoints.mobile,
        sm: designTokens.breakpoints.tablet,
        md: designTokens.breakpoints.desktop,
        lg: designTokens.breakpoints.wide,
        xl: 1920,
      },
    },
    spacing: 8, // Base spacing unit (8px)
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: designTokens.borderRadius.md,
            padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
            transition: `all ${designTokens.transitions.normal}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.lg,
            boxShadow: designTokens.shadows.md,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: designTokens.shadows.sm,
          },
        },
      },
    },
  };
};

export const lightTheme = createTheme(getThemeOptions('light'));
export const darkTheme = createTheme(getThemeOptions('dark'));
