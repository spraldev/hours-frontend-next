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
  className,
}: FieldProps) {
  const { register, formState, getFieldState } = useFormContext()
  const { error, isTouched } = getFieldState(name, formState)
  const showError = !!error && (isTouched || formState.isSubmitted)

  const Component = type === 'textarea' ? Textarea : Input
  const describedById = showError ? `${name}-error` : helperText ? `${name}-help` : undefined

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Component
        id={name}
        type={type !== 'textarea' ? type : undefined}
        placeholder={placeholder}
        {...register(name, { valueAsNumber: type === 'number' })}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={describedById}
        className={`bg-muted/50 ${showError ? 'border-destructive' : ''} ${className || ''}`}
      />
      {helperText && !showError && (
        <p id={`${name}-help`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      )}
      {showError && (
        <p id={`${name}-error`} className="text-xs text-destructive">
          {String(error?.message || '')}
        </p>
      )}
    </div>
  )
}
