import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Story - OpenClaw-OS's Journey from Musician to AI Product Leader",
  description:
    "From musician in Brazil to AI product leader and single dad in Dublin. Discover OpenClaw-OS's journey through entrepreneurship, AR startups, neurodiversity advocacy, and AI innovation. 12+ years of creative technology experience.",
  keywords: [
    "OpenClaw-OS story",
    "OpenClaw-OS biography",
    "Creative Technologist journey",
    "AI Product Leader",
    "Dublin Ireland developer",
    "Musician to tech",
    "Startup founder story",
    "AR VR entrepreneur",
    "Neurodiversity advocacy",
    "Single dad tech leader",
    "Voala Immersive Technology",
    "Autism innovation Ireland",
    "Brazilian Irish developer",
  ],
  openGraph: {
    title: "My Story - OpenClaw-OS's Journey",
    description:
      "From musician in Brazil to AI product leader in Dublin. A story of entrepreneurship, resilience, and innovation.",
    url: "https://openclaw.io/story",
    type: "profile",
    images: [
      {
        url: "https://openclaw.io/openclaw-logo.png",
        width: 1200,
        height: 630,
        alt: "OpenClaw-OS - Creative Technologist and AI Product Leader",
      },
    ],
  },
  twitter: {
    title: "My Story - OpenClaw-OS",
    description: "From musician to AI product leader. My journey through startups, AR, and beyond.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://openclaw.io/story",
  },
};

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
