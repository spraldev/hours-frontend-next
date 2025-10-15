'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OverviewTab, StudentsTab, SupervisorsTab, HoursTab, OrganizationsTab, StatisticsTab, AdminsTab } from './index'

interface TabsContainerProps {
  state: any
  userHandlers: any
  hoursHandlers: any
  orgHandlers: any
  supervHandlers: any
  adminHandlers: any
  userHoursHandlers?: any
}

export function TabsContainer({ state, userHandlers, hoursHandlers, orgHandlers, supervHandlers, adminHandlers, userHoursHandlers }: TabsContainerProps) {
  return (
    <Tabs value={state.activeTab} onValueChange={state.setActiveTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="students">Students</TabsTrigger>
        <TabsTrigger value="supervisors">Supervisors</TabsTrigger>
        <TabsTrigger value="hours">Hours</TabsTrigger>
        <TabsTrigger value="organizations">Organizations</TabsTrigger>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
        {state.user?.role === 'superadmin' && <TabsTrigger value="admins">Admins</TabsTrigger>}
      </TabsList>
      <TabsContent value="overview">
        <OverviewTab
          overview={state.overview}
          students={state.students}
          supervisors={state.supervisors}
          pendingSupervisors={state.pendingSupervisors}
          hours={state.hours}
          organizations={state.organizations}
          isProcessing={state.isProcessing}
          onApproveSupervisor={supervHandlers.handleApproveSupervisor}
          onRejectSupervisor={supervHandlers.handleRejectSupervisor}
          onOpenDeleteGraduatedDialog={adminHandlers.handleOpenDeleteGraduatedDialog}
          userRole={state.user?.role}
          hasGraduatedStudents={state.hasGraduatedStudents}
        />
      </TabsContent>
      <TabsContent value="students">
        <StudentsTab
          students={state.filteredStudents}
          searchTerm={state.searchTerm}
          onSearchChange={state.setSearchTerm}
          onEditStudent={(student) => userHandlers.handleEditUser(student, 'student')}
          onViewHours={userHoursHandlers?.handleOpenUserHours ? (student) => userHoursHandlers.handleOpenUserHours(student, 'student') : undefined}
          isProcessing={state.isProcessing}
        />
      </TabsContent>
      <TabsContent value="supervisors">
        <SupervisorsTab
          supervisors={state.filteredSupervisors}
          searchTerm={state.supervisorSearchTerm}
          onSearchChange={state.setSupervisorSearchTerm}
          statusFilter={state.supervisorStatusFilter}
          onStatusChange={state.setSupervisorStatusFilter}
          onEditSupervisor={(supervisor) => userHandlers.handleEditUser(supervisor, 'supervisor')}
          onViewHours={userHoursHandlers?.handleOpenUserHours ? (supervisor) => userHoursHandlers.handleOpenUserHours(supervisor, 'supervisor') : undefined}
          isProcessing={state.isProcessing}
        />
      </TabsContent>
      <TabsContent value="hours">
        <HoursTab
          hours={state.filteredHours}
          allHours={state.hours}
          searchTerm={state.hoursSearchTerm}
          onSearchChange={state.setHoursSearchTerm}
          statusFilter={state.hoursStatusFilter}
          onStatusChange={state.setHoursStatusFilter}
          selectedHours={state.selectedHours}
          onSelectHour={hoursHandlers.handleSelectHour}
          onSelectAll={hoursHandlers.handleSelectAllHours}
          onApproveSelected={hoursHandlers.handleApproveHours}
          onRejectSelected={() => state.setBulkRejectDialogOpen(true)}
          onEditHour={hoursHandlers.handleEditHour}
          onDeleteHour={(hour) => state.setDeleteConfirmHour(hour)}
          onExportCSV={hoursHandlers.exportHoursToCSV}
          isProcessing={state.isProcessing}
        />
      </TabsContent>
      <TabsContent value="organizations">
        <OrganizationsTab
          organizations={state.filteredOrganizations}
          searchTerm={state.organizationsSearchTerm}
          onSearchChange={state.setOrganizationsSearchTerm}
          statusFilter={state.organizationsStatusFilter}
          onStatusChange={state.setOrganizationsStatusFilter}
          onCreateOrganization={() => state.setIsCreateOrgDialogOpen(true)}
          onEditOrganization={orgHandlers.handleEditOrganization}
          onDeleteOrganization={orgHandlers.handleDeleteOrganization}
          isProcessing={state.isProcessing}
        />
      </TabsContent>
      <TabsContent value="statistics">
        <StatisticsTab students={state.students} supervisors={state.supervisors} hours={state.hours} organizations={state.organizations} />
      </TabsContent>
      {state.user?.role === 'superadmin' && (
        <TabsContent value="admins">
          <AdminsTab
            admins={state.admins}
            onCreateAdmin={() => state.setIsCreateAdminDialogOpen(true)}
            onEditAdmin={adminHandlers.handleEditAdmin}
            isProcessing={state.isProcessing}
          />
        </TabsContent>
      )}
    </Tabs>
  )
}
