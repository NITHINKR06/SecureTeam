"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Loader2, Users, Shield, Zap, MessageSquare, Eye, EyeOff, Mail } from "lucide-react"
import { authenticateUser } from "@/lib/dummy-data"
import { signInWithGoogle, signInWithEmail, onAuthChange } from "@/lib/firebase"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDemo, setShowDemo] = useState(false)

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        console.log("User authenticated via Firebase:", user)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleGoogleSignIn = async () => {
    setError("")
    setIsGoogleLoading(true)

    try {
      const result = await signInWithGoogle()
      
      if (result.success) {
        console.log("Google sign-in successful:", result.user)
        
        // Store user in localStorage for the app
        localStorage.setItem("user", JSON.stringify(result.user))
        
        // Try to sync with backend if available
        try {
          const response = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: result.user.email,
              name: result.user.name,
              googleId: result.user.id,
              avatar: result.user.avatar
            })
          })
          
          if (response.ok) {
            console.log("Synced with backend")
          }
        } catch (error) {
          console.log("Backend sync skipped (backend may be offline)")
        }
        
        router.push("/")
      } else {
        setError(result.error || "Google sign-in failed")
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
      setError("An unexpected error occurred during Google sign-in")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Try Firebase authentication first
      const firebaseResult = await signInWithEmail(email, password)
      
      if (firebaseResult.success) {
        console.log("Firebase login successful:", firebaseResult.user)
        localStorage.setItem("user", JSON.stringify(firebaseResult.user))
        router.push("/")
        return
      }

      // If Firebase fails, try backend API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Backend login successful:", data.user)
        router.push("/")
      } else if (response.status === 500 || response.status === 404) {
        // Backend not available, fallback to mock auth
        console.log("Backend not available, using mock authentication")
        const result = await authenticateUser(email, password)
        
        if (result.success) {
          localStorage.setItem("user", JSON.stringify(result.user))
          router.push("/")
        } else {
          setError(result.error || "Invalid credentials")
        }
      } else {
        const data = await response.json()
        setError(data.error || "Invalid credentials")
      }
    } catch (error) {
      // Network error or backend not running, use mock auth
      console.log("Using mock authentication (backend unavailable)")
      const result = await authenticateUser(email, password)
      
      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user))
        router.push("/")
      } else {
        setError(result.error || "Invalid credentials")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = (demoEmail) => {
    setEmail(demoEmail)
    setPassword("demo123")
    setShowDemo(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow animate-float">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
          </div>

          <Card className="glass border-border/50 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center">
                Sign in to access your team workspace
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-in">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Google Sign In Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 font-medium hover-lift"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in with Google...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading || isGoogleLoading}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading || isGoogleLoading}
                      className="bg-background/50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading || isGoogleLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-brand text-white font-medium hover-lift"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Sign in with Email
                    </>
                  )}
                </Button>
              </form>

              <Separator />

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowDemo(!showDemo)}
                disabled={isLoading || isGoogleLoading}
              >
                View Demo Credentials
              </Button>

              {showDemo && (
                <div className="space-y-2 p-3 rounded-lg bg-muted/50 animate-in">
                  <p className="text-sm font-medium mb-2">Demo Accounts:</p>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials("demo@secureteam.com")}
                      className="w-full text-left p-2 rounded hover:bg-background/50 transition-colors"
                      disabled={isLoading || isGoogleLoading}
                    >
                      <div className="text-sm font-medium">Demo User</div>
                      <div className="text-xs text-muted-foreground">demo@secureteam.com / demo123</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials("john@secureteam.com")}
                      className="w-full text-left p-2 rounded hover:bg-background/50 transition-colors"
                      disabled={isLoading || isGoogleLoading}
                    >
                      <div className="text-sm font-medium">Engineering Lead</div>
                      <div className="text-xs text-muted-foreground">john@secureteam.com / demo123</div>
                    </button>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-2 pt-2">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Secured with Firebase Authentication</span>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Don't have an account? <button className="text-primary hover:underline">Contact your admin</button>
              </p>
            </CardFooter>
          </Card>

          {/* Logo and Tagline */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gradient-primary">SecureTeam</h1>
            <p className="text-sm text-muted-foreground">Enterprise messaging with Google & Firebase auth</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Features */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gradient-mesh relative overflow-hidden">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
        <div className="relative z-10 max-w-lg space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-4 text-gradient">
              Where teams <span className="text-primary">collaborate</span> seamlessly
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of teams already using SecureTeam to streamline their communication and boost productivity.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Team Collaboration</h3>
                <p className="text-sm text-muted-foreground">
                  Organize conversations in channels, share files, and keep everyone aligned.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Enterprise Security</h3>
                <p className="text-sm text-muted-foreground">
                  Firebase authentication with Google SSO for maximum security and convenience.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time messaging with instant notifications and seamless synchronization.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-semibold">Google Sign-In Available</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sign in instantly with your Google account for seamless access to your workspace.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/50">
            <div>
              <div className="text-3xl font-bold text-gradient-primary">10M+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Teams</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
