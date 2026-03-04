"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ArchitectureAwakensHeroProps {
  className?: string;
}

interface Node {
  id: string;
  x: number;
  y: number;
  type: "Project" | "Ticket" | "Track" | "Person";
  name: string;
  targetX: number;
  targetY: number;
  visible: boolean;
  connected: boolean;
}

interface Edge {
  source: string;
  target: string;
  visible: boolean;
  progress: number;
}

const NODE_COLORS = {
  Project: "#6366f1",  // Indigo
  Ticket: "#22c55e",   // Green
  Track: "#ec4899",    // Pink
  Person: "#f59e0b",   // Amber
}

const STATS = [
  { label: "ENTITIES", value: 132, suffix: "" },
  { label: "RELATIONSHIPS", value: 128, suffix: "" },
  { label: "DIMENSIONS", value: 9, suffix: "" },
]

export default function ArchitectureAwakensHero({ className = "" }: ArchitectureAwakensHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [phase, setPhase] = useState<"spawning" | "connecting" | "alive">("spawning")
  const [stats, setStats] = useState(STATS.map(s => ({ ...s, current: 0 })))
  const animationRef = useRef<number | null>(null)

  // Initialize nodes
  useEffect(() => {
    const initialNodes: Node[] = [
      // Central project
      { id: "p1", x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, type: "Project", name: "8gent", visible: false, connected: false },
      // Tickets orbiting
      { id: "t1", x: 0.2, y: 0.3, targetX: 0.25, targetY: 0.3, type: "Ticket", name: "JAMES-001", visible: false, connected: false },
      { id: "t2", x: 0.8, y: 0.3, targetX: 0.75, targetY: 0.3, type: "Ticket", name: "JAMES-002", visible: false, connected: false },
      { id: "t3", x: 0.2, y: 0.7, targetX: 0.25, targetY: 0.7, type: "Ticket", name: "JAMES-003", visible: false, connected: false },
      { id: "t4", x: 0.8, y: 0.7, targetX: 0.75, targetY: 0.7, type: "Ticket", name: "JAMES-004", visible: false, connected: false },
      { id: "t5", x: 0.15, y: 0.5, targetX: 0.15, targetY: 0.5, type: "Ticket", name: "JAMES-005", visible: false, connected: false },
      { id: "t6", x: 0.85, y: 0.5, targetX: 0.85, targetY: 0.5, type: "Ticket", name: "JAMES-006", visible: false, connected: false },
      // Tracks
      { id: "tr1", x: 0.35, y: 0.2, targetX: 0.35, targetY: 0.2, type: "Track", name: "Track 1", visible: false, connected: false },
      { id: "tr2", x: 0.65, y: 0.2, targetX: 0.65, targetY: 0.2, type: "Track", name: "Track 2", visible: false, connected: false },
      { id: "tr3", x: 0.5, y: 0.85, targetX: 0.5, targetY: 0.85, type: "Track", name: "Track 3", visible: false, connected: false },
    ]

    const initialEdges: Edge[] = [
      { source: "t1", target: "p1", visible: false, progress: 0 },
      { source: "t2", target: "p1", visible: false, progress: 0 },
      { source: "t3", target: "p1", visible: false, progress: 0 },
      { source: "t4", target: "p1", visible: false, progress: 0 },
      { source: "t5", target: "p1", visible: false, progress: 0 },
      { source: "t6", target: "p1", visible: false, progress: 0 },
      { source: "tr1", target: "p1", visible: false, progress: 0 },
      { source: "tr2", target: "p1", visible: false, progress: 0 },
      { source: "tr3", target: "p1", visible: false, progress: 0 },
    ]

    setNodes(initialNodes)
    setEdges(initialEdges)

    // Spawn nodes one by one
    let nodeIndex = 0
    const spawnInterval = setInterval(() => {
      if (nodeIndex < initialNodes.length) {
        setNodes(prev => prev.map((n, i) => i === nodeIndex ? { ...n, visible: true } : n))
        nodeIndex++
      } else {
        clearInterval(spawnInterval)
        setPhase("connecting")
      }
    }, 200)

    return () => clearInterval(spawnInterval)
  }, [])

  // Connect nodes with edges
  useEffect(() => {
    if (phase !== "connecting") return

    let edgeIndex = 0
    const connectInterval = setInterval(() => {
      if (edgeIndex < edges.length) {
        setEdges(prev => prev.map((e, i) => i === edgeIndex ? { ...e, visible: true } : e))
        edgeIndex++
      } else {
        clearInterval(connectInterval)
        setPhase("alive")
      }
    }, 150)

    return () => clearInterval(connectInterval)
  }, [phase, edges.length])

  // Animate edge progress
  useEffect(() => {
    const animateEdges = () => {
      setEdges(prev => prev.map(e => ({
        ...e,
        progress: e.visible ? Math.min(e.progress + 0.05, 1) : 0
      })))
      animationRef.current = requestAnimationFrame(animateEdges)
    }
    animationRef.current = requestAnimationFrame(animateEdges)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Animate stats counting up
  useEffect(() => {
    if (phase !== "alive") return

    const duration = 2000
    const startTime = Date.now()

    const animateStats = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // Ease out cubic

      setStats(STATS.map(s => ({
        ...s,
        current: Math.floor(s.value * eased)
      })))

      if (progress < 1) {
        requestAnimationFrame(animateStats)
      }
    }

    requestAnimationFrame(animateStats)
  }, [phase])

  // Canvas drawing
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

    let frame = 0
    const draw = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      // Clear with fade trail
      ctx.fillStyle = "rgba(10, 10, 30, 0.15)"
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      ctx.strokeStyle = "rgba(99, 102, 241, 0.1)"
      ctx.lineWidth = 0.5
      const gridSize = 40
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw edges
      edges.forEach(edge => {
        if (!edge.visible || edge.progress === 0) return

        const sourceNode = nodes.find(n => n.id === edge.source)
        const targetNode = nodes.find(n => n.id === edge.target)
        if (!sourceNode || !targetNode) return

        const sx = sourceNode.targetX * width
        const sy = sourceNode.targetY * height
        const tx = targetNode.targetX * width
        const ty = targetNode.targetY * height

        // Animated edge
        const ex = sx + (tx - sx) * edge.progress
        const ey = sy + (ty - sy) * edge.progress

        // Gradient line
        const gradient = ctx.createLinearGradient(sx, sy, ex, ey)
        gradient.addColorStop(0, NODE_COLORS[sourceNode.type])
        gradient.addColorStop(1, NODE_COLORS[targetNode.type])

        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(ex, ey)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()

        // Pulse along the line
        if (edge.progress === 1) {
          const pulsePos = (frame * 0.02) % 1
          const px = sx + (tx - sx) * pulsePos
          const py = sy + (ty - sy) * pulsePos

          ctx.beginPath()
          ctx.arc(px, py, 3, 0, Math.PI * 2)
          ctx.fillStyle = "#fff"
          ctx.fill()
        }
      })

      // Draw nodes
      nodes.forEach(node => {
        if (!node.visible) return

        const x = node.targetX * width
        const y = node.targetY * height
        const color = NODE_COLORS[node.type]
        const radius = node.type === "Project" ? 20 : 12

        // Glow
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 3)
        glowGradient.addColorStop(0, color + "60")
        glowGradient.addColorStop(1, "transparent")
        ctx.beginPath()
        ctx.arc(x, y, radius * 3, 0, Math.PI * 2)
        ctx.fillStyle = glowGradient
        ctx.fill()

        // Node circle
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        // Inner highlight
        ctx.beginPath()
        ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.fill()

        // Pulse ring for alive phase
        if (phase === "alive") {
          const pulseScale = 1 + Math.sin(frame * 0.05) * 0.2
          ctx.beginPath()
          ctx.arc(x, y, radius * pulseScale * 1.5, 0, Math.PI * 2)
          ctx.strokeStyle = color + "40"
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })

      frame++
      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [nodes, edges, phase])

  return (
    <div className={`relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden ${className}`}>
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: "#0a0a1e" }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-30"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 4px)",
        }}
      />

      {/* Stats overlay */}
      <AnimatePresence>
        {phase === "alive" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-0 right-0 flex justify-center gap-8 sm:gap-12 z-20"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  {stat.current}
                </div>
                <div className="font-mono text-[10px] sm:text-xs tracking-widest text-white/60">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase indicator */}
      <motion.div
        className="absolute top-4 left-4 font-mono text-xs text-white/40 z-20"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {phase === "spawning" && "SPAWNING ENTITIES..."}
        {phase === "connecting" && "CREATING RELATIONSHIPS..."}
        {phase === "alive" && "GRAPH ACTIVE"}
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-4 right-4 font-mono text-indigo-500/40 text-xs z-20">
        ERV v1.0
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-indigo-500/40 text-xs z-20">
        48 HOURS
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-indigo-500/40 text-xs z-20">
        DREAM → REALITY
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
