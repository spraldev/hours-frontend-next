'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export function StaffRegistrationInfo() {
  return (
    <Alert className="border-[#0084ff]/20 bg-[#0084ff]/5">
      <Info className="h-4 w-4 text-[#0084ff]" />
      <AlertDescription className="text-sm">
        Staff registration requires approval from CVHS administration
      </AlertDescription>
    </Alert>
  )
}
