'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CheckCircle } from 'lucide-react'
import { EmptyApprovalQueue } from './EmptyApprovalQueue'
import { ApprovalQueueEntry } from './ApprovalQueueEntry'
import { BulkRejectDialog } from './BulkRejectDialog'

interface ApprovalQueueTabProps {
  pendingHours: any[]
  selectedEntries: string[]
  isSubmitting: boolean
  bulkAction: 'approve' | 'reject' | null
  rejectionReason: string
  onSelectEntry: (entryId: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onBulkApprove: () => void
  onBulkReject: () => void
  onIndividualApprove: (id: string) => void
  onIndividualReject: (id: string, reason: string) => void
  setBulkAction: (action: 'approve' | 'reject' | null) => void
  setRejectionReason: (reason: string) => void
  getTimeAgo: (date: string) => string
}

export function ApprovalQueueTab({
  pendingHours,
  selectedEntries,
  isSubmitting,
  bulkAction,
  rejectionReason,
  onSelectEntry,
  onSelectAll,
  onBulkApprove,
  onBulkReject,
  onIndividualApprove,
  onIndividualReject,
  setBulkAction,
  setRejectionReason,
  getTimeAgo,
}: ApprovalQueueTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Approval Queue</CardTitle>
            <CardDescription>Review and approve student service hour submissions</CardDescription>
          </div>
          {selectedEntries.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button onClick={onBulkApprove} className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve ({selectedEntries.length})
              </Button>
              <BulkRejectDialog open={bulkAction === 'reject'} onOpenChange={(open) => setBulkAction(open ? 'reject' : null)} selectedCount={selectedEntries.length} rejectionReason={rejectionReason} onReasonChange={setRejectionReason} onReject={onBulkReject} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {pendingHours.length === 0 ? (
          <EmptyApprovalQueue />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b">
              <Checkbox checked={selectedEntries.length === pendingHours.length} onCheckedChange={onSelectAll} disabled={isSubmitting} />
              <Label className="text-sm font-medium">Select all ({pendingHours.length} entries)</Label>
            </div>
            {pendingHours.map((entry) => (
              <ApprovalQueueEntry key={entry._id} entry={entry} isSelected={selectedEntries.includes(entry._id)} isSubmitting={isSubmitting} onSelect={(checked) => onSelectEntry(entry._id, checked)} onApprove={() => onIndividualApprove(entry._id)} onReject={(reason) => onIndividualReject(entry._id, reason)} getTimeAgo={getTimeAgo} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
