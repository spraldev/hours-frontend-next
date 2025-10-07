'use client'

import { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import toast from 'react-hot-toast'

interface EmailVerificationAlertProps {
  error: string
  isEmailVerificationError: boolean
  credentialValue: string
  onResendSuccess: () => void
}

export function EmailVerificationAlert({
  error,
  isEmailVerificationError,
  credentialValue,
  onResendSuccess,
}: EmailVerificationAlertProps) {
  const [isResending, setIsResending] = useState(false)

  const handleResend = async () => {
    if (!credentialValue) {
      toast.error('Please enter your credentials first')
      return
    }

    setIsResending(true)
    try {
      const response = await apiClient.post('/auth/resend-verification', { studentId: credentialValue })
      if (response.success) {
        toast.success('Verification email sent! Please check your inbox.')
        onResendSuccess()
      } else {
        toast.error(response.message || 'Failed to resend verification email')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend verification email')
    } finally {
      setIsResending(false)
    }
  }

  if (!error) return null

  return (
    <>
      <Alert
        variant={isEmailVerificationError ? 'default' : 'destructive'}
        className={isEmailVerificationError ? 'border-amber-500/50 bg-amber-500/10' : ''}
      >
        <AlertCircle className={`h-4 w-4 ${isEmailVerificationError ? 'text-amber-500' : ''}`} />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      {isEmailVerificationError && (
        <Alert className="border-[#0084ff]/20 bg-[#0084ff]/5">
          <AlertDescription className="space-y-3">
            <p className="text-sm font-medium">Haven't received the verification email?</p>
            <Button
              onClick={handleResend}
              disabled={isResending}
              className="w-full bg-[#0084ff] hover:bg-[#0070e6] text-white"
              size="sm"
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
