import React from 'react'
import { User } from '@/types/api'

export function getSupervisorInitials(user: User | null, supervisor: any): string {
  if (user && user.firstName && user.lastName) {
    return (user.firstName[0] + user.lastName[0]).toUpperCase()
  }
  if (supervisor && supervisor.firstName && supervisor.lastName) {
    return (supervisor.firstName[0] + supervisor.lastName[0]).toUpperCase()
  }
  return 'SU'
}

export function getSupervisorName(user: User | null, supervisor: any): string {
  if (user) {
    return `${user.firstName} ${user.lastName}`
  }
  if (supervisor) {
    return `${supervisor.firstName} ${supervisor.lastName}`
  }
  return 'Supervisor'
}

export function getOrganizationName(supervisor: any): string {
  return supervisor?.organization?.name || 'Organization'
}

export function getTimeAgo(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}
