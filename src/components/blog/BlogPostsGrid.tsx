"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User } from "lucide-react";
import { NewsletterHero } from "./NewsletterHero";

interface BlogPost {
  slug: string;
  metadata: {
    title: string;
    summary: string;
    publishedAt: string;
    gradient?: string;
    authors?: Array<{
      name: string;
      role: string;
      gradientClass: string;
    }>;
  };
}

interface BlogPostsGridProps {
  posts: BlogPost[];
  featuredSlug?: string;
  showNewsletter?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function BlogPostsGrid({ posts, featuredSlug, showNewsletter = true }: BlogPostsGridProps) {
  const featuredPost = featuredSlug
    ? posts.find((p) => p.slug === featuredSlug)
    : posts[0];
  const otherPosts = posts.filter((p) => p.slug !== featuredPost?.slug);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      className="py-8 lg:py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Newsletter Hero */}
      {showNewsletter && (
        <motion.div variants={itemVariants} className="mb-10 sm:mb-14">
          <NewsletterHero />
        </motion.div>
      )}

      {/* Posts Section Header */}
      <motion.div variants={itemVariants} className="mb-8 sm:mb-12" id="posts">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
          Latest Posts
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
          Thoughts on AI, software development, design, and building things that matter.
        </p>
      </motion.div>

      {/* Featured Post */}
      {featuredPost && (
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            <article className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border border-border hover:border-primary/30 transition-all duration-500">
              {/* Gradient Background Decoration */}
              <div
                className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br ${
                  featuredPost.metadata.authors?.[0]?.gradientClass ||
                  "from-indigo-400 to-purple-600"
                } opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500`}
              />

              <div className="relative p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Featured
                    </span>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {featuredPost.metadata.title}
                    </h2>

                    <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6 line-clamp-3">
                      {featuredPost.metadata.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {featuredPost.metadata.authors?.[0] && (
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full bg-gradient-to-br ${featuredPost.metadata.authors[0].gradientClass}`}
                          />
                          <span>{featuredPost.metadata.authors[0].name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(featuredPost.metadata.publishedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="hidden lg:flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </motion.div>
      )}

      {/* Other Posts Grid */}
      {otherPosts.length > 0 && (
        <>
          <motion.h2
            variants={itemVariants}
            className="text-xl font-semibold text-foreground mb-6"
          >
            More Posts
          </motion.h2>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {otherPosts.map((post, index) => (
              <motion.div key={post.slug} variants={itemVariants}>
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <article className="h-full p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                    {/* Gradient Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                        post.metadata.authors?.[0]?.gradientClass ||
                        "from-indigo-400 to-purple-600"
                      } flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className="w-5 h-5 bg-white/60 rounded-full" />
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {post.metadata.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.metadata.summary}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
                      {post.metadata.authors?.[0] && (
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          {post.metadata.authors[0].name}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.metadata.publishedAt)}
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      {/* Empty State */}
      {posts.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-16 px-4"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No posts yet
          </h3>
          <p className="text-muted-foreground">
            Check back soon for new content!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
