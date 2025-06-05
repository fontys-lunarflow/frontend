// Fake content items
export const contentItems = [
  {
    id: 1,
    title: 'Content Item Title',
    date: new Date(2023, 7, 17), // Aug 17
    bookmarked: true,
    tags: ['Tag Name']
  },
  {
    id: 2,
    title: 'Content Item Title',
    date: new Date(2023, 7, 17), // Aug 17
    bookmarked: false,
    tags: ['Tag Name']
  },
  {
    id: 3,
    title: 'Content Item Title',
    date: new Date(2023, 7, 17), // Aug 17
    bookmarked: true,
    tags: ['Tag Name']
  },
  {
    id: 4,
    title: 'Content Item Title',
    date: new Date(2023, 7, 17), // Aug 17
    bookmarked: false,
    tags: ['Tag Name']
  },
  {
    id: 5,
    title: 'Content Item Title',
    date: new Date(2023, 7, 16), // Aug 16
    bookmarked: true,
    tags: ['Tag Name']
  },
  {
    id: 6,
    title: 'Content Item Title',
    date: new Date(2023, 7, 16), // Aug 16
    bookmarked: false,
    tags: ['Tag Name']
  }
];

// Group items by date
export const groupItemsByDate = (items: typeof contentItems) => {
  const groupedItems: { [key: string]: typeof contentItems } = {};
  
  items.forEach(item => {
    const dateStr = item.date.toDateString();
    if (!groupedItems[dateStr]) {
      groupedItems[dateStr] = [];
    }
    groupedItems[dateStr].push(item);
  });
  
  return groupedItems;
};

// Format date
export const formatDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const itemDate = new Date(date);
  itemDate.setHours(0, 0, 0, 0);
  
  const diffDays = Math.round((itemDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === -1) {
    return 'Yesterday';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return itemDate.toLocaleDateString('en-US', options);
  }
}; 