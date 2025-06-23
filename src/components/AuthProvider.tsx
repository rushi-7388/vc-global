import { ReactNode } from "react"

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Better-auth doesn't require a SessionProvider wrapper
  // The auth client handles session management internally
  return <>{children}</>
}
