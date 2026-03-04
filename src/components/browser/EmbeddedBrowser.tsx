'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Bookmark,
  BookmarkPlus,
  Camera,
  ExternalLink,
  Search,
  X,
  Star,
  Clock,
  Trash2,
  MoreHorizontal,
  Plus,
  Sparkles,
  Save,
  Share2,
  Download,
  Layers,
  PanelLeft,
  PanelRight,
  Code,
  Eye,
  Wand2,
  MessageSquare,
  Zap,
  FileText,
  Copy,
  Link2,
  Image as ImageIcon,
  Settings,
  Terminal,
  Bot,
  ScanLine,
  MousePointer,
  Type,
  CheckSquare,
  Square,
} from 'lucide-react';
import { PageTransition } from '@/components/ios/PageTransition';

// ============================================================================
// Types
// ============================================================================

type DeviceMode = 'mobile' | 'tablet' | 'desktop';
type ViewMode = 'browse' | 'inspect' | 'automate';
type PanelView = 'none' | 'bookmarks' | 'history' | 'ai-assist' | 'automation' | 'elements';

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  createdAt: number;
  folder?: string;
}

interface HistoryItem {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  visitedAt: number;
}

interface AutomationStep {
  id: string;
  type: 'navigate' | 'click' | 'type' | 'wait' | 'screenshot' | 'extract';
  selector?: string;
  value?: string;
  description: string;
}

interface Tab {
  id: string;
  url: string;
  title: string;
  isLoading: boolean;
  favicon?: string;
}

const DEVICE_CONFIGS: Record<DeviceMode, { width: string; height: string; label: string; userAgent?: string }> = {
  mobile: {
    width: '375px',
    height: '667px',
    label: 'iPhone SE',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  },
  tablet: {
    width: '768px',
    height: '1024px',
    label: 'iPad',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  },
  desktop: {
    width: '100%',
    height: '100%',
    label: 'Desktop',
  },
};

const QUICK_LINKS = [
  { name: 'Google', url: 'https://google.com', icon: '🔍', color: '#4285F4' },
  { name: 'GitHub', url: 'https://github.com', icon: '🐙', color: '#333' },
  { name: 'Twitter/X', url: 'https://x.com', icon: '𝕏', color: '#000' },
  { name: 'YouTube', url: 'https://youtube.com', icon: '▶️', color: '#FF0000' },
  { name: 'Reddit', url: 'https://reddit.com', icon: '🤖', color: '#FF4500' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: '🟧', color: '#FF6600' },
  { name: 'Product Hunt', url: 'https://producthunt.com', icon: '🚀', color: '#DA552F' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '📚', color: '#F48024' },
];

const BOOKMARK_FOLDERS = ['All', 'Work', 'Research', 'Social', 'Tools'];

// Sites that use JavaScript frame-busting and can't be embedded
// These sites check window.self !== window.top and break when proxied
const FRAME_BUSTING_SITES = [
  { domain: 'x.com', name: 'X (Twitter)', suggestion: 'Use the X API for 8gent posting' },
  { domain: 'twitter.com', name: 'Twitter', suggestion: 'Use the X API for 8gent posting' },
  { domain: 'youtube.com', name: 'YouTube', suggestion: 'Use youtube.com/embed/VIDEO_ID for embeds' },
  { domain: 'facebook.com', name: 'Facebook', suggestion: null },
  { domain: 'instagram.com', name: 'Instagram', suggestion: null },
  { domain: 'linkedin.com', name: 'LinkedIn', suggestion: null },
  { domain: 'tiktok.com', name: 'TikTok', suggestion: null },
  { domain: 'discord.com', name: 'Discord', suggestion: null },
  { domain: 'slack.com', name: 'Slack', suggestion: null },
  { domain: 'netflix.com', name: 'Netflix', suggestion: null },
  { domain: 'amazon.com', name: 'Amazon', suggestion: null },
  { domain: 'paypal.com', name: 'PayPal', suggestion: null },
  { domain: 'stripe.com', name: 'Stripe', suggestion: null },
];

function getFrameBustingSite(url: string): { domain: string; name: string; suggestion: string | null } | null {
  try {
    const hostname = new URL(url).hostname;
    return FRAME_BUSTING_SITES.find(site =>
      hostname === site.domain || hostname.endsWith('.' + site.domain)
    ) || null;
  } catch {
    return null;
  }
}

