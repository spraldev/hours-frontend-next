'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { EmptyHoursState } from './EmptyHoursState'

interface Hour {
  _id: string
  date: string
  organization: any
  hours: number
  status: string
  supervisor: any
  description: string
}

interface HoursTableProps {
  hours: Hour[]
  searchTerm: string
  statusFilter: string
}

export function HoursTable({ hours, searchTerm, statusFilter }: HoursTableProps) {
  if (hours.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Hours Log</CardTitle>
          <CardDescription>All your community service entries and their approval status</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyHoursState searchTerm={searchTerm} statusFilter={statusFilter} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Hours Log</CardTitle>
        <CardDescription>All your community service entries and their approval status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supervisor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hours.map((entry) => {
                const orgName = typeof entry.organization === 'string' ? entry.organization : entry.organization?.name || 'Unknown'
                const supervisorName = typeof entry.supervisor === 'string' ? entry.supervisor : entry.supervisor ? `${entry.supervisor.firstName} ${entry.supervisor.lastName}` : 'Unknown'

                return (
                  <TableRow key={entry._id}>
                    <TableCell className="font-medium">{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-balance">{orgName}</p>
                        <p className="text-sm text-muted-foreground text-pretty line-clamp-2">{entry.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{entry.hours}</TableCell>
                    <TableCell>
                      <Badge variant={entry.status === 'approved' ? 'default' : entry.status === 'pending' ? 'secondary' : 'destructive'} className="capitalize">
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{supervisorName}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
