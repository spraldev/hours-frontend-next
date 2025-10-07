'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Clock } from 'lucide-react'

interface RecentActivityCardProps {
  hours: any[]
}

export function RecentActivityCard({ hours }: RecentActivityCardProps) {
  const recentHours = hours
    .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
    .slice(0, 5)

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest service hours and system activity</CardDescription>
      </CardHeader>
      <CardContent>
        {recentHours.length > 0 ? (
          <div className="space-y-3">
            {recentHours.map((hour) => {
              const student = typeof hour.student === 'string' ? null : hour.student
              const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
              const orgName =
                typeof hour.organization === 'string'
                  ? hour.organization
                  : (hour.organization as any)?.name || 'Unknown'

              return (
                <div key={hour._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="font-medium">{studentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {orgName} • {hour.hours}h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={hour.status === 'approved' ? 'default' : hour.status === 'pending' ? 'secondary' : 'destructive'}
                      className="capitalize"
                    >
                      {hour.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(hour.createdAt || hour.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
