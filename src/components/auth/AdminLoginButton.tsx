"use client";

/**
 * Admin Login Button
 *
 * A small button in the top-right corner that allows James (the admin)
 * to log in with username/password. When logged in, reveals admin-only
 * features like the Passcodes section in Settings.
 *
 * Theme-aware design that positions below the dynamic island.
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lock, LogOut, User, Eye, EyeOff, Loader2, X, Download, LogIn } from "lucide-react";

interface AdminLoginButtonProps {
  className?: string;
}

interface AdminSession {
  isAuthenticated: boolean;
  username?: string;
}

export function AdminLoginButton({ className }: AdminLoginButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [session, setSession] = useState<AdminSession>({ isAuthenticated: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Check current session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/admin");
        const data = await res.json();
        setSession(data);
      } catch {
        setSession({ isAuthenticated: false });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Handle login
  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setSession({ isAuthenticated: true, username: data.username });
      setIsExpanded(false);
      setUsername("");
      setPassword("");
    } catch {
      setError("Connection failed");
    } finally {
      setIsSubmitting(false);
    }
  }, [username, password]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/admin", { method: "DELETE" });
      setSession({ isAuthenticated: false });
      setIsExpanded(false);
    } catch {
      // Ignore errors on logout
    }
  }, []);

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
    setError(null);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isExpanded) {
        setIsExpanded(false);
        setError(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isExpanded && !target.closest("[data-admin-login]")) {
        setIsExpanded(false);
        setError(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  // Don't render while loading initial session state
  if (isLoading) return null;

  return (
    <>
      {/* Compact Button - only visible when not expanded */}
      <motion.div
        data-admin-login
        onClick={handleToggle}
        onKeyDown={(e) => e.key === "Enter" && handleToggle()}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-label={session.isAuthenticated ? "Admin menu" : "Admin login"}
        initial={{ opacity: 0, x: 20 }}
        animate={{
          opacity: isExpanded ? 0 : 1,
          x: 0,
          scale: isExpanded ? 0.95 : 1,
          pointerEvents: isExpanded ? "none" : "auto"
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fixed top-4 right-[84px] z-[9999]",
          "flex items-center justify-center w-7 h-7",
          "backdrop-blur-xl rounded-full",
          "cursor-pointer select-none",
          "transition-colors duration-300 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary))]/50",
          "shadow-lg shadow-black/20",
          className
        )}
        style={{
          backgroundColor: 'hsl(var(--theme-card) / 0.9)',
          border: '1px solid hsl(var(--theme-border) / 0.5)',
        }}
      >
        {session.isAuthenticated ? (
          <User className="w-3.5 h-3.5" style={{ color: 'hsl(var(--theme-primary))' }} />
        ) : (
          <Lock className="w-3.5 h-3.5" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
        )}
      </motion.div>

      {/* Expanded Panel - Theme aware, positioned below dynamic island */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[2px]"
              onClick={() => setIsExpanded(false)}
              aria-hidden="true"
            />

            {/* Panel - Below dynamic island, theme aware */}
            <motion.div
              data-admin-login
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30
              }}
              className={cn(
                "fixed z-[9999]",
                "w-[280px]",
                "backdrop-blur-2xl",
                "rounded-3xl",
                "overflow-hidden",
                "shadow-2xl"
              )}
              style={{
                // Position: top-right, below where dynamic island would be
                top: '56px', // Below the dynamic island area
                right: '12px',
                backgroundColor: 'hsl(var(--theme-card) / 0.95)',
                border: '1px solid hsl(var(--theme-border) / 0.3)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Header with close button */}
              <div
                className="flex justify-between items-center px-4 pt-4 pb-2"
                style={{ borderBottom: '1px solid hsl(var(--theme-border) / 0.2)' }}
              >
                <span
                  className="text-[10px] uppercase tracking-wider font-medium"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {session.isAuthenticated ? "Admin" : "Admin Login"}
                </span>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-lg transition-colors"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  aria-label="Close admin panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {session.isAuthenticated ? (
                /* Logged In State */
                <div className="px-4 py-4">
                  <div className="text-center mb-4">
                    <div
                      className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
                      }}
                    >
                      <User className="w-7 h-7" style={{ color: 'hsl(var(--theme-primary-foreground))' }} />
                    </div>
                    <p
                      className="text-base font-semibold"
                      style={{ color: 'hsl(var(--theme-foreground))' }}
                    >
                      {session.username}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                    >
                      Administrator
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: 'hsl(var(--theme-secondary))',
                      color: 'hsl(var(--theme-secondary-foreground))',
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                /* Login Form */
                <form onSubmit={handleLogin} className="px-4 py-4">
                  <div className="text-center mb-4">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
                    >
                      <Lock className="w-6 h-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                    </motion.div>
                    <p
                      className="text-xs"
                      style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                    >
                      Authorized personnel only
                    </p>
                  </div>

                  {/* Error message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3 p-2 rounded-lg"
                      style={{
                        backgroundColor: 'hsl(var(--theme-destructive) / 0.1)',
                        border: '1px solid hsl(var(--theme-destructive) / 0.2)',
                      }}
                    >
                      <p
                        className="text-xs text-center"
                        style={{ color: 'hsl(var(--theme-destructive))' }}
                      >
                        {error}
                      </p>
                    </motion.div>
                  )}

                  <div className="space-y-3">
                    {/* Username field */}
                    <div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        autoComplete="username"
                        disabled={isSubmitting}
                        className="w-full px-3 py-2.5 rounded-xl text-sm transition-colors"
                        style={{
                          backgroundColor: 'hsl(var(--theme-secondary) / 0.5)',
                          border: '1px solid hsl(var(--theme-border) / 0.5)',
                          color: 'hsl(var(--theme-foreground))',
                        }}
                      />
                    </div>

                    {/* Password field */}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        autoComplete="current-password"
                        disabled={isSubmitting}
                        className="w-full px-3 py-2.5 pr-10 rounded-xl text-sm transition-colors"
                        style={{
                          backgroundColor: 'hsl(var(--theme-secondary) / 0.5)',
                          border: '1px solid hsl(var(--theme-border) / 0.5)',
                          color: 'hsl(var(--theme-foreground))',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 transition-colors"
                        style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Submit button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !username || !password}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "w-full py-2.5 px-4 rounded-xl text-sm font-medium",
                        "transition-all duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "flex items-center justify-center gap-2"
                      )}
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
                        color: 'hsl(var(--theme-primary-foreground))',
                        boxShadow: '0 4px 14px hsl(var(--theme-primary) / 0.3)',
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          Sign In
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}

              {/* Footer */}
              <div
                className="px-4 py-2"
                style={{ borderTop: '1px solid hsl(var(--theme-border) / 0.2)' }}
              >
                <p
                  className="text-[10px] text-center"
                  style={{ color: 'hsl(var(--theme-muted-foreground) / 0.6)' }}
                >
                  8gent Admin Panel
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default AdminLoginButton;
