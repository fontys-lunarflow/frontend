import React, { useState, useRef } from 'react';
import { Box, Card, IconButton, Popover, Divider } from '@mui/material';
import M3Typography from '@/components/M3Typography';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';

interface ContentCardProps {
  id: number;
  title: string;
  bookmarked: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({ id, title, bookmarked }) => {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
          backgroundColor: '#40C4FF', // Cyan blue to match the image
          color: 'white',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.07)',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-1px)',
            transition: 'all 0.15s ease-in-out'
          }
        }}
      >
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
      </Card>

      {/* Replace Dialog with Popover */}
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
                  backgroundColor: '#40C4FF',
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
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleClose} sx={{ color: 'text.secondary' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ p: 2.5, pt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <M3Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Tuesday, April 1 • 1:30 – 2:30am
              </M3Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <M3Typography variant="body2">
                  30 minutes before
                </M3Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <M3Typography variant="body2">
                Veljko Skrbic
              </M3Typography>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default ContentCard; 