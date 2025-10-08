'use client'

import React, { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

interface ApprovalQueueEntryProps {
  entry: any
  isSelected: boolean
  isSubmitting: boolean
  onSelect: (checked: boolean) => void
  onApprove: () => void
  onReject: (reason: string) => void
  getTimeAgo: (date: string) => string
}

export function ApprovalQueueEntry({
  entry,
  isSelected,
  isSubmitting,
  onSelect,
  onApprove,
  onReject,
  getTimeAgo,
}: ApprovalQueueEntryProps) {
  const [rejectionReason, setRejectionReason] = useState('')
  const student = typeof entry.student === 'string' ? null : entry.student
  const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
  const studentEmail = student?.email || 'N/A'
  const studentGrade = student?.grade ? `Grade ${student.grade}` : 'N/A'

  const handleReject = () => {
    onReject(rejectionReason)
    setRejectionReason('')
  }

  return (
    <div className={`p-4 rounded-lg border transition-colors ${isSelected ? 'bg-[#0084ff]/5 border-[#0084ff]/20' : 'bg-card/50'}`}>
      <div className="flex items-start space-x-4">
        <Checkbox checked={isSelected} onCheckedChange={onSelect} disabled={isSubmitting} />
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white">
            {studentName.split(' ').map((n) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-balance">{studentName}</h4>
              <p className="text-sm text-muted-foreground">{studentGrade} • {studentEmail}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-[#0084ff]">{entry.hours}h</div>
              <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-pretty mb-3">{entry.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                Submitted {getTimeAgo(entry.createdAt || entry.date)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={onApprove} disabled={isSubmitting}>
                <CheckCircle className="mr-1 h-3 w-3" />
                Approve
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="destructive" disabled={isSubmitting}>
                    <XCircle className="mr-1 h-3 w-3" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Entry</DialogTitle>
                    <DialogDescription>Please provide a reason for rejecting this entry from {studentName}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`individual-rejection-${entry._id}`}>Rejection Reason</Label>
                      <Textarea id={`individual-rejection-${entry._id}`} placeholder="Please provide more documentation or clarify the activities performed..." className="min-h-[100px]" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} disabled={isSubmitting} />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
                      <Button variant="destructive" onClick={handleReject} disabled={isSubmitting || !rejectionReason.trim()}>
                        {isSubmitting ? 'Rejecting...' : 'Reject Entry'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
