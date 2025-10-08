import { z } from 'zod'

export const studentUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  graduationYear: z.number().int().min(2024).max(2030).optional(),
  verified: z.boolean().optional(),
})

export const supervisorUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  organizationId: z.string().optional(),
  approved: z.boolean().optional(),
})

export const adminCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Must be a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'superadmin']),
})

export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>
export type SupervisorUpdateInput = z.infer<typeof supervisorUpdateSchema>
export type AdminCreateInput = z.infer<typeof adminCreateSchema>
