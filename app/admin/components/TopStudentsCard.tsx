'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users } from 'lucide-react'

interface TopStudentsCardProps {
  students: any[]
  hours: any[]
}

export function TopStudentsCard({ students, hours }: TopStudentsCardProps) {
  // Calculate total approved hours for each student from the hours data
  const studentsWithCalculatedHours = students.map(student => {
    const studentHours = hours.filter(hour => {
      const studentId = typeof hour.student === 'string' ? hour.student : hour.student?._id
      return studentId === student._id && hour.status === 'approved'
    })
    
    const totalApprovedHours = studentHours.reduce((sum, hour) => sum + (hour.hours || 0), 0)
    
    return {
      ...student,
      calculatedTotalHours: totalApprovedHours
    }
  })

  const topStudents = studentsWithCalculatedHours
    .filter((s) => s.calculatedTotalHours > 0)
    .sort((a, b) => b.calculatedTotalHours - a.calculatedTotalHours)
    .slice(0, 5)

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Top Students by Hours
        </CardTitle>
        <CardDescription>Students with the most approved community service hours</CardDescription>
      </CardHeader>
      <CardContent>
        {students.length > 0 ? (
          <div className="space-y-3">
            {topStudents.length > 0 ? (
              topStudents.map((student, index) => (
                <div key={student._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Grade {student.grade} • Class of {student.graduatingYear}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{student.calculatedTotalHours}h</p>
                    <p className="text-xs text-muted-foreground">total hours</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No students with hours yet</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No students found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
