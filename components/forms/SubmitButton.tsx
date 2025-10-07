'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

interface SubmitButtonProps {
  children: ReactNode
  isLoading?: boolean
  loadingText?: string
  className?: string
  disabled?: boolean
}

export function SubmitButton({ 
  children, 
  isLoading = false,
  loadingText = 'Loading...',
  className,
  disabled
}: SubmitButtonProps) {
  return (
    <Button 
      type="submit" 
      className={className}
      disabled={isLoading || disabled}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? loadingText : children}
    </Button>
  )
}
