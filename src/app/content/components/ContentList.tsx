import React, { useMemo } from 'react';
import { Box, Divider } from '@mui/material';
import M3Typography from '@/components/M3Typography';
import ContentCard from './ContentCard';
import { ContentItem } from '@/lib/config/api';
import moment from 'moment';

interface ContentListProps {
  contentItems: ContentItem[];
  onRefresh?: () => void;
}

// Interface for our grouped content items
interface GroupedContent {
  [key: string]: {
    date: Date;
    items: ContentItem[];
  }
}

const ContentList: React.FC<ContentListProps> = ({ contentItems, onRefresh }) => {
  // Group content items by date
  const groupedItems = useMemo(() => {
    const grouped: GroupedContent = {};
    
    contentItems.forEach(item => {
      // Use publicationDate, fallback to date, or use today
      let itemDate;
      if (item.publicationDate) {
        itemDate = new Date(item.publicationDate);
      } else if (item.date) {
        itemDate = new Date(item.date);
      } else {
        itemDate = new Date();
      }
      
      // Format date as YYYY-MM-DD for grouping
      const dateKey = moment(itemDate).format('YYYY-MM-DD');
      
      // Create group if it doesn't exist
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: itemDate,
          items: []
        };
      }
      
      // Add item to group
      grouped[dateKey].items.push(item);
    });
    
    // Sort dates - most recent first
    return Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) 
      .map(key => ({ 
        dateKey: key,
        date: grouped[key].date,
        items: grouped[key].items
      }));
  }, [contentItems]);

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
      alignItems: 'flex-start',
      justifyContent: 'flex-start'
    }}>
      {groupedItems.map(group => (
        <Box 
          key={group.dateKey} 
          sx={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            mb: 4 
          }}
        >
          {/* Date Header */}
          <Box sx={{ mb: 2, px: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <M3Typography variant="h6" fontWeight="500">
                {moment(group.date).format('dddd, MMMM D, YYYY')}
              </M3Typography>
              <Box sx={{ ml: 2, color: 'text.secondary' }}>
                <M3Typography variant="body2" color="inherit">
                  {group.items.length} item{group.items.length !== 1 ? 's' : ''}
                </M3Typography>
              </Box>
            </Box>
            <Divider />
          </Box>
          
          {/* Content Items */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {group.items.map((item) => (
              <ContentCard 
                key={item.id}
                id={item.id || 0}
                title={item.title}
                bookmarked={item.bookmarked || false}
                subject={item.subject}
                topic={item.topic}
                project={item.project}
                projectId={item.projectId}
                status={item.status as string | undefined}
                lifecycleStage={item.lifecycleStage as string | undefined}
                publicationDate={item.publicationDate}
                onDelete={onRefresh}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ContentList; 