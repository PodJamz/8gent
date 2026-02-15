import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music - OpenClaw-OS | Creative Technologist & Music Producer",
  description:
    "Explore OpenClaw-OS's music production work and audio creations. From ReLOVEution band days in Brazil to vibe coding tracks. A creative technologist who bridges music and technology.",
  keywords: [
    "OpenClaw-OS music",
    "Music producer Dublin",
    "Creative Technologist music",
    "ReLOVEution band",
    "Vibe coding music",
    "Tech and music",
    "Ireland music producer",
    "Brazilian Irish musician",
    "AI and music",
    "Audio production",
  ],
  openGraph: {
    title: "Music - OpenClaw-OS",
    description: "Music production and audio creations from a Creative Technologist.",
    url: "https://openclaw.io/music",
    type: "website",
    images: [
      {
        url: "https://openclaw.io/openclaw-logo.png",
        width: 1200,
        height: 630,
        alt: "OpenClaw-OS - Music",
      },
    ],
  },
  twitter: {
    title: "OpenClaw-OS's Music",
    description: "Music production from a Creative Technologist.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://openclaw.io/music",
  },
};

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
