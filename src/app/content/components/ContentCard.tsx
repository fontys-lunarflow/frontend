import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Card, 
  IconButton, 
  Popover, 
  Divider, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import M3Typography from '@/components/M3Typography';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useRouter } from 'next/navigation';
import { deleteContentItemById, fetchProjects } from '../actions';
import moment from 'moment';

interface ContentCardProps {
  id: number;
  title: string;
  bookmarked: boolean;
  subject?: string;
  topic?: string;
  project?: {
    id: number;
    name: string;
    color?: string;
  };
  projectId?: number; // Keep for backward compatibility
  status?: string;
  lifecycleStage?: string;
  publicationDate?: string;
  onDelete?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  id, 
  title, 
  bookmarked, 
  subject, 
  topic, 
  project,
  projectId,
  status,
  lifecycleStage,
  publicationDate,
  onDelete 
}) => {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const theme = useTheme();
  
  // Project data state
  const [projectName, setProjectName] = useState<string>('');
  const [projectColor, setProjectColor] = useState<string | undefined>(undefined);
  const [projectLoading, setProjectLoading] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Set project data from props if available
  useEffect(() => {
    if (project) {
      setProjectName(project.name || '');
      setProjectColor(project.color || undefined);
    } else if (projectId) {
      // If only projectId is provided, fetch project details
      fetchProjectDetails();
    }
  }, [project, projectId]);

  const fetchProjectDetails = async () => {
    if (!projectId) return;
    
    try {
      setProjectLoading(true);
      
      const result = await fetchProjects();
      
      if (result.success && result.data) {
        const foundProject = result.data.find(p => p.id === projectId);
        if (foundProject) {
          setProjectName(foundProject.name);
          setProjectColor(foundProject.color);
        } else {
          // If project not found in the list, show a more meaningful message
          console.warn(`Project with ID ${projectId} not found in projects list`);
          setProjectName(`Project #${projectId}`);
          // Don't set a default color as it might interfere with the API
        }
      } else {
        throw new Error(result.error || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      setProjectName(`Project #${projectId}`);
      // Don't set a default color as it might interfere with the API
    } finally {
      setProjectLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent popover from closing
    router.push(`/content/edit/${id}`);
    handleClose();
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent popover from closing
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError(null);
      
      console.log('Deleting content item with ID:', id);
      const result = await deleteContentItemById(id);
      
      if (result.success) {
        setDeleteSuccess(true);
        setDeleteDialogOpen(false);
        handleClose(); // Close the popover
        
        // Call parent's onDelete callback if provided
        if (onDelete) {
          setTimeout(() => {
            onDelete();
          }, 500);
        }
      } else {
        throw new Error(result.error || 'Failed to delete content item');
      }
    } catch (error) {
      console.error('Error deleting content item:', error);
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete content item');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click or popover from closing
    router.push(`/content/${id}`);
    handleClose();
  };

  // Get card background color based on status (no longer used for primary color approach)
  const getCardColor = () => {
    // Use primary color from theme
    return theme.palette.primary.main;
  };

  // Get formatted publication date
  const getFormattedDate = () => {
    if (publicationDate) {
      return moment(publicationDate).format('MMM DD, YYYY');
    }
    return 'Not scheduled';
  };

  return (
    <>
      <Card 
        ref={cardRef}
        key={id}
        onClick={handleOpen}
        sx={{ 
          width: '100%',
          p: 2.5,
          borderRadius: '8px',
          backgroundColor: getCardColor(),
          color: theme.palette.primary.contrastText,
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.07)',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-1px)',
            transition: 'all 0.15s ease-in-out'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <M3Typography variant="subtitle1" color="inherit" sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
              {title}
            </M3Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                size="small" 
                sx={{ color: 'white', padding: '4px' }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                }}
              >
                <LinkIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ color: 'white', padding: '4px' }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                }}
              >
                {bookmarked ? 
                  <BookmarkIcon fontSize="small" /> : 
                  <BookmarkBorderIcon fontSize="small" />
                }
              </IconButton>
            </Box>
          </Box>
          
          {/* Project and Status row */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: projectColor || 'white',
                  mr: 1,
                  opacity: 0.9
                }}
              />
              <M3Typography variant="caption" color="inherit" sx={{ opacity: 0.9 }}>
                {projectName || (project ? project.name : `Project #${projectId || '?'}`)}
              </M3Typography>
            </Box>
            
            {status && (
              <Chip 
                label={status} 
                size="small"
                sx={{ 
                  height: 20, 
                  fontSize: '0.6rem',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  color: theme.palette.primary.contrastText,
                  ml: 1
                }}
              />
            )}
          </Box>
          
          {/* Publication Date and Lifecycle Stage */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon sx={{ fontSize: 12, mr: 0.5, opacity: 0.9 }} />
              <M3Typography variant="caption" color="inherit" sx={{ opacity: 0.9 }}>
                {getFormattedDate()}
              </M3Typography>
            </Box>
            
            {lifecycleStage && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ fontSize: 12, mr: 0.5, opacity: 0.9 }} />
                <M3Typography variant="caption" color="inherit" sx={{ opacity: 0.9 }}>
                  {lifecycleStage}
                </M3Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Card>

      {/* Content Popover */}
      <Popover
        open={open}
        anchorEl={cardRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '.MuiPopover-paper': {
            borderRadius: '16px',
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
            width: '350px',
            overflow: 'visible',
          }
        }}
        disableRestoreFocus
        disableScrollLock
      >
        <Box sx={{ p: 0 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            p: 2.5,
            pb: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  borderRadius: '4px', 
                  backgroundColor: theme.palette.primary.main,
                  mr: 2
                }} 
              />
              <M3Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {title}
              </M3Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton 
                size="small" 
                sx={{ color: 'text.secondary' }}
                onClick={handleEdit}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ color: 'text.secondary' }}
                onClick={handleDeleteClick}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ color: 'text.secondary' }}
                onClick={handleExpand}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleClose} sx={{ color: 'text.secondary' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ p: 2.5, pt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <M3Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Subject: {subject}
              </M3Typography>
              <M3Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Topic: {topic}
              </M3Typography>
              <M3Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                Project: {projectLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                    {projectColor && (
                      <Box
                        component="span"
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: projectColor,
                          mr: 1,
                          display: 'inline-block'
                        }}
                      />
                    )}
                    {projectName || (project ? project.name : `ID: ${projectId || 'Unknown'}`)}
                  </Box>
                )}
              </M3Typography>
            </Box>
          </Box>
        </Box>
      </Popover>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Content Item
        </DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete &quot;{title}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Notification */}
      <Snackbar
        open={deleteSuccess}
        autoHideDuration={3000}
        onClose={() => setDeleteSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Content item deleted successfully
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContentCard; 