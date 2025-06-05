import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Box, 
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery
} from '@mui/material';
import AuthButton from '@/components/AuthButton';
import MenuIcon from '@mui/icons-material/Menu';
import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { useTheme } from '@mui/material/styles';
import { colors } from '@/lib/config/colors';

interface HeaderProps {
  handleDrawerToggle: () => void;
  viewMode?: 'list' | 'calendar';
  handleViewModeChange?: (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: 'list' | 'calendar' | null,
  ) => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  handleDrawerToggle, 
  viewMode = 'list',
  handleViewModeChange,
  children 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: colors.uiLightGray,
        color: theme.palette.secondary.dark,
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 4, ml: 3 }}>
          <Box 
            component="img"
            src="/logo.svg"
            alt="Eclipse Logo"
            sx={{ 
              width: 80,
              height: 80,
              transform: 'scale(2.2)',
              transformOrigin: 'center center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
          />
        </Box>
        
        {/* Custom content */}
        {children}
        
        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Controls on right side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          
          {/* View Mode Toggle */}
          {handleViewModeChange && (
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              size={isMobile ? "small" : "medium"}
              sx={{ mr: 1 }}
            >
              <ToggleButton value="list" aria-label="list view">
                <ViewListIcon />
              </ToggleButton>
              <ToggleButton value="calendar" aria-label="calendar view">
                <CalendarViewMonthIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          )}

          {/* Authentication Button */}
          <AuthButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 