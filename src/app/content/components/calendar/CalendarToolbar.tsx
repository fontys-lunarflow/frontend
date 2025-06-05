import React from 'react';
import { Box, IconButton, ButtonGroup, Button } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TodayIcon from '@mui/icons-material/Today';
import { View, NavigateAction } from 'react-big-calendar';
import moment from 'moment';
import M3Typography from '@/components/M3Typography';

interface CalendarToolbarProps {
  date: Date;
  view: View;
  onNavigate: (action: NavigateAction) => void;
  onViewChange: (view: View) => void;
}

/**
 * Custom toolbar component for the calendar view
 */
const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  date,
  view,
  onNavigate,
  onViewChange
}) => {
  // Format the date based on the current view
  const formatDate = () => {
    if (view === 'month') {
      return moment(date).format('MMMM YYYY');
    } else if (view === 'week') {
      return `${moment(date).startOf('week').format('MMM D')} - ${moment(date).endOf('week').format('MMM D, YYYY')}`;
    } else if (view === 'day') {
      return moment(date).format('dddd, MMMM D, YYYY');
    } else {
      return moment(date).format('MMMM YYYY');
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 2,
      px: 1
    }}>
      {/* Navigation buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => onNavigate('PREV')} size="small" sx={{ mr: 1 }}>
          <NavigateBeforeIcon />
        </IconButton>
        
        <IconButton onClick={() => onNavigate('TODAY')} size="small" sx={{ mr: 1 }}>
          <TodayIcon />
        </IconButton>
        
        <IconButton onClick={() => onNavigate('NEXT')} size="small">
          <NavigateNextIcon />
        </IconButton>
      </Box>
      
      {/* Date display */}
      <M3Typography variant="h6" sx={{ fontWeight: 500 }}>
        {formatDate()}
      </M3Typography>
      
      {/* View mode buttons */}
      <ButtonGroup size="small">
        <Button
          variant={view === 'month' ? 'contained' : 'outlined'}
          onClick={() => onViewChange('month')}
        >
          Month
        </Button>
        <Button
          variant={view === 'week' ? 'contained' : 'outlined'}
          onClick={() => onViewChange('week')}
        >
          Week
        </Button>
        <Button
          variant={view === 'day' ? 'contained' : 'outlined'}
          onClick={() => onViewChange('day')}
        >
          Day
        </Button>
        <Button
          variant={view === 'agenda' ? 'contained' : 'outlined'}
          onClick={() => onViewChange('agenda')}
        >
          Agenda
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default CalendarToolbar; 