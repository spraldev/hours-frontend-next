'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function BackButton() {
  return (
    <Button asChild variant="ghost" className="mb-6">
      <Link href="/">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
    </Button>
  )
}
