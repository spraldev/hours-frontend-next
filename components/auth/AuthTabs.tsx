'use client'

import { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, UserCheck } from 'lucide-react'

interface AuthTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  studentContent: ReactNode
  staffContent: ReactNode
}

export function AuthTabs({ activeTab, onTabChange, studentContent, staffContent }: AuthTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="student" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Student
        </TabsTrigger>
        <TabsTrigger value="staff" className="flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          Staff
        </TabsTrigger>
      </TabsList>
      <TabsContent value="student">{studentContent}</TabsContent>
      <TabsContent value="staff">{staffContent}</TabsContent>
    </Tabs>
  )
}
