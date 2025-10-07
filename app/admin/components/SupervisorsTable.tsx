'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

interface SupervisorsTableProps {
  supervisors: any[]
  onEditSupervisor: (supervisor: any) => void
  isProcessing: boolean
}

export function SupervisorsTable({ supervisors, onEditSupervisor, isProcessing }: SupervisorsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supervisor</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supervisors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No supervisors found
              </TableCell>
            </TableRow>
          ) : (
            supervisors.map((supervisor) => (
              <TableRow key={supervisor._id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white text-xs">
                        {supervisor.firstName[0]}
                        {supervisor.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {supervisor.firstName} {supervisor.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{supervisor.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">
                    {typeof supervisor.organization === 'string'
                      ? supervisor.organization
                      : supervisor.organization?.name || 'Unknown'}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant={supervisor.isApproved ? 'default' : 'secondary'} className="capitalize">
                    {supervisor.isApproved ? 'Approved' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onEditSupervisor(supervisor)} disabled={isProcessing}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
