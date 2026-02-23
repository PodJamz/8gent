import React from "react";
import Image from "next/image";
import HalftoneWave from "./HalftoneWave";
import CursorIDEHero from "./CursorIDEHero";
import ProfileHero from "@/components/profile/ProfileHero";
import IrisHero from "./IrisHero";
import AgentOSHero from "./AgentOSHero";
import DimensionalDreamHero from "./DimensionalDreamHero";
import MetaPortfolioHero from "./MetaPortfolioHero";
import OpenClawHero from "./OpenClawHero";
import ArchitectureAwakensHero from "./ArchitectureAwakensHero";
import PacManHero from "./PacManHero";
import SkillUnlockerHero from "./SkillUnlockerHero";

interface BlogContentProps {
  heroImageGradient: string;
  imageCaption?: string;
  children: React.ReactNode;
  postSlug?: string;
  heroImageUrl?: string;
}

export const BlogContent: React.FC<BlogContentProps> = ({ heroImageGradient, imageCaption, children, postSlug, heroImageUrl }) => {

  const renderHeroExperience = () => {
    switch (postSlug) {
      case 'Cursor':
        return <CursorIDEHero className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]" />;
      case 'ND-AI':
        return <HalftoneWave className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl sm:rounded-3xl" />;
      case 'design-psychology':
        return <IrisHero className="w-full" imageSrc="/irishcountryside.png" title="Gather Your Thoughts" subtitle="Save thoughts the moment they appear. Keep them effortlessly organized and never lose an idea." interactive={false} />;
      case 'way-ai-experience':
        return (
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">
            <Image
              src="/projects/way.png"
              alt="Way AI interface showing contemplative water simulation"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        );
      case 'from-resume-to-agent-os':
        return <AgentOSHero className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]" imageUrl={heroImageUrl} />;
      case 'i-dreamed-the-architecture':
        return <DimensionalDreamHero className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]" />;
      case 'why-i-couldnt-just-make-a-simple-system':
        return <MetaPortfolioHero className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]" />;
      case 'the-openclaw-ai':
        return <OpenClawHero className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]" />;
      case 'the-architecture-awakens':
        return <ArchitectureAwakensHero className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]" />;
      case 'the-day-i-gave-myself-hands':
        return <PacManHero className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]" />;
      case 'the-day-i-learned-to-organize':
        return <SkillUnlockerHero className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]" />;
      case 'official-profile':
      case 'openclaw-profile':
        return (
          <div className="w-full rounded-2xl sm:rounded-3xl">
            <ProfileHero
              name="8gent"
              title="Systems Analyst & Developer; Product Builder (AI Platforms)"
              location="Dublin, IE"
              bio="I map complex processes and ship simple, reliable AI native software. . "
              email="ai@openclaw.io"
            />
          </div>
        );
      default:
        return (
          <div
            className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl bg-gradient-to-br transform hover:scale-[1.02] transition-transform duration-500"
            style={{ background: heroImageGradient }}
            aria-label="Hero image"
          />
        );
    }
  };
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
      {/* Hero Experience */}
      <div className="mb-12 sm:mb-16 lg:mb-20">
        {renderHeroExperience()}
        {imageCaption && (
          <figcaption className="text-center text-sm text-muted-foreground mt-4 sm:mt-6 italic font-medium px-4">
            {imageCaption}
          </figcaption>
        )}
      </div>

      {/* Content with editorial styling using Tailwind classes */}
      <div className="prose prose-base sm:prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary">
        <div className="max-w-[72ch] mx-auto leading-[1.65] [&>p]:mb-4 [&>ul]:pl-5 [&>ol]:pl-5 [&>ul>li]:mb-2.5 [&>ol>li]:mb-2.5 [&>h2]:mt-10 sm:[&>h2]:mt-12 [&>h2]:mb-4 sm:[&>h2]:mb-5 [&>h2]:text-2xl sm:[&>h2]:text-3xl [&>h2]:font-bold [&>h2]:tracking-tight [&>h3]:mt-8 sm:[&>h3]:mt-10 [&>h3]:mb-3 sm:[&>h3]:mb-4 [&>h3]:text-xl sm:[&>h3]:text-2xl [&>h3]:font-semibold [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:bg-muted [&>blockquote]:p-4 sm:[&>blockquote]:p-6 [&>blockquote]:my-6 sm:[&>blockquote]:my-10 [&>blockquote]:rounded-xl [&>blockquote]:text-base sm:[&>blockquote]:text-lg [&>blockquote]:italic [&>blockquote]:text-foreground [&>code]:bg-muted [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-medium [&>code]:text-foreground [&>a]:no-underline [&>a]:font-medium [&>a]:border-b [&>a]:border-current [&>a]:transition-all hover:[&>a]:border-b-2 [&>ul>li::marker]:text-primary">
          {children}
        </div>
      </div>
    </article>
  );
};
