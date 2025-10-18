'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { PaginationInfo } from '@/types/api'

interface PaginationControlsProps {
  pagination: PaginationInfo
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  loading?: boolean
  showItemsPerPage?: boolean
  showJumpToPage?: boolean
}

export function PaginationControls({
  pagination,
  onPageChange,
  onLimitChange,
  loading = false,
  showItemsPerPage = true,
  showJumpToPage = true
}: PaginationControlsProps) {
  const { page, limit, total, totalPages, hasNext, hasPrev } = pagination

  // Calculate the range of items being shown
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1
  const endItem = Math.min(page * limit, total)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 7

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (page > 4) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, page - 2)
      const end = Math.min(totalPages - 1, page + 2)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }

      if (page < totalPages - 3) {
        pages.push('...')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handleJumpToPage = (value: string) => {
    const newPage = parseInt(value, 10)
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage)
    }
  }

  if (totalPages <= 1 && !showItemsPerPage) {
    return null
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t bg-muted/20">
      {/* Items per page selector */}
      {showItemsPerPage && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => onLimitChange(parseInt(value, 10))}
            disabled={loading}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>
      )}

      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        {total === 0 ? (
          'No results'
        ) : (
          `Showing ${startItem}-${endItem} of ${total} results`
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrev || loading}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, index) => (
              <div key={index}>
                {pageNum === '...' ? (
                  <div className="flex h-8 w-8 items-center justify-center">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </div>
                ) : (
                  <Button
                    variant={pageNum === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNum as number)}
                    disabled={loading}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNext || loading}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Jump to page */}
      {showJumpToPage && totalPages > 7 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Go to</span>
          <Input
            type="number"
            min="1"
            max={totalPages}
            value={page}
            onChange={(e) => handleJumpToPage(e.target.value)}
            disabled={loading}
            className="w-16 h-8 text-center"
          />
        </div>
      )}
    </div>
  )
}
