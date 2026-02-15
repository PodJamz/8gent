/**
 * Search Layout - Force dynamic rendering for search pages with useSearchParams
 */
import { Suspense } from "react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search - OpenClaw-OS Portfolio",
  description:
    "Search through OpenClaw-OS's portfolio, projects, and expertise.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<SearchFallback />}>{children}</Suspense>;
}

function SearchFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white/50 text-sm">Loading search...</div>
    </div>
  );
}
