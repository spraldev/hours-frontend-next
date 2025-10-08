'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

interface EditHourStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hour: any | null
  newStatus: 'approved' | 'pending' | 'rejected'
  rejectionReason: string
  onStatusChange: (status: 'approved' | 'pending' | 'rejected') => void
  onReasonChange: (reason: string) => void
  onSubmit: () => void
  isProcessing: boolean
}

export function EditHourStatusDialog({
  open,
  onOpenChange,
  hour,
  newStatus,
  rejectionReason,
  onStatusChange,
  onReasonChange,
  onSubmit,
  isProcessing,
}: EditHourStatusDialogProps) {
  if (!hour) return null

  const studentName =
    typeof hour.student === 'string' || !hour.student
      ? 'Unknown'
      : `${hour.student.firstName} ${hour.student.lastName}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Hour Status</DialogTitle>
          <DialogDescription>Change the approval status of this service hour entry</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Student:</span>
                <p className="font-medium">{studentName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Hours:</span>
                <p className="font-medium">{hour.hours}h</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>
                <p className="font-medium">{new Date(hour.date).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Current Status:</span>
                <Badge variant={hour.status === 'approved' ? 'default' : hour.status === 'pending' ? 'secondary' : 'destructive'} className="capitalize">
                  {hour.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-hour-status">New Status</Label>
            <Select value={newStatus} onValueChange={(value: 'approved' | 'pending' | 'rejected') => onStatusChange(value)}>
              <SelectTrigger id="edit-hour-status" disabled={isProcessing}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newStatus === 'rejected' && (
            <div className="space-y-2">
              <Label htmlFor="edit-hour-rejection-reason">Rejection Reason</Label>
              <Textarea
                id="edit-hour-rejection-reason"
                placeholder="Please provide a reason for rejecting this entry..."
                value={rejectionReason}
                onChange={(e) => onReasonChange(e.target.value)}
                className="min-h-[100px]"
                disabled={isProcessing}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={onSubmit} className="bg-[#0084ff] hover:bg-[#0070e6] text-white" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
