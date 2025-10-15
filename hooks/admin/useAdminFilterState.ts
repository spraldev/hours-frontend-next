'use client'
import { useState } from 'react'

export function useAdminFilterState() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [supervisorSearchTerm, setSupervisorSearchTerm] = useState('')
  const [supervisorStatusFilter, setSupervisorStatusFilter] = useState('all')
  const [hoursSearchTerm, setHoursSearchTerm] = useState('')
  const [hoursStatusFilter, setHoursStatusFilter] = useState('all')
  const [organizationsSearchTerm, setOrganizationsSearchTerm] = useState('')
  const [organizationsStatusFilter, setOrganizationsStatusFilter] = useState('all')
  const [selectedHours, setSelectedHours] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  return {
    activeTab, setActiveTab, searchTerm, setSearchTerm,
    statusFilter, setStatusFilter, 
    supervisorSearchTerm, setSupervisorSearchTerm,
    supervisorStatusFilter, setSupervisorStatusFilter,
    hoursSearchTerm, setHoursSearchTerm,
    hoursStatusFilter, setHoursStatusFilter,
    organizationsSearchTerm, setOrganizationsSearchTerm,
    organizationsStatusFilter, setOrganizationsStatusFilter,
    selectedHours, setSelectedHours,
    isProcessing, setIsProcessing,
  }
}
