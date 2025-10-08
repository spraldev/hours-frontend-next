'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface EditAdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admin: any | null
  onUpdateField: (field: string, value: any) => void
  onSave: () => void
  isProcessing: boolean
}

export function EditAdminDialog({ open, onOpenChange, admin, onUpdateField, onSave, isProcessing }: EditAdminDialogProps) {
  if (!admin) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Administrator</DialogTitle>
          <DialogDescription>Update administrator information and settings</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-admin-username">Username *</Label>
            <Input
              id="edit-admin-username"
              value={admin.username}
              onChange={(e) => onUpdateField('username', e.target.value)}
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-admin-email">Email</Label>
            <Input
              id="edit-admin-email"
              type="email"
              value={admin.email || ''}
              onChange={(e) => onUpdateField('email', e.target.value)}
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-admin-role">Role</Label>
            <Select value={admin.role} onValueChange={(value) => onUpdateField('role', value)} disabled={isProcessing}>
              <SelectTrigger id="edit-admin-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
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
