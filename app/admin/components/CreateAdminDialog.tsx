'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface CreateAdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  username: string
  password: string
  email: string
  role: string
  onUsernameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onEmailChange: (value: string) => void
  onRoleChange: (value: string) => void
  onCreate: () => void
  isProcessing: boolean
}

export function CreateAdminDialog({
  open,
  onOpenChange,
  username,
  password,
  email,
  role,
  onUsernameChange,
  onPasswordChange,
  onEmailChange,
  onRoleChange,
  onCreate,
  isProcessing,
}: CreateAdminDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Administrator</DialogTitle>
          <DialogDescription>Create a new administrator account with the specified role and permissions</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-admin-username">Username *</Label>
            <Input
              id="create-admin-username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-admin-password">Password *</Label>
            <Input
              id="create-admin-password"
              type="password"
              placeholder="Enter password (min 8 characters)"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-admin-email">Email</Label>
            <Input
              id="create-admin-email"
              type="email"
              placeholder="Enter email (optional)"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-admin-role">Role</Label>
            <Select value={role} onValueChange={onRoleChange} disabled={isProcessing}>
              <SelectTrigger id="create-admin-role">
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
          <Button onClick={onCreate} className="bg-[#0084ff] hover:bg-[#0070e6] text-white" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Administrator'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
