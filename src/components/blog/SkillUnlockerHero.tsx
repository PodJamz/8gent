"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SkillUnlockerHeroProps {
  className?: string
}

interface Skill {
  id: string
  name: string
  shortName: string
  icon: string
  color: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  unlocked: boolean
  description: string
}

const SKILLS: Skill[] = [
  {
    id: "git-workflow",
    name: "Git Workflow Discipline",
    shortName: "Git Flow",
    icon: "🌿",
    color: "#f97316",
    rarity: "rare",
    unlocked: false,
    description: "Branch like a pro, commit like a poet",
  },
  {
    id: "changeset",
    name: "Changeset & Versioning",
    shortName: "Versioning",
    icon: "🏷️",
    color: "#22c55e",
    rarity: "rare",
    unlocked: false,
    description: "Semantic versioning? More like semantic seasoning",
  },
  {
    id: "release-notes",
    name: "Release Notes",
    shortName: "Releases",
    icon: "📜",
    color: "#6366f1",
    rarity: "uncommon",
    unlocked: false,
    description: "Turn commits into compelling narratives",
  },
  {
    id: "project-modes",
    name: "Project Modes",
    shortName: "Modes",
    icon: "🎭",
    color: "#d946ef",
    rarity: "epic",
    unlocked: false,
    description: "Six personalities, one very confused AI",
  },
  {
    id: "context-memory",
    name: "Project Context Memory",
    shortName: "Memory",
    icon: "🧠",
    color: "#06b6d4",
    rarity: "legendary",
    unlocked: false,
    description: "Finally, I remember what I had for breakfast",
  },
]

const RARITY_COLORS = {
  common: "from-gray-400 to-gray-500",
  uncommon: "from-green-400 to-emerald-500",
  rare: "from-blue-400 to-indigo-500",
  epic: "from-purple-400 to-fuchsia-500",
  legendary: "from-amber-400 via-orange-500 to-red-500",
}

const RARITY_GLOW = {
  common: "shadow-gray-400/30",
  uncommon: "shadow-green-400/40",
  rare: "shadow-blue-400/50",
  epic: "shadow-purple-400/60",
  legendary: "shadow-amber-400/70",
}

