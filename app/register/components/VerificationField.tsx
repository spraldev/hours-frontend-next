'use client'

import { UseFormReturn } from 'react-hook-form'
import { Field } from '@/components/forms/Field'
import { Label } from '@/components/ui/label'

interface VerificationFieldProps {
  form: UseFormReturn<any>
  disabled?: boolean
}

export function VerificationField({ form, disabled }: VerificationFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="proofOfExistence">Verification Information</Label>
      <Label htmlFor="proofOfExistence" className="text-sm text-muted-foreground">
        Please provide how we can verify your role
      </Label>
      <Field
        name="proofOfExistence"
        label=""
        placeholder="Ex: Organization website, LinkedIn profile, etc"
        disabled={disabled}
      />
    </div>
  )
}
