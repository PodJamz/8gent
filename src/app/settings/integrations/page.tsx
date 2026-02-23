'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/ios';
import {
  ChevronLeft,
  Github,
  Check,
  ExternalLink,
  Loader2,
  Unplug,
  AlertCircle,
  MessageCircle,
  Send,
  Hash,
  Bot,
  X,
  Settings,
  QrCode,
  Mail,
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';

// Platform type
type Platform = 'whatsapp' | 'telegram' | 'slack' | 'discord' | 'email';

// ============================================================================
// Integration Card Component
// ============================================================================

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  isConnected: boolean;
  isLoading?: boolean;
  onConnect: () => void;
  onDisconnect?: () => void;
  onSettings?: () => void;
  connectedAccount?: string;
  connectionStatus?: 'disconnected' | 'connecting' | 'connected' | 'error';
  buttonIcon?: React.ReactNode;
  buttonText?: string;
}

function IntegrationCard({
  name,
  description,
  icon,
  iconBg,
  isConnected,
  isLoading,
  onConnect,
  onDisconnect,
  onSettings,
  connectedAccount,
  connectionStatus,
  buttonIcon,
  buttonText,
}: IntegrationCardProps) {
  const statusColors = {
    disconnected: 'text-white/40',
    connecting: 'text-amber-400',
    connected: 'text-emerald-400',
    error: 'text-red-400',
  };

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-medium text-white">{name}</h3>
            {isConnected && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3" />
                Connected
              </span>
            )}
            {connectionStatus === 'error' && (
              <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3" />
                Error
              </span>
            )}
          </div>
          <p className="text-sm text-white/50 mt-1">{description}</p>
          {isConnected && connectedAccount && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${statusColors[connectionStatus || 'connected']}`}>
              {connectedAccount}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {isConnected ? (
          <>
            {onSettings && (
              <button
                onClick={onSettings}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            )}
            <button
              onClick={onDisconnect}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Unplug className="w-4 h-4" />
              )}
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={onConnect}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_40%)] transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {buttonIcon || <Github className="w-4 h-4" />}
                {buttonText || 'Connect'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Channel Connection Modal
// ============================================================================

interface ChannelConnectionModalProps {
  platform: Platform | null;
  onClose: () => void;
  onConnect: (data: {
    platform: Platform;
    platformUserId: string;
    platformUsername?: string;
    credentials: Record<string, string>;
  }) => void;
  isLoading: boolean;
}

function ChannelConnectionModal({
  platform,
  onClose,
  onConnect,
  isLoading,
}: ChannelConnectionModalProps) {
  const [formData, setFormData] = useState({
    platformUserId: '',
    platformUsername: '',
    botToken: '',
    serverUrl: '',
    serverPassword: '',
    webhookSecret: '',
  });

  if (!platform) return null;

  const platformConfig = {
    whatsapp: {
      title: 'Connect WhatsApp',
      description: 'Link your WhatsApp to receive 8gent messages.',
      fields: [
        { key: 'platformUserId', label: 'Phone Number', placeholder: '+1234567890', required: true },
        { key: 'platformUsername', label: 'Display Name', placeholder: 'Your name', required: false },
      ],
      note: 'WhatsApp Business API or Baileys session will be used for connection.',
    },
    telegram: {
      title: 'Connect Telegram Bot',
      description: 'Create a bot via @BotFather and paste the token.',
      fields: [
        { key: 'botToken', label: 'Bot Token', placeholder: '123456:ABC-DEF...', required: true },
        { key: 'platformUserId', label: 'Your Telegram ID', placeholder: '123456789', required: true },
        { key: 'platformUsername', label: 'Username', placeholder: '@username', required: false },
      ],
      note: 'Send /start to your bot to enable messaging.',
    },
    slack: {
      title: 'Connect Slack',
      description: 'Install the 8gent app to your Slack workspace.',
      fields: [
        { key: 'platformUserId', label: 'User ID', placeholder: 'U0123456789', required: true },
        { key: 'platformUsername', label: 'Display Name', placeholder: 'Your name', required: false },
        { key: 'webhookSecret', label: 'Webhook Secret', placeholder: 'xoxb-...', required: true },
      ],
      note: 'OAuth flow will be added soon for seamless connection.',
    },
    discord: {
      title: 'Connect Discord',
      description: 'Add the 8gent bot to your Discord server.',
      fields: [
        { key: 'botToken', label: 'Bot Token', placeholder: 'Bot token from Developer Portal', required: true },
        { key: 'platformUserId', label: 'Your Discord ID', placeholder: '123456789012345678', required: true },
        { key: 'platformUsername', label: 'Username', placeholder: 'user#1234', required: false },
      ],
      note: 'Enable Developer Mode in Discord to copy your user ID.',
    },
    email: {
      title: 'Connect Email',
      description: 'Receive 8gent responses via email.',
      fields: [
        { key: 'platformUserId', label: 'Your Email Address', placeholder: 'you@example.com', required: true },
        { key: 'platformUsername', label: 'Display Name', placeholder: 'Your name', required: false },
      ],
      note: 'Send emails to ai@openclaw.io to chat with 8gent.',
    },
  };

  const config = platformConfig[platform];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const credentials: Record<string, string> = {};
    if (formData.botToken) credentials.botToken = formData.botToken;
    if (formData.serverUrl) credentials.serverUrl = formData.serverUrl;
    if (formData.serverPassword) credentials.serverPassword = formData.serverPassword;
    if (formData.webhookSecret) credentials.webhookSecret = formData.webhookSecret;

    onConnect({
      platform,
      platformUserId: formData.platformUserId,
      platformUsername: formData.platformUsername || undefined,
      credentials,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{config.title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <p className="text-sm text-white/60">{config.description}</p>

          {config.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-white/80 mb-1">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={formData[field.key as keyof typeof formData]}
                onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          ))}

          <p className="text-xs text-white/40">{config.note}</p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-white bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_40%)] transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Connect Channel'
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// Main Integrations Page
// ============================================================================

function IntegrationsPage() {
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  // Get user ID for Convex queries
  const userId = user?.id || '';

  // Convex queries and mutations
  const channelIntegrations = useQuery(
    api.channels.getUserIntegrations,
    userId ? { userId } : 'skip'
  );
  const createIntegration = useMutation(api.channels.createIntegration);
  const deleteIntegration = useMutation(api.channels.deleteIntegration);

  // Check if GitHub is connected
  const githubAccount = user?.externalAccounts?.find(
    (account) => account.provider === 'github'
  );
  const isGithubConnected = !!githubAccount;

  // Get integration for a specific platform
  const getIntegrationForPlatform = (platform: Platform) => {
    return channelIntegrations?.find((i) => i.platform === platform);
  };

  // Connect GitHub via Clerk user profile
  const handleConnectGithub = () => {
    clerk.openUserProfile();
  };

  // Disconnect GitHub
  const handleDisconnectGithub = async () => {
    if (!githubAccount) return;

    setIsConnecting(true);
    setError(null);

    try {
      await githubAccount.destroy();
      await user?.reload();
    } catch (err) {
      console.error('Failed to disconnect GitHub:', err);
      setError('Failed to disconnect GitHub. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect a channel
  const handleConnectChannel = async (data: {
    platform: Platform;
    platformUserId: string;
    platformUsername?: string;
    credentials: Record<string, string>;
  }) => {
    if (!userId) {
      setError('Please sign in to connect channels.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await createIntegration({
        userId,
        platform: data.platform,
        platformUserId: data.platformUserId,
        platformUsername: data.platformUsername,
        credentials: {
          botToken: data.credentials.botToken,
          serverUrl: data.credentials.serverUrl,
          serverPassword: data.credentials.serverPassword,
          webhookSecret: data.credentials.webhookSecret,
        },
      });
      setConnectingPlatform(null);
    } catch (err) {
      console.error('Failed to connect channel:', err);
      setError(`Failed to connect ${data.platform}. Please try again.`);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect a channel
  const handleDisconnectChannel = async (integrationId: string) => {
    setDisconnectingId(integrationId);
    setError(null);

    try {
      await deleteIntegration({ integrationId });
    } catch (err) {
      console.error('Failed to disconnect channel:', err);
      setError('Failed to disconnect channel. Please try again.');
    } finally {
      setDisconnectingId(null);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-950">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              href="/settings"
              className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Back to settings"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-xl font-semibold text-white">Integrations</h1>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-lg mx-auto px-4 py-6">
          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <p className="text-sm text-amber-200/80">
              Connect your accounts to unlock additional features like the OpenClaw coding assistant.
            </p>
          </motion.div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200/80">{error}</p>
            </motion.div>
          )}

          {/* Loading State */}
          {!isLoaded ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Developer Tools Section */}
              <div>
                <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
                  Developer Tools
                </h2>
                <div className="space-y-4">
                  {/* GitHub Integration */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <IntegrationCard
                      name="GitHub"
                      description="Connect GitHub to use the OpenClaw coding assistant and access your repositories."
                      icon={<Github className="w-6 h-6 text-white" />}
                      iconBg="bg-gradient-to-br from-gray-700 to-gray-900"
                      isConnected={isGithubConnected}
                      isLoading={isConnecting && !connectingPlatform}
                      onConnect={handleConnectGithub}
                      onDisconnect={handleDisconnectGithub}
                      connectedAccount={githubAccount?.username || githubAccount?.emailAddress || undefined}
                      buttonIcon={<Github className="w-4 h-4" />}
                      buttonText="Connect GitHub"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Messaging Channels Section */}
              <div>
                <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
                  Messaging Channels
                </h2>
                <div className="space-y-4">
                  {/* WhatsApp Integration */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    {(() => {
                      const integration = getIntegrationForPlatform('whatsapp');
                      return (
                        <IntegrationCard
                          name="WhatsApp"
                          description="Chat with 8gent through WhatsApp. Perfect for on-the-go conversations."
                          icon={<MessageCircle className="w-6 h-6 text-white" />}
                          iconBg="bg-gradient-to-br from-green-600 to-green-800"
                          isConnected={!!integration}
                          isLoading={disconnectingId === integration?.integrationId}
                          onConnect={() => setConnectingPlatform('whatsapp')}
                          onDisconnect={() => integration && handleDisconnectChannel(integration.integrationId)}
                          connectedAccount={integration?.platformUsername || integration?.platformUserId}
                          connectionStatus={integration?.connectionStatus}
                          buttonIcon={<QrCode className="w-4 h-4" />}
                          buttonText="Connect WhatsApp"
                        />
                      );
                    })()}
                  </motion.div>

                  {/* Telegram Integration */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {(() => {
                      const integration = getIntegrationForPlatform('telegram');
                      return (
                        <IntegrationCard
                          name="Telegram"
                          description="Connect your Telegram bot for instant 8gent access via Telegram."
                          icon={<Send className="w-6 h-6 text-white" />}
                          iconBg="bg-gradient-to-br from-blue-500 to-blue-700"
                          isConnected={!!integration}
                          isLoading={disconnectingId === integration?.integrationId}
                          onConnect={() => setConnectingPlatform('telegram')}
                          onDisconnect={() => integration && handleDisconnectChannel(integration.integrationId)}
                          connectedAccount={integration?.platformUsername || integration?.platformUserId}
                          connectionStatus={integration?.connectionStatus}
                          buttonIcon={<Bot className="w-4 h-4" />}
                          buttonText="Connect Telegram"
                        />
                      );
                    })()}
                  </motion.div>

                  {/* Slack Integration */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    {(() => {
                      const integration = getIntegrationForPlatform('slack');
                      return (
                        <IntegrationCard
                          name="Slack"
                          description="Bring 8gent to your Slack workspace for team-accessible AI assistance."
                          icon={<Hash className="w-6 h-6 text-white" />}
                          iconBg="bg-gradient-to-br from-purple-600 to-purple-800"
                          isConnected={!!integration}
                          isLoading={disconnectingId === integration?.integrationId}
                          onConnect={() => setConnectingPlatform('slack')}
                          onDisconnect={() => integration && handleDisconnectChannel(integration.integrationId)}
                          connectedAccount={integration?.platformUsername || integration?.platformUserId}
                          connectionStatus={integration?.connectionStatus}
                          buttonIcon={<Hash className="w-4 h-4" />}
                          buttonText="Connect Slack"
                        />
                      );
                    })()}
                  </motion.div>

                  {/* Discord Integration */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {(() => {
                      const integration = getIntegrationForPlatform('discord');
                      return (
                        <IntegrationCard
                          name="Discord"
                          description="Add 8gent to your Discord server for chat-based AI interactions."
                          icon={
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                            </svg>
                          }
                          iconBg="bg-gradient-to-br from-indigo-600 to-indigo-800"
                          isConnected={!!integration}
                          isLoading={disconnectingId === integration?.integrationId}
                          onConnect={() => setConnectingPlatform('discord')}
                          onDisconnect={() => integration && handleDisconnectChannel(integration.integrationId)}
                          connectedAccount={integration?.platformUsername || integration?.platformUserId}
                          connectionStatus={integration?.connectionStatus}
                          buttonIcon={<Bot className="w-4 h-4" />}
                          buttonText="Connect Discord"
                        />
                      );
                    })()}
                  </motion.div>

                  {/* Email Integration */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    {(() => {
                      const integration = getIntegrationForPlatform('email');
                      return (
                        <IntegrationCard
                          name="Email"
                          description="Chat with 8gent via email at ai@openclaw.io."
                          icon={<Mail className="w-6 h-6 text-white" />}
                          iconBg="bg-gradient-to-br from-red-500 to-red-700"
                          isConnected={!!integration}
                          isLoading={disconnectingId === integration?.integrationId}
                          onConnect={() => setConnectingPlatform('email')}
                          onDisconnect={() => integration && handleDisconnectChannel(integration.integrationId)}
                          connectedAccount={integration?.platformUsername || integration?.platformUserId}
                          connectionStatus={integration?.connectionStatus}
                          buttonIcon={<Mail className="w-4 h-4" />}
                          buttonText="Connect Email"
                        />
                      );
                    })()}
                  </motion.div>
                </div>
              </div>

              {/* Coming Soon Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 border-dashed"
              >
                <p className="text-sm text-white/40 text-center">
                  iMessage (BlueBubbles) coming soon...
                </p>
              </motion.div>
            </div>
          )}

          {/* Channel Connection Modal */}
          <AnimatePresence>
            {connectingPlatform && (
              <ChannelConnectionModal
                platform={connectingPlatform}
                onClose={() => setConnectingPlatform(null)}
                onConnect={handleConnectChannel}
                isLoading={isConnecting}
              />
            )}
          </AnimatePresence>

          {/* Help Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <a
              href="https://clerk.com/docs/authentication/social-connections/github"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              Learn more about GitHub integration
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}

// Loading component for SSR
function IntegrationsLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
    </div>
  );
}

// Use dynamic import with SSR disabled (Clerk hooks need ClerkProvider)
export default dynamic(() => Promise.resolve(IntegrationsPage), {
  ssr: false,
  loading: IntegrationsLoading,
});
