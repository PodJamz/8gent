"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MetaPortfolioHeroProps {
  className?: string
}

const SIMPLE_PORTFOLIO = [
  "About",
  "Work",
  "Contact",
]

const LIVING_SYSTEM = [
  "Entities",
  "Relationships",
  "Dimensions",
  "Conversations",
  "Creations",
  "Evolution",
]

export default function MetaPortfolioHero({ className = "" }: MetaPortfolioHeroProps) {
  const [phase, setPhase] = useState<"simple" | "question" | "living">("simple")

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase("question"), 2500)
    const timer2 = setTimeout(() => setPhase("living"), 5000)
    const timer3 = setTimeout(() => setPhase("simple"), 9000)

    const interval = setInterval(() => {
      setPhase("simple")
      setTimeout(() => setPhase("question"), 2500)
      setTimeout(() => setPhase("living"), 5000)
    }, 9000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className={`relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 ${className}`}>
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {phase === "simple" && (
            <motion.div
              key="simple"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Simple portfolio mockup */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sm:p-8 max-w-xs mx-auto">
                <div className="w-12 h-12 rounded-full bg-white/10 mx-auto mb-4" />
                <div className="h-3 w-24 bg-white/20 rounded mx-auto mb-6" />
                <div className="flex justify-center gap-4">
                  {SIMPLE_PORTFOLIO.map((item) => (
                    <span key={item} className="text-xs sm:text-sm text-white/40 font-mono">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-6 text-white/30 text-sm font-mono">
                A simple portfolio.
              </p>
            </motion.div>
          )}

          {phase === "question" && (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="text-center px-4"
            >
              <p className="text-white/60 text-lg sm:text-xl md:text-2xl font-light italic max-w-md">
                &ldquo;What would I build if I were asked to build the best possible product today?&rdquo;
              </p>
            </motion.div>
          )}

          {phase === "living" && (
            <motion.div
              key="living"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Living system visualization */}
              <div className="relative">
                <div className="flex flex-wrap justify-center gap-3 max-w-sm mx-auto">
                  {LIVING_SYSTEM.map((item, i) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs sm:text-sm text-white/60 font-mono"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>

                {/* Connecting lines animation */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: '-20px', height: 'calc(100% + 40px)' }}>
                  <motion.line
                    x1="30%" y1="30%" x2="70%" y2="70%"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  <motion.line
                    x1="70%" y1="30%" x2="30%" y2="70%"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </svg>
              </div>

              <p className="mt-8 text-white/30 text-sm font-mono">
                A living system.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-white/10" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-white/10" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-white/10" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-white/10" />
    </div>
  )
}
