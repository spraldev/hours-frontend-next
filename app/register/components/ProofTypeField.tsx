'use client'

import { UseFormReturn } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface ProofTypeFieldProps {
  form: UseFormReturn<any>
  disabled?: boolean
}

export function ProofTypeField({ form, disabled }: ProofTypeFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="proofType">Proof Type</Label>
      <Select
        value={form.watch('proofType')}
        onValueChange={(value) => form.setValue('proofType', value as any)}
        disabled={disabled}
      >
        <SelectTrigger className="bg-muted/50">
          <SelectValue placeholder="Select proof type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="website">Website</SelectItem>
          <SelectItem value="document">Document</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
