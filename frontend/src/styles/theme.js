import { createTheme } from '@mui/material/styles';
import { colors, typography, spacing, borders, shadows } from './tokens';

/**
 * Tema global para la aplicación basado en los tokens de diseño
 * Este tema será utilizado por ThemeProvider de Material UI
 */
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: colors.primary.contrastText,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: colors.secondary.contrastText,
    },
    error: {
      main: colors.status.error,
    },
    warning: {
      main: colors.status.warning,
    },
    info: {
      main: colors.status.info,
    },
    success: {
      main: colors.status.success,
    },
    grey: {
      50: colors.neutral.gray100,
      100: colors.neutral.gray200,
      200: colors.neutral.gray300,
      300: colors.neutral.gray400,
      400: colors.neutral.gray500,
      500: colors.neutral.gray600,
      600: colors.neutral.gray700,
      700: colors.neutral.gray800,
      800: colors.neutral.gray900,
      900: colors.neutral.black,
    },
    background: {
      default: colors.neutral.white,
      paper: colors.neutral.gray100,
    },
    text: {
      primary: colors.neutral.gray900,
      secondary: colors.neutral.gray700,
      disabled: colors.neutral.gray500,
    },
  },
  typography: {
    fontFamily: typography.fontFamily,
    fontWeightLight: typography.fontWeights.light,
    fontWeightRegular: typography.fontWeights.regular,
    fontWeightMedium: typography.fontWeights.medium,
    fontWeightBold: typography.fontWeights.bold,
    h1: {
      fontSize: typography.fontSize.xxxl,
      fontWeight: typography.fontWeights.bold,
      lineHeight: typography.lineHeight.tight,
    },
    h2: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeights.bold,
      lineHeight: typography.lineHeight.tight,
    },
    h3: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeights.medium,
      lineHeight: typography.lineHeight.tight,
    },
    h4: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeights.medium,
      lineHeight: typography.lineHeight.normal,
    },
    h5: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeights.medium,
      lineHeight: typography.lineHeight.normal,
    },
    h6: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeights.medium,
      lineHeight: typography.lineHeight.normal,
    },
    body1: {
      fontSize: typography.fontSize.md,
      lineHeight: typography.lineHeight.normal,
    },
    body2: {
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.normal,
    },
    button: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeights.medium,
      textTransform: 'none',
    },
    caption: {
      fontSize: typography.fontSize.xs,
      lineHeight: typography.lineHeight.normal,
    },
  },
  shape: {
    borderRadius: parseInt(borders.radius.md.replace('rem', '')) * 16,
  },
  shadows: [
    'none',
    shadows.sm,
    shadows.md,
    shadows.lg,
    shadows.xl,
    // Completar con el resto de sombras requeridas por Material UI
    ...Array(20).fill(shadows.xl),
  ],
  spacing: (factor) => {
    const spacingValues = {
      1: spacing.xs,
      2: spacing.sm,
      3: spacing.md,
      4: spacing.lg,
      5: spacing.xl,
      6: spacing.xxl,
    };
    // Convertir de rem a px para Material UI
    const value = spacingValues[factor] || `${factor * 0.25}rem`;
    return value.replace('rem', '') * 16;
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borders.radius.md,
          padding: `${spacing.sm} ${spacing.md}`,
          boxShadow: shadows.sm,
          '&:hover': {
            boxShadow: shadows.md,
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: colors.primary.dark,
          },
        },
        outlined: {
          borderWidth: borders.width.medium,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: shadows.md,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borders.radius.lg,
          padding: spacing.md,
        },
      },
    },
  },
});

export default theme;
