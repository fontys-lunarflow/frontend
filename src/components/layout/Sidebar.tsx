import React, { ReactNode } from 'react';
import { 
  Box, 
  Drawer
} from '@mui/material';
import { motion } from 'framer-motion';
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
  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidth : 0,
          overflowX: 'hidden',
          overflowY: 'auto',
          boxSizing: 'border-box',
          backgroundColor: colors.uiLightGray,
          top: '64px',
          height: 'calc(100% - 64px)',
          border: 'none',
          boxShadow: 'none',
          borderRight: 'none',
          transition: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: open ? 1 : 0,
          x: open ? 0 : -20
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        style={{
          height: '100%',
          overflow: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <Box sx={{ 
          overflow: 'auto',
          height: '100%',
          '&::-webkit-scrollbar': {
            display: 'none',
            width: 0,
            height: 0,
          },
          '&::-webkit-scrollbar-track': {
            display: 'none',
          },
          '&::-webkit-scrollbar-thumb': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}>
          {children}
        </Box>
      </motion.div>
    </Drawer>
  );
};

export default Sidebar; 