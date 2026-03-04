"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DimensionalDreamHeroProps {
  className?: string;
}

const MATRIX_CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789"

const DIMENSIONS = [
  { name: "KANBAN", icon: "■ ■ ■", color: "#22c55e" },
  { name: "iPOD", icon: "▶ ═══", color: "#3b82f6" },
  { name: "GRAPH", icon: "◯─◯", color: "#a855f7" },
  { name: "FEED", icon: "≡ ≡ ≡", color: "#f59e0b" },
  { name: "GRID", icon: "⊞ ⊞", color: "#ec4899" },
]

export default function DimensionalDreamHero({ className = "" }: DimensionalDreamHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentDimension, setCurrentDimension] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const fontSize = 14
    const columns = Math.floor(canvas.offsetWidth / fontSize)
    const drops: number[] = Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      ctx.fillStyle = "#22c55e"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Vary opacity based on position
        const opacity = Math.random() * 0.5 + 0.3
        ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`
        ctx.fillText(char, x, y)

        if (y > canvas.offsetHeight && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Cycle through dimensions
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentDimension((prev) => (prev + 1) % DIMENSIONS.length)
        setIsTransitioning(false)
      }, 300)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const dimension = DIMENSIONS[currentDimension]

  return (
    <div className={`relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden ${className}`}>
      {/* Matrix rain background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full bg-black"
      />

      {/* CRT scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.15) 2px, rgba(0, 0, 0, 0.15) 4px)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          boxShadow: "inset 0 0 150px rgba(0, 0, 0, 0.8)",
        }}
      />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        {/* The hand gesture */}
        <motion.div
          className="text-6xl sm:text-7xl md:text-8xl mb-8"
          animate={{
            rotateZ: isTransitioning ? [0, -15, 0] : 0,
            x: isTransitioning ? [0, -20, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          ✋
        </motion.div>

        {/* Dimension display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDimension}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div
              className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-wider"
              style={{
                color: dimension.color,
                textShadow: `0 0 20px ${dimension.color}, 0 0 40px ${dimension.color}40`,
              }}
            >
              {dimension.icon}
            </div>
            <div
              className="font-mono text-xl sm:text-2xl md:text-3xl tracking-[0.3em] opacity-80"
              style={{
                color: dimension.color,
                textShadow: `0 0 10px ${dimension.color}`,
              }}
            >
              {dimension.name}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Subtitle */}
        <motion.p
          className="absolute bottom-8 sm:bottom-12 font-mono text-xs sm:text-sm text-green-500/60 tracking-widest"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SAME DATA. DIFFERENT DIMENSION.
        </motion.p>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 font-mono text-green-500/40 text-xs">
        ┌──────────────────┐
      </div>
      <div className="absolute top-4 right-4 font-mono text-green-500/40 text-xs">
        ┌──────────────────┐
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-green-500/40 text-xs">
        └──────────────────┘
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-green-500/40 text-xs">
        └──────────────────┘
      </div>
    </div>
  )
}
