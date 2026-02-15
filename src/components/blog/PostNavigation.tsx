"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PostLink {
  slug: string;
  title: string;
  gradient: string;
}

interface PostNavigationProps {
  previousPost?: PostLink | null;
  nextPost?: PostLink | null;
}

export function PostNavigation({ previousPost, nextPost }: PostNavigationProps) {
  if (!previousPost && !nextPost) return null;

  return (
    <nav className="mt-12 pt-8 border-t border-border" aria-label="Post navigation">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Previous Post */}
        {previousPost ? (
          <Link href={`/blog/${previousPost.slug}`} className="group block">
            <motion.div
              className="h-full p-4 sm:p-5 rounded-2xl bg-muted/50 hover:bg-muted border border-border hover:border-primary/30 transition-all duration-300"
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Previous
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${previousPost.gradient} flex-shrink-0 shadow-md`}
                >
                  <span className="w-full h-full flex items-center justify-center">
                    <span className="w-4 h-4 bg-white/50 rounded-full" />
                  </span>
                </div>
                <h4 className="font-semibold text-foreground text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {previousPost.title}
                </h4>
              </div>
            </motion.div>
          </Link>
        ) : (
          <div className="hidden sm:block" /> // Placeholder for grid alignment
        )}

        {/* Next Post */}
        {nextPost ? (
          <Link href={`/blog/${nextPost.slug}`} className="group block">
            <motion.div
              className="h-full p-4 sm:p-5 rounded-2xl bg-muted/50 hover:bg-muted border border-border hover:border-primary/30 transition-all duration-300 sm:text-right"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 mb-3 sm:flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Next
                </span>
              </div>
              <div className="flex items-center gap-3 sm:flex-row-reverse">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${nextPost.gradient} flex-shrink-0 shadow-md`}
                >
                  <span className="w-full h-full flex items-center justify-center">
                    <span className="w-4 h-4 bg-white/50 rounded-full" />
                  </span>
                </div>
                <h4 className="font-semibold text-foreground text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {nextPost.title}
                </h4>
              </div>
            </motion.div>
          </Link>
        ) : (
          <div className="hidden sm:block" /> // Placeholder for grid alignment
        )}
      </div>
    </nav>
  );
}
