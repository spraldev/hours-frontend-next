import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GradientCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "hero" | "stat"
}

export function GradientCard({ children, className, variant = "default" }: GradientCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0",
        variant === "hero" && "bg-gradient-to-br from-[#0084ff]/20 via-[#4f46e5]/10 to-[#7c3aed]/20",
        variant === "stat" && "bg-gradient-to-r from-[#0084ff]/10 to-[#4f46e5]/10",
        variant === "default" && "bg-card/50 backdrop-blur-sm",
        className,
      )}
    >
      {variant !== "default" && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />
      )}
      {children}
    </Card>
  )
}
