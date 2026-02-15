/**
 * Calendar Layout - Force dynamic rendering for auth-required pages
 */
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Calendar - Book Time with OpenClaw-OS | AI & Product Consulting",
  description:
    "Book a meeting with OpenClaw-OS. Schedule AI consulting, product strategy sessions, or discovery calls. Dublin-based Creative Technologist available for projects.",
  keywords: [
    "Book OpenClaw-OS",
    "OpenClaw-OS calendar",
    "AI consulting appointment",
    "Product strategy meeting",
    "Dublin tech consultant",
    "Schedule consultation",
    "CPO consulting",
    "Hire AI developer",
  ],
  openGraph: {
    title: "Book Time - OpenClaw-OS",
    description: "Schedule a meeting for AI consulting or product strategy.",
    url: "https://openclaw.io/calendar",
    type: "website",
    images: [
      {
        url: "https://openclaw.io/openclaw-logo.png",
        width: 1200,
        height: 630,
        alt: "Book Time with OpenClaw-OS",
      },
    ],
  },
  twitter: {
    title: "Book OpenClaw-OS",
    description: "Schedule AI consulting or product strategy meetings.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://openclaw.io/calendar",
  },
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
