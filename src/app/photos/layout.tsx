import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photos - OpenClaw-OS | Visual Journey & Photography",
  description:
    "Photo gallery from OpenClaw-OS. Visual documentation of life, work, and travels between Dublin, Ireland and Brazil. A Creative Technologist's perspective.",
  keywords: [
    "OpenClaw-OS photos",
    "OpenClaw-OS photography",
    "Dublin photography",
    "Ireland photos",
    "Brazil photos",
    "Creative Technologist gallery",
    "Tech leader photography",
  ],
  openGraph: {
    title: "Photos - OpenClaw-OS",
    description: "Visual journey and photography from a Creative Technologist.",
    url: "https://openclaw.io/photos",
    type: "website",
    images: [
      {
        url: "https://openclaw.io/openclaw-logo.png",
        width: 1200,
        height: 630,
        alt: "OpenClaw-OS - Photos",
      },
    ],
  },
  twitter: {
    title: "OpenClaw-OS's Photos",
    description: "Photography from a Creative Technologist.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://openclaw.io/photos",
  },
};

export default function PhotosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
