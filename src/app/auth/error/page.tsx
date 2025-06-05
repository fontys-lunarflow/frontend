"use client"

import { useSearchParams } from "next/navigation"
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Container,
  Alert 
} from "@mui/material"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link was invalid or has expired.",
    Default: "An error occurred during authentication.",
  }

  const errorMessage = errorMessages[error || "Default"]

  return (
    <Container maxWidth="sm">
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <Card sx={{ width: "100%", maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Authentication Error
            </Typography>
            
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
            
            <Box display="flex" gap={2}>
              <Button
                component={Link}
                href="/auth/signin"
                variant="contained"
                fullWidth
              >
                Try Again
              </Button>
              <Button
                component={Link}
                href="/"
                variant="outlined"
                fullWidth
              >
                Go Home
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
} 