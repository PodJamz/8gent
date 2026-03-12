"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Building2,
  Heart,
  Stethoscope,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  Clock,
  Layers,
} from "lucide-react"

// =============================================================================
// Slide Data - Government Pitch (Primary for Autism Innovation Strategy)
// =============================================================================

interface Slide {
  title: string
  subtitle?: string
  content: string[]
  visual?: string
  accent?: string
}

interface Presentation {
  id: string
  title: string
  subtitle: string
  audience: string
  duration: string
  color: string
  slides: Slide[]
}

const GOVERNMENT_PITCH: Presentation = {
  id: "government-pitch",
  title: "8gent Jr",
  subtitle: "A National Solution for Autism Communication",
  audience: "Irish Government & Public Bodies",
  duration: "12-15 min",
  color: "#22c55e",
  slides: [
    {
      title: "Ireland's Autism Challenge",
      content: [
        "70,000 autistic people live in Ireland today",
        "Over 5,000 children diagnosed each year",
        "18-24 month average wait for assessment",
        "These are Irish children. Irish families. Our communities.",
      ],
      visual: "Map of Ireland with statistics across counties",
      accent: "#22c55e",
    },
    {
      title: "The Communication Crisis",
      content: [
        "AAC Devices: \u20ac5,000-15,000 per device. Not covered by medical card.",
        "Speech Therapy: 22-month average wait for HSE services. Private: \u20ac80-120/session.",
        "Specialist Schools: Oversubscribed. Geographic barriers.",
        "Children falling behind. Families in crisis. Potential unrealized.",
      ],
      accent: "#ef4444",
    },
    {
      title: "The Human Cost",
      subtitle: "One family's story",
      content: [
        "A single father in Dublin. His 8-year-old son is autistic and minimally verbal.",
        "14 months for diagnosis. 18 months for speech therapy.",
        "AAC device recommended: \u20ac6,000, not covered.",
        "This father is a software engineer. So he built his own solution.",
        "What started as a father's love became 8gent Jr.",
      ],
      accent: "#f59e0b",
    },
    {
      title: "Introducing 8gent Jr",
      subtitle: "Ireland's answer to the AAC crisis",
      content: [
        "\u2713 Works on any device (phone, tablet, computer)",
        "\u2713 Supports Irish English and Irish language",
        "\u2713 Follows NCSE and HSE guidelines",
        "\u2713 Integrates with school and therapy settings",
        "\u2713 Real-time analytics for caregivers",
        "\u2713 Costs nothing for families",
      ],
      accent: "#22c55e",
    },
    {
      title: "Alignment with National Policy",
      content: [
        "Progressing Disability Services (PDS): Family-centered supports",
        "NCSE Policy: Inclusive education through accessible tools",
        "Sl\u00e1intecare: Digital health transformation",
        "National Disability Inclusion Strategy 2017-2027",
        "UN Convention on Rights of Persons with Disabilities: Article 21",
      ],
      accent: "#3b82f6",
    },
    {
      title: "The Technology",
      content: [
        "AI-Powered Prediction: Learns each child's patterns",
        "Gestalt Language Processing: All 6 GLP stages supported",
        "ARASAAC Pictograms: International standard symbols",
        "Data Sovereignty: EU-compliant, GDPR compliant, Irish-hosted option",
        "Offline Support: Works without internet \u2014 critical for rural communities",
      ],
      accent: "#8b5cf6",
    },
    {
      title: "Comprehensive Feature Set",
      subtitle: "One platform. Complete support.",
      content: [
        "Communication Hub: 500+ phrases, 18 categories, sentence builder",
        "Education: 11 speech therapy games, curriculum alignment",
        "Sensory Support: Calm modes, visual timers, regulation tools",
        "Creative Expression: Drawing, music, self-expression",
        "Caregiver Dashboard: Real-time analytics & progress tracking",
      ],
      accent: "#06b6d4",
    },
    {
      title: "Cost Comparison",
      content: [
        "Current State per child: \u20ac8,000-20,000+ annually",
        "\u2014 AAC Device: \u20ac5-15K | Therapy: \u20ac2-3K | Support: \u20ac1.5-3K",
        "With 8gent Jr per child: \u20ac200-500 annually",
        "\u2014 Platform: \u20ac0 for families | Institutional: \u20ac200-500",
        "At scale (10,000 children): \u20ac80-150 million savings annually",
      ],
      accent: "#22c55e",
    },
    {
      title: "Implementation Model",
      subtitle: "National rollout in three phases",
      content: [
        "Phase 1 (Year 1): 500 families across 4 counties. Partner with HSE and 10 schools.",
        "Phase 2 (Year 2): 5,000 families. Integrate with PDS. National training.",
        "Phase 3 (Year 3+): Universal access. Every autistic child in Ireland.",
        "We are ready to begin Phase 1 immediately.",
      ],
      accent: "#3b82f6",
    },
    {
      title: "Measurable Outcomes",
      content: [
        "Communication: 50% increase in daily attempts, 30% phrase variety improvement",
        "Education: Increased participation, better teacher understanding",
        "Healthcare: Reduced wait times, data-driven interventions",
        "Economic: \u20ac80-150M annual savings at scale",
        "All outcomes independently measured and reported.",
      ],
      accent: "#22c55e",
    },
    {
      title: "Partnerships Needed",
      content: [
        "HSE: Clinical validation, therapist training",
        "Department of Education: School deployment, NCSE alignment",
        "Enterprise Ireland / IDA: Irish-built tech support, export potential",
        "Universities: Clinical research (Trinity, UCD, DCU)",
        "Ireland can lead Europe in autism technology.",
      ],
      accent: "#f59e0b",
    },
    {
      title: "Irish Innovation Story",
      content: [
        "Ireland created Stripe. We're Europe's tech hub.",
        "Now we lead in something more important: ensuring every child can communicate.",
        "8gent Jr is Irish innovation applied to human dignity.",
        "Built in Dublin. Serving Cork, Galway, Limerick, and every village in between.",
        "Then the world.",
      ],
      accent: "#22c55e",
    },
    {
      title: "The Ask",
      content: [
        "1. Pilot Funding: \u20ac500,000 for Phase 1 (500 families, 12 months)",
        "2. HSE Partnership: Clinical validation and integration",
        "3. Dept of Education: School pilot in 4 counties",
        "4. Letter of Intent: For national rollout pending pilot",
        "5. Cross-Department Coordination: Single point of contact",
      ],
      accent: "#ef4444",
    },
    {
      title: "Social Impact Statement",
      content: [
        "Every autistic child in Ireland deserves:",
        "The right to communicate. The right to learn.",
        "The right to play. The right to be understood.",
        "Communication technology should be a public good.",
        "8gent Jr makes that possible. Today.",
      ],
      accent: "#ec4899",
    },
    {
      title: "Go raibh maith agaibh",
      subtitle: "Built in Ireland. For Ireland's children.",
      content: [
        "In 1985, one device gave Stephen Hawking a voice.",
        "In 2026, one platform can give every autistic child in Ireland a voice.",
        "We have the technology. We have the plan.",
        "We need your partnership.",
        "8gent Jr \u2014 james@8gent.app",
      ],
      accent: "#22c55e",
    },
  ],
}

