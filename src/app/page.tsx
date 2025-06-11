'use client';

import { Box, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Typography variant="h2" component="h1">
        🚀 LunarFlow
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Application is running successfully!
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Frontend is working in Kubernetes
      </Typography>
    </Box>
  );
}
