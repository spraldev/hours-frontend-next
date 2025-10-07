'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

interface BulkRejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  rejectionReason: string
  onReasonChange: (reason: string) => void
  onConfirm: () => void
  isProcessing: boolean
}

export function BulkRejectDialog({
  open,
  onOpenChange,
  selectedCount,
  rejectionReason,
  onReasonChange,
  onConfirm,
  isProcessing,
}: BulkRejectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Reject Hours</DialogTitle>
          <DialogDescription>
            You are about to reject {selectedCount} hour {selectedCount === 1 ? 'entry' : 'entries'}. Please provide a reason.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bulk-reject-reason">Rejection Reason *</Label>
            <Textarea
              id="bulk-reject-reason"
              placeholder="Please provide a reason for rejecting these entries..."
              value={rejectionReason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="min-h-[120px]"
              disabled={isProcessing}
            />
          </div>
          <p className="text-sm text-muted-foreground">This reason will be sent to the students for all selected entries.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="destructive" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              `Reject ${selectedCount} ${selectedCount === 1 ? 'Entry' : 'Entries'}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
