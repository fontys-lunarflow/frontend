'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, Fab } from '@mui/material';
import { motion } from 'framer-motion';
import M3Typography from '@/components/M3Typography';
import AddIcon from '@mui/icons-material/Add';
import { View } from 'react-big-calendar';

// Global layout components
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

// Content-specific components
import ContentList from './content/components/ContentList';
import ContentCalendar from './content/components/ContentCalendar';
import SidebarContent from './content/components/SidebarContent';
import CreateContentModal from './content/components/CreateContentModal';

// Utilities
import { ContentItem } from '@/lib/config/api';
import { ContentFilters } from '@/lib/services/contentApi';
import { colors } from '@/lib/config/colors';

// Server actions
import { fetchContentItems } from './content/actions';

// Available view modes
type ViewMode = 'list' | 'calendar';

// Sidebar width - follow Material Design 3 guidelines
const drawerWidth = 304; // 19 * 16px = 304px

export default function HomePage() {
  const [open, setOpen] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [calendarView, setCalendarView] = useState<View>('month');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState<ContentFilters>({});
  
  // State for content items from API
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const getContentItems = useCallback(async (filtersToUse?: ContentFilters) => {
    try {
      setLoading(true);
      
      console.log('🔍 getContentItems called with filters:', filtersToUse);
      
      const result = await fetchContentItems(filtersToUse || {});
      
      if (result.success) {
        setContentItems(result.data || []);
        setError(null);
      } else {
        setError('error' in result ? result.error || 'Unknown error occurred' : 'Unknown error occurred');
      }
    } catch (err) {
      console.error('❌ Failed to fetch content items:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initial fetch - just get all content items
  useEffect(() => {
    getContentItems();
  }, []); // Only run on mount
  
  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: ContentFilters) => {
    setFilters(newFilters);
    getContentItems(newFilters);
  }, [getContentItems]);
  
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleCalendarToggle = () => {
    setCalendarOpen(!calendarOpen);
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null,
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    getContentItems(filters); // Refresh content items after creating a new one
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* App Bar */}
      <Header 
        handleDrawerToggle={handleDrawerToggle} 
        viewMode={viewMode}
        handleViewModeChange={handleViewModeChange}
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
          refreshContentItems={() => getContentItems(filters)}
          onFiltersChange={handleFiltersChange}
        />
      </Sidebar>
      
      {/* Main content */}
      <Box
        component={motion.main}
        layout
        transition={{
          duration: 0.3,
          ease: [0.4, 0.0, 0.2, 1], // Material Design easing
        }}
        sx={{
          flexGrow: 1,
          marginTop: '64px',
          padding: '16px 16px 16px 8px', // 8px left padding, 16px on other sides
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)',
          maxWidth: open ? 'calc(100vw - 304px)' : '100vw', // Responsive width based on sidebar state
          overflow: 'auto',
          // Hide scrollbar for main content - all browsers
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
        }}
      >
        {/* Content Area - White Card Container */}
        <Box
          component={motion.div}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          sx={{
            width: '100%',
            flex: 1, // Use flex instead of fixed height
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colors.white,
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'auto',
            padding: '16px 24px',
            minHeight: 0, // Allow flex shrinking
            // Hide scrollbar for white card container - all browsers
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
          }}
        >
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}
            >
              <CircularProgress />
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '32px' }}
            >
              <M3Typography variant="body1" color="error">{error}</M3Typography>
            </motion.div>
          ) : viewMode === 'list' ? (
            <ContentList contentItems={contentItems} onRefresh={() => getContentItems(filters)} />
          ) : (
            <ContentCalendar 
              contentItems={contentItems} 
              refreshContentItems={() => getContentItems(filters)}
              view={calendarView}
              onViewChange={setCalendarView}
              date={calendarDate}
              onDateChange={setCalendarDate}
            />
          )}
        </Box>
        
        {/* Floating Action Button (FAB) - Updated to M3 style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            zIndex: 1200,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Fab 
            color="primary"
            variant="extended"
            aria-label="add content"
            onClick={handleOpenCreateModal}
            sx={{
              boxShadow: '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)',
              borderRadius: '16px',
              paddingLeft: '16px',
              paddingRight: '20px',
              height: '48px',
              gap: '8px',
              textTransform: 'none',
              fontWeight: 500,
              // Remove default position styling since motion.div handles it
              position: 'static',
            }}
          >
            <AddIcon sx={{ mr: 1 }} />
            Add item
          </Fab>
        </motion.div>
        
        {/* Create Content Modal */}
        <CreateContentModal
          open={createModalOpen}
          onClose={handleCloseCreateModal}
        />
      </Box>
    </Box>
  );
}
