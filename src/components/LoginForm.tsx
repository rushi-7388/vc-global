import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "./LoadingSpinner"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "@/lib/auth"

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToSignUp?: () => void
}

export const LoginForm = ({ onSuccess, onSwitchToSignUp }: LoginFormProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await signIn(email, password)

      if (error) {
        setError(error.message)
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        })
      } else if (data?.user) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        })
        onSuccess?.()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0">
      <Card className="w-full shadow-lg border-0 bg-black backdrop-blur-sm min-h-[500px] sm:min-h-[550px]">
        <CardHeader className="space-y-4 pb-8 pt-8">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Sign In
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base text-muted-foreground">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="text-sm">
                <AlertDescription className="text-center">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mt-4" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          
          {onSwitchToSignUp && (
            <div className="pt-6 border-t border-border/50">
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToSignUp}
                  className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline"
                  disabled={loading}
                >
                  Create account
                </button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
