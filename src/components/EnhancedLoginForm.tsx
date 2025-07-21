import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "./LoadingSpinner"
import { useToast } from "@/hooks/use-toast"
import { secureSignIn } from "@/lib/enhancedAuth"
import { Shield, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react"

interface EnhancedLoginFormProps {
  onSuccess?: () => void
  onSwitchToSignUp?: () => void
}

export const EnhancedLoginForm = ({ onSuccess, onSwitchToSignUp }: EnhancedLoginFormProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('low')
  const [securityChecks, setSecurityChecks] = useState({
    networkSecure: false,
    deviceValid: false,
    connectionSafe: false
  })
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const { toast } = useToast()

  // Security checks on component mount
  useEffect(() => {
    performSecurityChecks()
  }, [])

  const performSecurityChecks = async () => {
    try {
      // Check network security
      const isHTTPS = window.location.protocol === 'https:'
      const isSecureContext = window.isSecureContext
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1'

      // Check device fingerprint
      const userAgent = navigator.userAgent
      const screenResolution = `${screen.width}x${screen.height}`
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const storedFingerprint = localStorage.getItem('device_fingerprint')
      const currentFingerprint = btoa(`${userAgent}-${screenResolution}-${timezone}`)

      setSecurityChecks({
        networkSecure: isHTTPS || isLocalhost,
        deviceValid: !storedFingerprint || storedFingerprint === currentFingerprint,
        connectionSafe: isSecureContext || isLocalhost
      })

      // Store device fingerprint if not exists
      if (!storedFingerprint) {
        localStorage.setItem('device_fingerprint', currentFingerprint)
      }

    } catch (error) {
      console.error('Security checks failed:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent form submission if blocked
    if (isBlocked) {
      toast({
        title: "Account Blocked",
        description: "Too many failed attempts. Please try again later.",
        variant: "destructive",
      })
      return
    }

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Use enhanced secure sign in
      const result = await secureSignIn(email, password)

      if (!result.success) {
        setError(result.error || "Login failed")
        setLoginAttempts(prev => prev + 1)
        
        // Block after 5 failed attempts
        if (loginAttempts >= 4) {
          setIsBlocked(true)
          toast({
            title: "Account Temporarily Blocked",
            description: "Too many failed attempts. Please try again in 15 minutes.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Login Failed",
            description: result.error || "Invalid credentials",
            variant: "destructive",
          })
        }
      } else {
        // Success
        setLoginAttempts(0)
        setIsBlocked(false)
        setSecurityLevel(result.securityLevel)
        
        toast({
          title: "Login Successful",
          description: `Welcome back! Security level: ${result.securityLevel}`,
        })
        
        onSuccess?.()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      setLoginAttempts(prev => prev + 1)
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getSecurityLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'high': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getSecurityLevelIcon = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return <AlertTriangle className="w-4 h-4" />
      case 'medium': return <Shield className="w-4 h-4" />
      case 'high': return <Lock className="w-4 h-4" />
      default: return <Shield className="w-4 h-4" />
    }
  }

  const remainingAttempts = 5 - loginAttempts

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0">
      <Card className="w-full shadow-lg border-0 bg-black backdrop-blur-sm min-h-[500px] sm:min-h-[550px]">
        <CardHeader className="space-y-4 pb-8 pt-8">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Secure Sign In
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base text-muted-foreground">
            Enhanced security authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 px-8">
          {/* Security Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Security Level:</span>
              <div className="flex items-center space-x-2">
                {getSecurityLevelIcon(securityLevel)}
                <span className={getSecurityLevelColor(securityLevel)}>
                  {securityLevel.toUpperCase()}
                </span>
              </div>
            </div>
            
            {/* Security Checks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Network Security</span>
                <div className={`w-2 h-2 rounded-full ${securityChecks.networkSecure ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Device Validation</span>
                <div className={`w-2 h-2 rounded-full ${securityChecks.deviceValid ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Connection Safety</span>
                <div className={`w-2 h-2 rounded-full ${securityChecks.connectionSafe ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            </div>

            {/* Login Attempts Warning */}
            {loginAttempts > 0 && (
              <Alert variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3" />
                <AlertDescription>
                  {remainingAttempts} login attempts remaining
                </AlertDescription>
              </Alert>
            )}
          </div>

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
                disabled={loading || isBlocked}
                className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading || isBlocked}
                  className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 pr-12"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mt-4" 
              disabled={loading || isBlocked}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Verifying...</span>
                </div>
              ) : isBlocked ? (
                "Account Blocked"
              ) : (
                "Sign In Securely"
              )}
            </Button>
          </form>
          
          {/* Security Features Info */}
          <div className="pt-6 border-t border-border/50">
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3" />
                <span>Enhanced security monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-3 h-3" />
                <span>Secure password transmission</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-3 h-3" />
                <span>Real-time threat detection</span>
              </div>
            </div>
          </div>
          
          {onSwitchToSignUp && (
            <div className="pt-4 border-t border-border/50">
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