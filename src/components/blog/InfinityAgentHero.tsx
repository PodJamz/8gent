"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InfinityAgentHeroProps {
  className?: string;
}

const METAPHORS = [
  { data: "projects", dimension: "garden", desc: "watch them bloom" },
  { data: "contacts", dimension: "vinyl shelf", desc: "flip through people" },
  { data: "memories", dimension: "isometric city", desc: "walk through time" },
  { data: "tasks", dimension: "dungeon", desc: "clear rooms to proceed" },
  { data: "knowledge", dimension: "skill tree", desc: "level up understanding" },
  { data: "drafts", dimension: "workshop", desc: "works in progress" },
  { data: "values", dimension: "constellation", desc: "principles as stars" },
];

const InfinityAgentHero: React.FC<InfinityAgentHeroProps> = ({ className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering) {
        setCurrentIndex((prev) => (prev + 1) % METAPHORS.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovering]);

  // Infinity symbol particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { t: number; speed: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        t: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.01,
        size: 1 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.7,
      });
    }

    const infinityPath = (t: number, cx: number, cy: number, scale: number) => {
      // Lemniscate of Bernoulli (infinity symbol)
      const x = (scale * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t));
      const y = (scale * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t));
      return { x: cx + x, y: cy + y };
    };

    let animationId: number;
    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.35;

      // Draw infinity path outline
      ctx.beginPath();
      ctx.strokeStyle = "rgba(251, 191, 36, 0.15)";
      ctx.lineWidth = 2;
      for (let t = 0; t <= Math.PI * 2; t += 0.01) {
        const { x, y } = infinityPath(t, cx, cy, scale);
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw particles along infinity path
      particles.forEach((p) => {
        p.t += p.speed;
        if (p.t > Math.PI * 2) p.t -= Math.PI * 2;

        const { x, y } = infinityPath(p.t, cx, cy, scale);

        ctx.beginPath();
        ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, p.size * 4);
        gradient.addColorStop(0, `rgba(251, 191, 36, ${p.alpha * 0.3})`);
        gradient.addColorStop(1, "rgba(251, 191, 36, 0)");
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x, y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const current = METAPHORS[currentIndex];

  return (
    <div
      className={`relative rounded-2xl sm:rounded-3xl overflow-hidden ${className}`}
      style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Infinity particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.8 }}
      />

      {/* Central content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {/* Infinity symbol */}
        <motion.div
          className="text-6xl sm:text-8xl md:text-9xl font-light text-amber-400 mb-4"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          ∞
        </motion.div>

        {/* Agent label */}
        <motion.div
          className="text-xs sm:text-sm tracking-[0.3em] text-amber-400/60 uppercase mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          The Infinity Agent
        </motion.div>

        {/* Dynamic metaphor display */}
        <div className="text-center px-4 max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <div className="text-xs sm:text-sm text-zinc-500 font-mono">
                &quot;Show me my{" "}
                <span className="text-amber-400">{current.data}</span> as a{" "}
                <span className="text-amber-400">{current.dimension}</span>&quot;
              </div>
              <div className="text-xs text-zinc-600 italic">
                {current.desc}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Matrix indicator dots */}
        <div className="absolute bottom-6 flex gap-2">
          {METAPHORS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-amber-400 w-4"
                  : "bg-zinc-700 hover:bg-zinc-500"
              }`}
              aria-label={`View metaphor ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 text-xs font-mono text-zinc-700">
        ENTITY
      </div>
      <div className="absolute top-4 right-4 text-xs font-mono text-zinc-700">
        DIMENSION
      </div>
      <div className="absolute bottom-4 left-4 text-xs font-mono text-zinc-700">
        VIEW
      </div>
      <div className="absolute bottom-4 right-4 text-xs font-mono text-zinc-700">
        STYLE
      </div>
    </div>
  );
};

export default InfinityAgentHero;
