'use client'

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface EditHourDialogProps {
  hour: any | null
  status: 'approved' | 'pending' | 'rejected'
  rejectionReason: string
  isSubmitting: boolean
  onClose: () => void
  onStatusChange: (status: 'approved' | 'pending' | 'rejected') => void
  onReasonChange: (reason: string) => void
  onSubmit: () => void
}

export function EditHourDialog({
  hour,
  status,
  rejectionReason,
  isSubmitting,
  onClose,
  onStatusChange,
  onReasonChange,
  onSubmit,
}: EditHourDialogProps) {
  return (
    <Dialog open={!!hour} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Approval Status</DialogTitle>
          <DialogDescription>Change the approval status for this service hour entry</DialogDescription>
        </DialogHeader>
        {hour && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Student:</span>
                <span className="font-medium">
                  {typeof hour.student === 'string' || !hour.student ? 'Unknown' : `${hour.student.firstName} ${hour.student.lastName}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Hours:</span>
                <span className="font-medium">{hour.hours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="font-medium">{new Date(hour.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current Status:</span>
                <Badge variant={hour.status === 'approved' ? 'default' : hour.status === 'pending' ? 'secondary' : 'destructive'} className="capitalize">
                  {hour.status}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">New Status</Label>
              <Select value={status} onValueChange={onStatusChange}>
                <SelectTrigger id="edit-status" disabled={isSubmitting}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {status === 'rejected' && (
              <div className="space-y-2">
                <Label htmlFor="edit-rejection-reason">Rejection Reason</Label>
                <Textarea id="edit-rejection-reason" placeholder="Please provide a reason for rejecting this entry..." value={rejectionReason} onChange={(e) => onReasonChange(e.target.value)} className="min-h-[100px]" disabled={isSubmitting} />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={onSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
