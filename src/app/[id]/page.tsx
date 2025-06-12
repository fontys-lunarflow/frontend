'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  IconButton, 
  Divider, 
  CircularProgress,
  Alert,
  Paper,
  Button,
  Chip,
  Link,
  Typography,
  Stack,
  AppBar,
  Toolbar
} from '@mui/material';
import M3Typography from '@/components/M3Typography';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GitHubIcon from '@mui/icons-material/GitHub';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import CampaignIcon from '@mui/icons-material/Campaign';
import LabelIcon from '@mui/icons-material/Label';
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
    router.push('/content');
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f7fa' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#f5f7fa',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar>
            <IconButton onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <M3Typography variant="h6" sx={{ color: 'text.primary' }}>
              Error Loading Content
            </M3Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3, flex: 1 }}>
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
      </Box>
    );
  }

  if (!contentItem) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#f5f7fa',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar>
            <IconButton onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <M3Typography variant="h6" sx={{ color: 'text.primary' }}>
              Content Not Found
            </M3Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3, flex: 1 }}>
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
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f7fa',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <M3Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
            {contentItem.title}
          </M3Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
          onClick={handleEdit}
            sx={{ borderRadius: '8px' }}
        >
            Edit
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {/* Status and Lifecycle Chips */}
          <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {contentItem.status && (
          <Chip 
            label={contentItem.status} 
            sx={{ 
              fontWeight: 500,
                  backgroundColor: contentItem.status === 'BACKLOG' ? '#9C27B0' : 
                     contentItem.status === 'IN_PROGRESS' ? '#2196F3' : 
                                 contentItem.status === 'COMPLETED' ? '#4CAF50' : '#757575',
                  color: 'white'
            }} 
          />
        )}
        {contentItem.lifecycleStage && (
          <Chip 
            label={contentItem.lifecycleStage} 
            icon={<CampaignIcon />}
                sx={{ 
                  backgroundColor: '#FF9800',
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }}
          />
        )}
        {contentItem.publicationDate && (
          <Chip 
            icon={<CalendarTodayIcon />}
            label={`Publication: ${formatDate(contentItem.publicationDate)}`}
            variant="outlined"
                sx={{ 
                  borderColor: '#2196F3',
                  color: '#2196F3',
                  '& .MuiChip-icon': { color: '#2196F3' }
                }}
          />
        )}
      </Box>

          {/* Main Content Card */}
          <Paper elevation={1} sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
            {/* Topic Section */}
            <Box sx={{ p: 3, backgroundColor: 'white' }}>
              <M3Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                Topic Information
              </M3Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {contentItem.project && contentItem.project.color && (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: contentItem.project.color.startsWith('#') ? contentItem.project.color : `#${contentItem.project.color}`,
                      mr: 2
                    }}
                  />
                )}
                <M3Typography variant="body1" sx={{ fontSize: '1rem' }}>
                  {contentItem.project && contentItem.project.name ? contentItem.project.name : `Topic #${contentItem.projectId || 'Unknown'}`}
                </M3Typography>
              </Box>
            </Box>

            <Divider />

            {/* Person Responsible Section */}
            <Box sx={{ p: 3, backgroundColor: 'white' }}>
              <M3Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
            Person Responsible
          </M3Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 2, color: 'text.secondary', fontSize: '1.25rem' }} />
                <M3Typography variant="body1" sx={{ fontSize: '1rem' }}>
              {contentItem.personResponsibleId || 'Not assigned'}
            </M3Typography>
          </Box>
        </Box>

        {/* GitLab Information */}
        {(contentItem.gitlabIssueUrl || contentItem.gitlabId) && (
          <>
                <Divider />
                <Box sx={{ p: 3, backgroundColor: 'white' }}>
                  <M3Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                GitLab Information
              </M3Typography>
                  <Stack spacing={1}>
              {contentItem.gitlabId && (
                      <M3Typography variant="body2">
                  <strong>ID:</strong> {contentItem.gitlabId}
                </M3Typography>
              )}
              {contentItem.gitlabIssueUrl && (
                <Link 
                  href={contentItem.gitlabIssueUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 'fit-content' }}
                >
                  <GitHubIcon fontSize="small" />
                  <Typography variant="body2">
                    View GitLab Issue
                  </Typography>
                </Link>
              )}
                  </Stack>
            </Box>
          </>
        )}

            {/* Labels Section */}
            {contentItem.labels && contentItem.labels.length > 0 && (
          <>
                <Divider />
                <Box sx={{ p: 3, backgroundColor: 'white' }}>
                  <M3Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                    Labels
              </M3Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {contentItem.labels.map((label, index) => (
                  <Chip 
                    key={index}
                        label={label.name}
                        size="medium"
                        icon={<LabelIcon />}
                        sx={{
                          backgroundColor: label.color ? `${label.color}20` : '#f5f5f5', // Add transparency
                          borderColor: label.color || '#ccc',
                          color: '#000000',
                          border: `1px solid ${label.color || '#ccc'}`,
                          fontWeight: 500,
                          '& .MuiChip-icon': { color: label.color || '#666' }
                        }}
                  />
                ))}
              </Box>
            </Box>
          </>
        )}

            {/* Description Section */}
            {contentItem.description && (
          <>
                <Divider />
                <Box sx={{ p: 3, backgroundColor: 'white' }}>
                  <M3Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                    Description
              </M3Typography>
                  <M3Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
                    {contentItem.description}
              </M3Typography>
            </Box>
          </>
        )}
      </Paper>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBack}
              sx={{ borderRadius: '8px' }}
      >
        Back to Content List
      </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 