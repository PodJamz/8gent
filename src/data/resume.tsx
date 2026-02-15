import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon, BookOpen, Palette, Music, PencilRuler } from "lucide-react";

export const DATA = {
  name: "OpenClaw-OS",
  initials: "OC",
  url: "https://openclaw.io/",
  location: "Dublin, Ireland",
  locationLink: "https://www.google.com/maps/place/dublin+ireland",
  description:
    "An AI-native operating system designed for high-performance productivity, agentic orchestration, and seamless human-AI collaboration.",
  summary: `OpenClaw-OS is a next-generation operating environment built for the AI age. It bridges design, engineering, and product strategy into a single, cohesive experience.

**AI-Native Architecture** - Designed from the ground up to support multi-agent collaboration, context management, and intelligent automation.

**High-Craft UI/UX** - A professional, iOS-style interface with 50+ beautiful themes, liquid animations, and glassmorphic aesthetics.

**Agentic Control Plane** - Use the integrated AI assistant to orchestrate complex workflows, manage projects, and build functional prototypes directly through conversation.`,
  avatarUrl: "/openclaw-logo.png",
  skills: [
    "Agentic AI Orchestration",
    "Product-Led Development",
    "AI Context Management",
    "Multi-Agent Systems",
    "React & Next.js",
    "TailwindCSS",
    "Cloud-native Systems",
    "System Thinking",
    "UI/UX Design Systems",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/canvas", icon: PencilRuler, label: "Canvas" },
    { href: "/design", icon: Palette, label: "Design" },
    { href: "/music", icon: Music, label: "Music" },
  ],
  contact: {
    email: "hello@openclaw.io",
    tel: "",
    website: "https://openclaw.io/",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/openclaw",
        icon: Icons.github,
        navbar: false,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/company/openclaw",
        icon: Icons.linkedin,
        navbar: false,
      },
      X: {
        name: "X",
        url: "https://x.com/openclaw",
        icon: Icons.x,
        navbar: false,
      },
      website: {
        name: "Website",
        url: "https://openclaw.io/",
        icon: Icons.globe,
        navbar: false,
      },
      email: {
        name: "Send Email",
        url: "#",
        icon: Icons.email,
        navbar: false,
      },
    },
  },
  work: [
    {
      company: "OpenClaw Development",
      href: "",
      badges: ["Active"],
      location: "Remote",
      title: "Core System Development",
      logoUrl: "/openclaw-logo.png",
      start: "2024",
      end: "Present",
      description: "Leading the development of the OpenClaw-OS ecosystem, focusing on AI-native interaction models and design-led system architecture."
    },
    {
      company: "The Creative Engine",
      href: "",
      badges: [],
      location: "Worldwide",
      title: "Product Innovation Lab",
      logoUrl: "🎨",
      start: "2019",
      end: "2024",
      description: "Research and development into the future of human-computer interaction and AI-amplified creativity."
    }
  ],
  education: [
    {
      school: "OpenClaw OS Institute",
      href: "",
      degree: "Systems Architecture",
      logoUrl: "",
      start: "2020",
      end: "2024",
    }
  ],
  projects: [
    {
      title: "OpenClaw-OS",
      href: "https://openclaw.io",
      dates: "2025",
      active: true,
      description: "The core operating system featuring 50+ themes, AI-native workflows, and an integrated assistant.",
      technologies: ["Next.js 16", "React 19", "Claude API", "TailwindCSS"],
      links: [{ type: "Website", href: "https://openclaw.io", icon: <Icons.globe className="size-3" /> }],
      image: "",
      video: "",
    }
  ],
  hackathons: [],
} as const;