import React, { ReactNode } from 'react';
import { Button as MuiButton, ButtonProps, useTheme } from '@mui/material';

interface M3ButtonProps extends Omit<ButtonProps, 'variant'> {
  children: ReactNode;
  variant?: 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text';
}

/**
 * Material Design 3 styled button
 * 
 * Variants:
 * - filled: Primary action, high emphasis (default)
 * - tonal: Secondary action with medium emphasis
 * - elevated: Primary action with elevation
 * - outlined: Medium emphasis with clear boundaries
 * - text: Low emphasis, usually for tertiary actions
 */
export default function M3Button({ 
  children, 
  variant = 'filled', 
  ...props 
}: M3ButtonProps) {
  const theme = useTheme();
  
  // Map Material Design 3 variants to MUI variants
  let muiVariant: ButtonProps['variant'] = 'contained';
  let additionalStyles: React.CSSProperties = {};
  
  switch (variant) {
    case 'filled':
      muiVariant = 'contained';
      additionalStyles = { 
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      };
      break;
    case 'tonal':
      muiVariant = 'contained';
      additionalStyles = { 
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.dark,
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)'
      };
      break;
    case 'elevated':
      muiVariant = 'contained';
      additionalStyles = { 
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.dark,
        boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)'
      };
      break;
    case 'outlined':
      muiVariant = 'outlined';
      additionalStyles = {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
      };
      break;
    case 'text':
      muiVariant = 'text';
      additionalStyles = {
        color: theme.palette.primary.main,
      };
      break;
  }

  return (
    <MuiButton
      variant={muiVariant}
      style={additionalStyles}
      disableElevation={variant !== 'elevated' && variant !== 'filled' && variant !== 'tonal'}
      {...props}
    >
      {children}
    </MuiButton>
  );
} 