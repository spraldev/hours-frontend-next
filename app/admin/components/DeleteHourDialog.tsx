'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'

interface DeleteHourDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hour: any | null
  onConfirm: () => void
  isProcessing: boolean
}

export function DeleteHourDialog({ open, onOpenChange, hour, onConfirm, isProcessing }: DeleteHourDialogProps) {
  const studentName =
    hour && (typeof hour.student === 'string' || !hour.student)
      ? 'Unknown'
      : hour
        ? `${hour.student.firstName} ${hour.student.lastName}`
        : 'Unknown'

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this service hour entry.
            {hour && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="font-medium">{hour.hours} hours</p>
                <p className="text-sm text-muted-foreground">{new Date(hour.date).toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Student: {studentName}</p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isProcessing}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
