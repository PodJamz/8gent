"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PacManHeroProps {
  className?: string;
}

// Software platforms as pellets - the more the merrier
const PLATFORMS = [
  { name: "GitHub", color: "#24292e", icon: "GH" },
  { name: "Salesforce", color: "#00A1E0", icon: "SF" },
  { name: "Adobe", color: "#FF0000", icon: "Ad" },
  { name: "LinkedIn", color: "#0077B5", icon: "in" },
  { name: "Slack", color: "#4A154B", icon: "Sl" },
  { name: "Notion", color: "#000000", icon: "N" },
  { name: "Figma", color: "#F24E1E", icon: "Fi" },
  { name: "Jira", color: "#0052CC", icon: "Ji" },
  { name: "Asana", color: "#F06A6A", icon: "As" },
  { name: "Monday", color: "#FF3D57", icon: "Mo" },
  { name: "Trello", color: "#0079BF", icon: "Tr" },
  { name: "Airtable", color: "#18BFFF", icon: "At" },
  { name: "Zapier", color: "#FF4A00", icon: "Za" },
  { name: "HubSpot", color: "#FF7A59", icon: "HS" },
  { name: "Mailchimp", color: "#FFE01B", icon: "MC" },
  { name: "Stripe", color: "#635BFF", icon: "St" },
  { name: "Shopify", color: "#96BF48", icon: "Sh" },
  { name: "Zendesk", color: "#03363D", icon: "Zd" },
  { name: "Intercom", color: "#1F8DED", icon: "IC" },
  { name: "Twilio", color: "#F22F46", icon: "Tw" },
  { name: "AWS", color: "#FF9900", icon: "AW" },
  { name: "GCP", color: "#4285F4", icon: "GC" },
  { name: "Azure", color: "#0089D6", icon: "Az" },
  { name: "Vercel", color: "#000000", icon: "V" },
  { name: "Netlify", color: "#00C7B7", icon: "Nf" },
  { name: "Docker", color: "#2496ED", icon: "Do" },
  { name: "Kubernetes", color: "#326CE5", icon: "K8" },
  { name: "MongoDB", color: "#47A248", icon: "Mg" },
  { name: "PostgreSQL", color: "#336791", icon: "PG" },
  { name: "Redis", color: "#DC382D", icon: "Re" },
  { name: "Elasticsearch", color: "#FEC514", icon: "ES" },
  { name: "Datadog", color: "#632CA6", icon: "DD" },
  { name: "Splunk", color: "#65A637", icon: "Sp" },
  { name: "PagerDuty", color: "#06AC38", icon: "PD" },
  { name: "Okta", color: "#007DC1", icon: "Ok" },
  { name: "Auth0", color: "#EB5424", icon: "A0" },
  { name: "Contentful", color: "#2478CC", icon: "Cf" },
  { name: "Sanity", color: "#F03E2F", icon: "Sa" },
  { name: "Prismic", color: "#5163BA", icon: "Pr" },
  { name: "Webflow", color: "#4353FF", icon: "Wf" },
  { name: "Squarespace", color: "#000000", icon: "Sq" },
  { name: "WordPress", color: "#21759B", icon: "WP" },
  { name: "Wix", color: "#0C6EFC", icon: "Wx" },
  { name: "Canva", color: "#00C4CC", icon: "Cv" },
  { name: "Miro", color: "#FFD02F", icon: "Mi" },
  { name: "Loom", color: "#625DF5", icon: "Lo" },
  { name: "Calendly", color: "#006BFF", icon: "Ca" },
  { name: "Zoom", color: "#2D8CFF", icon: "Zm" },
  { name: "Teams", color: "#6264A7", icon: "Te" },
  { name: "Discord", color: "#5865F2", icon: "Di" },
]

interface Pellet {
  id: number;
  x: number;
  y: number;
  platform: typeof PLATFORMS[number];
  eaten: boolean;
  scale: number;
}

type Direction = "right" | "left" | "up" | "down";

interface PacMan {
  x: number;
  y: number;
  direction: Direction;
  nextDirection: Direction;
  mouthOpen: number;
  size: number;
  speed: number;
}

