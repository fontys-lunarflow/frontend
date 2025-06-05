"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@mui/material"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Button disabled>Loading...</Button>
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">
          Welcome, {session.user?.name || session.user?.email}
        </span>
        <Button 
          variant="outlined" 
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Button 
      variant="contained" 
      onClick={() => signIn("keycloak")}
    >
      Sign In with Keycloak
    </Button>
  )
} 