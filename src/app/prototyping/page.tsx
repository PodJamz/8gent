'use client';

import { useState, useCallback, useEffect, useRef, Component, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Monitor, Smartphone, Tablet, PanelLeft, PanelRight, Play, Square, AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { ControlDeck } from '@/components/prototyping/ControlDeck';
import { ProcessWindow, ProcessState, createInitialProcessState } from '@/components/prototyping/ProcessWindow';
import { SandboxProvider, useSandboxContext } from '@/contexts/SandboxContext';
import { SandboxFileExplorer } from '@/components/prototyping/SandboxFileExplorer';
import { SandboxPreview } from '@/components/prototyping/SandboxPreview';
import { SandboxLogs } from '@/components/prototyping/SandboxLogs';
import { springs } from '@/components/motion/config';

// ============================================================================
// Error Boundary for Sandbox Errors
// ============================================================================

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class SandboxErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Prototyping Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="h-[100dvh] flex flex-col items-center justify-center p-8"
          style={{
            background: 'linear-gradient(180deg, hsl(var(--theme-background)) 0%, hsl(var(--theme-card)) 100%)',
            color: 'hsl(var(--theme-foreground))',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springs.smooth}
            className="flex flex-col items-center text-center max-w-md"
          >
            <AlertTriangle className="w-16 h-16 mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
            <h1 className="text-2xl font-bold mb-2">Prototyping Unavailable</h1>
            <p className="mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              The sandbox environment couldn&apos;t be initialized. This feature requires server-side resources.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'hsl(var(--theme-muted))',
                  color: 'hsl(var(--theme-foreground))',
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              <Link
                href="/"
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'hsl(var(--theme-muted))',
                  color: 'hsl(var(--theme-foreground))',
                }}
              >
                Return Home
              </Link>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// 8gent Response Simulator
// ============================================================================

const AI_RESPONSES: Record<string, string[]> = {
  accept: [
    "Changes accepted! I've committed the updates to the component. The new animation looks much smoother now.",
    "Got it! Those changes are now applied. The refactored code is cleaner and more maintainable.",
    "Perfect! I've accepted those modifications. Ready for the next task whenever you are.",
  ],
  approve: [
    "Action approved! Running the implementation now. This should improve performance by about 20%.",
    "Approved! I'm applying the suggested optimizations to the codebase.",
    "Great choice! I've approved the changes and they're being deployed to the preview.",
  ],
  ralph_on: [
    "RALPH MODE ENGAGED! Running autonomous loop - one goal per iteration, no context rot. Let's go!",
    "Ralph loop activated! I'll deterministically malick the array and keep the locomotive on track.",
    "Ralph is in the loop! Specs are my PIN, tests are my checkpoints. Shipping autonomously now.",
  ],
  ralph_off: [
    "Ralph mode stopped. Back to attended mode - I'll wait for your direction on each step.",
    "Loop paused. We're back to manual control with checkpoints before each action.",
    "Ralph off. Ready to work together step by step again.",
  ],
  enter: [
    "Executing command... Processing your request now.",
    "On it! Running the task. Should be done in a moment.",
    "Command received. Spinning up the process now.",
  ],
  discard: [
    "Changes discarded. We're back to the previous state. No worries, we can try a different approach!",
    "Rolled back those changes. Let me know what direction you'd like to go instead.",
    "Discarded! The code is back to its original state. What should we try next?",
  ],
  retry: [
    "Retrying... Let me take another crack at this with a fresh approach.",
    "Okay, giving it another shot! Sometimes the second attempt works better.",
    "Retrying the operation. I'll try a slightly different strategy this time.",
  ],
  voice_on: [
    "Voice mode activated! I'm listening. Just speak naturally and I'll understand.",
    "Mic is hot! Go ahead and tell me what you need.",
    "Voice input enabled. I'm all ears!",
  ],
  voice_off: [
    "Voice mode off. Back to text input.",
    "Mic disabled. Type away when you're ready!",
    "Voice input paused. Ready for text commands.",
  ],
  suggest: [
    "Here's what I suggest next: Let's add some unit tests for the component we just built. Want me to generate them?",
    "I recommend we optimize the bundle size next. I noticed a few imports that could be tree-shaken.",
    "How about we add dark mode support? I can create a theme toggle that persists user preferences.",
    "Suggestion: Let's add error boundaries to prevent the whole app from crashing on component errors.",
  ],
  model_change: [
    "Model updated! I'm now running on the selected configuration. My capabilities are adjusted accordingly.",
    "Switched models! This one is optimized for the task at hand.",
    "New model loaded. Ready to continue with enhanced capabilities.",
  ],
};

