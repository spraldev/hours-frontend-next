"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, Users, UserCheck, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"
import toast from "react-hot-toast"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [userType, setUserType] = useState<"student" | "supervisor">("student")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await apiClient.requestPasswordReset(email, userType)

      if (response.success) {
        setEmailSent(true)
        setMessage("If an account exists with that email, a password reset link has been sent.")
      } else {
        setError(response.message || "Failed to send reset email")
        toast.error(response.message || "Failed to send reset email")
      }
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0084ff]/10 via-[#4f46e5]/5 to-[#7c3aed]/10" />

        <div className="relative w-full max-w-md">
          {/* Back button */}
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>

          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-balance">Check Your Email</CardTitle>
              <CardDescription className="text-pretty">
                We've sent a password reset link to your email address
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Alert className="border-[#0084ff]/20 bg-[#0084ff]/5">
                <Mail className="h-4 w-4 text-[#0084ff]" />
                <AlertDescription className="text-sm">
                  {message}
                </AlertDescription>
              </Alert>

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setEmailSent(false)}
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/login">
                      Back to Login
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0084ff]/10 via-[#4f46e5]/5 to-[#7c3aed]/10" />

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </Button>

        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#0084ff] to-[#4f46e5] flex items-center justify-center">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-balance">Reset Password</CardTitle>
            <CardDescription className="text-pretty">
              Enter your email and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userType">I am a:</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={userType === "student" ? "default" : "outline"}
                    onClick={() => setUserType("student")}
                    className="flex items-center gap-2"
                    disabled={isLoading}
                  >
                    <Users className="h-4 w-4" />
                    Student
                  </Button>
                  <Button
                    type="button"
                    variant={userType === "supervisor" ? "default" : "outline"}
                    onClick={() => setUserType("supervisor")}
                    className="flex items-center gap-2"
                    disabled={isLoading}
                  >
                    <UserCheck className="h-4 w-4" />
                    Staff
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-muted/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  {userType === "student" 
                    ? "Enter the email address associated with your student account"
                    : "Enter the email address associated with your staff account"
                  }
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#0084ff] hover:bg-[#0070e6] text-white"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="text-[#0084ff] hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
