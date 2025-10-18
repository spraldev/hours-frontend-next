'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Download, GraduationCap } from 'lucide-react'
import { Student, Hour } from '@/types/api'
import { exportStudentsHoursToCSVByClass } from '@/lib/utils/admin-export'
import toast from 'react-hot-toast'

interface ExportClassSelectionDialogProps {
  isOpen: boolean
  onClose: () => void
  students: Student[]
  hours: Hour[]
}

export function ExportClassSelectionDialog({ 
  isOpen, 
  onClose, 
  students, 
  hours 
}: ExportClassSelectionDialogProps) {
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [isExporting, setIsExporting] = useState(false)
  const [availableClasses, setAvailableClasses] = useState<{ year: number; count: number }[]>([])

  // Get unique graduating years and count students in each class
  useEffect(() => {
    if (students && students.length > 0) {
      const classMap = new Map<number, number>()
      
      students.forEach(student => {
        const year = student.graduatingYear
        classMap.set(year, (classMap.get(year) || 0) + 1)
      })
      
      const classes = Array.from(classMap.entries())
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => a.year - b.year)
      
      setAvailableClasses(classes)
    }
  }, [students])

  const handleExport = async () => {
    if (!selectedClass) {
      toast.error("Please select a graduating class")
      return
    }

    setIsExporting(true)
    try {
      const graduationYear = parseInt(selectedClass)
      const classStudents = students.filter(student => student.graduatingYear === graduationYear)
      
      if (classStudents.length === 0) {
        toast.error("No students found for the selected class")
        return
      }

      await exportStudentsHoursToCSVByClass(classStudents, hours, graduationYear)
      toast.success(`Class of ${graduationYear} hours exported successfully`)
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Failed to export class hours")
    } finally {
      setIsExporting(false)
    }
  }

  const handleClose = () => {
    setSelectedClass('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Export Hours by Class
          </DialogTitle>
          <DialogDescription>
            Select a graduating class to export their community service hours data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Graduating Class</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select a graduating class" />
              </SelectTrigger>
              <SelectContent>
                {availableClasses.map(({ year, count }) => (
                  <SelectItem key={year} value={year.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>Class of {year}</span>
                      <Badge variant="secondary" className="ml-2">
                        {count} students
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClass && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground">
                <p>Selected: <span className="font-medium">Class of {selectedClass}</span></p>
                <p className="mt-1">
                  This will export hours data for {availableClasses.find(c => c.year.toString() === selectedClass)?.count || 0} students.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={!selectedClass || isExporting}
            className="min-w-[120px]"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Hours
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
