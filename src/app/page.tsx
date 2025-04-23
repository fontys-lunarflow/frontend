'use client';

import { useTheme } from '@/lib/ThemeContext';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Switch, 
  FormControlLabel,
  Stack
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NextLink from 'next/link';

export default function Home() {
  const { mode, toggleTheme } = useTheme();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      padding: 4,
      bgcolor: 'background.default',
      color: 'text.primary',
      transition: 'all 0.3s ease'
    }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          mx: 'auto',
          p: 4,
          borderRadius: 4
        }}
      >
        <Typography variant="h4" color="primary.main" gutterBottom>
          Material UI 3 Theme Demo
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          Current theme: <strong>{mode}</strong>
        </Typography>

        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={mode === 'dark'}
                onChange={toggleTheme}
                color="primary"
              />
            }
            label={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}
          />

          {mode === 'dark' ? <Brightness7Icon sx={{ ml: 1 }} /> : <Brightness4Icon sx={{ ml: 1 }} />}
        </Box>

        <Typography variant="h6" gutterBottom>
          Material Design 3 Buttons
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          <Button variant="contained">
            Contained Button
          </Button>
          
          <Button variant="outlined">
            Outlined Button
          </Button>
          
          <Button variant="text">
            Text Button
          </Button>
        </Box>
        
        <Stack direction="column" spacing={2} sx={{ textAlign: 'center' }}>
          <Button 
            component={NextLink} 
            href="/demo" 
            variant="contained" 
            color="primary"
          >
            View Full Demo
          </Button>
          
          <Button 
            component={NextLink} 
            href="/typography" 
            variant="outlined" 
            color="primary"
          >
            Typography Showcase
          </Button>
          
          <Button 
            component={NextLink} 
            href="/content" 
            variant="outlined" 
            color="primary"
          >
            Content List
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
