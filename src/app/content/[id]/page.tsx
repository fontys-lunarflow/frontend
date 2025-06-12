'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  IconButton, 
  Divider, 
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Chip,
  Link,
  Typography
} from '@mui/material';
import M3Typography from '@/components/M3Typography';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GitHubIcon from '@mui/icons-material/GitHub';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import CampaignIcon from '@mui/icons-material/Campaign';
import TagIcon from '@mui/icons-material/Tag';
import { getContentItem } from '@/app/content/actions';
import { ContentItem } from '@/lib/config/api';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ContentDetailPage({ params }: PageProps) {
  const id = parseInt(params.id, 10);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentItem, setContentItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    async function loadContentItem() {
      try {
        setLoading(true);
        setError(null);

        const result = await getContentItem(id);
        
        if (result.success && result.data) {
          setContentItem(result.data);
        } else {
          throw new Error(result.error || 'Failed to load content item');
        }
      } catch (error) {
        console.error('Error loading content item:', error);
        setError(error instanceof Error ? error.message : 'Failed to load content item');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadContentItem();
    } else {
      setError('Invalid content ID');
      setLoading(false);
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/content/edit/${id}`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
        >
          Back to Content List
        </Button>
      </Box>
    );
  }

  if (!contentItem) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Content item not found
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Content List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumb navigation */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink 
            component="button"
            variant="body2" 
            onClick={handleBack}
            underline="hover"
            color="inherit"
            sx={{ cursor: 'pointer' }}
          >
            Content List
          </MuiLink>
          <M3Typography variant="body2" color="text.primary">
            {contentItem.title}
          </M3Typography>
        </Breadcrumbs>
      </Box>

      {/* Content Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <M3Typography variant="h5" component="h1">
            {contentItem.title}
          </M3Typography>
        </Box>
        <IconButton 
          color="primary" 
          onClick={handleEdit}
          aria-label="edit content"
        >
          <EditIcon />
        </IconButton>
      </Box>

      {/* Status and Lifecycle Stage */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {contentItem.status && (
          <Chip 
            label={contentItem.status} 
            color="primary" 
            sx={{ 
              fontWeight: 500,
              bgcolor: contentItem.status === 'BACKLOG' ? '#9C27B0' : 
                     contentItem.status === 'IN_PROGRESS' ? '#2196F3' : 
                     contentItem.status === 'COMPLETED' ? '#4CAF50' : 'primary.main'
            }} 
          />
        )}
        {contentItem.lifecycleStage && (
          <Chip 
            label={contentItem.lifecycleStage} 
            color="secondary"
            icon={<CampaignIcon />}
          />
        )}
        {contentItem.publicationDate && (
          <Chip 
            icon={<CalendarTodayIcon />}
            label={`Publication: ${formatDate(contentItem.publicationDate)}`}
            variant="outlined"
          />
        )}
      </Box>

      {/* Content Details */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        {/* Basic Information */}
        <Box sx={{ mb: 2 }}>
          <M3Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
            Subject
          </M3Typography>
          <M3Typography variant="body1">
            {contentItem.subject}
          </M3Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Topic Information */}
        <Box sx={{ mb: 2 }}>
          <M3Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
            Topic
          </M3Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {contentItem.project && contentItem.project.color && (
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: `#${contentItem.project.color}`,
                  mr: 1
                }}
              />
            )}
            <M3Typography variant="body1">
              {contentItem.project && contentItem.project.name ? contentItem.project.name : `Topic #${contentItem.projectId || 'Unknown'}`}
            </M3Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Person Responsible */}
        <Box sx={{ mb: 2 }}>
          <M3Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
            Person Responsible
          </M3Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1.2rem' }} />
            <M3Typography variant="body1">
              {contentItem.personResponsibleId || 'Not assigned'}
            </M3Typography>
          </Box>
        </Box>

        {/* GitLab Information */}
        {(contentItem.gitlabIssueUrl || contentItem.gitlabId) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <M3Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                GitLab Information
              </M3Typography>
              {contentItem.gitlabId && (
                <M3Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>ID:</strong> {contentItem.gitlabId}
                </M3Typography>
              )}
              {contentItem.gitlabIssueUrl && (
                <Link 
                  href={contentItem.gitlabIssueUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <GitHubIcon fontSize="small" />
                  <Typography variant="body2">
                    View GitLab Issue
                  </Typography>
                </Link>
              )}
            </Box>
          </>
        )}

        {/* Personas */}
        {contentItem.personas && contentItem.personas.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <M3Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                Personas
              </M3Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {contentItem.personas.map((persona, index) => (
                  <Chip 
                    key={persona.id || index}
                    label={typeof persona === 'string' ? persona : persona.name}
                    size="small"
                    icon={<PersonIcon />}
                  />
                ))}
              </Box>
            </Box>
          </>
        )}

        {/* Channels */}
        {contentItem.channels && contentItem.channels.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <M3Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                Channels
              </M3Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {contentItem.channels.map((channel, index) => (
                  <Chip 
                    key={channel.id || index}
                    label={typeof channel === 'string' ? channel : channel.name}
                    size="small"
                    icon={<TagIcon />}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </>
        )}

        {/* Content */}
        {contentItem.content && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <M3Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                Content
              </M3Typography>
              <M3Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                {contentItem.content}
              </M3Typography>
            </Box>
          </>
        )}
      </Paper>

      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBack}
      >
        Back to Content List
      </Button>
    </Box>
  );
} 