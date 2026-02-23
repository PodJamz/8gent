'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Sparkles } from 'lucide-react';
import { springs } from '@/components/motion/config';

interface WhoAmIScreenProps {
    onAdvance: (name: string) => void;
    aesthetic?: 'clean' | 'warm' | 'dark' | 'vivid' | null;
}

export function WhoAmIScreen({ onAdvance, aesthetic }: WhoAmIScreenProps) {
    const [name, setName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const isDark = aesthetic === 'dark' || aesthetic === 'vivid' || !aesthetic;
    const textColor = isDark ? 'text-white' : 'text-slate-900';
    const subtextColor = isDark ? 'text-white/60' : 'text-slate-600';
    const inputBg = isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200';

    useEffect(() => {
        // Small delay to ensure focus works after transition
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdvance(name.trim());
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
                    className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <User className="w-10 h-10 text-emerald-400" />
                </motion.div>

                <motion.h2
                    className={`text-3xl sm:text-4xl font-light mb-4 ${textColor}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, ...springs.gentle }}
                >
                    Who am I speaking with?
                </motion.h2>

                <motion.p
                    className={`text-base mb-10 ${subtextColor}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    I'd like to personalize your experience. <br />How should I address you?
                </motion.p>

                <motion.form
                    onSubmit={handleSubmit}
                    className="relative w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className={`w-full bg-transparent border-b-2 ${inputBg.includes('border-white') ? 'border-white/20 focus:border-emerald-400' : 'border-slate-300 focus:border-emerald-600'} py-4 text-2xl text-center outline-none transition-all ${textColor}`}
                        maxLength={50}
                    />

                    <div className="mt-12 flex justify-center">
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className={`group flex items-center gap-3 px-8 py-4 rounded-full text-lg font-medium transition-all ${name.trim()
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95'
                                    : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                                }`}
                        >
                            Set Identity
                            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>
                </motion.form>
            </div>
        </motion.div>
    );
}
