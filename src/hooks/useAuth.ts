"use client"

import { useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    session,
    user: session?.user,
    accessToken: session?.accessToken,
    refreshToken: session?.refreshToken,
    idToken: session?.idToken,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
  }
} 