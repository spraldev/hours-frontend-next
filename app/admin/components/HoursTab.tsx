'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'
import { HoursFiltersBar } from './HoursFiltersBar'
import { HoursTable } from './HoursTable'

interface HoursTabProps {
  hours: any[]
  allHours: any[]
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  selectedHours: string[]
  onSelectHour: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onApproveSelected: () => void
  onRejectSelected: () => void
  onEditHour: (hour: any) => void
  onDeleteHour: (hour: any) => void
  onExportCSV: () => void
  isProcessing: boolean
}

export function HoursTab({
  hours,
  allHours,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  selectedHours,
  onSelectHour,
  onSelectAll,
  onApproveSelected,
  onRejectSelected,
  onEditHour,
  onDeleteHour,
  onExportCSV,
  isProcessing,
}: HoursTabProps) {
  return (
    <>
      <HoursFiltersBar
        searchValue={searchTerm}
        onSearchChange={onSearchChange}
        statusValue={statusFilter}
        onStatusChange={onStatusChange}
        onExportCSV={onExportCSV}
        hoursCount={hours.length}
      />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Service Hours</CardTitle>
              <CardDescription>
                Review, approve, and manage all service hour entries ({hours.length} of {allHours.length} total)
              </CardDescription>
            </div>
            {selectedHours.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button onClick={onApproveSelected} className="bg-green-600 hover:bg-green-700 text-white" disabled={isProcessing}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve ({selectedHours.length})
                </Button>
                <Button onClick={onRejectSelected} variant="destructive" disabled={isProcessing}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject ({selectedHours.length})
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <HoursTable
            hours={hours}
            selectedHours={selectedHours}
            onSelectHour={onSelectHour}
            onSelectAll={(checked) => onSelectAll(checked)}
            onEditHour={onEditHour}
            onDeleteHour={onDeleteHour}
            isProcessing={isProcessing}
          />
        </CardContent>
      </Card>
    </>
  )
}