const TERMINAL_COMMANDS: Record<string, string[]> = {
  accept: [
    '$ git add -A',
    '$ git commit -m "Apply accepted changes"',
    '✓ Changes committed successfully',
  ],
  approve: [
    '$ npm run build',
    '  ▸ Building application...',
    '  ▸ Optimizing chunks...',
    '✓ Build completed in 2.3s',
  ],
  enter: [
    '$ npm run dev',
    '',
    '  ▲ Next.js 14.0.0',
    '  - Local:        http://localhost:3000',
    '✓ Ready in 1.2s',
  ],
  discard: [
    '$ git checkout .',
    '$ git clean -fd',
    '✓ Changes discarded',
  ],
  retry: [
    '$ npm run lint --fix',
    '  ▸ Fixing linting issues...',
    '✓ 3 issues fixed automatically',
    '$ npm run build',
    '✓ Build successful',
  ],
};

// ============================================================================
// Main Page Component
// ============================================================================

function PrototypingContent() {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [processState, setProcessState] = useState<ProcessState>(createInitialProcessState);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const responseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sandbox context
  const sandbox = useSandboxContext();

  // Simulate 8gent response
  const simulateAIResponse = useCallback((action: string, customMessage?: string) => {
    // Clear any pending response
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
    }

    // Get random response for the action
    const responses = AI_RESPONSES[action] || AI_RESPONSES.suggest;
    const response = customMessage || responses[Math.floor(Math.random() * responses.length)];

    // Add terminal output if applicable
    const terminalCommands = TERMINAL_COMMANDS[action];
    if (terminalCommands) {
      setProcessState((prev) => ({
        ...prev,
        terminalOutput: [...prev.terminalOutput, '', ...terminalCommands],
      }));
    }

    // Set typing indicator
    setProcessState((prev) => ({
      ...prev,
      aiTyping: true,
      isProcessing: true,
    }));

    // Simulate response delay
    responseTimeoutRef.current = setTimeout(() => {
      setProcessState((prev) => ({
        ...prev,
        aiTyping: false,
        isProcessing: false,
        chatMessages: [
          ...prev.chatMessages,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: response,
            timestamp: new Date(),
          },
        ],
      }));
    }, 1000 + Math.random() * 1500);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }
    };
  }, []);

  // Control deck handlers
  const handleAcceptChanges = useCallback(() => {
    simulateAIResponse('accept');
    // Switch to code tab to show changes
    setProcessState((prev) => ({ ...prev, activeTab: 'code' }));
  }, [simulateAIResponse]);

  const handleApproveAction = useCallback(() => {
    simulateAIResponse('approve');
    setProcessState((prev) => ({ ...prev, activeTab: 'terminal' }));
  }, [simulateAIResponse]);

  const handleRalphMode = useCallback((enabled: boolean) => {
    simulateAIResponse(enabled ? 'ralph_on' : 'ralph_off');
    setProcessState((prev) => ({ ...prev, activeTab: 'chat' }));
  }, [simulateAIResponse]);

  const handleOpenChat = useCallback(() => {
    setProcessState((prev) => ({ ...prev, activeTab: 'chat' }));
  }, []);

  const handleEnter = useCallback(() => {
    simulateAIResponse('enter');
    setProcessState((prev) => ({ ...prev, activeTab: 'terminal' }));
  }, [simulateAIResponse]);

  const handleDiscard = useCallback(() => {
    simulateAIResponse('discard');
  }, [simulateAIResponse]);

  const handleRetry = useCallback(() => {
    simulateAIResponse('retry');
    setProcessState((prev) => ({ ...prev, activeTab: 'terminal' }));
  }, [simulateAIResponse]);

  const handleVoice = useCallback(() => {
    // Toggle voice state (simulated)
    const isVoiceOn = Math.random() > 0.5;
    simulateAIResponse(isVoiceOn ? 'voice_on' : 'voice_off');
  }, [simulateAIResponse]);

  const handleSuggestPrompt = useCallback(() => {
    simulateAIResponse('suggest');
    setProcessState((prev) => ({ ...prev, activeTab: 'chat' }));
  }, [simulateAIResponse]);

  const handleModelChange = useCallback((level: number) => {
    const modelNames = ['Haiku', 'Sonnet', 'Opus', 'Opus 4.5'];
    const modelIdx = Math.floor((level / 100) * 3);
    const modelName = modelNames[Math.min(modelIdx, 3)];
    simulateAIResponse('model_change', `Switched to Claude ${modelName}. I'm ready to assist with ${modelIdx >= 2 ? 'complex reasoning and code generation' : 'quick tasks and simple queries'}.`);
  }, [simulateAIResponse]);

  // Sandbox controls
  const handleStartSandbox = useCallback(async () => {
    try {
      await sandbox.create({ timeout: 600000, ports: [3000] });
      await sandbox.listFiles();
      simulateAIResponse('enter', 'Sandbox created! I have a full Node.js environment ready. What should we build?');
    } catch (error) {
      simulateAIResponse('enter', `Failed to create sandbox: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [sandbox, simulateAIResponse]);

  const handleStopSandbox = useCallback(async () => {
    try {
      await sandbox.terminate();
      simulateAIResponse('discard', 'Sandbox terminated. All resources cleaned up.');
    } catch (error) {
      console.error('Failed to terminate sandbox:', error);
    }
  }, [sandbox, simulateAIResponse]);

  const handleRefreshFiles = useCallback(async () => {
    if (sandbox.isConnected) {
      await sandbox.listFiles();
    }
  }, [sandbox]);

  const handleFileSelect = useCallback(async (path: string) => {
    setSelectedFile(path);
    if (sandbox.isConnected) {
      try {
        const content = await sandbox.readFile(path);
        // Update process state to show the file content
        setProcessState((prev) => ({
          ...prev,
          code: content,
          activeTab: 'code',
          currentTask: `Viewing ${path.split('/').pop()}`,
        }));
      } catch (error) {
        console.error('Failed to read file:', error);
      }
    }
  }, [sandbox]);

  // Handle state changes from ProcessWindow (e.g., user sending chat messages)
  const handleProcessStateChange = useCallback((newState: ProcessState) => {
    setProcessState(newState);

    // If user sent a chat message, simulate AI response
    const lastMessage = newState.chatMessages[newState.chatMessages.length - 1];
    if (lastMessage?.role === 'user' && newState.aiTyping) {
      // Generate contextual response based on user message
      const userMsg = lastMessage.content.toLowerCase();
      let response = '';

      if (userMsg.includes('refactor') || userMsg.includes('clean')) {
        response = "I'll refactor that code for you! Let me analyze the structure and suggest improvements. Give me a moment...";
      } else if (userMsg.includes('bug') || userMsg.includes('fix') || userMsg.includes('error')) {
        response = "Let me investigate that bug. I'll trace through the code and find the root cause. Can you tell me more about when it happens?";
      } else if (userMsg.includes('test')) {
        response = "Great idea! I'll generate comprehensive tests for the component. Should I use Jest or Vitest?";
      } else if (userMsg.includes('help') || userMsg.includes('what can')) {
        response = "I can help you with: writing code, refactoring, debugging, explaining concepts, writing tests, and optimizing performance. Just tell me what you need!";
      } else if (userMsg.includes('build') || userMsg.includes('create') || userMsg.includes('make')) {
        response = "Let's build it! I'll start with the basic structure and we can iterate from there. What specific features should it have?";
      } else {
        response = "Got it! I'm on it. Let me work on that for you. Feel free to use the control deck to guide my actions.";
      }

      responseTimeoutRef.current = setTimeout(() => {
        setProcessState((prev) => ({
          ...prev,
          aiTyping: false,
          isProcessing: false,
          chatMessages: [
            ...prev.chatMessages,
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: response,
              timestamp: new Date(),
            },
          ],
        }));
      }, 1500 + Math.random() * 1000);
    }
  }, []);

  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(var(--theme-background)) 0%, hsl(var(--theme-card)) 100%)',
      }}
    >
      {/* Top bar - hidden on mobile, visible on larger screens */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 hidden sm:flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3"
        style={{ borderBottom: '1px solid hsl(var(--theme-border) / 0.3)' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 transition-colors"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">8gent</span>
          </Link>

          {/* Panel toggles */}
          <div className="flex items-center gap-1 ml-4 pl-4" style={{ borderLeft: '1px solid hsl(var(--theme-border) / 0.3)' }}>
            <button
              onClick={() => setShowFileExplorer(!showFileExplorer)}
              className="p-1.5 rounded-lg transition-colors"
              style={{
                backgroundColor: showFileExplorer ? 'hsl(var(--theme-muted))' : 'transparent',
                color: showFileExplorer ? 'hsl(var(--theme-foreground))' : 'hsl(var(--theme-muted-foreground))',
              }}
              title="Toggle file explorer"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-1.5 rounded-lg transition-colors"
              style={{
                backgroundColor: showPreview ? 'hsl(var(--theme-muted))' : 'transparent',
                color: showPreview ? 'hsl(var(--theme-foreground))' : 'hsl(var(--theme-muted-foreground))',
              }}
              title="Toggle preview"
            >
              <PanelRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sandbox controls */}
          <div className="flex items-center gap-1 pl-4" style={{ borderLeft: '1px solid hsl(var(--theme-border) / 0.3)' }}>
            {!sandbox.isConnected ? (
              <button
                onClick={handleStartSandbox}
                disabled={sandbox.isCreating}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors disabled:opacity-50 text-xs"
                style={{
                  backgroundColor: 'hsl(var(--theme-primary) / 0.2)',
                  color: 'hsl(var(--theme-primary))',
                }}
              >
                <Play className="w-3 h-3" />
                {sandbox.isCreating ? 'Starting...' : 'Start Sandbox'}
              </button>
            ) : (
              <button
                onClick={handleStopSandbox}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30"
              >
                <Square className="w-3 h-3" />
                Stop Sandbox
              </button>
            )}
            {sandbox.isConnected && (
              <span className="text-xs text-green-400 ml-2">Connected</span>
            )}
          </div>
        </div>

        {/* View mode selector */}
        <div className="flex items-center gap-1">
          <span className="text-xs mr-2 hidden md:inline" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Preview</span>
          <button
            onClick={() => setViewMode('mobile')}
            className="p-1.5 sm:p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: viewMode === 'mobile' ? 'hsl(var(--theme-muted))' : 'transparent',
              color: viewMode === 'mobile' ? 'hsl(var(--theme-foreground))' : 'hsl(var(--theme-muted-foreground))',
            }}
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className="p-1.5 sm:p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: viewMode === 'tablet' ? 'hsl(var(--theme-muted))' : 'transparent',
              color: viewMode === 'tablet' ? 'hsl(var(--theme-foreground))' : 'hsl(var(--theme-muted-foreground))',
            }}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className="p-1.5 sm:p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: viewMode === 'desktop' ? 'hsl(var(--theme-muted))' : 'transparent',
              color: viewMode === 'desktop' ? 'hsl(var(--theme-foreground))' : 'hsl(var(--theme-muted-foreground))',
            }}
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {processState.isProcessing && (
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{processState.currentTask || 'IDLE'}</span>
        </div>
      </motion.div>

      {/* Main content area - Three panel layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden gap-2 p-2">
        {/* Left panel - File Explorer */}
        {showFileExplorer && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="hidden md:block w-64 flex-shrink-0"
          >
            <div className="h-full flex flex-col gap-2">
              <div className="flex-1 min-h-0">
                <SandboxFileExplorer
                  files={sandbox.state.files}
                  selectedFile={selectedFile}
                  onFileSelect={handleFileSelect}
                  onRefresh={handleRefreshFiles}
                  isLoading={sandbox.isCreating}
                />
              </div>
              <div className="h-48">
                <SandboxLogs
                  logs={sandbox.logs}
                  onClear={sandbox.clearLogs}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Center panel - Process Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 min-w-0 rounded-xl overflow-hidden"
          style={{
            backgroundColor: 'hsl(var(--theme-card))',
            boxShadow: 'inset 0 0 0 1px hsl(var(--theme-border) / 0.3), 0 20px 50px hsl(var(--theme-foreground) / 0.15)',
          }}
        >
          {/* Browser chrome mockup - hidden on mobile */}
          <div
            className="hidden sm:flex items-center gap-2 px-2 sm:px-4 py-1.5 sm:py-2"
            style={{
              backgroundColor: 'hsl(var(--theme-muted))',
              borderBottom: '1px solid hsl(var(--theme-border) / 0.3)',
            }}
          >
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 flex justify-center">
              <div
                className="px-3 sm:px-4 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs max-w-[200px] sm:max-w-xs truncate"
                style={{
                  backgroundColor: 'hsl(var(--theme-background) / 0.5)',
                  color: 'hsl(var(--theme-muted-foreground))',
                }}
              >
                8gent • {processState.currentTask || 'Ready'}
              </div>
            </div>
            <div className="w-8 sm:w-12 flex justify-end">
              {processState.isProcessing && (
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
          </div>

          {/* Process Window content - full height on mobile, adjusted on larger screens */}
          <div className="h-full sm:h-[calc(100%-40px)]">
            <ProcessWindow
              state={processState}
              onStateChange={handleProcessStateChange}
            />
          </div>
        </motion.div>

        {/* Right panel - Preview */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="hidden lg:block w-96 flex-shrink-0"
          >
            <SandboxPreview
              url={sandbox.state.previewUrl}
              isLoading={sandbox.isCreating}
              onRefresh={async () => {
                if (sandbox.isConnected) {
                  await sandbox.getPreviewUrl();
                }
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Control Deck - compact on mobile with safe area */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', damping: 20 }}
        className="flex-shrink-0 px-2 pt-1 sm:pt-2 pb-4 sm:pb-6"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)',
        }}
      >
        <ControlDeck
          taskName={processState.currentTask || 'CODING'}
          progress={60}
          model="CLAUDE OPUS 4.5"
          subscription={85}
          onAcceptChanges={handleAcceptChanges}
          onApproveAction={handleApproveAction}
          onRalphMode={handleRalphMode}
          onOpenChat={handleOpenChat}
          onEnter={handleEnter}
          onDiscard={handleDiscard}
          onRetry={handleRetry}
          onVoice={handleVoice}
          onSuggestPrompt={handleSuggestPrompt}
          onModelChange={handleModelChange}
        />
      </motion.div>
    </div>
  );
}

// ============================================================================
// Page Export with Provider
// ============================================================================

export default function PrototypingPage() {
  return (
    <SandboxErrorBoundary>
      <SandboxProvider>
        <PrototypingContent />
      </SandboxProvider>
    </SandboxErrorBoundary>
  );
}
