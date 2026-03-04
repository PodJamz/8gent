"use client"

import type React from "react"
import { useState, useRef, useCallback, type ReactNode } from "react"

interface LiquidGlassProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  variant?: "button" | "card" | "panel" | "floating" | "icon"
  intensity?: "subtle" | "medium" | "strong"
  rippleEffect?: boolean
  flowOnHover?: boolean
  stretchOnDrag?: boolean
  onClick?: () => void
  onDragStart?: () => void
  onDragEnd?: () => void
}

export function LiquidGlass({
  children,
  className = "",
  style,
  variant = "card",
  intensity = "medium",
  rippleEffect = true,
  stretchOnDrag = false,
  onClick,
  onDragStart,
  onDragEnd,
}: LiquidGlassProps) {
  const [isJiggling, setIsJiggling] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [wobbleOffset, setWobbleOffset] = useState({ x: 0, y: 0 })
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const elementRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const rippleCounter = useRef(0)

  const getVariantClasses = () => {
    const baseClasses = "liquid-glass relative overflow-hidden"

    switch (variant) {
      case "button":
        return `${baseClasses} px-6 py-3 rounded-2xl cursor-pointer select-none`
      case "card":
        return `${baseClasses} p-6 rounded-3xl`
      case "panel":
        return `${baseClasses} p-8 rounded-2xl`
      case "floating":
        return `${baseClasses} p-4 rounded-full shadow-2xl`
      case "icon":
        return `${baseClasses} p-4 rounded-[22px] cursor-pointer select-none`
      default:
        return baseClasses
    }
  }

  const getIntensityClasses = () => {
    switch (intensity) {
      case "subtle":
        return "backdrop-blur-md bg-white/5 dark:bg-white/5 border border-white/10"
      case "strong":
        return "backdrop-blur-3xl bg-white/25 dark:bg-white/15 border border-white/30"
      default:
        return "backdrop-blur-xl bg-white/15 dark:bg-white/10 border border-white/20"
    }
  }

  const createRipple = useCallback(
    (clientX: number, clientY: number) => {
      if (!rippleEffect || !elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      const newRipple = {
        id: rippleCounter.current++,
        x,
        y,
      }

      setRipples((prev) => [...prev, newRipple])

      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
      }, 600)
    },
    [rippleEffect],
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (stretchOnDrag) {
        setIsDragging(true)
        dragStartPos.current = { x: e.clientX, y: e.clientY }
        onDragStart?.()
      } else if (variant === "button" || variant === "icon") {
        setIsPressed(true)
      }

      createRipple(e.clientX, e.clientY)
    },
    [stretchOnDrag, onDragStart, createRipple, variant],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        setCursorPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }

      if (!isDragging) return

      const deltaX = e.clientX - dragStartPos.current.x
      const deltaY = e.clientY - dragStartPos.current.y

      setDragOffset({ x: deltaX * 0.1, y: deltaY * 0.1 })
    },
    [isDragging],
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)

      const currentOffset = { ...dragOffset }
      setWobbleOffset(currentOffset)

      setDragOffset({ x: 0, y: 0 })
      onDragEnd?.()

      setIsJiggling(true)
      setTimeout(() => {
        setIsJiggling(false)
        setWobbleOffset({ x: 0, y: 0 })
      }, 1800)
    } else if ((variant === "button" || variant === "icon") && isPressed) {
      setIsPressed(false)
      setWobbleOffset({ x: 0, y: 0 })
      setIsJiggling(true)
      setTimeout(() => setIsJiggling(false), 600)
    }
  }, [isDragging, dragOffset, onDragEnd, variant, isPressed])

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      createRipple(e.clientX, e.clientY)
      onClick?.()
    },
    [onClick, createRipple],
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      if (stretchOnDrag) {
        setIsDragging(true)
        dragStartPos.current = { x: touch.clientX, y: touch.clientY }
        onDragStart?.()
      } else if (variant === "button" || variant === "icon") {
        setIsPressed(true)
      }

      createRipple(touch.clientX, touch.clientY)
    },
    [stretchOnDrag, onDragStart, variant, createRipple],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]

      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        setCursorPos({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        })
      }

      if (!isDragging) return

      const deltaX = touch.clientX - dragStartPos.current.x
      const deltaY = touch.clientY - dragStartPos.current.y

      setDragOffset({ x: deltaX * 0.1, y: deltaY * 0.1 })
    },
    [isDragging],
  )

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)

      const currentOffset = { ...dragOffset }
      setWobbleOffset(currentOffset)

      setDragOffset({ x: 0, y: 0 })
      onDragEnd?.()

      setIsJiggling(true)
      setTimeout(() => {
        setIsJiggling(false)
        setWobbleOffset({ x: 0, y: 0 })
      }, 1800)
    } else if ((variant === "button" || variant === "icon") && isPressed) {
      setIsPressed(false)
      setWobbleOffset({ x: 0, y: 0 })
      setIsJiggling(true)
      setTimeout(() => setIsJiggling(false), 600)
    }
  }, [isDragging, dragOffset, onDragEnd, variant, isPressed])

  const transformStyle = isJiggling
    ? ({
        "--wobble-start-x": `${wobbleOffset.x}px`,
        "--wobble-start-y": `${wobbleOffset.y}px`,
        animation: "liquidWobble 0.6s ease-out",
      } as React.CSSProperties)
    : {
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) ${isDragging ? "scale(1.02)" : isPressed ? "scale(0.95)" : ""}`,
        transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)",
      }

  return (
    <div
      ref={elementRef}
      className={`
        ${getVariantClasses()}
        ${getIntensityClasses()}
        ${className}
      `}
      style={{ ...transformStyle, ...style }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsHovering(false)
        setIsPressed(false)
        handleMouseUp()
      }}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Cursor glow effect */}
      {isHovering && (
        <div
          className="absolute pointer-events-none transition-opacity duration-200"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            width: "100px",
            height: "100px",
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            filter: "blur(15px)",
            zIndex: 2,
          }}
        />
      )}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "4px",
            height: "4px",
            background: "rgba(255, 255, 255, 0.5)",
            transform: "translate(-50%, -50%)",
            animation: "liquidRipple 0.6s ease-out forwards",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Glass highlight gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none rounded-[inherit]" />

      {/* Bottom shadow for depth */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/5 to-transparent pointer-events-none rounded-[inherit]" />
    </div>
  )
}
