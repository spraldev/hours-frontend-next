'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/forms/Form'
import { Field } from '@/components/forms/Field'
import { PasswordField } from '@/components/forms/PasswordField'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Shield } from 'lucide-react'
import { EmailVerificationAlert } from '@/components/feedback/EmailVerificationAlert'
import Link from 'next/link'
import { useStaffLogin } from '@/hooks/mutations/useLogin'
import { getStaffErrorMessage } from '@/lib/utils/error-messages'
import toast from 'react-hot-toast'

const staffLoginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type StaffLoginInput = z.infer<typeof staffLoginSchema>

export function StaffLoginForm() {
  const [error, setError] = useState('')
  const [isEmailVerificationError, setIsEmailVerificationError] = useState(false)

  const form = useForm<StaffLoginInput>({
    resolver: zodResolver(staffLoginSchema),
    defaultValues: { rememberMe: false },
  })

  const loginMutation = useStaffLogin()

  const onSubmit = (data: StaffLoginInput) => {
    setError('')
    setIsEmailVerificationError(false)
    loginMutation.mutate(data, {
      onError: (err: any) => {
        const { message, isVerificationError } = getStaffErrorMessage(err)
        setError(message)
        setIsEmailVerificationError(isVerificationError)
        toast.error(message)
      },
    })
  }

  return (
    <div className="space-y-4">
      <Alert className="border-[#0084ff]/20 bg-[#0084ff]/5">
        <Shield className="h-4 w-4 text-[#0084ff]" />
        <AlertDescription className="text-sm">Staff login for supervisors and administrators</AlertDescription>
      </Alert>
      <EmailVerificationAlert
        error={error}
        isEmailVerificationError={isEmailVerificationError}
        credentialValue={form.getValues('email')}
        onResendSuccess={() => {
          setIsEmailVerificationError(false)
          setError('')
        }}
      />
      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <Field
          name="email"
          label="Username or Email"
          placeholder="supervisor@example.com or username"
          disabled={loginMutation.isPending}
        />
        <PasswordField name="password" label="Password" disabled={loginMutation.isPending} />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me-staff"
              checked={form.watch('rememberMe')}
              onCheckedChange={(checked) => form.setValue('rememberMe', checked === true)}
              disabled={loginMutation.isPending}
            />
            <Label htmlFor="remember-me-staff" className="text-sm text-muted-foreground cursor-pointer">
              Remember me for 30 days
            </Label>
          </div>
          <Link href="/forgot-password" className="text-sm text-[#0084ff] hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full bg-[#0084ff] hover:bg-[#0070e6] text-white" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Signing in...' : 'Sign In as Staff'}
        </Button>
      </Form>
    </div>
  )
}
