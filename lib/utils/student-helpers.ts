import { User } from '@/types/api'

export function getStudentInitials(user: User | null, student: any): string {
  if (user && user.firstName && user.lastName) {
    return (user.firstName[0] + user.lastName[0]).toUpperCase()
  }
  if (student && student.firstName && student.lastName) {
    return (student.firstName[0] + student.lastName[0]).toUpperCase()
  }
  return 'ST'
}

export function getStudentName(user: User | null, student: any): string {
  if (user) {
    return `${user.firstName} ${user.lastName}`
  }
  if (student) {
    return `${student.firstName} ${student.lastName}`
  }
  return 'Student'
}

export function getStudentGrade(student: any): string {
  return student ? `Grade ${student.grade}` : ''
}
