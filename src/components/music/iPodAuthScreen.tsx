'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignIn, useSignUp, useUser } from '@clerk/nextjs';
import { Lock, User, Mail, Eye, EyeOff, ChevronRight, Check, X, Loader2, KeyRound, type LucideIcon } from 'lucide-react';

// Retro spring animation config
const springConfig = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

const pixelTransition = {
  type: 'tween' as const,
  duration: 0.15,
  ease: 'easeOut' as const,
};

type AuthView = 'menu' | 'signin' | 'signup' | 'verify' | 'success' | 'error';

// ============================================================================
// Reusable Components (defined outside to prevent re-creation on render)
// ============================================================================

interface RetroInputProps {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  icon: LucideIcon;
  showToggle?: boolean;
  onToggle?: () => void;
  autoFocus?: boolean;
}

function RetroInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  showToggle,
  onToggle,
  autoFocus,
}: RetroInputProps) {
  return (
    <div className="relative">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[#3a4a45] pointer-events-none">
        <Icon className="w-3 h-3" />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete={type === 'email' ? 'email' : type === 'password' ? 'current-password' : 'off'}
        className="w-full bg-[#697d75] border-2 border-[#1a2420] rounded-sm px-7 py-1.5 text-xs font-mono text-[#1a2420] placeholder:text-[#4a5a55] focus:outline-none focus:bg-[#7a8d85] transition-colors"
        style={{
          textShadow: '1px 1px 0 rgba(255,255,255,0.1)',
          boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.2)'
        }}
      />
      {showToggle && onToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#3a4a45] hover:text-[#1a2420] transition-colors"
        >
          {type === 'password' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </button>
      )}
    </div>
  );
}

interface RetroButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

