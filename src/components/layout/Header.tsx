import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Box, 
  Avatar, 
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import M3Typography from '@/components/M3Typography';
import MenuIcon from '@mui/icons-material/Menu';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTheme } from '@mui/material/styles';
import { colors } from '@/lib/config/colors';

interface HeaderProps {
  filterValue: string;
  handleDrawerToggle: () => void;
  handleFilterChange: (event: SelectChangeEvent) => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  filterValue, 
  handleDrawerToggle, 
  handleFilterChange,
  children 
}) => {
  const theme = useTheme();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: colors.uiLightGray,
        color: theme.palette.secondary.dark,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`
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
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Box 
            sx={{ 
              width: 28, 
              height: 28, 
              borderRadius: '50%', 
              backgroundColor: theme.palette.primary.main,
              mr: 1
            }} 
          />
          <M3Typography variant="h6" color="inherit" noWrap>
            eclipse
          </M3Typography>
        </Box>
        
        {/* Custom content */}
        {children}
        
        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Filters - moved to right side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          
          {/* View filter dropdown */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <Select
              value={filterValue}
              onChange={handleFilterChange}
              displayEmpty
              startAdornment={<FilterListIcon sx={{ ml: 1 }} />}
              sx={{ 
                borderRadius: '50px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.divider
                }
              }}
            >
              <MenuItem value="">
                <em>List View</em>
              </MenuItem>
              <MenuItem value="filter1">Filter 1</MenuItem>
              <MenuItem value="filter2">Filter 2</MenuItem>
            </Select>
          </FormControl>

          {/* User avatar */}
          <IconButton color="inherit">
            <Avatar sx={{ width: 32, height: 32 }}>
              <M3Typography variant="body2">U</M3Typography>
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 