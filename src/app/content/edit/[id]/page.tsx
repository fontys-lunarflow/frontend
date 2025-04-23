'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Stack,
  AppBar,
  Toolbar
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import M3Typography from '@/components/M3Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkIcon from '@mui/icons-material/Link';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { useTheme } from '@mui/material/styles';
import { contentItems } from '../../utils/dataUtils';
import { colors } from '@/lib/config/colors';

export default function EditContentPage() {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  // State for form fields
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [selectedTab, setSelectedTab] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  
  // Load the content item data
  useEffect(() => {
    if (id) {
      const numericId = parseInt(id, 10);
      const contentItem = contentItems.find(item => item.id === numericId);
      
      if (contentItem) {
        setTitle(contentItem.title);
        setStartDate(contentItem.date);
        setEndDate(contentItem.date);
        setTags(contentItem.tags);
        setBookmarked(contentItem.bookmarked);
      }
    }
  }, [id]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  
  const handleSave = () => {
    // In a real app, this would update the data
    // For now, we'll just navigate back
    router.back();
  };
  
  const handleCancel = () => {
    router.back();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ 
        backgroundColor: colors.uiLightGray,
        color: theme.palette.text.primary,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleCancel} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <M3Typography variant="h6" noWrap>
            Edit Content Item
          </M3Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{ mr: 1 }}
          >
            Save
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        backgroundColor: colors.white,
        p: 3,
      }}>
        <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto' }}>
          <TextField 
            fullWidth 
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ 
              '& .MuiInputBase-input': { 
                fontSize: '1.5rem',
                fontWeight: 500,
              },
            }} 
          />

          <Divider />

          <Box>
            <Tabs value={selectedTab} onChange={handleTabChange} aria-label="content form tabs">
              <Tab label="Information" />
              <Tab label="Additional Fields" />
            </Tabs>
          </Box>

          {selectedTab === 0 && (
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
                defaultValue="Veljko Skrbic"
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
                  {tags.map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      sx={{ 
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.dark
                      }} 
                      onDelete={() => {
                        setTags(tags.filter(t => t !== tag));
                      }} 
                    />
                  ))}
                  <Button 
                    size="small" 
                    startIcon={<Chip 
                      icon={<Chip label="+" />}
                      label="Add Tag" 
                      sx={{ 
                        backgroundColor: 'transparent',
                        border: `1px dashed ${theme.palette.divider}`,
                      }} 
                    />}
                    onClick={() => {
                      setTags([...tags, `Tag ${tags.length + 1}`]);
                    }}
                    sx={{ minWidth: 0, p: 0 }}
                  />
                </Box>
              </Box>
            </Stack>
          )}

          {selectedTab === 1 && (
            <Stack spacing={3}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
              />
              
              <TextField
                label="Location"
                fullWidth
                size="small"
              />
              
              <TextField
                label="Participants"
                fullWidth
                size="small"
              />
            </Stack>
          )}
        </Stack>
      </Box>
    </Box>
  );
} 