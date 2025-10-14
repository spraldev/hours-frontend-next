'use client'

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { XCircle } from 'lucide-react'

interface BulkRejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  rejectionReason: string
  onReasonChange: (reason: string) => void
  onReject: () => void
}

export function BulkRejectDialog({
  open,
  onOpenChange,
  selectedCount,
  rejectionReason,
  onReasonChange,
  onReject,
}: BulkRejectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <XCircle className="mr-2 h-4 w-4" />
          Reject ({selectedCount})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Selected Entries</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting these {selectedCount} entries.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea id="rejection-reason" placeholder="Please provide more documentation or clarify the activities performed..." value={rejectionReason} onChange={(e) => onReasonChange(e.target.value)} className="min-h-[100px]" />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onReject} disabled={!rejectionReason.trim()}>
              Reject Entries
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
