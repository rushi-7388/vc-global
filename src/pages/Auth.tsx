import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { LoginForm } from "@/components/LoginForm"
import { SignUpForm } from "@/components/SignUpForm"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Get the intended destination from URL search params or default to home
  const getIntendedDestination = () => {
    const params = new URLSearchParams(location.search)
    const redirectTo = params.get('redirectTo')
    return redirectTo || '/'
  }

  const handleSwitchToSignUp = () => {
    setIsSignUp(true)
  }

  const handleSwitchToSignIn = () => {
    setIsSignUp(false)
  }

  const handleAuthSuccess = () => {
    // Redirect to intended destination after successful auth
    const destination = getIntendedDestination()
    navigate(destination, { replace: true })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        {isSignUp ? (
          <SignUpForm 
            onSuccess={handleAuthSuccess}
            onSwitchToSignIn={handleSwitchToSignIn}
          />
        ) : (
          <LoginForm 
            onSuccess={handleAuthSuccess}
            onSwitchToSignUp={handleSwitchToSignUp}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Auth
