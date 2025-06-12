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
  CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { ContentItem } from '@/lib/config/api';
import { createNewContentItem, fetchProjects } from '@/app/content/actions';

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  defaultPublicationDate?: string;
}

// Topic interface for the dropdown (maps to Project API)
interface Topic {
  id: number;
  name: string;
  color?: string;
  description?: string;
}

// Enum options for dropdown fields
const LIFECYCLE_STAGES = ['AWARENESS', 'CONSIDERATION', 'DECISION', 'RETENTION', 'ADVOCACY'];
const STATUS_OPTIONS = ['BACKLOG', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'];

// Define validation errors interface
interface ValidationErrors {
  title?: string;
  topicId?: string;
  personResponsibleId?: string;
  publicationDate?: string;
}

const CreateContentModal: React.FC<CreateContentModalProps> = ({ open, onClose, defaultPublicationDate }) => {
  // Form fields - only the essential ones
  const [title, setTitle] = useState('');
  const [topicId, setTopicId] = useState<number | ''>('');
  const [personResponsibleId, setPersonResponsibleId] = useState('');
  const [lifecycleStage, setLifecycleStage] = useState('AWARENESS');
  const [status, setStatus] = useState('BACKLOG');
  const [publicationDate, setPublicationDate] = useState<Date | null>(defaultPublicationDate ? new Date(defaultPublicationDate) : null);
  
  // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Topics state
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);

  // Fetch topics when the modal opens
  useEffect(() => {
    if (open) {
      loadTopics();
    }
  }, [open]);

  // Mark field as touched when it's interacted with
  const handleFieldTouch = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Validate a single field
  const validateField = (field: string, value: string | number | Date | null): string | undefined => {
    switch (field) {
      case 'title':
        return !value ? 'Title is required' : undefined;
      case 'topicId':
        return value === '' ? 'Topic is required' : undefined;
      case 'personResponsibleId':
        return !value ? 'Person responsible is required' : undefined;
      case 'publicationDate':
        if (value) {
          const dateValue = new Date(value);
          const now = new Date();
          return dateValue <= now ? 'Publication date must be in the future' : undefined;
        }
        return undefined;
      default:
        return undefined;
    }
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    errors.title = validateField('title', title);
    errors.topicId = validateField('topicId', topicId);
    errors.personResponsibleId = validateField('personResponsibleId', personResponsibleId);
    
    if (publicationDate) {
      errors.publicationDate = validateField('publicationDate', publicationDate);
    }
    
    setValidationErrors(errors);
    
    // Form is valid if there are no errors
    return !Object.values(errors).some(error => error !== undefined);
  };

  const loadTopics = async () => {
    try {
      setTopicsLoading(true);
      setTopicsError(null);
      
      const result = await fetchProjects();
      
      if (result.success) {
        console.log("Topics loaded:", result.data);
        setTopics(result.data || []);
        // Set default topic if available
        if (result.data && result.data.length > 0 && !topicId) {
          console.log("Setting default topic ID:", result.data[0].id);
          setTopicId(result.data[0].id);
        }
      } else {
        throw new Error(result.error || 'Failed to load topics');
      }
    } catch (err) {
      console.error('Error loading topics:', err);
      setTopicsError(err instanceof Error ? err.message : 'Failed to load topics');
    } finally {
      setTopicsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Additional frontend validation for publication date
      if (publicationDate && publicationDate <= new Date()) {
        setValidationErrors(prev => ({ ...prev, publicationDate: 'Publication date must be in the future' }));
        setError('Publication date must be in the future. Please select a date and time after now.');
        setLoading(false);
        return;
      }
      
      // Ensure the topicId is a valid number
      const numericTopicId = Number(topicId);
      if (isNaN(numericTopicId)) {
        setError('Invalid topic selection');
        setLoading(false);
        return;
      }

      // Find the selected topic to include topic details
      const selectedTopic = topics.find(t => t.id === numericTopicId);
      if (!selectedTopic) {
        setError('Selected topic not found');
        setLoading(false);
        return;
      }

      // Format the content item to match the simple structure you specified
      const contentItem: ContentItem = {
        title,
        project: {
          id: selectedTopic.id,
          name: selectedTopic.name,
          color: selectedTopic.color
        },
        personResponsibleId,
        contentTypeIds: [], // Empty for now, can be added later if needed
        personaIds: [], // Empty for now, can be added later if needed  
        labelIds: [], // Empty for now, can be added later if needed
        status,
        lifecycleStage,
        publicationDate: publicationDate?.toISOString()
      };

      console.log('Submitting content item via server action:', contentItem);
      
      const result = await createNewContentItem(contentItem);
      
      if (result.success) {
        console.log('Successfully created content item:', result.data);
        setSuccess(true);
        
        // Reset form
        setTitle('');
        setTopicId('');
        setPersonResponsibleId('');
        setLifecycleStage('AWARENESS');
        setStatus('BACKLOG');
        setPublicationDate(null);
        setValidationErrors({});
        setTouched({});
        
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to create content item';
      
      // Check for specific error messages
      if (errorMessage.toLowerCase().includes('past')) {
        setValidationErrors(prev => ({ ...prev, publicationDate: 'Publication date cannot be in the past' }));
        setError('Publication date cannot be in the past');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setTopicId('');
    setPersonResponsibleId('');
    setLifecycleStage('AWARENESS');
    setStatus('BACKLOG');
    setPublicationDate(null);
    setError(null);
    setValidationErrors({});
    setTouched({});
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
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
          pb: 2
        }}>
          <Box sx={{ width: '100%' }}>
            <TextField 
              fullWidth 
              placeholder="Enter content item title..."
              variant="outlined"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                handleFieldTouch('title');
              }}
              onBlur={() => handleFieldTouch('title')}
              required
              error={touched.title && !!validationErrors.title}
              helperText={touched.title && validationErrors.title}
              sx={{ 
                '& .MuiInputBase-input': { 
                  fontSize: '1.3rem',
                  fontWeight: 500,
                  '&::placeholder': {
                    opacity: 0.7,
                    color: 'text.secondary',
                    fontWeight: 400,
                  }
                }
              }} 
            />
          </Box>
          <IconButton onClick={handleClose} sx={{ ml: 2 }}>
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
          
          <Stack spacing={3}>
            <FormControl 
              fullWidth 
              required 
              error={!!topicsError || (touched.topicId && !!validationErrors.topicId)}
            >
              <InputLabel id="topic-select-label">Topic</InputLabel>
              <Select
                labelId="topic-select-label"
                id="topic-select"
                value={topicId}
                label="Topic"
                onChange={(e) => {
                  const value = e.target.value;
                  console.log("Selected topic value:", value);
                  setTopicId(value as number);
                  handleFieldTouch('topicId');
                }}
                onBlur={() => handleFieldTouch('topicId')}
                disabled={topicsLoading}
                startAdornment={
                  topicsLoading ? (
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  ) : null
                }
              >
                {topics.map((topic) => (
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
                ))}
                {topics.length === 0 && !topicsLoading && (
                  <MenuItem disabled value="">
                    No topics available
                  </MenuItem>
                )}
              </Select>
              {topicsError && <FormHelperText>{topicsError}</FormHelperText>}
              {touched.topicId && validationErrors.topicId && <FormHelperText>{validationErrors.topicId}</FormHelperText>}
            </FormControl>

            <TextField
              label="Person Responsible"
              fullWidth
              value={personResponsibleId}
              onChange={(e) => {
                setPersonResponsibleId(e.target.value);
                handleFieldTouch('personResponsibleId');
              }}
              onBlur={() => handleFieldTouch('personResponsibleId')}
              required
              error={touched.personResponsibleId && !!validationErrors.personResponsibleId}
              helperText={touched.personResponsibleId && validationErrors.personResponsibleId}
              InputProps={{
                startAdornment: <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />

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

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Publication Date & Time"
                value={publicationDate}
                onChange={(date) => {
                  setPublicationDate(date);
                  handleFieldTouch('publicationDate');
                  // Clear the error when a new date is selected
                  if (validationErrors.publicationDate && date) {
                    const now = new Date();
                    if (date > now) {
                      setValidationErrors(prev => ({ ...prev, publicationDate: undefined }));
                    }
                  }
                }}
                minDateTime={new Date()} // Prevent selecting past dates/times
                slotProps={{
                  textField: { 
                    fullWidth: true, 
                    helperText: validationErrors.publicationDate || 'Publication date must be in the future (when this content will be published)',
                    error: touched.publicationDate && !!validationErrors.publicationDate
                  }
                }}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Content item created successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateContentModal; 