"use client"

import { useEffect, useRef, useState } from "react"

interface AgentOSHeroProps {
  className?: string;
}

export default function AgentOSHero({ className = "" }: AgentOSHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#667eea')
      gradient.addColorStop(0.25, '#764ba2')
      gradient.addColorStop(0.5, '#f093fb')
      gradient.addColorStop(0.75, '#f5576c')
      gradient.addColorStop(1, '#4facfe')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw animated particles/cells representing transformation
      const particleCount = 50
      for (let i = 0; i < particleCount; i++) {
        const x = (canvas.width / particleCount) * i + Math.sin(time + i) * 20
        const y = canvas.height / 2 + Math.cos(time * 0.5 + i) * (canvas.height * 0.3)
        const size = 3 + Math.sin(time + i) * 2
        
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time + i) * 0.2})`
        ctx.fill()
      }

      // Draw connecting lines between particles
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      for (let i = 0; i < particleCount - 1; i++) {
        const x1 = (canvas.width / particleCount) * i + Math.sin(time + i) * 20
        const y1 = canvas.height / 2 + Math.cos(time * 0.5 + i) * (canvas.height * 0.3)
        const x2 = (canvas.width / particleCount) * (i + 1) + Math.sin(time + i + 1) * 20
        const y2 = canvas.height / 2 + Math.cos(time * 0.5 + i + 1) * (canvas.height * 0.3)
        
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
        if (distance < 100) {
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }

      time += 0.02
      animationFrameId = requestAnimationFrame(draw)
    }

    resizeCanvas()
    const resizeObserver = new ResizeObserver(resizeCanvas)
    resizeObserver.observe(canvas)

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
    }
  }, [mounted])

  return (
    <div className={`relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-blue-500/20" />
    </div>
  )
}
