"use client"

import type React from "react"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { OrganizationSelector } from "@/components/ui/organization-selector"
import { SupervisorSelector } from "@/components/ui/supervisor-selector"
import type { Supervisor, Organization } from "@/types/api"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, Info, Save, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import toast from "react-hot-toast"

export default function AddHoursPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hours, setHours] = useState("")
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null)
  const [availableOrganizations, setAvailableOrganizations] = useState<Organization[]>([])
  const [loadingOrganizations, setLoadingOrganizations] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState<{id: string, name: string, isNew?: boolean} | null>(null)
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const handleSupervisorChange = async (supervisor: Supervisor | null) => {
    console.log("handleSupervisorChange called with:", supervisor)
    setSelectedSupervisor(supervisor)
    setSelectedOrganization(null)
    setAvailableOrganizations([])
    
    if (!supervisor) {
      return
    }
    
    console.log("Supervisor id:", supervisor.id)
    setLoadingOrganizations(true)
    setError("")
    try {
      const response = await apiClient.get(`/student/supervisor-organizations?supervisorId=${supervisor.id}`)
      console.log("Supervisor organizations response:", response)
      
      if (response.success && response.data) {
        // Map _id to id for the OrganizationSelector
        const mappedOrganizations = response.data.map((org: any) => ({
          id: org._id || org.id,
          name: org.name,
          verified: org.isActive || false
        }))
        console.log("Mapped organizations:", mappedOrganizations)
        setAvailableOrganizations(mappedOrganizations)
      } else {
        console.error("Failed to fetch organizations:", response)
        setError("No organizations found for this supervisor")
      }
    } catch (err: any) {
      setError("Failed to load supervisor's organizations")
      console.error("Error loading organizations:", err)
    } finally {
      setLoadingOrganizations(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (!date) {
      setError("Please select a date")
      setIsSubmitting(false)
      return
    }

    if (!selectedSupervisor) {
      setError("Please select a supervisor")
      setIsSubmitting(false)
      return
    }

    if (!selectedOrganization) {
      setError("Please select an organization")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await apiClient.post("/student/submit-hour", {
        date: date.toISOString(),
        hours: parseFloat(hours),
        organizationName: selectedOrganization.name,
        supervisorEmail: selectedSupervisor.email,
        description: description,
      })

      console.log("Response:", response)

      if (response.success) {
        toast.success("Hours submitted successfully")
        router.push("/student/dashboard")
      } else {
        // Handle case where API returns but with success: false
        setError(response.message || "Submission failed")
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit hours. Please try again.")
      console.error("Error submitting hours:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell userRole="student">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <PageHeader
          title="Add Service Hours"
          subtitle="Log your community service activities for approval"
          showBack
          onBack={() => router.back()}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Basic Information */}
          <Card>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Service Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours">Hours Worked *</Label>
                  <Input 
                    id="hours" 
                    type="number" 
                    step="0.5" 
                    min="0.5" 
                    max="24" 
                    placeholder="4.0" 
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    required 
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supervisor">Supervisor *</Label>
                <SupervisorSelector
                  value={selectedSupervisor}
                  onChange={handleSupervisorChange}
                  disabled={isSubmitting}
                  placeholder="Select your supervisor"
                  required
                />
                {selectedSupervisor && (
                  <p className="text-xs text-muted-foreground">
                    {selectedSupervisor.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization *</Label>
                {loadingOrganizations ? (
                  <div className="flex items-center justify-center h-10 border rounded-md bg-muted/50">
                    <div className="h-4 w-4 border-2 border-[#0084ff] border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-sm text-muted-foreground">Loading organizations...</span>
                  </div>
                ) : !selectedSupervisor ? (
                  <div className="flex items-center h-10 px-3 border rounded-md bg-muted/50">
                    <span className="text-sm text-muted-foreground">Select a supervisor first</span>
                  </div>
                ) : availableOrganizations.length === 0 ? (
                  <div className="flex flex-col h-auto min-h-10 px-3 py-2 border rounded-md bg-muted/50">
                    <span className="text-sm text-muted-foreground">
                      No organizations available for this supervisor
                    </span>
                    {selectedSupervisor && (
                      <span className="text-xs text-muted-foreground mt-1">
                        Selected: {selectedSupervisor.firstName} {selectedSupervisor.lastName} ({selectedSupervisor._id})
                      </span>
                    )}
                  </div>
                ) : (
                  <OrganizationSelector
                    value={selectedOrganization}
                    onChange={setSelectedOrganization}
                    disabled={isSubmitting || !selectedSupervisor}
                    placeholder="Select organization"
                    required
                    allowAddNew={false}
                    availableOrganizations={availableOrganizations}
                  />
                )}
                {selectedSupervisor && availableOrganizations.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Choose from {availableOrganizations.length} organization{availableOrganizations.length !== 1 ? 's' : ''} where {selectedSupervisor.firstName} supervises
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Activity Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you did during your service. Be specific about tasks and impact."
                  className="min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Important Notes */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-pretty">
              <strong>Important:</strong> Your supervisor will receive an email to verify and approve these hours. Make
              sure all information is accurate and your supervisor's email is correct.
            </AlertDescription>
          </Alert>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#0084ff] hover:bg-[#0070e6] text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Submit for Approval
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