const ALL_PRESENTATIONS = [
  {
    id: "government-pitch",
    title: "Government & Public Bodies",
    subtitle: "A National Solution for Ireland",
    audience: "HSE, Dept of Education, Tusla, NDA",
    duration: "12-15 min",
    slides: 15,
    color: "#22c55e",
    icon: Building2,
    ready: true,
  },
  {
    id: "investor-pitch",
    title: "Investor Pitch",
    subtitle: "The Voice Box for the AI Generation",
    audience: "VCs, Impact Investors, Angels",
    duration: "8-10 min",
    slides: 15,
    color: "#3b82f6",
    icon: Building2,
    ready: false,
  },
  {
    id: "parent-guide",
    title: "For Parents & Families",
    subtitle: "This Is Your Child's Voice",
    audience: "Parents, Guardians, Extended Family",
    duration: "8-10 min",
    slides: 15,
    color: "#ec4899",
    icon: Heart,
    ready: false,
  },
  {
    id: "therapist-guide",
    title: "For Therapists",
    subtitle: "Clinical-Grade AAC",
    audience: "SLTs, OTs, BCBAs",
    duration: "10-12 min",
    slides: 15,
    color: "#8b5cf6",
    icon: Stethoscope,
    ready: false,
  },
  {
    id: "educator-guide",
    title: "For Teachers & Schools",
    subtitle: "Every Student Deserves to Participate",
    audience: "Teachers, SNAs, SENCOs",
    duration: "10-12 min",
    slides: 15,
    color: "#f59e0b",
    icon: GraduationCap,
    ready: false,
  },
  {
    id: "child-demo",
    title: "For Kids",
    subtitle: "This Is YOUR Voice!",
    audience: "The Children Who Use It",
    duration: "6-8 min",
    slides: 16,
    color: "#06b6d4",
    icon: Sparkles,
    ready: false,
  },
]

