import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  fullScreen?: boolean
}

export function ErrorState({ 
  title = 'Error', 
  message, 
  onRetry,
  fullScreen = false
}: ErrorStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  )

  if (fullScreen) {
    return <div className="min-h-screen flex items-center justify-center py-12">{content}</div>
  }

  return <div className="py-12">{content}</div>
}
