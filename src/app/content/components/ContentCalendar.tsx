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
import { useRouter } from 'next/navigation';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TodayIcon from '@mui/icons-material/Today';
import M3Typography from '@/components/M3Typography';
import CreateContentModal from './CreateContentModal';

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

// Setup moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);

interface ContentCalendarProps {
  contentItems: ContentItem[];
  onSelectEvent?: (contentItem: ContentItem) => void;
  refreshContentItems?: () => void;
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
  onSelectEvent,
  refreshContentItems
}) => {
  const theme = useTheme();
  const router = useRouter();
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  
  // State for the create content dialog
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date, end: Date } | null>(null);
  
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
  const events: CalendarEvent[] = contentItems.map(item => {
    let startDate;
    
    // Try to use publicationDate first, then date, then fallback to current date
    if (item.publicationDate) {
      startDate = new Date(item.publicationDate);
    } else if (item.date) {
      startDate = new Date(item.date);
    } else {
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
      // Default to 1 hour duration
      endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1);
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
  const eventPropGetter: EventPropGetter<CalendarEvent> = useCallback(() => {
    return { 
      style: { 
        backgroundColor: theme.palette.primary.main, 
        color: theme.palette.primary.contrastText, 
        borderRadius: '4px', 
        border: 'none' 
      } 
    };
  }, [theme.palette.primary.main, theme.palette.primary.contrastText]);

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

  // Add custom styles for today's date highlight
  const todayHighlightStyles = `
    .rbc-day-today .rbc-date-cell {
      position: relative;
    }
    
    .rbc-day-today .rbc-date-cell > a {
      position: relative;
      z-index: 2;
      color: white;
    }
    
    .rbc-day-today .rbc-date-cell > a::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 28px;
      height: 28px;
      background-color: ${theme.palette.primary.main};
      border-radius: 50%;
      z-index: -1;
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

  const handleSelectEvent = useCallback((calEvent: object) => {
    const event = calEvent as CalendarEvent;
    const contentItem = event.resource;
    if (contentItem?.id && onSelectEvent) {
      onSelectEvent(contentItem);
    } else if (contentItem?.id) {
      router.push(`/content/${contentItem.id}`);
    }
  }, [onSelectEvent, router]);

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
      height: 'calc(100vh - 150px)', 
      backgroundColor: 'white',
      borderRadius: '8px',
      position: 'relative', // For positioning the click effect
      overflow: 'hidden'
    }}>
      {/* Add custom styles for click effect and today highlight */}
      <style>{clickEffectStyles}</style>
      <style>{todayHighlightStyles}</style>
      
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