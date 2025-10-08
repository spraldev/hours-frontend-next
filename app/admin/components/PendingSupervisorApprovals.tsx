'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

interface PendingSupervisorApprovalsProps {
  pendingSupervisors: any[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  isProcessing: boolean
}

export function PendingSupervisorApprovals({
  pendingSupervisors,
  onApprove,
  onReject,
  isProcessing,
}: PendingSupervisorApprovalsProps) {
  if (pendingSupervisors.length === 0) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Pending Supervisor Approvals</CardTitle>
        <CardDescription>{pendingSupervisors.length} supervisor applications awaiting approval</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingSupervisors.map((supervisor) => (
            <div key={supervisor._id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div>
                <p className="font-medium">
                  {supervisor.firstName} {supervisor.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{supervisor.email}</p>
                <p className="text-sm text-muted-foreground">
                  Organization: {typeof supervisor.organization === 'string' ? supervisor.organization : supervisor.organization?.name || 'Unknown'}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => onApprove(supervisor._id)} disabled={isProcessing}>
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onReject(supervisor._id)} disabled={isProcessing}>
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
