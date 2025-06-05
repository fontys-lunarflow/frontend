import { createTheme } from '@mui/material/styles';
import { colors } from './colors';

// Typography definitions matching Material Design 3 and the Roboto font family
const typography = {
  fontFamily: [
    'var(--font-roboto)',
    'Roboto',
    'Arial',
    'sans-serif'
  ].join(','),
  // Main typeface settings
  h1: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 400, // Regular
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.015em',
  },
  h2: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 400, // Regular
    fontSize: '2rem',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 400, // Regular
    fontSize: '1.75rem',
    lineHeight: 1.3,
    letterSpacing: '0em',
  },
  h4: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 400, // Regular
    fontSize: '1.5rem',
    lineHeight: 1.35,
    letterSpacing: '0.0025em',
  },
  h5: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 400, // Regular
    fontSize: '1.25rem',
    lineHeight: 1.4,
    letterSpacing: '0em',
  },
  h6: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 500, // Medium
    fontSize: '1.125rem',
    lineHeight: 1.4,
    letterSpacing: '0.0015em',
  },
  subtitle1: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 500, // Medium
    fontSize: '1rem',
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  subtitle2: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 500, // Medium
    fontSize: '0.875rem',
    lineHeight: 1.57,
    letterSpacing: '0.00714em',
  },
  body1: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 400, // Regular
    fontSize: '1rem',
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  body2: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 400, // Regular
    fontSize: '0.875rem',
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
  },
  button: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 500, // Medium
    fontSize: '0.875rem',
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    textTransform: 'none', // Material Design 3 uses sentence case
  },
  caption: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 400, // Regular
    fontSize: '0.75rem',
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
  },
  overline: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 400, // Regular
    fontSize: '0.625rem',
    lineHeight: 2.66,
    letterSpacing: '0.08333em',
    textTransform: 'uppercase',
  },
  // Special variants
  regular: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 400,
  },
  thin: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 100,
  },
  bold: {
    fontFamily: 'var(--font-roboto)',
    fontWeight: 700,
  },
  condensedBold: {
    fontFamily: 'var(--font-roboto-condensed)',
    fontWeight: 700,
  },
};

// Light theme configuration
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: colors.primary.onPrimary,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: colors.secondary.onSecondary,
    },
    tertiary: {
      main: colors.tertiary.main,
      light: colors.tertiary.light,
      dark: colors.tertiary.dark,
      contrastText: colors.tertiary.onTertiary,
    },
    error: {
      main: colors.error.main,
      light: colors.error.light,
      dark: colors.error.dark,
      contrastText: colors.error.onError,
    },
    surface: {
      main: colors.surface.main,
      dim: colors.surface.dim,
      bright: colors.surface.bright,
    },
    background: {
      default: colors.surface.main,
      paper: colors.surface.containerLow,
      sidebar: colors.uiLightGray,  // Light gray for sidebar
      content: colors.white,        // White for content area
    },
    text: {
      primary: colors.surface.onSurface,
      secondary: colors.surface.onSurfaceVariant,
    },
    divider: colors.grey25,  // Slightly darker dividers for better visibility
    outline: {
      main: colors.surface.outline,
      variant: colors.surface.outlineVariant,
    },
  },
  typography,
  shape: {
    borderRadius: 16, // Material Design 3 uses more rounded corners
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: false,
      },
      styleOverrides: {
        root: {
          borderRadius: '20px', // More rounded for MD3
          padding: '8px 24px',
        },
        contained: {
          backgroundColor: colors.primary.main,
          color: colors.primary.onPrimary,
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            backgroundColor: colors.primary.dark,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderColor: colors.primary.main,
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: `${colors.primary.light}20`, // 20% opacity
          },
        },
        text: {
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: `${colors.primary.light}20`, // 20% opacity
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        },
        elevation2: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3), 0px 1px 8px rgba(0, 0, 0, 0.12)',
        },
        elevation3: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15), 0px 3px 8px rgba(0, 0, 0, 0.1)',
        },
        elevation4: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.18), 0px 2px 12px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          backgroundColor: colors.surface.containerLow,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: 8,
        },
        track: {
          backgroundColor: colors.surface.outline,
        },
        thumb: {
          backgroundColor: colors.white,
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          regular: 'p',
          thin: 'p',
          bold: 'p',
          condensedBold: 'p',
        },
      },
    },
  },
});

// Dark theme configuration
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.white,
      light: colors.grey30,
      dark: colors.grey50,
      contrastText: colors.black,
    },
    secondary: {
      main: colors.white,
      light: colors.grey30,
      dark: colors.grey50,
      contrastText: colors.black,
    },
    error: {
      main: colors.errorRed,
    },
    warning: {
      main: colors.warningOrange,
    },
    success: {
      main: colors.successGreen,
    },
    info: {
      main: colors.infoBlue,
    },
    background: {
      default: colors.grey90,
      paper: colors.grey90,
    },
    text: {
      primary: colors.white,
      secondary: colors.grey30,
    },
    divider: colors.white,
  },
  typography,
  shape: {
    borderRadius: 16, // Material Design 3 uses more rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // More rounded for MD3
          padding: '8px 24px',
        },
        contained: {
          boxShadow: '0px 1px 2px rgba(255, 255, 255, 0.3), 0px 1px 3px 1px rgba(255, 255, 255, 0.15)',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(255, 255, 255, 0.3), 0px 4px 8px 3px rgba(255, 255, 255, 0.15)',
          },
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          regular: 'p',
          thin: 'p',
          bold: 'p',
          condensedBold: 'p',
        },
      },
    },
  },
}); 