import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
}

export function DataTable<T>({ 
  data, 
  columns, 
  keyExtractor, 
  emptyState,
  className 
}: DataTableProps<T>) {
  if (data.length === 0 && emptyState) {
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
          {data.map((item) => (
            <TableRow key={keyExtractor(item)}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
