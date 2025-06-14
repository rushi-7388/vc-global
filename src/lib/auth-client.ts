
import { createAuthClient } from "better-auth/react"
import { env } from "@/config/env"

export const authClient = createAuthClient({
  baseURL: env.API_BASE_URL,
})

export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
} = authClient

export const getSession = authClient.getSession
