'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Calendar, momentLocalizer, View, NavigateAction, SlotInfo, EventPropGetter, DayPropGetter } from 'react-big-calendar';
import moment from 'moment';
import { 
  Box, 
  useTheme, 
  Tooltip, 
  Paper, 
  IconButton,
  ButtonGroup,
  Button
} from '@mui/material';
import { ContentItem } from '@/lib/config/api';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TodayIcon from '@mui/icons-material/Today';
import M3Typography from '@/components/M3Typography';
import CreateContentModal from './CreateContentModal';
import ContentItemModal from './ContentItemModal';

// Import styles
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Add custom styles for the feedback effect
const clickEffectStyles = `
  @keyframes pulseEffect {
    0% { background-color: rgba(33, 150, 243, 0.4); }
    100% { background-color: transparent; }
  }
  
  .slot-click-effect {
    animation: pulseEffect 0.5s ease-out;
  }
`;

// Add custom styles for better calendar appearance
const calendarStyles = `
  .rbc-calendar {
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  }
  
  .rbc-header {
    padding: 10px 3px;
    font-weight: 500;
    font-size: 0.875rem;
  }
  
  .rbc-month-view {
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }
  
  .rbc-time-view {
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }
  
  .rbc-day-bg {
    transition: background-color 0.2s ease;
  }
  
  .rbc-day-bg:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  .rbc-event {
    border-radius: 4px;
    padding: 2px 5px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }
  
  .rbc-today {
    background-color: rgba(66, 165, 245, 0.08);
  }
  
  .rbc-off-range-bg {
    background-color: #f9f9f9;
  }
`;

// Setup moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);

interface ContentCalendarProps {
  contentItems: ContentItem[];
  refreshContentItems?: () => void;
  view?: View;
  onViewChange?: (view: View) => void;
  date?: Date;
  onDateChange?: (date: Date) => void;
}

// Event interface for the calendar
interface CalendarEvent {
  id?: number;
  title: string;
  start: Date;
  end: Date;
  resource: ContentItem;
}

