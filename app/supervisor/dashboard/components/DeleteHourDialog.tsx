'use client'

import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

interface DeleteHourDialogProps {
  hour: any | null
  isSubmitting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteHourDialog({ hour, isSubmitting, onClose, onConfirm }: DeleteHourDialogProps) {
  return (
    <AlertDialog open={!!hour} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this service hour entry.
            {hour && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="font-medium">{hour.hours} hours</p>
                <p className="text-sm text-muted-foreground">{new Date(hour.date).toLocaleDateString()}</p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isSubmitting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
