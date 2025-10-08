import * as React from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useMousePositionForElement } from '@/hooks/use-mouse-position'

interface MouseTrackingCardProps extends React.ComponentProps<'div'> {
  intensity?: 'low' | 'medium' | 'high'
  followMouse?: boolean
}

export function MouseTrackingCard({ 
  className, 
  intensity = 'medium',
  followMouse = true,
  children,
  ...props 
}: MouseTrackingCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const { relativePosition, isHovering } = useMousePositionForElement(cardRef)

  const intensityConfig = {
    low: { size: 800, opacity: 0.3 },
    medium: { size: 600, opacity: 0.5 },
    high: { size: 400, opacity: 0.7 }
  }

  const config = intensityConfig[intensity]

  React.useEffect(() => {
    if (cardRef.current && followMouse) {
      const element = cardRef.current
      element.style.setProperty('--mouse-x', `${relativePosition.x}%`)
      element.style.setProperty('--mouse-y', `${relativePosition.y}%`)
      element.style.setProperty('--glow-size', `${config.size}px`)
      element.style.setProperty('--glow-opacity', `${config.opacity}`)
    }
  }, [relativePosition, followMouse, config])

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden transition-transform duration-200',
        isHovering && 'scale-[1.02]',
        className
      )}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
        '--glow-size': `${config.size}px`,
        '--glow-opacity': `${config.opacity}`,
      } as React.CSSProperties}
      {...props}
    >
      {/* Dynamic glow effect */}
      <div 
        className={cn(
          'absolute inset-0 pointer-events-none transition-opacity duration-300',
          isHovering ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: `radial-gradient(var(--glow-size) circle at var(--mouse-x) var(--mouse-y), 
            rgba(0, 132, 255, var(--glow-opacity)), 
            rgba(79, 70, 229, calc(var(--glow-opacity) * 0.6)), 
            rgba(124, 58, 237, calc(var(--glow-opacity) * 0.3)), 
            transparent 40%)`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Border glow */}
      <div 
        className={cn(
          'absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300',
          isHovering ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: `radial-gradient(var(--glow-size) circle at var(--mouse-x) var(--mouse-y), 
            rgba(0, 132, 255, 0.4), 
            rgba(79, 70, 229, 0.2), 
            transparent 30%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'subtract',
          WebkitMaskComposite: 'subtract',
          padding: '1px'
        }}
      />
    </div>
  )
}
