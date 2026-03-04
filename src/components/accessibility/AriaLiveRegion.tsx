"use client";

import { useEffect, useState, createContext, useContext } from "react";

// Context for managing ARIA announcements
interface AriaLiveContextType {
  announce: (message: string, priority?: "polite" | "assertive") => void;
}

const AriaLiveContext = createContext<AriaLiveContextType | null>(null);

export function useAriaLive() {
  const context = useContext(AriaLiveContext);
  if (!context) {
    throw new Error("useAriaLive must be used within AriaLiveProvider");
  }
  return context;
}

interface AriaLiveProviderProps {
  children: React.ReactNode;
}

export function AriaLiveProvider({ children }: AriaLiveProviderProps) {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");

  const announce = (message: string, priority: "polite" | "assertive" = "polite") => {
    if (priority === "assertive") {
      setAssertiveMessage("");
      // Force re-render by using setTimeout
      setTimeout(() => setAssertiveMessage(message), 100);
    } else {
      setPoliteMessage("");
      setTimeout(() => setPoliteMessage(message), 100);
    }
  };

  return (
    <AriaLiveContext.Provider value={{ announce }}>
      {children}
      {/* Screen reader only live regions */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {politeMessage}
      </div>
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        role="alert"
      >
        {assertiveMessage}
      </div>
    </AriaLiveContext.Provider>
  );
}

// Hook for announcing page changes
export function usePageAnnounce(pageTitle: string) {
  const { announce } = useAriaLive();

  useEffect(() => {
    announce(`Navigated to ${pageTitle}`);
  }, [pageTitle, announce]);
}

// Component for visually hidden but accessible content
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

// Component for focus management on route changes
export function FocusManager({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Focus the main content area on route changes for screen readers
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
    }
  }, []);

  return <>{children}</>;
}

// Accessible loading indicator
export function AccessibleLoading({ label = "Loading content" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex items-center justify-center p-4"
    >
      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

// Accessible error boundary message
export function AccessibleError({
  message = "An error occurred",
  details,
}: {
  message?: string;
  details?: string;
}) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
    >
      <h2 className="font-semibold text-destructive">{message}</h2>
      {details && <p className="text-sm text-muted-foreground mt-1">{details}</p>}
    </div>
  );
}

// Skip to content enhancements
export function EnhancedSkipLinks() {
  return (
    <nav aria-label="Skip links" className="sr-only focus-within:not-sr-only">
      <ul className="fixed top-0 left-0 z-[100] bg-background p-2 space-y-2">
        <li>
          <a
            href="#main-content"
            className="block px-4 py-2 bg-primary text-primary-foreground rounded focus:outline-none focus:ring-2"
          >
            Skip to main content
          </a>
        </li>
        <li>
          <a
            href="#navigation"
            className="block px-4 py-2 bg-primary text-primary-foreground rounded focus:outline-none focus:ring-2"
          >
            Skip to navigation
          </a>
        </li>
      </ul>
    </nav>
  );
}
