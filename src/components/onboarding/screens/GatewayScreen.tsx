'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Link as LinkIcon, Lock, Globe, Sparkles } from 'lucide-react';
import { springs } from '@/components/motion/config';

interface GatewayScreenProps {
    onAdvance: (url: string, token: string) => void;
    aesthetic?: 'clean' | 'warm' | 'dark' | 'vivid' | null;
}

export function GatewayScreen({ onAdvance, aesthetic }: GatewayScreenProps) {
    const [url, setUrl] = useState('ws://localhost:18789');
    const [token, setToken] = useState('openclaw-admin-token');

    const isDark = aesthetic === 'dark' || aesthetic === 'vivid' || !aesthetic;
    const textColor = isDark ? 'text-white' : 'text-slate-900';
    const subtextColor = isDark ? 'text-white/60' : 'text-slate-600';
    const inputBg = isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            onAdvance(url.trim(), token.trim());
        }
    };

    return (
        <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
        >
            <div className="text-center max-w-md w-full">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, ...springs.gentle }}
                    className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <Globe className="w-10 h-10 text-blue-400" />
                </motion.div>

                <h2 className={`text-3xl sm:text-4xl font-light mb-4 ${textColor}`}>
                    Connect to Gateway
                </h2>

                <p className={`text-base mb-10 ${subtextColor}`}>
                    Paste your OpenClaw Gateway endpoint and <br />admin token to enable system intelligence.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div className="space-y-2">
                        <label className={`text-xs uppercase tracking-widest ${subtextColor} ml-1`}>
                            Gateway Endpoint
                        </label>
                        <div className={`relative flex items-center ${inputBg} border rounded-2xl overflow-hidden px-4 py-3 transition-all focus-within:border-blue-500/50`}>
                            <LinkIcon className="w-5 h-5 text-blue-400 mr-3" />
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="ws://localhost:18789"
                                className={`w-full bg-transparent outline-none ${textColor}`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`text-xs uppercase tracking-widest ${subtextColor} ml-1`}>
                            Admin Token
                        </label>
                        <div className={`relative flex items-center ${inputBg} border rounded-2xl overflow-hidden px-4 py-3 transition-all focus-within:border-blue-500/50`}>
                            <Lock className="w-5 h-5 text-blue-400 mr-3" />
                            <input
                                type="password"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Paste token here"
                                className={`w-full bg-transparent outline-none ${textColor}`}
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex justify-center">
                        <button
                            type="submit"
                            disabled={!url.trim()}
                            className={`group flex items-center gap-3 px-8 py-4 rounded-full text-lg font-medium transition-all ${url.trim()
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95'
                                    : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                                }`}
                        >
                            Continue
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
