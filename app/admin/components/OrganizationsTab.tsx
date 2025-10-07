'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Building2, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react'

interface OrganizationsTabProps {
  organizations: any[]
  onCreateOrganization: () => void
  onEditOrganization: (org: any) => void
  onDeleteOrganization: (id: string) => void
  isProcessing: boolean
}

export function OrganizationsTab({
  organizations,
  onCreateOrganization,
  onEditOrganization,
  onDeleteOrganization,
  isProcessing,
}: OrganizationsTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Organizations</CardTitle>
            <CardDescription>Manage community service organizations ({organizations.length} total)</CardDescription>
          </div>
          <Button onClick={onCreateOrganization} className="bg-[#0084ff] hover:bg-[#0070e6] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Organization
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {organizations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No organizations found</p>
              <p className="text-sm">Create your first organization to get started</p>
            </div>
          ) : (
            organizations.map((org) => (
              <div key={org._id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white">
                        <Building2 className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{org.name}</h4>
                      <p className="text-sm text-muted-foreground">{org.description || 'No description provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={org.isActive ? 'default' : 'secondary'}>{org.isActive ? 'Active' : 'Inactive'}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isProcessing}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditOrganization(org)} disabled={isProcessing}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteOrganization(org._id)} className="text-red-600" disabled={isProcessing}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Supervisors</div>
                    <div className="font-medium">{typeof org.supervisors === 'object' ? org.supervisors.length : 'Loading...'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Created</div>
                    <div className="font-medium">{new Date(org.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
