'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Eye } from 'lucide-react'

interface StudentsTableProps {
  students: any[]
  onEditStudent: (student: any) => void
  onViewHours?: (student: any) => void
  isProcessing: boolean
}

export function StudentsTable({ students, onEditStudent, onViewHours, isProcessing }: StudentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Hours</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No students found
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white text-xs">
                        {student.firstName[0]}
                        {student.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>Grade {student.grade}</p>
                    <p className="text-xs text-muted-foreground">Class of {student.graduatingYear}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={student.isActive ? 'default' : 'secondary'} className="capitalize">
                    {student.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{student.totalHours || 0}h</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {onViewHours && (
                      <Button variant="ghost" size="icon" onClick={() => onViewHours(student)} disabled={isProcessing} title="View hours">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => onEditStudent(student)} disabled={isProcessing} title="Edit student">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
