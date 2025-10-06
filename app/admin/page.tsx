"use client"

import React, { useState } from "react"
import { useAdminDashboard } from "@/hooks/useAdminDashboard"
import { useAuth } from "@/contexts/AuthContext"
import toast from "react-hot-toast"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientCard } from "@/components/ui/gradient-card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import {
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Server,
  Shield,
  Activity,
  UserCheck,
  Building2,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  UserPlus,
  Calendar,
  GraduationCap,
  TrendingUp,
  KeyRound,
  X,
  Loader2,
  XCircle,
  MoreVertical,
} from "lucide-react"

export default function AdminDashboard() {
  const { user } = useAuth()
  const {
    overview,
    students,
    supervisors,
    pendingSupervisors,
    hours,
    organizations,
    admins,
    loading,
    error,
    refetch,
    approveSupervisor,
    rejectSupervisor,
    updateStudent,
    deleteStudent,
    resetStudentPassword,
    updateSupervisor,
    deleteSupervisor,
    resetSupervisorPassword,
    approveHour,
    rejectHour,
    deleteHour,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    createAdmin,
    updateAdmin,
    getGraduatedStudents,
    deleteGraduatedStudents,
  } = useAdminDashboard()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedHours, setSelectedHours] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Organization management state
  const [editingOrganization, setEditingOrganization] = useState<any>(null)
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false)
  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false)
  const [newOrgName, setNewOrgName] = useState("")
  const [newOrgDescription, setNewOrgDescription] = useState("")
  
  // Password reset state
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  
  // Hours management state
  const [hoursSearchTerm, setHoursSearchTerm] = useState("")
  const [hoursStatusFilter, setHoursStatusFilter] = useState("all")
  const [editingHour, setEditingHour] = useState<any>(null)
  const [deleteConfirmHour, setDeleteConfirmHour] = useState<any>(null)
  const [editHourStatus, setEditHourStatus] = useState<"approved" | "pending" | "rejected">("pending")
  const [editRejectionReason, setEditRejectionReason] = useState("")
  const [bulkRejectDialogOpen, setBulkRejectDialogOpen] = useState(false)
  const [bulkRejectionReason, setBulkRejectionReason] = useState("")
  
  // Admin management state (superadmin only)
  const [editingAdmin, setEditingAdmin] = useState<any>(null)
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false)
  const [isCreateAdminDialogOpen, setIsCreateAdminDialogOpen] = useState(false)
  const [newAdminUsername, setNewAdminUsername] = useState("")
  const [newAdminPassword, setNewAdminPassword] = useState("")
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [newAdminRole, setNewAdminRole] = useState("admin")
  
  // Delete graduated students state (superadmin only)
  const [isDeleteGraduatedDialogOpen, setIsDeleteGraduatedDialogOpen] = useState(false)
  const [graduatedStudents, setGraduatedStudents] = useState<any[]>([])
  const [isLoadingGraduatedStudents, setIsLoadingGraduatedStudents] = useState(false)
  const [hasGraduatedStudents, setHasGraduatedStudents] = useState(false)
  
  // Active tab state
  const [activeTab, setActiveTab] = useState("overview")

  // Ensure non-superadmins can't access admin management tab
  React.useEffect(() => {
    if (activeTab === 'admins' && user?.role !== 'superadmin') {
      setActiveTab('overview')
    }
  }, [activeTab, user?.role])

  // Check for graduated students on component mount (superadmin only)
  React.useEffect(() => {
    if (user?.role === 'superadmin') {
      checkForGraduatedStudents()
    }
  }, [user?.role])

  const filteredStudents = students.filter((user) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const filteredSupervisors = supervisors.filter((user) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.organization && typeof user.organization === 'object' && user.organization.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.organizationName && user.organizationName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "approved" && user.isApproved) ||
      (statusFilter === "pending" && !user.isApproved && user.isActive) ||
      (statusFilter === "rejected" && !user.isApproved && !user.isActive)
    return matchesSearch && matchesStatus
  })

  const filteredHours = hours.filter((entry) => {
    const student = typeof entry.student === 'string' ? null : entry.student
    const studentName = student ? `${student.firstName} ${student.lastName}` : ''
    const supervisor = typeof entry.supervisor === 'string' ? null : entry.supervisor
    const supervisorName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : ''
    const orgName = typeof entry.organization === 'string' ? entry.organization : (entry.organization as any)?.name || ''
    
    const matchesSearch =
      studentName.toLowerCase().includes(hoursSearchTerm.toLowerCase()) ||
      supervisorName.toLowerCase().includes(hoursSearchTerm.toLowerCase()) ||
      orgName.toLowerCase().includes(hoursSearchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(hoursSearchTerm.toLowerCase())
    const matchesStatus = hoursStatusFilter === "all" || entry.status === hoursStatusFilter
    return matchesSearch && matchesStatus
  })

  const handleEditUser = (user: any, type: "student" | "supervisor") => {
    setEditingUser({ ...user, type })
    setIsEditDialogOpen(true)
  }

  const handleSaveUser = async () => {
    if (!editingUser) return
    setIsProcessing(true)
    
    try {
      if (editingUser.type === "student") {
        const success = await updateStudent(editingUser._id, {
          firstName: editingUser.firstName,
          lastName: editingUser.lastName,
          email: editingUser.email,
          graduatingYear: editingUser.graduatingYear,
        })
        if (success) {
          toast.success("Student updated successfully")
          setIsEditDialogOpen(false)
          setEditingUser(null)
        }
      } else {
        const success = await updateSupervisor(editingUser._id, {
          firstName: editingUser.firstName,
          lastName: editingUser.lastName,
          email: editingUser.email,
        })
        if (success) {
          toast.success("Supervisor updated successfully")
          setIsEditDialogOpen(false)
          setEditingUser(null)
        }
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResetPassword = () => {
    if (!editingUser) return
    setIsResetPasswordDialogOpen(true)
  }

  const handleConfirmPasswordReset = async () => {
    if (!editingUser || !newPassword.trim()) {
      toast.error("Please enter a new password")
      return
    }
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }
    
    setIsProcessing(true)
    
    try {
      let success = false
      if (editingUser.type === "student") {
        success = await resetStudentPassword(editingUser.studentId || editingUser._id, newPassword)
      } else {
        success = await resetSupervisorPassword(editingUser.email, newPassword)
      }
      
      if (success) {
        toast.success(editingUser.type === "student" 
          ? "Student password has been reset successfully" 
          : "Supervisor password has been reset successfully")
        setIsResetPasswordDialogOpen(false)
        setNewPassword("")
      } else {
        toast.error("Failed to reset password. Please check if the user exists and try again.")
      }
    } catch (err: any) {
      console.error("Password reset error:", err)
      toast.error("Password reset failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApproveHours = async () => {
    setIsProcessing(true)
    try {
      for (const hourId of selectedHours) {
        await approveHour(hourId)
      }
      toast.success(`${selectedHours.length} hour entries have been approved.`)
      setSelectedHours([])
      await refetch()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkReject = async () => {
    if (!bulkRejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    setIsProcessing(true)
    try {
      for (const hourId of selectedHours) {
        await rejectHour(hourId, bulkRejectionReason)
      }
      toast.success(`${selectedHours.length} hour entries have been rejected.`)
      setSelectedHours([])
      setBulkRejectionReason("")
      setBulkRejectDialogOpen(false)
      await refetch()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleIndividualApprove = async (hourId: string) => {
    setIsProcessing(true)
    try {
      const success = await approveHour(hourId)
      if (success) {
        toast.success("Hour entry approved")
        await refetch()
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to approve entry")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleIndividualReject = async (hourId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    setIsProcessing(true)
    try {
      const success = await rejectHour(hourId, reason)
      if (success) {
        toast.success("Hour entry rejected")
        await refetch()
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to reject entry")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditHourClick = (hour: any) => {
    setEditingHour(hour)
    setEditHourStatus(hour.status)
    setEditRejectionReason(hour.rejectionReason || "")
  }

  const handleEditHourSubmit = async () => {
    if (!editingHour) return

    if (editHourStatus === "rejected" && !editRejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    setIsProcessing(true)
    try {
      let success = false
      if (editHourStatus === "approved") {
        success = await approveHour(editingHour._id)
      } else if (editHourStatus === "rejected") {
        success = await rejectHour(editingHour._id, editRejectionReason)
      }
      
      if (success) {
        toast.success("Hour status updated successfully")
        setEditingHour(null)
        setEditRejectionReason("")
        await refetch()
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update hour status")
    } finally {
      setIsProcessing(false)
    }
  }

  const exportHoursToCSV = () => {
    if (filteredHours.length === 0) {
      toast.error("No data to export")
      return
    }

    // CSV Headers
    const headers = ["Date", "Student", "Organization", "Supervisor", "Hours", "Status", "Description"]
    
    // CSV Rows
    const rows = filteredHours.map((entry) => {
      const student = typeof entry.student === 'string' ? null : entry.student
      const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown'
      const supervisor = typeof entry.supervisor === 'string' ? null : entry.supervisor
      const supervisorName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Unknown'
      const orgName = typeof entry.organization === 'string' ? entry.organization : (entry.organization as any)?.name || 'Unknown'
      const date = new Date(entry.date).toLocaleDateString()
      
      return [
        date,
        `"${studentName}"`,
        `"${orgName}"`,
        `"${supervisorName}"`,
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
    link.setAttribute("download", `admin-hours-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("CSV exported successfully")
  }

  const handleSelectHour = (hourId: string, checked: boolean) => {
    if (checked) {
      setSelectedHours([...selectedHours, hourId])
    } else {
      setSelectedHours(selectedHours.filter((id) => id !== hourId))
    }
  }

  const handleApproveSupervisor = async (supervisorId: string) => {
    setIsProcessing(true)
    try {
      const success = await approveSupervisor(supervisorId)
      if (success) {
        toast.success("Supervisor approved successfully")
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectSupervisor = async (supervisorId: string) => {
    setIsProcessing(true)
    try {
      const success = await rejectSupervisor(supervisorId, "Application rejected by administrator")
      if (success) {
        toast.success("Supervisor application rejected")
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Organization management functions
  const handleCreateOrganization = async () => {
    if (!newOrgName.trim()) {
      toast.error("Organization name is required")
      return
    }
    
    setIsProcessing(true)
    try {
      const success = await createOrganization({
        name: newOrgName.trim(),
        description: newOrgDescription.trim() || undefined,
      })
      if (success) {
        toast.success("Organization created successfully")
        setIsCreateOrgDialogOpen(false)
        setNewOrgName("")
        setNewOrgDescription("")
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditOrganization = (organization: any) => {
    setEditingOrganization({ ...organization })
    setIsOrgDialogOpen(true)
  }

  const handleSaveOrganization = async () => {
    if (!editingOrganization || !editingOrganization.name.trim()) {
      toast.error("Organization name is required")
      return
    }
    
    setIsProcessing(true)
    try {
      const success = await updateOrganization(editingOrganization._id, {
        name: editingOrganization.name.trim(),
        description: editingOrganization.description?.trim() || undefined,
        isActive: editingOrganization.isActive,
      })
      if (success) {
        toast.success("Organization updated successfully")
        setIsOrgDialogOpen(false)
        setEditingOrganization(null)
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteOrganization = async (organizationId: string) => {
    if (!confirm("Are you sure you want to deactivate this organization? This will also deactivate all associated supervisors.")) {
      return
    }
    
    setIsProcessing(true)
    try {
      const success = await deleteOrganization(organizationId)
      if (success) {
        toast.success("Organization deactivated successfully")
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Admin management functions (superadmin only)
  const handleCreateAdmin = async () => {
    if (!newAdminUsername.trim() || !newAdminPassword.trim()) {
      toast.error("Username and password are required")
      return
    }
    
    if (newAdminPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }
    
    setIsProcessing(true)
    try {
      const success = await createAdmin({
        username: newAdminUsername.trim(),
        password: newAdminPassword,
        email: newAdminEmail.trim() || undefined,
        role: newAdminRole,
      })
      if (success) {
        toast.success("Administrator created successfully")
        setIsCreateAdminDialogOpen(false)
        setNewAdminUsername("")
        setNewAdminPassword("")
        setNewAdminEmail("")
        setNewAdminRole("admin")
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Delete graduated students functions (superadmin only)
  const checkForGraduatedStudents = async () => {
    try {
      const graduated = await getGraduatedStudents()
      setHasGraduatedStudents(graduated.length > 0)
      setGraduatedStudents(graduated)
    } catch (err: any) {
      setHasGraduatedStudents(false)
    }
  }

  const handleOpenDeleteGraduatedDialog = async () => {
    setIsLoadingGraduatedStudents(true)
    try {
      const graduated = await getGraduatedStudents()
      setGraduatedStudents(graduated)
      setIsDeleteGraduatedDialogOpen(true)
    } catch (err: any) {
      toast.error('Failed to load graduated students')
    } finally {
      setIsLoadingGraduatedStudents(false)
    }
  }

  const handleDeleteGraduatedStudents = async () => {
    setIsProcessing(true)
    try {
      const success = await deleteGraduatedStudents()
      if (success) {
        toast.success(`Successfully deleted ${graduatedStudents.length} graduated students`)
        setIsDeleteGraduatedDialogOpen(false)
        setGraduatedStudents([])
        setHasGraduatedStudents(false)
      }
    } catch (err: any) {
      toast.error('Failed to delete graduated students')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditAdmin = (admin: any) => {
    setEditingAdmin({ ...admin })
    setIsAdminDialogOpen(true)
  }

  const handleSaveAdmin = async () => {
    if (!editingAdmin || !editingAdmin.username.trim()) {
      toast.error("Username is required")
      return
    }
    
    setIsProcessing(true)
    try {
      const success = await updateAdmin(editingAdmin._id, {
        username: editingAdmin.username.trim(),
        email: editingAdmin.email?.trim() || undefined,
        role: editingAdmin.role,
      })
      if (success) {
        toast.success("Administrator updated successfully")
        setIsAdminDialogOpen(false)
        setEditingAdmin(null)
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <AppShell userRole="admin">
        <div className="container mx-auto px-4 py-6 max-w-7xl flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#0084ff] mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (error) {
    return (
      <AppShell userRole="admin">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell userRole="admin">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <GradientCard variant="hero" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-balance">Admin Dashboard</h1>
                <p className="text-muted-foreground">CVHS Community Service Hours Administration</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  <Server className="mr-1 h-3 w-3" />
                  System Online
                </Badge>
              </div>
            </div>
          </GradientCard>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => {
          // Prevent non-superadmins from accessing admin management
          if (value === 'admins' && user?.role !== 'superadmin') {
            setActiveTab('overview')
            return
          }
          setActiveTab(value)
        }} className="space-y-6">
          <TabsList className={`grid w-full ${user?.role === 'superadmin' ? 'grid-cols-7' : 'grid-cols-6'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="supervisors">Supervisors</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="manage">Manage Hours</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            {user?.role === 'superadmin' && (
              <TabsTrigger value="admins">Manage Admins</TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Delete Graduated Students Section (Superadmin Only) */}
            {user?.role === 'superadmin' && hasGraduatedStudents && (
              <Card className="mb-6 border-red-900/20 bg-black">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-950 border border-red-900">
                        <GraduationCap className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Delete Graduated Students</h3>
                        <p className="text-sm text-gray-400">Permanently remove all graduated students and their data</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleOpenDeleteGraduatedDialog}
                      variant="destructive"
                      disabled={isLoadingGraduatedStudents}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isLoadingGraduatedStudents ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Graduates
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <GradientCard variant="stat" className="p-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-[#0084ff]">{overview?.totalStudents || students.length}</div>
                      <p className="text-xs text-muted-foreground">registered students</p>
                    </div>
                    <Users className="h-8 w-8 text-[#0084ff]/60" />
                  </div>
                </CardContent>
              </GradientCard>

              <Card className="p-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">{overview?.totalHours || hours.reduce((sum, h) => h.status === 'approved' ? sum + h.hours : sum, 0)}</div>
                      <p className="text-xs text-muted-foreground">community service</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-500/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-orange-500">{overview?.pendingHours || hours.filter(h => h.status === 'pending').length}</div>
                      <p className="text-xs text-muted-foreground">awaiting review</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-500/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Supervisors</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">{overview?.totalSupervisors || supervisors.filter(s => s.isApproved).length}</div>
                      <p className="text-xs text-muted-foreground">{organizations.length} organizations</p>
                    </div>
                    <Building2 className="h-8 w-8 text-purple-500/60" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Supervisor Approvals */}
            {pendingSupervisors.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Pending Supervisor Approvals</CardTitle>
                  <CardDescription>{pendingSupervisors.length} supervisor applications awaiting approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingSupervisors.map((supervisor) => (
                      <div key={supervisor._id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <div>
                          <p className="font-medium">{supervisor.firstName} {supervisor.lastName}</p>
                          <p className="text-sm text-muted-foreground">{supervisor.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Organization: {typeof supervisor.organization === 'object' ? supervisor.organization.name : supervisor.organizationName} | Proof: {supervisor.proofOfExistence}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleApproveSupervisor(supervisor._id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={isProcessing}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectSupervisor(supervisor._id)}
                            variant="destructive"
                            disabled={isProcessing}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest service hours and system activity</CardDescription>
              </CardHeader>
              <CardContent>
                {hours.length > 0 ? (
                  <div className="space-y-3">
                    {hours
                      .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
                      .slice(0, 5)
                      .map((hour) => {
                        const student = typeof hour.student === 'string' ? null : hour.student
                        const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
                        const orgName = typeof hour.organization === 'string' ? hour.organization : (hour.organization as any)?.name || 'Unknown'
                        
                        return (
                          <div key={hour._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <div>
                                <p className="font-medium">{studentName}</p>
                                <p className="text-sm text-muted-foreground">{orgName} • {hour.hours}h</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  hour.status === "approved"
                                    ? "default"
                                    : hour.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className="capitalize"
                              >
                                {hour.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(hour.createdAt || hour.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Students */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Top Students by Hours
                </CardTitle>
                <CardDescription>Students with the most approved community service hours</CardDescription>
              </CardHeader>
              <CardContent>
                {students.length > 0 ? (
                  <div className="space-y-3">
                    {students
                      .filter(s => s.totalHours && s.totalHours > 0)
                      .sort((a, b) => (b.totalHours || 0) - (a.totalHours || 0))
                      .slice(0, 5)
                      .map((student, index) => (
                        <div key={student._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{student.firstName} {student.lastName}</p>
                              <p className="text-sm text-muted-foreground">Grade {student.grade} • Class of {student.graduatingYear}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{student.totalHours || 0}h</p>
                            <p className="text-xs text-muted-foreground">total hours</p>
                          </div>
                        </div>
                      ))}
                    {students.filter(s => s.totalHours && s.totalHours > 0).length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No students with hours yet</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No students found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organizations */}
            {organizations.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-500" />
                    Organizations
                  </CardTitle>
                  <CardDescription>Active community service organizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {organizations.map((org) => (
                      <div key={org._id} className="p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{org.name}</h4>
                          <Badge variant={org.isActive ? 'default' : 'secondary'}>
                            {org.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{org.description || 'No description'}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-green-500" />
                  System Status
                </CardTitle>
                <CardDescription>Current system health and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="text-2xl font-bold text-green-600">{hours.filter(h => h.status === 'approved').length}</div>
                    <div className="text-sm text-muted-foreground">Approved Hours</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                    <div className="text-2xl font-bold text-orange-600">{hours.filter(h => h.status === 'pending').length}</div>
                    <div className="text-sm text-muted-foreground">Pending Review</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <div className="text-2xl font-bold text-blue-600">{students.filter(s => s.isActive).length}</div>
                    <div className="text-sm text-muted-foreground">Active Students</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                    <div className="text-2xl font-bold text-purple-600">{supervisors.filter(s => s.isApproved).length}</div>
                    <div className="text-sm text-muted-foreground">Approved Supervisors</div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Students</CardTitle>
                    <CardDescription>Manage all student accounts ({students.length} total)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total Hours</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No students found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudents.map((student) => (
                          <TableRow key={student._id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white text-xs">
                                    {student.firstName[0]}{student.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{student.firstName} {student.lastName}</p>
                                  <p className="text-sm text-muted-foreground">{student.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p>Grade {student.grade}</p>
                                <p className="text-xs text-muted-foreground">Class of {student.graduatingYear}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={student.isActive ? "default" : "secondary"} className="capitalize">
                                {student.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{student.totalHours || 0}h</span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditUser(student, "student")}
                                disabled={isProcessing}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supervisors Tab */}
          <TabsContent value="supervisors">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Supervisors</CardTitle>
                    <CardDescription>Manage supervisor accounts and organizations ({supervisors.length} total)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search supervisors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                      {filteredSupervisors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No supervisors found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSupervisors.map((supervisor) => (
                          <TableRow key={supervisor._id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white text-xs">
                                    {supervisor.firstName[0]}{supervisor.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{supervisor.firstName} {supervisor.lastName}</p>
                                  <p className="text-sm text-muted-foreground">{supervisor.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{typeof supervisor.organization === 'object' ? supervisor.organization.name : supervisor.organizationName}</TableCell>
                            <TableCell>
                              <Badge variant={supervisor.isApproved ? "default" : "secondary"} className="capitalize">
                                {supervisor.isApproved ? 'Approved' : 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditUser(supervisor, "supervisor")}
                                disabled={isProcessing}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Organizations</CardTitle>
                    <CardDescription>Manage community service organizations ({organizations.length} total)</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setIsCreateOrgDialogOpen(true)}
                    className="bg-[#0084ff] hover:bg-[#0070e6] text-white"
                  >
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
                              <p className="text-sm text-muted-foreground">
                                {org.description || 'No description provided'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={org.isActive ? 'default' : 'secondary'}>
                              {org.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={isProcessing}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => handleEditOrganization(org)}
                                  disabled={isProcessing}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteOrganization(org._id)}
                                  className="text-red-600"
                                  disabled={isProcessing}
                                >
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
                            <div className="font-medium">
                              {typeof org.supervisors === 'object' ? org.supervisors.length : 'Loading...'}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Created</div>
                            <div className="font-medium">
                              {new Date(org.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        {org.supervisors && typeof org.supervisors === 'object' && org.supervisors.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-sm text-muted-foreground mb-2">Associated Supervisors:</div>
                            <div className="flex flex-wrap gap-2">
                              {org.supervisors.map((supervisor: any) => (
                                <Badge key={supervisor._id} variant="outline" className="text-xs">
                                  {supervisor.firstName} {supervisor.lastName}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Hours Tab */}
          <TabsContent value="manage">
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
                        placeholder="Search students, supervisors, organizations, or descriptions..."
                        value={hoursSearchTerm}
                        onChange={(e) => setHoursSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={hoursStatusFilter} onValueChange={setHoursStatusFilter}>
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
                    onClick={exportHoursToCSV}
                    disabled={filteredHours.length === 0}
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Service Hours</CardTitle>
                    <CardDescription>Review, approve, and manage all service hour entries ({filteredHours.length} of {hours.length} total)</CardDescription>
                  </div>
                  {selectedHours.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Button 
                        onClick={handleApproveHours}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={isProcessing}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve ({selectedHours.length})
                      </Button>
                      <Button
                        onClick={() => setBulkRejectDialogOpen(true)}
                        variant="destructive"
                        disabled={isProcessing}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject ({selectedHours.length})
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {filteredHours.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hours found</h3>
                    <p className="text-muted-foreground text-pretty">
                      {hoursSearchTerm || hoursStatusFilter !== "all"
                        ? "Try adjusting your filters to see more results."
                        : "No service hours have been submitted yet."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">
                            <Checkbox
                              checked={selectedHours.length === filteredHours.length && filteredHours.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedHours(filteredHours.map((h) => h._id))
                                } else {
                                  setSelectedHours([])
                                }
                              }}
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
                        {filteredHours.map((entry) => {
                          const student = typeof entry.student === 'string' ? null : entry.student
                          const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
                          const studentEmail = student?.email || 'N/A'
                          const supervisor = typeof entry.supervisor === 'string' ? null : entry.supervisor
                          const supervisorName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Unknown'
                          const orgName = typeof entry.organization === 'string' ? entry.organization : (entry.organization as any)?.name || 'Unknown'
                          
                          return (
                            <TableRow key={entry._id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedHours.includes(entry._id)}
                                  onCheckedChange={(checked) => handleSelectHour(entry._id, checked as boolean)}
                                  disabled={isProcessing}
                                />
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
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isProcessing}>
                                      <MoreVertical className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditHourClick(entry)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Change Status
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-red-600"
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

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <div className="space-y-6">
              {/* System Objects Overview */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    System Objects
                  </CardTitle>
                  <CardDescription>Overview of all users and organizations in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#0084ff]">{students.length + supervisors.length}</div>
                      <div className="text-sm text-muted-foreground">Total Users</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {students.length} students • {supervisors.length} supervisors
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{students.filter(s => s.isActive).length}</div>
                      <div className="text-sm text-muted-foreground">Active Students</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {students.length > 0 ? Math.round((students.filter(s => s.isActive).length / students.length) * 100) : 0}% of total
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{supervisors.filter(s => s.isApproved).length}</div>
                      <div className="text-sm text-muted-foreground">Approved Supervisors</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {supervisors.length > 0 ? Math.round((supervisors.filter(s => s.isApproved).length / supervisors.length) * 100) : 0}% of total
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{organizations.length}</div>
                      <div className="text-sm text-muted-foreground">Organizations</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {organizations.filter(o => o.isActive).length} active
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hours Overview */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Community Service Hours
                  </CardTitle>
                  <CardDescription>Overview of all service hours tracked in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{hours.reduce((sum, h) => sum + h.hours, 0)}</div>
                      <div className="text-sm text-muted-foreground">Total Hours</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {hours.length} entries submitted
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{hours.filter(h => h.status === 'approved').reduce((sum, h) => sum + h.hours, 0)}</div>
                      <div className="text-sm text-muted-foreground">Approved Hours</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {hours.length > 0 ? Math.round((hours.filter(h => h.status === 'approved').length / hours.length) * 100) : 0}% approval rate
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{hours.filter(h => h.status === 'pending').reduce((sum, h) => sum + h.hours, 0)}</div>
                      <div className="text-sm text-muted-foreground">Pending Hours</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {hours.filter(h => h.status === 'pending').length} entries
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">
                        {students.length > 0 ? Math.round((hours.filter(h => h.status === 'approved').reduce((sum, h) => sum + h.hours, 0) / students.length) * 10) / 10 : 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Hours/Student</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Based on approved hours
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grade Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Grade Distribution</CardTitle>
                  <CardDescription>Number of students by grade level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[9, 10, 11, 12].map(grade => {
                      const count = students.filter(s => s.grade === grade).length
                      const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0
                      return (
                        <div key={grade} className="text-center p-4 rounded-lg bg-muted/30">
                          <div className="text-2xl font-bold text-[#0084ff]">{count}</div>
                          <div className="text-sm text-muted-foreground">Grade {grade}</div>
                          <div className="text-xs text-muted-foreground">{percentage}%</div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Graduation Year Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Graduation Year Distribution</CardTitle>
                  <CardDescription>Students by graduation year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(new Set(students.map(s => s.graduatingYear))).sort().map(year => {
                      const count = students.filter(s => s.graduatingYear === year).length
                      const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0
                      return (
                        <div key={year} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div>
                            <div className="font-medium">Class of {year}</div>
                            <div className="text-sm text-muted-foreground">{count} students</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#0084ff]">{percentage}%</div>
                            <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-[#0084ff] h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Organization Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Organization Statistics</CardTitle>
                  <CardDescription>Hours and activity by organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {organizations.map(org => {
                      const orgHours = hours.filter(h => 
                        (h.organization && typeof h.organization === 'object' && h.organization._id === org._id) ||
                        ((h as any).organizationName === org.name)
                      )
                      const approvedHours = orgHours.filter(h => h.status === 'approved').reduce((sum, h) => sum + h.hours, 0)
                      const pendingHours = orgHours.filter(h => h.status === 'pending').reduce((sum, h) => sum + h.hours, 0)
                      const supervisorCount = supervisors.filter(s => 
                        (s.organization && typeof s.organization === 'object' && s.organization._id === org._id) ||
                        (s.organizationName === org.name)
                      ).length
                      
                      return (
                        <div key={org._id} className="p-4 rounded-lg bg-muted/30">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{org.name}</h4>
                            <Badge variant={org.isActive ? 'default' : 'secondary'}>
                              {org.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Total Hours</div>
                              <div className="font-bold">{orgHours.reduce((sum, h) => sum + h.hours, 0)}h</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Approved</div>
                              <div className="font-bold text-green-600">{approvedHours}h</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Pending</div>
                              <div className="font-bold text-orange-600">{pendingHours}h</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Supervisors</div>
                              <div className="font-bold">{supervisorCount}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity Summary</CardTitle>
                  <CardDescription>System activity over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-green-600">{hours.filter(h => h.status === 'approved').length}</div>
                      <div className="text-sm text-muted-foreground">Hours Approved</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-blue-600">{students.filter(s => s.isActive).length}</div>
                      <div className="text-sm text-muted-foreground">Active Students</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-purple-600">{supervisors.filter(s => s.isApproved).length}</div>
                      <div className="text-sm text-muted-foreground">Active Supervisors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Current system status and metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                      <Server className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="font-bold text-green-600">Online</div>
                      <div className="text-sm text-muted-foreground">System Status</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="font-bold text-blue-600">{hours.length}</div>
                      <div className="text-sm text-muted-foreground">Total Entries</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                      <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <div className="font-bold text-orange-600">{pendingSupervisors.length}</div>
                      <div className="text-sm text-muted-foreground">Pending Approvals</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                      <GraduationCap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="font-bold text-purple-600">{students.filter(s => s.isActive).length}</div>
                      <div className="text-sm text-muted-foreground">Active Students</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Manage Admins Tab (Superadmin Only) */}
          {user?.role === 'superadmin' && (
            <TabsContent value="admins">
              {user?.role === 'superadmin' ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Manage Administrators</CardTitle>
                        <CardDescription>Create and manage administrator accounts ({admins.length} total)</CardDescription>
                      </div>
                      <Button 
                        onClick={() => setIsCreateAdminDialogOpen(true)}
                        className="bg-[#0084ff] hover:bg-[#0070e6] text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Admin
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                  <div className="space-y-4">
                    {admins.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No administrators found</p>
                        <p className="text-sm">Create your first administrator to get started</p>
                      </div>
                    ) : (
                      admins.map((admin) => (
                        <div key={admin._id} className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white">
                                  <Shield className="h-5 w-5" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{admin.username}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {admin.email || 'No email provided'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={admin.role === 'superadmin' ? 'default' : 'secondary'}>
                                {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                              </Badge>
                              <Badge variant={admin.isActive ? 'default' : 'secondary'}>
                                {admin.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" disabled={isProcessing}>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => handleEditAdmin(admin)}
                                    disabled={isProcessing}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Created</div>
                              <div className="font-medium">
                                {new Date(admin.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Last Updated</div>
                              <div className="font-medium">
                                {new Date(admin.updatedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
                      <p className="text-muted-foreground">You don't have permission to access admin management.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Edit {editingUser?.type === "student" ? "Student" : "Supervisor"}
            </DialogTitle>
            <DialogDescription>
              Update user information and manage account settings
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-first-name">First Name</Label>
                  <Input
                    id="edit-first-name"
                    value={editingUser.firstName}
                    onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-last-name">Last Name</Label>
                  <Input
                    id="edit-last-name"
                    value={editingUser.lastName}
                    onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  disabled={isProcessing}
                />
              </div>

              {editingUser.type === "student" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-grad-year">Graduation Year</Label>
                  <Input
                    id="edit-grad-year"
                    type="number"
                    value={editingUser.graduatingYear}
                    onChange={(e) => setEditingUser({ ...editingUser, graduatingYear: parseInt(e.target.value) })}
                    disabled={isProcessing}
                  />
                </div>
              )}

              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResetPassword}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <KeyRound className="mr-2 h-4 w-4" />
                      Reset Password
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Reset {editingUser?.type === "student" ? "student" : "supervisor"} password directly
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveUser} 
              className="bg-[#0084ff] hover:bg-[#0070e6] text-white"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Organization Dialog */}
      <Dialog open={isCreateOrgDialogOpen} onOpenChange={setIsCreateOrgDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Create a new community service organization for supervisors to register with
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-org-name">Organization Name *</Label>
              <Input
                id="create-org-name"
                placeholder="e.g., Local Food Bank"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-org-description">Description</Label>
              <Textarea
                id="create-org-description"
                placeholder="Brief description of the organization and its mission..."
                value={newOrgDescription}
                onChange={(e) => setNewOrgDescription(e.target.value)}
                disabled={isProcessing}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateOrgDialogOpen(false)
                setNewOrgName("")
                setNewOrgDescription("")
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateOrganization} 
              className="bg-[#0084ff] hover:bg-[#0070e6] text-white"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Organization"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Organization Dialog */}
      <Dialog open={isOrgDialogOpen} onOpenChange={setIsOrgDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>
              Update organization information and settings
            </DialogDescription>
          </DialogHeader>
          {editingOrganization && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-org-name">Organization Name *</Label>
                <Input
                  id="edit-org-name"
                  value={editingOrganization.name}
                  onChange={(e) => setEditingOrganization({ ...editingOrganization, name: e.target.value })}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-org-description">Description</Label>
                <Textarea
                  id="edit-org-description"
                  value={editingOrganization.description || ''}
                  onChange={(e) => setEditingOrganization({ ...editingOrganization, description: e.target.value })}
                  disabled={isProcessing}
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-org-active"
                  checked={editingOrganization.isActive}
                  onCheckedChange={(checked) => setEditingOrganization({ ...editingOrganization, isActive: checked as boolean })}
                  disabled={isProcessing}
                />
                <Label htmlFor="edit-org-active">Organization is active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOrgDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveOrganization} 
              className="bg-[#0084ff] hover:bg-[#0070e6] text-white"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for this {editingUser?.type === "student" ? "student" : "supervisor"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password (min 8 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isProcessing}
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsResetPasswordDialogOpen(false)
                setNewPassword("")
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmPasswordReset} 
              className="bg-[#0084ff] hover:bg-[#0070e6] text-white"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Reject Dialog */}
      <Dialog open={bulkRejectDialogOpen} onOpenChange={setBulkRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Selected Entries</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting these {selectedHours.length} entries. Students will receive this feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-rejection-reason">Rejection Reason</Label>
              <Textarea
                id="bulk-rejection-reason"
                placeholder="Please provide more documentation or clarify the activities performed..."
                value={bulkRejectionReason}
                onChange={(e) => setBulkRejectionReason(e.target.value)}
                className="min-h-[100px]"
                disabled={isProcessing}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setBulkRejectDialogOpen(false)
                  setBulkRejectionReason("")
                }}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleBulkReject} 
                disabled={!bulkRejectionReason.trim() || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Reject Entries"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                <Label htmlFor="edit-hour-status">New Status</Label>
                <Select value={editHourStatus} onValueChange={(value: "approved" | "pending" | "rejected") => setEditHourStatus(value)}>
                  <SelectTrigger id="edit-hour-status" disabled={isProcessing}>
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
              {editHourStatus === "rejected" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-hour-rejection-reason">Rejection Reason</Label>
                  <Textarea
                    id="edit-hour-rejection-reason"
                    placeholder="Please provide a reason for rejecting this entry..."
                    value={editRejectionReason}
                    onChange={(e) => setEditRejectionReason(e.target.value)}
                    className="min-h-[100px]"
                    disabled={isProcessing}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingHour(null)
                    setEditRejectionReason("")
                  }}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleEditHourSubmit} 
                  disabled={isProcessing}
                  className="bg-[#0084ff] hover:bg-[#0070e6] text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Hour Confirmation Dialog */}
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
                  <p className="text-sm text-muted-foreground mt-1">
                    Student: {typeof deleteConfirmHour.student === 'string' || !deleteConfirmHour.student
                      ? 'Unknown'
                      : `${deleteConfirmHour.student.firstName} ${deleteConfirmHour.student.lastName}`}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleteConfirmHour) return
                setIsProcessing(true)
                try {
                  const success = await deleteHour(deleteConfirmHour._id)
                  if (success) {
                    toast.success("Hour entry deleted successfully")
                    setDeleteConfirmHour(null)
                  } else {
                    toast.error("Failed to delete hour entry")
                  }
                } catch (err: any) {
                  toast.error(err.message || "Failed to delete hour entry")
                } finally {
                  setIsProcessing(false)
                }
              }}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Admin Dialog (Superadmin Only) */}
      {user?.role === 'superadmin' && (
        <Dialog open={isCreateAdminDialogOpen} onOpenChange={setIsCreateAdminDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Administrator</DialogTitle>
              <DialogDescription>
                Create a new administrator account with the specified role and permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-admin-username">Username *</Label>
                <Input
                  id="create-admin-username"
                  placeholder="Enter username"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-admin-password">Password *</Label>
                <Input
                  id="create-admin-password"
                  type="password"
                  placeholder="Enter password (min 8 characters)"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-admin-email">Email</Label>
                <Input
                  id="create-admin-email"
                  type="email"
                  placeholder="Enter email (optional)"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-admin-role">Role</Label>
                <Select value={newAdminRole} onValueChange={setNewAdminRole} disabled={isProcessing}>
                  <SelectTrigger id="create-admin-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateAdminDialogOpen(false)
                  setNewAdminUsername("")
                  setNewAdminPassword("")
                  setNewAdminEmail("")
                  setNewAdminRole("admin")
                }}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateAdmin} 
                className="bg-[#0084ff] hover:bg-[#0070e6] text-white"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Administrator"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Admin Dialog (Superadmin Only) */}
      {user?.role === 'superadmin' && (
        <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Administrator</DialogTitle>
              <DialogDescription>
                Update administrator information and settings
              </DialogDescription>
            </DialogHeader>
            {editingAdmin && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-admin-username">Username *</Label>
                  <Input
                    id="edit-admin-username"
                    value={editingAdmin.username}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, username: e.target.value })}
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-admin-email">Email</Label>
                  <Input
                    id="edit-admin-email"
                    type="email"
                    value={editingAdmin.email || ''}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-admin-role">Role</Label>
                  <Select 
                    value={editingAdmin.role} 
                    onValueChange={(value) => setEditingAdmin({ ...editingAdmin, role: value })}
                    disabled={isProcessing}
                  >
                    <SelectTrigger id="edit-admin-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsAdminDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveAdmin} 
                className="bg-[#0084ff] hover:bg-[#0070e6] text-white"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Graduated Students Confirmation Dialog (Superadmin Only) */}
      {user?.role === 'superadmin' && (
        <AlertDialog open={isDeleteGraduatedDialogOpen} onOpenChange={setIsDeleteGraduatedDialogOpen}>
          <AlertDialogContent className="max-w-4xl max-h-[85vh] bg-black">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete Graduated Students
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                You are about to permanently delete <strong className="text-white">{graduatedStudents.length}</strong> graduated students and all their data.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4 overflow-y-auto max-h-[calc(85vh-200px)]">
              {/* Warning */}
              <div className="bg-red-950/50 border border-red-900 rounded-lg p-3">
                <p className="text-sm text-red-400">
                  ⚠️ This will permanently delete all student records, hours, and activity history. This cannot be undone.
                </p>
              </div>

              {/* Stats */}
              {graduatedStudents.length > 0 && (
                <div className="flex gap-3 text-sm">
                  <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-white font-medium">{graduatedStudents.length}</span>
                    <span className="text-gray-400">students</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
                    <Clock className="h-4 w-4 text-green-400" />
                    <span className="text-white font-medium">{graduatedStudents.reduce((sum, s) => sum + (s.totalHours || 0), 0)}</span>
                    <span className="text-gray-400">total hours</span>
                  </div>
                </div>
              )}

              {/* Students Table */}
              {graduatedStudents.length > 0 ? (
                <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
                  <div className="max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-zinc-900 border-b border-zinc-800">
                        <TableRow className="hover:bg-zinc-900">
                          <TableHead className="text-gray-300">Name</TableHead>
                          <TableHead className="text-gray-300">Email</TableHead>
                          <TableHead className="text-gray-300">Graduation</TableHead>
                          <TableHead className="text-gray-300 text-right">Hours</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {graduatedStudents.map((student) => (
                          <TableRow key={student._id} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                            <TableCell className="text-white">{student.firstName} {student.lastName}</TableCell>
                            <TableCell className="text-gray-400 text-sm">{student.email}</TableCell>
                            <TableCell className="text-gray-400 text-sm">
                              {student.graduationDate ? new Date(student.graduationDate).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell className="text-white text-right">{student.totalHours || 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <GraduationCap className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No graduated students found</p>
                </div>
              )}
            </div>

            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel disabled={isProcessing} className="bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteGraduatedStudents}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isProcessing || graduatedStudents.length === 0}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete {graduatedStudents.length} Students
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </AppShell>
  )
}
