'use client'
import { useState } from 'react'

export function useAdminFilterState() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [hoursSearchTerm, setHoursSearchTerm] = useState('')
  const [hoursStatusFilter, setHoursStatusFilter] = useState('all')
  const [selectedHours, setSelectedHours] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  return {
    activeTab, setActiveTab, searchTerm, setSearchTerm,
    statusFilter, setStatusFilter, hoursSearchTerm, setHoursSearchTerm,
    hoursStatusFilter, setHoursStatusFilter, selectedHours, setSelectedHours,
    isProcessing, setIsProcessing,
  }
}
