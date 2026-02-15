'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Settings, User, Folder, File, Image, Music2, Video, Power,
  Monitor, Wifi, Volume2, Battery, ChevronRight, ChevronDown, MoreHorizontal,
  MessageSquare, Phone, Users, Calendar, Paperclip, Send, Smile, AtSign,
  Code, Play, Bug, GitBranch, FileCode, Terminal, Sparkles, Copy, Check,
  Mail, Clock, Star, Archive, Trash2, Plus, Filter
} from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { BrandColorSwatch } from '@/components/design/BrandColorSwatch';
import { MicrosoftChart } from '@/components/design/ChartShowcase';

// Microsoft brand colors
const msColors = {
  blue: '#0078D4',
  lightBlue: '#50E6FF',
  green: '#107C10',
  yellow: '#FFB900',
  red: '#D13438',
  purple: '#881798',
  orange: '#FF8C00',
  teams: '#6264A7',
  vscode: '#007ACC',
};

// ============================================================================
// Windows 11 Start Menu
// ============================================================================
function Windows11StartMenu() {
  const [searchQuery, setSearchQuery] = useState('');

  const pinnedApps = [
    { name: 'Edge', color: msColors.blue },
    { name: 'Word', color: '#2B579A' },
    { name: 'Excel', color: '#217346' },
    { name: 'PowerPoint', color: '#B7472A' },
    { name: 'Outlook', color: '#0078D4' },
    { name: 'Teams', color: msColors.teams },
    { name: 'OneNote', color: '#7719AA' },
    { name: 'OneDrive', color: '#0078D4' },
    { name: 'Photos', color: '#FFB900' },
    { name: 'Settings', color: '#6B6B6B' },
    { name: 'VS Code', color: msColors.vscode },
    { name: 'Terminal', color: '#4D4D4D' },
  ];

  const recommendedFiles = [
    { name: 'Q4 Report.xlsx', app: 'Excel', time: '2 hours ago' },
    { name: 'Presentation.pptx', app: 'PowerPoint', time: 'Yesterday' },
    { name: 'Meeting Notes.docx', app: 'Word', time: 'Yesterday' },
  ];

  return (
    <div
      className="w-full max-w-xl mx-auto rounded-lg overflow-hidden shadow-2xl"
      style={{
        backgroundColor: 'hsla(var(--theme-card) / 0.95)',
        backdropFilter: 'blur(40px)',
        border: '1px solid hsla(var(--theme-border) / 0.5)',
      }}
    >
      {/* Search Bar */}
      <div className="p-4 pb-0">
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-full"
          style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
        >
          <Search className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for apps, settings, and documents"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          />
        </div>
      </div>

      {/* Pinned Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Pinned
          </span>
          <button
            className="text-xs px-2 py-1 rounded hover:bg-black/5"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            All apps &gt;
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {pinnedApps.map((app, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: app.color }}
              >
                {app.name[0]}
              </div>
              <span
                className="text-[10px] text-center truncate w-full"
                style={{ color: 'hsl(var(--theme-foreground))' }}
              >
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Recommended
          </span>
          <button
            className="text-xs px-2 py-1 rounded hover:bg-black/5"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            More &gt;
          </button>
        </div>
        <div className="space-y-1">
          {recommendedFiles.map((file, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors"
            >
              <div
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
              >
                <File className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                  {file.name}
                </div>
                <div className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  {file.time}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* User & Power */}
      <div
        className="flex items-center justify-between px-4 py-3 border-t"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: msColors.blue }}
          >
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
            OpenClaw-OS
          </span>
        </button>
        <button className="p-2 rounded-lg hover:bg-black/5">
          <Power className="w-5 h-5" style={{ color: 'hsl(var(--theme-foreground))' }} />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Microsoft Teams Chat
