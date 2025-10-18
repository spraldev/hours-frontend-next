'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Clock } from 'lucide-react'

interface StatisticsTabProps {
  students: any[]
  supervisors: any[]
  hours: any[]
  organizations: any[]
}

export function StatisticsTab({ students, supervisors, hours, organizations }: StatisticsTabProps) {
  // Add defensive programming to handle undefined/null props
  const safeStudents = students || []
  const safeSupervisors = supervisors || []
  const safeHours = hours || []
  const safeOrganizations = organizations || []
  
  const activeStudents = safeStudents.filter((s) => s.isActive).length
  const activeSupervisors = safeSupervisors.filter((s) => s.isActive).length
  const activeOrganizations = safeOrganizations.filter((o) => o.isActive).length
  const totalHours = safeHours.reduce((sum, h) => sum + h.hours, 0)
  const approvedHours = safeHours.filter((h) => h.status === 'approved').reduce((sum, h) => sum + h.hours, 0)
  const pendingHours = safeHours.filter((h) => h.status === 'pending').reduce((sum, h) => sum + h.hours, 0)
  const approvalRate = safeHours.length > 0 ? Math.round((safeHours.filter((h) => h.status === 'approved').length / safeHours.length) * 100) : 0
  const avgHoursPerStudent = safeStudents.length > 0 ? Math.round((approvedHours / safeStudents.length) * 10) / 10 : 0

  // Calculate hours per graduation year (class)
  const hoursByClass = safeStudents.reduce((acc, student) => {
    const graduationYear = student.graduatingYear
    const classKey = `Class of ${graduationYear}`
    
    if (!acc[classKey]) {
      acc[classKey] = {
        year: graduationYear,
        students: 0,
        totalHours: 0,
        approvedHours: 0
      }
    }
    
    acc[classKey].students++
    
    // Calculate hours for this student
    const studentHours = safeHours.filter(hour => {
      const hourStudent = typeof hour.student === 'string' ? hour.student : hour.student?._id
      return hourStudent === student._id
    })
    
    const studentTotalHours = studentHours.reduce((sum, h) => sum + h.hours, 0)
    const studentApprovedHours = studentHours
      .filter(h => h.status === 'approved')
      .reduce((sum, h) => sum + h.hours, 0)
    
    acc[classKey].totalHours += studentTotalHours
    acc[classKey].approvedHours += studentApprovedHours
    
    return acc
  }, {} as Record<string, { year: number; students: number; totalHours: number; approvedHours: number }>)

  // Sort classes by year
  const sortedClasses = Object.entries(hoursByClass)
    .sort(([, a], [, b]) => a.year - b.year)

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
              <div className="text-3xl font-bold text-[#0084ff]">{safeStudents.length + safeSupervisors.length}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
              <div className="text-xs text-muted-foreground mt-1">
                {safeStudents.length} students • {safeSupervisors.length} supervisors
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{activeStudents}</div>
              <div className="text-sm text-muted-foreground">Active Students</div>
              <div className="text-xs text-muted-foreground mt-1">
                {safeStudents.length > 0 ? Math.round((activeStudents / safeStudents.length) * 100) : 0}% of total
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{activeSupervisors}</div>
              <div className="text-sm text-muted-foreground">Active Supervisors</div>
              <div className="text-xs text-muted-foreground mt-1">
                {safeSupervisors.length > 0 ? Math.round((activeSupervisors / safeSupervisors.length) * 100) : 0}% of total
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{safeOrganizations.length}</div>
              <div className="text-sm text-muted-foreground">Organizations</div>
              <div className="text-xs text-muted-foreground mt-1">{activeOrganizations} active</div>
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
              <div className="text-3xl font-bold text-orange-600">{pendingHours}</div>
              <div className="text-sm text-muted-foreground">Pending Hours</div>
              <div className="text-xs text-muted-foreground mt-1">{safeHours.filter((h) => h.status === 'pending').length} entries</div>
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
