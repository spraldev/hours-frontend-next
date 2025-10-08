'use client'

import { Button } from '@/components/ui/button'
import { Calendar, Plus } from 'lucide-react'
import Link from 'next/link'

interface EmptyHoursStateProps {
  searchTerm: string
  statusFilter: string
}

export function EmptyHoursState({ searchTerm, statusFilter }: EmptyHoursStateProps) {
  return (
    <div className="text-center py-12">
      <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No hours found</h3>
      <p className="text-muted-foreground mb-4 text-pretty">
        {searchTerm || statusFilter !== 'all'
          ? 'Try adjusting your filters to see more results.'
          : 'Start logging your community service hours to see them here.'}
      </p>
      <Button asChild className="bg-[#0084ff] hover:bg-[#0070e6] text-white">
        <Link href="/student/hours/add">
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Hours
        </Link>
      </Button>
    </div>
  )
}
