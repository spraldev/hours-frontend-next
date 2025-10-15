'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

interface SearchAndStatusFilterProps {
  searchValue: string
  onSearchChange: (value: string) => void
  statusValue: string
  onStatusChange: (value: string) => void
  searchPlaceholder?: string
  showStatusFilter?: boolean
  statusOptions?: Array<{value: string, label: string}>
}

export function SearchAndStatusFilter({
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  searchPlaceholder = 'Search...',
  showStatusFilter = true,
  statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'approved', label: 'Active' },
    { value: 'pending', label: 'Pending' }
  ]
}: SearchAndStatusFilterProps) {
  return (
    <div className="mb-4 flex items-center space-x-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={searchPlaceholder} value={searchValue} onChange={(e) => onSearchChange(e.target.value)} className="pl-10" />
      </div>
      {showStatusFilter && (
        <Select value={statusValue} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
