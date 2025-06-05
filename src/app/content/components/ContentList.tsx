import React, { useMemo, useState } from 'react';
import { 
  Box, 
  Divider, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentItem } from '@/lib/config/api';
import ContentCard from './ContentCard';
import moment from 'moment';
import M3Typography from '@/components/M3Typography';
import CloseIcon from '@mui/icons-material/Close';

interface ContentListProps {
  contentItems: ContentItem[];
  onRefresh?: () => void;
  showTruncation?: boolean;
}

// Interface for our grouped content items
interface GroupedContent {
  [key: string]: {
    date: Date;
    items: ContentItem[];
  }
}

// The maximum number of items to show initially per date when truncation is enabled
const MAX_VISIBLE_ITEMS = 3;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger items by 100ms
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const ContentList: React.FC<ContentListProps> = ({ contentItems, onRefresh, showTruncation = false }) => {
  // State for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ContentItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Group content items by publication date
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
    
    // Sort dates - closest date first (ascending order)
    return Object.keys(grouped)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) 
      .map(key => ({ 
        dateKey: key,
        date: grouped[key].date,
        items: grouped[key].items
      }));
  }, [contentItems]);

  // Handle opening the modal with all items for a date
  const handleOpenModal = (items: ContentItem[], date: Date) => {
    setSelectedItems(items);
    setSelectedDate(date);
    setModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  if (contentItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
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
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%' }}
      >
      <Box sx={{ 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      }}>
          <AnimatePresence mode="popLayout">
            {groupedItems.map((group, groupIndex) => {
              // Apply truncation conditionally
              const hasMoreItems = showTruncation && group.items.length > MAX_VISIBLE_ITEMS;
          const visibleItems = hasMoreItems 
            ? group.items.slice(0, MAX_VISIBLE_ITEMS) 
            : group.items;
          const hiddenItemsCount = hasMoreItems 
            ? group.items.length - MAX_VISIBLE_ITEMS 
            : 0;
            
          return (
                <motion.div
              key={group.dateKey} 
                  variants={itemVariants}
                  layout
                  style={{ width: '100%', marginBottom: '32px' }}
                >
                  <Box 
              sx={{ 
                width: '100%', 
                display: 'flex', 
                      flexDirection: 'column'
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
                      <AnimatePresence mode="popLayout">
                        {visibleItems.map((item, itemIndex) => (
                          <motion.div
                            key={item.id}
                            variants={{
                              hidden: { 
                                opacity: 0, 
                                y: 20,
                                scale: 0.95
                              },
                              visible: { 
                                opacity: 1, 
                                y: 0,
                                scale: 1,
                                transition: {
                                  duration: 0.3,
                                  delay: (groupIndex * 0.1) + (itemIndex * 0.05), // Stagger items within groups
                                  ease: [0.4, 0.0, 0.2, 1]
                                }
                              },
                              exit: {
                                opacity: 0,
                                y: -10,
                                scale: 0.95,
                                transition: {
                                  duration: 0.2
                                }
                              }
                            }}
                            layout
                            whileHover={{ 
                              scale: 1.01,
                              transition: { duration: 0.2 }
                            }}
                          >
                  <ContentCard 
                    id={item.id || 0}
                    title={item.title}
                    subject={item.subject}
                    topic={item.topic}
                    project={item.project}
                    projectId={item.projectId}
                    status={item.status as string | undefined}
                    lifecycleStage={item.lifecycleStage as string | undefined}
                    onDelete={onRefresh}
                  />
                          </motion.div>
                ))}
                      </AnimatePresence>
                
                      {/* "View more" button - only show when truncation is enabled */}
                {hasMoreItems && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: (groupIndex * 0.1) + (visibleItems.length * 0.05) + 0.1,
                            duration: 0.3 
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                  <Button
                    onClick={() => handleOpenModal(group.items, group.date)}
                    sx={{
                      width: '100%',
                      textAlign: 'center',
                      py: 1.5,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      },
                      fontWeight: 400,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      boxShadow: 'none',
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    View {hiddenItemsCount}+ more content items
                  </Button>
                        </motion.div>
                )}
              </Box>
            </Box>
                </motion.div>
          );
        })}
          </AnimatePresence>
      </Box>
      </motion.div>
      
      {/* Modal for showing all items of a date - only when truncation is enabled */}
      {showTruncation && (
        <AnimatePresence>
          {modalOpen && (
      <Dialog 
        open={modalOpen} 
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: 0,
            overflow: 'hidden',
          }
        }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          pb: 1.5,
          bgcolor: 'background.paper'
        }}>
          <M3Typography variant="h6" fontWeight="500">
            {selectedDate && moment(selectedDate).format('dddd, MMMM D, YYYY')}
          </M3Typography>
          <IconButton 
            onClick={handleCloseModal}
            size="small"
            edge="end"
            aria-label="close"
            sx={{ 
              color: 'text.secondary',
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2, pt: 3 }}>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {selectedItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { 
                              opacity: 1, 
                              y: 0,
                              transition: {
                                delay: index * 0.05,
                                duration: 0.3
                              }
                            }
                          }}
                        >
              <ContentCard 
                id={item.id || 0}
                title={item.title}
                subject={item.subject}
                topic={item.topic}
                project={item.project}
                projectId={item.projectId}
                status={item.status as string | undefined}
                lifecycleStage={item.lifecycleStage as string | undefined}
                onDelete={() => {
                  onRefresh?.();
                  handleCloseModal();
                }}
              />
                        </motion.div>
            ))}
          </Box>
                  </motion.div>
        </DialogContent>
              </motion.div>
      </Dialog>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default ContentList; 