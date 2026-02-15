'use client';

import { motion } from 'framer-motion';
import { Lock, Music, UserCheck, LogIn, X, Loader2 } from 'lucide-react';
import { SignInButton, useUser } from '@clerk/nextjs';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from '@/components/superdesign/overlay/Modal';
import { Button } from '@/components/ui/button';
import { usePrivateMusic } from '@/context/PrivateMusicContext';

interface PrivateAccessModalProps {
  open: boolean;
  onClose: () => void;
}

export function PrivateAccessModal({ open, onClose }: PrivateAccessModalProps) {
  const { isSignedIn } = useUser();
  const { isCollaborator, isLoading, collaborator } = usePrivateMusic();

  // If user is a collaborator and modal is open, close it (they have access)
  if (isCollaborator && open) {
    onClose();
    return null;
  }

  return (
    <Modal open={open} onClose={onClose} size="sm" showCloseButton={false}>
      <ModalHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Lock className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <ModalTitle>Private Music</ModalTitle>
              <ModalDescription className="mt-1">
                Collaborator-only access
              </ModalDescription>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </ModalHeader>

      <ModalBody>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : !isSignedIn ? (
          // Not signed in - show sign-in prompt
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <Music className="w-5 h-5 text-zinc-500 mt-0.5" />
              <div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  This area contains unreleased tracks for invited collaborators.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <UserCheck className="w-5 h-5 text-zinc-500 mt-0.5" />
              <div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  Sign in to check if you have access.
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
              Not a collaborator yet? Reach out to James directly.
            </p>
          </motion.div>
        ) : (
          // Signed in but not a collaborator
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  Access Required
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  You're signed in, but you're not currently on the collaborator list.
                </p>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                If you're expecting access, reach out to James to get an invite.
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Invites are sent by email and linked to your account automatically.
              </p>
            </div>
          </motion.div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        {!isSignedIn && !isLoading && (
          <SignInButton mode="modal">
            <Button>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </SignInButton>
        )}
      </ModalFooter>
    </Modal>
  );
}
