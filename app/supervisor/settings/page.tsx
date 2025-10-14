"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, Shield, Building2, Plus, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useSupervisorDashboard } from "@/hooks/useSupervisorDashboard"
import toast from "react-hot-toast"
import { apiClient } from "@/lib/api-client"
import { OrganizationSelector } from "@/components/ui/organization-selector"
import type { Organization } from "@/types/api"

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
  const [selectedOrganizations, setSelectedOrganizations] = useState<Array<{id: string, name: string}>>([])
  const [newOrganization, setNewOrganization] = useState<{id: string, name: string} | null>(null)

  // Initialize form values when data loads
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setEmail(user.email || "")
    }
    if (supervisor) {
      setFirstName(supervisor.firstName || "")
      setLastName(supervisor.lastName || "")
      setEmail(supervisor.email || "")
      
      // Initialize organizations
      if (supervisor.organizations && Array.isArray(supervisor.organizations)) {
        const orgs = supervisor.organizations.map((org: any) => ({
          id: typeof org === 'string' ? org : org._id,
          name: typeof org === 'string' ? org : org.name
        }))
        setSelectedOrganizations(orgs)
      } else if (supervisor.organizationNames && Array.isArray(supervisor.organizationNames)) {
        // Fallback: create organization objects from names
        const orgs = supervisor.organizationNames.map((name: string, index: number) => ({
          id: `org-${index}`,
          name: name
        }))
        setSelectedOrganizations(orgs)
      }
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
      const updateData: any = {
        firstName,
        lastName,
        email,
        organizationIds: selectedOrganizations.map(org => org.id)
      }
      
      const response = await apiClient.put('/supervisor/profile', updateData)

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
        setNewOrganization(null)
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
  
  const handleAddOrganization = () => {
    if (!newOrganization) {
      toast.error("Please select an organization first")
      return
    }
    
    // Check if organization already exists
    if (selectedOrganizations.find(org => org.id === newOrganization.id)) {
      toast.error("This organization is already added")
      return
    }
    
    setSelectedOrganizations([...selectedOrganizations, newOrganization])
    setNewOrganization(null)
    toast.success(`Added ${newOrganization.name}`)
  }
  
  const handleRemoveOrganization = (orgId: string) => {
    if (selectedOrganizations.length <= 1) {
      toast.error("You must belong to at least one organization")
      return
    }
    const org = selectedOrganizations.find(o => o.id === orgId)
    setSelectedOrganizations(selectedOrganizations.filter(org => org.id !== orgId))
    if (org) {
      toast.success(`Removed ${org.name}`)
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
    organizationNames: selectedOrganizations.length > 0 
      ? selectedOrganizations.map(org => org.name)
      : supervisor?.organizationNames && supervisor.organizationNames.length > 0
      ? supervisor.organizationNames
      : ['Organization'],
    isActive: supervisor?.isActive || false,
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
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {supervisorData.organizationNames.map((orgName, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {orgName}
                        </Badge>
                      ))}
                      {supervisorData.isActive && (
                        <Badge variant="default" className="bg-blue-600">
                          Supervisor Active
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
                  <Label htmlFor="organizations">Organization{selectedOrganizations.length > 1 ? 's' : ''}</Label>
                  
                  {isEditing ? (
                    <div className="space-y-3">
                      {/* Current Organizations */}
                      <div className="space-y-2">
                        {selectedOrganizations.map((org, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input 
                              value={org.name} 
                              disabled 
                              className="bg-muted/50 flex-1" 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveOrganization(org.id)}
                              disabled={selectedOrganizations.length <= 1 || isSaving}
                              title={selectedOrganizations.length <= 1 ? "Must have at least one organization" : "Remove organization"}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add New Organization */}
                      <div className="space-y-2 pt-2 border-t">
                        <Label className="text-sm">Add Organization</Label>
                        <div className="flex gap-2">
                          <OrganizationSelector
                            value={newOrganization}
                            onChange={setNewOrganization}
                            placeholder="Select organization to add"
                            className="flex-1"
                            allowAddNew={false}
                            disabled={isSaving}
                          />
                          <Button
                            type="button"
                            onClick={handleAddOrganization}
                            disabled={!newOrganization || isSaving}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Don't see your organization? Please contact your administrator to create a new organization for you.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {selectedOrganizations.map((org, index) => (
                        <Input 
                          key={index}
                          value={org.name} 
                          disabled 
                          className="bg-muted/50" 
                        />
                      ))}
                      <p className="text-xs text-muted-foreground pt-1">
                        Click "Edit Profile" to manage organizations
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false)
                          setNewOrganization(null)
                          // Reset to original values
                          if (user) {
                            setFirstName(user.firstName || "")
                            setLastName(user.lastName || "")
                            setEmail(user.email || "")
                          }
                          if (supervisor) {
                            setFirstName(supervisor.firstName || "")
                            setLastName(supervisor.lastName || "")
                            setEmail(supervisor.email || "")
                            // Reset organizations
                            if (supervisor.organizations && Array.isArray(supervisor.organizations)) {
                              const orgs = supervisor.organizations.map((org: any) => ({
                                id: typeof org === 'string' ? org : org._id,
                                name: typeof org === 'string' ? org : org.name
                              }))
                              setSelectedOrganizations(orgs)
                            }
                          }
                        }} 
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="bg-[#0084ff] hover:bg-[#0070e6] text-white"
                        onClick={handleSave}
                        disabled={isSaving || selectedOrganizations.length === 0}
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
                    <Button className="bg-[#0084ff] hover:bg-[#0070e6] text-white" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
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
                  <div className="space-y-1">
                    {supervisorData.organizationNames.map((orgName, index) => (
                      <p key={index} className="font-medium">{orgName}</p>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <Badge variant={supervisorData.isActive ? "default" : "secondary"} className={supervisorData.isActive ? "bg-blue-600" : ""}>
                      {supervisorData.isActive ? "Supervisor Active" : "Supervisor Pending"}
                    </Badge>
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
                  <span>{new Date(supervisorData.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Status</span>
                  <span>{supervisorData.isActive ? "Active" : "Pending"}</span>
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

