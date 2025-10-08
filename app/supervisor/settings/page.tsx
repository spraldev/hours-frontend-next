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
import { Loader2, Save, Shield, Building2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useSupervisorDashboard } from "@/hooks/useSupervisorDashboard"
import toast from "react-hot-toast"
import { apiClient } from "@/lib/api-client"

export default function SupervisorSettingsPage() {
  const { user, updateUser } = useAuth()
  const { supervisor, loading, error, refetch } = useSupervisorDashboard()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")

  // Initialize form values when data loads
  React.useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setEmail(user.email || "")
    }
    if (supervisor) {
      setFirstName(supervisor.firstName || "")
      setLastName(supervisor.lastName || "")
      setEmail(supervisor.email || "")
    }
  }, [user, supervisor])

  // Generate initials
  const getInitials = () => {
    if (user && user.firstName && user.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase()
    }
    if (supervisor && supervisor.firstName && supervisor.lastName) {
      return (supervisor.firstName[0] + supervisor.lastName[0]).toUpperCase()
    }
    return "SV"
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Update supervisor profile
      const response = await apiClient.put('/supervisor/profile', {
        firstName,
        lastName,
        email,
      })

      if (response.success) {
        // Update the user in AuthContext so the changes reflect immediately
        updateUser({
          firstName,
          lastName,
          email,
        })
        
        // Refetch the supervisor data to update the UI with fresh data from backend
        await refetch()
        
        toast.success("Profile has been successfully updated.")
        setIsEditing(false)
      } else {
        throw new Error(response.message || 'Failed to update profile')
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      toast.error(error.message || "Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    const email = user?.email || supervisor?.email
    
    if (!email) {
      toast.error("No email address found")
      return
    }

    setIsResettingPassword(true)
    
    try {
      const response = await apiClient.requestPasswordReset(email, 'supervisor')
      
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
      <AppShell userRole="supervisor">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-[#0084ff]" />
        </div>
      </AppShell>
    )
  }

  const supervisorData = {
    name: user ? `${user.firstName} ${user.lastName}` : (supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Supervisor'),
    email: email || user?.email || supervisor?.email || 'supervisor@org.com',
    organizationName: typeof supervisor?.organization === 'string' 
      ? supervisor?.organization 
      : (supervisor?.organization as any)?.name || supervisor?.organizationName || 'Organization',
    isApproved: supervisor?.isApproved || false,
    joinDate: supervisor?.createdAt || new Date().toISOString(),
  }

  return (
    <AppShell userRole="supervisor">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <PageHeader title="Profile Settings" subtitle="Manage your account information and preferences" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic account details and organization information</CardDescription>
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
                    <h3 className="text-lg font-semibold">{supervisorData.name}</h3>
                    <p className="text-muted-foreground">{supervisorData.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {supervisorData.organizationName}
                      </Badge>
                      {supervisorData.isApproved && (
                        <Badge variant="default" className="bg-green-600">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted/50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted/50" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    This email will be used for account notifications and communication
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input 
                    id="organization" 
                    value={supervisorData.organizationName} 
                    disabled 
                    className="bg-muted/50" 
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact an administrator to change your organization
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                        Cancel
                      </Button>
                      <Button 
                        className="bg-[#0084ff] hover:bg-[#0070e6] text-white"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>  
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organization Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{supervisorData.organizationName}</p>
                  <Badge variant={supervisorData.isApproved ? "default" : "secondary"} className={supervisorData.isApproved ? "bg-green-600" : ""}>
                    {supervisorData.isApproved ? "Verified Supervisor" : "Pending Approval"}
                  </Badge>
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
                  <span>{new Date(supervisorData.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Status</span>
                  <span>{supervisorData.isApproved ? "Active" : "Pending"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span>Supervisor</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

