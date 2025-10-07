'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Shield } from 'lucide-react'

interface AdminsTabProps {
  admins: any[]
  onCreateAdmin: () => void
  onEditAdmin: (admin: any) => void
  isProcessing: boolean
}

export function AdminsTab({ admins, onCreateAdmin, onEditAdmin, isProcessing }: AdminsTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Administrators</CardTitle>
            <CardDescription>Manage system administrators and their permissions ({admins.length} total)</CardDescription>
          </div>
          <Button onClick={onCreateAdmin} className="bg-[#0084ff] hover:bg-[#0070e6] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Admin
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {admins.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No administrators found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Administrator</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white text-xs">
                            {admin.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{admin.username}</p>
                      </div>
                    </TableCell>
                    <TableCell>{admin.email || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={admin.role === 'superadmin' ? 'default' : 'secondary'} className="capitalize">
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => onEditAdmin(admin)} disabled={isProcessing}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
