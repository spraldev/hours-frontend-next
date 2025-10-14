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
}

export function SearchAndStatusFilter({
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  searchPlaceholder = 'Search...',
  showStatusFilter = true,
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
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
