'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { GradientCard } from '@/components/ui/gradient-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface DashboardHeroProps {
  name: string
  grade: string
  initials: string
}

export function DashboardHero({ name, grade, initials }: DashboardHeroProps) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GradientCard variant="hero" className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-balance">Welcome back, {name}!</h1>
              <p className="text-muted-foreground">{grade} • CVHS Student</p>
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
  )
}
