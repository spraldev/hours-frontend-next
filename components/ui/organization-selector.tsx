"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"

interface Organization {
  id: string
  name: string
  verified?: boolean
  isNew?: boolean
}

interface OrganizationSelectorProps {
  value?: Organization | null
  onChange: (organization: Organization | null) => void
  disabled?: boolean
  placeholder?: string
  required?: boolean
  className?: string
  allowAddNew?: boolean // Allow adding new organizations (for staff only)
  availableOrganizations?: Organization[] // Pre-filtered organizations (e.g., for specific supervisor)
}

export function OrganizationSelector({
  value,
  onChange,
  disabled = false,
  placeholder = "Select organization",
  required = false,
  className,
  allowAddNew = true,
  availableOrganizations,
}: OrganizationSelectorProps) {
  const [allOrganizations, setAllOrganizations] = useState<Organization[]>([])
  const [organizationSearch, setOrganizationSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAddNewForm, setShowAddNewForm] = useState(false)
  const [newOrgName, setNewOrgName] = useState("")

  // Load popular organizations on mount (only if no availableOrganizations provided)
  useEffect(() => {
    // If availableOrganizations is provided, use it instead of API calls
    if (availableOrganizations) {
      setAllOrganizations(availableOrganizations)
      return
    }

    const loadPopularOrganizations = async () => {
      if (allOrganizations.length > 0) return
      
      try {
        setIsLoading(true)
        const response = await apiClient.get("/api/organizations/popular?limit=50")
        console.log(response)
        if (response.success && response.data.organizations) {
          setAllOrganizations(response.data.organizations)
        }
      } catch (err) {
        console.error("Failed to load popular organizations:", err)
        // Fallback to static list
        setAllOrganizations([
          
        ])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPopularOrganizations()
  }, [allOrganizations.length, availableOrganizations])

  // Search organizations via API with debouncing (only if no availableOrganizations provided)
  useEffect(() => {
    // If availableOrganizations is provided, skip API search and use client-side filtering
    if (availableOrganizations) {
      return
    }

    const searchTerm = organizationSearch.trim()
    
    if (!searchTerm) {
      // When search is cleared, reload popular organizations
      const reloadPopular = async () => {
        try {
          setIsLoading(true)
          const response = await apiClient.get("/organizations/popular?limit=50")
          if (response.success && response.data.organizations) {
            setAllOrganizations(response.data.organizations)
          }
        } catch (err) {
          console.error("Failed to reload popular organizations:", err)
        } finally {
          setIsLoading(false)
        }
      }
      reloadPopular()
      return
    }

    setIsLoading(true)
    
    const searchOrganizations = async () => {
      try {
        const response = await apiClient.get(`/organizations/search?q=${encodeURIComponent(searchTerm)}&limit=50`)
        if (response.success && response.data.organizations) {
          setAllOrganizations(response.data.organizations)
        }
      } catch (err) {
        console.error("Failed to search organizations:", err)
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce search by 300ms
    const timeoutId = setTimeout(searchOrganizations, 300)
    return () => clearTimeout(timeoutId)
  }, [organizationSearch, availableOrganizations])

  // Filter and sort organizations for display
  const filteredOrganizations = useMemo(() => {
    let organizations = allOrganizations

    // If availableOrganizations is provided, do client-side filtering
    if (availableOrganizations) {
      const searchTerm = organizationSearch.toLowerCase().trim()
      if (searchTerm) {
        organizations = allOrganizations.filter(org => 
          org.name.toLowerCase().includes(searchTerm)
        )
      }
    }

    return organizations.sort((a, b) => {
      // Prioritize verified organizations
      if (a.verified && !b.verified) return -1
      if (!a.verified && b.verified) return 1
      
      // Then sort alphabetically
      return a.name.localeCompare(b.name)
    })
  }, [allOrganizations, organizationSearch, availableOrganizations])

  const handleAddOrganization = () => {
    if (newOrgName.trim()) {
      const newOrg = {
        id: `new-${Date.now()}`,
        name: newOrgName.trim(),
        isNew: true
      }
      onChange(newOrg)
      setShowAddNewForm(false)
      setNewOrgName("")
      setIsOpen(false)
      setOrganizationSearch("")
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn("w-full justify-between font-normal", className)}
          disabled={disabled}
        >
          {value ? (
            <div className="flex items-center gap-2 truncate">
              {value.name}
              {value.isNew && (
                <span className="text-xs bg-[#0084ff]/10 text-[#0084ff] px-1.5 py-0.5 rounded">New</span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="flex flex-col h-[400px]">
          {/* Search Input */}
          <div className="p-3 border-b">
            <Input
              placeholder="Search organizations..."
              value={organizationSearch}
              onChange={(e) => setOrganizationSearch(e.target.value)}
              className="h-9"
              autoFocus
            />
          </div>
          
          {/* Organizations List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-5 w-5 border-2 border-[#0084ff] border-t-transparent rounded-full animate-spin"></div>
                  <span>{organizationSearch ? 'Searching...' : 'Loading organizations...'}</span>
                </div>
              </div>
            ) : showAddNewForm ? (
              // Add New Organization Form
              <div className="p-4 space-y-3">
                <div className="text-sm font-medium">Add New Organization</div>
                <Input
                  placeholder="Organization name"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="h-9"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#0084ff] hover:bg-[#0070e6]"
                    onClick={handleAddOrganization}
                    disabled={!newOrgName.trim()}
                  >
                    Add Organization
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowAddNewForm(false)
                      setNewOrgName("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {filteredOrganizations.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {organizationSearch ? 
                      `No organizations found for "${organizationSearch}"` : 
                      "No organizations available"
                    }
                  </div>
                ) : (
                  <div className="p-1">
                    {/* Verified Organizations */}
                    {filteredOrganizations.some(org => org.verified) && (
                      <>
                        <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                          Verified Organizations
                        </div>
                        {filteredOrganizations
                          .filter(org => org.verified)
                          .map((organization) => (
                            <button
                              key={organization.id}
                              onClick={() => {
                                onChange(organization)
                                setIsOpen(false)
                                setOrganizationSearch("")
                              }}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left",
                                value?.id === organization.id && "bg-muted"
                              )}
                            >
                              <Check 
                                className={cn(
                                  "h-4 w-4 shrink-0",
                                  value?.id === organization.id 
                                    ? "opacity-100" 
                                    : "opacity-0"
                                )}
                              />
                              <span className="flex-1 truncate">{organization.name}</span>
                              <span className="text-xs text-green-600">✓</span>
                            </button>
                          ))}
                      </>
                    )}
                    
                    {/* Other Organizations */}
                    {filteredOrganizations.some(org => !org.verified) && (
                      <>
                        {filteredOrganizations.some(org => org.verified) && (
                          <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground mt-2">
                            Other Organizations
                          </div>
                        )}
                        {filteredOrganizations
                          .filter(org => !org.verified)
                          .map((organization) => (
                            <button
                              key={organization.id}
                              onClick={() => {
                                onChange(organization)
                                setIsOpen(false)
                                setOrganizationSearch("")
                              }}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left",
                                value?.id === organization.id && "bg-muted"
                              )}
                            >
                              <Check 
                                className={cn(
                                  "h-4 w-4 shrink-0",
                                  value?.id === organization.id 
                                    ? "opacity-100" 
                                    : "opacity-0"
                                )}
                              />
                              <span className="flex-1 truncate">{organization.name}</span>
                            </button>
                          ))}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          

          {allowAddNew && !showAddNewForm && !availableOrganizations && (
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-[#0084ff] hover:text-[#0070e6] hover:bg-[#0084ff]/5"
                onClick={() => {
                  setShowAddNewForm(true)
                  setNewOrgName(organizationSearch)
                }}
              >
                <span className="text-lg mr-2">+</span>
                Add new organization
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
