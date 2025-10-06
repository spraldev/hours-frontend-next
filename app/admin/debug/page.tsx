"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Download,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Copy,
  Terminal,
  Database,
  Server,
} from "lucide-react"

export default function AdminDebugPage() {
  const [logFilter, setLogFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock log data
  const systemLogs = [
    {
      id: 1,
      timestamp: "2024-01-16T14:30:25.123Z",
      level: "info",
      service: "api",
      message: "User authentication successful",
      details: { userId: 123, email: "john.doe@student.cvhs.edu" },
    },
    {
      id: 2,
      timestamp: "2024-01-16T14:29:15.456Z",
      level: "warning",
      service: "database",
      message: "Slow query detected",
      details: { query: "SELECT * FROM service_hours WHERE...", duration: "2.3s" },
    },
    {
      id: 3,
      timestamp: "2024-01-16T14:28:45.789Z",
      level: "error",
      service: "email",
      message: "Failed to send approval notification",
      details: { recipient: "jane.smith@cvhs.edu", error: "SMTP timeout" },
    },
    {
      id: 4,
      timestamp: "2024-01-16T14:27:30.012Z",
      level: "info",
      service: "api",
      message: "Service hours submitted for approval",
      details: { studentId: 456, hours: 4.0, organizationId: 12 },
    },
    {
      id: 5,
      timestamp: "2024-01-16T14:26:18.345Z",
      level: "debug",
      service: "auth",
      message: "JWT token refreshed",
      details: { userId: 789, expiresIn: "24h" },
    },
  ]

  const apiLogs = [
    {
      id: 1,
      timestamp: "2024-01-16T14:30:25.123Z",
      method: "POST",
      endpoint: "/api/auth/login",
      status: 200,
      duration: "145ms",
      ip: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
    },
    {
      id: 2,
      timestamp: "2024-01-16T14:29:45.678Z",
      method: "GET",
      endpoint: "/api/hours/student/123",
      status: 200,
      duration: "89ms",
      ip: "192.168.1.101",
      userAgent: "Mozilla/5.0...",
    },
    {
      id: 3,
      timestamp: "2024-01-16T14:28:30.234Z",
      method: "POST",
      endpoint: "/api/hours/submit",
      status: 500,
      duration: "2.3s",
      ip: "192.168.1.102",
      userAgent: "Mozilla/5.0...",
      error: "Database connection timeout",
    },
  ]

  const databaseLogs = [
    {
      id: 1,
      timestamp: "2024-01-16T14:30:15.567Z",
      query: "SELECT * FROM users WHERE email = ?",
      duration: "12ms",
      rows: 1,
      status: "success",
    },
    {
      id: 2,
      timestamp: "2024-01-16T14:29:45.890Z",
      query: "INSERT INTO service_hours (student_id, hours, date) VALUES (?, ?, ?)",
      duration: "45ms",
      rows: 1,
      status: "success",
    },
    {
      id: 3,
      timestamp: "2024-01-16T14:28:30.123Z",
      query: "SELECT COUNT(*) FROM service_hours WHERE status = 'pending'",
      duration: "2.1s",
      rows: 1,
      status: "slow",
    },
  ]

  const filteredSystemLogs = systemLogs.filter((log) => {
    const matchesFilter = logFilter === "all" || log.level === logFilter
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-600 dark:text-red-400"
      case "warning":
        return "text-orange-600 dark:text-orange-400"
      case "info":
        return "text-blue-600 dark:text-blue-400"
      case "debug":
        return "text-gray-600 dark:text-gray-400"
      default:
        return "text-foreground"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <XCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      case "debug":
        return <Terminal className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: number | string) => {
    if (typeof status === "number") {
      if (status >= 200 && status < 300) return "text-green-600 dark:text-green-400"
      if (status >= 400 && status < 500) return "text-orange-600 dark:text-orange-400"
      if (status >= 500) return "text-red-600 dark:text-red-400"
    }
    if (status === "slow") return "text-orange-600 dark:text-orange-400"
    return "text-green-600 dark:text-green-400"
  }

  return (
    <AppShell userRole="admin">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <PageHeader
          title="Debug & Logs"
          subtitle="Monitor system activity and troubleshoot issues"
          action={
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Logs
              </Button>
            </div>
          }
        />

        <Tabs defaultValue="system" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              System Logs
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              API Logs
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Logs
            </TabsTrigger>
          </TabsList>

          {/* System Logs */}
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>System Logs</CardTitle>
                    <CardDescription>Application events, errors, and system messages</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={logFilter} onValueChange={setLogFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full">
                  <div className="space-y-2">
                    {filteredSystemLogs.map((log) => (
                      <div key={log.id} className="p-3 rounded-lg border bg-card/50 font-mono text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={getLevelColor(log.level)}>{getLevelIcon(log.level)}</div>
                            <Badge variant="outline" className="text-xs">
                              {log.service}
                            </Badge>
                            <Badge
                              variant={log.level === "error" ? "destructive" : "secondary"}
                              className="text-xs uppercase"
                            >
                              {log.level}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                            <Button size="icon" variant="ghost" className="h-6 w-6">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-foreground mb-2">{log.message}</p>
                        {log.details && (
                          <details className="text-xs text-muted-foreground">
                            <summary className="cursor-pointer hover:text-foreground">Details</summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Logs */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Request Logs</CardTitle>
                <CardDescription>HTTP requests, responses, and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full">
                  <div className="space-y-2">
                    {apiLogs.map((log) => (
                      <div key={log.id} className="p-3 rounded-lg border bg-card/50 font-mono text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {log.method}
                            </Badge>
                            <Badge
                              variant={log.status >= 400 ? "destructive" : "secondary"}
                              className={`text-xs ${getStatusColor(log.status)}`}
                            >
                              {log.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{log.duration}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-foreground mb-1">{log.endpoint}</p>
                        <div className="text-xs text-muted-foreground">
                          <p>IP: {log.ip}</p>
                          {log.error && <p className="text-red-500 mt-1">Error: {log.error}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Logs */}
          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>Database Query Logs</CardTitle>
                <CardDescription>SQL queries, performance, and database operations</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full">
                  <div className="space-y-2">
                    {databaseLogs.map((log) => (
                      <div key={log.id} className="p-3 rounded-lg border bg-card/50 font-mono text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={log.status === "slow" ? "destructive" : "secondary"}
                              className={`text-xs ${getStatusColor(log.status)}`}
                            >
                              {log.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{log.duration}</span>
                            <span className="text-xs text-muted-foreground">{log.rows} rows</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <pre className="text-foreground text-xs overflow-x-auto whitespace-pre-wrap break-words">
                          {log.query}
                        </pre>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
