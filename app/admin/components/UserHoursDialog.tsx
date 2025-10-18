'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { CheckCircle, XCircle, Edit, Trash2, Search, Clock } from 'lucide-react'
import { useState } from 'react'
import { PaginationInfo } from '@/types/api'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'

interface UserHoursDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any | null
  userStats: any
  filteredHours: any[]
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: string
  onStatusChange: (status: string) => void
  selectedHours: string[]
  onSelectHour: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onApproveSelected: () => void
  onRejectSelected: (reason: string) => void
  onEditHour: (hour: any) => void
  onDeleteHour: (hour: any) => void
  isProcessing: boolean
  pagination?: PaginationInfo
  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void
  loading?: boolean
}

export function UserHoursDialog({
  open,
  onOpenChange,
  user,
  userStats,
  filteredHours,
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
  isProcessing,
  pagination,
  onPageChange,
  onLimitChange,
  loading = false,
}: UserHoursDialogProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  if (!user) return null

  const handleReject = () => {
    onRejectSelected(rejectionReason)
    setRejectionReason('')
    setShowRejectDialog(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] !max-w-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="flex items-center gap-2">
                {user.firstName} {user.lastName}
                {loading && <LoadingSpinner size="sm" />}
              </DialogTitle>
              <DialogDescription>{user.email}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {loading ? (
            // Loading state for stats
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-center h-16">
                    <LoadingSpinner size="sm" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : userStats ? (
            // Stats data
            <>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{userStats.totalHours}h</div>
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">{userStats.pendingHours}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{userStats.approvedHours}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">{userStats.rejectedHours}</div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </CardContent>
              </Card>
            </>
          ) : (
            // No stats available
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-muted-foreground">-</div>
                  <div className="text-sm text-muted-foreground">
                    {index === 0 ? 'Total Hours' : index === 1 ? 'Pending' : index === 2 ? 'Approved' : 'Rejected'}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Search and Filter Controls */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by description or organization..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusChange} disabled={loading}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedHours.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">{selectedHours.length} selected</span>
            <Button
              onClick={onApproveSelected}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isProcessing}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              onClick={() => setShowRejectDialog(true)}
              size="sm"
              variant="destructive"
              disabled={isProcessing}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        )}

        {/* Reject Dialog */}
        {showRejectDialog && (
          <Card className="mb-4 border-destructive">
            <CardContent className="p-4">
              <div className="space-y-3">
                <h4 className="font-medium">Reject Selected Hours</h4>
                <Input
                  placeholder="Enter rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleReject} variant="destructive" disabled={isProcessing || !rejectionReason.trim()}>
                    Confirm Reject
                  </Button>
                  <Button onClick={() => setShowRejectDialog(false)} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hours Table */}
        {loading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <h3 className="text-lg font-semibold mb-2 mt-4">Loading hours...</h3>
            <p className="text-muted-foreground">Please wait while we fetch the data.</p>
          </div>
        ) : filteredHours.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hours found</h3>
            <p className="text-muted-foreground text-pretty">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'This user has no recorded hours yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedHours.length === filteredHours.length && filteredHours.length > 0}
                      onCheckedChange={(checked) => onSelectAll(!!checked)}
                      disabled={isProcessing}
                    />
                  </TableHead>
                  <TableHead>Date</TableHead>
                  {user.userType === 'student' ? (
                    <>
                      <TableHead>Organization</TableHead>
                      <TableHead>Supervisor</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>Student</TableHead>
                      <TableHead>Organization</TableHead>
                    </>
                  )}
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHours.map((hour) => {
                  const student = typeof hour.student === 'string' ? null : hour.student
                  const supervisor = typeof hour.supervisor === 'string' ? null : hour.supervisor
                  const organization = typeof hour.organization === 'string' ? hour.organization : hour.organization?.name

                  return (
                    <TableRow key={hour._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedHours.includes(hour._id)}
                          onCheckedChange={(checked) => onSelectHour(hour._id, !!checked)}
                          disabled={isProcessing}
                        />
                      </TableCell>
                      <TableCell>{new Date(hour.date).toLocaleDateString()}</TableCell>
                      {user.userType === 'student' ? (
                        <>
                          <TableCell>{organization || 'Unknown'}</TableCell>
                          <TableCell>
                            {supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Unknown'}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>
                            {student ? `${student.firstName} ${student.lastName}` : 'Unknown'}
                          </TableCell>
                          <TableCell>{organization || 'Unknown'}</TableCell>
                        </>
                      )}
                      <TableCell>
                        <span className="font-medium">{hour.hours}h</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(hour.status)}>{hour.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={hour.description}>
                          {hour.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditHour(hour)}
                            disabled={isProcessing}
                            title="Edit status"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteHour(hour)}
                            disabled={isProcessing}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Pagination Controls */}
        {pagination && onPageChange && onLimitChange && (
          <PaginationControls
            pagination={pagination}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
            loading={loading}
            showItemsPerPage={true}
            showJumpToPage={true}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}



