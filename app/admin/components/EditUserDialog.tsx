'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any | null
  onUserChange: (user: any) => void
  onSave: () => void
  onResetPassword?: () => void
  isProcessing: boolean
}

export function EditUserDialog({ open, onOpenChange, user, onUserChange, onSave, isProcessing }: EditUserDialogProps) {
  if (!user) return null

  // Determine user type from the user object
  const userType: 'student' | 'supervisor' = user.studentId ? 'student' : 'supervisor'

  // Helper function to update a field
  const onUpdateField = (field: string, value: any) => {
    onUserChange({ ...user, [field]: value })
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
