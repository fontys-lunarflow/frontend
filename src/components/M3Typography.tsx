import React, { ReactNode } from 'react';
import { Typography, TypographyProps } from '@mui/material';

// Define custom typography variant types
type CustomVariant = 
  | 'regular' 
  | 'thin' 
  | 'bold' 
  | 'condensedBold';

interface M3TypographyProps extends Omit<TypographyProps, 'variant'> {
  variant?: TypographyProps['variant'] | CustomVariant;
  children: ReactNode;
}

/**
 * Material Design 3 Typography component that supports both standard and custom variants
 * 
 * Standard MUI variants:
 * - h1, h2, h3, h4, h5, h6
 * - subtitle1, subtitle2
 * - body1, body2
 * - button, caption, overline
 * 
 * Custom variants:
 * - regular: Roboto Regular
 * - thin: Roboto Thin
 * - bold: Roboto Bold
 * - condensedBold: Roboto Condensed Bold
 */
const M3Typography = ({
  variant = 'body1',
  children,
  ...props
}: M3TypographyProps) => {
  // Custom styles for special variants
  const getCustomStyles = () => {
    switch (variant) {
      case 'regular':
        return {
          fontFamily: 'var(--font-roboto)',
          fontWeight: 400,
        };
      case 'thin':
        return {
          fontFamily: 'var(--font-roboto)',
          fontWeight: 100,
        };
      case 'bold':
        return {
          fontFamily: 'var(--font-roboto)',
          fontWeight: 700,
        };
      case 'condensedBold':
        return {
          fontFamily: 'var(--font-roboto-condensed)',
          fontWeight: 700,
        };
      default:
        return {};
    }
  };

  // Custom variants
  const customVariants = ['regular', 'thin', 'bold', 'condensedBold'];
  
  // If it's a custom variant, use body1 as the base and override with custom styles
  if (customVariants.includes(variant as string)) {
    return (
      <Typography
        variant="body1"
        sx={{
          ...getCustomStyles(),
          ...props.sx
        }}
        {...props}
      >
        {children}
      </Typography>
    );
  }
  
  // For standard variants, just pass through
  return (
    <Typography variant={variant as TypographyProps['variant']} {...props}>
      {children}
    </Typography>
  );
};

export default M3Typography; 