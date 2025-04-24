'use client';

import React, { useState, useEffect } from 'react';
import { Box, SelectChangeEvent, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import M3Typography from '@/components/M3Typography';

// Global layout components
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

// Content-specific components
import ContentList from './components/ContentList';
import SidebarContent from './components/SidebarContent';

// Utilities
import { ContentItem } from '@/lib/config/api';
import { colors } from '@/lib/config/colors';

// Server actions
import { fetchContentItems } from './actions';

// Sidebar width - follow Material Design 3 guidelines
const drawerWidth = 304; // 19 * 16px = 304px

export default function ContentListPage() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [filterValue, setFilterValue] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // State for content items from API
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch content items from API using server action
  useEffect(() => {
    getContentItems();
  }, []);
  
  const getContentItems = async () => {
    try {
      setLoading(true);
      
      const result = await fetchContentItems();
      
      if (result.success) {
        setContentItems(result.data || []);
        setError(null);
      } else {
        setError(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Failed to fetch content items:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  
  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterValue(event.target.value);
  };

  const handleCalendarToggle = () => {
    setCalendarOpen(!calendarOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <Header 
        filterValue={filterValue} 
        handleDrawerToggle={handleDrawerToggle} 
        handleFilterChange={handleFilterChange} 
      />
      
      {/* Sidebar */}
      <Sidebar
        open={open}
        drawerWidth={drawerWidth}
      >
        <SidebarContent
          calendarOpen={calendarOpen}
          selectedDate={selectedDate}
          handleCalendarToggle={handleCalendarToggle}
          setSelectedDate={setSelectedDate}
          refreshContentItems={getContentItems}
        />
      </Sidebar>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 10,
          p: { xs: 2, md: 3 },
          pl: { sm: open ? `${drawerWidth}px` : 0 }, // <-- padding instead of margin
          transition: theme.transitions.create(['padding'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: colors.white, // White background for content area
          minHeight: '100vh',
          borderTopLeftRadius: '24px', // Add rounded top-left corner to main area
          overflow: 'hidden',
        }}
      >
       <Box
        sx={{
          width: '100%',
          maxWidth: '750px',
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.white,
        }}
      >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <M3Typography variant="body1" color="error">{error}</M3Typography>
            </Box>
          ) : (
            <ContentList contentItems={contentItems} onRefresh={getContentItems} />
          )}
        </Box>
      </Box>
    </Box>
  );
} 