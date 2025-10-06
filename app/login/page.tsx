"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, ArrowLeft, Shield, Users, UserCheck, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api-client"
import toast from "react-hot-toast"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("student")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isEmailVerificationError, setIsEmailVerificationError] = useState(false)
  const [isResendingVerification, setIsResendingVerification] = useState(false)

  const [studentId, setStudentId] = useState("")
  const [studentPassword, setStudentPassword] = useState("")
  const [rememberMeStudent, setRememberMeStudent] = useState(false)

  const [staffEmail, setStaffEmail] = useState("")
  const [staffPassword, setStaffPassword] = useState("")
  const [rememberMeStaff, setRememberMeStaff] = useState(false)

  const handleResendVerification = async () => {
    if (!studentId && !staffEmail) {
      toast.error("Please enter your credentials first")
      return
    }

    setIsResendingVerification(true)
    try {
      const response = await apiClient.post("/auth/resend-verification", {
        studentId: activeTab === "student" ? studentId : staffEmail
      })

      if (response.success) {
        toast.success("Verification email sent! Please check your inbox.")
        setIsEmailVerificationError(false)
        setError("")
      } else {
        toast.error(response.message || "Failed to resend verification email")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to resend verification email")
    } finally {
      setIsResendingVerification(false)
    }
  }

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setIsEmailVerificationError(false)

    try {
      const response = await apiClient.post("/auth/student/login", {
        studentId: studentId,
        password: studentPassword,
        rememberMe: rememberMeStudent,
      })

      console.log("Student login response:", response)

      if (response.success && response.token) {
        localStorage.setItem("auth_token", response.token)
        apiClient.login(response.token)
        
        console.log("Login successful, token set:", response.token)
        
        try {
          const userResponse = await apiClient.get("/auth/check-auth")
          console.log("Check-auth response:", userResponse)
          
          if (userResponse.success && userResponse.data) {
            const role = userResponse.data.role as "student" | "supervisor" | "admin" | "superadmin"
            const user = {
              id: userResponse.data.id,
              email: userResponse.data.email,
              role: role,
              firstName: userResponse.data.firstName,
              lastName: userResponse.data.lastName,
            }
            login(response.token, user)
            toast.success("Welcome back!")
            
            // Force redirect based on role
            if (role === "admin" || role === "superadmin") {
              window.location.href = "/admin"
            } else if (role === "supervisor") {
              window.location.href = "/supervisor/dashboard"
            } else {
              window.location.href = "/student/dashboard"
            }
          } else {
            console.log("Check-auth response missing data, redirecting anyway")
            // Still redirect even if check-auth fails - we have a valid token
            toast.success("Welcome back!")
            window.location.href = "/student/dashboard"
          }
        } catch (checkAuthError) {
            throw new Error("Check-auth failed")
        }
      } else {
        throw new Error("Invalid login response from server")
      }
    } catch (err: any) {
      console.log(err)
      
      // Check both err.message and err.message (ApiError structure)
      const errorMessage = err.message || ''
      
      // Check if this is an email verification error
      if (errorMessage && errorMessage.toLowerCase().includes("verify") && errorMessage.toLowerCase().includes("email")) {
        setIsEmailVerificationError(true)
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setIsEmailVerificationError(false)

    try {
      const response = await apiClient.post("/auth/privileged/login", {
        email: staffEmail,
        password: staffPassword,
        rememberMe: rememberMeStaff,
      })

      if (response.success && response.token) {
        // Set token in both localStorage AND apiClient before making any authenticated requests
        localStorage.setItem("auth_token", response.token)
        apiClient.login(response.token)  // This ensures the token is set in apiClient's internal state
        
        console.log("Staff login successful, token set:", response.token)
        
        try {
          const userResponse = await apiClient.get("/auth/check-auth")
          console.log("Check-auth response:", userResponse)
          
          if (userResponse.success && userResponse.data) {
            const role = userResponse.data.role as "student" | "supervisor" | "admin" | "superadmin"
            const user = {
              id: userResponse.data.id,
              email: userResponse.data.email,
              role: role,
              firstName: userResponse.data.firstName,
              lastName: userResponse.data.lastName,
            }
            login(response.token, user)
            toast.success("Welcome back!")
            
            // Force redirect based on role
            if (role === "admin" || role === "superadmin") {
              window.location.href = "/admin"
            } else if (role === "supervisor") {
              window.location.href = "/supervisor/dashboard"
            } else {
              window.location.href = "/student/dashboard"
            }
          } else {
            console.log("Check-auth response missing data, redirecting to admin")
            // Default to admin for staff login if check-auth fails
            toast.success("Welcome back!")
            window.location.href = "/admin"
          }
        } catch (checkAuthError) {
          console.error("Check-auth failed:", checkAuthError)
          // Default to admin dashboard for staff login
          toast.success("Welcome back!")
          window.location.href = "/admin"
        }
      } else {
        throw new Error("Invalid login response from server")
      }
    } catch (err: any) {
      // Provide user-friendly error messages based on the error
      let userMessage = "Please check your email and password and try again."
      
      const errorMessage = err.message || ''
      
      if (errorMessage) {
        const errorMsg = errorMessage.toLowerCase()
        if (errorMsg.includes("verify") && errorMsg.includes("email")) {
          userMessage = "Please verify your email address before logging in. Check your inbox for a verification link."
        } else if (errorMsg.includes("invalid") || errorMsg.includes("incorrect") || errorMsg.includes("unauthorized")) {
          userMessage = "Invalid email or password. Please double-check your credentials."
        } else if (errorMsg.includes("not found") || errorMsg.includes("user")) {
          userMessage = "Email not found. Please check your email or contact administration."
        } else if (errorMsg.includes("pending") || errorMsg.includes("approval")) {
          userMessage = "Your account is pending approval. Please wait for administrator confirmation."
        } else if (errorMsg.includes("network") || errorMsg.includes("connection")) {
          userMessage = "Connection problem. Please check your internet and try again."
        } else if (errorMsg.includes("server") || errorMsg.includes("internal")) {
          userMessage = "We're experiencing technical difficulties. Please try again in a few moments."
        }
      }

      console.log("Error message:", errorMessage)
      
      // Check if this is an email verification error
      if (errorMessage && errorMessage.toLowerCase().includes("verify") && errorMessage.toLowerCase().includes("email")) {
        setIsEmailVerificationError(true)
      }
      
      setError(userMessage)
      toast.error(userMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0084ff]/10 via-[#4f46e5]/5 to-[#7c3aed]/10" />

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#0084ff] to-[#4f46e5] flex items-center justify-center">
                <span className="text-white font-bold text-xl">CV</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-balance">Welcome Back</CardTitle>
            <CardDescription className="text-pretty">Sign in to your CVHS Community Service account</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Staff
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4">
                {error && activeTab === "student" && (
                  <>
                    <Alert variant={isEmailVerificationError ? "default" : "destructive"} className={isEmailVerificationError ? "border-amber-500/50 bg-amber-500/10" : ""}>
                      <AlertCircle className={`h-4 w-4 ${isEmailVerificationError ? "text-amber-500" : ""}`} />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    {isEmailVerificationError && (
                      <Alert className="border-[#0084ff]/20 bg-[#0084ff]/5">
                        <AlertDescription className="space-y-3">
                          <p className="text-sm font-medium">Haven't received the verification email?</p>
                          <Button 
                            onClick={handleResendVerification} 
                            disabled={isResendingVerification}
                            className="w-full bg-[#0084ff] hover:bg-[#0070e6] text-white"
                            size="sm"
                          >
                            {isResendingVerification ? "Sending..." : "Resend Verification Email"}
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input
                      id="student-id"
                      type="text"
                      placeholder="123456"
                      className="bg-muted/50"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="student-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="bg-muted/50 pr-10"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember-me-student" 
                        checked={rememberMeStudent}
                        onCheckedChange={(checked) => setRememberMeStudent(checked === true)}
                        disabled={isLoading}
                      />
                      <Label 
                        htmlFor="remember-me-student" 
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        Remember me for 30 days
                      </Label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-[#0084ff] hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#0084ff] hover:bg-[#0070e6] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In as Student"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="staff" className="space-y-4">
                <Alert className="border-[#0084ff]/20 bg-[#0084ff]/5">
                  <Shield className="h-4 w-4 text-[#0084ff]" />
                  <AlertDescription className="text-sm">
                    Staff login for supervisors and administrators
                  </AlertDescription>
                </Alert>

                {error && activeTab === "staff" && (
                  <>
                    <Alert variant={isEmailVerificationError ? "default" : "destructive"} className={isEmailVerificationError ? "border-amber-500/50 bg-amber-500/10" : ""}>
                      <AlertCircle className={`h-4 w-4 ${isEmailVerificationError ? "text-amber-500" : ""}`} />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    {isEmailVerificationError && (
                      <Alert className="border-[#0084ff]/20 bg-[#0084ff]/5">
                        <AlertDescription className="space-y-3">
                          <p className="text-sm font-medium">Haven't received the verification email?</p>
                          <Button 
                            onClick={handleResendVerification} 
                            disabled={isResendingVerification}
                            className="w-full bg-[#0084ff] hover:bg-[#0070e6] text-white"
                            size="sm"
                          >
                            {isResendingVerification ? "Sending..." : "Resend Verification Email"}
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}

                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff-email">Username or Email</Label>
                    <Input 
                      id="staff-email" 
                      type="text" 
                      placeholder="supervisor@example.com or username" 
                      className="bg-muted/50"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staff-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="staff-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="bg-muted/50 pr-10"
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember-me-staff" 
                        checked={rememberMeStaff}
                        onCheckedChange={(checked) => setRememberMeStaff(checked === true)}
                        disabled={isLoading}
                      />
                      <Label 
                        htmlFor="remember-me-staff" 
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        Remember me for 30 days
                      </Label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-[#0084ff] hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#0084ff] hover:bg-[#0070e6] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In as Staff"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#0084ff] hover:underline font-medium">
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* School branding */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure login powered by CVHS IT</span>
          </div>
        </div>
      </div>
    </div>
  )
}
