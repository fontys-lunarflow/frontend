import React from 'react';
import { Box } from '@mui/material';
import M3Typography from '@/components/M3Typography';
import ContentCard from './ContentCard';
import { ContentItem } from '@/lib/config/api';

interface ContentListProps {
  contentItems: ContentItem[];
  onRefresh?: () => void;
}

const ContentList: React.FC<ContentListProps> = ({ contentItems, onRefresh }) => {
  if (contentItems.length === 0) {
    return (
      <Box sx={{ 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        border: '1px dashed #ccc',
        borderRadius: '8px',
        my: 4
      }}>
        <M3Typography variant="h6" color="text.secondary">
          No content items available
        </M3Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {contentItems.map((item) => (
          <ContentCard 
            key={item.id}
            id={item.id || 0}
            title={item.title}
            bookmarked={item.bookmarked || false}
            subject={item.subject}
            topic={item.topic}
            projectId={item.projectId}
            onDelete={onRefresh}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ContentList; 