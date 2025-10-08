import { FileX } from 'lucide-react'
import { ReactNode } from 'react'

interface EmptyStateProps {
  title?: string
  message: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ 
  title = 'No data found', 
  message,
  icon,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon || <FileX className="h-12 w-12 text-muted-foreground mb-4" />}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md">{message}</p>
      {action}
    </div>
  )
}
