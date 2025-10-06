"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { OrganizationSelector } from "@/components/ui/organization-selector"
import { Eye, EyeOff, ArrowLeft, Shield, Users, UserCheck, Info, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"
import toast from "react-hot-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("student")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Calculate graduation years for current school year + next 3 years
  const getGraduationYears = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1 // getMonth() returns 0-11
    

    const schoolYearEndingYear = currentMonth >= 8 ? currentYear + 1 : currentYear
    
    return Array.from({ length: 4 }, (_, i) => schoolYearEndingYear + i)
  }

  const [studentFirstName, setStudentFirstName] = useState("")
  const [studentLastName, setStudentLastName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [graduationYear, setGraduationYear] = useState("")
  const [studentEmail, setStudentEmail] = useState("")
  const [studentPassword, setStudentPassword] = useState("")

  const [staffFirstName, setStaffFirstName] = useState("")
  const [staffLastName, setStaffLastName] = useState("")
  const [staffRole, setStaffRole] = useState("")
  const [customRole, setCustomRole] = useState("")
  const [staffEmail, setStaffEmail] = useState("")
  const [staffPassword, setStaffPassword] = useState("")
  const [verificationInfo, setVerificationInfo] = useState("")
  const [proofType, setProofType] = useState("")
  
  // Organization state
  const [selectedOrganization, setSelectedOrganization] = useState<{id: string, name: string, isNew?: boolean} | null>(null)

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await apiClient.post("/auth/student/register", {
        firstName: studentFirstName,
        lastName: studentLastName,
        studentId: studentId,
        graduatingYear: parseInt(graduationYear),
        email: studentEmail,
        password: studentPassword,
      })

      if (response.success) {
        setSuccess("Registration successful! Please check your email to verify your account.")
        toast.success("Registration successful. Please check your email to verify your account before logging in.")
        
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err: any) {
      // Provide user-friendly error messages based on the error
      let userMessage = "Unable to create your account. Please try again."
      
      if (err.message) {
        const errorMsg = err.message.toLowerCase()
        if (errorMsg.includes("already exists") || errorMsg.includes("duplicate")) {
          userMessage = "An account with this Student ID or email already exists. Please try logging in instead."
        } else if (errorMsg.includes("invalid email") || errorMsg.includes("email")) {
          userMessage = "Please use a valid school email address ending in @stu.gusd.net."
        } else if (errorMsg.includes("password")) {
          userMessage = "Password must be at least 6 characters long. Please choose a stronger password."
        } else if (errorMsg.includes("student id") || errorMsg.includes("studentid")) {
          userMessage = "Invalid Student ID format. Please check your Student ID and try again."
        } else if (errorMsg.includes("network") || errorMsg.includes("connection")) {
          userMessage = "Connection problem. Please check your internet and try again."
        } else if (errorMsg.includes("server") || errorMsg.includes("internal")) {
          userMessage = "We're experiencing technical difficulties. Please try again in a few moments."
        }
      }
      
      setError(userMessage)
      toast.error(userMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStaffRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      if (!selectedOrganization) {
        setError("Please select an organization")
        setIsLoading(false)
        return
      }

      const response = await apiClient.post("/auth/supervisor/register", {
        firstName: staffFirstName,
        lastName: staffLastName,
        email: staffEmail,
        password: staffPassword,
        organizationName: selectedOrganization.name,
        organizationId: selectedOrganization.isNew ? undefined : selectedOrganization.id,
        isNewOrganization: selectedOrganization.isNew || false,
        organizationDescription: selectedOrganization.isNew ? customRole : undefined,
        proofOfExistence: verificationInfo,
        proofType: proofType,
      })

      if (response.success) {
        setSuccess("Registration submitted! Your account will be reviewed by an administrator.")
        toast.success("Registration submitted. Your account will be reviewed by an administrator. You'll receive an email once approved.")
        
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err: any) {
      // Provide user-friendly error messages based on the error
      let userMessage = "Unable to submit your registration. Please try again."
      
      if (err.message) {
        const errorMsg = err.message.toLowerCase()
        if (errorMsg.includes("already exists") || errorMsg.includes("duplicate")) {
          userMessage = "An account with this email already exists. Please try logging in instead."
        } else if (errorMsg.includes("invalid email") || errorMsg.includes("email")) {
          userMessage = "Please use a valid organization email address."
        } else if (errorMsg.includes("password")) {
          userMessage = "Password must be at least 6 characters long. Please choose a stronger password."
        } else if (errorMsg.includes("verification") || errorMsg.includes("proof")) {
          userMessage = "Please provide valid verification information for your organization."
        } else if (errorMsg.includes("network") || errorMsg.includes("connection")) {
          userMessage = "Connection problem. Please check your internet and try again."
        } else if (errorMsg.includes("server") || errorMsg.includes("internal")) {
          userMessage = "We're experiencing technical difficulties. Please try again in a few moments."
        }
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
            <CardTitle className="text-2xl font-bold text-balance">Join CVHS Community Service</CardTitle>
            <CardDescription className="text-pretty">
              Create your account to start tracking service hours
            </CardDescription>
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
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && activeTab === "student" && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleStudentRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input 
                        id="first-name" 
                        placeholder="John" 
                        className="bg-muted/50"
                        value={studentFirstName}
                        onChange={(e) => setStudentFirstName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input 
                        id="last-name" 
                        placeholder="Doe" 
                        className="bg-muted/50"
                        value={studentLastName}
                        onChange={(e) => setStudentLastName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input 
                      id="student-id" 
                      placeholder="123456" 
                      className="bg-muted/50"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graduation-year">Graduation Year</Label>
                    <Select value={graduationYear} onValueChange={setGraduationYear} required disabled={isLoading}>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select your graduation year" />
                      </SelectTrigger>
                      <SelectContent>
                        {getGraduationYears().map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-email">School Email</Label>
                    <Input
                      id="student-email"
                      type="email"
                      placeholder="jfal1234@stu.gusd.net"
                      className="bg-muted/50"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
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
                        placeholder="Create a strong password"
                        className="bg-muted/50 pr-10"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
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

                  <Button 
                    type="submit" 
                    className="w-full bg-[#0084ff] hover:bg-[#0070e6] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Student Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="staff" className="space-y-4">
                <Alert className="border-[#0084ff]/20 bg-[#0084ff]/5">
                  <Info className="h-4 w-4 text-[#0084ff]" />
                  <AlertDescription className="text-sm">
                    Staff registration requires approval from CVHS administration
                  </AlertDescription>
                </Alert>

                {error && activeTab === "staff" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && activeTab === "staff" && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleStaffRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="staff-first-name">First Name</Label>
                      <Input 
                        id="staff-first-name" 
                        placeholder="Jane" 
                        className="bg-muted/50"
                        value={staffFirstName}
                        onChange={(e) => setStaffFirstName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-last-name">Last Name</Label>
                      <Input 
                        id="staff-last-name" 
                        placeholder="Smith" 
                        className="bg-muted/50"
                        value={staffLastName}
                        onChange={(e) => setStaffLastName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <OrganizationSelector
                      value={selectedOrganization}
                      onChange={setSelectedOrganization}
                      disabled={isLoading}
                      placeholder="Select organization"
                      required
                      className="bg-muted/50"
                    />
                    
                    {/* Show description field for new organizations */}
                    {selectedOrganization?.isNew && (
                      <div className="space-y-2">
                        <Label htmlFor="org-description" className="text-sm text-muted-foreground">
                          Brief description (optional)
                        </Label>
                        <Textarea
                          id="org-description"
                          placeholder="What does this organization do?"
                          className="bg-muted/50 min-h-[60px] resize-none"
                          value={customRole}
                          onChange={(e) => setCustomRole(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staff-email">Email</Label>
                    <Input 
                      id="staff-email" 
                      type="email" 
                      placeholder="jane.smith@organization.org" 
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
                        placeholder="Create a strong password"
                        className="bg-muted/50 pr-10"
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
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

                  <div className="space-y-2">
                    <Label htmlFor="proof-type">Proof Type</Label>
                    <Select value={proofType} onValueChange={setProofType} required disabled={isLoading}>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select proof type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verification-info">Verification Information</Label>
                    <Label htmlFor="verification-info" className="text-sm text-muted-foreground">Please provide how we can verify your role</Label>
                    <Input 
                      id="verification-info" 
                      type="text" 
                      placeholder="Ex: Organization website, LinkedIn profile, etc" 
                      className="bg-muted/50"
                      value={verificationInfo}
                      onChange={(e) => setVerificationInfo(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#0084ff] hover:bg-[#0070e6] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting Request..." : "Request Staff Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-[#0084ff] hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* School branding */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure registration powered by CVHS ❤️</span>
          </div>
        </div>
      </div>
    </div>
  )
}
