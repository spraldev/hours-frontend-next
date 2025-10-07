'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface PasswordResetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any | null
  newPassword: string
  onPasswordChange: (password: string) => void
  onConfirm: () => void
  isProcessing: boolean
}

export function PasswordResetDialog({
  open,
  onOpenChange,
  user,
  newPassword,
  onPasswordChange,
  onConfirm,
  isProcessing,
}: PasswordResetDialogProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Reset password for {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-new-password">New Password *</Label>
            <Input
              id="reset-new-password"
              type="password"
              placeholder="Enter new password (min 6 characters)"
              value={newPassword}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          <p className="text-sm text-muted-foreground">The user will need to use this new password to log in.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-[#0084ff] hover:bg-[#0070e6] text-white" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
