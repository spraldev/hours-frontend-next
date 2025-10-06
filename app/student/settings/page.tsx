"use client"

import React, { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Shield } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useStudentDashboard } from "@/hooks/useStudentDashboard"
import { apiClient } from "@/lib/api-client"
import toast from "react-hot-toast"

export default function StudentSettingsPage() {
  const { user } = useAuth()
  const { student, statistics, loading } = useStudentDashboard()
  const [isResettingPassword, setIsResettingPassword] = useState(false)

  // Generate initials
  const getInitials = () => {
    if (user && user.firstName && user.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase()
    }
    if (student && student.firstName && student.lastName) {
      return (student.firstName[0] + student.lastName[0]).toUpperCase()
    }
    return "ST"
  }

  const handleChangePassword = async () => {
    const email = user?.email || student?.email
    
    if (!email) {
      toast.error("No email address found")
      return
    }

    setIsResettingPassword(true)
    
    try {
      const response = await apiClient.requestPasswordReset(email, 'student')
      
      if (response.success) {
        toast.success("Password reset email sent! Check your inbox.")
      } else {
        toast.error(response.message || "Failed to send reset email")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred. Please try again.")
    } finally {
      setIsResettingPassword(false)
    }
  }

  if (loading) {
    return (
      <AppShell userRole="student">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-[#0084ff]" />
        </div>
      </AppShell>
    )
  }

  const studentData = {
    name: user ? `${user.firstName} ${user.lastName}` : (student ? `${student.firstName} ${student.lastName}` : 'Student'),
    email: user?.email || student?.email || 'student@cvhs.edu',
    studentId: student?.studentId || user?.id || 'N/A',
    grade: student?.grade || 'N/A',
    graduationYear: student?.graduatingYear || new Date().getFullYear() + 1,
    totalHours: statistics?.approvedHours || 0,
    joinDate: student?.createdAt || new Date().toISOString(),
  }

  return (
    <AppShell userRole="student">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <PageHeader title="Profile Settings" subtitle="Manage your account information and preferences" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic account details and school information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white text-xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{studentData.name}</h3>
                    <p className="text-muted-foreground">{studentData.email}</p>
                    <Badge variant="secondary" className="mt-1">
                      Grade {studentData.grade} • Class of {studentData.graduationYear}
                    </Badge>
                  </div>
                </div>

                {/* Read-only Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      value={studentData.name.split(' ')[0]}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      value={studentData.name.split(' ').slice(1).join(' ')}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input id="student-id" value={studentData.studentId} disabled className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade Level</Label>
                    <Input id="grade" value={`Grade ${studentData.grade}`} disabled className="bg-muted/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">School Email</Label>
                  <Input id="email" type="email" value={studentData.email} disabled className="bg-muted/50" />
                  <p className="text-xs text-muted-foreground">
                    Contact your school administrator to change any of your account details
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card - Simplified without required hours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#0084ff]">
                      {studentData.totalHours}
                    </p>
                    <p className="text-sm text-muted-foreground">Hours Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent"
                  onClick={handleChangePassword}
                  disabled={isResettingPassword}
                >
                  {isResettingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since</span>
                  <span>{new Date(studentData.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student ID</span>
                  <span>{studentData.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Graduation Year</span>
                  <span>{studentData.graduationYear}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
