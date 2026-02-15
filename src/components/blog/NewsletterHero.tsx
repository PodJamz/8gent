"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";

interface NewsletterHeroProps {
  backgroundImage?: string;
}

export function NewsletterHero({
  backgroundImage = "https://2oczblkb3byymav8.public.blob.vercel-storage.com/FB394334-6F13-446C-8B43-57C993D05E01.png"
}: NewsletterHeroProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email");
      return;
    }

    setStatus("loading");

    // Simulate API call - replace with actual newsletter signup
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For now, just save to localStorage as a demo
    const subscribers = JSON.parse(localStorage.getItem("newsletter-subscribers") || "[]");
    subscribers.push({ email, subscribedAt: new Date().toISOString() });
    localStorage.setItem("newsletter-subscribers", JSON.stringify(subscribers));

    setStatus("success");
    setEmail("");

    // Reset after 3 seconds
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <section className="relative w-full min-h-[500px] sm:min-h-[600px] rounded-3xl overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Newsletter background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-transparent to-blue-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[500px] sm:min-h-[600px] px-6 py-12 text-center">
        {/* Decorative sparkle */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6"
        >
          <Sparkles className="w-8 h-8 text-white/80" />
        </motion.div>

        {/* Title - Elegant serif style */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif italic text-white mb-8 tracking-tight drop-shadow-lg"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          ClawAI Weekly
        </motion.h1>

        {/* Email Input - Glassmorphic */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="w-full max-w-md mb-6"
        >
          <div className="relative flex items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Enter your email"
              disabled={status === "loading" || status === "success"}
              className="w-full h-14 sm:h-16 pl-6 pr-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white placeholder-white/60 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="absolute right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 shadow-lg"
              aria-label="Subscribe"
            >
              <AnimatePresence mode="wait">
                {status === "loading" ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="w-5 h-5 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin"
                  />
                ) : status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="arrow"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Error/Success messages */}
          <AnimatePresence>
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 text-sm text-red-300"
              >
                {errorMessage}
              </motion.p>
            )}
            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 text-sm text-green-300"
              >
                Welcome aboard! Check your inbox soon.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="max-w-lg text-base sm:text-lg text-white/90 leading-relaxed mb-8 drop-shadow-md"
        >
          Every week I share what I&apos;ve been learning, an interesting free resource,
          and a quick build I made. Join the journey.
        </motion.p>

        {/* Secondary CTA */}
        <motion.a
          href="#posts"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="px-6 py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-sm font-medium hover:bg-white/25 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Read the Archives
        </motion.a>
      </div>

      {/* Bottom fade for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
