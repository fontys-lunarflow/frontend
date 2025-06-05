'use client';

import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Container, 
  Stack,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Divider,
  useTheme
} from '@mui/material';
import { useTheme as useAppTheme } from '@/lib/ThemeContext';
import M3Button from '@/components/M3Button';
import { colors } from '@/lib/config/colors';

// Color palette display component
const ColorSwatch = ({ color, name }: { color: string; name: string }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
    <Box 
      sx={{ 
        width: 60, 
        height: 60, 
        bgcolor: color, 
        borderRadius: 2,
        border: '1px solid #0000001A',
        mb: 1
      }} 
    />
    <Typography variant="caption" align="center">{name}</Typography>
    <Typography variant="caption" align="center" color="text.secondary">{color}</Typography>
  </Box>
);

export default function MaterialDesign3Demo() {
  const { mode, toggleTheme } = useAppTheme();
  const theme = useTheme();
  
  // For the custom property access
  const surfaceDim = theme.palette.background.paper;
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          backgroundColor: surfaceDim,
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" color="primary.main" gutterBottom>
            Material Design 3 Demo
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={mode === 'dark'}
                onChange={toggleTheme}
                color="primary"
              />
            }
            label={`${mode === 'light' ? 'Dark' : 'Light'} Mode`}
          />
        </Box>
        <Typography variant="body1">
          This demo showcases the Material Design 3 components and color palette.
        </Typography>
      </Paper>

      {/* Buttons Showcase */}
      <Card sx={{ mb: 4, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Buttons</Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>Filled (Primary)</Typography>
              <M3Button variant="filled" sx={{ mb: 2 }}>Filled Button</M3Button>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>Tonal (Secondary)</Typography>
              <M3Button variant="tonal" sx={{ mb: 2 }}>Tonal Button</M3Button>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>Elevated</Typography>
              <M3Button variant="elevated" sx={{ mb: 2 }}>Elevated Button</M3Button>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>Outlined</Typography>
              <M3Button variant="outlined" sx={{ mb: 2 }}>Outlined Button</M3Button>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>Text</Typography>
              <M3Button variant="text" sx={{ mb: 2 }}>Text Button</M3Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card sx={{ mb: 4, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Color Palette</Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Primary</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <ColorSwatch color={theme.palette.primary.main} name="Primary" />
              <ColorSwatch color={theme.palette.primary.light} name="Primary Light" />
              <ColorSwatch color={theme.palette.primary.dark} name="Primary Dark" />
              <ColorSwatch color={theme.palette.primary.contrastText} name="On Primary" />
            </Stack>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Secondary</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <ColorSwatch color={theme.palette.secondary.main} name="Secondary" />
              <ColorSwatch color={theme.palette.secondary.light} name="Secondary Light" />
              <ColorSwatch color={theme.palette.secondary.dark} name="Secondary Dark" />
              <ColorSwatch color={theme.palette.secondary.contrastText} name="On Secondary" />
            </Stack>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Tertiary</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <ColorSwatch color={colors.tertiary.main} name="Tertiary" />
              <ColorSwatch color={colors.tertiary.light} name="Tertiary Light" />
              <ColorSwatch color={colors.tertiary.dark} name="Tertiary Dark" />
              <ColorSwatch color={colors.tertiary.onTertiary} name="On Tertiary" />
            </Stack>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Surface</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <ColorSwatch color={theme.palette.background.default} name="Background" />
              <ColorSwatch color={theme.palette.background.paper} name="Surface" />
              <ColorSwatch color={theme.palette.text.primary} name="On Surface" />
              <ColorSwatch color={theme.palette.text.secondary} name="On Surface Variant" />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
} 