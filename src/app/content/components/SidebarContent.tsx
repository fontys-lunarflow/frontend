import React, { useState, useEffect } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  ListItemIcon,
  Collapse,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Chip,
  Typography,
  IconButton,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { motion } from 'framer-motion';
import M3Typography from '@/components/M3Typography';
import TodayIcon from '@mui/icons-material/Today';
import SearchIcon from '@mui/icons-material/Search';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { ContentFilters, Project, ContentType, getAllProjects, getAllContentTypes } from '@/lib/services/contentApi';

interface SidebarContentProps {
  calendarOpen: boolean;
  selectedDate: Date | null;
  handleCalendarToggle: () => void;
  setSelectedDate: (date: Date | null) => void;
  refreshContentItems?: () => void;
  onFiltersChange?: (filters: ContentFilters) => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ 
  calendarOpen, 
  selectedDate, 
  handleCalendarToggle,
  setSelectedDate,
  onFiltersChange
}) => {
  const theme = useTheme();
  
  // State for filters section
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [selectedContentTypes, setSelectedContentTypes] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [publishDateStart, setPublishDateStart] = useState<Date | null>(null);
  const [publishDateEnd, setPublishDateEnd] = useState<Date | null>(null);
  const [selectedLifecycleStages, setSelectedLifecycleStages] = useState<string[]>([]);
  
  // State for projects and content types from API
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [contentTypesLoading, setContentTypesLoading] = useState(true);

  // Fetch projects and content types on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🚀 SidebarContent: Starting to fetch projects and content types...');
        setProjectsLoading(true);
        setContentTypesLoading(true);
        
        console.log('🔍 SidebarContent: Calling getAllProjects and getAllContentTypes...');
        const [projectList, contentTypeList] = await Promise.all([
          getAllProjects(),
          getAllContentTypes()
        ]);
        
        console.log('✅ SidebarContent: Received projects:', projectList);
        console.log('✅ SidebarContent: Received content types:', contentTypeList);
        
        setProjects(projectList);
        setContentTypes(contentTypeList);
      } catch (error) {
        console.error('❌ SidebarContent: Failed to fetch projects and content types:', error);
        console.error('❌ SidebarContent: Error details:', {
          name: (error as Error)?.name,
          message: (error as Error)?.message,
          stack: (error as Error)?.stack
        });
      } finally {
        setProjectsLoading(false);
        setContentTypesLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to build and send filters
  const buildAndSendFilters = (
    projects = selectedProjects,
    contentTypes = selectedContentTypes,
    statuses = selectedStatuses,
    lifecycleStages = selectedLifecycleStages,
    dateStart = publishDateStart,
    dateEnd = publishDateEnd
  ) => {
    if (onFiltersChange) {
      const filters: ContentFilters = {};
      
      if (projects.length > 0) filters.projectIds = projects;
      if (contentTypes.length > 0) filters.contentTypeIds = contentTypes;
      if (statuses.length > 0) filters.statuses = statuses;
      if (lifecycleStages.length > 0) filters.lifecycleStages = lifecycleStages;
      if (dateStart) filters.publicationDateStart = dateStart.toISOString();
      if (dateEnd) filters.publicationDateEnd = dateEnd.toISOString();
      
      onFiltersChange(filters);
    }
  };

  const handleFiltersToggle = () => {
    setFiltersOpen(!filtersOpen);
  };

  const handleProjectsToggle = () => {
    setProjectsExpanded(!projectsExpanded);
  };

  const handleProjectSelect = (projectId: number) => {
    const newProjects = selectedProjects.includes(projectId) 
      ? selectedProjects.filter(id => id !== projectId) 
      : [...selectedProjects, projectId];
    setSelectedProjects(newProjects);
    buildAndSendFilters(newProjects);
  };

  const handleContentTypeSelect = (typeId: number) => {
    const newContentTypes = selectedContentTypes.includes(typeId) 
      ? selectedContentTypes.filter(id => id !== typeId) 
      : [...selectedContentTypes, typeId];
    setSelectedContentTypes(newContentTypes);
    buildAndSendFilters(undefined, newContentTypes);
  };

  const handleStatusSelect = (status: string) => {
    const newStatuses = selectedStatuses.includes(status) 
      ? selectedStatuses.filter(s => s !== status) 
      : [...selectedStatuses, status];
    setSelectedStatuses(newStatuses);
    buildAndSendFilters(undefined, undefined, newStatuses);
  };

  const handleLifecycleStageSelect = (stage: string) => {
    const newStages = selectedLifecycleStages.includes(stage) 
      ? selectedLifecycleStages.filter(s => s !== stage) 
      : [...selectedLifecycleStages, stage];
    setSelectedLifecycleStages(newStages);
    buildAndSendFilters(undefined, undefined, undefined, newStages);
  };

  const handleDateStartChange = (date: Date | null) => {
    setPublishDateStart(date);
    buildAndSendFilters(undefined, undefined, undefined, undefined, date);
  };

  const handleDateEndChange = (date: Date | null) => {
    setPublishDateEnd(date);
    buildAndSendFilters(undefined, undefined, undefined, undefined, undefined, date);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedProjects([]);
    setSelectedPerson('');
    setSelectedContentTypes([]);
    setSelectedStatuses([]);
    setPublishDateStart(null);
    setPublishDateEnd(null);
    setSelectedLifecycleStages([]);
    // Send empty filters
    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', height: '100%', padding: '16px 8px 16px 16px' }}> {/* 8px right padding, 16px on other sides */}
      {/* Calendar Section - White Card */}
      <Box sx={{ 
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        mb: 2,
        overflow: 'hidden'
      }}>
        <List>
          <ListItem disablePadding>
            <motion.div
              style={{ width: '100%' }}
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
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
            </motion.div>
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
      </Box>
      
      {/* Filters Section - White Card */}
      <Box sx={{ 
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        p: 2,
        overflow: 'hidden'
      }}>
        {/* Filter Header with Save/Clear buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ 
                  borderRadius: '20px', 
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  px: 2,
                  py: 0.5,
                  color: theme.palette.text.secondary,
                }}
              >
                Save Filters
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="contained" 
                size="small" 
                onClick={clearAllFilters}
                sx={{ 
                  borderRadius: '20px', 
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  px: 2,
                  py: 0.5,
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          </Box>
          <IconButton onClick={handleFiltersToggle} size="small">
            {filtersOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
        
        <Collapse in={filtersOpen} timeout={300}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Filter Preset Dropdown */}
            <TextField
              select
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Filter preset..."
              value=""
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0,0,0,0.02)',
                }
              }}
            >
              <MenuItem value="">Filter preset...</MenuItem>
            </TextField>
            
            {/* Search */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={!!searchQuery} 
                    onChange={(e) => e.target.checked ? setSearchQuery('') : null}
                  />
                }
                label={<Typography variant="body2">Searching</Typography>}
              />
              <TextField
                fullWidth
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mt: 0.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </Box>
            
            {/* Projects */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={selectedProjects.length > 0 || projectsExpanded} 
                    onChange={handleProjectsToggle}
                  />
                }
                label={<Typography variant="body2">Projects</Typography>}
              />
              <Collapse in={projectsExpanded}>
                <Box sx={{ ml: 2, mt: 0.5 }}>
                  {projectsLoading ? (
                    <Typography variant="body2" sx={{ ml: 2 }}>Loading projects...</Typography>
                  ) : (
                    projects.map(project => (
                      <FormControlLabel
                        key={project.id}
                        control={
                          <Checkbox 
                            size="small"
                            checked={selectedProjects.includes(project.id)}
                            onChange={() => handleProjectSelect(project.id)}
                          />
                        }
                        label={<Typography variant="body2">{project.name}</Typography>}
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          ml: 0,
                          mr: 0,
                          my: 0.25,
                          '& .MuiFormControlLabel-label': {
                            ml: 0.5
                          }
                        }}
                      />
                    ))
                  )}
                </Box>
              </Collapse>
            </Box>
            
            {/* Person Responsible */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={!!selectedPerson} 
                    onChange={(e) => !e.target.checked ? setSelectedPerson('') : null}
                  />
                }
                label={<Typography variant="body2">Person Responsible</Typography>}
              />
              <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                <Select
                  value={selectedPerson}
                  onChange={(e) => setSelectedPerson(e.target.value)}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) return "Select person...";
                    return selected;
                  }}
                  sx={{ 
                    borderRadius: '8px',
                  }}
                >
                  <MenuItem value="">
                    <em>Select person...</em>
                  </MenuItem>
                  <MenuItem value="Person 1">Person 1</MenuItem>
                  <MenuItem value="Person 2">Person 2</MenuItem>
                  <MenuItem value="Person 3">Person 3</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            {/* Content Type */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={selectedContentTypes.length > 0} 
                    onChange={(e) => !e.target.checked ? setSelectedContentTypes([]) : null}
                  />
                }
                label={<Typography variant="body2">Content Type</Typography>}
              />
              <FormGroup sx={{ ml: 2 }}>
                {contentTypesLoading ? (
                  <Typography variant="body2" sx={{ ml: 2 }}>Loading content types...</Typography>
                ) : (
                  contentTypes.map(type => (
                    <FormControlLabel
                      key={type.id}
                      control={
                        <Checkbox 
                          size="small"
                          checked={selectedContentTypes.includes(type.id)}
                          onChange={() => handleContentTypeSelect(type.id)}
                        />
                      }
                      label={<Typography variant="body2">{type.name}</Typography>}
                    />
                  ))
                )}
              </FormGroup>
            </Box>
            
            {/* Status */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={selectedStatuses.length > 0} 
                    onChange={(e) => !e.target.checked ? setSelectedStatuses([]) : null}
                  />
                }
                label={<Typography variant="body2">Status</Typography>}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small"
                      checked={selectedStatuses.includes('BACKLOG')}
                      onChange={() => handleStatusSelect('BACKLOG')}
                    />
                  }
                  label={<Typography variant="body2">Backlog</Typography>}
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small"
                      checked={selectedStatuses.includes('IN_PROGRESS')}
                      onChange={() => handleStatusSelect('IN_PROGRESS')}
                    />
                  }
                  label={<Typography variant="body2">In Progress</Typography>}
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small"
                      checked={selectedStatuses.includes('IN_REVIEW')}
                      onChange={() => handleStatusSelect('IN_REVIEW')}
                    />
                  }
                  label={<Typography variant="body2">In Review</Typography>}
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small"
                      checked={selectedStatuses.includes('PUBLISHED')}
                      onChange={() => handleStatusSelect('PUBLISHED')}
                    />
                  }
                  label={<Typography variant="body2">Published</Typography>}
                />
              </Box>
            </Box>
            
            {/* Tags */}
            <Box>
              <FormControlLabel
                control={<Checkbox />}
                label={<Typography variant="body2">Tags</Typography>}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, ml: 2 }}>
                <Chip
                  label="Tag Name 1"
                  color="primary"
                  size="small"
                />
                <Chip
                  label="Tag Name 1"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  icon={<AddIcon />}
                  label="Add Tag"
                  variant="outlined"
                  size="small"
                  sx={{ borderStyle: 'dashed' }}
                />
              </Box>
            </Box>
            
            {/* Date-time Of Publishing */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={!!publishDateStart || !!publishDateEnd} 
                    onChange={(e) => !e.target.checked ? (setPublishDateStart(null), setPublishDateEnd(null)) : null}
                  />
                }
                label={<Typography variant="body2">Date-time Of Publishing</Typography>}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={publishDateStart}
                    onChange={handleDateStartChange}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "01/01/2025",
                        fullWidth: true,
                        sx: { 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          }
                        }
                      },
                    }}
                  />
                  <DatePicker
                    value={publishDateEnd}
                    onChange={handleDateEndChange}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "01/01/2025",
                        fullWidth: true,
                        sx: { 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          }
                        }
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>
            
            {/* Life-cycle Stage */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={selectedLifecycleStages.length > 0} 
                    onChange={(e) => !e.target.checked ? setSelectedLifecycleStages([]) : null}
                  />
                }
                label={<Typography variant="body2">Life-cycle Stage</Typography>}
              />
              <FormGroup sx={{ ml: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small"
                      checked={selectedLifecycleStages.includes('AWARENESS')}
                      onChange={() => handleLifecycleStageSelect('AWARENESS')}
                    />
                  }
                  label={<Typography variant="body2">Awareness</Typography>}
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small"
                      checked={selectedLifecycleStages.includes('CONSIDERATION')}
                      onChange={() => handleLifecycleStageSelect('CONSIDERATION')}
                    />
                  }
                  label={<Typography variant="body2">Consideration</Typography>}
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small"
                      checked={selectedLifecycleStages.includes('DECISION')}
                      onChange={() => handleLifecycleStageSelect('DECISION')}
                    />
                  }
                  label={<Typography variant="body2">Decision</Typography>}
                />
              </FormGroup>
            </Box>
            
            {/* Content Types (Social) */}
            <Box>
              <FormControlLabel
                control={<Checkbox />}
                label={<Typography variant="body2">Content Types</Typography>}
              />
              <FormGroup sx={{ ml: 2 }}>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={<Typography variant="body2">LinkedIn</Typography>}
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={<Typography variant="body2">Facebook</Typography>}
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={<Typography variant="body2">Instagram</Typography>}
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={<Typography variant="body2">YouTube</Typography>}
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={<Typography variant="body2">Eclipse Blog</Typography>}
                />
              </FormGroup>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default SidebarContent; 