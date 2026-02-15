'use client';

/**
 * AgenticProductStudio - Truly agentic voice-driven PRD creation
 *
 * This replaces manual form filling with a conversational interface:
 * - User speaks/types naturally about their product idea
 * - Claw AI extracts PRD fields in real-time
 * - Live canvas panel shows visual diagrams as conversation progresses
 * - PRDs can be visually sharded to tickets on canvas
 *
 * Inspired by BMAD-METHOD and the Flowy JSON-based diagram approach.
 */

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  XCircle,
  Maximize2,
  Minimize2,
  Target,
  Users,
  Lightbulb,
  FileText,
  Layers,
  CheckCircle2,
  Loader2,
  Volume2,
  VolumeX,
  ChevronRight,
  LayoutPanelLeft,
  PanelRightClose,
  Wand2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { cn } from '@/lib/utils';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { ContextReferenceInput } from '@/components/ui/ContextReferenceInput';
import type { ContextReference } from '@/lib/canvas/artifacts';

// ============================================================================
// Types
// ============================================================================

interface PRDFields {
  title: string;
  problem: string;
  targetUser: string;
  solution: string;
  features: string[];
  constraints: string[];
  successMetrics: string[];
  mvpDefinition: string;
  nonGoals: string[];
  milestones: string[];
  openQuestions: string[];
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  extractedFields?: Partial<PRDFields>;
  isStreaming?: boolean;
}

interface CanvasElement {
  id: string;
  type: 'screen' | 'flow-start' | 'flow-end' | 'flow-process' | 'flow-decision' | 'feature' | 'user' | 'arch-service' | 'arch-database' | 'note';
  label: string;
  description?: string;
  position: { x: number; y: number };
  color?: string;
  connections?: string[]; // IDs of connected elements
}

interface CanvasData {
  screens: string[];
  userJourney: string[];
  features: string[];
  architecture: string[];
}

// ============================================================================
// PRD Field Extraction (AI-powered)
// ============================================================================

const PRD_EXTRACTION_PROMPT = `You are an AI product manager helping extract PRD (Product Requirements Document) fields AND visual elements from a conversation.

As the user describes their product idea, extract:

PRD FIELDS:
- title: The product name or title
- problem: The core problem being solved
- targetUser: Who the product is for
- solution: The proposed solution approach
- features: List of features mentioned
- constraints: Technical or business constraints
- successMetrics: How success will be measured
- mvpDefinition: What constitutes the minimum viable product
- nonGoals: What is explicitly out of scope
- milestones: Key milestones or phases
- openQuestions: Questions that need answers

VISUAL ELEMENTS (for live canvas):
- screens: Names of screens/pages mentioned (e.g., "Login Screen", "Dashboard", "Settings")
- userJourney: Steps in the user flow (e.g., "User opens app", "User logs in", "User views dashboard")
- architecture: Technical components mentioned (e.g., "API Server", "Database", "Auth Service")

After each response, include a JSON block with any newly extracted fields:
\`\`\`prd-extract
{
  "title": "extracted title or null",
  "problem": "extracted problem or null",
  "screens": ["Screen Name 1", "Screen Name 2"],
  "userJourney": ["Step 1", "Step 2"],
  "architecture": ["Component 1", "Component 2"],
  ...
}
\`\`\`

Be conversational and guide the user through defining their product. Ask clarifying questions to fill gaps. Help them think through their idea systematically.`;

interface ExtractionResult {
  prdFields: Partial<PRDFields>;
  canvasData: Partial<CanvasData>;
}

function extractPRDFields(content: string): ExtractionResult | null {
  const match = content.match(/```prd-extract\s*([\s\S]*?)```/);
  if (!match) return null;

  try {
    const json = JSON.parse(match[1]);
    // Filter out null values and separate PRD fields from canvas data
    const prdFields: Partial<PRDFields> = {};
    const canvasData: Partial<CanvasData> = {};
    const canvasKeys = ['screens', 'userJourney', 'architecture'];

    Object.entries(json).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (canvasKeys.includes(key)) {
          (canvasData as any)[key] = value;
        } else {
          (prdFields as any)[key] = value;
        }
      }
    });

    const hasPRD = Object.keys(prdFields).length > 0;
    const hasCanvas = Object.keys(canvasData).length > 0;

    return (hasPRD || hasCanvas) ? { prdFields, canvasData } : null;
  } catch {
    return null;
  }
}

