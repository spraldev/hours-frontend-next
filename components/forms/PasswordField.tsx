'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordFieldProps {
  name: string
  label: string
  placeholder?: string
  disabled?: boolean
}

export function PasswordField({ name, label, placeholder = 'Enter your password', disabled }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]?.message as string | undefined

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <Input
          id={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={`bg-muted/50 pr-10 ${error ? 'border-destructive' : ''}`}
          {...register(name)}
          disabled={disabled}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
