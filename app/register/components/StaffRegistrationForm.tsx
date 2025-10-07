'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supervisorRegistrationSchema, SupervisorRegistrationInput } from '@/lib/api/schemas/auth'
import { Form } from '@/components/forms/Form'
import { Field } from '@/components/forms/Field'
import { PasswordField } from '@/components/forms/PasswordField'
import { FormAlerts } from '@/components/forms/FormAlerts'
import { Button } from '@/components/ui/button'
import { StaffRegistrationInfo } from './StaffRegistrationInfo'
import { OrganizationField } from './OrganizationField'
import { ProofTypeField } from './ProofTypeField'
import { VerificationField } from './VerificationField'
import { useStaffRegister } from '@/hooks/mutations/useRegister'
import { getStaffRegistrationError } from '@/lib/utils/registration-errors'
import { buildStaffRegistrationPayload } from '@/lib/utils/staff-registration'
import toast from 'react-hot-toast'

export function StaffRegistrationForm() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedOrganization, setSelectedOrganization] = useState<{ id: string; name: string; isNew?: boolean } | null>(null)

  const form = useForm<SupervisorRegistrationInput>({
    resolver: zodResolver(supervisorRegistrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      organizationName: '',
      organizationId: '',
      isNewOrganization: false,
      organizationDescription: '',
      proofOfExistence: '',
      proofType: 'email',
    },
  })

  const registerMutation = useStaffRegister()

  const onSubmit = (data: SupervisorRegistrationInput) => {
    try {
      setError('')
      setSuccess('')
      const payload = buildStaffRegistrationPayload(data, selectedOrganization)
      registerMutation.mutate(payload, {
        onSuccess: () => {
          setSuccess('Registration submitted! Your account will be reviewed by an administrator.')
        },
        onError: (err: any) => {
          const errorMessage = getStaffRegistrationError(err)
          setError(errorMessage)
          toast.error(errorMessage)
        },
      })
    } catch (err: any) {
      setError(err.message || 'Please select an organization')
    }
  }

  return (
    <div className="space-y-4">
      <StaffRegistrationInfo />
      <FormAlerts error={error} success={success} />
      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field name="firstName" label="First Name" placeholder="Jane" disabled={registerMutation.isPending} />
          <Field name="lastName" label="Last Name" placeholder="Smith" disabled={registerMutation.isPending} />
        </div>
        <OrganizationField
          form={form}
          selectedOrganization={selectedOrganization}
          onOrganizationChange={setSelectedOrganization}
          disabled={registerMutation.isPending}
        />
        <Field
          name="email"
          label="Email"
          type="email"
          placeholder="jane.smith@organization.org"
          disabled={registerMutation.isPending}
        />
        <PasswordField name="password" label="Password" placeholder="Create a strong password" disabled={registerMutation.isPending} />
        <ProofTypeField form={form} disabled={registerMutation.isPending} />
        <VerificationField form={form} disabled={registerMutation.isPending} />
        <Button type="submit" className="w-full bg-[#0084ff] hover:bg-[#0070e6] text-white" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? 'Submitting Request...' : 'Request Staff Account'}
        </Button>
      </Form>
    </div>
  )
}
