'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LoadingSpinner, ErrorState } from '@/components/feedback'
import { apiClient } from '@/lib/api-client'
import { formatDistanceToNow } from 'date-fns'

interface SupervisorActivityDialogProps {
  supervisor: any | null
  isOpen: boolean
  onClose: () => void
}

interface ActivityItem {
  activityType: 'hour_approved' | 'hour_rejected' | 'supervisor_approved' | 'supervisor_rejected' | 'supervisor_created'
  timestamp: string
  supervisor: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  details: any
}

export function SupervisorActivityDialog({ supervisor, isOpen, onClose }: SupervisorActivityDialogProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && supervisor) {
      fetchActivities()
    }
  }, [isOpen, supervisor])

  const fetchActivities = async () => {
    if (!supervisor) return
    
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.get(`/admin/supervisors/activity?limit=50`)
      if (response.success && response.data) {
        // Filter activities for this specific supervisor
        const supervisorActivities = response.data.filter(
          (activity: ActivityItem) => activity.supervisor.id === supervisor._id
        )
        setActivities(supervisorActivities)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch supervisor activity')
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'hour_approved':
        return '✅'
      case 'hour_rejected':
        return '❌'
      case 'supervisor_approved':
        return '👤✅'
      case 'supervisor_rejected':
        return '👤❌'
      case 'supervisor_created':
        return '👤➕'
      default:
        return '📝'
    }
  }

  const getActivityTypeLabel = (activityType: string) => {
    switch (activityType) {
      case 'hour_approved':
        return 'Hour Approved'
      case 'hour_rejected':
        return 'Hour Rejected'
      case 'supervisor_approved':
        return 'Account Approved'
      case 'supervisor_rejected':
        return 'Account Rejected'
      case 'supervisor_created':
        return 'Account Created'
      default:
        return 'Unknown'
    }
  }

  const getActivityDescription = (activity: ActivityItem) => {
    switch (activity.activityType) {
      case 'hour_approved':
        return `Approved hours for ${activity.details.studentName} (${activity.details.hours}h)`
      case 'hour_rejected':
        return `Rejected hours for ${activity.details.studentName} (${activity.details.hours}h)`
      case 'supervisor_approved':
        return `Account approved by ${activity.details.adminName}`
      case 'supervisor_rejected':
        return `Account rejected by ${activity.details.adminName}`
      case 'supervisor_created':
        return 'Account created (pending approval)'
      default:
        return 'Unknown activity'
    }
  }

  const getActivityBadgeVariant = (activityType: string) => {
    switch (activityType) {
      case 'hour_approved':
        return 'default' // Green
      case 'hour_rejected':
        return 'destructive' // Red
      case 'supervisor_approved':
        return 'secondary' // Blue
      case 'supervisor_rejected':
        return 'outline' // Gray
      case 'supervisor_created':
        return 'default' // Purple (we'll use custom styling)
      default:
        return 'outline'
    }
  }

  const getActivityBadgeStyle = (activityType: string) => {
    switch (activityType) {
      case 'hour_approved':
        return 'bg-green-500 text-white border-green-600'
      case 'hour_rejected':
        return 'bg-red-500 text-white border-red-600'
      case 'supervisor_approved':
        return 'bg-blue-500 text-white border-blue-600'
      case 'supervisor_rejected':
        return 'bg-gray-500 text-white border-gray-600'
      case 'supervisor_created':
        return 'bg-purple-500 text-white border-purple-600'
      default:
        return 'bg-gray-500 text-white border-gray-600'
    }
  }

  if (!supervisor) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Supervisor Activity</DialogTitle>
          <DialogDescription>
            Recent activity for {supervisor.firstName} {supervisor.lastName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={fetchActivities} />
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity found for this supervisor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[140px]">Type</TableHead>
                    <TableHead className="w-[140px]">Time</TableHead>
                    <TableHead className="w-[100px]">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-sm">
                            {getActivityDescription(activity)}
                          </p>
                          {activity.details.reason && (
                            <p className="text-xs text-muted-foreground">
                              <strong>Reason:</strong> {activity.details.reason}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getActivityBadgeVariant(activity.activityType)} 
                          className={`text-xs ${getActivityBadgeStyle(activity.activityType)}`}
                        >
                          {getActivityTypeLabel(activity.activityType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
