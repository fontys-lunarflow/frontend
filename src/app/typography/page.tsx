'use client';

import React from 'react';
import { 
  Box, 
  Paper, 
  Container, 
  Card, 
  CardContent, 
  Divider, 
  useTheme
} from '@mui/material';
import M3Typography from '@/components/M3Typography';

export default function TypographyShowcase() {
  const theme = useTheme();
  
  // Sample text for showcasing typography
  const sampleText = {
    alphabet: 'ABCDEFGHIJKLM',
    lowercase: 'abcdefghijklmopqrz',
    numbers: '0123456789'
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          mb: 4
        }}
      >
        <M3Typography variant="h4" color="primary.main" gutterBottom>
          Typography Showcase
        </M3Typography>
        <M3Typography variant="body1" paragraph>
          This page demonstrates the different typography variants available in the Material Design 3 theme.
        </M3Typography>
      </Paper>
      
      {/* Primary Font: Roboto */}
      <Card sx={{ mb: 4, borderRadius: 4 }}>
        <CardContent>
          <M3Typography variant="h5" gutterBottom>
            Primary Font: Roboto
          </M3Typography>
          <Divider sx={{ mb: 3 }} />
          
          {/* Roboto Regular */}
          <Box sx={{ mb: 4 }}>
            <M3Typography variant="subtitle1" gutterBottom color="primary.main">
              Roboto Regular
            </M3Typography>
            <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
              <M3Typography variant="regular">
                {sampleText.alphabet}
              </M3Typography>
              <M3Typography variant="regular">
                {sampleText.lowercase}
              </M3Typography>
              <M3Typography variant="regular">
                {sampleText.numbers}
              </M3Typography>
            </Box>
          </Box>
          
          {/* Roboto Thin */}
          <Box sx={{ mb: 4 }}>
            <M3Typography variant="subtitle1" gutterBottom color="primary.main">
              Roboto Thin
            </M3Typography>
            <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
              <M3Typography variant="thin">
                {sampleText.alphabet}
              </M3Typography>
              <M3Typography variant="thin">
                {sampleText.lowercase}
              </M3Typography>
              <M3Typography variant="thin">
                {sampleText.numbers}
              </M3Typography>
            </Box>
          </Box>
          
          {/* Roboto Bold */}
          <Box sx={{ mb: 4 }}>
            <M3Typography variant="subtitle1" gutterBottom color="primary.main">
              Roboto Bold
            </M3Typography>
            <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
              <M3Typography variant="bold">
                {sampleText.alphabet}
              </M3Typography>
              <M3Typography variant="bold">
                {sampleText.lowercase}
              </M3Typography>
              <M3Typography variant="bold">
                {sampleText.numbers}
              </M3Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Headers Typography */}
      <Card sx={{ mb: 4, borderRadius: 4 }}>
        <CardContent>
          <M3Typography variant="h5" gutterBottom>
            Online Headers Typography
          </M3Typography>
          <Divider sx={{ mb: 3 }} />
          
          {/* Roboto Condensed Bold */}
          <Box sx={{ mb: 4 }}>
            <M3Typography variant="subtitle1" gutterBottom color="primary.main">
              Roboto Condensed Bold
            </M3Typography>
            <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
              <M3Typography variant="condensedBold">
                {sampleText.alphabet}
              </M3Typography>
              <M3Typography variant="condensedBold">
                {sampleText.lowercase}
              </M3Typography>
              <M3Typography variant="condensedBold">
                {sampleText.numbers}
              </M3Typography>
            </Box>
            <M3Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              The Roboto Condensed has been chosen for our main title &lt;H1&gt; in our website and online products.
            </M3Typography>
          </Box>
        </CardContent>
      </Card>
      
      {/* Standard Typography Variants */}
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <M3Typography variant="h5" gutterBottom>
            Standard Typography Variants
          </M3Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Box sx={{ mb: 3 }}>
              <M3Typography variant="subtitle1" gutterBottom color="primary.main">
                Headers
              </M3Typography>
              <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                <M3Typography variant="h1" gutterBottom>H1 Heading</M3Typography>
                <M3Typography variant="h2" gutterBottom>H2 Heading</M3Typography>
                <M3Typography variant="h3" gutterBottom>H3 Heading</M3Typography>
                <M3Typography variant="h4" gutterBottom>H4 Heading</M3Typography>
                <M3Typography variant="h5" gutterBottom>H5 Heading</M3Typography>
                <M3Typography variant="h6" gutterBottom>H6 Heading</M3Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <M3Typography variant="subtitle1" gutterBottom color="primary.main">
                Text & Subtitles
              </M3Typography>
              <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                <M3Typography variant="subtitle1" gutterBottom>Subtitle 1</M3Typography>
                <M3Typography variant="subtitle2" gutterBottom>Subtitle 2</M3Typography>
                <M3Typography variant="body1" gutterBottom>Body 1 - Main body text</M3Typography>
                <M3Typography variant="body2" gutterBottom>Body 2 - Secondary body text</M3Typography>
                <M3Typography variant="button" display="block" gutterBottom>Button Text</M3Typography>
                <M3Typography variant="caption" display="block" gutterBottom>Caption Text</M3Typography>
                <M3Typography variant="overline" display="block" gutterBottom>Overline Text</M3Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
} 