'use client'
import { useMemo } from 'react'

export function useAdminFiltering(
  students: any[],
  supervisors: any[],
  hours: any[],
  organizations: any[],
  searchTerm: string,
  statusFilter: string,
  supervisorSearchTerm: string,
  supervisorStatusFilter: string,
  hoursSearchTerm: string,
  hoursStatusFilter: string,
  organizationsSearchTerm: string,
  organizationsStatusFilter: string
) {
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    return students.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const email = u.email.toLowerCase();
      const studentId = u.studentId || '';
      const searchLower = searchTerm.toLowerCase();
      
      return fullName.includes(searchLower) ||
             email.includes(searchLower) ||
             studentId.includes(searchLower);
    });
  }, [students, searchTerm])
  const filteredSupervisors = useMemo(() => {
    if (!supervisorSearchTerm) return supervisors;
    return supervisors.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const email = u.email.toLowerCase();
      const searchLower = supervisorSearchTerm.toLowerCase();
      
      const matchesSearch = fullName.includes(searchLower) || email.includes(searchLower);
      const matchesStatus =
        supervisorStatusFilter === 'all' ||
        (supervisorStatusFilter === 'approved' && u.isActive) ||
        (supervisorStatusFilter === 'pending' && !u.isActive)
      return matchesSearch && matchesStatus;
    });
  }, [supervisors, supervisorSearchTerm, supervisorStatusFilter])
  const filteredHours = useMemo(() => hours.filter((entry) => {
    const student = typeof entry.student === 'string' ? null : entry.student
    const studentName = student ? `${student.firstName} ${student.lastName}` : ''
    const matchesSearch =
      studentName.toLowerCase().includes(hoursSearchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(hoursSearchTerm.toLowerCase())
    const matchesStatus = hoursStatusFilter === 'all' || entry.status === hoursStatusFilter
    return matchesSearch && matchesStatus
  }), [hours, hoursSearchTerm, hoursStatusFilter])

  const filteredOrganizations = useMemo(() => {
    if (!organizationsSearchTerm) return organizations;
    return organizations.filter((org) => {
      const name = org.name.toLowerCase();
      const description = (org.description || '').toLowerCase();
      const contactEmail = (org.contactEmail || '').toLowerCase();
      const searchLower = organizationsSearchTerm.toLowerCase();
      
      const matchesSearch = 
        name.includes(searchLower) || 
        description.includes(searchLower) || 
        contactEmail.includes(searchLower);
      
      const matchesStatus = 
        organizationsStatusFilter === 'all' || 
        (organizationsStatusFilter === 'active' && org.isActive) ||
        (organizationsStatusFilter === 'inactive' && !org.isActive);
      
      return matchesSearch && matchesStatus;
    });
  }, [organizations, organizationsSearchTerm, organizationsStatusFilter])

  return { filteredStudents, filteredSupervisors, filteredHours, filteredOrganizations }
}
