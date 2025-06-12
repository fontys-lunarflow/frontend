'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Chip,
  IconButton,
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
  Autocomplete,
  Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import M3Typography from '@/components/M3Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import PersonIcon from '@mui/icons-material/Person';
import LabelIcon from '@mui/icons-material/Label';
import { useTheme } from '@mui/material/styles';
import { colors } from '@/lib/config/colors';
import { getContentItem, updateContentItemById, deleteContentItemById, fetchProjects } from '../../actions';
import { fetchLabels, Label } from '@/lib/services/ticketApi';

// Enum options for dropdown fields
const LIFECYCLE_STAGES = ['AWARENESS', 'CONSIDERATION', 'DECISION', 'IMPLEMENTATION', 'LOYALTY'];
const STATUS_OPTIONS = ['BACKLOG', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];

// Interface for the form data - updated to use labels instead of personas/channels
interface ContentItemForm {
  title: string;
  subject: string;
  description: string;
  status: string;
  lifecycleStage: string;
  topicId: number;
  personResponsibleId: string;
  publicationDate: Date | null;
  gitlabId?: number;
  gitlabIssueUrl?: string;
  content?: string;
  labels: Label[];
}

export default function EditContentPage() {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  // State for component
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form state with default values - only essential fields
  const [formData, setFormData] = useState<ContentItemForm>({
    title: '',
    subject: '',
    description: '',
    status: 'BACKLOG',
    lifecycleStage: 'AWARENESS',
    topicId: 1,
    personResponsibleId: '',
    publicationDate: null,
    gitlabId: undefined,
    gitlabIssueUrl: undefined,
    content: '',
    labels: []
  });
  
  // Topics state
  const [topics, setTopics] = useState<{id: number, name: string, color?: string}[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  
  // Labels state
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
  const [labelsLoading, setLabelsLoading] = useState(false);
  const [labelsError, setLabelsError] = useState<string | null>(null);
  
  // Fetch content item data using server action
  useEffect(() => {
    const loadAllData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const numericId = parseInt(id, 10);
        
        // Load all data in parallel for better performance
        const [contentResult, topicsResult, labelsResult] = await Promise.allSettled([
          getContentItem(numericId),
          fetchProjects(),
          fetchLabels()
        ]);
        
        // Handle content item result
        if (contentResult.status === 'fulfilled' && contentResult.value.success && contentResult.value.data) {
          const data = contentResult.value.data;
          console.log('Loaded content item with data:', data);
          
          // Format the data for the form - only essential fields
          setFormData({
            title: data.title || '',
            subject: data.subject || '',
            description: data.description || '',
            status: data.status || 'BACKLOG',
            lifecycleStage: data.lifecycleStage || 'AWARENESS',
            topicId: typeof data.projectId === 'number' ? data.projectId : (data.project?.id || 1),
            personResponsibleId: data.personResponsibleId || '',
            publicationDate: data.publicationDate ? new Date(data.publicationDate) : null,
            gitlabId: data.gitlabId || undefined,
            gitlabIssueUrl: data.gitlabIssueUrl || '',
            content: data.content || '',
            labels: data.labels || []
          });
        } else {
          console.error('Failed to fetch content item:', contentResult.status === 'fulfilled' ? contentResult.value.error : contentResult.reason);
          setError('Failed to load content item');
        }
        
        // Handle topics result
        if (topicsResult.status === 'fulfilled' && topicsResult.value.success && topicsResult.value.data) {
          setTopics(topicsResult.value.data);
          setTopicsError(null);
        } else {
          console.error('Failed to fetch topics:', topicsResult.status === 'fulfilled' ? topicsResult.value.error : topicsResult.reason);
          setTopicsError('Failed to load topics');
        }
        setTopicsLoading(false);
        
        // Handle labels result
        if (labelsResult.status === 'fulfilled') {
          setAvailableLabels(labelsResult.value);
          setLabelsError(null);
        } else {
          console.error('Failed to fetch labels:', labelsResult.reason);
          setLabelsError('Failed to load labels');
        }
        setLabelsLoading(false);
        
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadAllData();
  }, [id]);
  
  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      setError(null);
      
      const numericId = parseInt(id, 10);
      
      // Validate publication date is in the future
      if (formData.publicationDate && formData.publicationDate <= new Date()) {
        setError('Publication date must be in the future. Please select a date and time after now.');
        setSaving(false);
        return;
      }
      
      // Prepare the data for the API - send projectId instead of project object
      const updateData = {
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        status: formData.status,
        lifecycleStage: formData.lifecycleStage,
        topicId: formData.topicId,
        personResponsibleId: formData.personResponsibleId,
        contentTypeIds: [], // Backend expects this field
        personaIds: [], // Backend expects this field
        gitlabIssueUrl: formData.gitlabIssueUrl,
        gitlabId: formData.gitlabId,
        labelIds: formData.labels.map(l => l.id),
        publicationDate: formData.publicationDate ? formData.publicationDate.toISOString() : undefined,
        content: formData.content || ''
      };
      
      console.log('Updating content item with data:', updateData);
      
      // Use server action to update content item
      const result = await updateContentItemById(numericId, updateData);
      
      if (result.success) {
        router.push('/content'); // Navigate back to content list
      } else {
        throw new Error(result.error || 'Failed to update content item');
      }
    } catch (err) {
      console.error('Failed to update content item:', err);
      setError('Failed to save content item. Please try again later.');
      setSaving(false);
    }
  }, [id, formData, router]);
  
  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);
  
  const handleDelete = useCallback(async () => {
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
  }, [id, router]);
  
  // Memoize the topic options to prevent unnecessary re-renders
  const topicOptions = useMemo(() => {
    return topics.map((topic) => (
      <MenuItem key={topic.id} value={topic.id}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {topic.color && (
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: topic.color.startsWith('#') ? topic.color : `#${topic.color}`,
                mr: 1
              }}
            />
          )}
          {topic.name}
        </Box>
      </MenuItem>
    ));
  }, [topics]);
  
  // Handle form field changes
  const handleChange = useCallback((field: keyof ContentItemForm, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

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
          {/* Basic Information */}
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

          <Divider />

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

          {/* Topic Selection */}
          <FormControl fullWidth required error={!!topicsError}>
            <InputLabel id="topic-select-label">Topic</InputLabel>
            <Select
              labelId="topic-select-label"
              id="topic-select"
              value={formData.topicId}
              label="Topic"
              onChange={(e) => handleChange('topicId', e.target.value)}
              disabled={topicsLoading}
            >
              {topicsLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                  <Typography sx={{ ml: 1 }}>Loading...</Typography>
                </MenuItem>
              ) : (
                topicOptions
              )}
              {topics.length === 0 && !topicsLoading && (
                <MenuItem disabled>
                  No topics available
                </MenuItem>
              )}
            </Select>
            {topicsError && <FormHelperText>{topicsError}</FormHelperText>}
          </FormControl>

          <Divider />

          {/* Person Responsible */}
          <TextField
            label="Person Responsible"
            fullWidth
            value={formData.personResponsibleId}
            onChange={(e) => handleChange('personResponsibleId', e.target.value)}
            placeholder="Enter person ID"
            InputProps={{
              startAdornment: <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />

          {/* Publication Date */}
          <Box>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Publication Date & Time"
                value={formData.publicationDate}
                onChange={(date) => handleChange('publicationDate', date)}
                minDateTime={new Date()} // Prevent selecting past dates/times
                slotProps={{
                  textField: { 
                    fullWidth: true,
                    variant: 'outlined',
                    helperText: 'Publication date must be in the future (when this content will be published)',
                    error: formData.publicationDate ? formData.publicationDate <= new Date() : false
                  }
                }}
              />
            </LocalizationProvider>
          </Box>

          <Divider />

          {/* Labels */}
          {labelsError && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              {labelsError}
            </Alert>
          )}
          <Autocomplete
            multiple
            options={availableLabels}
            loading={labelsLoading}
            getOptionLabel={(option) => option.name}
            value={formData.labels}
            onChange={(_, newValue) => handleChange('labels', newValue)}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: option.color,
                  }}
                />
                {option.name}
              </Box>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...chipProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={option.name}
                    icon={<LabelIcon />}
                    sx={{
                      backgroundColor: option.color + '30', // Add transparency
                      borderColor: option.color,
                      '& .MuiChip-icon': { color: option.color }
                    }}
                    {...chipProps}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Labels"
                placeholder="Add labels"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {labelsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <Divider />

              {/* GitLab Information */}
          <M3Typography variant="h6" sx={{ mt: 2 }}>GitLab Information</M3Typography>
          
              <TextField
                label="GitLab Issue URL"
                fullWidth
                value={formData.gitlabIssueUrl || ''}
                onChange={(e) => handleChange('gitlabIssueUrl', e.target.value)}
                InputProps={{
                  startAdornment: <GitHubIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />

              <TextField
                label="GitLab ID"
                fullWidth
                type="number"
                value={formData.gitlabId || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                  handleChange('gitlabId', value);
                }}
              />
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
          <M3Typography>
            Are you sure you want to delete &quot;{formData.title}&quot;? This action cannot be undone.
          </M3Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 