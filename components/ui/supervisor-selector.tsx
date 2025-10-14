"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import type { Supervisor } from "@/types/api"

interface SupervisorSelectorProps {
  value?: Supervisor | null
  onChange: (supervisor: Supervisor | null) => void
  disabled?: boolean
  placeholder?: string
  required?: boolean
  className?: string
}

export function SupervisorSelector({
  value,
  onChange,
  disabled = false,
  placeholder = "Select supervisor",
  required = false,
  className,
}: SupervisorSelectorProps) {
  const [allSupervisors, setAllSupervisors] = useState<Supervisor[]>([])
  const [supervisorSearch, setSupervisorSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load supervisors on mount
  useEffect(() => {
    const loadSupervisors = async () => {
      if (allSupervisors.length > 0) return
      
      try {
        setIsLoading(true)
        const response = await apiClient.get("/student/supervisors")
        console.log("Supervisors response:", response)
        if (response.success && response.data) {
          setAllSupervisors(response.data)
        }
      } catch (err) {
        console.error("Failed to load supervisors:", err)
        setAllSupervisors([])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadSupervisors()
  }, [allSupervisors.length])

  // Filter supervisors for display
  const filteredSupervisors = useMemo(() => {
    const searchTerm = supervisorSearch.toLowerCase().trim()
    
    if (!searchTerm) {
      return allSupervisors
    }

    return allSupervisors.filter((supervisor) => {
      const fullName = `${supervisor.firstName} ${supervisor.lastName}`.toLowerCase()
      const email = supervisor.email.toLowerCase()
      return fullName.includes(searchTerm) || email.includes(searchTerm)
    })
  }, [allSupervisors, supervisorSearch])

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
              {value.firstName} {value.lastName}
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
              placeholder="Search supervisors..."
              value={supervisorSearch}
              onChange={(e) => setSupervisorSearch(e.target.value)}
              className="h-9"
              autoFocus
            />
          </div>
          
          {/* Supervisors List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-5 w-5 border-2 border-[#0084ff] border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading supervisors...</span>
                </div>
              </div>
            ) : filteredSupervisors.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {supervisorSearch ? 
                  `No supervisors found for "${supervisorSearch}"` : 
                  "No supervisors available"
                }
              </div>
            ) : (
              <div className="p-1">
                {filteredSupervisors.map((supervisor) => (
                  <button
                    key={supervisor._id}
                    onClick={() => {
                      onChange(supervisor)
                      setIsOpen(false)
                      setSupervisorSearch("")
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left",
                      value?._id === supervisor._id && "bg-muted"
                    )}
                  >
                    <Check 
                      className={cn(
                        "h-4 w-4 shrink-0",
                        value?._id === supervisor._id 
                          ? "opacity-100" 
                          : "opacity-0"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">
                        {supervisor.firstName} {supervisor.lastName}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {supervisor.email}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

