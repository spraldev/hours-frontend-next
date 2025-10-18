'use client'
import { useAdminAdminManagement } from './useAdminAdminManagement'
import { useAdminGraduatedStudents } from './useAdminGraduatedStudents'
import { useAdminPasswordReset } from './useAdminPasswordReset'

export function useAdminAdminHandlers(state: any) {
  const adminManagement = useAdminAdminManagement(state)
  const graduatedStudents = useAdminGraduatedStudents(state)
  const passwordReset = useAdminPasswordReset(state)
  return { ...adminManagement, ...graduatedStudents, ...passwordReset }
}
