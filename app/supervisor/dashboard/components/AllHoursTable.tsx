'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit, Trash2 } from 'lucide-react'
import { EmptyAllHours } from './EmptyAllHours'

interface AllHoursTableProps {
  hours: any[]
  searchTerm: string
  statusFilter: string
  onEditClick: (hour: any) => void
  onDeleteClick: (hour: any) => void
}

export function AllHoursTable({ hours, searchTerm, statusFilter, onEditClick, onDeleteClick }: AllHoursTableProps) {
  if (hours.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Service Hours</CardTitle>
          <CardDescription>Complete history of all student service hour submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyAllHours searchTerm={searchTerm} statusFilter={statusFilter} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Service Hours</CardTitle>
        <CardDescription>Complete history of all student service hour submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hours.map((entry) => {
                const student = typeof entry.student === 'string' ? null : entry.student
                const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
                const studentEmail = student?.email || 'N/A'
                const orgName = typeof entry.organization === 'string' ? entry.organization : entry.organization?.name || 'Unknown'

                return (
                  <TableRow key={entry._id}>
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
                    <TableCell>{entry.hours}h</TableCell>
                    <TableCell>
                      <Badge variant={entry.status === 'approved' ? 'default' : entry.status === 'pending' ? 'secondary' : 'destructive'} className="capitalize">
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground text-pretty line-clamp-2">{entry.description}</p>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditClick(entry)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Change Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onClick={() => onDeleteClick(entry)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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
