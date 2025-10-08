'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PasswordFieldProps {
  name: string
  label: string
  placeholder?: string
  helperText?: string
  disabled?: boolean
  className?: string
}

export function PasswordField({
  name,
  label,
  placeholder,
  helperText,
  disabled,
  className,
}: PasswordFieldProps) {
  const { register, formState, getFieldState } = useFormContext()
  const { error, isTouched } = getFieldState(name, formState)
  const showError = !!error && (isTouched || formState.isSubmitted)

  const describedById = showError ? `${name}-error` : helperText ? `${name}-help` : undefined

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <Input
          id={name}
          type="password"
          placeholder={placeholder}
          {...register(name)}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedById}
          className={`bg-muted/50 ${showError ? 'border-destructive' : ''} ${className || ''}`}
        />
      </div>
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
