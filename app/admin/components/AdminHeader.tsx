'use client'

import { GradientCard } from '@/components/ui/gradient-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Server, Download } from 'lucide-react'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { useState } from 'react'

interface AdminHeaderProps {
  onExportClick: () => void
}

export function AdminHeader({ onExportClick }: AdminHeaderProps) {

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
              onClick={onExportClick}
              variant="default"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Hours
            </Button>
          </div>
        </div>
      </GradientCard>
    </div>
  )
}
