import { useState } from "react"
import { LoginForm } from "@/components/LoginForm"
import { SignUpForm } from "@/components/SignUpForm"
import { useNavigate } from "react-router-dom"

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const handleAuthSuccess = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        {/* Auth Form */}
        {isLogin ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignUp={() => setIsLogin(false)}
          />
        ) : (
          <SignUpForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignIn={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  )
}