const ContentCalendar: React.FC<ContentCalendarProps> = ({ 
  contentItems, 
  refreshContentItems,
  view: externalView,
  onViewChange: externalOnViewChange,
  date: externalDate,
  onDateChange: externalOnDateChange
}) => {
  const theme = useTheme();
  
  // Use external state if provided, otherwise use local state
  const [localView, setLocalView] = useState<View>('month');
  const [localDate, setLocalDate] = useState(new Date());
  
  const view = externalView !== undefined ? externalView : localView;
  const date = externalDate !== undefined ? externalDate : localDate;
  
  const setView = externalOnViewChange || setLocalView;
  const setDate = externalOnDateChange || setLocalDate;
  
  // State for the create content dialog
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date, end: Date } | null>(null);
  
  // State for content item modal
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [selectedContentItem, setSelectedContentItem] = useState<ContentItem | null>(null);
  const [modalAnchorEl, setModalAnchorEl] = useState<HTMLElement | null>(null);
  
  // Track click position for visual feedback
  const [clickPosition, setClickPosition] = useState<{ x: number, y: number } | null>(null);
  const clickEffectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (clickEffectTimeoutRef.current) {
        clearTimeout(clickEffectTimeoutRef.current);
      }
    };
  }, []);

  // Convert content items to calendar events
  const events: CalendarEvent[] = contentItems
    .filter((item, index, self) => 
      // Remove duplicates based on ID
      index === self.findIndex(t => t.id === item.id)
    )
    .map(item => {
      let startDate;
      
      // Use publicationDate as primary date source
      if (item.publicationDate) {
        startDate = new Date(item.publicationDate);
      } else if (item.date) {
        // Fallback to date field if publicationDate is not available
        startDate = new Date(item.date);
      } else {
        // Last resort: use current date
        startDate = new Date();
      }
      
      // If we have startTime, update the hours/minutes
      if (item.startTime) {
        const startTime = new Date(item.startTime);
        startDate.setHours(startTime.getHours());
        startDate.setMinutes(startTime.getMinutes());
      }
      
      // Calculate end date/time
      let endDate;
      if (item.endTime) {
        endDate = new Date(item.endTime);
      } else {
        // For publication dates without explicit end time, make it a point-in-time event
        endDate = new Date(startDate);
      }
      
      return {
        id: item.id,
        title: item.title,
        start: startDate,
        end: endDate,
        resource: item
      };
    });

  // Custom event styling
  const eventPropGetter: EventPropGetter<CalendarEvent> = useCallback((event: CalendarEvent) => {
    // Use project color if available, otherwise fall back to theme primary color
    let projectColor = event.resource.project?.color || theme.palette.primary.main;
    
    // Add # prefix if the color doesn't have it (for hex colors)
    if (projectColor && !projectColor.startsWith('#') && projectColor.length === 6) {
      projectColor = `#${projectColor}`;
    }
    
    return { 
      style: { 
        backgroundColor: projectColor, 
        color: 'white', // Use white text for better contrast with project colors
        borderRadius: '4px', 
        border: 'none',
        fontSize: '0.875rem',
        fontWeight: '500'
      } 
    };
  }, [theme.palette.primary.main]);

  // Custom day cell styling to highlight today's date
  const dayPropGetter: DayPropGetter = useCallback((date: Date) => {
    const today = new Date();
    
    // Check if the date is today
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return {
        style: {
          // Style for the cell itself
        },
        className: 'rbc-day-today'
      };
    }
    return {};
  }, []);

  // Custom highlight for today's date
  const todayHighlightStyles = `
    .rbc-today {
      background-color: rgba(33, 150, 243, 0.1);
      font-weight: bold;
    }
  `;

  // Custom tooltip for events
  const eventContent = useCallback(({ event }: { event: CalendarEvent }) => {
    return (
      <Tooltip
        title={
          <Box>
            <div><strong>{event.resource.title}</strong></div>
            <div>Status: {event.resource.status || 'N/A'}</div>
            {event.resource.subject && <div>Subject: {event.resource.subject}</div>}
            {event.resource.topic && <div>Topic: {event.resource.topic}</div>}
            {event.resource.publicationDate && (
              <div>Publication Date: {moment(event.resource.publicationDate).format('MMM DD, YYYY')}</div>
            )}
            {event.resource.lifecycleStage && (
              <div>Lifecycle Stage: {event.resource.lifecycleStage}</div>
            )}
          </Box>
        }
      >
        <span>{event.title}</span>
      </Tooltip>
    );
  }, []);

  const handleSelectEvent = useCallback((calEvent: object, e: React.SyntheticEvent) => {
    const event = calEvent as CalendarEvent;
    const contentItem = event.resource;
    
    if (contentItem) {
      // Set the anchor element for the popover
      setModalAnchorEl(e.currentTarget as HTMLElement);
      setSelectedContentItem(contentItem);
      setContentModalOpen(true);
    }
  }, []);

  const handleNavigate = useCallback((action: NavigateAction) => {
    let newDate = new Date(date);
    
    if (action === 'PREV') {
      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() - 7);
      } else if (view === 'day') {
        newDate.setDate(newDate.getDate() - 1);
      }
    } else if (action === 'NEXT') {
      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() + 7);
      } else if (view === 'day') {
        newDate.setDate(newDate.getDate() + 1);
      }
    } else if (action === 'TODAY') {
      newDate = new Date();
    }
    
    setDate(newDate);
  }, [date, view]);

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  // Handle content modal actions
  const handleContentModalClose = () => {
    setContentModalOpen(false);
    setSelectedContentItem(null);
    setModalAnchorEl(null);
  };

  // Handle slot selection (clicking on empty space in calendar)
  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    // Save the selected time slot
    setSelectedSlot({
      start: new Date(slotInfo.start),
      end: new Date(slotInfo.end)
    });
    
    // Create visual feedback at click position
    if (slotInfo.box) {
      // Get the click position relative to the calendar
      setClickPosition({
        x: slotInfo.box.x,
        y: slotInfo.box.y
      });

      // Clear the click position after animation completes
      if (clickEffectTimeoutRef.current) {
        clearTimeout(clickEffectTimeoutRef.current);
      }
      
      clickEffectTimeoutRef.current = setTimeout(() => {
        setClickPosition(null);
      }, 500); // Match animation duration
    }
    
    // Open the create modal
    setCreateModalOpen(true);
  }, []);

  // Handle close of create modal
  const handleCreateModalClose = useCallback(() => {
    setCreateModalOpen(false);
    setSelectedSlot(null);
    
    // Refresh the content items list if provided
    if (refreshContentItems) {
      refreshContentItems();
    }
  }, [refreshContentItems]);

  return (
    <Paper elevation={0} sx={{ 
      p: 2, 
      height: 'calc(100vh - 130px)',
      backgroundColor: 'white',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
      {/* Add custom styles */}
      <style>{clickEffectStyles}</style>
      <style>{todayHighlightStyles}</style>
      <style>{calendarStyles}</style>
      
      {/* Custom Calendar Toolbar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        px: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => handleNavigate('PREV')} size="small" sx={{ mr: 1 }}>
            <NavigateBeforeIcon />
          </IconButton>
          
          <IconButton onClick={() => handleNavigate('TODAY')} size="small" sx={{ mr: 1 }}>
            <TodayIcon />
          </IconButton>
          
          <IconButton onClick={() => handleNavigate('NEXT')} size="small">
            <NavigateNextIcon />
          </IconButton>
        </Box>
        
        <M3Typography variant="h6" sx={{ fontWeight: 500 }}>
          {view === 'month' && moment(date).format('MMMM YYYY')}
          {view === 'week' && `${moment(date).startOf('week').format('MMM D')} - ${moment(date).endOf('week').format('MMM D, YYYY')}`}
          {view === 'day' && moment(date).format('dddd, MMMM D, YYYY')}
          {view === 'agenda' && moment(date).format('MMMM YYYY')}
        </M3Typography>
        
        <ButtonGroup size="small">
          <Button 
            variant={view === 'month' ? 'contained' : 'outlined'}
            onClick={() => handleViewChange('month')}
          >
            Month
          </Button>
          <Button 
            variant={view === 'week' ? 'contained' : 'outlined'}
            onClick={() => handleViewChange('week')}
          >
            Week
          </Button>
          <Button 
            variant={view === 'day' ? 'contained' : 'outlined'}
            onClick={() => handleViewChange('day')}
          >
            Day
          </Button>
          <Button 
            variant={view === 'agenda' ? 'contained' : 'outlined'}
            onClick={() => handleViewChange('agenda')}
          >
            Agenda
          </Button>
        </ButtonGroup>
      </Box>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100% - 48px)' }}
        views={['month', 'week', 'day', 'agenda']}
        view={view}
        date={date}
        onView={handleViewChange}
        toolbar={false}
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
        components={{
          event: eventContent
        }}
        onSelectEvent={handleSelectEvent}
        selectable={true}
        onSelectSlot={handleSelectSlot}
        popup
      />

      {/* Create Content Modal */}
      {createModalOpen && selectedSlot && (
        <CreateContentModal 
          open={createModalOpen}
          onClose={handleCreateModalClose}
          defaultPublicationDate={selectedSlot.start.toISOString()}
        />
      )}
      
      {/* Content Item Modal */}
      {selectedContentItem && (
        <ContentItemModal
          open={contentModalOpen}
          onClose={handleContentModalClose}
          anchorEl={modalAnchorEl}
          contentItem={selectedContentItem}
          onDelete={refreshContentItems}
        />
      )}
      
      {/* Click Visual Feedback Effect */}
      {clickPosition && (
        <Box
          className="slot-click-effect"
          sx={{
            position: 'absolute',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            left: `${clickPosition.x - 30}px`,
            top: `${clickPosition.y - 30}px`,
            pointerEvents: 'none',
            zIndex: 10
          }}
        />
      )}
    </Paper>
  );
};

export default ContentCalendar; 