function RetroButton({
  onClick,
  disabled,
  loading,
  children,
  variant = 'primary',
}: RetroButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-1.5 px-3 text-xs font-mono font-bold rounded-sm border-2 transition-all active:scale-95 ${
        variant === 'primary'
          ? 'bg-[#1a2420] border-[#1a2420] text-[#8fa39a] hover:bg-[#2a3a35] disabled:opacity-50'
          : 'bg-transparent border-[#3a4a45] text-[#1a2420] hover:bg-[#697d75] disabled:opacity-50'
      }`}
      style={{
        boxShadow: variant === 'primary' ? '2px 2px 0 #0a1410' : 'none',
        textShadow: variant === 'primary' ? '1px 1px 0 rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <span className="flex items-center justify-center gap-2">
        {loading && <Loader2 className="w-3 h-3 animate-spin" />}
        {children}
      </span>
    </button>
  );
}

// ============================================================================
// Main Component
// ============================================================================

interface iPodAuthScreenProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function IPodAuthScreen({ onClose, onSuccess }: iPodAuthScreenProps) {
  const { signIn, setActive: setSignInActive, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: isSignUpLoaded } = useSignUp();
  const { isSignedIn, user } = useUser();

  const [view, setView] = useState<AuthView>('menu');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // If user is already signed in, show success immediately
  useEffect(() => {
    if (isSignedIn && user) {
      setView('success');
      setTimeout(onSuccess, 1000);
    }
  }, [isSignedIn, user, onSuccess]);

  // Menu navigation
  const menuItems = [
    { id: 'signin', label: 'Sign In', icon: KeyRound },
    { id: 'signup', label: 'Create Account', icon: User },
    { id: 'back', label: 'Back', icon: X },
  ];

  const handleMenuSelect = (id: string) => {
    if (id === 'back') {
      onClose();
    } else {
      setView(id as AuthView);
      setError(null);
    }
  };

  // Sign In flow
  const handleSignIn = async () => {
    if (!isSignInLoaded || !signIn) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId });
        setView('success');
        setTimeout(onSuccess, 1500);
      }
    } catch (err: any) {
      const errCode = err?.errors?.[0]?.code;
      const msg = err?.errors?.[0]?.message || 'Sign in failed';

      // If session already exists, user is already signed in - just proceed
      if (errCode === 'session_exists' || msg.toLowerCase().includes('session')) {
        setView('success');
        setTimeout(onSuccess, 1500);
        return;
      }

      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up flow
  const handleSignUp = async () => {
    if (!isSignUpLoaded || !signUp) return;
    setIsLoading(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setView('verify');
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message || 'Sign up failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify email
  const handleVerify = async () => {
    if (!isSignUpLoaded || !signUp) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === 'complete') {
        await setSignUpActive({ session: result.createdSessionId });
        setView('success');
        setTimeout(onSuccess, 1500);
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message || 'Invalid code';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[200px] flex flex-col" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-[#1a2420]" />
          <span className="text-[10px] font-bold text-[#1a2420] uppercase tracking-wider font-mono">
            {view === 'menu' && 'Private Access'}
            {view === 'signin' && 'Sign In'}
            {view === 'signup' && 'Create Account'}
            {view === 'verify' && 'Verify Email'}
            {view === 'success' && 'Welcome!'}
          </span>
        </div>
        {view !== 'menu' && view !== 'success' && (
          <button
            onClick={() => setView('menu')}
            className="text-[10px] font-mono text-[#3a4a45] hover:text-[#1a2420] transition-colors"
          >
            BACK
          </button>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* Menu View */}
        {view === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={pixelTransition}
            className="flex-1"
          >
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuSelect(item.id)}
                  onFocus={() => setSelectedIndex(index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-2 p-2 rounded-sm transition-all font-mono ${
                    selectedIndex === index
                      ? 'bg-[#1a2420] text-[#8fa39a]'
                      : 'text-[#1a2420] hover:bg-[#697d75]'
                  }`}
                >
                  <item.icon className="w-3 h-3" />
                  <span className="text-xs font-medium flex-1 text-left">{item.label}</span>
                  <ChevronRight className="w-3 h-3 opacity-50" />
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t-2 border-[#697d75]">
              <p className="text-[9px] text-[#3a4a45] font-mono text-center leading-relaxed">
                Sign in to access unreleased tracks and collaborator-only content.
              </p>
            </div>
          </motion.div>
        )}

        {/* Sign In View */}
        {view === 'signin' && (
          <motion.div
            key="signin"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={pixelTransition}
            className="flex-1 space-y-3"
          >
            <RetroInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
              icon={Mail}
              autoFocus
            />
            <RetroInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={setPassword}
              icon={KeyRound}
              showToggle
              onToggle={() => setShowPassword(!showPassword)}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 bg-red-900/30 border border-red-800/50 rounded-sm"
              >
                <p className="text-[9px] text-red-300 font-mono">{error}</p>
              </motion.div>
            )}

            <RetroButton
              onClick={handleSignIn}
              disabled={!email || !password}
              loading={isLoading}
            >
              SIGN IN
            </RetroButton>

            <button
              onClick={() => { setView('signup'); setError(null); }}
              className="w-full text-[9px] text-[#3a4a45] font-mono hover:text-[#1a2420] transition-colors"
            >
              Need an account? Sign up
            </button>
          </motion.div>
        )}

        {/* Sign Up View */}
        {view === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={pixelTransition}
            className="flex-1 space-y-3"
          >
            <RetroInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
              icon={Mail}
              autoFocus
            />
            <RetroInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (8+ chars)"
              value={password}
              onChange={setPassword}
              icon={KeyRound}
              showToggle
              onToggle={() => setShowPassword(!showPassword)}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 bg-red-900/30 border border-red-800/50 rounded-sm"
              >
                <p className="text-[9px] text-red-300 font-mono">{error}</p>
              </motion.div>
            )}

            <RetroButton
              onClick={handleSignUp}
              disabled={!email || password.length < 8}
              loading={isLoading}
            >
              CREATE ACCOUNT
            </RetroButton>

            <button
              onClick={() => { setView('signin'); setError(null); }}
              className="w-full text-[9px] text-[#3a4a45] font-mono hover:text-[#1a2420] transition-colors"
            >
              Already have an account? Sign in
            </button>
          </motion.div>
        )}

        {/* Verify View */}
        {view === 'verify' && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={pixelTransition}
            className="flex-1 space-y-3"
          >
            <div className="p-2 bg-[#697d75] border-2 border-[#1a2420] rounded-sm">
              <p className="text-[9px] text-[#1a2420] font-mono text-center">
                Check your email for a 6-digit code
              </p>
            </div>

            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              autoFocus
              className="w-full bg-[#697d75] border-2 border-[#1a2420] rounded-sm px-3 py-2 text-center text-lg font-mono font-bold text-[#1a2420] placeholder:text-[#4a5a55] focus:outline-none focus:bg-[#7a8d85] tracking-[0.5em]"
              style={{
                textShadow: '1px 1px 0 rgba(255,255,255,0.1)',
                boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.2)'
              }}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 bg-red-900/30 border border-red-800/50 rounded-sm"
              >
                <p className="text-[9px] text-red-300 font-mono">{error}</p>
              </motion.div>
            )}

            <RetroButton
              onClick={handleVerify}
              disabled={verificationCode.length !== 6}
              loading={isLoading}
            >
              VERIFY
            </RetroButton>
          </motion.div>
        )}

        {/* Success View */}
        {view === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springConfig}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, ...springConfig }}
              className="w-12 h-12 bg-[#1a2420] rounded-full flex items-center justify-center mb-3"
            >
              <Check className="w-6 h-6 text-[#8fa39a]" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm font-mono font-bold text-[#1a2420]"
            >
              Welcome!
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[9px] font-mono text-[#3a4a45] mt-1"
            >
              Loading your tracks...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
