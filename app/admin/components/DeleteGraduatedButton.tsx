'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GraduationCap, Trash2, Loader2 } from 'lucide-react'

interface DeleteGraduatedButtonProps {
  onOpenDialog: () => void
  isLoading: boolean
}

export function DeleteGraduatedButton({ onOpenDialog, isLoading }: DeleteGraduatedButtonProps) {
  return (
    <Card className="mb-6 border-red-900/20 bg-black">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-950 border border-red-900">
              <GraduationCap className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Delete Graduated Students</h3>
              <p className="text-sm text-gray-400">Permanently remove all graduated students and their data</p>
            </div>
          </div>
          <Button onClick={onOpenDialog} variant="destructive" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Graduates
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
