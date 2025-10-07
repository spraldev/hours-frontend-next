'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Download } from 'lucide-react'

interface HoursFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  onExport: () => void
  hasData: boolean
}

export function HoursFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onExport,
  hasData,
}: HoursFiltersProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Filter Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search organizations or descriptions..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto bg-transparent" onClick={onExport} disabled={!hasData}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
