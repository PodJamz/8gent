/**
 * Humans Layout - Force dynamic rendering for auth-required pages
 */
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Humans - People Search | 8gent",
  description:
    "Search for professionals and talent. AI-powered people search to find the right collaborators for your projects.",
};

export default function HumansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
