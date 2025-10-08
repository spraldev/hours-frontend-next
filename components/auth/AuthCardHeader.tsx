'use client'

import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AuthCardHeaderProps {
  title: string
  description: string
}

export function AuthCardHeader({ title, description }: AuthCardHeaderProps) {
  return (
    <CardHeader className="text-center pb-6">
      <div className="flex justify-center mb-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#0084ff] to-[#4f46e5] flex items-center justify-center">
          <span className="text-white font-bold text-xl">CV</span>
        </div>
      </div>
      <CardTitle className="text-2xl font-bold text-balance">{title}</CardTitle>
      <CardDescription className="text-pretty">{description}</CardDescription>
    </CardHeader>
  )
}
