'use client'

import { UseFormReturn } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { getGraduationYears } from '@/lib/utils/graduation-year'

interface GraduationYearFieldProps {
  form: UseFormReturn<any>
  disabled?: boolean
}

export function GraduationYearField({ form, disabled }: GraduationYearFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="graduationYear">Graduation Year</Label>
      <Select
        value={form.watch('graduationYear')?.toString() || ''}
        onValueChange={(value) => form.setValue('graduationYear', parseInt(value))}
        disabled={disabled}
      >
        <SelectTrigger className="bg-muted/50">
          <SelectValue placeholder="Select your graduation year" />
        </SelectTrigger>
        <SelectContent>
          {getGraduationYears().map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
