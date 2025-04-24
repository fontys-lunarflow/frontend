import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  ListItemIcon,
  Avatar, 
  Divider,
  Collapse
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import M3Typography from '@/components/M3Typography';
import AddIcon from '@mui/icons-material/Add';
import TodayIcon from '@mui/icons-material/Today';
import LabelIcon from '@mui/icons-material/Label';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import CreateContentModal from './CreateContentModal';

interface SidebarContentProps {
  calendarOpen: boolean;
  selectedDate: Date | null;
  handleCalendarToggle: () => void;
  setSelectedDate: (date: Date | null) => void;
  refreshContentItems?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ 
  calendarOpen, 
  selectedDate, 
  handleCalendarToggle,
  setSelectedDate,
  refreshContentItems
}) => {
  const theme = useTheme();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    if (refreshContentItems) {
      refreshContentItems();
    }
  };

  return (
    <>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
          sx={{ 
            width: '100%', 
            borderRadius: '50px',
            backgroundColor: theme.palette.primary.main,
            py: 1,
          }}
        >
          Create
        </Button>
      </Box>
      
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleCalendarToggle} sx={{ px: 2 }}>
            <ListItemIcon>
              <TodayIcon />
            </ListItemIcon>
            <ListItemText 
              primary={
                <M3Typography variant="body1">Calendar</M3Typography>
              } 
            />
            <ChevronRightIcon 
              sx={{ 
                transform: calendarOpen ? 'rotate(90deg)' : 'none',
                transition: theme.transitions.create('transform', {
                  duration: theme.transitions.duration.standard,
                  easing: theme.transitions.easing.easeInOut,
                })
              }} 
            />
          </ListItemButton>
        </ListItem>
        
        <Collapse in={calendarOpen} timeout={300} unmountOnExit>
          <ListItem sx={{ display: 'block', pt: 0, px: 0.5 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar 
                value={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                sx={{ 
                  width: '100%',
                  opacity: 1,
                  transition: theme.transitions.create(['opacity'], {
                    duration: '250ms',
                    easing: theme.transitions.easing.easeOut,
                  }),
                  '& .MuiPickersDay-root': {
                    width: '32px',
                    height: '32px',
                    fontSize: '0.8rem',
                    margin: 0,
                  },
                  '& .MuiPickersDay-root.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                  },
                  '& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer': {
                    justifyContent: 'space-around',
                  },
                  '& .MuiPickersCalendarHeader-root': {
                    paddingLeft: '4px',
                    paddingRight: '4px',
                    marginTop: 0,
                  },
                  '& .MuiPickersCalendarHeader-label': {
                    fontSize: '0.9rem',
                  },
                  '& .MuiPickersArrowSwitcher-root': {
                    fontSize: '0.9rem',
                  }
                }}
                views={['day']}
                showDaysOutsideCurrentMonth={false}
              />
            </LocalizationProvider>
          </ListItem>
        </Collapse>
      </List>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <M3Typography variant="subtitle2">Tags</M3Typography>
        <List dense>
          {['Tag Name', 'Add Tag'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton sx={{ px: 2 }}>
                <ListItemIcon>
                  <LabelIcon color={index === 0 ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <M3Typography variant="body2">{text}</M3Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <M3Typography variant="subtitle2">Owners</M3Typography>
        <List dense>
          <ListItem disablePadding>
            <ListItemButton sx={{ px: 2 }}>
              <ListItemIcon>
                <Avatar sx={{ width: 24, height: 24 }}>O</Avatar>
              </ListItemIcon>
              <ListItemText 
                primary={
                  <M3Typography variant="body2">Owner 1</M3Typography>
                } 
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Create Content Modal */}
      <CreateContentModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
      />
    </>
  );
};

export default SidebarContent; 