import React, { ReactNode } from 'react';
import { 
  Box, 
  Drawer,
  useTheme
} from '@mui/material';
import { colors } from '@/lib/config/colors';

interface SidebarProps {
  children: ReactNode;
  open: boolean;
  drawerWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  children,
  open,
  drawerWidth
}) => {
  const theme = useTheme();

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.standard,
        }),
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidth : 0,
          overflowX: 'hidden',
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: colors.uiLightGray,
          top: '64px',
          height: 'calc(100% - 64px)',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        },
      }}
    >

      <Box sx={{ overflow: 'auto' }}>
        {children}
      </Box>
    </Drawer>
  );
};

export default Sidebar; 