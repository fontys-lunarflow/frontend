import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Divider,
  Stack,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Tabs,
  Tab,
  Autocomplete,
  Chip,
  Grid
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import TagIcon from '@mui/icons-material/Tag';
import { ContentItem } from '@/lib/config/api';
import { createNewContentItem, fetchProjects } from '../actions';

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  defaultPublicationDate?: string;
}

// Project interface for the dropdown
interface Project {
  id: number;
  name: string;
  color?: string;
  description?: string;
}

// Enum options for dropdown fields
const LIFECYCLE_STAGES = ['AWARENESS', 'CONSIDERATION', 'DECISION', 'IMPLEMENTATION', 'LOYALTY'];
const STATUS_OPTIONS = ['BACKLOG', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];

const CreateContentModal: React.FC<CreateContentModalProps> = ({ open, onClose, defaultPublicationDate }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [projectId, setProjectId] = useState<number | ''>('');
  const [selectedTab, setSelectedTab] = useState(0);
  
  // New fields
  const [personResponsibleId, setPersonResponsibleId] = useState('');
  const [lifecycleStage, setLifecycleStage] = useState('AWARENESS');
  const [status, setStatus] = useState('BACKLOG');
  const [personas, setPersonas] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [publicationDate, setPublicationDate] = useState<Date | null>(defaultPublicationDate ? new Date(defaultPublicationDate) : null);
  const [publicationTime, setPublicationTime] = useState<Date | null>(defaultPublicationDate ? new Date(defaultPublicationDate) : null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  // Fetch projects when the modal opens
  useEffect(() => {
    if (open) {
      loadProjects();
    }
  }, [open]);

  const loadProjects = async () => {
    try {
      setProjectsLoading(true);
      setProjectsError(null);
      
      const result = await fetchProjects();
      
      if (result.success) {
        console.log("Projects loaded:", result.data);
        setProjects(result.data || []);
        // Set default project if available
        if (result.data && result.data.length > 0 && !projectId) {
          console.log("Setting default project ID:", result.data[0].id);
          setProjectId(result.data[0].id);
        }
      } else {
        throw new Error(result.error || 'Failed to load projects');
      }
    } catch (err) {
      console.error('Error loading projects:', err);
      setProjectsError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!title || !subject || !topic || !projectId) {
        setError('Please fill all required fields');
        setLoading(false);
        return;
      }

      // Ensure the projectId is a valid number
      const numericProjectId = Number(projectId);
      if (isNaN(numericProjectId)) {
        setError('Invalid project selection');
        setLoading(false);
        return;
      }

      // Combine date and time for publication
      let finalPublicationDate = publicationDate;
      
      if (finalPublicationDate && publicationTime) {
        // Create a new date object with the date from publicationDate and time from publicationTime
        finalPublicationDate = new Date(finalPublicationDate);
        finalPublicationDate.setHours(publicationTime.getHours());
        finalPublicationDate.setMinutes(publicationTime.getMinutes());
      }

      const contentItem: ContentItem = {
        title,
        subject,
        topic,
        projectId: numericProjectId,
        // New fields
        personResponsibleId: personResponsibleId || undefined,
        lifecycleStage,
        status,
        personas,
        channels,
        publicationDate: finalPublicationDate?.toISOString()
      };

      console.log('Submitting content item via server action:', contentItem);
      
      const result = await createNewContentItem(contentItem);
      
      if (result.success) {
        console.log('Successfully created content item:', result.data);
        setSuccess(true);
        
        // Reset form
        setTitle('');
        setSubject('');
        setTopic('');
        setProjectId('');
        setPersonResponsibleId('');
        setLifecycleStage('AWARENESS');
        setStatus('BACKLOG');
        setPersonas([]);
        setChannels([]);
        setPublicationDate(null);
        setPublicationTime(null);
        setSelectedTab(0);
        
        // Close modal after a short delay
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 1000);
      } else {
        throw new Error(result.error || 'Failed to create content item');
      }
    } catch (err) {
      console.error('Error creating content item:', err);
      setError(err instanceof Error ? err.message : 'Failed to create content item');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setSubject('');
    setTopic('');
    setProjectId('');
    setPersonResponsibleId('');
    setLifecycleStage('AWARENESS');
    setStatus('BACKLOG');
    setPersonas([]);
    setChannels([]);
    setPublicationDate(null);
    setPublicationTime(null);
    setSelectedTab(0);
    setError(null);
    onClose();
  };

  // Generate a unique key for each persona/channel
  const getUniqueKey = (prefix: string, item: string, index: number) => {
    return `${prefix}-${item}-${index}`;
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
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
              required
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
          <IconButton onClick={handleClose} sx={{ ml: 1 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Basic Info" />
            <Tab label="Additional Info" />
          </Tabs>
          
          {selectedTab === 0 && (
            <Stack spacing={3}>
              <TextField
                label="Subject"
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
              
              <TextField
                label="Topic"
                fullWidth
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <FormControl fullWidth required error={!!projectsError}>
                  <InputLabel id="project-select-label">Project</InputLabel>
                  <Select
                    labelId="project-select-label"
                    id="project-select"
                    value={projectId}
                    label="Project"
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log("Selected project value:", value);
                      setProjectId(value as number);
                    }}
                    disabled={projectsLoading}
                    startAdornment={
                      projectsLoading ? (
                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      ) : null
                    }
                  >
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {project.color && (
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                bgcolor: project.color,
                                mr: 1
                              }}
                            />
                          )}
                          {project.name}
                        </Box>
                      </MenuItem>
                    ))}
                    {projects.length === 0 && !projectsLoading && (
                      <MenuItem disabled value="">
                        No projects available
                      </MenuItem>
                    )}
                  </Select>
                  {projectsError && <FormHelperText>{projectsError}</FormHelperText>}
                </FormControl>

                <TextField
                  label="Person Responsible"
                  fullWidth
                  value={personResponsibleId}
                  onChange={(e) => setPersonResponsibleId(e.target.value)}
                  InputProps={{
                    startAdornment: <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <FormControl fullWidth>
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    value={status}
                    label="Status"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {STATUS_OPTIONS.map(statusOption => (
                      <MenuItem key={statusOption} value={statusOption}>{statusOption}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel id="lifecycle-select-label">Lifecycle Stage</InputLabel>
                  <Select
                    labelId="lifecycle-select-label"
                    value={lifecycleStage}
                    label="Lifecycle Stage"
                    onChange={(e) => setLifecycleStage(e.target.value)}
                  >
                    {LIFECYCLE_STAGES.map(stage => (
                      <MenuItem key={stage} value={stage}>{stage}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          )}

          {selectedTab === 1 && (
            <Stack spacing={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={7}>
                    <DatePicker
                      label="Publication Date"
                      value={publicationDate}
                      onChange={(date) => setPublicationDate(date)}
                      slotProps={{
                        textField: { 
                          fullWidth: true, 
                          helperText: 'When this content will be published'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TimePicker
                      label="Publication Time"
                      value={publicationTime}
                      onChange={(time) => setPublicationTime(time)}
                      slotProps={{
                        textField: { 
                          fullWidth: true, 
                          helperText: 'Time of publication'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>

              <Autocomplete
                multiple
                options={[]}
                freeSolo
                value={personas}
                onChange={(_, newValue) => setPersonas(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={getUniqueKey('persona', option, index)}
                      label={option}
                      icon={<PersonIcon />}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Personas"
                    placeholder="Add personas"
                    fullWidth
                  />
                )}
              />

              <Autocomplete
                multiple
                options={[]}
                freeSolo
                value={channels}
                onChange={(_, newValue) => setChannels(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={getUniqueKey('channel', option, index)}
                      label={option}
                      icon={<TagIcon />}
                      variant="outlined"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Channels"
                    placeholder="Add channels"
                    fullWidth
                  />
                )}
              />
            </Stack>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || projectsLoading}
            sx={{ 
              borderRadius: '20px',
              px: 3
            }}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        message="Content item created successfully"
      />
    </>
  );
};

export default CreateContentModal; 