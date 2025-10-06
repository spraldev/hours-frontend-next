"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientCard } from "@/components/ui/gradient-card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckCircle, XCircle, Clock, Users, AlertTriangle, TrendingUp, Eye, Loader2, AlertCircle as AlertCircleIcon, Search, Download, MoreVertical, Edit, Trash2 } from "lucide-react"
import { useSupervisorDashboard } from "@/hooks/useSupervisorDashboard"
import { useAuth } from "@/contexts/AuthContext"
import toast from "react-hot-toast"
import { Hour } from "@/types/api"

export default function SupervisorDashboard() {
  const { user } = useAuth()
  const { supervisor, pendingHours, allHours, loading, error, updateHourStatus, deleteHour, refetch } = useSupervisorDashboard()
  const [selectedEntries, setSelectedEntries] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<"approve" | "reject" | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [individualRejectionReason, setIndividualRejectionReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingHour, setEditingHour] = useState<Hour | null>(null)
  const [deleteConfirmHour, setDeleteConfirmHour] = useState<Hour | null>(null)
  const [editStatus, setEditStatus] = useState<"approved" | "pending" | "rejected">("pending")
  const [editRejectionReason, setEditRejectionReason] = useState("")

  const handleSelectEntry = (entryId: string, checked: boolean) => {
    if (checked) {
      setSelectedEntries([...selectedEntries, entryId])
    } else {
      setSelectedEntries(selectedEntries.filter((id) => id !== entryId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEntries(pendingHours.map((entry) => entry._id))
    } else {
      setSelectedEntries([])
    }
  }

  const handleBulkApprove = async () => {
    setIsSubmitting(true)
    try {
      await Promise.all(selectedEntries.map(id => updateHourStatus(id, "approved")))
      toast.success(`${selectedEntries.length} entries approved`)
      setSelectedEntries([])
      await refetch()
    } catch (err: any) {
      toast.error(err.message || "Failed to approve entries")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBulkReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    setIsSubmitting(true)
    try {
      await Promise.all(selectedEntries.map(id => updateHourStatus(id, "rejected", rejectionReason)))
      toast.success(`${selectedEntries.length} entries rejected`)
      setSelectedEntries([])
      setRejectionReason("")
      setBulkAction(null)
      await refetch()
    } catch (err: any) {
      toast.error(err.message || "Failed to reject entries")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleIndividualApprove = async (entryId: string) => {
    setIsSubmitting(true)
    try {
      await updateHourStatus(entryId, "approved")
      toast.success("Entry approved successfully")
      await refetch()
    } catch (err: any) {
      toast.error(err.message || "Failed to approve entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleIndividualReject = async (entryId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    setIsSubmitting(true)
    try {
      await updateHourStatus(entryId, "rejected", reason)
      toast.success("Entry rejected successfully")
      setIndividualRejectionReason("")
      await refetch()
    } catch (err: any) {
      toast.error(err.message || "Failed to reject entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const filteredAllHours = allHours.filter((entry) => {
    const student = typeof entry.student === 'string' ? null : entry.student
    const studentName = student ? `${student.firstName} ${student.lastName}` : ''
    const orgName = typeof entry.organization === 'string' ? entry.organization : (entry.organization as any)?.name || ''
    
    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const exportToCSV = () => {
    if (filteredAllHours.length === 0) {
      toast.error("No data to export")
      return
    }

    // CSV Headers
    const headers = ["Date", "Student", "Organization", "Hours", "Status", "Description"]
    
    // CSV Rows
    const rows = filteredAllHours.map((entry) => {
      const student = typeof entry.student === 'string' ? null : entry.student
      const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown'
      const orgName = typeof entry.organization === 'string' ? entry.organization : (entry.organization as any)?.name || 'Unknown'
      const date = new Date(entry.date).toLocaleDateString()
      
      return [
        date,
        `"${studentName}"`,
        `"${orgName}"`,
        entry.hours,
        entry.status,
        `"${entry.description.replace(/"/g, '""')}"` // Escape quotes in description
      ]
    })

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n")

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    
    link.setAttribute("href", url)
    link.setAttribute("download", `supervised-hours-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("CSV exported successfully")
  }

  const handleEditClick = (hour: Hour) => {
    setEditingHour(hour)
    setEditStatus(hour.status)
    setEditRejectionReason("")
  }

  const handleEditSubmit = async () => {
    if (!editingHour) return

    if (editStatus === "rejected" && !editRejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    setIsSubmitting(true)
    try {
      await updateHourStatus(
        editingHour._id, 
        editStatus, 
        editStatus === "rejected" ? editRejectionReason : undefined
      )
      toast.success("Hour status updated successfully")
      setEditingHour(null)
      setEditRejectionReason("")
      await refetch()
    } catch (err: any) {
      toast.error(err.message || "Failed to update hour status")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmHour) return

    setIsSubmitting(true)
    try {
      await deleteHour(deleteConfirmHour._id)
      toast.success("Hour entry deleted successfully")
      setDeleteConfirmHour(null)
      await refetch()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete hour entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AppShell userRole="supervisor">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-[#0084ff]" />
        </div>
      </AppShell>
    )
  }

  if (error) {
    return (
      <AppShell userRole="supervisor">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <AlertCircleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </AppShell>
    )
  }

  const supervisorName = user ? `${user.firstName} ${user.lastName}` : (supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Supervisor')
  const organizationName = (supervisor?.organization as any)?.name || 'Organization'
  const approvedThisWeek = allHours.filter(h => {
    if (h.status !== 'approved') return false
    const approvedDate = h.approvedAt ? new Date(h.approvedAt) : null
    if (!approvedDate) return false
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return approvedDate >= weekAgo
  }).reduce((sum, h) => sum + h.hours, 0)

  const uniqueStudents = new Set(allHours.map(h => typeof h.student === 'string' ? h.student : (h.student as any)?._id).filter(Boolean)).size

  return (
    <AppShell userRole="supervisor">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-8">
          <GradientCard variant="hero" className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white text-lg">
                    {supervisorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-balance">Welcome, {supervisorName}</h1>
                  <p className="text-muted-foreground">{organizationName} • Supervisor</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#0084ff]">{pendingHours.length}</div>
                <p className="text-sm text-muted-foreground">pending approvals</p>
              </div>
            </div>
          </GradientCard>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GradientCard variant="stat" className="p-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-orange-500">{pendingHours.length}</div>
                  <p className="text-xs text-muted-foreground">awaiting review</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500/60" />
              </div>
            </CardContent>
          </GradientCard>

          <Card className="p-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved This Week</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-500">{approvedThisWeek}</div>
                  <p className="text-xs text-muted-foreground">hours approved</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Students</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{uniqueStudents}</div>
                  <p className="text-xs text-muted-foreground">volunteering</p>
                </div>
                <Users className="h-8 w-8 text-blue-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-[#0084ff]">{allHours.reduce((sum, h) => sum + h.hours, 0)}</div>
                  <p className="text-xs text-muted-foreground">supervised</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#0084ff]/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="queue" className="w-full">
          <TabsList>
            <TabsTrigger value="queue">Approval Queue</TabsTrigger>
            <TabsTrigger value="all">All Hours</TabsTrigger>
          </TabsList>

          {/* Approval Queue Tab */}
          <TabsContent value="queue">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Approval Queue</CardTitle>
                    <CardDescription>Review and approve student service hour submissions</CardDescription>
                  </div>
                  {selectedEntries.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Button onClick={handleBulkApprove} className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve ({selectedEntries.length})
                      </Button>
                      <Dialog open={bulkAction === "reject"} onOpenChange={(open) => setBulkAction(open ? "reject" : null)}>
                        <DialogTrigger asChild>
                          <Button variant="destructive">
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject ({selectedEntries.length})
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Selected Entries</DialogTitle>
                            <DialogDescription>
                              Please provide a reason for rejecting these {selectedEntries.length} entries. Students will
                              receive this feedback.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="rejection-reason">Rejection Reason</Label>
                              <Textarea
                                id="rejection-reason"
                                placeholder="Please provide more documentation or clarify the activities performed..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setBulkAction(null)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={handleBulkReject} disabled={!rejectionReason.trim()}>
                                Reject Entries
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
            {pendingHours.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground text-pretty">
                  No pending approvals at the moment. Great job staying on top of student submissions!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Select All */}
                <div className="flex items-center space-x-2 pb-2 border-b">
                  <Checkbox
                    checked={selectedEntries.length === pendingHours.length}
                    onCheckedChange={handleSelectAll}
                    disabled={isSubmitting}
                  />
                  <Label className="text-sm font-medium">Select all ({pendingHours.length} entries)</Label>
                </div>

                {/* Entries */}
                {pendingHours.map((entry) => {
                  const student = typeof entry.student === 'string' ? null : entry.student
                  const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
                  const studentEmail = student?.email || 'N/A'
                  const studentGrade = student?.grade ? `Grade ${student.grade}` : 'N/A'

                  return (
                    <div
                      key={entry._id}
                      className={`p-4 rounded-lg border transition-colors ${
                        selectedEntries.includes(entry._id) ? "bg-[#0084ff]/5 border-[#0084ff]/20" : "bg-card/50"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          checked={selectedEntries.includes(entry._id)}
                          onCheckedChange={(checked) => handleSelectEntry(entry._id, checked as boolean)}
                          disabled={isSubmitting}
                        />

                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white">
                            {studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-balance">{studentName}</h4>
                              <p className="text-sm text-muted-foreground">
                                {studentGrade} • {studentEmail}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-[#0084ff]">{entry.hours}h</div>
                              <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground text-pretty mb-3">{entry.description}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                Submitted {getTimeAgo(entry.createdAt || entry.date)}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleIndividualApprove(entry._id)}
                                disabled={isSubmitting}
                              >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Approve
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="destructive" disabled={isSubmitting}>
                                    <XCircle className="mr-1 h-3 w-3" />
                                    Reject
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reject Entry</DialogTitle>
                                    <DialogDescription>
                                      Please provide a reason for rejecting this entry from {studentName}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor={`individual-rejection-${entry._id}`}>Rejection Reason</Label>
                                      <Textarea
                                        id={`individual-rejection-${entry._id}`}
                                        placeholder="Please provide more documentation or clarify the activities performed..."
                                        className="min-h-[100px]"
                                        value={individualRejectionReason}
                                        onChange={(e) => setIndividualRejectionReason(e.target.value)}
                                        disabled={isSubmitting}
                                      />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                      <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
                                      <Button 
                                        variant="destructive" 
                                        onClick={() => handleIndividualReject(entry._id, individualRejectionReason)}
                                        disabled={isSubmitting || !individualRejectionReason.trim()}
                                      >
                                        {isSubmitting ? "Rejecting..." : "Reject Entry"}
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Hours Tab */}
          <TabsContent value="all">
            {/* Filters and Search */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Filter Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search students, organizations, or descriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto bg-transparent"
                    onClick={exportToCSV}
                    disabled={filteredAllHours.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* All Hours Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Service Hours</CardTitle>
                <CardDescription>Complete history of all student service hour submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredAllHours.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hours found</h3>
                    <p className="text-muted-foreground text-pretty">
                      {searchTerm || statusFilter !== "all"
                        ? "Try adjusting your filters to see more results."
                        : "No service hours have been submitted yet."}
                    </p>
                  </div>
                ) : (
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
                        {filteredAllHours.map((entry) => {
                          const student = typeof entry.student === 'string' ? null : entry.student
                          const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
                          const studentEmail = student?.email || 'N/A'
                          const orgName = typeof entry.organization === 'string' ? entry.organization : (entry.organization as any)?.name || 'Unknown'
                          
                          return (
                            <TableRow key={entry._id}>
                              <TableCell className="font-medium">{new Date(entry.date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium text-balance">{studentName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {studentEmail}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="font-medium text-balance">{orgName}</p>
                              </TableCell>
                              <TableCell>{entry.hours}h</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    entry.status === "approved"
                                      ? "default"
                                      : entry.status === "pending"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                  className="capitalize"
                                >
                                  {entry.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm text-muted-foreground text-pretty line-clamp-2">
                                  {entry.description}
                                </p>
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
                                    <DropdownMenuItem onClick={() => handleEditClick(entry)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Change Status
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      variant="destructive"
                                      onClick={() => setDeleteConfirmHour(entry)}
                                    >
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
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Hour Status Dialog */}
        <Dialog open={!!editingHour} onOpenChange={(open) => !open && setEditingHour(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Approval Status</DialogTitle>
              <DialogDescription>
                Change the approval status for this service hour entry
              </DialogDescription>
            </DialogHeader>
            {editingHour && (
              <div className="space-y-4">
                {/* Hour Entry Details */}
                <div className="p-4 bg-muted rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Student:</span>
                    <span className="font-medium">
                      {typeof editingHour.student === 'string' || !editingHour.student
                        ? 'Unknown' 
                        : `${editingHour.student.firstName} ${editingHour.student.lastName}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Hours:</span>
                    <span className="font-medium">{editingHour.hours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date:</span>
                    <span className="font-medium">{new Date(editingHour.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Status:</span>
                    <Badge
                      variant={
                        editingHour.status === "approved"
                          ? "default"
                          : editingHour.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className="capitalize"
                    >
                      {editingHour.status}
                    </Badge>
                  </div>
                </div>

                {/* Status Selection */}
                <div className="space-y-2">
                  <Label htmlFor="edit-status">New Status</Label>
                  <Select value={editStatus} onValueChange={(value: "approved" | "pending" | "rejected") => setEditStatus(value)}>
                    <SelectTrigger id="edit-status" disabled={isSubmitting}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rejection Reason (only show if rejected) */}
                {editStatus === "rejected" && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-rejection-reason">Rejection Reason</Label>
                    <Textarea
                      id="edit-rejection-reason"
                      placeholder="Please provide a reason for rejecting this entry..."
                      value={editRejectionReason}
                      onChange={(e) => setEditRejectionReason(e.target.value)}
                      className="min-h-[100px]"
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingHour(null)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Status"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteConfirmHour} onOpenChange={(open) => !open && setDeleteConfirmHour(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this service hour entry.
                {deleteConfirmHour && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <p className="font-medium">{deleteConfirmHour.hours} hours</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(deleteConfirmHour.date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  )
}
