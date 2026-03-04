"use client";

/**
 * Protected Area Wrapper
 *
 * Wraps content that requires passcode authentication.
 * Shows a PasscodeGate when access is required.
 */

import { ReactNode } from "react";
import { useAreaAccess } from "@/hooks/useAreaAccess";
import { PasscodeGate } from "./PasscodeGate";
import { Loader2 } from "lucide-react";

interface ProtectedAreaProps {
  /** Area slug for access control */
  areaSlug: string;
  /** Content to show when access is granted */
  children: ReactNode;
  /** Optional title override for the passcode gate */
  title?: string;
  /** Optional subtitle for the passcode gate */
  subtitle?: string;
  /** Skip protection (useful for development or public areas) */
  skip?: boolean;
  /** Show a loading state while checking access */
  showLoading?: boolean;
  /** Custom loading component */
  loadingComponent?: ReactNode;
  /** Callback when access is granted */
  onAccessGranted?: () => void;
}

export function ProtectedArea({
  areaSlug,
  children,
  title,
  subtitle,
  skip = false,
  showLoading = true,
  loadingComponent,
  onAccessGranted,
}: ProtectedAreaProps) {
  const { hasAccess, isLoading, areaName, grantAccess, requiresPasscode } = useAreaAccess({
    areaSlug,
    skip,
  });

  // Handle passcode verification
  const handlePasscodeSubmit = async (passcode: string): Promise<boolean> => {
    const result = await grantAccess(passcode);
    if (result.success && onAccessGranted) {
      onAccessGranted();
    }
    return result.success;
  };

  // Loading state
  if (isLoading && showLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin opacity-50" />
      </div>
    );
  }

  // Show passcode gate if required
  if (requiresPasscode && !hasAccess) {
    return (
      <PasscodeGate
        isOpen={true}
        onClose={() => {
          // Navigate back or show alternative content
          if (typeof window !== "undefined") {
            window.history.back();
          }
        }}
        onSubmit={handlePasscodeSubmit}
        title={title || `Access ${areaName || areaSlug}`}
        subtitle={subtitle || "Enter your 6-digit passcode to continue"}
      />
    );
  }

  // Show content
  return <>{children}</>;
}

export default ProtectedArea;
