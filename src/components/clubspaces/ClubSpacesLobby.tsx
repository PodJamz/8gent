'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Users, Plus, LogIn, Radio, Headphones, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClubSpacesLobbyProps {
  onCreateRoom: (name: string, description?: string, topics?: string[]) => void;
  onJoinRoom: (nameOrId: string) => void;
  user?: any;
  isConnecting?: boolean;
}

export function ClubSpacesLobby({ onCreateRoom, onJoinRoom, user, isConnecting }: ClubSpacesLobbyProps) {
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [roomTopics, setRoomTopics] = useState('');
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [joinCode, setJoinCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create') {
      if (!roomName.trim()) return;
      const topics = roomTopics
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      onCreateRoom(
        roomName.trim(),
        roomDescription.trim() || undefined,
        topics.length > 0 ? topics : undefined
      );
    } else {
      if (!joinCode.trim()) return;
      onJoinRoom(joinCode.trim());
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-black">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
            <Radio className="w-5 h-5 text-black" />
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">ClubSpaces</span>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white">
              {(user.firstName || user.fullName || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Hero */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              Drop in audio
            </h1>
            <p className="text-white/50 text-sm leading-relaxed">
              Real-time voice rooms. Create a space or join one.
            </p>
          </motion.div>

          {/* Mode Toggle */}
          <motion.div
            className="flex gap-1 mb-6 p-1 bg-white/[0.04] rounded-xl border border-white/[0.06]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <button
              onClick={() => setMode('create')}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                mode === 'create'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-white/50 hover:text-white'
              )}
            >
              <Plus className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
              Create
            </button>
            <button
              onClick={() => setMode('join')}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                mode === 'join'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-white/50 hover:text-white'
              )}
            >
              <LogIn className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
              Join
            </button>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {mode === 'create' ? (
                <motion.div
                  key="create"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-1.5 pl-1">
                      Room Name
                    </label>
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Late night music"
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.06] transition-all text-sm"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-1.5 pl-1">
                      Description
                    </label>
                    <textarea
                      value={roomDescription}
                      onChange={(e) => setRoomDescription(e.target.value)}
                      placeholder="What's this room about?"
                      rows={2}
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.06] transition-all resize-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-1.5 pl-1">
                      Topics
                    </label>
                    <input
                      type="text"
                      value={roomTopics}
                      onChange={(e) => setRoomTopics(e.target.value)}
                      placeholder="tech, AI, design..."
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.06] transition-all text-sm"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="join"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-1.5 pl-1">
                      Room Code or URL
                    </label>
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="Paste room link or enter code..."
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.06] transition-all text-sm"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-white/30 pl-1">
                    Enter a room name, URL, or invite link
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isConnecting || (mode === 'create' ? !roomName.trim() : !joinCode.trim())}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : mode === 'create' ? (
                <>
                  <Mic className="w-4 h-4" />
                  Start Room
                </>
              ) : (
                <>
                  <Headphones className="w-4 h-4" />
                  Join Room
                </>
              )}
              {!isConnecting && <ChevronRight className="w-4 h-4 ml-auto" />}
            </motion.button>
          </motion.form>

          {/* Features */}
          <motion.div
            className="mt-8 grid grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
              <Users className="w-5 h-5 text-amber-500 mb-2" />
              <p className="text-sm text-white/80 font-medium">Multi-person</p>
              <p className="text-xs text-white/30 mt-0.5">Stage + audience</p>
            </div>
            <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
              <Mic className="w-5 h-5 text-amber-500 mb-2" />
              <p className="text-sm text-white/80 font-medium">Real-time</p>
              <p className="text-xs text-white/30 mt-0.5">Low latency audio</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
