import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, MessageCircle, Send, Hash, Mail, Loader2 } from 'lucide-react';
import type { AestheticChoice } from '../hooks/useOnboardingState';

interface IntegrationsScreenProps {
    onAdvance: () => void;
    aesthetic?: AestheticChoice | null;
}

export function IntegrationsScreen({ onAdvance, aesthetic }: IntegrationsScreenProps) {
    const [connecting, setConnecting] = useState<string | null>(null);

    const isDark = aesthetic === 'dark' || aesthetic === 'vivid' || !aesthetic;
    const textColor = isDark ? 'text-white' : 'text-slate-900';
    const subtextColor = isDark ? 'text-white/60' : 'text-slate-600';
    const mutedColor = isDark ? 'text-white/40' : 'text-slate-400';

    const handleConnect = (platform: string) => {
        setConnecting(platform);
        // Simulate connection for now or implement real logic later
        setTimeout(() => {
            setConnecting(null);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full relative z-10 max-w-2xl mx-auto px-6 pt-20 pb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1"
            >
                <span className={`inline-block px-3 py-1 mb-6 rounded-full ${isDark ? 'bg-white/10 text-white/80' : 'bg-slate-200 text-slate-700'} text-xs font-medium tracking-wider uppercase`}>
                    Connectivity
                </span>

                <h1 className={`text-4xl md:text-5xl font-bold ${textColor} mb-6`}>
                    Connect your world.
                </h1>
                <p className={`text-xl ${subtextColor} mb-12 max-w-lg`}>
                    Link your accounts to give your OS context and communication powers.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <IntegrationOption
                        name="GitHub"
                        icon={<Github className={`w-5 h-5 ${isDark ? 'text-white' : 'text-slate-900'}`} />}
                        bgColor="bg-gray-800"
                        onClick={() => handleConnect('github')}
                        isLoading={connecting === 'github'}
                        isDark={isDark}
                    />
                    <IntegrationOption
                        name="WhatsApp"
                        icon={<MessageCircle className="w-5 h-5 text-white" />}
                        bgColor="bg-green-600"
                        onClick={() => handleConnect('whatsapp')}
                        isLoading={connecting === 'whatsapp'}
                        isDark={isDark}
                    />
                    <IntegrationOption
                        name="Telegram"
                        icon={<Send className="w-5 h-5 text-white" />}
                        bgColor="bg-blue-500"
                        onClick={() => handleConnect('telegram')}
                        isLoading={connecting === 'telegram'}
                        isDark={isDark}
                    />
                    <IntegrationOption
                        name="Slack"
                        icon={<Hash className="w-5 h-5 text-white" />}
                        bgColor="bg-purple-600"
                        onClick={() => handleConnect('slack')}
                        isLoading={connecting === 'slack'}
                        isDark={isDark}
                    />
                </div>

                <p className={`mt-8 text-sm ${mutedColor}`}>
                    You can configure these later in Settings.
                </p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onAdvance}
                className={`group flex items-center gap-3 text-lg font-medium ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-700 hover:text-slate-900'} transition-colors mt-8`}
            >
                Continue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
        </div>
    );
}

function IntegrationOption({
    name,
    icon,
    bgColor,
    onClick,
    isLoading,
    isDark
}: {
    name: string;
    icon: React.ReactNode;
    bgColor: string;
    onClick: () => void;
    isLoading: boolean;
    isDark: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-colors text-left ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
        >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor}`}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : icon}
            </div>
            <div>
                <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{name}</div>
                <div className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Connect account</div>
            </div>
        </button>
    );
}
