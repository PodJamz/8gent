"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronUp, BookOpen } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  gradient: string;
}

interface MobileBlogNavProps {
  posts: BlogPost[];
}

export function MobileBlogNav({ posts }: MobileBlogNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const currentSlug = pathname?.split("/").pop();

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Action Button - Only visible on mobile/tablet */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        aria-label="Browse all posts"
      >
        <BookOpen className="w-6 h-6" />
        {/* Badge showing post count */}
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-card text-foreground text-xs font-bold flex items-center justify-center border-2 border-primary">
          {posts.length}
        </span>
      </motion.button>

      {/* Drawer Overlay & Content */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="lg:hidden fixed inset-x-0 bottom-0 z-50 max-h-[85vh] rounded-t-3xl bg-card border-t border-border shadow-2xl overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">All Posts</h2>
                    <p className="text-xs text-muted-foreground">{posts.length} articles</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Posts Grid */}
              <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {posts.map((post, index) => {
                    const isActive = post.id === currentSlug;
                    return (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={`/blog/${post.id}`}
                          onClick={() => setIsOpen(false)}
                          className={`group flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 ${
                            isActive
                              ? "bg-primary/10 ring-2 ring-primary"
                              : "bg-muted/50 hover:bg-muted active:scale-[0.98]"
                          }`}
                        >
                          {/* Gradient Icon */}
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${post.gradient} flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover:scale-105`}
                          >
                            <span className="w-5 h-5 bg-white/60 rounded-full" />
                          </div>

                          {/* Title */}
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-semibold text-sm leading-tight line-clamp-2 ${
                                isActive ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {post.title}
                            </h3>
                            {isActive && (
                              <span className="text-xs text-primary/70 mt-1 block">
                                Currently reading
                              </span>
                            )}
                          </div>

                          {/* Arrow indicator */}
                          <ChevronUp
                            className={`w-4 h-4 rotate-90 transition-transform ${
                              isActive ? "text-primary" : "text-muted-foreground group-hover:translate-x-1"
                            }`}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
