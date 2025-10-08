'use client'

import React from 'react'
import { Clock } from 'lucide-react'

interface EmptyAllHoursProps {
  searchTerm: string
  statusFilter: string
}

export function EmptyAllHours({ searchTerm, statusFilter }: EmptyAllHoursProps) {
  return (
    <div className="text-center py-12">
      <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No hours found</h3>
      <p className="text-muted-foreground text-pretty">
        {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters to see more results.' : 'No service hours have been submitted yet.'}
      </p>
    </div>
  )
}
