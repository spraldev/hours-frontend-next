'use client'

import {
  EditUserDialog,
  PasswordResetDialog,
  CreateOrganizationDialog,
  EditOrganizationDialog,
  BulkRejectDialog,
  EditHourStatusDialog,
  DeleteHourDialog,
  CreateAdminDialog,
  EditAdminDialog,
  DeleteGraduatedStudentsDialog,
} from './index'

interface DialogsContainerProps {
  state: any
  userHandlers: any
  hoursHandlers: any
  orgHandlers: any
  adminHandlers: any
}

export function DialogsContainer({ state, userHandlers, hoursHandlers, orgHandlers, adminHandlers }: DialogsContainerProps) {
  return (
    <>
      <EditUserDialog
        open={state.isEditDialogOpen}
        onOpenChange={state.setIsEditDialogOpen}
        user={state.editingUser}
        onUserChange={state.setEditingUser}
        onSave={userHandlers.handleSaveUser}
        onResetPassword={userHandlers.handleResetPassword}
        isProcessing={state.isProcessing}
      />
      <PasswordResetDialog
        open={state.isResetPasswordDialogOpen}
        onOpenChange={state.setIsResetPasswordDialogOpen}
        user={state.editingUser}
        newPassword={state.newPassword}
        onPasswordChange={state.setNewPassword}
        onConfirm={userHandlers.handleConfirmPasswordReset}
        isProcessing={state.isProcessing}
      />
      <CreateOrganizationDialog
        open={state.isCreateOrgDialogOpen}
        onOpenChange={state.setIsCreateOrgDialogOpen}
        name={state.newOrgName}
        description={state.newOrgDescription}
        onNameChange={state.setNewOrgName}
        onDescriptionChange={state.setNewOrgDescription}
        onCreate={orgHandlers.handleCreateOrganization}
        isProcessing={state.isProcessing}
      />
      <EditOrganizationDialog
        open={state.isOrgDialogOpen}
        onOpenChange={state.setIsOrgDialogOpen}
        organization={state.editingOrganization}
        onOrganizationChange={state.setEditingOrganization}
        onSave={orgHandlers.handleSaveOrganization}
        isProcessing={state.isProcessing}
      />
      <BulkRejectDialog
        open={state.bulkRejectDialogOpen}
        onOpenChange={state.setBulkRejectDialogOpen}
        selectedCount={state.selectedHours.length}
        reason={state.bulkRejectionReason}
        onReasonChange={state.setBulkRejectionReason}
        onConfirm={hoursHandlers.handleBulkReject}
        isProcessing={state.isProcessing}
      />
      <EditHourStatusDialog
        open={!!state.editingHour}
        onOpenChange={(open) => !open && state.setEditingHour(null)}
        hour={state.editingHour}
        status={state.editHourStatus}
        onStatusChange={state.setEditHourStatus}
        rejectionReason={state.editRejectionReason}
        onRejectionReasonChange={state.setEditRejectionReason}
        onSave={hoursHandlers.handleSaveHourEdit}
        isProcessing={state.isProcessing}
      />
      <DeleteHourDialog
        open={!!state.deleteConfirmHour}
        onOpenChange={(open) => !open && state.setDeleteConfirmHour(null)}
        hour={state.deleteConfirmHour}
        onConfirm={hoursHandlers.handleDeleteHour}
        isProcessing={state.isProcessing}
      />
      <CreateAdminDialog
        open={state.isCreateAdminDialogOpen}
        onOpenChange={state.setIsCreateAdminDialogOpen}
        username={state.newAdminUsername}
        password={state.newAdminPassword}
        email={state.newAdminEmail}
        role={state.newAdminRole}
        onUsernameChange={state.setNewAdminUsername}
        onPasswordChange={state.setNewAdminPassword}
        onEmailChange={state.setNewAdminEmail}
        onRoleChange={state.setNewAdminRole}
        onCreate={adminHandlers.handleCreateAdmin}
        isProcessing={state.isProcessing}
      />
      <EditAdminDialog
        open={state.isAdminDialogOpen}
        onOpenChange={state.setIsAdminDialogOpen}
        admin={state.editingAdmin}
        onAdminChange={state.setEditingAdmin}
        onSave={adminHandlers.handleSaveAdmin}
        isProcessing={state.isProcessing}
      />
      <DeleteGraduatedStudentsDialog
        open={state.isDeleteGraduatedDialogOpen}
        onOpenChange={state.setIsDeleteGraduatedDialogOpen}
        students={state.graduatedStudents}
        isLoading={state.isLoadingGraduatedStudents}
        onConfirm={adminHandlers.handleDeleteGraduatedStudents}
        isProcessing={state.isProcessing}
      />
    </>
  )
}
