import { z } from 'zod'

export const hourCreateSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  hours: z.number().positive('Hours must be positive'),
  description: z.string().min(1, 'Description is required'),
  supervisorId: z.string().min(1, 'Supervisor is required'),
})

export const hourUpdateSchema = z.object({
  date: z.string().optional(),
  hours: z.number().positive().optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  rejectionReason: z.string().optional(),
})

export const hourBulkUpdateSchema = z.object({
  hourIds: z.array(z.string()).min(1, 'At least one hour must be selected'),
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional(),
})

export type HourCreateInput = z.infer<typeof hourCreateSchema>
export type HourUpdateInput = z.infer<typeof hourUpdateSchema>
export type HourBulkUpdateInput = z.infer<typeof hourBulkUpdateSchema>
