'use client';

import React, { useState } from 'react';
import { Box, SelectChangeEvent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { colors } from '@/lib/config/colors';

// Global layout components
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

// Content-specific components
import ContentList from './components/ContentList';
import SidebarContent from './components/SidebarContent';

// Utilities
import { contentItems, groupItemsByDate, formatDate } from './utils/dataUtils';

// Sidebar width - follow Material Design 3 guidelines
const drawerWidth = 304; // 19 * 16px = 304px

export default function ContentListPage() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [filterValue, setFilterValue] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  
  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterValue(event.target.value);
  };

  const handleCalendarToggle = () => {
    setCalendarOpen(!calendarOpen);
  };

  // Group content items by date
  const groupedItems = groupItemsByDate(contentItems);

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
          <ContentList groupedItems={groupedItems} formatDate={formatDate} />
        </Box>
      </Box>
    </Box>
  );
} 