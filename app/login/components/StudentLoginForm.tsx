'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/forms/Form'
import { Field } from '@/components/forms/Field'
import { PasswordField } from '@/components/forms/PasswordField'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { EmailVerificationAlert } from '@/components/feedback/EmailVerificationAlert'
import Link from 'next/link'
import { useStudentLogin } from '@/hooks/mutations/useLogin'
import toast from 'react-hot-toast'

const studentLoginSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type StudentLoginInput = z.infer<typeof studentLoginSchema>

export function StudentLoginForm() {
  const [error, setError] = useState('')
  const [isEmailVerificationError, setIsEmailVerificationError] = useState(false)

  const form = useForm<StudentLoginInput>({
    resolver: zodResolver(studentLoginSchema),
    defaultValues: { studentId: '', password: '', rememberMe: false },
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const loginMutation = useStudentLogin()



  const onSubmit = (data: StudentLoginInput) => {
    
    setError('')
    setIsEmailVerificationError(false)
    loginMutation.mutate(data, {
      onError: (err: any) => {
        const errorMessage = err.message || ''
        if (errorMessage.toLowerCase().includes('verify') && errorMessage.toLowerCase().includes('email')) {
          setIsEmailVerificationError(true)
        }
        setError(errorMessage)
        toast.error(errorMessage)
      },
    })
  }

  return (
    <div className="space-y-4">
      <EmailVerificationAlert
        error={error}
        isEmailVerificationError={isEmailVerificationError}
        credentialValue={form.getValues('studentId')}
        onResendSuccess={() => {
          setIsEmailVerificationError(false)
          setError('')
        }}
      />
      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <Field name="studentId" label="Student ID" placeholder="123456" disabled={loginMutation.isPending} />
        <PasswordField name="password" label="Password" disabled={loginMutation.isPending} />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me-student"
              checked={form.watch('rememberMe')}
              onCheckedChange={(checked) => form.setValue('rememberMe', checked === true)}
              disabled={loginMutation.isPending}
            />
            <Label htmlFor="remember-me-student" className="text-sm text-muted-foreground cursor-pointer">
              Remember me for 30 days
            </Label>
          </div>
          <Link href="/forgot-password" className="text-sm text-[#0084ff] hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full bg-[#0084ff] hover:bg-[#0070e6] text-white" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Signing in...' : 'Sign In as Student'}
        </Button>
      </Form>
    </div>
  )
}
