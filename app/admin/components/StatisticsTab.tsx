'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Clock } from 'lucide-react'

interface StatisticsTabProps {
  overview?: any
  students: any[]
  supervisors: any[]
  hours: any[]
  organizations: any[]
}

export function StatisticsTab({ overview, students, supervisors, hours, organizations }: StatisticsTabProps) {
  // Add defensive programming to handle undefined/null props
  const safeStudents = students || []
  const safeSupervisors = supervisors || []
  const safeHours = hours || []
  const safeOrganizations = organizations || []
  
  // Use overview data for accurate totals
  const totalStudents = overview?.totalStudents ?? 0
  const totalSupervisors = overview?.totalSupervisors ?? 0
  const totalOrganizations = overview?.totalOrganizations ?? 0
  const totalHours = overview?.totalHours ?? 0
  const approvedHours = overview?.approvedHours ?? 0
  const rejectedHours = overview?.rejectedHours ?? 0
  const pendingHoursCount = overview?.pendingHours ?? 0
  
  // Calculate approval rate from overview data
  const totalHourEntries = approvedHours + rejectedHours + pendingHoursCount
  const approvalRate = totalHourEntries > 0 ? Math.round((approvedHours / totalHourEntries) * 100) : 0
  const avgHoursPerStudent = totalStudents > 0 ? Math.round((approvedHours / totalStudents) * 10) / 10 : 0
  
  // For detailed breakdowns, we still need to use the paginated data since overview doesn't provide these
  const activeStudents = safeStudents.filter((s) => s.isActive).length
  const activeSupervisors = safeSupervisors.filter((s) => s.isActive).length
  const activeOrganizations = safeOrganizations.filter((o) => o.isActive).length

  // Use overview data for hours by graduation year if available, otherwise fallback to calculation
  const hoursByGraduatingYear = overview?.hoursByGraduatingYear || []
  const sortedClasses = hoursByGraduatingYear.length > 0 
    ? hoursByGraduatingYear.map(item => [`Class of ${item.year}`, {
        year: item.year,
        students: item.studentCount,
        totalHours: item.totalHours,
        approvedHours: item.totalHours // Assuming overview provides approved hours
      }])
    : []

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            System Objects
          </CardTitle>
          <CardDescription>Overview of all users and organizations in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0084ff]">{totalStudents + totalSupervisors}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
              <div className="text-xs text-muted-foreground mt-1">
                {totalStudents} students • {totalSupervisors} supervisors
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{overview?.pendingSupervisors ?? 0}</div>
              <div className="text-sm text-muted-foreground">Pending Supervisors</div>
              <div className="text-xs text-muted-foreground mt-1">
                awaiting approval
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totalSupervisors}</div>
              <div className="text-sm text-muted-foreground">Total Supervisors</div>
              <div className="text-xs text-muted-foreground mt-1">
                {overview?.pendingSupervisors ?? 0} pending approval
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{totalOrganizations}</div>
              <div className="text-sm text-muted-foreground">Organizations</div>
              <div className="text-xs text-muted-foreground mt-1">{rejectedHours} rejected hours</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Community Service Hours
          </CardTitle>
          <CardDescription>Overview of all service hours tracked in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{totalHours}</div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
              <div className="text-xs text-muted-foreground mt-1">{safeHours.length} entries submitted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{approvedHours}</div>
              <div className="text-sm text-muted-foreground">Approved Hours</div>
              <div className="text-xs text-muted-foreground mt-1">{approvalRate}% approval rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{pendingHoursCount}</div>
              <div className="text-sm text-muted-foreground">Pending Hours</div>
              <div className="text-xs text-muted-foreground mt-1">{pendingHoursCount} entries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{avgHoursPerStudent}</div>
              <div className="text-sm text-muted-foreground">Avg Hours/Student</div>
              <div className="text-xs text-muted-foreground mt-1">Based on approved hours</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Hours per Class
          </CardTitle>
          <CardDescription>Community service hours breakdown by graduation year</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedClasses.map(([classKey, data]) => (
                <div key={classKey} className="border rounded-lg p-4 bg-muted/30">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-[#0084ff] mb-2">{classKey}</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Students:</span>
                        <span className="font-medium">{data.students}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Hours:</span>
                        <span className="font-medium">{data.totalHours}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Approved Hours:</span>
                        <span className="font-medium text-green-600">{data.approvedHours}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Avg per Student:</span>
                        <span className="font-medium text-indigo-600">
                          {data.students > 0 ? Math.round((data.approvedHours / data.students) * 10) / 10 : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No student data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