// ============================================================================
function TeamsChat() {
  const [message, setMessage] = useState('');

  const conversations = [
    { name: 'Design Team', lastMessage: 'Great work on the mockups!', time: '10:30 AM', unread: 2 },
    { name: 'Project Alpha', lastMessage: 'Meeting moved to 3 PM', time: '9:15 AM', unread: 0 },
    { name: 'Sarah Chen', lastMessage: 'Thanks for the review', time: 'Yesterday', unread: 0 },
  ];

  const messages = [
    { id: 1, user: 'Sarah Chen', text: 'Hey team! Just pushed the latest designs', time: '10:28 AM', isMine: false },
    { id: 2, user: 'You', text: 'Looking great! Love the new color scheme', time: '10:30 AM', isMine: true },
    { id: 3, user: 'Mike Johnson', text: 'Agreed! The Fluent components are perfect', time: '10:31 AM', isMine: false },
  ];

  return (
    <div
      className="w-full rounded-lg overflow-hidden shadow-lg"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        border: '1px solid hsl(var(--theme-border))',
      }}
    >
      <div className="flex" style={{ height: '400px' }}>
        {/* Sidebar */}
        <div
          className="w-72 border-r flex flex-col"
          style={{ borderColor: 'hsl(var(--theme-border))' }}
        >
          {/* Teams Header */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ borderColor: 'hsl(var(--theme-border))' }}
          >
            <MessageSquare className="w-5 h-5" style={{ color: msColors.teams }} />
            <span className="font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Chat
            </span>
          </div>

          {/* Search */}
          <div className="p-3">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-md"
              style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
            >
              <Search className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
              <span className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                Search
              </span>
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv, i) => (
              <button
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  i === 0 ? 'bg-blue-500/10' : 'hover:bg-black/5'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: msColors.teams }}
                >
                  {conv.name[0]}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate" style={{ color: 'hsl(var(--theme-foreground))' }}>
                      {conv.name}
                    </span>
                    <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      {conv.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs truncate" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      {conv.lastMessage}
                    </span>
                    {conv.unread > 0 && (
                      <span
                        className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center text-white"
                        style={{ backgroundColor: msColors.teams }}
                      >
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'hsl(var(--theme-border))' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                style={{ backgroundColor: msColors.teams }}
              >
                D
              </div>
              <div>
                <div className="font-medium text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                  Design Team
                </div>
                <div className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  3 members
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded hover:bg-black/5">
                <Phone className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
              </button>
              <button className="p-2 rounded hover:bg-black/5">
                <Video className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[80%] ${msg.isMine ? 'flex-row-reverse' : ''}`}>
                  {!msg.isMine && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                      style={{ backgroundColor: msColors.teams }}
                    >
                      {msg.user[0]}
                    </div>
                  )}
                  <div>
                    {!msg.isMine && (
                      <div className="text-xs mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                        {msg.user}
                      </div>
                    )}
                    <div
                      className="px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: msg.isMine ? msColors.teams : 'hsl(var(--theme-secondary))',
                        color: msg.isMine ? 'white' : 'hsl(var(--theme-foreground))',
                      }}
                    >
                      {msg.text}
                    </div>
                    <div className="text-[10px] mt-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
            >
              <button className="p-1">
                <Smile className="w-5 h-5" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a new message"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: 'hsl(var(--theme-foreground))' }}
              />
              <button className="p-1">
                <Paperclip className="w-5 h-5" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
              </button>
              <button
                className="p-2 rounded"
                style={{ backgroundColor: message ? msColors.teams : 'transparent' }}
              >
                <Send className="w-4 h-4" style={{ color: message ? 'white' : 'hsl(var(--theme-muted-foreground))' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VS Code Editor
// ============================================================================
function VSCodeEditor() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['App.tsx', 'styles.css', 'index.html'];

  const codeLines = [
    { num: 1, content: "import React from 'react';", color: 'hsl(var(--theme-muted-foreground))' },
    { num: 2, content: '', color: '' },
    { num: 3, content: 'export default function App() {', color: 'hsl(var(--theme-foreground))' },
    { num: 4, content: '  const [count, setCount] = useState(0);', color: 'hsl(var(--theme-foreground))' },
    { num: 5, content: '', color: '' },
    { num: 6, content: '  return (', color: 'hsl(var(--theme-foreground))' },
    { num: 7, content: '    <div className="container">', color: '#4EC9B0' },
    { num: 8, content: '      <h1>Hello Fluent!</h1>', color: '#4EC9B0' },
    { num: 9, content: '      <button onClick={() => setCount(c => c + 1)}>', color: '#4EC9B0' },
    { num: 10, content: '        Count: {count}', color: '#CE9178' },
    { num: 11, content: '      </button>', color: '#4EC9B0' },
    { num: 12, content: '    </div>', color: '#4EC9B0' },
    { num: 13, content: '  );', color: 'hsl(var(--theme-foreground))' },
    { num: 14, content: '}', color: 'hsl(var(--theme-foreground))' },
  ];

  return (
    <div
      className="w-full rounded-lg overflow-hidden shadow-lg"
      style={{
        backgroundColor: '#1e1e1e',
        border: '1px solid #333',
      }}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#323233]">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-gray-300">Visual Studio Code</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div className="w-3 h-3 rounded-full bg-red-500" />
        </div>
      </div>

      <div className="flex" style={{ height: '350px' }}>
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-2 gap-4">
          {[FileCode, Search, GitBranch, Bug, Play].map((Icon, i) => (
            <button
              key={i}
              className={`p-2 rounded ${i === 0 ? 'bg-white/10' : ''}`}
            >
              <Icon className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>

        {/* Explorer */}
        <div className="w-48 bg-[#252526] border-r border-[#333]">
          <div className="px-3 py-2 text-xs text-gray-400 uppercase tracking-wider">
            Explorer
          </div>
          <div className="px-2">
            <button className="flex items-center gap-1 px-2 py-1 w-full text-left text-gray-300 text-sm">
              <ChevronDown className="w-4 h-4" />
              <Folder className="w-4 h-4 text-yellow-500" />
              <span>src</span>
            </button>
            {tabs.map((file, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-1 px-6 py-1 w-full text-left text-sm ${
                  activeTab === i ? 'bg-[#37373d]' : ''
                }`}
              >
                <FileCode className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">{file}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex bg-[#252526]">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-4 py-2 text-sm ${
                  activeTab === i
                    ? 'bg-[#1e1e1e] text-white border-t border-t-blue-500'
                    : 'text-gray-400'
                }`}
              >
                <FileCode className="w-4 h-4" />
                {tab}
              </button>
            ))}
          </div>

          {/* Code */}
          <div className="flex-1 p-2 font-mono text-sm overflow-y-auto">
            {codeLines.map((line) => (
              <div key={line.num} className="flex hover:bg-[#2a2d2e]">
                <span className="w-8 text-right text-gray-500 mr-4 select-none">
                  {line.num}
                </span>
                <span style={{ color: line.color || 'inherit' }}>
                  {line.content}
                </span>
              </div>
            ))}
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between px-2 py-1 bg-[#007ACC] text-white text-xs">
            <div className="flex items-center gap-3">
              <span>main</span>
              <span>TypeScript React</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Ln 7, Col 12</span>
              <span>UTF-8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Microsoft Copilot Interface
// ============================================================================
function CopilotInterface() {
  const [query, setQuery] = useState('');

  const suggestions = [
    'Create a presentation about climate change',
    'Summarize my latest emails',
    'Generate a weekly schedule',
    'Help me write a project proposal',
  ];

  return (
    <div
      className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-lg"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        border: '1px solid hsl(var(--theme-border))',
      }}
    >
      {/* Header */}
      <div className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #0078D4 0%, #50E6FF 100%)',
            }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Microsoft Copilot
        </h2>
        <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Your everyday AI companion
        </p>
      </div>

      {/* Suggestions */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              className="p-3 rounded-lg text-left text-sm transition-colors hover:bg-black/5"
              style={{
                backgroundColor: 'hsl(var(--theme-secondary))',
                color: 'hsl(var(--theme-foreground))',
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-full"
          style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          />
          <button
            className="p-2 rounded-full transition-colors"
            style={{
              backgroundColor: query ? msColors.blue : 'transparent',
            }}
          >
            <Send
              className="w-4 h-4"
              style={{ color: query ? 'white' : 'hsl(var(--theme-muted-foreground))' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Fluent Component Library
// ============================================================================
function FluentComponentLibrary() {
  const [selectedPivot, setSelectedPivot] = useState('Overview');
  const pivots = ['Overview', 'Analytics', 'Settings'];
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Buttons */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Buttons
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-5 py-2 rounded text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: msColors.blue }}
          >
            Primary
          </button>
          <button
            className="px-5 py-2 rounded text-sm font-medium border transition-all hover:bg-black/5"
            style={{
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-foreground))',
            }}
          >
            Secondary
          </button>
          <button
            className="px-5 py-2 rounded text-sm font-medium transition-all hover:bg-black/5"
            style={{ color: msColors.blue }}
          >
            Text
          </button>
          <button
            className="px-5 py-2 rounded text-sm font-medium text-white"
            style={{ backgroundColor: msColors.red }}
          >
            Danger
          </button>
        </div>
      </div>

      {/* Pivot (Tabs) */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Pivot (Tabs)
        </h4>
        <div className="flex border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
          {pivots.map((pivot) => (
            <button
              key={pivot}
              onClick={() => setSelectedPivot(pivot)}
              className="px-4 py-2 text-sm font-medium relative"
              style={{
                color: selectedPivot === pivot ? msColors.blue : 'hsl(var(--theme-muted-foreground))',
              }}
            >
              {pivot}
              {selectedPivot === pivot && (
                <motion.div
                  layoutId="pivot-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: msColors.blue }}
                />
              )}
            </button>
          ))}
        </div>
        <div
          className="p-4 rounded-b-lg"
          style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
        >
          <p className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Content for {selectedPivot}
          </p>
        </div>
      </div>

      {/* Command Bar */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Command Bar
        </h4>
        <div
          className="flex items-center gap-1 p-1 rounded border"
          style={{ borderColor: 'hsl(var(--theme-border))' }}
        >
          {[
            { icon: Plus, label: 'New' },
            { icon: Copy, label: 'Copy' },
            { icon: Trash2, label: 'Delete' },
          ].map((cmd, i) => (
            <button
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-black/5"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              <cmd.icon className="w-4 h-4" />
              {cmd.label}
            </button>
          ))}
          <div className="w-px h-6 mx-1" style={{ backgroundColor: 'hsl(var(--theme-border))' }} />
          <button className="p-2 rounded hover:bg-black/5">
            <MoreHorizontal className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
          </button>
        </div>
      </div>

      {/* Message Bar */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Message Bar
        </h4>
        <div className="space-y-2">
          {[
            { type: 'info', color: msColors.blue, text: 'This is an informational message.' },
            { type: 'success', color: msColors.green, text: 'Operation completed successfully!' },
            { type: 'warning', color: msColors.yellow, text: 'Please review before continuing.' },
            { type: 'error', color: msColors.red, text: 'An error occurred. Please try again.' },
          ].map((msg, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded"
              style={{ backgroundColor: `${msg.color}15` }}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: msg.color }}
              />
              <span className="text-sm flex-1" style={{ color: 'hsl(var(--theme-foreground))' }}>
                {msg.text}
              </span>
              <button className="p-1">
                <Plus className="w-4 h-4 rotate-45" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Persona */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Persona
        </h4>
        <div className="flex items-center gap-6">
          {[
            { size: 'w-8 h-8 text-xs', name: 'JS' },
            { size: 'w-10 h-10 text-sm', name: 'JS' },
            { size: 'w-12 h-12 text-base', name: 'JS' },
            { size: 'w-16 h-16 text-lg', name: 'JS' },
          ].map((persona, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`${persona.size} rounded-full flex items-center justify-center text-white font-medium`}
                style={{ backgroundColor: msColors.blue }}
              >
                {persona.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================
export default function MicrosoftPage() {
  return (
    <ProductPageLayout
      theme="microsoft"
      targetUser="professionals who work across devices and platforms"
      problemStatement="Enterprise software doesn&apos;t have to feel enterprise."
      problemContext="Microsoft serves the world&apos;s largest organizations while also delighting individual creators. Fluent Design System evolved to unify Windows, web, and mobile experiences under a single, coherent language. Material layers, subtle depth, and purposeful motion create interfaces that feel both powerful and approachable."
      insight="Great productivity software disappears into the work. Fluent Design uses Mica backgrounds, reveal highlights, and spatial depth to create focus without distraction. Every element earns its place."
      tradeoffs={['Productivity over novelty', 'Accessibility over aesthetics', 'Consistency over platform-native']}
      appName="Windows 11 Start"
      appDescription="Your personalized gateway to apps and files"
      showToolbar={true}
      themeLabel="Microsoft"
      onReferenceToAI={(prompt) => { if (typeof window !== 'undefined') { sessionStorage.setItem('openclaw_theme_reference', prompt); sessionStorage.setItem('openclaw_theme_reference_timestamp', Date.now().toString()); } }}
      principles={[
        {
          title: 'Light',
          description: 'Fluent experiences use light to illuminate. Reveal highlights show interactive boundaries on hover.',
        },
        {
          title: 'Depth',
          description: 'Layered surfaces with Mica and Acrylic materials create visual hierarchy and spatial understanding.',
        },
        {
          title: 'Motion',
          description: 'Connected, purposeful animations that guide attention and provide feedback. Never gratuitous.',
        },
        {
          title: 'Material',
          description: 'Translucent textures and smooth surfaces evoke physical materials while remaining distinctly digital.',
        },
      ]}
      quote={{
        text: 'Fluent Design is our open design system that connects the digital and physical worlds.',
        author: 'Microsoft Design',
      }}
    >
      {/* Windows 11 Start Menu */}
      <Windows11StartMenu />

      {/* Teams */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Microsoft Teams
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Real-time collaboration with chat, video, and file sharing.
        </p>
        <TeamsChat />
      </div>

      {/* VS Code */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Visual Studio Code
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          The most popular code editor, with Fluent-inspired dark interface.
        </p>
        <VSCodeEditor />
      </div>

      {/* Copilot */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Microsoft Copilot
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          AI-powered assistant integrated across Microsoft 365.
        </p>
        <CopilotInterface />
      </div>

      {/* Component Library */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Fluent UI Component Library
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Core components following Fluent Design System specifications.
        </p>
        <FluentComponentLibrary />
      </div>

      {/* Data Visualization */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Power BI Inspired
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Data visualization following Microsoft's analytics design language.
        </p>
        <MicrosoftChart />
      </div>

      {/* Colors */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Microsoft Brand Colors
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          The Fluent color system. Click to copy hex values.
        </p>
        <BrandColorSwatch colors={msColors} columns={5} />
      </div>

    </ProductPageLayout>
  );
}
