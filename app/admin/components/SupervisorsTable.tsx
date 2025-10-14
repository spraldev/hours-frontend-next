'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Eye } from 'lucide-react'

interface SupervisorsTableProps {
  supervisors: any[]
  onEditSupervisor: (supervisor: any) => void
  onViewHours?: (supervisor: any) => void
  isProcessing: boolean
}

export function SupervisorsTable({ supervisors, onEditSupervisor, onViewHours, isProcessing }: SupervisorsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supervisor</TableHead>
            <TableHead>Organizations</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]"></TableHead>
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
                  <div className="flex flex-wrap gap-1">
                    {supervisor.organizationNames && supervisor.organizationNames.length > 0 ? (
                      supervisor.organizationNames.map((orgName: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {orgName}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {typeof supervisor.organization === 'string'
                          ? supervisor.organization
                          : supervisor.organization?.name || 'Unknown'}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={supervisor.isActive ? 'default' : 'secondary'} className="capitalize">
                    {supervisor.isActive ? 'Active' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {onViewHours && (
                      <Button variant="ghost" size="icon" onClick={() => onViewHours(supervisor)} disabled={isProcessing} title="View hours">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => onEditSupervisor(supervisor)} disabled={isProcessing} title="Edit supervisor">
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
