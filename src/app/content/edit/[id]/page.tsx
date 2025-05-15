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
  Toolbar,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete
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
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import PersonIcon from '@mui/icons-material/Person';
import TagIcon from '@mui/icons-material/Tag';
import { useTheme } from '@mui/material/styles';
import { ContentItem } from '@/lib/config/api';
import { colors } from '@/lib/config/colors';
import { getContentItem, updateContentItemById, deleteContentItemById, fetchProjects } from '../../actions';

// Enum options for dropdown fields
const LIFECYCLE_STAGES = ['AWARENESS', 'CONSIDERATION', 'DECISION', 'IMPLEMENTATION', 'LOYALTY'];
const STATUS_OPTIONS = ['BACKLOG', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];

// Interface for the form data
interface ContentItemForm {
  title: string;
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  bookmarked: boolean;
  tags: string[];
  owners: string;
  topics: string;
  department: string;
  project: string;
  gitlabLink: string;
  description: string;
  location: string;
  participants: string;
  // Required fields for API
  subject: string;
  topic: string;
  projectId: number;
  // New fields
  personResponsibleId: string;
  gitlabIssueUrl: string | null;
  gitlabId: number | null;
  lifecycleStage: string;
  status: string;
  personas: string[];
  channels: string[];
  publicationDate: Date | null;
}

