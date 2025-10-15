'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchAndStatusFilter } from './SearchAndStatusFilter'
import { StudentsTable } from './StudentsTable'

interface StudentsTabProps {
  students: any[]
  searchTerm: string
  onSearchChange: (value: string) => void
  onEditStudent: (student: any) => void
  onViewHours?: (student: any) => void
  isProcessing: boolean
}

export function StudentsTab({ students, searchTerm, onSearchChange, onEditStudent, onViewHours, isProcessing }: StudentsTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Students</CardTitle>
            <CardDescription>Manage student accounts and service hours ({students.length} total)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <SearchAndStatusFilter
          searchValue={searchTerm}
          onSearchChange={onSearchChange}
          statusValue="all"
          onStatusChange={() => {}}
          searchPlaceholder="Search by name, email, or student ID..."
          showStatusFilter={false}
        />
        <StudentsTable students={students} onEditStudent={onEditStudent} onViewHours={onViewHours} isProcessing={isProcessing} />
      </CardContent>
    </Card>
  )
}
