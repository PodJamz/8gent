import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, MessageCircle, Send, Hash, Mail, Loader2 } from 'lucide-react';

interface IntegrationsScreenProps {
    onAdvance: () => void;
}

export function IntegrationsScreen({ onAdvance }: IntegrationsScreenProps) {
    const [connecting, setConnecting] = useState<string | null>(null);

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
                <span className="inline-block px-3 py-1 mb-6 rounded-full bg-white/10 text-xs font-medium tracking-wider text-white/80 uppercase">
                    Connectivity
                </span>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Connect your world.
                </h1>
                <p className="text-xl text-white/60 mb-12 max-w-lg">
                    Link your accounts to give your OS context and communication powers.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <IntegrationOption
                        name="GitHub"
                        icon={<Github className="w-5 h-5 text-white" />}
                        bgColor="bg-gray-800"
                        onClick={() => handleConnect('github')}
                        isLoading={connecting === 'github'}
                    />
                    <IntegrationOption
                        name="WhatsApp"
                        icon={<MessageCircle className="w-5 h-5 text-white" />}
                        bgColor="bg-green-600"
                        onClick={() => handleConnect('whatsapp')}
                        isLoading={connecting === 'whatsapp'}
                    />
                    <IntegrationOption
                        name="Telegram"
                        icon={<Send className="w-5 h-5 text-white" />}
                        bgColor="bg-blue-500"
                        onClick={() => handleConnect('telegram')}
                        isLoading={connecting === 'telegram'}
                    />
                    <IntegrationOption
                        name="Slack"
                        icon={<Hash className="w-5 h-5 text-white" />}
                        bgColor="bg-purple-600"
                        onClick={() => handleConnect('slack')}
                        isLoading={connecting === 'slack'}
                    />
                </div>

                <p className="mt-8 text-sm text-white/40">
                    You can configure these later in Settings.
                </p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onAdvance}
                className="group flex items-center gap-3 text-lg font-medium text-white/80 hover:text-white transition-colors"
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
    isLoading
}: {
    name: string;
    icon: React.ReactNode;
    bgColor: string;
    onClick: () => void;
    isLoading: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left"
        >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor}`}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : icon}
            </div>
            <div>
                <div className="font-medium text-white">{name}</div>
                <div className="text-xs text-white/40">Connect account</div>
            </div>
        </button>
    );
}
