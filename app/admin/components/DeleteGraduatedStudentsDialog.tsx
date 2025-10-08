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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertTriangle, Users, Clock, GraduationCap, Loader2, Trash2 } from 'lucide-react'

interface DeleteGraduatedStudentsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  students: any[]
  onConfirm: () => void
  isProcessing: boolean
}

export function DeleteGraduatedStudentsDialog({
  open,
  onOpenChange,
  students,
  onConfirm,
  isProcessing,
}: DeleteGraduatedStudentsDialogProps) {
  const totalHours = students.reduce((sum, s) => sum + (s.totalHours || 0), 0)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-4xl max-h-[85vh] bg-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Graduated Students
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            You are about to permanently delete <strong className="text-white">{students.length}</strong> graduated students and all their data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[calc(85vh-200px)]">
          <div className="bg-red-950/50 border border-red-900 rounded-lg p-3">
            <p className="text-sm text-red-400">
              ⚠️ This will permanently delete all student records, hours, and activity history. This cannot be undone.
            </p>
          </div>

          {students.length > 0 && (
            <div className="flex gap-3 text-sm">
              <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-white font-medium">{students.length}</span>
                <span className="text-gray-400">students</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
                <Clock className="h-4 w-4 text-green-400" />
                <span className="text-white font-medium">{totalHours}</span>
                <span className="text-gray-400">total hours</span>
              </div>
            </div>
          )}

          {students.length > 0 ? (
            <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
              <div className="max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-zinc-900 border-b border-zinc-800">
                    <TableRow className="hover:bg-zinc-900">
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Graduation</TableHead>
                      <TableHead className="text-gray-300 text-right">Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student._id} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                        <TableCell className="text-white">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">{student.email}</TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {student.graduationDate ? new Date(student.graduationDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-white text-right">{student.totalHours || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <GraduationCap className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No graduated students found</p>
            </div>
          )}
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={isProcessing} className="bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isProcessing || students.length === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete {students.length} Students
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
