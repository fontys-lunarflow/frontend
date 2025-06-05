"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Container 
} from "@mui/material"

interface Provider {
  id: string
  name: string
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)

  useEffect(() => {
    (async () => {
      const res = await getProviders()
      setProviders(res)
    })()
  }, [])

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
              Sign In
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Sign in to access your account
            </Typography>
            
            {providers &&
              Object.values(providers).map((provider) => (
                <Button
                  key={provider.name}
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => signIn(provider.id)}
                  sx={{ mb: 2 }}
                >
                  Sign in with {provider.name}
                </Button>
              ))}
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
} 