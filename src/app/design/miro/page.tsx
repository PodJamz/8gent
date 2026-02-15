'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Square, Circle, Type, StickyNote, Pencil, MousePointer2, Hand, Minus,
  Plus, ZoomIn, ZoomOut, MoreHorizontal, MessageCircle, Users, Share2,
  Play, Timer, Vote, Frame, ArrowRight, Shapes, Image, Link, FileText,
  Undo, Redo, Lock, Unlock, Trash2, Copy, Layers, ChevronDown, Star,
  Clock, Video, Smile, ThumbsUp, Heart, Check
} from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { BrandColorSwatch } from '@/components/design/BrandColorSwatch';

// Miro brand colors
const miroColors = {
  yellow: '#F2D600',
  yellowLight: '#FFF9C4',
  blue: '#2D9CDB',
  blueDark: '#050038',
  green: '#27AE60',
  orange: '#F2994A',
  pink: '#F06292',
  purple: '#9B51E0',
  red: '#EB5757',
  gray: '#4F4F4F',
  lightGray: '#F2F2F2',
};

const stickyColors = ['#FEF3C7', '#DBEAFE', '#D1FAE5', '#FDE8E8', '#F3E8FF', '#FEF9C3'];

// ============================================================================
// Miro Canvas
// ============================================================================
function MiroCanvas() {
  const [zoom, setZoom] = useState(100);
  const [selectedTool, setSelectedTool] = useState('cursor');

  const tools = [
    { id: 'cursor', icon: MousePointer2, label: 'Select' },
    { id: 'hand', icon: Hand, label: 'Pan' },
    { id: 'sticky', icon: StickyNote, label: 'Sticky note' },
    { id: 'shape', icon: Shapes, label: 'Shapes' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'pen', icon: Pencil, label: 'Pen' },
    { id: 'frame', icon: Frame, label: 'Frame' },
  ];

  const stickies = [
    { id: 1, x: 60, y: 40, color: stickyColors[0], text: 'User Research', rotation: -2 },
    { id: 2, x: 200, y: 50, color: stickyColors[1], text: 'Pain Points', rotation: 1 },
    { id: 3, x: 340, y: 45, color: stickyColors[2], text: 'Solutions', rotation: -1 },
    { id: 4, x: 80, y: 160, color: stickyColors[3], text: 'Interviews', rotation: 2 },
    { id: 5, x: 220, y: 170, color: stickyColors[4], text: 'Survey Data', rotation: -1 },
    { id: 6, x: 360, y: 155, color: stickyColors[5], text: 'Prototypes', rotation: 1 },
  ];

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'hsl(var(--theme-border))' }}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ backgroundColor: 'white', borderColor: 'hsl(var(--theme-border))' }}
      >
        {/* Left Tools */}
        <div className="flex items-center gap-1">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: selectedTool === tool.id ? miroColors.yellowLight : 'transparent',
                color: selectedTool === tool.id ? miroColors.blueDark : miroColors.gray,
              }}
              title={tool.label}
            >
              <tool.icon className="w-5 h-5" />
            </button>
          ))}
          <div className="w-px h-6 mx-2" style={{ backgroundColor: 'hsl(var(--theme-border))' }} />
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Image className="w-5 h-5" style={{ color: miroColors.gray }} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Link className="w-5 h-5" style={{ color: miroColors.gray }} />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Undo className="w-5 h-5" style={{ color: miroColors.gray }} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Redo className="w-5 h-5" style={{ color: miroColors.gray }} />
          </button>
          <div className="w-px h-6 mx-1" style={{ backgroundColor: 'hsl(var(--theme-border))' }} />
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: miroColors.blue }}
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        className="relative h-80 overflow-hidden"
        style={{
          backgroundColor: '#F7F6F3',
          backgroundImage: 'radial-gradient(circle, #ddd 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        {/* Frame */}
        <div
          className="absolute top-4 left-4 right-4 bottom-4 rounded-lg border-2 border-dashed"
          style={{ borderColor: miroColors.blue }}
        >
          <div
            className="absolute -top-6 left-0 px-2 py-0.5 rounded text-xs font-medium"
            style={{ backgroundColor: miroColors.blue, color: 'white' }}
          >
            Research Board
          </div>
        </div>

        {/* Sticky Notes */}
        {stickies.map(sticky => (
          <motion.div
            key={sticky.id}
            className="absolute w-28 h-28 p-3 shadow-lg cursor-pointer"
            style={{
              left: sticky.x,
              top: sticky.y,
              backgroundColor: sticky.color,
              transform: `rotate(${sticky.rotation}deg)`,
            }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
          >
            <p className="text-sm font-medium" style={{ color: miroColors.blueDark }}>
              {sticky.text}
            </p>
          </motion.div>
        ))}

        {/* Connector Lines */}
        <svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
          <path
            d="M 145 90 Q 175 120 185 130"
            fill="none"
            stroke={miroColors.blue}
            strokeWidth="2"
            strokeDasharray="4"
          />
          <path
            d="M 285 90 Q 315 120 345 130"
            fill="none"
            stroke={miroColors.blue}
            strokeWidth="2"
            strokeDasharray="4"
          />
        </svg>

        {/* Collaboration Cursors */}
        <motion.div
          className="absolute"
          animate={{ x: [200, 220, 200], y: [120, 100, 120] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <div className="relative">
            <MousePointer2 className="w-4 h-4" style={{ color: miroColors.purple }} />
            <span
              className="absolute -bottom-4 left-2 px-1.5 py-0.5 rounded text-xs text-white whitespace-nowrap"
              style={{ backgroundColor: miroColors.purple }}
            >
              Sarah
            </span>
          </div>
        </motion.div>
        <motion.div
          className="absolute"
          animate={{ x: [350, 330, 350], y: [80, 100, 80] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <div className="relative">
            <MousePointer2 className="w-4 h-4" style={{ color: miroColors.green }} />
            <span
              className="absolute -bottom-4 left-2 px-1.5 py-0.5 rounded text-xs text-white whitespace-nowrap"
              style={{ backgroundColor: miroColors.green }}
            >
              Mike
            </span>
          </div>
        </motion.div>

        {/* Zoom Controls */}
        <div
          className="absolute bottom-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg shadow-md"
          style={{ backgroundColor: 'white' }}
        >
          <button
            onClick={() => setZoom(Math.max(25, zoom - 25))}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ZoomOut className="w-4 h-4" style={{ color: miroColors.gray }} />
          </button>
          <span className="w-12 text-center text-sm font-medium" style={{ color: miroColors.blueDark }}>
            {zoom}%
          </span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 25))}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ZoomIn className="w-4 h-4" style={{ color: miroColors.gray }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Sticky Note Clusters
// ============================================================================
function StickyNoteClusters() {
  const clusters = [
    {
      title: 'Ideas',
      color: stickyColors[0],
      notes: ['New onboarding flow', 'Gamification', 'Social features', 'AI assistant'],
    },
    {
      title: 'Questions',
      color: stickyColors[1],
      notes: ['Target audience?', 'MVP scope', 'Timeline', 'Resources'],
    },
    {
      title: 'Next Steps',
      color: stickyColors[2],
      notes: ['User interviews', 'Competitor analysis', 'Wireframes'],
    },
  ];

  return (
    <div className="flex flex-wrap gap-8 justify-center">
      {clusters.map((cluster, i) => (
        <div key={i} className="space-y-3">
          <h4 className="text-sm font-semibold text-center" style={{ color: miroColors.blueDark }}>
            {cluster.title}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {cluster.notes.map((note, j) => (
              <motion.div
                key={j}
                className="w-24 h-24 p-2 shadow-md cursor-pointer"
                style={{
                  backgroundColor: cluster.color,
                  transform: `rotate(${(j % 2 === 0 ? -1 : 1) * (j + 1)}deg)`,
                }}
                whileHover={{ scale: 1.05, rotate: 0 }}
              >
                <p className="text-xs" style={{ color: miroColors.blueDark }}>{note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Miro Toolbar
// ============================================================================
function MiroToolbar() {
  const toolGroups = [
    {
      title: 'Selection',
      tools: [
        { icon: MousePointer2, label: 'Select', shortcut: 'V' },
        { icon: Hand, label: 'Pan', shortcut: 'H' },
      ],
    },
    {
      title: 'Create',
      tools: [
        { icon: StickyNote, label: 'Sticky note', shortcut: 'N' },
        { icon: Type, label: 'Text', shortcut: 'T' },
        { icon: Shapes, label: 'Shape', shortcut: 'S' },
        { icon: Pencil, label: 'Pen', shortcut: 'P' },
        { icon: Frame, label: 'Frame', shortcut: 'F' },
      ],
    },
    {
      title: 'Insert',
      tools: [
        { icon: Image, label: 'Image', shortcut: null },
        { icon: Link, label: 'Link', shortcut: null },
        { icon: FileText, label: 'Document', shortcut: null },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {toolGroups.map((group, i) => (
        <div key={i}>
          <h4 className="text-xs font-medium mb-3" style={{ color: miroColors.gray }}>
            {group.title}
          </h4>
          <div className="flex flex-wrap gap-2">
            {group.tools.map((tool, j) => (
              <div
                key={j}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer hover:border-blue-300 transition-colors"
                style={{ backgroundColor: 'white', borderColor: 'hsl(var(--theme-border))' }}
              >
                <tool.icon className="w-5 h-5" style={{ color: miroColors.gray }} />
                <span className="text-sm" style={{ color: miroColors.blueDark }}>{tool.label}</span>
                {tool.shortcut && (
                  <span
                    className="ml-1 px-1.5 py-0.5 rounded text-xs"
                    style={{ backgroundColor: miroColors.lightGray, color: miroColors.gray }}
                  >
                    {tool.shortcut}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Comment Thread
// ============================================================================
function CommentThread() {
  const [showReactions, setShowReactions] = useState(false);

  const comments = [
    {
      author: 'Sarah',
      avatar: miroColors.purple,
      time: '2 min ago',
      text: 'Love this approach! Can we add more detail to the user research sticky?',
      reactions: [{ emoji: '👍', count: 2 }],
    },
    {
      author: 'Mike',
      avatar: miroColors.green,
      time: 'Just now',
      text: "Sure! I'll add the interview quotes we collected.",
      reactions: [],
    },
  ];

  const reactions = ['👍', '❤️', '🎉', '🤔', '👀', '🚀'];

  return (
    <div
      className="w-80 rounded-lg border shadow-lg overflow-hidden"
      style={{ backgroundColor: 'white', borderColor: 'hsl(var(--theme-border))' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" style={{ color: miroColors.blue }} />
          <span className="text-sm font-medium" style={{ color: miroColors.blueDark }}>
            Comments
          </span>
          <span
            className="px-1.5 py-0.5 rounded-full text-xs"
            style={{ backgroundColor: miroColors.lightGray, color: miroColors.gray }}
          >
            2
          </span>
        </div>
        <button className="p-1 rounded hover:bg-gray-100">
          <MoreHorizontal className="w-4 h-4" style={{ color: miroColors.gray }} />
        </button>
      </div>

      {/* Comments */}
      <div className="p-4 space-y-4 max-h-60 overflow-y-auto">
        {comments.map((comment, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
                style={{ backgroundColor: comment.avatar }}
              >
                {comment.author[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: miroColors.blueDark }}>
                    {comment.author}
                  </span>
                  <span className="text-xs" style={{ color: miroColors.gray }}>
                    {comment.time}
                  </span>
                </div>
                <p className="text-sm mt-1" style={{ color: miroColors.gray }}>
                  {comment.text}
                </p>
                {comment.reactions.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {comment.reactions.map((r, j) => (
                      <span
                        key={j}
                        className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
                        style={{ backgroundColor: miroColors.lightGray }}
                      >
                        {r.emoji} {r.count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="relative">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full px-3 py-2 pr-20 rounded-lg border text-sm outline-none focus:border-blue-300"
            style={{ borderColor: 'hsl(var(--theme-border))' }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <Smile className="w-4 h-4" style={{ color: miroColors.gray }} />
            </button>
          </div>
        </div>

        {/* Reactions Picker */}
        <AnimatePresence>
          {showReactions && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-1 mt-2 p-2 rounded-lg"
              style={{ backgroundColor: miroColors.lightGray }}
            >
              {reactions.map((emoji, i) => (
                <button
                  key={i}
                  className="p-1.5 rounded hover:bg-white transition-colors"
                  onClick={() => setShowReactions(false)}
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// Timer Widget
// ============================================================================
function TimerWidget() {
  const [seconds, setSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="w-48 rounded-lg border shadow-lg overflow-hidden"
      style={{ backgroundColor: 'white', borderColor: 'hsl(var(--theme-border))' }}
    >
      <div
        className="px-4 py-2 border-b flex items-center gap-2"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <Timer className="w-4 h-4" style={{ color: miroColors.blue }} />
        <span className="text-sm font-medium" style={{ color: miroColors.blueDark }}>
          Timer
        </span>
      </div>
      <div className="p-4 text-center">
        <div
          className="text-3xl font-bold mb-4"
          style={{ color: miroColors.blueDark }}
        >
          {formatTime(seconds)}
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 rounded-lg text-white"
            style={{ backgroundColor: isRunning ? miroColors.red : miroColors.green }}
          >
            {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setSeconds(300)}
            className="p-2 rounded-lg hover:bg-gray-100"
            style={{ color: miroColors.gray }}
          >
            <Undo className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Voting Widget
// ============================================================================
function VotingWidget() {
  const [votes, setVotes] = useState([3, 2, 1]);

  const options = ['Option A', 'Option B', 'Option C'];
  const totalVotes = votes.reduce((a, b) => a + b, 0);

  return (
    <div
      className="w-64 rounded-lg border shadow-lg overflow-hidden"
      style={{ backgroundColor: 'white', borderColor: 'hsl(var(--theme-border))' }}
    >
      <div
        className="px-4 py-2 border-b flex items-center gap-2"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <Vote className="w-4 h-4" style={{ color: miroColors.blue }} />
        <span className="text-sm font-medium" style={{ color: miroColors.blueDark }}>
          Quick Vote
        </span>
      </div>
      <div className="p-4 space-y-3">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => {
              const newVotes = [...votes];
              newVotes[i]++;
              setVotes(newVotes);
            }}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm" style={{ color: miroColors.blueDark }}>{option}</span>
              <span className="text-xs" style={{ color: miroColors.gray }}>
                {votes[i]} votes
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: miroColors.lightGray }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: miroColors.blue }}
                initial={{ width: 0 }}
                animate={{ width: `${(votes[i] / totalVotes) * 100}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Component Library
// ============================================================================
function MiroComponentLibrary() {
  return (
    <div className="space-y-8">
      {/* Sticky Note Colors */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Sticky Note Colors
        </h4>
        <div className="flex flex-wrap gap-3">
          {stickyColors.map((color, i) => (
            <motion.div
              key={i}
              className="w-20 h-20 p-2 shadow-md cursor-pointer"
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <p className="text-xs" style={{ color: miroColors.blueDark }}>
                Note {i + 1}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Shapes */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Basic Shapes
        </h4>
        <div className="flex flex-wrap gap-4">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: miroColors.blue }}
          >
            <Square className="w-8 h-8 text-white" />
          </div>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: miroColors.green }}
          >
            <Circle className="w-8 h-8 text-white" />
          </div>
          <div
            className="w-16 h-16 flex items-center justify-center"
            style={{
              backgroundColor: miroColors.orange,
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            }}
          />
          <div
            className="w-16 h-16 flex items-center justify-center"
            style={{
              backgroundColor: miroColors.pink,
              clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
            }}
          />
        </div>
      </div>

      {/* Connectors */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Connectors
        </h4>
        <div
          className="p-4 rounded-lg border"
          style={{ backgroundColor: 'white', borderColor: 'hsl(var(--theme-border))' }}
        >
          <svg width="300" height="80" className="overflow-visible">
            {/* Straight */}
            <line x1="20" y1="20" x2="100" y2="20" stroke={miroColors.blue} strokeWidth="2" />
            <circle cx="100" cy="20" r="4" fill={miroColors.blue} />
            <text x="55" y="50" fontSize="12" fill={miroColors.gray}>Straight</text>

            {/* Curved */}
            <path d="M 130 20 Q 170 60 210 20" fill="none" stroke={miroColors.green} strokeWidth="2" />
            <circle cx="210" cy="20" r="4" fill={miroColors.green} />
            <text x="155" y="50" fontSize="12" fill={miroColors.gray}>Curved</text>

            {/* Dashed */}
            <line x1="240" y1="20" x2="290" y2="20" stroke={miroColors.orange} strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="290" cy="20" r="4" fill={miroColors.orange} />
            <text x="250" y="50" fontSize="12" fill={miroColors.gray}>Dashed</text>
          </svg>
        </div>
      </div>

      {/* Frames */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Frame Styles
        </h4>
        <div className="flex flex-wrap gap-4">
          <div
            className="w-32 h-24 rounded-lg border-2 relative p-2"
            style={{ borderColor: miroColors.blue }}
          >
            <span
              className="absolute -top-3 left-2 px-2 text-xs font-medium"
              style={{ backgroundColor: miroColors.blue, color: 'white', borderRadius: 4 }}
            >
              Sprint 1
            </span>
          </div>
          <div
            className="w-32 h-24 rounded-lg border-2 border-dashed relative p-2"
            style={{ borderColor: miroColors.purple }}
          >
            <span
              className="absolute -top-3 left-2 px-2 text-xs font-medium"
              style={{ backgroundColor: miroColors.purple, color: 'white', borderRadius: 4 }}
            >
              Ideas
            </span>
          </div>
        </div>
      </div>

      {/* Collaboration Presence */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Collaboration Presence
        </h4>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[miroColors.blue, miroColors.purple, miroColors.green, miroColors.orange].map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                style={{ backgroundColor: color }}
              >
                {['J', 'S', 'M', 'A'][i]}
              </div>
            ))}
          </div>
          <span className="text-sm" style={{ color: miroColors.gray }}>
            4 participants
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================
export default function MiroPage() {
  return (
    <ProductPageLayout
      theme="miro"
      targetUser="teams who think visually and work together"
      problemStatement="Meetings end. Whiteboards get erased. Ideas scatter across tools, people, and timezones. Collaboration becomes coordination."
      problemContext="Miro created the infinite canvas, a shared space where teams can think together in real-time or asynchronously. Sticky notes for ideation, diagrams for structure, comments for context. The whiteboard that never runs out of space."
      insight="Great collaboration happens when thinking becomes visible. Miro makes ideas tangible. You can move them, connect them, vote on them. The canvas is the conversation."
      tradeoffs={['Visual over textual', 'Collaboration over documentation', 'Flexibility over structure']}
      appName="Miro"
      appDescription="The visual workspace for innovation"
      showToolbar={true}
      themeLabel="Miro"
      onReferenceToAI={(prompt) => { if (typeof window !== 'undefined') { sessionStorage.setItem('openclaw_theme_reference', prompt); sessionStorage.setItem('openclaw_theme_reference_timestamp', Date.now().toString()); } }}
      principles={[
        {
          title: 'Infinite',
          description: 'The canvas never ends. Zoom in for detail, zoom out for the big picture. Space for every idea.',
        },
        {
          title: 'Real-time',
          description: 'See teammates move, type, and create. Cursors show presence. Changes happen instantly.',
        },
        {
          title: 'Expressive',
          description: 'Sticky notes, shapes, drawings, images. Multiple ways to capture and communicate ideas.',
        },
        {
          title: 'Structured',
          description: 'Frames organize. Templates accelerate. Turn chaos into clarity with visual hierarchy.',
        },
      ]}
      quote={{
        text: "The best ideas come from collaboration. Miro gives teams a place to think together.",
        author: 'Miro Team',
      }}
    >
      {/* Canvas Demo */}
      <MiroCanvas />

      {/* Sticky Note Clusters */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Sticky Note Clusters
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Color-coded notes for organizing ideas. Stack, cluster, and connect.
        </p>
        <StickyNoteClusters />
      </div>

      {/* Toolbar */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Toolbar
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Quick access to creation tools. Keyboard shortcuts for power users.
        </p>
        <MiroToolbar />
      </div>

      {/* Widgets */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Collaboration Widgets
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Interactive widgets for meetings and workshops. Comments, timers, and voting.
        </p>
        <div className="flex flex-wrap gap-6 justify-center">
          <CommentThread />
          <div className="space-y-6">
            <TimerWidget />
            <VotingWidget />
          </div>
        </div>
      </div>

      {/* Component Library */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Component Library
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          The building blocks of Miro&apos;s canvas. Shapes, notes, and connectors.
        </p>
        <MiroComponentLibrary />
      </div>

      {/* Color Palette */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Miro Color Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Bright, collaborative colors. Click to copy hex values.
        </p>
        <BrandColorSwatch
          colors={[
            { name: 'Yellow', hex: miroColors.yellow },
            { name: 'Blue', hex: miroColors.blue },
            { name: 'Green', hex: miroColors.green },
            { name: 'Orange', hex: miroColors.orange },
            { name: 'Purple', hex: miroColors.purple },
            { name: 'Pink', hex: miroColors.pink },
            { name: 'Red', hex: miroColors.red },
            { name: 'Dark', hex: miroColors.blueDark },
            { name: 'Gray', hex: miroColors.gray },
            { name: 'Light', hex: miroColors.lightGray },
          ]}
          columns={5}
        />
      </div>

    </ProductPageLayout>
  );
}
