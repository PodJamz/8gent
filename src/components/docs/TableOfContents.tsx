'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Heading {
  level: number;
  text: string;
  slug: string;
}

interface TableOfContentsProps {
  headings: Heading[];
  className?: string;
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // Filter to only show h2 and h3
  const tocHeadings = headings.filter(h => h.level === 2 || h.level === 3);

  useEffect(() => {
    if (tocHeadings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    // Observe all headings
    tocHeadings.forEach((heading) => {
      const element = document.getElementById(heading.slug);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocHeadings]);

  if (tocHeadings.length === 0) return null;

  return (
    <nav
      className={cn(
        "sticky top-24",
        "w-56 flex-shrink-0",
        "hidden xl:block",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <List className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          On this page
        </span>
      </div>

      <ul className="space-y-1 text-sm">
        {tocHeadings.map((heading) => {
          const isActive = activeId === heading.slug;
          const isH3 = heading.level === 3;

          return (
            <li key={heading.slug}>
              <a
                href={`#${heading.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.slug);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    // Update URL without navigation
                    window.history.pushState(null, '', `#${heading.slug}`);
                  }
                }}
                className={cn(
                  "block py-1 transition-colors",
                  "hover:text-foreground",
                  isH3 && "pl-3",
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                <span className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="toc-indicator"
                      className="absolute -left-3 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  {heading.text}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default TableOfContents;
