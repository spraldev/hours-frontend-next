'use client'
import { useAdminAdminManagement } from './useAdminAdminManagement'
import { useAdminGraduatedStudents } from './useAdminGraduatedStudents'

export function useAdminAdminHandlers(state: any) {
  const adminManagement = useAdminAdminManagement(state)
  const graduatedStudents = useAdminGraduatedStudents(state)
  return { ...adminManagement, ...graduatedStudents }
}
