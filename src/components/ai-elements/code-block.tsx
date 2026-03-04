"use client";

import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "text", className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-md bg-muted p-4 text-sm",
        className
      )}
    >
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}
