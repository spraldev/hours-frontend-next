import { z } from 'zod'

export const loginSchema = z.object({
  studentId: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
}).refine(data => data.studentId || data.email, {
  message: 'Either student ID or email is required',
})

export const studentRegistrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  graduationYear: z.number().int().min(2024).max(2030),
  email: z.string().email('Must be a valid email').endsWith('@stu.gusd.net', 'Must use school email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const supervisorRegistrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Must be a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  organizationName: z.string().min(1, 'Organization name is required'),
  organizationId: z.string().optional(),
  isNewOrganization: z.boolean(),
  organizationDescription: z.string().optional(),
  proofOfExistence: z.string().min(1, 'Proof of existence is required'),
  proofType: z.enum(['email', 'website', 'document', 'other']),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Must be a valid email').optional(),
  studentId: z.string().optional(),
}).refine(data => data.email || data.studentId, {
  message: 'Either email or student ID is required',
})

export type LoginInput = z.infer<typeof loginSchema>
export type StudentRegistrationInput = z.infer<typeof studentRegistrationSchema>
export type SupervisorRegistrationInput = z.infer<typeof supervisorRegistrationSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