// Convert a URL to use our proxy API
function getProxyUrl(url: string): string {
  if (!url) return '';
  // Don't proxy our own domain or data URLs
  if (url.startsWith('data:') || url.startsWith('blob:') || url.includes('openclaw.io')) {
    return url;
  }
  return `/api/browser/proxy?url=${encodeURIComponent(url)}`;
}

// ============================================================================
// Helper Components
// ============================================================================

function TabBar({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
}: {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
}) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-900/50 border-b border-white/5 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all min-w-[120px] max-w-[200px] ${activeTabId === tab.id
            ? 'bg-white/10 text-white'
            : 'text-white/50 hover:text-white/70 hover:bg-white/5'
            }`}
        >
          {tab.isLoading ? (
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          ) : (
            <Globe className="w-4 h-4 flex-shrink-0 text-white/40" />
          )}
          <span className="truncate flex-1 text-left">{tab.title || 'New Tab'}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseTab(tab.id);
            }}
            className="p-0.5 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </button>
      ))}
      <button
        onClick={onNewTab}
        className="p-1.5 rounded-lg text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors flex-shrink-0"
        title="New tab"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

function AIAssistPanel({
  url,
  onNavigate,
  onAction,
}: {
  url: string;
  onNavigate: (url: string) => void;
  onAction: (action: string) => void;
}) {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    'Summarize this page',
    'Extract all links',
    'Find contact information',
    'List main topics',
    'Save to research',
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsProcessing(true);
    // Simulate AI processing
    await new Promise((r) => setTimeout(r, 1500));
    onAction(prompt);
    setPrompt('');
    setIsProcessing(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-white/10">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          AI Assistant
        </h3>
        <p className="text-xs text-white/40 mt-1">
          Ask questions about the page or automate tasks
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Quick suggestions */}
        <div className="space-y-2">
          <p className="text-xs text-white/40 uppercase tracking-wide">Quick Actions</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Current page info */}
        {url && (
          <div className="p-3 bg-white/5 rounded-lg space-y-2">
            <p className="text-xs text-white/40">Current Page</p>
            <p className="text-sm truncate">{url}</p>
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/10">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI about this page..."
            className="w-full bg-white/10 rounded-xl px-4 py-3 pr-12 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
            rows={2}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isProcessing}
            className="absolute right-2 bottom-2 p-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 rounded-lg transition-colors"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function AutomationPanel({
  steps,
  onAddStep,
  onRemoveStep,
  onRunAutomation,
  isRunning,
}: {
  steps: AutomationStep[];
  onAddStep: (step: AutomationStep) => void;
  onRemoveStep: (id: string) => void;
  onRunAutomation: () => void;
  isRunning: boolean;
}) {
  const [selectedAction, setSelectedAction] = useState<AutomationStep['type']>('click');
  const [selector, setSelector] = useState('');
  const [value, setValue] = useState('');

  const actionTypes: { type: AutomationStep['type']; icon: typeof MousePointer; label: string }[] = [
    { type: 'navigate', icon: Globe, label: 'Navigate' },
    { type: 'click', icon: MousePointer, label: 'Click' },
    { type: 'type', icon: Type, label: 'Type' },
    { type: 'wait', icon: Clock, label: 'Wait' },
    { type: 'screenshot', icon: Camera, label: 'Screenshot' },
    { type: 'extract', icon: FileText, label: 'Extract' },
  ];

  const handleAddStep = () => {
    if (!selector && selectedAction !== 'wait' && selectedAction !== 'screenshot') return;

    const newStep: AutomationStep = {
      id: Date.now().toString(),
      type: selectedAction,
      selector: selector || undefined,
      value: value || undefined,
      description: `${selectedAction}${selector ? ` on ${selector}` : ''}${value ? `: ${value}` : ''}`,
    };
    onAddStep(newStep);
    setSelector('');
    setValue('');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-white/10">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          Automation
        </h3>
        <p className="text-xs text-white/40 mt-1">
          Record and replay browser actions
        </p>
      </div>

      {/* Action types */}
      <div className="p-3 border-b border-white/10">
        <div className="grid grid-cols-3 gap-1">
          {actionTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setSelectedAction(type)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${selectedAction === type
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step builder */}
      <div className="p-3 space-y-2 border-b border-white/10">
        {selectedAction !== 'wait' && selectedAction !== 'screenshot' && (
          <input
            type="text"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            placeholder="CSS selector (e.g., #submit-btn)"
            className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          />
        )}
        {(selectedAction === 'type' || selectedAction === 'navigate' || selectedAction === 'wait') && (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={
              selectedAction === 'type'
                ? 'Text to type...'
                : selectedAction === 'navigate'
                  ? 'URL to navigate to...'
                  : 'Wait time in ms...'
            }
            className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          />
        )}
        <button
          onClick={handleAddStep}
          className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm font-medium transition-colors"
        >
          Add Step
        </button>
      </div>

      {/* Steps list */}
      <div className="flex-1 overflow-y-auto p-3">
        {steps.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-8">
            No steps recorded yet
          </p>
        ) : (
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center gap-2 p-2 bg-white/5 rounded-lg group"
              >
                <span className="w-6 h-6 flex items-center justify-center bg-yellow-500/20 text-yellow-400 rounded text-xs font-bold">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm truncate">{step.description}</span>
                <button
                  onClick={() => onRemoveStep(step.id)}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Run button */}
      {steps.length > 0 && (
        <div className="p-3 border-t border-white/10">
          <button
            onClick={onRunAutomation}
            disabled={isRunning}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-black rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Run Automation
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function EmbeddedBrowser() {
  // Tab management
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', url: '', title: 'New Tab', isLoading: false },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');

  // Get active tab
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // URL state
  const [inputValue, setInputValue] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // UI state
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [panelView, setPanelView] = useState<PanelView>('none');
  const [iframeKey, setIframeKey] = useState(0);

  // Data
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [automationSteps, setAutomationSteps] = useState<AutomationStep[]>([]);
  const [isAutomationRunning, setIsAutomationRunning] = useState(false);
  const [selectedBookmarkFolder, setSelectedBookmarkFolder] = useState('All');
  const [loadError, setLoadError] = useState<string | null>(null);

  // Refs
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('openclaw-browser-bookmarks');
    const savedHistory = localStorage.getItem('openclaw-browser-history');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Save bookmarks and history to localStorage
  useEffect(() => {
    localStorage.setItem('openclaw-browser-bookmarks', JSON.stringify(bookmarks));
    localStorage.setItem('openclaw-browser-history', JSON.stringify(history));
  }, [bookmarks, history]);

  // Update input when tab changes
  useEffect(() => {
    setInputValue(activeTab.url);
    setLoadError(null);
  }, [activeTab.url]);

  // Navigate to URL
  const navigateTo = useCallback((targetUrl: string, tabId?: string) => {
    let processedUrl = targetUrl.trim();

    // Add protocol if missing
    if (processedUrl && !processedUrl.match(/^https?:\/\//)) {
      // Check if it looks like a search query
      if (!processedUrl.includes('.') || processedUrl.includes(' ')) {
        processedUrl = `https://www.google.com/search?q=${encodeURIComponent(processedUrl)}`;
      } else {
        processedUrl = `https://${processedUrl}`;
      }
    }

    if (processedUrl) {
      const targetTabId = tabId || activeTabId;
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === targetTabId
            ? { ...tab, url: processedUrl, title: processedUrl, isLoading: true }
            : tab
        )
      );
      setInputValue(processedUrl);
      setIframeKey((prev) => prev + 1);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        title: processedUrl,
        url: processedUrl,
        visitedAt: Date.now(),
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 99)]);
    }
  }, [activeTabId]);

  // Listen for navigation messages from proxied pages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'navigate' && event.data?.url) {
        navigateTo(event.data.url);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigateTo]);

  // Handle URL submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      navigateTo(inputValue);
    },
    [inputValue, navigateTo]
  );

  // Handle iframe load
  const handleIframeLoad = useCallback(() => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId ? { ...tab, isLoading: false } : tab
      )
    );
    // Try to get title from iframe (may fail due to CORS)
    try {
      const iframeDoc = iframeRef.current?.contentDocument;
      if (iframeDoc?.title) {
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === activeTabId ? { ...tab, title: iframeDoc.title } : tab
          )
        );
      }
    } catch {
      // CORS prevents access
    }
  }, [activeTabId]);

  // Tab management
  const createNewTab = useCallback(() => {
    const newTab: Tab = {
      id: Date.now().toString(),
      url: '',
      title: 'New Tab',
      isLoading: false,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setInputValue('');
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setTabs((prev) => {
      const filtered = prev.filter((t) => t.id !== tabId);
      if (filtered.length === 0) {
        // Keep at least one tab
        return [{ id: Date.now().toString(), url: '', title: 'New Tab', isLoading: false }];
      }
      return filtered;
    });
    if (activeTabId === tabId) {
      setTabs((prev) => {
        const newActive = prev.find((t) => t.id !== tabId) || prev[0];
        setActiveTabId(newActive.id);
        return prev;
      });
    }
  }, [activeTabId]);

  // Navigation actions
  const goBack = useCallback(() => {
    // Limited by iframe sandbox
    setCanGoBack(false);
  }, []);

  const goForward = useCallback(() => {
    setCanGoForward(false);
  }, []);

  const refresh = useCallback(() => {
    setIframeKey((prev) => prev + 1);
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId ? { ...tab, isLoading: true } : tab
      )
    );
  }, [activeTabId]);

  const goHome = useCallback(() => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId ? { ...tab, url: '', title: 'New Tab', isLoading: false } : tab
      )
    );
    setInputValue('');
  }, [activeTabId]);

  // Bookmark management
  const toggleBookmark = useCallback(() => {
    if (!activeTab.url) return;

    const existingIndex = bookmarks.findIndex((b) => b.url === activeTab.url);
    if (existingIndex >= 0) {
      setBookmarks((prev) => prev.filter((_, i) => i !== existingIndex));
    } else {
      const newBookmark: BookmarkItem = {
        id: Date.now().toString(),
        title: activeTab.title || activeTab.url,
        url: activeTab.url,
        createdAt: Date.now(),
        folder: selectedBookmarkFolder === 'All' ? undefined : selectedBookmarkFolder,
      };
      setBookmarks((prev) => [newBookmark, ...prev]);
    }
  }, [activeTab, bookmarks, selectedBookmarkFolder]);

  const isBookmarked = bookmarks.some((b) => b.url === activeTab.url);

  // Open in external browser
  const openExternal = useCallback(() => {
    if (activeTab.url) {
      window.open(activeTab.url, '_blank', 'noopener,noreferrer');
    }
  }, [activeTab.url]);

  // Copy URL
  const copyUrl = useCallback(() => {
    if (activeTab.url) {
      navigator.clipboard.writeText(activeTab.url);
    }
  }, [activeTab.url]);

  // Delete bookmark
  const deleteBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Delete history item
  const deleteHistoryItem = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  // Automation
  const addAutomationStep = useCallback((step: AutomationStep) => {
    setAutomationSteps((prev) => [...prev, step]);
  }, []);

  const removeAutomationStep = useCallback((id: string) => {
    setAutomationSteps((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const runAutomation = useCallback(async () => {
    setIsAutomationRunning(true);
    // Simulate running automation
    for (const step of automationSteps) {
      await new Promise((r) => setTimeout(r, 1000));
      console.log('Running step:', step.description);
    }
    setIsAutomationRunning(false);
  }, [automationSteps]);

  // AI action handler
  const handleAIAction = useCallback((action: string) => {
    console.log('AI Action:', action);
    // This would integrate with 8gent
  }, []);

  // Filter bookmarks by folder
  const filteredBookmarks =
    selectedBookmarkFolder === 'All'
      ? bookmarks
      : bookmarks.filter((b) => b.folder === selectedBookmarkFolder);

  // Panel width
  const panelWidth = panelView !== 'none' ? 320 : 0;

  return (
    <PageTransition>
      <div
        className="h-screen flex flex-col bg-black text-white overflow-hidden"
        style={{
          overscrollBehavior: 'contain',
          touchAction: 'pan-x pan-y',
        }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={setActiveTabId}
          onCloseTab={closeTab}
          onNewTab={createNewTab}
        />

        {/* Top Navigation Bar */}
        <div className="flex-shrink-0 bg-zinc-900/90 backdrop-blur-xl border-b border-white/10">
          {/* URL Bar Row */}
          <div className="flex items-center gap-2 px-3 py-2">
            {/* Navigation buttons */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={goBack}
                disabled={!canGoBack}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goForward}
                disabled={!canGoForward}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                title="Go forward"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={refresh}
                disabled={!activeTab.url}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                title="Refresh"
              >
                <RotateCw className={`w-4 h-4 ${activeTab.isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={goHome}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title="Home"
              >
                <Home className="w-4 h-4" />
              </button>
            </div>

            {/* URL Input */}
            <form onSubmit={handleSubmit} className="flex-1">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {activeTab.isLoading ? (
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Globe className="w-4 h-4 text-white/40" />
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search or enter URL..."
                  className="w-full bg-white/10 rounded-xl pl-10 pr-20 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/15 transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {inputValue && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputValue('');
                        inputRef.current?.focus();
                      }}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <X className="w-3 h-3 text-white/40" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="p-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </form>

            {/* Action buttons */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={toggleBookmark}
                disabled={!activeTab.url}
                className={`p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors ${isBookmarked ? 'text-yellow-400' : ''
                  }`}
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isBookmarked ? (
                  <Star className="w-4 h-4 fill-current" />
                ) : (
                  <BookmarkPlus className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={copyUrl}
                disabled={!activeTab.url}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                title="Copy URL"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={openExternal}
                disabled={!activeTab.url}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Secondary toolbar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/5">
            {/* Left side: Device modes */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-white/40 mr-2">View:</span>
              {(Object.keys(DEVICE_CONFIGS) as DeviceMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDeviceMode(mode)}
                  className={`p-1.5 rounded-lg transition-colors ${deviceMode === mode
                    ? 'bg-white/20 text-white'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                    }`}
                  title={DEVICE_CONFIGS[mode].label}
                >
                  {mode === 'mobile' && <Smartphone className="w-4 h-4" />}
                  {mode === 'tablet' && <Tablet className="w-4 h-4" />}
                  {mode === 'desktop' && <Monitor className="w-4 h-4" />}
                </button>
              ))}

              <div className="w-px h-4 bg-white/10 mx-2" />

              {/* View modes */}
              <button
                onClick={() => setViewMode('browse')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors ${viewMode === 'browse'
                  ? 'bg-white/20 text-white'
                  : 'text-white/40 hover:bg-white/5'
                  }`}
              >
                <Eye className="w-3 h-3" />
                Browse
              </button>
              <button
                onClick={() => setViewMode('inspect')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors ${viewMode === 'inspect'
                  ? 'bg-white/20 text-white'
                  : 'text-white/40 hover:bg-white/5'
                  }`}
              >
                <ScanLine className="w-3 h-3" />
                Inspect
              </button>
              <button
                onClick={() => setViewMode('automate')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors ${viewMode === 'automate'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'text-white/40 hover:bg-white/5'
                  }`}
              >
                <Zap className="w-3 h-3" />
                Automate
              </button>
            </div>

            {/* Right side: Panels */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPanelView(panelView === 'bookmarks' ? 'none' : 'bookmarks')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors ${panelView === 'bookmarks'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:bg-white/10'
                  }`}
              >
                <Bookmark className="w-3 h-3" />
                Bookmarks
              </button>
              <button
                onClick={() => setPanelView(panelView === 'history' ? 'none' : 'history')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors ${panelView === 'history'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:bg-white/10'
                  }`}
              >
                <Clock className="w-3 h-3" />
                History
              </button>
              <button
                onClick={() => setPanelView(panelView === 'ai-assist' ? 'none' : 'ai-assist')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors ${panelView === 'ai-assist'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-white/60 hover:bg-white/10'
                  }`}
              >
                <Bot className="w-3 h-3" />
                AI Assist
              </button>
              <button
                onClick={() => setPanelView(panelView === 'automation' ? 'none' : 'automation')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors ${panelView === 'automation'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'text-white/60 hover:bg-white/10'
                  }`}
              >
                <Terminal className="w-3 h-3" />
                Automation
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden" style={{ overscrollBehavior: 'contain' }}>
          {/* Browser View */}
          <div className="flex-1 flex items-center justify-center bg-zinc-950 p-4 overflow-auto" style={{ overscrollBehavior: 'contain' }}>
            {!activeTab.url ? (
              // New Tab Page
              <div className="w-full max-w-3xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Logo */}
                  <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/20">
                    <Globe className="w-12 h-12 text-white" />
                  </div>

                  <h1 className="text-3xl font-bold mb-2">OpenClaw Browser</h1>
                  <p className="text-white/50 mb-8">
                    Browse, automate, and explore the web with AI assistance
                  </p>

                  {/* Search box */}
                  <form onSubmit={handleSubmit} className="mb-10">
                    <div className="relative max-w-xl mx-auto">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search Google or enter URL"
                        className="w-full bg-white/10 rounded-2xl pl-12 pr-4 py-4 text-lg placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/15 transition-all"
                        autoFocus
                      />
                    </div>
                  </form>

                  {/* Quick links */}
                  <div className="mb-10">
                    <h2 className="text-sm font-semibold text-white/40 mb-4 uppercase tracking-wide">
                      Quick Links
                    </h2>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 max-w-2xl mx-auto">
                      {QUICK_LINKS.map((link) => (
                        <button
                          key={link.name}
                          onClick={() => navigateTo(link.url)}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors group"
                        >
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: `${link.color}20` }}
                          >
                            {link.icon}
                          </div>
                          <span className="text-xs text-white/60">{link.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent bookmarks */}
                  {bookmarks.length > 0 && (
                    <div>
                      <h2 className="text-sm font-semibold text-white/40 mb-4 uppercase tracking-wide">
                        Bookmarks
                      </h2>
                      <div className="flex flex-wrap justify-center gap-3">
                        {bookmarks.slice(0, 8).map((bookmark) => (
                          <button
                            key={bookmark.id}
                            onClick={() => navigateTo(bookmark.url)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
                          >
                            <Globe className="w-4 h-4 text-white/40" />
                            <span className="text-sm truncate max-w-[150px]">
                              {bookmark.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <Bot className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-xs text-white/60">AI Assist</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <p className="text-xs text-white/60">Automation</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <Layers className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-xs text-white/60">Multi-Tab</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : getFrameBustingSite(activeTab.url) ? (
              // Frame-busting site warning
              <div className="w-full max-w-lg mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <Globe className="w-10 h-10 text-amber-400" />
                  </div>

                  <h2 className="text-2xl font-bold mb-2">
                    {getFrameBustingSite(activeTab.url)?.name} blocks embedding
                  </h2>
                  <p className="text-white/60 mb-6 max-w-md mx-auto">
                    This site uses security measures that prevent it from being displayed in an embedded browser.
                    {getFrameBustingSite(activeTab.url)?.suggestion && (
                      <span className="block mt-2 text-amber-400/80">
                        Tip: {getFrameBustingSite(activeTab.url)?.suggestion}
                      </span>
                    )}
                  </p>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={goHome}
                      className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
                    >
                      Go Home
                    </button>
                    <button
                      onClick={openExternal}
                      className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in External Browser
                    </button>
                  </div>

                  <div className="mt-8 p-4 bg-white/5 rounded-xl text-left">
                    <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Current URL</p>
                    <p className="text-sm text-white/80 break-all font-mono">{activeTab.url}</p>
                  </div>
                </motion.div>
              </div>
            ) : (
              // Browser iframe
              <div
                className={`relative bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${deviceMode === 'desktop' ? 'w-full h-full' : ''
                  }`}
                style={{
                  width: deviceMode !== 'desktop' ? DEVICE_CONFIGS[deviceMode].width : undefined,
                  height: deviceMode !== 'desktop' ? DEVICE_CONFIGS[deviceMode].height : undefined,
                  maxWidth: '100%',
                  maxHeight: '100%',
                  overscrollBehavior: 'contain',
                }}
              >
                {/* Device frame for mobile/tablet */}
                {deviceMode !== 'desktop' && (
                  <div className="absolute inset-0 pointer-events-none z-10 border-[12px] border-zinc-800 rounded-[24px]" />
                )}

                {/* Loading overlay */}
                {activeTab.isLoading && (
                  <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center z-20">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-white/60">Loading...</p>
                    </div>
                  </div>
                )}

                {/* Inspect overlay */}
                {viewMode === 'inspect' && (
                  <div className="absolute inset-0 bg-blue-500/10 pointer-events-none z-30 flex items-center justify-center">
                    <div className="bg-black/80 rounded-lg px-4 py-2 text-sm">
                      <ScanLine className="w-4 h-4 inline mr-2" />
                      Inspect mode - hover to select elements
                    </div>
                  </div>
                )}

                {/* Error state */}
                {loadError && (
                  <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center z-20">
                    <div className="text-center max-w-md p-6">
                      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-8 h-8 text-red-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Unable to load page</h3>
                      <p className="text-sm text-white/60 mb-4">{loadError}</p>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setLoadError(null);
                            refresh();
                          }}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                        >
                          Try Again
                        </button>
                        <button
                          onClick={openExternal}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open in Browser
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={getProxyUrl(activeTab.url)}
                  onLoad={handleIframeLoad}
                  onError={() => setLoadError('Failed to load this page. The site may be blocking embedded views.')}
                  className="w-full h-full border-0"
                  style={{ overscrollBehavior: 'contain' }}
                  title="Browser"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Side Panel */}
          <AnimatePresence>
            {panelView !== 'none' && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: panelWidth, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex-shrink-0 bg-zinc-900/80 border-l border-white/10 overflow-hidden"
              >
                <div style={{ width: panelWidth }} className="h-full flex flex-col">
                  {/* Bookmarks Panel */}
                  {panelView === 'bookmarks' && (
                    <div className="h-full flex flex-col">
                      <div className="p-3 border-b border-white/10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Bookmark className="w-4 h-4 text-yellow-400" />
                            Bookmarks
                          </h3>
                          <button
                            onClick={() => setPanelView('none')}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Folder tabs */}
                        <div className="flex gap-1 mt-3 overflow-x-auto scrollbar-hide">
                          {BOOKMARK_FOLDERS.map((folder) => (
                            <button
                              key={folder}
                              onClick={() => setSelectedBookmarkFolder(folder)}
                              className={`px-2 py-1 rounded-lg text-xs whitespace-nowrap transition-colors ${selectedBookmarkFolder === folder
                                ? 'bg-white/20 text-white'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                            >
                              {folder}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-2">
                        {filteredBookmarks.length === 0 ? (
                          <p className="text-sm text-white/40 text-center py-8">
                            No bookmarks in this folder
                          </p>
                        ) : (
                          <div className="space-y-1">
                            {filteredBookmarks.map((bookmark) => (
                              <div
                                key={bookmark.id}
                                className="group flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                              >
                                <button
                                  onClick={() => navigateTo(bookmark.url)}
                                  className="flex-1 flex items-center gap-2 min-w-0 text-left"
                                >
                                  <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-sm truncate">{bookmark.title}</p>
                                    <p className="text-xs text-white/40 truncate">
                                      {new URL(bookmark.url).hostname}
                                    </p>
                                  </div>
                                </button>
                                <button
                                  onClick={() => deleteBookmark(bookmark.id)}
                                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded transition-all"
                                >
                                  <X className="w-3 h-3 text-white/40" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* History Panel */}
                  {panelView === 'history' && (
                    <div className="h-full flex flex-col">
                      <div className="p-3 border-b border-white/10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            History
                          </h3>
                          <div className="flex items-center gap-1">
                            {history.length > 0 && (
                              <button
                                onClick={clearHistory}
                                className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Clear history"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setPanelView('none')}
                              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-2">
                        {history.length === 0 ? (
                          <p className="text-sm text-white/40 text-center py-8">
                            No history yet
                          </p>
                        ) : (
                          <div className="space-y-1">
                            {history.map((item) => (
                              <div
                                key={item.id}
                                className="group flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                              >
                                <button
                                  onClick={() => navigateTo(item.url)}
                                  className="flex-1 flex items-center gap-2 min-w-0 text-left"
                                >
                                  <Clock className="w-4 h-4 text-white/40 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-sm truncate">{item.title}</p>
                                    <p className="text-xs text-white/40">
                                      {new Date(item.visitedAt).toLocaleString()}
                                    </p>
                                  </div>
                                </button>
                                <button
                                  onClick={() => deleteHistoryItem(item.id)}
                                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded transition-all"
                                >
                                  <X className="w-3 h-3 text-white/40" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* AI Assist Panel */}
                  {panelView === 'ai-assist' && (
                    <AIAssistPanel
                      url={activeTab.url}
                      onNavigate={navigateTo}
                      onAction={handleAIAction}
                    />
                  )}

                  {/* Automation Panel */}
                  {panelView === 'automation' && (
                    <AutomationPanel
                      steps={automationSteps}
                      onAddStep={addAutomationStep}
                      onRemoveStep={removeAutomationStep}
                      onRunAutomation={runAutomation}
                      isRunning={isAutomationRunning}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}

export default EmbeddedBrowser;
