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
import CloseIcon from '@mui/icons-material/Close';
import { ContentItem } from '@/lib/config/api';
import { createNewContentItem, fetchProjects } from '../actions';

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
}

// Project interface for the dropdown
interface Project {
  id: number;
  name: string;
  color?: string;
  description?: string;
}

const CreateContentModal: React.FC<CreateContentModalProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [projectId, setProjectId] = useState<number | ''>('');
  
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

      const contentItem: ContentItem = {
        title,
        subject,
        topic,
        projectId: numericProjectId
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
    setError(null);
    onClose();
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
          </Stack>
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