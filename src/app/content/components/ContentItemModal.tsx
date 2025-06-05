import React, { useState } from 'react';
import { 
  Popover, 
  Box,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import M3Typography from '@/components/M3Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRouter } from 'next/navigation';
import { ContentItem } from '@/lib/config/api';
import { deleteContentItemById } from '@/app/content/actions';

interface ContentItemModalProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  contentItem: ContentItem;
  onDelete?: () => void;
}

const ContentItemModal: React.FC<ContentItemModalProps> = ({
  open,
  onClose,
  anchorEl,
  contentItem,
  onDelete
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  // Get card color based on project color
  const getCardColor = () => {
    if (contentItem.project?.color) {
      const color = contentItem.project.color.startsWith('#') ? 
        contentItem.project.color : 
        `#${contentItem.project.color}`;
      
      if (color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#fff' || 
          color.toLowerCase() === 'white' || color.toLowerCase() === 'transparent') {
        return '#1976d2'; // Default blue fallback
      }
      
      return color;
    }
    return '#1976d2';
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/content/edit/${contentItem.id}`);
    onClose();
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError(null);
      
      const result = await deleteContentItemById(contentItem.id!);
      
      if (result.success) {
        setDeleteDialogOpen(false);
        onClose();
        
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
    e.stopPropagation();
    router.push(`/${contentItem.id}`);
    onClose();
  };

  return (
    <>
      {/* Content Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
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
            width: '280px',
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
            p: 2,
            pb: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  borderRadius: '4px', 
                  backgroundColor: getCardColor(),
                  mr: 2
                }} 
              />
              <M3Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {contentItem.title}
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
              <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ p: 2, pt: 1.5 }}>
            <Box sx={{ mb: 2 }}>
              {/* Status and Lifecycle */}
              {(contentItem.status || contentItem.lifecycleStage) && (
                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {contentItem.status && (
                    <M3Typography variant="body2" sx={{ 
                      color: 'text.secondary',
                      backgroundColor: 'rgba(0,0,0,0.06)',
                      px: 1,
                      py: 0.5,
                      borderRadius: '4px',
                      fontSize: '0.75rem'
                    }}>
                      {contentItem.status}
                    </M3Typography>
                  )}
                  {contentItem.lifecycleStage && (
                    <M3Typography variant="body2" sx={{ 
                      color: 'text.secondary',
                      backgroundColor: 'rgba(0,0,0,0.06)',
                      px: 1,
                      py: 0.5,
                      borderRadius: '4px',
                      fontSize: '0.75rem'
                    }}>
                      {contentItem.lifecycleStage}
                    </M3Typography>
                  )}
                </Box>
              )}
              
              {/* Subject */}
              {contentItem.subject && (
                <M3Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Subject: {contentItem.subject}
                </M3Typography>
              )}
              
              {/* Topic */}
              {contentItem.topic && (
                <M3Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Topic: {contentItem.topic}
                </M3Typography>
              )}
              
              {/* Project */}
              {contentItem.project && (
                <M3Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  Project: 
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      component="span"
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: getCardColor(),
                        mr: 1,
                        display: 'inline-block'
                      }}
                    />
                    {contentItem.project.name}
                  </Box>
                </M3Typography>
              )}
              
              {/* Publication Date */}
              {contentItem.publicationDate && (
                <M3Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Publication: {new Date(contentItem.publicationDate).toLocaleDateString()}
                </M3Typography>
              )}
              
              {/* Description */}
              {contentItem.description && (
                <Box sx={{ mt: 2 }}>
                  <M3Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
                    Description:
                  </M3Typography>
                  <M3Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {contentItem.description}
                  </M3Typography>
                </Box>
              )}
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
            Are you sure you want to delete &quot;{contentItem.title}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={16} /> : undefined}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContentItemModal; 