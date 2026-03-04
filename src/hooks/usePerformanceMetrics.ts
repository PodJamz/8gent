"use client";

import { useState, useEffect, useCallback } from "react";

export interface PerformanceMetrics {
  // Core Web Vitals
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  cls: number | null; // Cumulative Layout Shift
  fid: number | null; // First Input Delay
  inp: number | null; // Interaction to Next Paint
  ttfb: number | null; // Time to First Byte

  // Custom metrics
  pageLoadTime: number | null;
  domInteractive: number | null;
  resourceCount: number;
  transferSize: number; // KB

  // Computed status
  overallScore: "fast" | "moderate" | "slow";
  primaryMetric: number | null; // The main ms value to display
}

const initialMetrics: PerformanceMetrics = {
  fcp: null,
  lcp: null,
  cls: null,
  fid: null,
  inp: null,
  ttfb: null,
  pageLoadTime: null,
  domInteractive: null,
  resourceCount: 0,
  transferSize: 0,
  overallScore: "fast",
  primaryMetric: null,
};

function getOverallScore(metrics: Partial<PerformanceMetrics>): "fast" | "moderate" | "slow" {
  const { lcp, fcp, cls, ttfb, pageLoadTime } = metrics;

  // Primary metric for scoring (prefer LCP, fallback to FCP, then pageLoadTime)
  const primaryTime = lcp ?? fcp ?? pageLoadTime ?? 0;

  // Google's Core Web Vitals thresholds
  // LCP: Good < 2500ms, Needs Improvement < 4000ms, Poor >= 4000ms
  // FCP: Good < 1800ms, Needs Improvement < 3000ms, Poor >= 3000ms
  // CLS: Good < 0.1, Needs Improvement < 0.25, Poor >= 0.25
  // TTFB: Good < 800ms, Needs Improvement < 1800ms, Poor >= 1800ms

  let score = 0;
  let count = 0;

  if (primaryTime > 0) {
    if (primaryTime < 1500) score += 3;
    else if (primaryTime < 2500) score += 2;
    else if (primaryTime < 4000) score += 1;
    count++;
  }

  if (ttfb && ttfb > 0) {
    if (ttfb < 400) score += 3;
    else if (ttfb < 800) score += 2;
    else if (ttfb < 1800) score += 1;
    count++;
  }

  if (cls !== null && cls !== undefined) {
    if (cls < 0.1) score += 3;
    else if (cls < 0.25) score += 2;
    else score += 1;
    count++;
  }

  if (count === 0) return "fast";

  const avg = score / count;
  if (avg >= 2.5) return "fast";
  if (avg >= 1.5) return "moderate";
  return "slow";
}

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(initialMetrics);
  const [isSupported, setIsSupported] = useState(true);

  const updateMetrics = useCallback((updates: Partial<PerformanceMetrics>) => {
    setMetrics((prev) => {
      const newMetrics = { ...prev, ...updates };
      // Recalculate primary metric and score
      newMetrics.primaryMetric = newMetrics.lcp ?? newMetrics.fcp ?? newMetrics.pageLoadTime;
      newMetrics.overallScore = getOverallScore(newMetrics);
      return newMetrics;
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.performance) {
      setIsSupported(false);
      return;
    }

    // Get navigation timing data
    const getNavigationTiming = () => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;

      if (navigation) {
        const pageLoadTime = navigation.loadEventEnd - navigation.startTime;
        const domInteractive = navigation.domInteractive - navigation.startTime;
        const ttfb = navigation.responseStart - navigation.requestStart;

        updateMetrics({
          pageLoadTime: pageLoadTime > 0 ? Math.round(pageLoadTime) : null,
          domInteractive: domInteractive > 0 ? Math.round(domInteractive) : null,
          ttfb: ttfb > 0 ? Math.round(ttfb) : null,
        });
      }
    };

    // Get resource timing data
    const getResourceTiming = () => {
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const totalSize = resources.reduce((acc, r) => acc + (r.transferSize || 0), 0);

      updateMetrics({
        resourceCount: resources.length,
        transferSize: Math.round(totalSize / 1024), // Convert to KB
      });
    };

    // Initial timing collection after page load
    if (document.readyState === "complete") {
      getNavigationTiming();
      getResourceTiming();
    } else {
      window.addEventListener("load", () => {
        // Wait a bit for metrics to stabilize
        setTimeout(() => {
          getNavigationTiming();
          getResourceTiming();
        }, 100);
      });
    }

    // Observe paint timing (FCP)
    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          updateMetrics({ fcp: Math.round(entry.startTime) });
        }
      }
    });

    try {
      paintObserver.observe({ type: "paint", buffered: true });
    } catch {
      // Paint observer not supported
    }

    // Observe LCP
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        updateMetrics({ lcp: Math.round(lastEntry.startTime) });
      }
    });

    try {
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      // LCP observer not supported
    }

    // Observe CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(entry as any).hadRecentInput) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          clsValue += (entry as any).value;
          updateMetrics({ cls: Math.round(clsValue * 1000) / 1000 });
        }
      }
    });

    try {
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch {
      // CLS observer not supported
    }

    // Observe FID
    const fidObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fidEntry = entry as any;
        updateMetrics({ fid: Math.round(fidEntry.processingStart - fidEntry.startTime) });
      }
    });

    try {
      fidObserver.observe({ type: "first-input", buffered: true });
    } catch {
      // FID observer not supported
    }

    // Observe INP (Interaction to Next Paint)
    const inpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const duration = (entry as any).duration;
        if (duration) {
          updateMetrics({ inp: Math.round(duration) });
        }
      }
    });

    try {
      inpObserver.observe({ type: "event", buffered: true });
    } catch {
      // INP observer not supported
    }

    return () => {
      paintObserver.disconnect();
      lcpObserver.disconnect();
      clsObserver.disconnect();
      fidObserver.disconnect();
      inpObserver.disconnect();
    };
  }, [updateMetrics]);

  // Force refresh metrics
  const refreshMetrics = useCallback(() => {
    if (typeof window === "undefined" || !window.performance) return;

    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];

    if (navigation) {
      const pageLoadTime = navigation.loadEventEnd - navigation.startTime;
      const ttfb = navigation.responseStart - navigation.requestStart;
      const totalSize = resources.reduce((acc, r) => acc + (r.transferSize || 0), 0);

      updateMetrics({
        pageLoadTime: pageLoadTime > 0 ? Math.round(pageLoadTime) : null,
        ttfb: ttfb > 0 ? Math.round(ttfb) : null,
        resourceCount: resources.length,
        transferSize: Math.round(totalSize / 1024),
      });
    }
  }, [updateMetrics]);

  return { metrics, isSupported, refreshMetrics };
}