export default function EditContentPage() {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  // State for component
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form state with default values
  const [formData, setFormData] = useState<ContentItemForm>({
    title: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    bookmarked: false,
    tags: [],
    owners: '',
    topics: '',
    department: '',
    project: '',
    gitlabLink: '',
    description: '',
    location: '',
    participants: '',
    // Default values for required fields
    subject: '',
    topic: '',
    projectId: 1,
    // New fields with default values
    personResponsibleId: '',
    gitlabIssueUrl: null,
    gitlabId: null,
    lifecycleStage: 'AWARENESS',
    status: 'BACKLOG',
    personas: [],
    channels: [],
    publicationDate: null
  });
  
  // Projects state
  const [projects, setProjects] = useState<{id: number, name: string, color?: string}[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  
  // Fetch content item data using server action
  useEffect(() => {
    const fetchContentItem = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const numericId = parseInt(id, 10);
        
        // Use server action to get content item
        const result = await getContentItem(numericId);
        
        if (result.success && result.data) {
          const data = result.data;
          console.log('Loaded content item with data:', data);
          
          // Format the data for the form
          setFormData({
            title: data.title || '',
            date: data.date ? new Date(data.date) : null,
            startTime: data.startTime ? new Date(data.startTime) : new Date(),
            endTime: data.endTime ? new Date(data.endTime) : new Date(),
            bookmarked: data.bookmarked || false,
            tags: data.tags || [],
            owners: data.owners?.join(', ') || '',
            topics: data.topics?.join(', ') || '',
            department: data.department || '',
            project: typeof data.project === 'string' ? data.project : (data.project?.name || ''),
            gitlabLink: data.gitlabLink || '',
            description: data.description || '',
            location: data.location || '',
            participants: data.participants?.join(', ') || '',
            // Required fields
            subject: data.subject || '',
            topic: data.topic || '',
            projectId: typeof data.projectId === 'number' ? data.projectId : 1,
            // New fields
            personResponsibleId: data.personResponsibleId || '',
            gitlabIssueUrl: data.gitlabIssueUrl || null,
            gitlabId: data.gitlabId || null,
            lifecycleStage: data.lifecycleStage || 'AWARENESS',
            status: data.status || 'BACKLOG',
            personas: data.personas || [],
            channels: data.channels || [],
            publicationDate: data.publicationDate ? new Date(data.publicationDate) : null
          });
          
          setError(null);
        } else {
          throw new Error(result.error || 'Failed to fetch content item');
        }
      } catch (err) {
        console.error('Failed to fetch content item:', err);
        setError('Failed to load content item. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContentItem();
  }, [id]);
  
  // Fetch projects when component mounts
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setProjectsLoading(true);
        setProjectsError(null);
        
        const result = await fetchProjects();
        
        if (result.success) {
          setProjects(result.data || []);
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
    
    loadProjects();
  }, []);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  
  const handleSave = async () => {
    if (!id) return;
    
    try {
      setSaving(true);
      const numericId = parseInt(id, 10);
      
      // Ensure projectId is a number
      const projectIdValue = typeof formData.projectId === 'number' ? formData.projectId : 
                         parseInt(formData.projectId as unknown as string, 10);

      if (isNaN(projectIdValue)) {
        throw new Error('Invalid project ID');
      }
      
      // Format the data for the API
      const apiData: ContentItem = {
        title: formData.title,
        date: formData.date?.toISOString() || new Date().toISOString(),
        bookmarked: formData.bookmarked,
        tags: formData.tags,
        startTime: formData.startTime?.toISOString(),
        endTime: formData.endTime?.toISOString(),
        owners: formData.owners ? formData.owners.split(',').map(o => o.trim()) : [],
        topics: formData.topics ? formData.topics.split(',').map(t => t.trim()) : [],
        department: formData.department,
        gitlabLink: formData.gitlabLink,
        description: formData.description,
        location: formData.location,
        participants: formData.participants ? formData.participants.split(',').map(p => p.trim()) : [],
        subject: formData.subject,
        topic: formData.topic,
        projectId: projectIdValue,
        // New fields
        personResponsibleId: formData.personResponsibleId || undefined,
        gitlabIssueUrl: formData.gitlabIssueUrl,
        gitlabId: formData.gitlabId,
        lifecycleStage: formData.lifecycleStage,
        status: formData.status,
        personas: formData.personas,
        channels: formData.channels,
        publicationDate: formData.publicationDate?.toISOString()
      };
      
      console.log('Saving content item with data:', {
        id: numericId,
        projectId: projectIdValue,
        formData
      });
      
      // Use server action to update content item
      const result = await updateContentItemById(numericId, apiData);
      
      if (result.success) {
        router.back();
      } else {
        throw new Error(result.error || 'Failed to save content item');
      }
    } catch (err) {
      console.error('Failed to save content item:', err);
      setError('Failed to save content item. Please try again later.');
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      const numericId = parseInt(id, 10);
      
      // Use server action to delete content item
      const result = await deleteContentItemById(numericId);
      
      if (result.success) {
        setDeleteDialogOpen(false);
        router.push('/content'); // Navigate back to content list
      } else {
        throw new Error(result.error || 'Failed to delete content item');
      }
    } catch (err) {
      console.error('Failed to delete content item:', err);
      setError('Failed to delete content item. Please try again later.');
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };
  
  // Handle form field changes
  const handleChange = (field: keyof ContentItemForm, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
          <IconButton 
            color="error" 
            onClick={() => setDeleteDialogOpen(true)}
            disabled={saving || isDeleting}
            sx={{ mr: 1 }}
          >
            <DeleteIcon />
          </IconButton>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={saving || isDeleting}
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : undefined}
            sx={{ mr: 1 }}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleCancel}
            disabled={saving || isDeleting}
          >
            Cancel
          </Button>
        </Toolbar>
      </AppBar>
      
      {/* Error alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2, mx: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
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
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            sx={{ 
              '& .MuiInputBase-input': { 
                fontSize: '1.5rem',
                fontWeight: 500,
              },
            }} 
          />

          <TextField 
            fullWidth 
            label="Subject (Required)"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            required
          />

          <TextField 
            fullWidth 
            label="Topic (Required)"
            value={formData.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
            required
          />

          {/* Status and Lifecycle Stage */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                value={formData.status}
                label="Status"
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {STATUS_OPTIONS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="lifecycle-select-label">Lifecycle Stage</InputLabel>
              <Select
                labelId="lifecycle-select-label"
                value={formData.lifecycleStage}
                label="Lifecycle Stage"
                onChange={(e) => handleChange('lifecycleStage', e.target.value)}
              >
                {LIFECYCLE_STAGES.map(stage => (
                  <MenuItem key={stage} value={stage}>{stage}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider />

          <Box>
            <Tabs value={selectedTab} onChange={handleTabChange} aria-label="content form tabs">
              <Tab label="Information" />
              <Tab label="Additional Fields" />
              <Tab label="Advanced" />
            </Tabs>
          </Box>

          {selectedTab === 0 && (
            <Stack spacing={3}>
              {/* Publication Date */}
              <Box>
                <M3Typography variant="body2" sx={{ mb: 1 }}>Publication Date</M3Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={formData.publicationDate}
                    onChange={(date) => handleChange('publicationDate', date)}
                    slotProps={{
                      textField: { 
                        fullWidth: true,
                        variant: 'outlined',
                        helperText: 'When this content will be published'
                      }
                    }}
                  />
                </LocalizationProvider>
              </Box>

              {/* Date and Time section */}
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
                          value={formData.date}
                          onChange={(date) => handleChange('date', date)}
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
                          value={formData.startTime}
                          onChange={(time) => handleChange('startTime', time)}
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
                          value={formData.date}
                          onChange={(date) => handleChange('date', date)}
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
                          value={formData.endTime}
                          onChange={(time) => handleChange('endTime', time)}
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

              {/* Person Responsible */}
              <TextField
                label="Person Responsible"
                fullWidth
                size="small"
                value={formData.personResponsibleId}
                onChange={(e) => handleChange('personResponsibleId', e.target.value)}
                placeholder="Enter person ID"
                InputProps={{
                  startAdornment: <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />

              <TextField
                label="Owner 1, Owner 2"
                fullWidth
                size="small"
                value={formData.owners}
                onChange={(e) => handleChange('owners', e.target.value)}
              />

              <TextField
                label="Topic 1, Topic 2, Topic 3"
                fullWidth
                size="small"
                value={formData.topics}
                onChange={(e) => handleChange('topics', e.target.value)}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Department Name"
                  fullWidth
                  size="small"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                />
                <FormControl fullWidth required error={!!projectsError}>
                  <InputLabel id="project-select-label">Project (Required)</InputLabel>
                  <Select
                    labelId="project-select-label"
                    id="project-select"
                    value={formData.projectId}
                    label="Project (Required)"
                    onChange={(e) => handleChange('projectId', e.target.value)}
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
              </Box>

              {/* Personas */}
              <Autocomplete
                multiple
                options={[]}
                freeSolo
                value={formData.personas}
                onChange={(_, newValue) => handleChange('personas', newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      icon={<PersonIcon />}
                      {...getTagProps({ index })}
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

              {/* Channels */}
              <Autocomplete
                multiple
                options={[]}
                freeSolo
                value={formData.channels}
                onChange={(_, newValue) => handleChange('channels', newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      icon={<TagIcon />}
                      variant="outlined"
                      {...getTagProps({ index })}
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

          {selectedTab === 1 && (
            <Stack spacing={3}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
              
              <TextField
                label="Location"
                fullWidth
                size="small"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
              
              <TextField
                label="Participants"
                fullWidth
                size="small"
                value={formData.participants}
                onChange={(e) => handleChange('participants', e.target.value)}
              />
            </Stack>
          )}

          {selectedTab === 2 && (
            <Stack spacing={3}>
              {/* GitLab Information */}
              <TextField
                label="GitLab Issue URL"
                fullWidth
                size="small"
                value={formData.gitlabIssueUrl || ''}
                onChange={(e) => handleChange('gitlabIssueUrl', e.target.value)}
                InputProps={{
                  startAdornment: <GitHubIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />

              <TextField
                label="GitLab ID"
                fullWidth
                size="small"
                type="number"
                value={formData.gitlabId || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value, 10) : null;
                  handleChange('gitlabId', value);
                }}
              />
              
              <TextField
                label="Gitlab Link (Legacy)"
                fullWidth
                size="small"
                value={formData.gitlabLink}
                onChange={(e) => handleChange('gitlabLink', e.target.value)}
                InputProps={{
                  startAdornment: <LinkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />

              <Box>
                <M3Typography variant="body2" sx={{ mb: 1 }}>Tags</M3Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags.map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      sx={{ 
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.dark
                      }} 
                      onDelete={() => {
                        handleChange('tags', formData.tags.filter(t => t !== tag));
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
                      handleChange('tags', [...formData.tags, `Tag ${formData.tags.length + 1}`]);
                    }}
                    sx={{ minWidth: 0, p: 0 }}
                  />
                </Box>
              </Box>
            </Stack>
          )}
        </Stack>
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Content Item
        </DialogTitle>
        <DialogContent>
          <M3Typography variant="body1">
            Are you sure you want to delete this content item? This action cannot be undone.
          </M3Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : null}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 