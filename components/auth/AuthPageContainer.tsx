'use client'

import { ReactNode } from 'react'

interface AuthPageContainerProps {
  children: ReactNode
}

export function AuthPageContainer({ children }: AuthPageContainerProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0084ff]/10 via-[#4f46e5]/5 to-[#7c3aed]/10" />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  )
}
