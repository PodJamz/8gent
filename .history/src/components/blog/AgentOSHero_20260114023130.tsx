"use client"

import Image from "next/image"

interface AgentOSHeroProps {
  className?: string;
  imageUrl?: string;
}

export default function AgentOSHero({ 
  className = "",
  imageUrl = "https://2oczblkb3byymav8.public.blob.vercel-storage.com/from-resume-to-agent-os-hero.png"
}: AgentOSHeroProps) {
  return (
    <div className={`relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl ${className}`}>
      <Image
        src={imageUrl}
        alt="From Resume to Agent OS - Transformation visualization"
        fill
        priority
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1024px"
      />
      {/* Subtle gradient overlay to maintain visual consistency */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-blue-500/10" />
    </div>
  )
}
