'use client'

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Clock } from 'lucide-react'
import { HoursTableRow } from './HoursTableRow'

interface HoursTableProps {
  hours: any[]
  selectedHours: string[]
  onSelectHour: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onEditHour: (hour: any) => void
  onDeleteHour: (hour: any) => void
  isProcessing: boolean
}

export function HoursTable({
  hours,
  selectedHours,
  onSelectHour,
  onSelectAll,
  onEditHour,
  onDeleteHour,
  isProcessing,
}: HoursTableProps) {
  if (hours.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hours found</h3>
        <p className="text-muted-foreground text-pretty">Try adjusting your filters to see more results.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedHours.length === hours.length && hours.length > 0}
                onCheckedChange={onSelectAll}
                disabled={isProcessing}
              />
            </TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hours.map((entry) => (
            <HoursTableRow
              key={entry._id}
              entry={entry}
              isSelected={selectedHours.includes(entry._id)}
              onSelect={(checked) => onSelectHour(entry._id, checked)}
              onEdit={() => onEditHour(entry)}
              onDelete={() => onDeleteHour(entry)}
              isProcessing={isProcessing}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
