import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Stack,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import M3Typography from '@/components/M3Typography';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { useTheme } from '@mui/material/styles';

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateContentModal: React.FC<CreateContentModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const [title, setTitle] = React.useState('');
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [startTime, setStartTime] = React.useState<Date | null>(new Date());
  const [endTime, setEndTime] = React.useState<Date | null>(new Date());
  const [selectedTab, setSelectedTab] = React.useState(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px',
          overflow: 'visible',
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 3,
        pb: 1
      }}>
        <Box sx={{ width: '100%' }}>
          <TextField 
            fullWidth 
            placeholder="Content Item Title"
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ 
              '& .MuiInputBase-input': { 
                fontSize: '1.5rem',
                fontWeight: 500,
                '&::placeholder': {
                  opacity: 0.5,
                }
              },
              '& .MuiInput-underline:before': { 
                borderBottomColor: 'transparent' 
              },
            }} 
          />
        </Box>
        <IconButton onClick={onClose} sx={{ ml: 1 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <Box sx={{ px: 3, pt: 1 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="content form tabs">
          <Tab label="Information" />
          <Tab label="Additional Fields" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {selectedTab === 0 ? (
          <Stack spacing={3}>
            <Box>
              <M3Typography variant="body2" sx={{ mb: 1 }}>Date & Time</M3Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 2,
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
              }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box sx={{ 
                    flex: 1, 
                    minWidth: '200px',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px',
                    p: 1
                  }}>
                    <M3Typography variant="caption" color="text.secondary">START</M3Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                      <EventIcon fontSize="small" color="action" />
                      <DatePicker
                        value={startDate}
                        onChange={setStartDate}
                        slotProps={{
                          textField: { 
                            variant: 'standard',
                            fullWidth: true,
                            InputProps: { disableUnderline: true }
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <TimePicker
                        value={startTime}
                        onChange={setStartTime}
                        slotProps={{
                          textField: { 
                            variant: 'standard',
                            fullWidth: true,
                            InputProps: { disableUnderline: true }
                          }
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ 
                    flex: 1, 
                    minWidth: '200px',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px',
                    p: 1
                  }}>
                    <M3Typography variant="caption" color="text.secondary">END</M3Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                      <EventIcon fontSize="small" color="action" />
                      <DatePicker
                        value={endDate}
                        onChange={setEndDate}
                        slotProps={{
                          textField: { 
                            variant: 'standard',
                            fullWidth: true,
                            InputProps: { disableUnderline: true }
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <TimePicker
                        value={endTime}
                        onChange={setEndTime}
                        slotProps={{
                          textField: { 
                            variant: 'standard',
                            fullWidth: true,
                            InputProps: { disableUnderline: true }
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </LocalizationProvider>

                <TextField
                  label="Time Zone"
                  defaultValue="UTC +1:00"
                  disabled
                  size="small"
                  sx={{ 
                    width: { xs: '100%', sm: '160px' },
                    alignSelf: 'center'
                  }}
                />
              </Box>
            </Box>

            <TextField
              label="Owner 1, Owner 2"
              fullWidth
              size="small"
            />

            <TextField
              label="Topic 1, Topic 2, Topic 3"
              fullWidth
              size="small"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Department Name"
                fullWidth
                size="small"
              />
              <TextField
                label="Project Name"
                fullWidth
                size="small"
              />
            </Box>

            <TextField
              label="Gitlab Link"
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <LinkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />

            <Box>
              <M3Typography variant="body2" sx={{ mb: 1 }}>Tags</M3Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['Tag Name 1', 'Tag Name 2', 'Tag Name 3'].map((tag) => (
                  <Chip 
                    key={tag} 
                    label={tag} 
                    sx={{ 
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.dark
                    }} 
                    onDelete={() => {}} 
                  />
                ))}
                <Chip 
                  icon={<AddIcon />} 
                  label="Add Tag" 
                  variant="outlined"
                  sx={{ borderStyle: 'dashed' }}
                  onClick={() => {}}
                />
              </Box>
            </Box>
          </Stack>
        ) : (
          <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <M3Typography variant="body1" color="text.secondary">Additional fields can be configured here</M3Typography>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ 
            borderRadius: '20px',
            px: 3
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateContentModal; 