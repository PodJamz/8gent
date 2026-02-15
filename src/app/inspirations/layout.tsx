import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inspirations - OpenClaw-OS | People Who Inspire My Work",
  description:
    "Discover the designers, developers, and thought leaders who inspire OpenClaw-OS's work. A curated collection of innovative minds in tech, design, and product.",
  keywords: [
    "OpenClaw-OS inspirations",
    "Tech inspirations",
    "Design inspirations",
    "Developer inspirations",
    "Product leaders",
    "Thought leaders tech",
    "Creative inspirations",
    "Dublin tech community",
  ],
  openGraph: {
    title: "Inspirations - OpenClaw-OS",
    description: "People who inspire my work in tech, design, and product.",
    url: "https://openclaw.io/inspirations",
    type: "website",
    images: [
      {
        url: "https://openclaw.io/openclaw-logo.png",
        width: 1200,
        height: 630,
        alt: "OpenClaw-OS - Inspirations",
      },
    ],
  },
  twitter: {
    title: "Inspirations - OpenClaw-OS",
    description: "The people who inspire my work.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://openclaw.io/inspirations",
  },
};

export default function InspirationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
