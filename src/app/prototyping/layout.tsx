import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rapid Prototyping - OpenClaw-OS | MVP Development & High-Velocity Engineering",
  description:
    "Rapid prototyping and MVP development services by OpenClaw-OS. From concept to production in days, not months. React, Next.js, TypeScript, and AI-native development.",
  keywords: [
    "OpenClaw-OS prototyping",
    "Rapid prototyping Dublin",
    "MVP development Ireland",
    "High-velocity development",
    "Fast prototyping",
    "Concept to production",
    "React prototyping",
    "Next.js MVP",
    "TypeScript development",
    "AI-native prototyping",
    "Startup MVP",
    "Product prototype",
    "Cursor IDE developer",
    "v0.dev prototyping",
  ],
  openGraph: {
    title: "Rapid Prototyping - OpenClaw-OS",
    description: "MVP development from concept to production. High-velocity engineering.",
    url: "https://openclaw.io/prototyping",
    type: "website",
    images: [
      {
        url: "https://openclaw.io/openclaw-logo.png",
        width: 1200,
        height: 630,
        alt: "OpenClaw-OS - Rapid Prototyping",
      },
    ],
  },
  twitter: {
    title: "Rapid Prototyping - OpenClaw-OS",
    description: "MVP development in days, not months.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://openclaw.io/prototyping",
  },
};

export default function PrototypingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