function cleanDisplayContent(content: string): string {
  // Remove the PRD extraction JSON block from display
  return content.replace(/```prd-extract[\s\S]*?```/g, '').trim();
}

// ============================================================================
// Message Component
// ============================================================================

function ChatMessage({ message, isLatest }: { message: ConversationMessage; isLatest: boolean }) {
  const isUser = message.role === 'user';
  const displayContent = cleanDisplayContent(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3 mb-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser
            ? 'bg-blue-500'
            : 'bg-gradient-to-br from-violet-500 to-purple-600'
        )}
      >
        {isUser ? (
          <span className="text-white text-sm font-medium">U</span>
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-white/10 text-white/90'
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{displayContent}</p>

        {message.isStreaming && (
          <div className="flex items-center gap-1 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse delay-100" />
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse delay-200" />
          </div>
        )}

        {/* Show extracted fields indicator */}
        {message.extractedFields && Object.keys(message.extractedFields).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-white/10">
            {Object.keys(message.extractedFields).map((field) => (
              <span
                key={field}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/20 text-green-300"
              >
                <CheckCircle2 className="w-2.5 h-2.5" />
                {field}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Live PRD Preview Panel
// ============================================================================

function PRDPreviewPanel({
  fields,
  isExpanded,
  onToggle,
}: {
  fields: PRDFields;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const filledFields = useMemo(() => {
    return Object.entries(fields).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return Boolean(value);
    });
  }, [fields]);

  const completionPercent = Math.round((filledFields.length / 11) * 100);

  const fieldIcons: Record<string, React.ReactNode> = {
    title: <FileText className="w-3.5 h-3.5" />,
    problem: <Target className="w-3.5 h-3.5" />,
    targetUser: <Users className="w-3.5 h-3.5" />,
    solution: <Lightbulb className="w-3.5 h-3.5" />,
    features: <Layers className="w-3.5 h-3.5" />,
    constraints: <Target className="w-3.5 h-3.5" />,
    successMetrics: <CheckCircle2 className="w-3.5 h-3.5" />,
    mvpDefinition: <Wand2 className="w-3.5 h-3.5" />,
    nonGoals: <XCircle className="w-3.5 h-3.5" />,
    milestones: <ChevronRight className="w-3.5 h-3.5" />,
    openQuestions: <Lightbulb className="w-3.5 h-3.5" />,
  };

  return (
    <div className="h-full flex flex-col bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Live PRD</h3>
            <p className="text-xs text-white/50">{completionPercent}% complete</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isExpanded ? (
            <Minimize2 className="w-4 h-4 text-white/60" />
          ) : (
            <Maximize2 className="w-4 h-4 text-white/60" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${completionPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {Object.entries(fields).map(([key, value]) => {
          const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value);
          const displayValue = Array.isArray(value) ? value.join(', ') : value;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: hasValue ? 1 : 0.5 }}
              className={cn(
                'p-3 rounded-xl transition-colors',
                hasValue ? 'bg-white/10' : 'bg-white/5 border border-dashed border-white/10'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(hasValue ? 'text-green-400' : 'text-white/40')}>
                  {fieldIcons[key]}
                </span>
                <span className="text-xs font-medium text-white/60 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                {hasValue && (
                  <CheckCircle2 className="w-3 h-3 text-green-400 ml-auto" />
                )}
              </div>
              {hasValue ? (
                <p className="text-sm text-white/90 line-clamp-2">
                  {displayValue}
                </p>
              ) : (
                <p className="text-xs text-white/30 italic">
                  Not yet captured...
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Mini Canvas Preview
// ============================================================================

function CanvasPreviewPanel({
  elements,
  isVisible,
  onToggle,
  onOpenFullCanvas,
}: {
  elements: CanvasElement[];
  isVisible: boolean;
  onToggle: () => void;
  onOpenFullCanvas?: () => void;
}) {
  return (
    <div className="h-full flex flex-col bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
            <LayoutPanelLeft className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Live Canvas</h3>
            <p className="text-xs text-white/50">{elements.length} elements</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isVisible ? (
            <Eye className="w-4 h-4 text-white/60" />
          ) : (
            <EyeOff className="w-4 h-4 text-white/60" />
          )}
        </button>
      </div>

      {/* Canvas Preview */}
      <div className="flex-1 relative bg-[#1a1a2e] overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Elements */}
        {elements.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Wand2 className="w-8 h-8 mx-auto mb-2 text-white/20" />
              <p className="text-xs text-white/30">
                Visuals will appear here<br />as you describe your product
              </p>
            </div>
          </div>
        ) : (
          elements.map((element) => {
            // Node shape based on type
            const getNodeStyle = () => {
              switch (element.type) {
                case 'flow-start':
                case 'flow-end':
                  return 'rounded-full px-4 py-2';
                case 'flow-decision':
                  return 'rotate-45 w-10 h-10 flex items-center justify-center';
                case 'flow-process':
                  return 'rounded-lg px-3 py-2';
                case 'screen':
                  return 'rounded-xl px-3 py-2 border-2 border-purple-400/50';
                case 'arch-database':
                  return 'rounded-t-lg rounded-b-[50%] px-3 py-2';
                case 'arch-service':
                  return 'rounded-lg px-3 py-2 border border-white/20';
                case 'user':
                  return 'rounded-full px-3 py-2';
                default:
                  return 'rounded-lg px-3 py-2';
              }
            };

            const bgColor = element.color || '#3b82f6';

            return (
              <motion.div
                key={element.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute"
                style={{
                  left: element.position.x,
                  top: element.position.y,
                }}
              >
                <div
                  className={cn(
                    'text-[10px] font-medium shadow-lg text-white',
                    getNodeStyle()
                  )}
                  style={{ backgroundColor: bgColor }}
                >
                  {element.type === 'flow-decision' ? (
                    <span className="-rotate-45 block text-[8px]">{element.label}</span>
                  ) : (
                    element.label
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Open Full Canvas Button */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onOpenFullCanvas}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-purple-500/20 text-purple-300 text-sm font-medium hover:bg-purple-500/30 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
          Open Full Canvas
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

interface AgenticProductStudioProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  onPRDComplete?: (prd: PRDFields) => void;
}

export function AgenticProductStudio({
  isOpen,
  onClose,
  projectId,
  onPRDComplete,
}: AgenticProductStudioProps) {
  const router = useRouter();

  // State
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCanvas, setShowCanvas] = useState(true);
  const [expandPRD, setExpandPRD] = useState(false);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [prdFields, setPrdFields] = useState<PRDFields>({
    title: '',
    problem: '',
    targetUser: '',
    solution: '',
    features: [],
    constraints: [],
    successMetrics: [],
    mvpDefinition: '',
    nonGoals: [],
    milestones: [],
    openQuestions: [],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Open full canvas with current elements
  const openFullCanvas = useCallback(() => {
    // Store canvas data in sessionStorage for the canvas page to pick up
    const canvasState = {
      elements: canvasElements,
      prdTitle: prdFields.title,
      projectId,
    };
    sessionStorage.setItem('canvas_import_data', JSON.stringify(canvasState));

    // Navigate to canvas
    router.push('/canvas?mode=import');
    onClose();
  }, [canvasElements, prdFields.title, projectId, router, onClose]);

  // Voice Chat Hook
  const voiceChat = useVoiceChat({
    continuous: false,
    autoSpeak: true,
    onTranscriptComplete: async (transcript) => {
      if (transcript.trim()) {
        setInputValue('');
        await sendMessage(transcript);
      }
    },
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Hey! I'm here to help you define your product. Just tell me about your idea - what problem are you trying to solve, and who is it for?

You can speak naturally or type. As we talk, I'll extract the key details for your PRD in real-time. You'll see the document build itself on the right.

What's on your mind?`,
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, messages.length]);

  // Send message to AI
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isProcessing) return;

    const userMessage: ConversationMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    const assistantMessage: ConversationMessage = {
      id: `assistant_${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setIsProcessing(true);

    try {
      // Prepare messages for API
      const apiMessages = [
        { role: 'system', content: PRD_EXTRACTION_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: content },
      ];

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          model: 'default',
          themeContext: 'Product development assistant helping create a PRD',
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulated += parsed.content;

                setMessages(prev =>
                  prev.map(m =>
                    m.id === assistantMessage.id
                      ? { ...m, content: accumulated }
                      : m
                  )
                );
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Extract PRD fields and canvas data from the response
      const extraction = extractPRDFields(accumulated);

      if (extraction) {
        const { prdFields: extractedPRD, canvasData: extractedCanvas } = extraction;

        // Update PRD fields
        if (Object.keys(extractedPRD).length > 0) {
          setPrdFields(prev => {
            const updated = { ...prev };
            Object.entries(extractedPRD).forEach(([key, value]) => {
              if (value !== null && value !== undefined) {
                if (Array.isArray(prev[key as keyof PRDFields])) {
                  // For array fields, merge with existing
                  const existing = prev[key as keyof PRDFields] as string[];
                  const newItems = Array.isArray(value) ? value : [value];
                  (updated as any)[key] = [...new Set([...existing, ...newItems])];
                } else {
                  (updated as any)[key] = value;
                }
              }
            });
            return updated;
          });
        }

        // Generate canvas elements from extracted data
        const newElements: CanvasElement[] = [];
        const baseTime = Date.now();

        // Add screens as flow-screen nodes
        if (extractedCanvas.screens) {
          extractedCanvas.screens.forEach((screen, i) => {
            newElements.push({
              id: `screen_${baseTime}_${i}`,
              type: 'screen',
              label: screen,
              position: { x: 20 + (i % 4) * 140, y: 20 },
              color: '#8b5cf6',
            });
          });
        }

        // Add user journey as flow nodes
        if (extractedCanvas.userJourney) {
          extractedCanvas.userJourney.forEach((step, i) => {
            const isFirst = i === 0;
            const isLast = i === extractedCanvas.userJourney!.length - 1;
            newElements.push({
              id: `journey_${baseTime}_${i}`,
              type: isFirst ? 'flow-start' : isLast ? 'flow-end' : 'flow-process',
              label: step,
              position: { x: 20 + i * 160, y: 100 },
              color: isFirst ? '#10b981' : isLast ? '#ef4444' : '#3b82f6',
            });
          });
        }

        // Add architecture components
        if (extractedCanvas.architecture) {
          extractedCanvas.architecture.forEach((comp, i) => {
            const isDb = comp.toLowerCase().includes('database') || comp.toLowerCase().includes('db');
            newElements.push({
              id: `arch_${baseTime}_${i}`,
              type: isDb ? 'arch-database' : 'arch-service',
              label: comp,
              position: { x: 20 + (i % 3) * 150, y: 200 + Math.floor(i / 3) * 80 },
              color: isDb ? '#10b981' : '#3b82f6',
            });
          });
        }

        // Add features
        if (extractedPRD.features) {
          const features = Array.isArray(extractedPRD.features) ? extractedPRD.features : [extractedPRD.features];
          features.forEach((feature, i) => {
            newElements.push({
              id: `feature_${baseTime}_${i}`,
              type: 'feature',
              label: feature as string,
              position: { x: 20 + (i % 3) * 130, y: 320 + Math.floor(i / 3) * 50 },
              color: '#f59e0b',
            });
          });
        }

        if (newElements.length > 0) {
          setCanvasElements(prev => [...prev, ...newElements]);
        }

        // Update message with extracted fields
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMessage.id
              ? { ...m, isStreaming: false, extractedFields: extractedPRD }
              : m
          )
        );
      } else {
        // Just mark as complete
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMessage.id
              ? { ...m, isStreaming: false }
              : m
          )
        );
      }

      // Speak the response if voice is enabled
      const cleanContent = cleanDisplayContent(accumulated);
      if (cleanContent) {
        voiceChat.speakResponse(cleanContent);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMessage.id
            ? { ...m, isStreaming: false, content: 'Sorry, I encountered an error. Please try again.' }
            : m
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, [messages, isProcessing, voiceChat]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const value = inputValue;
      setInputValue('');
      sendMessage(value);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Visual sharding - convert PRD into visual tickets on canvas
  const shardToCanvas = useCallback(() => {
    const newElements: CanvasElement[] = [];
    const baseTime = Date.now();
    let yOffset = 20;

    // Create a "PRD" header node
    if (prdFields.title) {
      newElements.push({
        id: `prd_title_${baseTime}`,
        type: 'note',
        label: `PRD: ${prdFields.title}`,
        position: { x: 20, y: yOffset },
        color: '#8b5cf6',
      });
      yOffset += 60;
    }

    // Create feature tickets
    if (prdFields.features.length > 0) {
      // Add section header
      newElements.push({
        id: `features_header_${baseTime}`,
        type: 'note',
        label: 'Features',
        position: { x: 20, y: yOffset },
        color: '#6366f1',
      });
      yOffset += 40;

      prdFields.features.forEach((feature, i) => {
        newElements.push({
          id: `ticket_feature_${baseTime}_${i}`,
          type: 'feature',
          label: feature,
          description: `Feature ticket: ${feature}`,
          position: { x: 20 + (i % 3) * 180, y: yOffset + Math.floor(i / 3) * 60 },
          color: '#3b82f6',
        });
      });
      yOffset += Math.ceil(prdFields.features.length / 3) * 60 + 40;
    }

    // Create milestone tickets
    if (prdFields.milestones.length > 0) {
      newElements.push({
        id: `milestones_header_${baseTime}`,
        type: 'note',
        label: 'Milestones',
        position: { x: 20, y: yOffset },
        color: '#6366f1',
      });
      yOffset += 40;

      prdFields.milestones.forEach((milestone, i) => {
        const isFirst = i === 0;
        const isLast = i === prdFields.milestones.length - 1;
        newElements.push({
          id: `ticket_milestone_${baseTime}_${i}`,
          type: isFirst ? 'flow-start' : isLast ? 'flow-end' : 'flow-process',
          label: milestone,
          position: { x: 20 + i * 180, y: yOffset },
          color: isFirst ? '#10b981' : isLast ? '#ef4444' : '#f59e0b',
        });
      });
      yOffset += 80;
    }

    // Create constraint notes
    if (prdFields.constraints.length > 0) {
      newElements.push({
        id: `constraints_header_${baseTime}`,
        type: 'note',
        label: 'Constraints',
        position: { x: 20, y: yOffset },
        color: '#ef4444',
      });
      yOffset += 40;

      prdFields.constraints.forEach((constraint, i) => {
        newElements.push({
          id: `constraint_${baseTime}_${i}`,
          type: 'note',
          label: constraint,
          position: { x: 20 + (i % 2) * 220, y: yOffset + Math.floor(i / 2) * 50 },
          color: '#ef4444',
        });
      });
    }

    // Replace canvas with sharded view
    setCanvasElements(newElements);
  }, [prdFields]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-[#0a0a14] border border-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Agentic Product Studio</h2>
              <p className="text-xs text-white/50">Voice-driven PRD creation</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Toggle */}
            <button
              onClick={voiceChat.toggleVoice}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',
                voiceChat.isVoiceEnabled
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              )}
            >
              {voiceChat.isVoiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span className="text-xs font-medium">Voice</span>
            </button>

            {/* Canvas Toggle */}
            <button
              onClick={() => setShowCanvas(!showCanvas)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',
                showCanvas
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              )}
            >
              {showCanvas ? (
                <LayoutPanelLeft className="w-4 h-4" />
              ) : (
                <PanelRightClose className="w-4 h-4" />
              )}
              <span className="text-xs font-medium">Canvas</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <XCircle className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex min-h-0">
          {/* Chat Panel */}
          <div className={cn(
            'flex flex-col transition-all duration-300',
            showCanvas ? 'w-1/2' : 'w-full'
          )}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              {messages.map((message, i) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLatest={i === messages.length - 1}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10">
              {/* Voice Status */}
              {voiceChat.mode === 'listening' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 mb-3 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <div className="relative">
                    <Mic className="w-5 h-5 text-red-400" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </div>
                  <span className="text-sm text-red-300">
                    {voiceChat.interimTranscript || 'Listening...'}
                  </span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="flex items-end gap-3">
                {/* Voice Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (voiceChat.mode === 'listening') {
                      voiceChat.stopListening();
                    } else {
                      voiceChat.startListening();
                    }
                  }}
                  disabled={!voiceChat.isSpeechSupported}
                  className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                    voiceChat.mode === 'listening'
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  )}
                >
                  {voiceChat.mode === 'listening' ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>

                {/* Text Input with Context References */}
                <div className="flex-1 relative">
                  <ContextReferenceInput
                    value={inputValue}
                    onChange={setInputValue}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your product idea... Use @ to reference tickets, PRDs, etc."
                    multiline
                    rows={1}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                    onReferenceInserted={(ref: ContextReference) => {
                      console.log('Reference inserted:', ref);
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isProcessing}
                    className="absolute right-2 bottom-2 w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-400 transition-colors"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </form>

              {/* Hint */}
              <p className="text-xs text-white/30 mt-2 text-center">
                Press Enter to send, Shift+Enter for new line, use @ to reference data, or click the mic
              </p>
            </div>
          </div>

          {/* Right Panel - PRD + Canvas */}
          {showCanvas && (
            <div className="w-1/2 flex flex-col border-l border-white/10 p-4 gap-4">
              {/* PRD Preview */}
              <div className={cn(
                'transition-all duration-300',
                expandPRD ? 'flex-1' : 'h-1/2'
              )}>
                <PRDPreviewPanel
                  fields={prdFields}
                  isExpanded={expandPRD}
                  onToggle={() => setExpandPRD(!expandPRD)}
                />
              </div>

              {/* Canvas Preview */}
              {!expandPRD && (
                <div className="h-1/2">
                  <CanvasPreviewPanel
                    elements={canvasElements}
                    isVisible={true}
                    onToggle={() => {}}
                    onOpenFullCanvas={openFullCanvas}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Claw AI is extracting PRD fields as you speak</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors text-sm font-medium"
            >
              Cancel
            </button>

            {/* Shard to Canvas */}
            <button
              onClick={shardToCanvas}
              disabled={prdFields.features.length === 0 && prdFields.milestones.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/20 text-orange-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-500/30 transition-colors"
            >
              <Layers className="w-4 h-4" />
              Shard to Canvas
            </button>

            <button
              onClick={() => onPRDComplete?.(prdFields)}
              disabled={!prdFields.title || !prdFields.problem}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              <FileText className="w-4 h-4" />
              Save PRD
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// Entry Point Button
// ============================================================================

interface AgenticProductStudioButtonProps {
  onClick: () => void;
  variant?: 'default' | 'compact';
}

export function AgenticProductStudioButton({ onClick, variant = 'default' }: AgenticProductStudioButtonProps) {
  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
          color: 'white',
        }}
      >
        <Mic className="w-4 h-4" />
        <span className="font-medium">Voice PRD</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group relative w-full p-6 rounded-2xl transition-all hover:scale-[1.02] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      <div className="relative flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
          <Mic className="w-7 h-7 text-white" />
        </div>
        <div className="text-left">
          <h3 className="text-xl font-semibold text-white">
            Voice PRD Studio
          </h3>
          <p className="text-white/80">
            Speak your product idea into existence
          </p>
        </div>
        <ChevronRight className="w-6 h-6 text-white/80 ml-auto" />
      </div>
    </button>
  );
}

export default AgenticProductStudio;
