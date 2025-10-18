'use client'
import { useState } from 'react'

export function useAdminDialogState() {
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [editingOrganization, setEditingOrganization] = useState<any>(null)
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false)
  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [newOrgDescription, setNewOrgDescription] = useState('')
  const [editingHour, setEditingHour] = useState<any>(null)
  const [deleteConfirmHour, setDeleteConfirmHour] = useState<any>(null)
  const [editHourStatus, setEditHourStatus] = useState<'approved' | 'pending' | 'rejected'>('pending')
  const [editRejectionReason, setEditRejectionReason] = useState('')
  const [bulkRejectDialogOpen, setBulkRejectDialogOpen] = useState(false)
  const [bulkRejectionReason, setBulkRejectionReason] = useState('')
  const [editingAdmin, setEditingAdmin] = useState<any>(null)
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false)
  const [isCreateAdminDialogOpen, setIsCreateAdminDialogOpen] = useState(false)
  const [newAdminUsername, setNewAdminUsername] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminRole, setNewAdminRole] = useState('admin')
  const [isDeleteGraduatedDialogOpen, setIsDeleteGraduatedDialogOpen] = useState(false)
  const [graduatedStudents, setGraduatedStudents] = useState<any[]>([])
  const [isLoadingGraduatedStudents, setIsLoadingGraduatedStudents] = useState(false)
  const [hasGraduatedStudents, setHasGraduatedStudents] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isUserHoursDialogOpen, setIsUserHoursDialogOpen] = useState(false)
  const [userHoursSearchTerm, setUserHoursSearchTerm] = useState('')
  const [userHoursStatusFilter, setUserHoursStatusFilter] = useState('all')
  const [selectedUserHours, setSelectedUserHours] = useState<string[]>([])
  const [selectedSupervisorForActivity, setSelectedSupervisorForActivity] = useState<any>(null)
  const [isSupervisorActivityDialogOpen, setIsSupervisorActivityDialogOpen] = useState(false)
  const [isExportClassDialogOpen, setIsExportClassDialogOpen] = useState(false)
  const [isResetAdminPasswordDialogOpen, setIsResetAdminPasswordDialogOpen] = useState(false)
  const [resetPasswordAdmin, setResetPasswordAdmin] = useState<any>(null)
  
  return {
    editingUser, setEditingUser, isEditDialogOpen, setIsEditDialogOpen,
    isResetPasswordDialogOpen, setIsResetPasswordDialogOpen, newPassword, setNewPassword,
    editingOrganization, setEditingOrganization, isOrgDialogOpen, setIsOrgDialogOpen,
    isCreateOrgDialogOpen, setIsCreateOrgDialogOpen, newOrgName, setNewOrgName,
    newOrgDescription, setNewOrgDescription, editingHour, setEditingHour,
    deleteConfirmHour, setDeleteConfirmHour, editHourStatus, setEditHourStatus,
    editRejectionReason, setEditRejectionReason, bulkRejectDialogOpen, setBulkRejectDialogOpen,
    bulkRejectionReason, setBulkRejectionReason, editingAdmin, setEditingAdmin,
    isAdminDialogOpen, setIsAdminDialogOpen, isCreateAdminDialogOpen, setIsCreateAdminDialogOpen,
    newAdminUsername, setNewAdminUsername, newAdminPassword, setNewAdminPassword,
    newAdminEmail, setNewAdminEmail, newAdminRole, setNewAdminRole,
    isDeleteGraduatedDialogOpen, setIsDeleteGraduatedDialogOpen,
    graduatedStudents, setGraduatedStudents,
    isLoadingGraduatedStudents, setIsLoadingGraduatedStudents,
    hasGraduatedStudents, setHasGraduatedStudents,
    selectedUser, setSelectedUser,
    isUserHoursDialogOpen, setIsUserHoursDialogOpen,
    userHoursSearchTerm, setUserHoursSearchTerm,
    userHoursStatusFilter, setUserHoursStatusFilter,
    selectedUserHours, setSelectedUserHours,
    selectedSupervisorForActivity, setSelectedSupervisorForActivity,
    isSupervisorActivityDialogOpen, setIsSupervisorActivityDialogOpen,
    isExportClassDialogOpen, setIsExportClassDialogOpen,
    isResetAdminPasswordDialogOpen, setIsResetAdminPasswordDialogOpen,
    resetPasswordAdmin, setResetPasswordAdmin,
  }
}
