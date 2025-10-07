'use client'

import { useState } from 'react'

export function useAdminDialogs() {
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingOrganization, setEditingOrganization] = useState<any>(null)
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false)
  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [editingHour, setEditingHour] = useState<any>(null)
  const [deleteConfirmHour, setDeleteConfirmHour] = useState<any>(null)
  const [bulkRejectDialogOpen, setBulkRejectDialogOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<any>(null)
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false)
  const [isCreateAdminDialogOpen, setIsCreateAdminDialogOpen] = useState(false)
  const [isDeleteGraduatedDialogOpen, setIsDeleteGraduatedDialogOpen] = useState(false)

  return {
    editingUser,
    setEditingUser,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingOrganization,
    setEditingOrganization,
    isOrgDialogOpen,
    setIsOrgDialogOpen,
    isCreateOrgDialogOpen,
    setIsCreateOrgDialogOpen,
    isResetPasswordDialogOpen,
    setIsResetPasswordDialogOpen,
    editingHour,
    setEditingHour,
    deleteConfirmHour,
    setDeleteConfirmHour,
    bulkRejectDialogOpen,
    setBulkRejectDialogOpen,
    editingAdmin,
    setEditingAdmin,
    isAdminDialogOpen,
    setIsAdminDialogOpen,
    isCreateAdminDialogOpen,
    setIsCreateAdminDialogOpen,
    isDeleteGraduatedDialogOpen,
    setIsDeleteGraduatedDialogOpen,
  }
}
