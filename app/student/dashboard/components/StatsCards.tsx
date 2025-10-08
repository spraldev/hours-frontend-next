'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GradientCard } from '@/components/ui/gradient-card'
import { Clock, AlertCircle, TrendingUp, Building2 } from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { motion } from 'framer-motion'

interface StatsCardsProps {
  totalHours: number
  pendingHours: number
  thisMonth: number
  organizations: number
}

export function StatsCards({ totalHours, pendingHours, thisMonth, organizations }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <GradientCard variant="stat" className="p-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-[#0084ff]">
                  <AnimatedCounter value={totalHours} />
                </div>
                <p className="text-xs text-muted-foreground">hours completed</p>
              </div>
              <Clock className="h-8 w-8 text-[#0084ff]/60" />
            </div>
          </CardContent>
        </GradientCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card className="p-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  <AnimatedCounter value={pendingHours} />
                </div>
                <p className="text-xs text-muted-foreground">hours waiting</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500/60" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <Card className="p-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  <AnimatedCounter value={thisMonth} />
                </div>
                <p className="text-xs text-muted-foreground">hours logged</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500/60" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
        <Card className="p-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Organizations</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  <AnimatedCounter value={organizations} />
                </div>
                <p className="text-xs text-muted-foreground">volunteered with</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-500/60" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
