import React, { useState, useRef, useEffect } from 'react';
import { Card, Box, IconButton, Chip } from '@mui/material';
import M3Typography from '@/components/M3Typography';
import GitLabIcon from '@mui/icons-material/GitHub'; // Changed from GitLab to GitHub since we might not have a GitLab icon
import { ContentItem } from '@/lib/config/api';
import ContentItemModal from './ContentItemModal';

interface ContentCardProps {
  id: number;
  title: string;
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
  onDelete?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  id, 
  title, 
  subject, 
  topic, 
  project,
  projectId,
  status,
  lifecycleStage,
  onDelete 
}) => {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Project data fetching states (for legacy support)
  const [projectColor, setProjectColor] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);

  // Create ContentItem object for the modal
  const contentItem: ContentItem = {
    id,
    title,
    subject,
    topic,
    project: project || (projectId ? { id: projectId, name: projectName || `Project ${projectId}`, color: projectColor || undefined } : undefined),
    status,
    lifecycleStage,
    // Add any other required fields with default values
    description: '',
    publicationDate: undefined,
    personResponsibleId: '', // Add missing required field
  };

  const fetchProjectDetails = async () => {
    if (project || !projectId) return; // Skip if we already have project data or no projectId
    
    try {
      const response = await fetch(`/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getProject',
          projectId: projectId
        }),
      });

      const result = await response.json();
      if (result.success && result.project) {
        setProjectColor(result.project.color);
        setProjectName(result.project.name);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId, project]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCardColor = () => {
    if (project?.color) {
      const color = project.color.startsWith('#') ? project.color : `#${project.color}`;
      
      if (color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#fff' || 
          color.toLowerCase() === 'white' || color.toLowerCase() === 'transparent') {
        return '#f0f7ff'; // Light blue fallback
      }
      
      return color;
    }
    
    if (projectColor) {
      const color = projectColor.startsWith('#') ? projectColor : `#${projectColor}`;
      
      if (color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#fff' || 
          color.toLowerCase() === 'white' || color.toLowerCase() === 'transparent') {
        return '#f0f7ff'; // Light blue fallback
      }
      
      return color;
    }
    
    return '#f0f7ff'; // Default light blue
  };

  return (
    <>
      <Card 
        ref={cardRef}
        onClick={handleOpen}
        sx={{ 
          p: 2.5,
          mb: 1.5,
          borderRadius: '16px',
          border: '1px solid transparent',
          backgroundColor: getCardColor(),
          color: '#000000',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.07)',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-0.5px)',
            transition: 'all 0.15s ease-in-out'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '40px' }}>
            {/* Title on the left - bigger and vertically centered */}
            <M3Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.1rem', flex: 1, color: '#000000' }}>
              {title}
            </M3Typography>
            
            {/* Right side - Status, Lifecycle, and GitLab icon */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {status && (
                <Chip 
                  label={status} 
                  size="small"
                  sx={{ 
                    height: 24, 
                    fontSize: '0.7rem',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    color: '#000000',
                    fontWeight: 500,
                  }}
                />
              )}
              
              {lifecycleStage && (
                <Chip 
                  label={lifecycleStage} 
                size="small" 
                  sx={{ 
                    height: 24, 
                    fontSize: '0.7rem',
                    backgroundColor: 'rgba(0,0,0,0.15)',
                    color: '#000000',
                    fontWeight: 500,
                  }}
                />
              )}
              
              <IconButton 
                size="small" 
                sx={{ color: '#000000', padding: '6px' }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  // TODO: Open GitLab link
                }}
              >
                <GitLabIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          {/* Removed old project and date sections - new design is cleaner */}
        </Box>
      </Card>

      {/* Content Item Modal */}
      <ContentItemModal
        open={open}
        onClose={handleClose}
        anchorEl={cardRef.current}
        contentItem={contentItem}
        onDelete={onDelete}
      />
    </>
  );
};

export default ContentCard; 