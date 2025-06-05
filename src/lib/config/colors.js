// lib/config/colors.ts
export const colors = {
  white: '#ffffff',
  black: '#000000',
  
  // Primary colors
  primary: {
    main: '#F8971D', // P-40
    light: '#FCE2C4', // P-90 (Primary Container)
    dark: '#9E5600', // P-10 (On Primary Container)
    onPrimary: '#FFFFFF', // P-100 (On Primary)
    container: '#FCE2C4', // P-90 (Primary Container)
    onContainer: '#9E5600', // P-10 (On Primary Container)
    fixedDim: '#EBBE83', // P-80 (Primary Fixed Dim)
  },
  
  // Secondary colors
  secondary: {
    main: '#3E4040', // S-40
    light: '#E1E3E1', // S-90 (Secondary Container)
    dark: '#1F2020', // S-10 (On Secondary Container)
    onSecondary: '#FFFFFF', // S-100 (On Secondary)
    container: '#E1E3E1', // S-90 (Secondary Container)
    onContainer: '#1F2020', // S-10 (On Secondary Container)
    fixedDim: '#BDBFBD', // S-80 (Secondary Fixed Dim)
  },
  
  // Tertiary colors
  tertiary: {
    main: '#8E5E70', // T-40
    light: '#FFDBE3', // T-90 (Tertiary Container)
    dark: '#5C2939', // T-10 (On Tertiary Container)
    onTertiary: '#FFFFFF', // T-100 (On Tertiary)
    container: '#FFDBE3', // T-90 (Tertiary Container)
    onContainer: '#5C2939', // T-10 (On Tertiary Container)
    fixedDim: '#D2A6B3', // T-80 (Tertiary Fixed Dim)
  },
  
  // Error colors
  error: {
    main: '#C0392B', // E-40
    light: '#FFDAD6', // E-90 (Error Container)
    dark: '#690000', // E-10 (On Error Container)
    onError: '#FFFFFF', // E-100 (On Error)
    container: '#FFDAD6', // E-90 (Error Container)
    onContainer: '#690000', // E-10 (On Error Container)
  },
  
  // Surface colors
  surface: {
    main: '#FFFBFF', // N-98 (Surface)
    dim: '#FCE2C4', // N-87 (Surface Dim)
    bright: '#FFFBFF', // N-98 (Surface Bright)
    containerLowest: '#FFFFFF', // N-100 (Surface Container Lowest)
    containerLow: '#F9F9F9', // N-96 (Surface Container Low)
    container: '#F3F3F3', // N-94 (Surface Container)
    containerHigh: '#EDEDED', // N-92 (Surface Container High)
    containerHighest: '#E8E8E8', // N-90 (Surface Container Highest)
    onSurface: '#151415', // N-10 (On Surface)
    onSurfaceVariant: '#464646', // NV-30 (On Surface Variant)
    outline: '#757575', // NV-50 (Outline)
    outlineVariant: '#2C2C2C', // NV-80 (Outline Variant)
  },
  
  // Inverse colors
  inverse: {
    surface: '#2E2E2E', // N-20 (Inverse Surface)
    onSurface: '#F1F1F1', // N-95 (Inverse On Surface)
    primary: '#EBBE83', // P-80 (Inverse Primary)
  },
  
  // Special colors
  scrim: '#000000', // N-0 (Scrim)
  shadow: '#000000', // N-0 (Shadow)
  
  // Blues
  energeticBlue: '#1976d2',
  baseBlue: '#42a5f5',
  darkBlue: '#1565c0',
  
  // Greys
  grey10: '#f5f5f5',
  grey20: '#eeeeee',  // Very light gray for dividers
  grey25: '#e5e5e5',  // Slightly darker gray for more visible dividers
  grey30: '#e0e0e0',
  grey50: '#9e9e9e',
  grey70: '#616161',
  grey90: '#212121',
  
  // UI specific colors
  uiLightGray: '#F5F5F5', // Light gray for sidebar and header
  
  // Status colors
  errorRed: '#d32f2f',
  successGreen: '#2e7d32',
  warningOrange: '#ed6c02',
  infoBlue: '#0288d1',
}