export default function PacManHero({ className = "" }: PacManHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [pellets, setPellets] = useState<Pellet[]>([])
  const [pacman, setPacman] = useState<PacMan>({
    x: 50,
    y: 50,
    direction: "right",
    nextDirection: "right",
    mouthOpen: 0,
    size: 30,
    speed: 4,
  })
  const [score, setScore] = useState(0)
  const [eatenPlatforms, setEatenPlatforms] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoMode, setAutoMode] = useState(true)
  const animationRef = useRef<number | null>(null)
  const keysPressed = useRef<Set<string>>(new Set())
  const lastTimeRef = useRef<number>(0)
  const pelletsRef = useRef<Pellet[]>([])
  const pacmanRef = useRef<PacMan>(pacman)

  // Keep refs in sync
  useEffect(() => {
    pelletsRef.current = pellets
  }, [pellets])

  useEffect(() => {
    pacmanRef.current = pacman
  }, [pacman])

  // Initialize pellets in a maze-like pattern
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.offsetWidth || 800
    const height = canvas.offsetHeight || 500

    const initialPellets: Pellet[] = []
    let pelletId = 0

    // Create a grid of pellets with some randomness
    const gridSize = 55
    const rows = Math.floor(height / gridSize)
    const cols = Math.floor(width / gridSize)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Skip some positions for variety
        if (Math.random() > 0.75) continue

        const platform = PLATFORMS[pelletId % PLATFORMS.length]
        initialPellets.push({
          id: pelletId++,
          x: (col + 0.5) * gridSize + (Math.random() - 0.5) * 15,
          y: (row + 0.5) * gridSize + (Math.random() - 0.5) * 15,
          platform,
          eaten: false,
          scale: 1,
        })
      }
    }

    setPellets(initialPellets)
    setIsPlaying(true)
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keysPressed.current.add(key)

      // Disable auto mode when user takes control
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
        setAutoMode(false)
      }

      let newDirection: Direction | null = null

      if (key === "arrowup" || key === "w") newDirection = "up"
      else if (key === "arrowdown" || key === "s") newDirection = "down"
      else if (key === "arrowleft" || key === "a") newDirection = "left"
      else if (key === "arrowright" || key === "d") newDirection = "right"

      if (newDirection) {
        e.preventDefault()
        setPacman(prev => ({ ...prev, nextDirection: newDirection! }))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase())
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Mouse/touch controls
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (autoMode) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const dx = mouseX - pacmanRef.current.x
    const dy = mouseY - pacmanRef.current.y

    let newDirection: Direction
    if (Math.abs(dx) > Math.abs(dy)) {
      newDirection = dx > 0 ? "right" : "left"
    } else {
      newDirection = dy > 0 ? "down" : "up"
    }

    setPacman(prev => ({ ...prev, nextDirection: newDirection }))
  }, [autoMode])

  const handleClick = useCallback(() => {
    setAutoMode(prev => !prev)
  }, [])

  // Find nearest uneaten pellet for auto mode
  const findNearestPellet = useCallback((px: number, py: number): Pellet | null => {
    let nearest: Pellet | null = null
    let minDist = Infinity

    pelletsRef.current.forEach(pellet => {
      if (pellet.eaten) return
      const dist = Math.sqrt((pellet.x - px) ** 2 + (pellet.y - py) ** 2)
      if (dist < minDist) {
        minDist = dist
        nearest = pellet
      }
    })

    return nearest
  }, [])

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let frame = 0

    const animate = (time: number) => {
      const deltaTime = Math.min(time - lastTimeRef.current, 32) // Cap at ~30fps minimum
      lastTimeRef.current = time

      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      // Clear
      ctx.fillStyle = "#0a0a1e"
      ctx.fillRect(0, 0, width, height)

      // Draw maze-like grid
      ctx.strokeStyle = "rgba(99, 102, 241, 0.12)"
      ctx.lineWidth = 1
      const gridSize = 55
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Update Pac-Man
      setPacman(prev => {
        let newDirection = prev.nextDirection
        let newX = prev.x
        let newY = prev.y

        // Auto mode - find nearest pellet
        if (autoMode) {
          const nearest = findNearestPellet(prev.x, prev.y)
          if (nearest) {
            const dx = nearest.x - prev.x
            const dy = nearest.y - prev.y
            if (Math.abs(dx) > Math.abs(dy)) {
              newDirection = dx > 0 ? "right" : "left"
            } else {
              newDirection = dy > 0 ? "down" : "up"
            }
          }
        }

        // Move in current direction
        const speed = prev.speed
        switch (newDirection) {
          case "right": newX += speed; break
          case "left": newX -= speed; break
          case "up": newY -= speed; break
          case "down": newY += speed; break
        }

        // Wrap around edges
        if (newX < -prev.size) newX = width + prev.size
        if (newX > width + prev.size) newX = -prev.size
        if (newY < -prev.size) newY = height + prev.size
        if (newY > height + prev.size) newY = -prev.size

        // Animate mouth
        const mouthSpeed = 0.3
        let newMouthOpen = prev.mouthOpen + mouthSpeed
        if (newMouthOpen > Math.PI) newMouthOpen = 0

        // Grow based on score
        const baseSize = 28
        const growthFactor = 1 + (score / 800) * 0.6
        const newSize = Math.min(baseSize * growthFactor, 70)

        return {
          ...prev,
          x: newX,
          y: newY,
          direction: newDirection,
          mouthOpen: Math.abs(Math.sin(newMouthOpen)) * (Math.PI / 4),
          size: newSize,
          speed: 3.5 + (score / 500), // Speed up as score increases
        }
      })

      // Check collisions and eat pellets
      const currentPacman = pacmanRef.current
      let newScore = score
      const newEaten: string[] = []

      setPellets(prev => {
        return prev.map(pellet => {
          if (pellet.eaten) return pellet

          const dist = Math.sqrt((pellet.x - currentPacman.x) ** 2 + (pellet.y - currentPacman.y) ** 2)

          if (dist < currentPacman.size) {
            newScore += 10
            newEaten.push(pellet.platform.name)
            return { ...pellet, eaten: true, scale: 0 }
          }

          // Shrink animation when about to be eaten
          if (dist < currentPacman.size * 2) {
            return { ...pellet, scale: Math.max(0.5, dist / (currentPacman.size * 2)) }
          }

          return { ...pellet, scale: Math.min(1, pellet.scale + 0.05) }
        })
      })

      if (newEaten.length > 0) {
        setScore(newScore)
        setEatenPlatforms(current => [...current.slice(-9), ...newEaten])
      }

      // Draw pellets (software icons)
      pelletsRef.current.forEach(pellet => {
        if (pellet.eaten) return

        const size = 14 * pellet.scale
        const { x, y, platform } = pellet

        // Glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2)
        gradient.addColorStop(0, platform.color + "50")
        gradient.addColorStop(1, "transparent")
        ctx.beginPath()
        ctx.arc(x, y, size * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Circle background
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = platform.color
        ctx.fill()

        // Icon text
        ctx.fillStyle = "#fff"
        ctx.font = `bold ${size * 0.7}px monospace`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(platform.icon, x, y)
      })

      // Draw Pac-Man
      const { x: px, y: py, direction, mouthOpen, size: pSize } = currentPacman

      // Direction angle
      let angle = 0
      switch (direction) {
        case "right": angle = 0; break
        case "down": angle = Math.PI / 2; break
        case "left": angle = Math.PI; break
        case "up": angle = -Math.PI / 2; break
      }

      // Glow
      const pacGlow = ctx.createRadialGradient(px, py, 0, px, py, pSize * 2.5)
      pacGlow.addColorStop(0, "rgba(255, 255, 0, 0.5)")
      pacGlow.addColorStop(1, "transparent")
      ctx.beginPath()
      ctx.arc(px, py, pSize * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = pacGlow
      ctx.fill()

      // Body
      ctx.save()
      ctx.translate(px, py)
      ctx.rotate(angle)

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, pSize, mouthOpen, Math.PI * 2 - mouthOpen, false)
      ctx.closePath()

      // Gradient fill
      const bodyGradient = ctx.createRadialGradient(-pSize * 0.3, -pSize * 0.3, 0, 0, 0, pSize)
      bodyGradient.addColorStop(0, "#FFFF00")
      bodyGradient.addColorStop(1, "#FFA500")
      ctx.fillStyle = bodyGradient
      ctx.fill()

      // Eye
      ctx.beginPath()
      ctx.arc(-pSize * 0.15, -pSize * 0.35, pSize * 0.12, 0, Math.PI * 2)
      ctx.fillStyle = "#000"
      ctx.fill()

      ctx.restore()

      frame++
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, score, autoMode, findNearestPellet])

  const remainingPellets = pellets.filter(p => !p.eaten).length

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none ${className}`}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      tabIndex={0}
      role="application"
      aria-label="Pac-Man game - Use arrow keys or WASD to control, or click to toggle auto mode"
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: "#0a0a1e" }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-20"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 4px)",
        }}
      />

      {/* Score */}
      <motion.div
        className="absolute top-4 left-4 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="font-mono text-yellow-400 text-2xl sm:text-3xl font-bold">
          {score.toLocaleString()}
        </div>
        <div className="font-mono text-yellow-400/60 text-xs">
          PLATFORMS CONSUMED
        </div>
      </motion.div>

      {/* Remaining */}
      <motion.div
        className="absolute top-4 right-4 z-20 text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="font-mono text-red-400 text-lg sm:text-xl font-bold">
          {remainingPellets}
        </div>
        <div className="font-mono text-red-400/60 text-xs">
          REMAINING
        </div>
      </motion.div>

      {/* Controls hint */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: autoMode ? 0 : 0.7 }}
        transition={{ duration: 0.3 }}
      >
        <div className="font-mono text-white/80 text-sm bg-black/50 px-4 py-2 rounded-lg">
          Arrow keys / WASD to move
        </div>
      </motion.div>

      {/* Mode indicator */}
      <motion.div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className={`font-mono text-xs px-3 py-1 rounded-full ${autoMode ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
          {autoMode ? "AUTO MODE" : "MANUAL MODE"} (click to toggle)
        </div>
      </motion.div>

      {/* Recently eaten feed */}
      <AnimatePresence mode="popLayout">
        <motion.div
          className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap gap-1 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {eatenPlatforms.slice(-10).map((name, i) => (
            <motion.span
              key={`${name}-${i}-${Date.now()}`}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              className="font-mono text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded"
            >
              {name}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Year indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-indigo-400/70 text-xs z-10">
        2026: SOFTWARE EATS ITSELF
      </div>

      {/* Corner decorations */}
      <div className="absolute bottom-24 right-4 font-mono text-indigo-500/40 text-xs z-10">
        *CHOMP*
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          boxShadow: "inset 0 0 150px rgba(0, 0, 0, 0.7)",
        }}
      />
    </div>
  )
}
