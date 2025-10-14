'use client'

import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { OrganizationSelector } from '@/components/ui/organization-selector'

interface OrganizationFieldProps {
  form: UseFormReturn<any>
  selectedOrganization: { id: string; name: string; isNew?: boolean } | null
  onOrganizationChange: (org: { id: string; name: string; isNew?: boolean } | null) => void
  disabled?: boolean
}

export function OrganizationField({ form, selectedOrganization, onOrganizationChange, disabled }: OrganizationFieldProps) {
  const handleOrganizationChange = (org: { id: string; name: string; isNew?: boolean } | null) => {
    onOrganizationChange(org)
    // Update form fields when organization changes
    if (org) {
      form.setValue('organizationName', org.name, { shouldValidate: true })
      form.setValue('organizationId', org.isNew ? '' : org.id, { shouldValidate: true })
      form.setValue('isNewOrganization', org.isNew || false, { shouldValidate: true })
    } else {
      form.setValue('organizationName', '', { shouldValidate: true })
      form.setValue('organizationId', '', { shouldValidate: true })
      form.setValue('isNewOrganization', false, { shouldValidate: true })
    }
  }

  const { error, isTouched, invalid } = form.getFieldState('organizationName', form.formState)
  const showError = (invalid || !!error) && (isTouched || form.formState.isSubmitted)

  return (
    <div className="space-y-2">
      <Label htmlFor="organization">Organization</Label>
      <OrganizationSelector
        value={selectedOrganization}
        onChange={handleOrganizationChange}
        disabled={disabled}
        placeholder="Select organization"
        required
        className="bg-muted/50"
      />
      {showError && (
        <p className="text-xs text-destructive">
          {String(error?.message || 'Organization is required')}
        </p>
      )}
      {selectedOrganization?.isNew && (
        <div className="space-y-2">
          <Label htmlFor="organizationDescription" className="text-sm text-muted-foreground">
            Brief description (optional)
          </Label>
          <Textarea
            id="organizationDescription"
            placeholder="What does this organization do?"
            className="bg-muted/50 min-h-[60px] resize-none"
            {...form.register('organizationDescription')}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  )
}
