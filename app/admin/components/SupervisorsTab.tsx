'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchAndStatusFilter } from './SearchAndStatusFilter'
import { SupervisorsTable } from './SupervisorsTable'

interface SupervisorsTabProps {
  supervisors: any[]
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  onEditSupervisor: (supervisor: any) => void
  onViewHours?: (supervisor: any) => void
  isProcessing: boolean
}

export function SupervisorsTab({
  supervisors,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onEditSupervisor,
  onViewHours,
  isProcessing,
}: SupervisorsTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Supervisors</CardTitle>
            <CardDescription>Manage supervisor accounts and organizations ({supervisors.length} total)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <SearchAndStatusFilter
          searchValue={searchTerm}
          onSearchChange={onSearchChange}
          statusValue={statusFilter}
          onStatusChange={onStatusChange}
          searchPlaceholder="Search supervisors..."
        />
        <SupervisorsTable supervisors={supervisors} onEditSupervisor={onEditSupervisor} onViewHours={onViewHours} isProcessing={isProcessing} />
      </CardContent>
    </Card>
  )
}
