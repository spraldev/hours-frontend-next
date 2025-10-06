"use client"

import { useState, useEffect } from 'react'

interface MousePosition {
  x: number
  y: number
}

export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', updateMousePosition)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  return mousePosition
}

export function useMousePositionForElement(elementRef: React.RefObject<HTMLElement>) {
  const [relativePosition, setRelativePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const updateRelativePosition = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setRelativePosition({ x, y })
    }

    const handleMouseEnter = (e: MouseEvent) => {
      setIsHovering(true)
      updateRelativePosition(e)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isHovering) {
        updateRelativePosition(e)
      }
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      setRelativePosition({ x: 50, y: 50 }) // Center position when not hovering
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isHovering])

  return { relativePosition, isHovering }
}
