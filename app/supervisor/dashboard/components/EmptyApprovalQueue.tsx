'use client'

import React from 'react'
import { CheckCircle } from 'lucide-react'

export function EmptyApprovalQueue() {
  return (
    <div className="text-center py-12">
      <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
      <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
      <p className="text-muted-foreground text-pretty">
        No pending approvals at the moment. Great job staying on top of student submissions!
      </p>
    </div>
  )
}
