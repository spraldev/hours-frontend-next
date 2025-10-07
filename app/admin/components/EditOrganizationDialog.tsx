'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'

interface EditOrganizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organization: any | null
  onUpdateField: (field: string, value: any) => void
  onSave: () => void
  isProcessing: boolean
}

export function EditOrganizationDialog({
  open,
  onOpenChange,
  organization,
  onUpdateField,
  onSave,
  isProcessing,
}: EditOrganizationDialogProps) {
  if (!organization) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
          <DialogDescription>Update organization information and settings</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-org-name">Organization Name *</Label>
            <Input
              id="edit-org-name"
              value={organization.name}
              onChange={(e) => onUpdateField('name', e.target.value)}
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-org-description">Description</Label>
            <Textarea
              id="edit-org-description"
              value={organization.description || ''}
              onChange={(e) => onUpdateField('description', e.target.value)}
              className="min-h-[100px]"
              disabled={isProcessing}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="edit-org-isActive">Active Status</Label>
            <Switch
              id="edit-org-isActive"
              checked={organization.isActive}
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
