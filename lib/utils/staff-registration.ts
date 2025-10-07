import { SupervisorRegistrationInput } from '@/lib/api/schemas/auth'

export function buildStaffRegistrationPayload(
  data: SupervisorRegistrationInput,
  selectedOrganization: { id: string; name: string; isNew?: boolean } | null
) {
  if (!selectedOrganization) {
    throw new Error('Please select an organization')
  }

  return {
    ...data,
    organizationName: selectedOrganization.name,
    organizationId: selectedOrganization.isNew ? undefined : selectedOrganization.id,
    isNewOrganization: selectedOrganization.isNew || false,
    organizationDescription: selectedOrganization.isNew ? data.organizationDescription : undefined,
  }
}
