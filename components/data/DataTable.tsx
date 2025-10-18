import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { PaginationInfo } from '@/types/api'
import { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  emptyState?: ReactNode
  className?: string
  pagination?: PaginationInfo
  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void
  loading?: boolean
  showItemsPerPage?: boolean
  showJumpToPage?: boolean
}

export function DataTable<T>({ 
  data, 
  columns, 
  keyExtractor, 
  emptyState,
  className,
  pagination,
  onPageChange,
  onLimitChange,
  loading = false,
  showItemsPerPage = true,
  showJumpToPage = true
}: DataTableProps<T>) {
  if (data.length === 0 && emptyState && !loading) {
    return <>{emptyState}</>
  }

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-muted-foreground">Loading...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={keyExtractor(item)}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {pagination && onPageChange && onLimitChange && (
        <PaginationControls
          pagination={pagination}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          loading={loading}
          showItemsPerPage={showItemsPerPage}
          showJumpToPage={showJumpToPage}
        />
      )}
    </div>
  )
}
