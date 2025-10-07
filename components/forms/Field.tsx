'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface FieldProps {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea'
  placeholder?: string
  helperText?: string
  disabled?: boolean
  className?: string
}

export function Field({ 
  name, 
  label, 
  type = 'text', 
  placeholder, 
  helperText, 
  disabled,
  className 
}: FieldProps) {
  const { register, formState: { errors } } = useFormContext()
  const error = errors[name]?.message as string | undefined

  const Component = type === 'textarea' ? Textarea : Input

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Component
        id={name}
        type={type !== 'textarea' ? type : undefined}
        placeholder={placeholder}
        {...register(name, { valueAsNumber: type === 'number' })}
        disabled={disabled}
        className={error ? 'border-destructive' : className}
      />
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
