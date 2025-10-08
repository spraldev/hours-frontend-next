'use client'

import { GradientCard } from '@/components/ui/gradient-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Server, Download } from 'lucide-react'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { exportAllStudentsHoursToCSV } from '@/lib/utils/admin-export'
import toast from 'react-hot-toast'
import { useState } from 'react'

export function AdminHeader() {
  const { students, hours } = useAdminDashboard()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportAllStudentsHours = async () => {
    setIsExporting(true)
    try {
      if (!students || students.length === 0) {
        toast.error("No students data available to export")
        return
      }
      
      exportAllStudentsHoursToCSV(students, hours || [])
      toast.success("All students' hours exported successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to export students' hours")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="mb-8">
      <GradientCard variant="hero" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-balance">Admin Dashboard</h1>
            <p className="text-muted-foreground">CVHS Community Service Hours Administration</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleExportAllStudentsHours}
              disabled={isExporting}
              variant="default"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Exporting..." : "Export All Hours"}
            </Button>
          </div>
        </div>
      </GradientCard>
    </div>
  )
}
