'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchAndStatusFilter } from './SearchAndStatusFilter'
import { SupervisorsTable } from './SupervisorsTable'

interface SupervisorsTabProps {
  supervisors: any[]
  supervisorsPagination: any
  supervisorsLoading: boolean
  supervisorsActions: any
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  onEditSupervisor: (supervisor: any) => void
  onViewHours?: (supervisor: any) => void
  onViewActivity?: (supervisor: any) => void
  isProcessing: boolean
}

export function SupervisorsTab({
  supervisors,
  supervisorsPagination,
  supervisorsLoading,
  supervisorsActions,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onEditSupervisor,
  onViewHours,
  onViewActivity,
  isProcessing,
}: SupervisorsTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Supervisors</CardTitle>
            <CardDescription>
              Manage supervisor accounts and organizations ({supervisorsPagination.total} total)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <SearchAndStatusFilter
          searchValue={searchTerm}
          onSearchChange={onSearchChange}
          statusValue={statusFilter}
          onStatusChange={onStatusChange}
          searchPlaceholder="Search by name or email..."
        />
        <SupervisorsTable 
          supervisors={supervisors} 
          onEditSupervisor={onEditSupervisor} 
          onViewHours={onViewHours} 
          onViewActivity={onViewActivity} 
          isProcessing={isProcessing || supervisorsLoading}
          pagination={supervisorsPagination}
          onPageChange={supervisorsActions.setPage}
          onLimitChange={supervisorsActions.setLimit}
          loading={supervisorsLoading}
        />
      </CardContent>
    </Card>
  )
}
