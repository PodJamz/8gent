'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Mic, Camera, Menu, Grid3X3, User, X, Settings, Mail, Calendar,
  FileText, Video, Map, Plus, Star, Archive, Trash2, Send, MoreVertical,
  ChevronRight, ChevronDown, Bold, Italic, Underline, List, ListOrdered,
  AlignLeft, Image, Link, Clock, Users, MapPin, Bell, Check
} from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { BrandColorSwatch } from '@/components/design/BrandColorSwatch';

// Google brand colors
const googleColors = {
  blue: '#4285F4',
  red: '#EA4335',
  yellow: '#FBBC05',
  green: '#34A853',
};

// ============================================================================
// Google Search Interface
// ============================================================================
function GoogleSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = [
    'material design 3 guidelines',
    'google fonts api',
    'firebase authentication',
    'google cloud platform',
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Google Logo */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-0.5 text-4xl font-medium select-none">
          <span style={{ color: googleColors.blue }}>G</span>
          <span style={{ color: googleColors.red }}>o</span>
          <span style={{ color: googleColors.yellow }}>o</span>
          <span style={{ color: googleColors.blue }}>g</span>
          <span style={{ color: googleColors.green }}>l</span>
          <span style={{ color: googleColors.red }}>e</span>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative">
        <motion.div
          className="flex items-center gap-3 px-4 py-3 rounded-full border transition-shadow"
          style={{
            backgroundColor: 'hsl(var(--theme-card))',
            borderColor: isFocused ? 'transparent' : 'hsl(var(--theme-border))',
            boxShadow: isFocused ? '0 1px 6px rgba(32,33,36,.28)' : 'none',
          }}
        >
          <Search className="w-5 h-5" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            placeholder="Search Google or type a URL"
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          />
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <Mic className="w-5 h-5" style={{ color: googleColors.blue }} />
            </button>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <Camera className="w-5 h-5" style={{ color: googleColors.yellow }} />
            </button>
          </div>
        </motion.div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full left-0 right-0 mt-1 rounded-3xl border overflow-hidden z-10"
              style={{
                backgroundColor: 'hsl(var(--theme-card))',
                borderColor: 'hsl(var(--theme-border))',
                boxShadow: '0 4px 6px rgba(32,33,36,.14)',
              }}
            >
              <div className="py-2">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-black/5 transition-colors text-left"
                  >
                    <Search className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                    <span className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                      {suggestion}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Buttons */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          className="px-4 py-2 text-sm rounded-md transition-colors"
          style={{
            backgroundColor: 'hsl(var(--theme-secondary))',
            color: 'hsl(var(--theme-foreground))',
          }}
        >
          Google Search
        </button>
        <button
          className="px-4 py-2 text-sm rounded-md transition-colors"
          style={{
            backgroundColor: 'hsl(var(--theme-secondary))',
            color: 'hsl(var(--theme-foreground))',
          }}
        >
          I&apos;m Feeling Lucky
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Gmail Interface
// ============================================================================
function GmailInterface() {
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  const emails = [
    { id: 1, from: 'Google Cloud', subject: 'Your monthly billing statement', time: '10:30 AM', starred: true, read: false },
    { id: 2, from: 'GitHub', subject: 'Security alert: New sign-in detected', time: '9:15 AM', starred: false, read: true },
    { id: 3, from: 'Figma', subject: 'Someone commented on your design', time: 'Yesterday', starred: false, read: true },
    { id: 4, from: 'Vercel', subject: 'Deployment successful: main branch', time: 'Yesterday', starred: true, read: true },
  ];

  return (
    <div
      className="w-full rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        borderColor: 'hsl(var(--theme-border))',
      }}
    >
      {/* Gmail Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-4">
          <Menu className="w-5 h-5" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6" style={{ color: googleColors.red }} />
            <span className="text-xl font-normal" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Gmail
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
          >
            <Search className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
            <span className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Search mail
            </span>
          </div>
        </div>
      </div>

      <div className="flex" style={{ height: '350px' }}>
        {/* Sidebar */}
        <div className="w-56 p-3 border-r" style={{ borderColor: 'hsl(var(--theme-border))' }}>
          <button
            onClick={() => setIsComposing(true)}
            className="flex items-center gap-3 w-fit px-6 py-4 rounded-2xl mb-4 transition-all hover:shadow-md"
            style={{
              backgroundColor: '#c2e7ff',
              color: '#001d35',
            }}
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Compose</span>
          </button>

          <nav className="space-y-1">
            {[
              { icon: Mail, label: 'Inbox', count: 4, active: true },
              { icon: Star, label: 'Starred', active: false },
              { icon: Clock, label: 'Snoozed', active: false },
              { icon: Send, label: 'Sent', active: false },
              { icon: Archive, label: 'Archive', active: false },
              { icon: Trash2, label: 'Trash', active: false },
            ].map((item) => (
              <button
                key={item.label}
                className="flex items-center justify-between w-full px-3 py-2 rounded-full text-sm transition-colors"
                style={{
                  backgroundColor: item.active ? '#d3e3fd' : 'transparent',
                  color: item.active ? '#001d35' : 'hsl(var(--theme-foreground))',
                }}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.count && (
                  <span className="text-xs font-medium">{item.count}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {emails.map((email) => (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email.id)}
              className="w-full flex items-center gap-3 px-4 py-2 border-b transition-colors hover:shadow-sm"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                backgroundColor: selectedEmail === email.id ? 'hsl(var(--theme-secondary))' :
                                  !email.read ? 'hsl(var(--theme-card))' : 'transparent',
              }}
            >
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1"
              >
                <Star
                  className="w-4 h-4"
                  fill={email.starred ? googleColors.yellow : 'none'}
                  style={{ color: email.starred ? googleColors.yellow : 'hsl(var(--theme-muted-foreground))' }}
                />
              </button>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-sm truncate"
                    style={{
                      fontWeight: email.read ? 400 : 600,
                      color: 'hsl(var(--theme-foreground))',
                    }}
                  >
                    {email.from}
                  </span>
                  <span className="text-xs flex-shrink-0" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    {email.time}
                  </span>
                </div>
                <p
                  className="text-sm truncate"
                  style={{
                    fontWeight: email.read ? 400 : 500,
                    color: email.read ? 'hsl(var(--theme-muted-foreground))' : 'hsl(var(--theme-foreground))',
                  }}
                >
                  {email.subject}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {isComposing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 right-4 w-96 rounded-2xl border shadow-xl overflow-hidden"
            style={{
              backgroundColor: 'hsl(var(--theme-card))',
              borderColor: 'hsl(var(--theme-border))',
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ backgroundColor: '#404040' }}
            >
              <span className="text-sm font-medium text-white">New Message</span>
              <button onClick={() => setIsComposing(false)}>
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <input
                type="text"
                placeholder="Recipients"
                className="w-full bg-transparent border-b pb-2 outline-none text-sm"
                style={{
                  borderColor: 'hsl(var(--theme-border))',
                  color: 'hsl(var(--theme-foreground))',
                }}
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full bg-transparent border-b pb-2 outline-none text-sm"
                style={{
                  borderColor: 'hsl(var(--theme-border))',
                  color: 'hsl(var(--theme-foreground))',
                }}
              />
              <textarea
                placeholder="Compose email"
                rows={6}
                className="w-full bg-transparent outline-none text-sm resize-none"
                style={{ color: 'hsl(var(--theme-foreground))' }}
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              <button
                className="px-6 py-2 rounded-full text-sm font-medium"
                style={{ backgroundColor: googleColors.blue, color: 'white' }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Google Docs Interface
// ============================================================================
function GoogleDocs() {
  return (
    <div
      className="w-full rounded-lg border overflow-hidden"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        borderColor: 'hsl(var(--theme-border))',
      }}
    >
      {/* Docs Header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8" style={{ color: googleColors.blue }} />
          <div>
            <input
              type="text"
              defaultValue="Untitled document"
              className="font-medium bg-transparent outline-none"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            />
            <div className="flex items-center gap-4 text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Insert</span>
              <span>Format</span>
              <span>Tools</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 rounded-full text-sm"
            style={{ backgroundColor: '#c2e7ff', color: '#001d35' }}
          >
            Share
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="flex items-center gap-1 px-4 py-2 border-b overflow-x-auto"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <select
          className="px-2 py-1 text-sm rounded border bg-transparent"
          style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-foreground))' }}
        >
          <option>Normal text</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
        </select>
        <div className="w-px h-6 mx-2" style={{ backgroundColor: 'hsl(var(--theme-border))' }} />
        <select
          className="px-2 py-1 text-sm rounded border bg-transparent"
          style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-foreground))' }}
        >
          <option>Arial</option>
          <option>Roboto</option>
          <option>Google Sans</option>
        </select>
        <div className="w-px h-6 mx-2" style={{ backgroundColor: 'hsl(var(--theme-border))' }} />
        {[Bold, Italic, Underline].map((Icon, i) => (
          <button
            key={i}
            className="p-2 rounded hover:bg-black/5 transition-colors"
          >
            <Icon className="w-4 h-4" style={{ color: 'hsl(var(--theme-foreground))' }} />
          </button>
        ))}
        <div className="w-px h-6 mx-2" style={{ backgroundColor: 'hsl(var(--theme-border))' }} />
        {[AlignLeft, List, ListOrdered].map((Icon, i) => (
          <button
            key={i}
            className="p-2 rounded hover:bg-black/5 transition-colors"
          >
            <Icon className="w-4 h-4" style={{ color: 'hsl(var(--theme-foreground))' }} />
          </button>
        ))}
        <div className="w-px h-6 mx-2" style={{ backgroundColor: 'hsl(var(--theme-border))' }} />
        {[Image, Link].map((Icon, i) => (
          <button
            key={i}
            className="p-2 rounded hover:bg-black/5 transition-colors"
          >
            <Icon className="w-4 h-4" style={{ color: 'hsl(var(--theme-foreground))' }} />
          </button>
        ))}
      </div>

      {/* Document Area */}
      <div className="p-8 min-h-[300px]" style={{ backgroundColor: '#f8f9fa' }}>
        <div
          className="max-w-2xl mx-auto p-12 rounded shadow-sm"
          style={{ backgroundColor: 'white', minHeight: '350px' }}
        >
          <h1
            className="text-3xl font-normal mb-4"
            style={{ color: '#202124' }}
          >
            Material Design 3
          </h1>
          <p className="text-base leading-relaxed mb-4" style={{ color: '#5f6368' }}>
            Material Design 3 (M3) is the latest evolution of Google&apos;s open-source design system.
            It features dynamic color, enhanced accessibility, and updated components.
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#5f6368' }}>
            Key principles include making design personal with color, adaptive to every screen,
            and expressive through shape and motion.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Google Calendar Interface
// ============================================================================
function GoogleCalendar() {
  const hours = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM
  const events = [
    { title: 'Team Standup', start: 9, duration: 1, color: googleColors.blue },
    { title: 'Design Review', start: 11, duration: 1.5, color: googleColors.green },
    { title: '1:1 with Manager', start: 14, duration: 0.5, color: googleColors.yellow },
    { title: 'Sprint Planning', start: 15, duration: 2, color: googleColors.red },
  ];

  return (
    <div
      className="w-full rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        borderColor: 'hsl(var(--theme-border))',
      }}
    >
      {/* Calendar Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-4">
          <Menu className="w-5 h-5" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" style={{ color: googleColors.blue }} />
            <span className="text-xl font-normal" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Calendar
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            January 17, 2026
          </span>
        </div>
      </div>

      {/* Day View */}
      <div className="flex" style={{ height: '320px' }}>
        {/* Time Column */}
        <div className="w-16 border-r flex-shrink-0" style={{ borderColor: 'hsl(var(--theme-border))' }}>
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-10 px-2 text-xs text-right"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
            </div>
          ))}
        </div>

        {/* Events Column */}
        <div className="flex-1 relative overflow-y-auto">
          {/* Hour Grid Lines */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-10 border-b"
              style={{ borderColor: 'hsl(var(--theme-border))' }}
            />
          ))}

          {/* Events */}
          {events.map((event, i) => (
            <div
              key={i}
              className="absolute left-1 right-1 rounded-lg px-2 py-1 text-white text-xs overflow-hidden"
              style={{
                top: `${(event.start - 9) * 40}px`,
                height: `${event.duration * 40 - 2}px`,
                backgroundColor: event.color,
              }}
            >
              <div className="font-medium truncate">{event.title}</div>
              <div className="opacity-80 text-[10px]">
                {event.start > 12 ? event.start - 12 : event.start}:00
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Material Design 3 Component Library
// ============================================================================
function M3ComponentLibrary() {
  const [fabExpanded, setFabExpanded] = useState(false);
  const [selectedChips, setSelectedChips] = useState<string[]>(['Design']);
  const [switchOn, setSwitchOn] = useState(true);
  const [sliderValue, setSliderValue] = useState(60);

  const chips = ['Design', 'Development', 'Research', 'Testing'];

  return (
    <div className="space-y-8">
      {/* Buttons */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Buttons
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          {/* Filled Button */}
          <button
            className="px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-md"
            style={{ backgroundColor: googleColors.blue, color: 'white' }}
          >
            Filled
          </button>
          {/* Outlined Button */}
          <button
            className="px-6 py-2.5 rounded-full text-sm font-medium border transition-all hover:bg-blue-50"
            style={{ borderColor: 'hsl(var(--theme-border))', color: googleColors.blue }}
          >
            Outlined
          </button>
          {/* Text Button */}
          <button
            className="px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:bg-blue-50"
            style={{ color: googleColors.blue }}
          >
            Text
          </button>
          {/* Tonal Button */}
          <button
            className="px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-sm"
            style={{ backgroundColor: '#d3e3fd', color: '#001d35' }}
          >
            Tonal
          </button>
        </div>
      </div>

      {/* FAB */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Floating Action Button
        </h4>
        <div className="flex items-center gap-4">
          {/* Small FAB */}
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:shadow-lg"
            style={{ backgroundColor: '#d3e3fd' }}
          >
            <Plus className="w-5 h-5" style={{ color: '#001d35' }} />
          </button>
          {/* Regular FAB */}
          <button
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:shadow-lg"
            style={{ backgroundColor: '#d3e3fd' }}
          >
            <Plus className="w-6 h-6" style={{ color: '#001d35' }} />
          </button>
          {/* Extended FAB */}
          <motion.button
            animate={{ width: fabExpanded ? 140 : 56 }}
            onClick={() => setFabExpanded(!fabExpanded)}
            className="h-14 rounded-2xl flex items-center justify-center gap-2 px-4 transition-all hover:shadow-lg overflow-hidden"
            style={{ backgroundColor: '#d3e3fd' }}
          >
            <Plus className="w-6 h-6 flex-shrink-0" style={{ color: '#001d35' }} />
            <AnimatePresence>
              {fabExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                  style={{ color: '#001d35' }}
                >
                  Compose
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Chips */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Filter Chips
        </h4>
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => {
            const isSelected = selectedChips.includes(chip);
            return (
              <button
                key={chip}
                onClick={() => {
                  setSelectedChips(isSelected
                    ? selectedChips.filter(c => c !== chip)
                    : [...selectedChips, chip]
                  );
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all"
                style={{
                  backgroundColor: isSelected ? '#d3e3fd' : 'transparent',
                  borderColor: isSelected ? '#d3e3fd' : 'hsl(var(--theme-border))',
                  color: isSelected ? '#001d35' : 'hsl(var(--theme-foreground))',
                }}
              >
                {isSelected && <Check className="w-4 h-4" />}
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Text Fields */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Text Fields
        </h4>
        <div className="flex flex-wrap gap-4">
          {/* Filled TextField */}
          <div className="relative">
            <input
              type="text"
              placeholder=" "
              className="peer w-48 px-4 pt-5 pb-2 rounded-t-lg border-b-2 transition-all outline-none"
              style={{
                backgroundColor: 'hsl(var(--theme-secondary))',
                borderColor: googleColors.blue,
                color: 'hsl(var(--theme-foreground))',
              }}
            />
            <label
              className="absolute left-4 top-4 text-sm transition-all peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs"
              style={{ color: googleColors.blue }}
            >
              Filled
            </label>
          </div>
          {/* Outlined TextField */}
          <div className="relative">
            <input
              type="text"
              placeholder=" "
              className="peer w-48 px-4 pt-5 pb-2 rounded-lg border-2 bg-transparent transition-all outline-none focus:border-blue-500"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                color: 'hsl(var(--theme-foreground))',
              }}
            />
            <label
              className="absolute left-4 top-4 text-sm transition-all peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs px-1 bg-white"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Outlined
            </label>
          </div>
        </div>
      </div>

      {/* Switches and Sliders */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Selection Controls
        </h4>
        <div className="flex items-center gap-8">
          {/* Switch */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSwitchOn(!switchOn)}
              className="relative w-14 h-8 rounded-full transition-colors"
              style={{ backgroundColor: switchOn ? googleColors.blue : 'hsl(var(--theme-muted))' }}
            >
              <motion.div
                animate={{ x: switchOn ? 24 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-6 h-6 rounded-full shadow-md"
                style={{ backgroundColor: 'white' }}
              />
            </button>
            <span className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
              {switchOn ? 'On' : 'Off'}
            </span>
          </div>

          {/* Slider */}
          <div className="flex-1 max-w-xs">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${googleColors.blue} ${sliderValue}%, hsl(var(--theme-muted)) ${sliderValue}%)`,
              }}
            />
            <div className="text-xs text-center mt-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              {sliderValue}%
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Cards
        </h4>
        <div className="flex flex-wrap gap-4">
          {/* Elevated Card */}
          <div
            className="w-48 p-4 rounded-xl shadow-md"
            style={{ backgroundColor: 'hsl(var(--theme-card))' }}
          >
            <div className="text-sm font-medium mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Elevated Card
            </div>
            <div className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Uses shadow for depth
            </div>
          </div>
          {/* Filled Card */}
          <div
            className="w-48 p-4 rounded-xl"
            style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
          >
            <div className="text-sm font-medium mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Filled Card
            </div>
            <div className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Uses color for depth
            </div>
          </div>
          {/* Outlined Card */}
          <div
            className="w-48 p-4 rounded-xl border"
            style={{ borderColor: 'hsl(var(--theme-border))' }}
          >
            <div className="text-sm font-medium mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Outlined Card
            </div>
            <div className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Uses border for depth
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================
export default function GooglePage() {
  return (
    <ProductPageLayout
      theme="google"
      targetUser="users who expect simplicity and consistency"
      problemStatement="Complexity hides utility. Users want power without cognitive overhead."
      problemContext="Google serves billions of users with vastly different needs and contexts. Material Design evolved to balance consistency with adaptability: personal expression through dynamic color, accessibility through systematic spacing, and joy through intentional motion."
      insight="The best interface is one that feels native to each user while maintaining the trust of familiar patterns. Material Design 3 achieves this through its dynamic color system that adapts to user preferences."
      tradeoffs={['Consistency over customization', 'Accessibility over aesthetics', 'System-wide cohesion over individual expression']}
      appName="Google Search"
      appDescription="The gateway to the world's information"
      showToolbar={true}
      themeLabel="Google"
      onReferenceToAI={(prompt) => { if (typeof window !== 'undefined') { sessionStorage.setItem('openclaw_theme_reference', prompt); sessionStorage.setItem('openclaw_theme_reference_timestamp', Date.now().toString()); } }}
      principles={[
        {
          title: 'Personal',
          description: 'Dynamic Color makes design uniquely yours, adapting interfaces to user preferences and context through Material You.',
        },
        {
          title: 'Adaptive',
          description: 'Responsive layouts that work beautifully from watches to large screens. One design system, infinite canvases.',
        },
        {
          title: 'Expressive',
          description: 'Shape and motion bring personality. Rounded corners (28dp on cards), emphasized easing, and playful transitions.',
        },
        {
          title: 'Accessible',
          description: 'Built-in accessibility with proper contrast ratios, touch targets, and screen reader support in every component.',
        },
      ]}
      quote={{
        text: 'Material is the metaphor. A material metaphor is the unifying theory of a rationalized space and a system of motion.',
        author: 'Material Design Guidelines',
      }}
    >
      {/* Search Demo */}
      <GoogleSearch />

      {/* Gmail Demo */}
      <div className="mt-16 relative">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Gmail Interface
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Email reimagined with Material Design 3. Tonal surfaces, expressive FAB, and intuitive navigation.
        </p>
        <GmailInterface />
      </div>

      {/* Google Docs Demo */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Google Docs
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Collaborative document editing with clean toolbar design and familiar formatting options.
        </p>
        <GoogleDocs />
      </div>

      {/* Calendar Demo */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Google Calendar
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Time management with color-coded events and responsive day view.
        </p>
        <GoogleCalendar />
      </div>

      {/* Component Library */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Material Design 3 Component Library
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Core components following M3 specifications with proper elevation, shape, and interaction states.
        </p>
        <M3ComponentLibrary />
      </div>

      {/* Color Palette */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Google Brand Colors
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          The iconic four-color palette. Click to copy hex values.
        </p>
        <BrandColorSwatch colors={googleColors} columns={4} />
      </div>

    </ProductPageLayout>
  );
}
