'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Edit, MoreVertical, Trash2 } from 'lucide-react'

interface HoursTableRowProps {
  entry: any
  isSelected: boolean
  onSelect: (checked: boolean) => void
  onEdit: () => void
  onDelete: () => void
  isProcessing: boolean
}

export function HoursTableRow({ entry, isSelected, onSelect, onEdit, onDelete, isProcessing }: HoursTableRowProps) {
  const student = typeof entry.student === 'string' ? null : entry.student
  const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
  const studentEmail = student?.email || 'N/A'
  const supervisor = typeof entry.supervisor === 'string' ? null : entry.supervisor
  const supervisorName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Unknown'
  const orgName = typeof entry.organization === 'string' ? entry.organization : (entry.organization as any)?.name || 'Unknown'

  return (
    <TableRow>
      <TableCell>
        <Checkbox checked={isSelected} onCheckedChange={onSelect} disabled={isProcessing} />
      </TableCell>
      <TableCell className="font-medium">{new Date(entry.date).toLocaleDateString()}</TableCell>
      <TableCell>
        <div>
          <p className="font-medium text-balance">{studentName}</p>
          <p className="text-sm text-muted-foreground">{studentEmail}</p>
        </div>
      </TableCell>
      <TableCell>
        <p className="font-medium text-balance">{orgName}</p>
      </TableCell>
      <TableCell>
        <p className="text-sm text-balance">{supervisorName}</p>
      </TableCell>
      <TableCell>{entry.hours}h</TableCell>
      <TableCell>
        <Badge
          variant={entry.status === 'approved' ? 'default' : entry.status === 'pending' ? 'secondary' : 'destructive'}
          className="capitalize"
        >
          {entry.status}
        </Badge>
      </TableCell>
      <TableCell>
        <p className="text-sm text-muted-foreground text-pretty line-clamp-2">{entry.description}</p>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isProcessing}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Change Status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
