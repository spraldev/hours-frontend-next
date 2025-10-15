'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { OrganizationSelector } from '@/components/ui/organization-selector'
import { Loader2 } from 'lucide-react'

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any | null
  onUserChange: (user: any) => void
  onSave: () => void
  onResetPassword?: () => void
  onUpdateSupervisorOrganizations?: (organizations: any[]) => void
  isProcessing: boolean
}

export function EditUserDialog({ open, onOpenChange, user, onUserChange, onSave, onUpdateSupervisorOrganizations, isProcessing }: EditUserDialogProps) {
  if (!user) return null

  // Determine user type from the user object
  const userType: 'student' | 'supervisor' = user.studentId ? 'student' : 'supervisor'

  // Helper function to update a field
  const onUpdateField = (field: string, value: any) => {
    onUserChange({ ...user, [field]: value })
  }

  // Helper function to get current organizations for supervisor
  const getCurrentOrganizations = () => {
    if (userType !== 'supervisor') return []
    
    // If we have selectedOrganizations from the dialog state, use those
    if (user.selectedOrganizations) {
      return user.selectedOrganizations
    }
    
    // Otherwise, build from existing organization data
    const organizations: Array<{ id: string; name: string; verified: boolean }> = []
    if (user.organizations && Array.isArray(user.organizations)) {
      user.organizations.forEach((org: any) => {
        if (typeof org === 'object' && org._id) {
          organizations.push({
            id: org._id,
            name: org.name,
            verified: org.verified
          })
        }
      })
    }
    
    // Fallback to organizationNames if organizations array is empty
    if (organizations.length === 0 && user.organizationNames && Array.isArray(user.organizationNames)) {
      user.organizationNames.forEach((orgName: string) => {
        organizations.push({
          id: `temp-${orgName}`,
          name: orgName,
          verified: false
        })
      })
    }
    
    return organizations
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit {userType === 'student' ? 'Student' : 'Supervisor'}</DialogTitle>
          <DialogDescription>Update {userType} information and settings</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName">First Name *</Label>
              <Input
                id="edit-firstName"
                value={user.firstName}
                onChange={(e) => onUpdateField('firstName', e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastName">Last Name *</Label>
              <Input
                id="edit-lastName"
                value={user.lastName}
                onChange={(e) => onUpdateField('lastName', e.target.value)}
                disabled={isProcessing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              value={user.email}
              onChange={(e) => onUpdateField('email', e.target.value)}
              disabled={isProcessing}
            />
          </div>
          {userType === 'student' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="edit-studentId">Student ID</Label>
                <Input id="edit-studentId" value={user.studentId} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-grade">Grade</Label>
                <Input
                  id="edit-grade"
                  type="number"
                  min="9"
                  max="12"
                  value={user.grade}
                  onChange={(e) => onUpdateField('grade', parseInt(e.target.value))}
                  disabled={isProcessing}
                />
              </div>
            </>
          )}
          {userType === 'supervisor' && (
            <div className="space-y-2">
              <Label>Organizations</Label>
              <div className="space-y-2">
                {getCurrentOrganizations().map((org: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{org.name}</span>
                      {org.verified && (
                        <span className="text-xs text-green-600">✓</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (onUpdateSupervisorOrganizations) {
                          const updatedOrgs = getCurrentOrganizations().filter((_: any, i: number) => i !== index)
                          onUpdateSupervisorOrganizations(updatedOrgs)
                        }
                      }}
                      disabled={isProcessing}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <OrganizationSelector
                  value={null}
                  onChange={(org) => {
                    if (org && onUpdateSupervisorOrganizations) {
                      const currentOrgs = getCurrentOrganizations()
                      const orgExists = currentOrgs.some((existingOrg: any) => existingOrg.id === org.id)
                      if (!orgExists) {
                        onUpdateSupervisorOrganizations([...currentOrgs, org])
                      }
                    }
                  }}
                  placeholder="Add organization..."
                  disabled={isProcessing}
                  allowAddNew={false}
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label htmlFor="edit-isActive">{userType === 'supervisor' ? 'Active Status (Pending if inactive)' : 'Active Status'}</Label>
            <Switch
              id="edit-isActive"
              checked={user.isActive}
              onCheckedChange={(checked) => onUpdateField('isActive', checked)}
              disabled={isProcessing}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-[#0084ff] hover:bg-[#0070e6] text-white" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
