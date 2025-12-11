/**
 * Design Tokens - Optimized
 * Central configuration for all design values used throughout the application
 * Using numeric values where possible for better performance
 */

// Base scale for spacing and sizing
const BASE_UNIT = 4; // 4px base unit
const spacing = (multiplier: number) => `${BASE_UNIT * multiplier}px`;

export const designTokens = {
  colors: {
    light: {
      primary: "#FF6B9D",
      secondary: "#FFB84D",
      background: "#FFFBF5",
      surface: "#FFF5F7",
      text: {
        primary: "#2D3436",
        secondary: "#636E72",
        disabled: "#B2BEC3",
      },
      border: "#FFE4E9",
      error: "#FF6B81",
      success: "#6BCF7F",
      warning: "#FFB84D",
    },
    dark: {
      primary: "#FF85A6",
      secondary: "#FFC46D",
      background: "#2D3436",
      surface: "#36393B",
      text: {
        primary: "#FFFBF5",
        secondary: "#DFE6E9",
        disabled: "#B2BEC3",
      },
      border: "#4A4A4A",
      error: "#FF8FA3",
      success: "#7FDB91",
      warning: "#FFC46D",
    },
  },

  typography: {
    fontFamily: {
      primary: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      code: '"Fira Code", "Courier New", monospace',
    },
    // Using px values directly for consistency with Material-UI
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 30,
      "4xl": 36,
      "5xl": 48,
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Using 4px base unit system
  spacing: {
    0: 0,
    1: spacing(1),   // 4px
    2: spacing(2),   // 8px
    3: spacing(3),   // 12px
    4: spacing(4),   // 16px
    5: spacing(5),   // 20px
    6: spacing(6),   // 24px
    8: spacing(8),   // 32px
    10: spacing(10), // 40px
    12: spacing(12), // 48px
    16: spacing(16), // 64px
    24: spacing(24), // 96px
  },

  breakpoints: {
    mobile: 0,
    tablet: 600,
    desktop: 1024,
    wide: 1440,
  },

  borderRadius: {
    none: 0,
    sm: spacing(1),  // 4px
    md: spacing(2),  // 8px
    lg: spacing(3),  // 12px
    xl: spacing(4),  // 16px
    full: 9999,
  },

  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },

  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
  },

  transitions: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
} as const;

export type DesignTokens = typeof designTokens;