// =============================================================================
// Slide Viewer Component
// =============================================================================

function SlideViewer({
  presentation,
  onBack,
}: {
  presentation: Presentation
  onBack: () => void
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const slide = presentation.slides[currentSlide]
  const totalSlides = presentation.slides.length

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSlides) {
        setCurrentSlide(index)
      }
    },
    [totalSlides]
  )

  const next = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      goTo(currentSlide + 1)
    } else {
      setIsPlaying(false)
    }
  }, [currentSlide, totalSlides, goTo])

  const prev = useCallback(() => {
    goTo(currentSlide - 1)
  }, [currentSlide, goTo])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        next()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        prev()
      } else if (e.key === "Escape") {
        if (isFullscreen) {
          document.exitFullscreen?.()
        } else {
          onBack()
        }
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [next, prev, isFullscreen, onBack])

  // Voiceover playback
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }

    if (audioEnabled) {
      const slideNum = String(currentSlide + 1).padStart(2, "0")
      const audio = new Audio(
        `/audio/voiceovers/${presentation.id}/slide-${slideNum}.mp3`
      )
      audio.volume = 0.9
      audioRef.current = audio

      audio.addEventListener("ended", () => {
        if (isPlaying) {
          setTimeout(next, 800)
        }
      })

      audio.play().catch(() => {
        // Autoplay blocked - that's fine
      })
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [currentSlide, audioEnabled, presentation.id])

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying || audioEnabled) return
    const timer = setTimeout(next, 6000)
    return () => clearTimeout(timer)
  }, [isPlaying, currentSlide, audioEnabled, next])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gray-950 flex flex-col"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-900/80 backdrop-blur-sm border-b border-white/5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">All Presentations</span>
        </button>

        <div className="text-center">
          <span className="text-white/40 text-xs font-mono">
            {currentSlide + 1} / {totalSlides}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
            title={audioEnabled ? "Mute voiceover" : "Enable voiceover"}
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
            title="Toggle fullscreen (F)"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Slide Area */}
      <div className="flex-1 flex items-center justify-center relative px-4 py-8">
        {/* Previous button */}
        <button
          onClick={prev}
          disabled={currentSlide === 0}
          className="absolute left-4 z-10 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-4xl mx-auto"
          >
            <div
              className="rounded-2xl border border-white/10 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${slide.accent || "#22c55e"}08, ${slide.accent || "#22c55e"}03, transparent)`,
              }}
            >
              <div className="p-12 md:p-16 min-h-[420px] flex flex-col justify-center">
                {/* Slide number */}
                <div
                  className="text-xs font-mono tracking-widest mb-6 uppercase"
                  style={{ color: slide.accent || "#22c55e" }}
                >
                  Slide {currentSlide + 1}
                </div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-5xl font-bold text-white mb-2"
                >
                  {slide.title}
                </motion.h2>

                {slide.subtitle && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-lg text-white/50 mb-8"
                  >
                    {slide.subtitle}
                  </motion.p>
                )}

                {!slide.subtitle && <div className="mb-8" />}

                {/* Content bullets */}
                <div className="space-y-4">
                  {slide.content.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0"
                        style={{
                          backgroundColor: slide.accent || "#22c55e",
                        }}
                      />
                      <p className="text-white/80 text-lg leading-relaxed">
                        {line}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        <button
          onClick={next}
          disabled={currentSlide === totalSlides - 1}
          className="absolute right-4 z-10 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="px-6 py-4 bg-gray-900/80 backdrop-blur-sm border-t border-white/5">
        {/* Progress bar */}
        <div className="flex gap-1.5 mb-3">
          {presentation.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="flex-1 h-1 rounded-full transition-all"
              style={{
                backgroundColor:
                  i === currentSlide
                    ? slide.accent || "#22c55e"
                    : i < currentSlide
                      ? `${slide.accent || "#22c55e"}60`
                      : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-white/30 text-xs">
            Arrow keys or Space to navigate {"\u00b7"} F for fullscreen{" "}
            {"\u00b7"} Esc to exit
          </p>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: isPlaying
                ? `${slide.accent || "#22c55e"}20`
                : "rgba(255,255,255,0.05)",
              color: isPlaying ? slide.accent || "#22c55e" : "rgba(255,255,255,0.4)",
            }}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            {isPlaying ? "Pause" : "Auto-play"}
          </button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Hub Page
// =============================================================================

export default function PresentationsPage() {
  const [activePresentation, setActivePresentation] = useState<string | null>(
    null
  )

  // Direct link support via hash
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash && ALL_PRESENTATIONS.find((p) => p.id === hash && p.ready)) {
      setActivePresentation(hash)
    }
  }, [])

  if (activePresentation === "government-pitch") {
    return (
      <SlideViewer
        presentation={GOVERNMENT_PITCH}
        onBack={() => {
          setActivePresentation(null)
          window.location.hash = ""
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Hero */}
      <section className="pt-20 pb-12 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute top-32 right-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-6 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Presentation Suite
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            8gent Jr
          </h1>
          <p className="text-xl text-white/50 mb-2">
            The Voice Box for the AI Generation
          </p>
          <p className="text-white/30 max-w-xl mx-auto">
            Every autistic child deserves an AI that understands them. Free for
            all families, forever.
          </p>
        </motion.div>
      </section>

      {/* Presentations Grid */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_PRESENTATIONS.map((pres, i) => {
            const Icon = pres.icon
            return (
              <motion.button
                key={pres.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => {
                  if (pres.ready) {
                    setActivePresentation(pres.id)
                    window.location.hash = pres.id
                  }
                }}
                disabled={!pres.ready}
                className={`text-left rounded-xl border p-6 transition-all group ${
                  pres.ready
                    ? "border-white/10 hover:border-white/20 hover:bg-white/[0.02] cursor-pointer"
                    : "border-white/5 opacity-40 cursor-not-allowed"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${pres.color}15`,
                    color: pres.color,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="font-semibold text-white mb-1">{pres.title}</h3>
                <p className="text-sm text-white/40 mb-3">{pres.subtitle}</p>

                <div className="flex items-center gap-3 text-xs text-white/25">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {pres.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3" /> {pres.slides} slides
                  </span>
                </div>

                {pres.ready && (
                  <div
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: pres.color }}
                  >
                    <Play className="w-3 h-3" /> View Presentation
                  </div>
                )}
                {!pres.ready && (
                  <div className="mt-4 text-xs text-white/20">Coming soon</div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-white/20 text-sm">
            James Spalding {"\u00b7"} Founder & Father {"\u00b7"}{" "}
            james@8gent.app
          </p>
          <p className="text-white/10 text-xs mt-2">
            Dublin, Ireland {"\u00b7"} 8gent.app/jr
          </p>
        </div>
      </section>
    </div>
  )
}