export default function SkillUnlockerHero({ className = "" }: SkillUnlockerHeroProps) {
  const [skills, setSkills] = useState<Skill[]>(SKILLS)
  const [currentUnlock, setCurrentUnlock] = useState<number>(0)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [autoMode, setAutoMode] = useState(true)
  const [totalXP, setTotalXP] = useState(0)

  const rarityXP = {
    common: 10,
    uncommon: 25,
    rare: 50,
    epic: 100,
    legendary: 250,
  }

  const unlockNextSkill = useCallback(() => {
    if (isUnlocking) return

    const nextUnlockedIndex = skills.findIndex(s => !s.unlocked)
    if (nextUnlockedIndex === -1) {
      // All unlocked, reset for replay
      setSkills(SKILLS.map(s => ({ ...s, unlocked: false })))
      setCurrentUnlock(0)
      setTotalXP(0)
      return
    }

    setIsUnlocking(true)
    setCurrentUnlock(nextUnlockedIndex)

    // Unlock animation
    setTimeout(() => {
      setSkills(prev => prev.map((s, i) =>
        i === nextUnlockedIndex ? { ...s, unlocked: true } : s
      ))
      setTotalXP(prev => prev + rarityXP[skills[nextUnlockedIndex].rarity])
      setShowCelebration(true)

      setTimeout(() => {
        setShowCelebration(false)
        setIsUnlocking(false)
      }, 1500)
    }, 800)
  }, [skills, isUnlocking])

  // Auto unlock mode
  useEffect(() => {
    if (!autoMode) return

    const hasLocked = skills.some(s => !s.unlocked)
    if (!hasLocked) {
      // Wait then reset
      const timeout = setTimeout(() => {
        setSkills(SKILLS.map(s => ({ ...s, unlocked: false })))
        setCurrentUnlock(0)
        setTotalXP(0)
      }, 3000)
      return () => clearTimeout(timeout)
    }

    const interval = setInterval(() => {
      unlockNextSkill()
    }, 2500)

    return () => clearInterval(interval)
  }, [autoMode, skills, unlockNextSkill])

  const handleClick = () => {
    if (autoMode) {
      setAutoMode(false)
    } else {
      unlockNextSkill()
    }
  }

  const unlockedCount = skills.filter(s => s.unlocked).length

  return (
    <div
      className={`relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none ${className}`}
      onClick={handleClick}
      role="application"
      aria-label="Skill unlocking animation. Click to unlock skills manually."
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Title */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="font-mono text-indigo-400/80 text-xs sm:text-sm tracking-wider">
          OPENCLAW SKILL ACQUISITION SYSTEM
        </div>
      </motion.div>

      {/* XP Counter */}
      <motion.div
        className="absolute top-4 right-4 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="font-mono text-amber-400 text-xl sm:text-2xl font-bold">
          {totalXP.toLocaleString()} XP
        </div>
        <div className="font-mono text-amber-400/60 text-xs text-right">
          SKILL POINTS
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div
        className="absolute top-4 left-4 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="font-mono text-emerald-400 text-xl sm:text-2xl font-bold">
          {unlockedCount}/{skills.length}
        </div>
        <div className="font-mono text-emerald-400/60 text-xs">
          SKILLS UNLOCKED
        </div>
      </motion.div>

      {/* Skills Grid */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 max-w-3xl">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              className="relative"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { delay: index * 0.1 }
              }}
            >
              {/* Card */}
              <motion.div
                className={`
                  relative w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 rounded-xl
                  flex flex-col items-center justify-center gap-1
                  transition-all duration-500
                  ${skill.unlocked
                    ? `bg-gradient-to-br ${RARITY_COLORS[skill.rarity]} shadow-lg ${RARITY_GLOW[skill.rarity]}`
                    : "bg-slate-700/50 border border-slate-600/50"
                  }
                `}
                animate={{
                  scale: currentUnlock === index && isUnlocking ? [1, 1.2, 1] : 1,
                  rotateY: skill.unlocked ? [0, 360] : 0,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Locked overlay */}
                {!skill.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl opacity-50">🔒</span>
                  </div>
                )}

                {/* Unlocked content */}
                {skill.unlocked && (
                  <>
                    <span className="text-2xl sm:text-3xl">{skill.icon}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-white/90 text-center px-1 leading-tight">
                      {skill.shortName}
                    </span>
                    <span className={`
                      text-[8px] sm:text-[10px] font-mono uppercase tracking-wider
                      ${skill.rarity === "legendary" ? "text-amber-200" :
                        skill.rarity === "epic" ? "text-purple-200" :
                          skill.rarity === "rare" ? "text-blue-200" :
                            skill.rarity === "uncommon" ? "text-green-200" : "text-gray-200"}
                    `}>
                      {skill.rarity}
                    </span>
                  </>
                )}

                {/* Unlock particles */}
                <AnimatePresence>
                  {currentUnlock === index && showCelebration && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full"
                          style={{ backgroundColor: skill.color }}
                          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                          animate={{
                            x: (Math.random() - 0.5) * 100,
                            y: (Math.random() - 0.5) * 100,
                            opacity: 0,
                            scale: 0,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Rarity indicator dot */}
              {skill.unlocked && (
                <motion.div
                  className={`
                    absolute -top-1 -right-1 w-3 h-3 rounded-full
                    bg-gradient-to-br ${RARITY_COLORS[skill.rarity]}
                    shadow-lg
                  `}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Current skill description */}
      <AnimatePresence mode="wait">
        {showCelebration && skills[currentUnlock] && (
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-black/80 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
              <div className="font-bold text-white text-lg sm:text-xl">
                {skills[currentUnlock].name}
              </div>
              <div className="font-mono text-white/70 text-sm">
                {skills[currentUnlock].description}
              </div>
              <div className={`
                font-mono text-xs mt-1
                ${skills[currentUnlock].rarity === "legendary" ? "text-amber-400" :
                  skills[currentUnlock].rarity === "epic" ? "text-purple-400" :
                    skills[currentUnlock].rarity === "rare" ? "text-blue-400" :
                      skills[currentUnlock].rarity === "uncommon" ? "text-green-400" : "text-gray-400"}
              `}>
                +{rarityXP[skills[currentUnlock].rarity]} XP
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All unlocked celebration */}
      <AnimatePresence>
        {unlockedCount === skills.length && !isUnlocking && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <div className="font-bold text-white text-2xl sm:text-3xl">
                ALL SKILLS UNLOCKED!
              </div>
              <div className="font-mono text-amber-400 text-lg mt-2">
                Total: {totalXP.toLocaleString()} XP
              </div>
              <div className="font-mono text-white/50 text-sm mt-4">
                Resetting in 3...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className={`
          font-mono text-xs px-4 py-2 rounded-full
          ${autoMode ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}
        `}>
          {autoMode ? "AUTO MODE (click to take control)" : "MANUAL MODE (click to unlock)"}
        </div>
      </motion.div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          boxShadow: "inset 0 0 150px rgba(0, 0, 0, 0.5)",
        }}
      />
    </div>
  )
}
