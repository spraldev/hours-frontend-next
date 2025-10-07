'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { studentRegistrationSchema, StudentRegistrationInput } from '@/lib/api/schemas/auth'
import { Form } from '@/components/forms/Form'
import { Field } from '@/components/forms/Field'
import { PasswordField } from '@/components/forms/PasswordField'
import { FormAlerts } from '@/components/forms/FormAlerts'
import { Button } from '@/components/ui/button'
import { GraduationYearField } from './GraduationYearField'
import { useStudentRegister } from '@/hooks/mutations/useRegister'
import { getStudentRegistrationError } from '@/lib/utils/registration-errors'
import toast from 'react-hot-toast'

export function StudentRegistrationForm() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const form = useForm<StudentRegistrationInput>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      studentId: '',
      graduationYear: 0,
      email: '',
      password: '',
    },
  })

  const registerMutation = useStudentRegister()

  const onSubmit = (data: StudentRegistrationInput) => {
    setError('')
    setSuccess('')
    registerMutation.mutate(data, {
      onSuccess: () => {
        setSuccess('Registration successful! Please check your email to verify your account.')
      },
      onError: (err: any) => {
        const errorMessage = getStudentRegistrationError(err)
        setError(errorMessage)
        toast.error(errorMessage)
      },
    })
  }

  return (
    <div className="space-y-4">
      <FormAlerts error={error} success={success} />
      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field name="firstName" label="First Name" placeholder="John" disabled={registerMutation.isPending} />
          <Field name="lastName" label="Last Name" placeholder="Doe" disabled={registerMutation.isPending} />
        </div>
        <Field name="studentId" label="Student ID" placeholder="123456" disabled={registerMutation.isPending} />
        <GraduationYearField form={form} disabled={registerMutation.isPending} />
        <Field
          name="email"
          label="School Email"
          type="email"
          placeholder="jfal1234@stu.gusd.net"
          disabled={registerMutation.isPending}
        />
        <PasswordField name="password" label="Password" placeholder="Create a strong password" disabled={registerMutation.isPending} />
        <Button type="submit" className="w-full bg-[#0084ff] hover:bg-[#0070e6] text-white" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? 'Creating Account...' : 'Create Student Account'}
        </Button>
      </Form>
    </div>
  )
}
