'use client';

import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 3,
        backgroundColor: '#f5f5f5'
      }}
    >
      <Typography variant="h2" component="h1" color="primary">
        🚀 LunarFlow
      </Typography>
      
      <Typography variant="h5" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 600 }}>
        Content Management Platform
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 600 }}>
        Your application is running successfully in Kubernetes with Material-UI theming!
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => router.push('/content')}
        >
          View Content
        </Button>
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => router.push('/content/create')}
        >
          Create Content
        </Button>
      </Box>
    </Box>
  );
}
