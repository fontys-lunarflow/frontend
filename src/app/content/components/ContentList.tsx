import React from 'react';
import { Box } from '@mui/material';
import M3Typography from '@/components/M3Typography';
import ContentCard from './ContentCard';

interface ContentItem {
  id: number;
  title: string;
  date: Date;
  bookmarked: boolean;
  tags: string[];
}

interface ContentListProps {
  groupedItems: { [key: string]: ContentItem[] };
  formatDate: (date: Date) => string;
}

const ContentList: React.FC<ContentListProps> = ({ groupedItems, formatDate }) => {
  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {Object.keys(groupedItems).map((dateStr) => (
        <Box key={dateStr} sx={{ mb: 4, width: '100%' }}>
          <M3Typography 
            variant="h6" 
            sx={{ mb: 2, ml: 1, fontWeight: 500, color: 'text.primary' }}
          >
            {formatDate(new Date(dateStr))}
          </M3Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {groupedItems[dateStr].map((item) => (
              <ContentCard 
                key={item.id}
                id={item.id}
                title={item.title}
                bookmarked={item.bookmarked}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ContentList; 