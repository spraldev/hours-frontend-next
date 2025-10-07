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
  return (
    <div className="space-y-2">
      <Label htmlFor="organization">Organization</Label>
      <OrganizationSelector
        value={selectedOrganization}
        onChange={onOrganizationChange}
        disabled={disabled}
        placeholder="Select organization"
        required
        className="bg-muted/50"
      />
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
