"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientCard } from "@/components/ui/gradient-card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Clock, CheckCircle, AlertCircle, TrendingUp, Calendar, Building2, Search, Download, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageTransition } from "@/components/ui/page-transition"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { motion } from "framer-motion"
import { useStudentDashboard } from "@/hooks/useStudentDashboard"
import { useAuth } from "@/contexts/AuthContext"
import toast from "react-hot-toast"

export default function StudentDashboard() {
  const { user } = useAuth()
  const { student, statistics, hours, loading, error } = useStudentDashboard()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredData = hours.filter((entry) => {
    const orgName = typeof entry.organization === 'string' ? entry.organization : (entry.organization as any)?.name || ''
    const matchesSearch =
      orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      toast.error("No data to export")
      return
    }

    // CSV Headers
    const headers = ["Date", "Organization", "Hours", "Status", "Supervisor", "Description"]
    
    // CSV Rows
    const rows = filteredData.map((entry) => {
      const orgName = typeof entry.organization === 'string' ? entry.organization : (entry.organization as any)?.name || 'Unknown'
      const supervisorName = typeof entry.supervisor === 'string' ? entry.supervisor : (entry.supervisor as any) ? `${(entry.supervisor as any).firstName} ${(entry.supervisor as any).lastName}` : 'Unknown'
      const date = new Date(entry.date).toLocaleDateString()
      
      return [
        date,
        `"${orgName}"`, // Wrap in quotes to handle commas
        entry.hours,
        entry.status,
        `"${supervisorName}"`,
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
    link.setAttribute("download", `service-hours-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("CSV exported successfully")
  }

  if (loading) {
    return (
      <AppShell userRole="student">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-[#0084ff]" />
        </div>
      </AppShell>
    )
  }

  if (error) {
    return (
      <AppShell userRole="student">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </AppShell>
    )
  }

  const studentData = {
    name: user ? `${user.firstName} ${user.lastName}` : (student ? `${student.firstName} ${student.lastName}` : 'Student'),
    grade: student ? `Grade ${student.grade}` : '',
    totalHours: statistics?.approvedHours || 0,
    pendingHours: statistics?.pendingHours || 0,
    thisMonth: statistics?.hoursThisMonth || 0,
    organizations: new Set(hours.map(h => typeof h.organization === 'string' ? h.organization : (h.organization as any)?._id).filter(Boolean)).size,
  }

  // Generate initials from user data for the avatar
  const getInitials = () => {
    if (user && user.firstName && user.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase()
    }
    if (student && student.firstName && student.lastName) {
      return (student.firstName[0] + student.lastName[0]).toUpperCase()
    }
    return "ST" // Default fallback for "Student"
  }

  return (
    <AppShell userRole="student">
      <PageTransition>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Hero Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GradientCard variant="hero" className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white text-lg">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div>
                    <h1 className="text-2xl font-bold text-balance">Welcome back, {studentData.name}!</h1>
                    <p className="text-muted-foreground">{studentData.grade} • CVHS Student</p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild className="bg-[#0084ff] hover:bg-[#0070e6] text-white">
                    <Link href="/student/hours/add">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Hours
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </GradientCard>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GradientCard variant="stat" className="p-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-[#0084ff]">
                        <AnimatedCounter value={studentData.totalHours} />
                      </div>
                      <p className="text-xs text-muted-foreground">hours completed</p>
                    </div>
                    <Clock className="h-8 w-8 text-[#0084ff]/60" />
                  </div>
                </CardContent>
              </GradientCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">
                        <AnimatedCounter value={studentData.pendingHours} />
                      </div>
                      <p className="text-xs text-muted-foreground">hours waiting</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-orange-500/60" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">
                        <AnimatedCounter value={studentData.thisMonth} />
                      </div>
                      <p className="text-xs text-muted-foreground">hours logged</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500/60" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Organizations</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">
                        <AnimatedCounter value={studentData.organizations} />
                      </div>
                      <p className="text-xs text-muted-foreground">volunteered with</p>
                    </div>
                    <Building2 className="h-8 w-8 text-purple-500/60" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

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
                      placeholder="Search organizations or descriptions..."
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
                  disabled={filteredData.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
          <CardHeader>
            <CardTitle>Service Hours Log</CardTitle>
            <CardDescription>All your community service entries and their approval status</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hours found</h3>
                <p className="text-muted-foreground mb-4 text-pretty">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "Start logging your community service hours to see them here."}
                </p>
                <Button asChild className="bg-[#0084ff] hover:bg-[#0070e6] text-white">
                  <Link href="/student/hours/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Hours
                  </Link>
                </Button>
              </div>
            ) : (
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
                    {filteredData.map((entry) => {
                      const orgName = typeof entry.organization === 'string' ? entry.organization : (entry.organization as any)?.name || 'Unknown'
                      const supervisorName = typeof entry.supervisor === 'string' ? entry.supervisor : (entry.supervisor as any) ? `${(entry.supervisor as any).firstName} ${(entry.supervisor as any).lastName}` : 'Unknown'
                      
                      return (
                        <TableRow key={entry._id}>
                          <TableCell className="font-medium">{new Date(entry.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-balance">{orgName}</p>
                              <p className="text-sm text-muted-foreground text-pretty line-clamp-2">
                                {entry.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{entry.hours}</TableCell>
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
                          <TableCell className="text-sm">{supervisorName}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </PageTransition>
    </AppShell>
  )
}
