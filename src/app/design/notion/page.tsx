'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronDown, Plus, Search, Clock, Star, Settings,
  FileText, Hash, Calendar, Layout, List, Table, MoreHorizontal,
  Grip, Bold, Italic, Underline, Strikethrough, Link, Code, Type,
  ArrowUpDown, Filter, Users, MessageSquare, Sparkles, Send,
  Check, Image, Quote, ListOrdered, ToggleLeft, AlertCircle, Layers
} from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { BrandColorSwatch } from '@/components/design/BrandColorSwatch';
import { NotionChart } from '@/components/design/ChartShowcase';

// Notion brand colors
const notionColors = {
  default: '#37352F',
  gray: '#9B9A97',
  brown: '#64473A',
  orange: '#D9730D',
  yellow: '#DFAB01',
  green: '#0F7B6C',
  blue: '#0B6E99',
  purple: '#6940A5',
  pink: '#AD1A72',
  red: '#E03E3E',
};

// ============================================================================
// Notion Sidebar
// ============================================================================
function NotionSidebar() {
  const [expanded, setExpanded] = useState<string[]>(['workspace']);

  const toggleExpand = (id: string) => {
    setExpanded(expanded.includes(id)
      ? expanded.filter(e => e !== id)
      : [...expanded, id]
    );
  };

  const workspaceItems = [
    { id: 'search', icon: Search, label: 'Search', shortcut: '⌘K' },
    { id: 'updates', icon: Clock, label: 'Updates' },
    { id: 'settings', icon: Settings, label: 'Settings & members' },
  ];

  const favoritePages = [
    { id: 'roadmap', icon: '🗺️', label: 'Product Roadmap' },
    { id: 'notes', icon: '📝', label: 'Meeting Notes' },
    { id: 'wiki', icon: '📚', label: 'Team Wiki' },
  ];

  const privatePages = [
    { id: 'journal', icon: '📓', label: 'Personal Journal' },
    { id: 'reading', icon: '📖', label: 'Reading List' },
    { id: 'ideas', icon: '💡', label: 'Ideas' },
  ];

  return (
    <div
      className="w-64 h-96 flex flex-col text-sm rounded-lg overflow-hidden border"
      style={{
        backgroundColor: '#FBFBFA',
        borderColor: 'hsl(var(--theme-border))',
        color: notionColors.default,
      }}
    >
      {/* Workspace Header */}
      <div className="px-3 py-2 flex items-center gap-2 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
          J
        </div>
        <span className="font-medium flex-1">User&apos;s Workspace</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      {/* Quick Actions */}
      <div className="px-1 py-2 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        {workspaceItems.map(item => (
          <button
            key={item.id}
            className="w-full flex items-center gap-2 px-2 py-1 rounded hover:bg-black/5 transition-colors"
          >
            <item.icon className="w-4 h-4 text-gray-500" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.shortcut && (
              <span className="text-xs text-gray-400">{item.shortcut}</span>
            )}
          </button>
        ))}
      </div>

      {/* Favorites */}
      <div className="px-1 py-2 flex-1 overflow-y-auto">
        <button
          onClick={() => toggleExpand('favorites')}
          className="w-full flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
        >
          <ChevronRight className={`w-3 h-3 transition-transform ${expanded.includes('favorites') ? 'rotate-90' : ''}`} />
          <span>Favorites</span>
        </button>
        <AnimatePresence>
          {expanded.includes('favorites') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {favoritePages.map(page => (
                <button
                  key={page.id}
                  className="w-full flex items-center gap-2 px-2 py-1 rounded hover:bg-black/5 transition-colors ml-2"
                >
                  <span>{page.icon}</span>
                  <span className="truncate">{page.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Private */}
        <button
          onClick={() => toggleExpand('private')}
          className="w-full flex items-center gap-1 px-2 py-1 mt-2 text-xs text-gray-500 hover:text-gray-700"
        >
          <ChevronRight className={`w-3 h-3 transition-transform ${expanded.includes('private') ? 'rotate-90' : ''}`} />
          <span>Private</span>
        </button>
        <AnimatePresence>
          {expanded.includes('private') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {privatePages.map(page => (
                <button
                  key={page.id}
                  className="w-full flex items-center gap-2 px-2 py-1 rounded hover:bg-black/5 transition-colors ml-2"
                >
                  <span>{page.icon}</span>
                  <span className="truncate">{page.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Page */}
      <div className="px-2 py-2 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-black/5 transition-colors text-gray-500">
          <Plus className="w-4 h-4" />
          <span>New page</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Notion Page with Blocks
// ============================================================================
function NotionPageBlocks() {
  const [showSlashMenu, setShowSlashMenu] = useState(false);

  const blocks = [
    { type: 'heading1', content: 'Project Planning' },
    { type: 'text', content: 'This page documents the key milestones and deliverables for Q1 2026.' },
    { type: 'heading2', content: 'Overview' },
    { type: 'text', content: 'Our team is focused on shipping three major features this quarter:' },
    { type: 'bulleted', items: ['Authentication overhaul', 'Real-time collaboration', 'Mobile app launch'] },
    { type: 'callout', emoji: '💡', content: 'Tip: Use the slash command to add different block types!' },
    { type: 'toggle', title: 'Technical Details', content: 'Architecture decisions, API specs, and implementation notes live here.' },
    { type: 'divider' },
    { type: 'text', content: 'Type / for commands...' },
  ];

  const slashMenuItems = [
    { icon: Type, label: 'Text', description: 'Just start writing with plain text.' },
    { icon: Hash, label: 'Heading 1', description: 'Big section heading.' },
    { icon: List, label: 'Bulleted list', description: 'Create a simple bulleted list.' },
    { icon: ListOrdered, label: 'Numbered list', description: 'Create a numbered list.' },
    { icon: ToggleLeft, label: 'Toggle', description: 'Toggles can hide and show content.' },
    { icon: Quote, label: 'Quote', description: 'Capture a quote.' },
    { icon: AlertCircle, label: 'Callout', description: 'Make writing stand out.' },
    { icon: Code, label: 'Code', description: 'Capture a code snippet.' },
    { icon: Image, label: 'Image', description: 'Upload or embed with a link.' },
  ];

  return (
    <div
      className="max-w-2xl mx-auto rounded-lg border overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: 'hsl(var(--theme-border))',
      }}
    >
      {/* Page Header */}
      <div className="px-12 pt-16 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">📋</span>
          <button className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            Add comment
          </button>
        </div>
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: notionColors.default }}
        >
          Project Planning
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Last edited Jan 17</span>
          <span>•</span>
          <span>Created by User</span>
        </div>
      </div>

      {/* Blocks */}
      <div className="px-12 pb-16 space-y-1">
        {blocks.map((block, i) => (
          <div key={i} className="group relative flex items-start gap-2 py-1">
            {/* Drag Handle */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 -ml-6 pt-0.5">
              <button className="p-0.5 hover:bg-gray-100 rounded">
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-0.5 hover:bg-gray-100 rounded cursor-grab">
                <Grip className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Block Content */}
            <div className="flex-1">
              {block.type === 'heading1' && (
                <h1 className="text-3xl font-bold" style={{ color: notionColors.default }}>
                  {block.content}
                </h1>
              )}
              {block.type === 'heading2' && (
                <h2 className="text-2xl font-semibold mt-4" style={{ color: notionColors.default }}>
                  {block.content}
                </h2>
              )}
              {block.type === 'text' && (
                <p style={{ color: notionColors.default }}>
                  {block.content === 'Type / for commands...' ? (
                    <span
                      className="text-gray-400 cursor-text"
                      onClick={() => setShowSlashMenu(true)}
                    >
                      {block.content}
                    </span>
                  ) : block.content}
                </p>
              )}
              {block.type === 'bulleted' && (
                <ul className="space-y-1" style={{ color: notionColors.default }}>
                  {block.items?.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="mt-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {block.type === 'callout' && (
                <div
                  className="flex items-start gap-3 p-4 rounded"
                  style={{ backgroundColor: '#F1F1EF' }}
                >
                  <span className="text-xl">{block.emoji}</span>
                  <p style={{ color: notionColors.default }}>{block.content}</p>
                </div>
              )}
              {block.type === 'toggle' && (
                <details className="group/toggle">
                  <summary
                    className="flex items-center gap-2 cursor-pointer list-none"
                    style={{ color: notionColors.default }}
                  >
                    <ChevronRight className="w-4 h-4 transition-transform group-open/toggle:rotate-90" />
                    <span className="font-medium">{block.title}</span>
                  </summary>
                  <div className="pl-6 pt-2 text-gray-600">{block.content}</div>
                </details>
              )}
              {block.type === 'divider' && (
                <hr className="my-4 border-gray-200" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Slash Menu */}
      <AnimatePresence>
        {showSlashMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute mx-12 w-80 rounded-lg border shadow-lg z-10"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: 'hsl(var(--theme-border))',
            }}
          >
            <div className="p-2 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              <input
                type="text"
                placeholder="Search for a block type"
                className="w-full px-2 py-1 text-sm bg-transparent outline-none"
                autoFocus
                onBlur={() => setTimeout(() => setShowSlashMenu(false), 150)}
              />
            </div>
            <div className="p-2 max-h-60 overflow-y-auto">
              <div className="text-xs text-gray-500 px-2 py-1 mb-1">BASIC BLOCKS</div>
              {slashMenuItems.map((item, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded border flex items-center justify-center" style={{ borderColor: 'hsl(var(--theme-border))' }}>
                    <item.icon className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: notionColors.default }}>{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Notion Database Table
// ============================================================================
function NotionDatabaseTable() {
  const [sortBy, setSortBy] = useState<string | null>(null);

  const columns = [
    { id: 'name', label: 'Name', type: 'title' },
    { id: 'status', label: 'Status', type: 'select' },
    { id: 'assignee', label: 'Assignee', type: 'person' },
    { id: 'priority', label: 'Priority', type: 'select' },
    { id: 'due', label: 'Due Date', type: 'date' },
  ];

  const rows = [
    { id: '1', name: 'Design system documentation', status: 'In Progress', statusColor: notionColors.yellow, assignee: 'User', priority: 'High', priorityColor: notionColors.red, due: 'Jan 20' },
    { id: '2', name: 'API integration', status: 'Done', statusColor: notionColors.green, assignee: 'Sarah', priority: 'High', priorityColor: notionColors.red, due: 'Jan 15' },
    { id: '3', name: 'User testing sessions', status: 'Not Started', statusColor: notionColors.gray, assignee: 'Mike', priority: 'Medium', priorityColor: notionColors.orange, due: 'Jan 25' },
    { id: '4', name: 'Performance optimization', status: 'In Progress', statusColor: notionColors.yellow, assignee: 'User', priority: 'Low', priorityColor: notionColors.blue, due: 'Jan 30' },
    { id: '5', name: 'Mobile responsive fixes', status: 'In Review', statusColor: notionColors.purple, assignee: 'Sarah', priority: 'Medium', priorityColor: notionColors.orange, due: 'Jan 22' },
  ];

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: 'hsl(var(--theme-border))',
      }}
    >
      {/* Database Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h3 className="font-semibold" style={{ color: notionColors.default }}>Sprint Tasks</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-gray-100 text-gray-600">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-gray-100 text-gray-600">
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="px-4 py-2 border-b flex items-center gap-4" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <button className="flex items-center gap-1 px-2 py-1 text-sm rounded bg-gray-100 text-gray-800">
          <Table className="w-4 h-4" />
          Table
        </button>
        <button className="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-gray-100 text-gray-500">
          <Layout className="w-4 h-4" />
          Board
        </button>
        <button className="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-gray-100 text-gray-500">
          <Calendar className="w-4 h-4" />
          Calendar
        </button>
        <button className="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-gray-100 text-gray-500">
          <List className="w-4 h-4" />
          List
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              {columns.map(col => (
                <th
                  key={col.id}
                  className="text-left px-4 py-2 font-medium text-gray-500 cursor-pointer hover:bg-gray-50"
                  onClick={() => setSortBy(col.id)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortBy === col.id && <ArrowUpDown className="w-3 h-3" />}
                  </div>
                </th>
              ))}
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr
                key={row.id}
                className="border-b hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'hsl(var(--theme-border))' }}
              >
                <td className="px-4 py-2" style={{ color: notionColors.default }}>
                  <FileText className="w-4 h-4 inline mr-2 text-gray-400" />
                  {row.name}
                </td>
                <td className="px-4 py-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: `${row.statusColor}20`,
                      color: row.statusColor,
                    }}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                    <span style={{ color: notionColors.default }}>{row.assignee}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: `${row.priorityColor}20`,
                      color: row.priorityColor,
                    }}
                  >
                    {row.priority}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-500">{row.due}</td>
                <td className="px-2">
                  <button className="p-1 rounded hover:bg-gray-100">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Row Button */}
      <button className="w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 flex items-center gap-2 transition-colors">
        <Plus className="w-4 h-4" />
        New
      </button>
    </div>
  );
}

// ============================================================================
// Notion Kanban Board
// ============================================================================
function NotionKanbanBoard() {
  const columns: {
    id: string;
    title: string;
    color: string;
    cards: { id: string; title: string; priority: string; assignee?: string }[];
  }[] = [
    {
      id: 'backlog',
      title: 'Backlog',
      color: notionColors.gray,
      cards: [
        { id: '1', title: 'Research competitor features', priority: 'Low' },
        { id: '2', title: 'Draft marketing copy', priority: 'Medium' },
      ],
    },
    {
      id: 'todo',
      title: 'To Do',
      color: notionColors.blue,
      cards: [
        { id: '3', title: 'Implement auth flow', priority: 'High' },
        { id: '4', title: 'Design onboarding screens', priority: 'High' },
      ],
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      color: notionColors.yellow,
      cards: [
        { id: '5', title: 'Build component library', priority: 'High', assignee: 'User' },
      ],
    },
    {
      id: 'review',
      title: 'In Review',
      color: notionColors.purple,
      cards: [
        { id: '6', title: 'API documentation', priority: 'Medium', assignee: 'Sarah' },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: notionColors.green,
      cards: [
        { id: '7', title: 'Project kickoff', priority: 'High' },
        { id: '8', title: 'Initial wireframes', priority: 'High' },
      ],
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return notionColors.red;
      case 'Medium': return notionColors.orange;
      default: return notionColors.blue;
    }
  };

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: 'hsl(var(--theme-border))',
      }}
    >
      {/* Board Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">📋</span>
          <h3 className="font-semibold" style={{ color: notionColors.default }}>Project Board</h3>
        </div>
        <button className="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-gray-100 text-gray-600">
          <Layers className="w-4 h-4" />
          Group by Status
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="flex gap-3 p-4 overflow-x-auto" style={{ backgroundColor: '#F7F6F3' }}>
        {columns.map(column => (
          <div key={column.id} className="flex-shrink-0 w-64">
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: column.color }}
              />
              <span className="text-sm font-medium" style={{ color: notionColors.default }}>
                {column.title}
              </span>
              <span className="text-xs text-gray-400">{column.cards.length}</span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {column.cards.map(card => (
                <motion.div
                  key={card.id}
                  whileHover={{ y: -2 }}
                  className="p-3 rounded-lg border bg-white shadow-sm cursor-pointer"
                  style={{ borderColor: 'hsl(var(--theme-border))' }}
                >
                  <div className="text-sm mb-2" style={{ color: notionColors.default }}>
                    {card.title}
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: `${getPriorityColor(card.priority)}15`,
                        color: getPriorityColor(card.priority),
                      }}
                    >
                      {card.priority}
                    </span>
                    {card.assignee && (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Add Card */}
              <button className="w-full p-2 text-sm text-gray-500 hover:bg-gray-100 rounded flex items-center gap-1 transition-colors">
                <Plus className="w-4 h-4" />
                New
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Notion AI Assistant
// ============================================================================
function NotionAI() {
  const [query, setQuery] = useState('');

  const suggestions = [
    { icon: '✍️', label: 'Help me write', description: 'Draft content for any purpose' },
    { icon: '📝', label: 'Summarize', description: 'Condense text into key points' },
    { icon: '🔄', label: 'Translate', description: 'Convert to another language' },
    { icon: '💡', label: 'Brainstorm', description: 'Generate ideas on a topic' },
  ];

  return (
    <div
      className="max-w-xl mx-auto rounded-lg border overflow-hidden shadow-lg"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: 'hsl(var(--theme-border))',
      }}
    >
      {/* AI Header */}
      <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium" style={{ color: notionColors.default }}>Notion AI</span>
      </div>

      {/* Suggestions */}
      <div className="p-4 space-y-2">
        {suggestions.map((item, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors text-left"
            style={{ borderColor: 'hsl(var(--theme-border))' }}
          >
            <span className="text-xl">{item.icon}</span>
            <div>
              <div className="text-sm font-medium" style={{ color: notionColors.default }}>{item.label}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg border"
          style={{ borderColor: 'hsl(var(--theme-border))' }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI anything..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: notionColors.default }}
          />
          <button
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            style={{ color: query ? notionColors.blue : 'gray' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Notion Component Library
// ============================================================================
function NotionComponentLibrary() {
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({ toggle1: true, toggle2: false });

  return (
    <div className="space-y-8">
      {/* Block Types */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Block Types
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Type, label: 'Text' },
            { icon: Hash, label: 'Heading' },
            { icon: List, label: 'Bullet List' },
            { icon: ListOrdered, label: 'Numbered' },
            { icon: ToggleLeft, label: 'Toggle' },
            { icon: Quote, label: 'Quote' },
            { icon: Code, label: 'Code' },
            { icon: AlertCircle, label: 'Callout' },
          ].map((block, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: 'hsl(var(--theme-border))',
              }}
            >
              <block.icon className="w-5 h-5 text-gray-500" />
              <span className="text-sm" style={{ color: notionColors.default }}>{block.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Property Pills */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Property Pills
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(notionColors).map(([name, color]) => (
            <span
              key={name}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${color}20`,
                color: color,
              }}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Toggle Blocks */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Toggle Blocks
        </h4>
        <div className="space-y-2">
          {['toggle1', 'toggle2'].map((id, i) => (
            <div
              key={id}
              className="rounded-lg border overflow-hidden"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: 'hsl(var(--theme-border))',
              }}
            >
              <button
                onClick={() => setToggleStates({ ...toggleStates, [id]: !toggleStates[id] })}
                className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${toggleStates[id] ? 'rotate-90' : ''}`} />
                <span style={{ color: notionColors.default }}>
                  {i === 0 ? 'Click to expand this toggle' : 'Another toggle block'}
                </span>
              </button>
              <AnimatePresence>
                {toggleStates[id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-9 pb-3"
                  >
                    <p className="text-sm text-gray-600">
                      This is the content inside the toggle. You can put any blocks here.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Inline Formatting */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Inline Formatting
        </h4>
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: 'hsl(var(--theme-border))',
          }}
        >
          <div className="flex gap-1 mb-4 pb-4 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
            {[Bold, Italic, Underline, Strikethrough, Code, Link].map((Icon, i) => (
              <button
                key={i}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
              >
                <Icon className="w-4 h-4 text-gray-600" />
              </button>
            ))}
          </div>
          <p style={{ color: notionColors.default }}>
            You can make text <strong>bold</strong>, <em>italic</em>, <u>underlined</u>, or apply <code className="px-1 py-0.5 bg-gray-100 rounded text-red-600 text-sm">inline code</code> formatting.
          </p>
        </div>
      </div>

      {/* Mentions */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Mentions & References
        </h4>
        <div className="flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-sm cursor-pointer hover:bg-gray-200 transition-colors"
            style={{ color: notionColors.default }}
          >
            <Users className="w-3 h-3" />
            @User
          </span>
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-sm cursor-pointer hover:bg-gray-200 transition-colors"
            style={{ color: notionColors.default }}
          >
            <FileText className="w-3 h-3" />
            Project Roadmap
          </span>
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-sm cursor-pointer hover:bg-gray-200 transition-colors"
            style={{ color: notionColors.default }}
          >
            <Calendar className="w-3 h-3" />
            Jan 17, 2026
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================
export default function NotionPage() {
  return (
    <ProductPageLayout
      theme="notion"
      targetUser="teams who think in blocks and build in public"
      problemStatement="Tools fragment thinking. Notes here, tasks there, wikis somewhere else. Context dies in the transfer."
      problemContext="Notion unified documents, databases, and wikis into a single connected workspace. Every piece of content is a block, infinitely composable, endlessly flexible. The interface disappears so ideas can flow."
      insight="The block is the atomic unit of thought. When everything is a block, everything can connect to everything else. Structure emerges from composition, not templates."
      tradeoffs={['Flexibility over prescription', 'Composition over complexity', 'Blocks over pages']}
      appName="Notion"
      appDescription="Write, plan, organize. All in one place"
      showToolbar={true}
      themeLabel="Notion"
      onReferenceToAI={(prompt) => { if (typeof window !== 'undefined') { sessionStorage.setItem('openclaw_theme_reference', prompt); sessionStorage.setItem('openclaw_theme_reference_timestamp', Date.now().toString()); } }}
      principles={[
        {
          title: 'Blocks',
          description: 'Everything is a block. Text, images, databases, embeds. All equal citizens that can be arranged, nested, and connected.',
        },
        {
          title: 'Databases',
          description: 'Structured data without the friction. Tables, boards, calendars, lists. Different views of the same underlying data.',
        },
        {
          title: 'Minimal',
          description: 'The interface recedes. Black text on white canvas. Let content breathe. Every pixel serves the work.',
        },
        {
          title: 'Connected',
          description: 'Links, mentions, relations. Knowledge is a graph. Pages reference pages. Ideas build on ideas.',
        },
      ]}
      quote={{
        text: "We shape our tools, and thereafter our tools shape us. Notion is a tool for thought.",
        author: 'Ivan Zhao, Notion CEO',
      }}
    >
      {/* Sidebar Demo */}
      <div className="flex justify-center">
        <NotionSidebar />
      </div>

      {/* Page with Blocks Demo */}
      <div className="mt-16 relative">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Page with Blocks
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          The fundamental Notion experience. Blocks as building blocks. Drag, nest, transform.
        </p>
        <NotionPageBlocks />
      </div>

      {/* Database Table Demo */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Database Table View
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Structured data with multiple views. Sort, filter, and visualize your way.
        </p>
        <NotionDatabaseTable />
      </div>

      {/* Kanban Board Demo */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Kanban Board View
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Same database, different perspective. Drag cards between columns to update status.
        </p>
        <NotionKanbanBoard />
      </div>

      {/* AI Assistant Demo */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Notion AI
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          AI that lives in your workspace. Write, summarize, translate, brainstorm. Right where you work.
        </p>
        <NotionAI />
      </div>

      {/* Component Library */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Component Library
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          The building blocks of Notion&apos;s interface. Minimal, functional, infinitely composable.
        </p>
        <NotionComponentLibrary />
      </div>

      {/* Workspace Analytics */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Workspace Analytics
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Track progress across your sprint. See where work lives at a glance.
        </p>
        <NotionChart />
      </div>

      {/* Color Palette */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Notion Color Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          A restrained palette for a restrained interface. Click to copy hex values.
        </p>
        <BrandColorSwatch colors={notionColors} columns={5} />
      </div>

    </ProductPageLayout>
  );
}
