'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  FileText,
  AlertCircle,
  Info,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react';
import { type DocNode } from '@/lib/docs';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DocsContentProps {
  doc: DocNode;
  breadcrumbs: Array<{ title: string; path: string }>;
  className?: string;
}

export function DocsContent({ doc, breadcrumbs, className }: DocsContentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = async () => {
    if (doc.content) {
      await navigator.clipboard.writeText(doc.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className={cn("max-w-none", className)}>
      {/* Top bar with breadcrumbs and copy button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.path} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="w-3.5 h-3.5" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-foreground font-medium">{crumb.title}</span>
              ) : (
                <Link
                  href={crumb.path}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.title}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Copy as Markdown button */}
        <button
          onClick={handleCopyMarkdown}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm",
            "bg-muted/50 hover:bg-muted border border-border/50",
            "text-muted-foreground hover:text-foreground transition-all",
            copied && "bg-green-500/10 border-green-500/30 text-green-600"
          )}
          aria-label="Copy page as Markdown"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <FileText className="w-3.5 h-3.5" />
              <span>Copy Markdown</span>
            </>
          )}
        </button>
      </div>

      {/* Title */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-3">
          {doc.title}
        </h1>
        {doc.description && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {doc.description}
          </p>
        )}
      </motion.header>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="prose prose-neutral dark:prose-invert max-w-none"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Headings
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-foreground mt-12 mb-4 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => {
              const id = String(children)
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
              return (
                <h2
                  id={id}
                  className="text-2xl font-semibold text-foreground mt-10 mb-4 scroll-mt-24 group"
                >
                  <a
                    href={`#${id}`}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    {children}
                    <span className="opacity-0 group-hover:opacity-50 transition-opacity">#</span>
                  </a>
                </h2>
              );
            },
            h3: ({ children }) => {
              const id = String(children)
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
              return (
                <h3
                  id={id}
                  className="text-xl font-semibold text-foreground mt-8 mb-3 scroll-mt-24"
                >
                  {children}
                </h3>
              );
            },
            h4: ({ children }) => (
              <h4 className="text-lg font-medium text-foreground mt-6 mb-2">
                {children}
              </h4>
            ),

            // Paragraphs
            p: ({ children }) => (
              <p className="text-foreground/90 leading-7 mb-4">
                {children}
              </p>
            ),

            // Links
            a: ({ href, children }) => {
              const isExternal = href?.startsWith('http');
              return (
                <a
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={cn(
                    "text-primary hover:text-primary/80 underline underline-offset-4",
                    "transition-colors inline-flex items-center gap-1"
                  )}
                >
                  {children}
                  {isExternal && <ExternalLink className="w-3 h-3" />}
                </a>
              );
            },

            // Lists
            ul: ({ children }) => (
              <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 mb-4 space-y-2 text-foreground/90">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-7">{children}</li>
            ),

            // Blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 italic text-muted-foreground">
                {children}
              </blockquote>
            ),

            // Code
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              const isInline = !className;

              if (isInline) {
                return (
                  <code
                    className={cn(
                      "px-1.5 py-0.5 rounded-md",
                      "bg-muted text-foreground font-mono text-sm",
                      "border border-border/50"
                    )}
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <CodeBlock language={language}>
                  {String(children).replace(/\n$/, '')}
                </CodeBlock>
              );
            },

            pre: ({ children }) => <>{children}</>,

            // Tables
            table: ({ children }) => (
              <div className="overflow-x-auto my-6 rounded-lg border border-border">
                <table className="w-full text-sm">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-muted/50 border-b border-border">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-border/50">{children}</tbody>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
            ),
            th: ({ children }) => (
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-3 text-foreground/90">{children}</td>
            ),

            // Horizontal rule
            hr: () => <hr className="my-8 border-border/50" />,

            // Images
            img: ({ src, alt }) => (
              <figure className="my-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt || ''}
                  className="rounded-lg border border-border shadow-sm max-w-full"
                />
                {alt && (
                  <figcaption className="text-center text-sm text-muted-foreground mt-2">
                    {alt}
                  </figcaption>
                )}
              </figure>
            ),

            // Strong/Bold
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">{children}</strong>
            ),

            // Emphasis/Italic
            em: ({ children }) => (
              <em className="italic">{children}</em>
            ),
          }}
        >
          {doc.content || ''}
        </ReactMarkdown>
      </motion.div>
    </article>
  );
}

// Code block with copy button
function CodeBlock({ children, language }: { children: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-border/50">
      {/* Language badge */}
      {language && (
        <div className="absolute top-2 left-3 text-xs text-muted-foreground font-mono uppercase">
          {language}
        </div>
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className={cn(
          "absolute top-2 right-2 p-1.5 rounded-md",
          "bg-muted/80 hover:bg-muted transition-colors",
          "opacity-0 group-hover:opacity-100"
        )}
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '2.5rem 1rem 1rem',
          background: 'hsl(var(--muted))',
          fontSize: '0.875rem',
          lineHeight: '1.7',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          },
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

export default DocsContent;
