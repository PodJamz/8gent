'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi, Bluetooth, Moon, Sun, Volume2, Bell, Battery, ChevronRight,
  Plane, Settings, User, Lock, Shield, Globe, Accessibility, MessageCircle,
  Phone, Video, Camera, Music2, Play, Pause, SkipBack, SkipForward,
  Heart, Repeat, Shuffle, Search, Plus, MoreHorizontal, Star, Folder,
  File, Grid3X3, List, Clock, Share, Trash2, Download, ChevronDown, Check, X
} from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { BrandColorSwatch } from '@/components/design/BrandColorSwatch';
import Iphone15Pro from '@/components/magicui/iphone-15-pro';

// Apple system colors
const appleColors = {
  blue: '#007AFF',
  green: '#34C759',
  indigo: '#5856D6',
  orange: '#FF9500',
  pink: '#FF2D55',
  purple: '#AF52DE',
  red: '#FF3B30',
  teal: '#5AC8FA',
  yellow: '#FFCC00',
};

// ============================================================================
// iOS Settings App Interface
// ============================================================================
function IOSSettings() {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [airplaneMode, setAirplaneMode] = useState(false);

  const quickSettings = [
    { icon: Plane, label: 'Airplane Mode', enabled: airplaneMode, onToggle: () => setAirplaneMode(!airplaneMode), color: appleColors.orange },
    { icon: Wifi, label: 'Wi-Fi', value: wifiEnabled ? 'Home Network' : 'Off', enabled: wifiEnabled, onToggle: () => setWifiEnabled(!wifiEnabled), color: appleColors.blue },
    { icon: Bluetooth, label: 'Bluetooth', value: bluetoothEnabled ? 'On' : 'Off', enabled: bluetoothEnabled, onToggle: () => setBluetoothEnabled(!bluetoothEnabled), color: appleColors.blue },
  ];

  const settingsGroups = [
    {
      items: [
        { icon: Bell, label: 'Notifications', color: appleColors.red },
        { icon: Volume2, label: 'Sounds & Haptics', color: appleColors.pink },
        { icon: Moon, label: 'Focus', color: appleColors.indigo },
        { icon: Clock, label: 'Screen Time', color: appleColors.indigo },
      ],
    },
    {
      items: [
        { icon: Settings, label: 'General', color: '#8E8E93' },
        { icon: Accessibility, label: 'Accessibility', color: appleColors.blue },
        { icon: Lock, label: 'Privacy & Security', color: appleColors.blue },
      ],
    },
    {
      items: [
        { icon: User, label: 'Passwords', color: '#8E8E93' },
        { icon: Globe, label: 'Safari', color: appleColors.blue },
        { icon: MessageCircle, label: 'Messages', color: appleColors.green },
        { icon: Phone, label: 'Phone', color: appleColors.green },
      ],
    },
  ];

  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{
        backgroundColor: 'hsl(var(--theme-secondary))',
      }}
    >
      {/* Status Bar */}
      <div className="flex items-center justify-between px-6 py-3 pt-14">
        <span className="text-sm font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>9:41</span>
        <div className="flex items-center gap-1">
          <Wifi className="w-4 h-4" style={{ color: 'hsl(var(--theme-foreground))' }} />
          <Battery className="w-5 h-5" style={{ color: 'hsl(var(--theme-foreground))' }} />
        </div>
      </div>

      {/* Settings Header */}
      <div className="px-4 pb-2">
        <h1 className="text-3xl font-bold" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Settings
        </h1>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: 'hsla(var(--theme-muted) / 0.8)' }}
        >
          <Search className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
          <span className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Search</span>
        </div>
      </div>

      {/* Settings List */}
      <div className="px-4 pb-4 space-y-6 flex-1 overflow-y-auto">
        {/* Apple ID */}
        <div
          className="rounded-xl p-3 flex items-center gap-3"
          style={{ backgroundColor: 'hsl(var(--theme-card))' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-semibold"
            style={{ background: 'linear-gradient(135deg, #5AC8FA 0%, #007AFF 100%)' }}
          >
            JS
          </div>
          <div className="flex-1">
            <div className="font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>8gent</div>
            <div className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Apple ID, iCloud, Media & Purchases
            </div>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
        </div>

        {/* Quick Settings */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: 'hsl(var(--theme-card))' }}
        >
          {quickSettings.map((setting, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 border-b last:border-b-0"
              style={{ borderColor: 'hsl(var(--theme-border))' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: setting.color }}
                >
                  <setting.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                  {setting.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {setting.value && (
                  <span className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    {setting.value}
                  </span>
                )}
                <button
                  onClick={setting.onToggle}
                  className="relative w-12 h-7 rounded-full transition-colors"
                  style={{ backgroundColor: setting.enabled ? appleColors.green : 'hsl(var(--theme-muted))' }}
                >
                  <motion.div
                    animate={{ x: setting.enabled ? 22 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 w-6 h-6 rounded-full shadow-md"
                    style={{ backgroundColor: 'white' }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Settings Groups */}
        {settingsGroups.map((group, gi) => (
          <div
            key={gi}
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: 'hsl(var(--theme-card))' }}
          >
            {group.items.map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between px-4 py-3 border-b last:border-b-0"
                style={{ borderColor: 'hsl(var(--theme-border))' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: item.color }}
                  >
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
              </button>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}

// ============================================================================
// iMessage Conversation
// ============================================================================
function IMessageConversation() {
  const [newMessage, setNewMessage] = useState('');

  const messages = [
    { id: 1, text: 'Hey! How are you?', sent: false, time: '9:30 AM' },
    { id: 2, text: 'I\'m great! Just working on some designs.', sent: true, time: '9:31 AM' },
    { id: 3, text: 'That sounds awesome! Can you share some previews?', sent: false, time: '9:32 AM' },
    { id: 4, text: 'Sure! I\'ll send them over soon 🎨', sent: true, time: '9:33 AM' },
    { id: 5, text: 'Perfect!', sent: false, time: '9:33 AM', reaction: '❤️' },
  ];

  return (
    <div
      className="w-full h-full overflow-hidden flex flex-col"
      style={{
        backgroundColor: 'hsl(var(--theme-background))',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 pt-14 border-b"
        style={{
          borderColor: 'hsl(var(--theme-border))',
          backgroundColor: 'hsla(var(--theme-card) / 0.8)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <button className="flex items-center gap-1" style={{ color: appleColors.blue }}>
          <ChevronRight className="w-5 h-5 rotate-180" />
          <span className="text-sm">Messages</span>
        </button>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full mx-auto mb-0.5" style={{ background: 'linear-gradient(135deg, #FF9500 0%, #FF2D55 100%)' }} />
          <span className="text-xs font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>Alex</span>
        </div>
        <button>
          <Phone className="w-5 h-5" style={{ color: appleColors.blue }} />
        </button>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-2 flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
            <div className="relative">
              <div
                className={`max-w-[240px] px-4 py-2 rounded-2xl text-sm ${
                  msg.sent
                    ? 'rounded-br-md'
                    : 'rounded-bl-md'
                }`}
                style={{
                  backgroundColor: msg.sent ? appleColors.blue : 'hsl(var(--theme-secondary))',
                  color: msg.sent ? 'white' : 'hsl(var(--theme-foreground))',
                }}
              >
                {msg.text}
              </div>
              {msg.reaction && (
                <div
                  className="absolute -bottom-2 -right-1 text-xs bg-white rounded-full px-1 py-0.5 shadow-sm border"
                  style={{ borderColor: 'hsl(var(--theme-border))' }}
                >
                  {msg.reaction}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 px-3 py-3 border-t"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <button>
          <Plus className="w-7 h-7" style={{ color: appleColors.blue }} />
        </button>
        <div
          className="flex-1 flex items-center px-4 py-2 rounded-full border"
          style={{
            borderColor: 'hsl(var(--theme-border))',
            backgroundColor: 'hsl(var(--theme-card))',
          }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="iMessage"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          />
        </div>
        {newMessage ? (
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: appleColors.blue }}
          >
            <ChevronRight className="w-4 h-4 text-white rotate-[-90deg]" />
          </button>
        ) : (
          <button>
            <Camera className="w-6 h-6" style={{ color: appleColors.blue }} />
          </button>
        )}
      </div>

    </div>
  );
}

// ============================================================================
// Apple Music Now Playing
// ============================================================================
function AppleMusicNowPlaying() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(45);
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="w-full h-full overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      {/* Album Art */}
      <div className="relative p-6 pt-16 flex-shrink-0">
        <motion.div
          animate={{ scale: isPlaying ? 1 : 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-full aspect-square rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <Music2 className="w-24 h-24 text-white/40" />
          </div>
        </motion.div>
      </div>

      {/* Track Info */}
      <div className="px-8 text-center">
        <h2 className="text-xl font-semibold text-white">Starlight</h2>
        <p className="text-sm text-white/60">Taylor Swift</p>
      </div>

      {/* Progress Bar */}
      <div className="px-8 py-4">
        <div className="w-full h-1 rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-white/60">
          <span>1:45</span>
          <span>-2:38</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 pb-4">
        <div className="flex items-center justify-between">
          <button>
            <Shuffle className="w-5 h-5 text-white/60" />
          </button>
          <button>
            <SkipBack className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-black" />
            ) : (
              <Play className="w-8 h-8 text-black ml-1" />
            )}
          </button>
          <button>
            <SkipForward className="w-8 h-8 text-white" />
          </button>
          <button>
            <Repeat className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </div>

      {/* Volume */}
      <div className="px-8 pb-4">
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-white/60" />
          <div className="flex-1 h-1 rounded-full bg-white/20">
            <div className="w-2/3 h-full rounded-full bg-white" />
          </div>
          <Volume2 className="w-5 h-5 text-white/60" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-12 pb-8 text-white/60">
        <button onClick={() => setLiked(!liked)}>
          <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
        <button>
          <Share className="w-5 h-5" />
        </button>
        <button>
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}

// ============================================================================
// macOS Finder Window
// ============================================================================
function MacOSFinder() {
  const [viewMode, setViewMode] = useState<'icons' | 'list'>('icons');
  const [selectedFile, setSelectedFile] = useState<number | null>(null);

  const files = [
    { id: 1, name: 'Documents', type: 'folder', icon: Folder },
    { id: 2, name: 'Downloads', type: 'folder', icon: Download },
    { id: 3, name: 'Desktop', type: 'folder', icon: Folder },
    { id: 4, name: 'Applications', type: 'folder', icon: Grid3X3 },
    { id: 5, name: 'presentation.key', type: 'file', icon: File },
    { id: 6, name: 'design-system.fig', type: 'file', icon: File },
    { id: 7, name: 'notes.txt', type: 'file', icon: File },
    { id: 8, name: 'screenshot.png', type: 'file', icon: File },
  ];

  return (
    <div
      className="w-full rounded-xl overflow-hidden border shadow-2xl"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        borderColor: 'hsl(var(--theme-border))',
      }}
    >
      {/* Window Chrome */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          borderColor: 'hsl(var(--theme-border))',
          background: 'linear-gradient(180deg, hsl(var(--theme-secondary)) 0%, hsl(var(--theme-card)) 100%)',
        }}
      >
        {/* Traffic Lights */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4" style={{ color: appleColors.blue }} />
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Home
          </span>
        </div>

        {/* View Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('icons')}
            className="p-1 rounded"
            style={{ backgroundColor: viewMode === 'icons' ? 'hsl(var(--theme-muted))' : 'transparent' }}
          >
            <Grid3X3 className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="p-1 rounded"
            style={{ backgroundColor: viewMode === 'list' ? 'hsl(var(--theme-muted))' : 'transparent' }}
          >
            <List className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
          </button>
        </div>
      </div>

      <div className="flex" style={{ height: '300px' }}>
        {/* Sidebar */}
        <div
          className="w-48 p-2 border-r flex-shrink-0"
          style={{
            borderColor: 'hsl(var(--theme-border))',
            backgroundColor: 'hsla(var(--theme-secondary) / 0.5)',
          }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider mb-2 px-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Favorites
          </div>
          {['AirDrop', 'Recents', 'Applications', 'Desktop', 'Documents', 'Downloads'].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm text-left ${
                i === 3 ? 'bg-blue-500/20' : ''
              }`}
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              <Folder className="w-4 h-4" style={{ color: i === 3 ? appleColors.blue : 'hsl(var(--theme-muted-foreground))' }} />
              {item}
            </button>
          ))}

          <div className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2 px-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            iCloud
          </div>
          {['iCloud Drive', 'Shared'].map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-2 px-2 py-1 rounded text-sm text-left"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              <Folder className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
              {item}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {viewMode === 'icons' ? (
            <div className="grid grid-cols-4 gap-4">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    selectedFile === file.id ? 'bg-blue-500/20' : 'hover:bg-black/5'
                  }`}
                >
                  <file.icon
                    className="w-12 h-12"
                    style={{ color: file.type === 'folder' ? appleColors.blue : 'hsl(var(--theme-muted-foreground))' }}
                  />
                  <span
                    className="text-xs text-center truncate w-full"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  >
                    {file.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedFile === file.id ? 'bg-blue-500/20' : 'hover:bg-black/5'
                  }`}
                >
                  <file.icon
                    className="w-5 h-5"
                    style={{ color: file.type === 'folder' ? appleColors.blue : 'hsl(var(--theme-muted-foreground))' }}
                  />
                  <span className="text-sm flex-1 text-left" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    {file.name}
                  </span>
                  <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    --
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Apple Component Library
// ============================================================================
function AppleComponentLibrary() {
  const [segmentedValue, setSegmentedValue] = useState('All');
  const [checkboxChecked, setCheckboxChecked] = useState(true);

  return (
    <div className="space-y-8">
      {/* Segmented Control */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Segmented Control
        </h4>
        <div
          className="inline-flex rounded-lg p-1"
          style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
        >
          {['All', 'Active', 'Done'].map((option) => (
            <button
              key={option}
              onClick={() => setSegmentedValue(option)}
              className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
              style={{
                backgroundColor: segmentedValue === option ? 'hsl(var(--theme-card))' : 'transparent',
                color: 'hsl(var(--theme-foreground))',
                boxShadow: segmentedValue === option ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Buttons
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: appleColors.blue }}
          >
            Primary
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: 'hsl(var(--theme-secondary))',
              color: appleColors.blue,
            }}
          >
            Secondary
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ color: appleColors.blue }}
          >
            Text Only
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: appleColors.red }}
          >
            Destructive
          </button>
        </div>
      </div>

      {/* List Cells */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          List Cells
        </h4>
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: 'hsl(var(--theme-card))' }}
        >
          {[
            { label: 'Notifications', value: 'On', hasChevron: true },
            { label: 'Sound', value: 'Default', hasChevron: true },
            { label: 'Dark Mode', toggle: true },
          ].map((cell, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 border-b last:border-b-0"
              style={{ borderColor: 'hsl(var(--theme-border))' }}
            >
              <span className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                {cell.label}
              </span>
              <div className="flex items-center gap-2">
                {cell.value && (
                  <span className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    {cell.value}
                  </span>
                )}
                {cell.hasChevron && (
                  <ChevronRight className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                )}
                {cell.toggle && (
                  <div
                    className="w-12 h-7 rounded-full relative"
                    style={{ backgroundColor: appleColors.green }}
                  >
                    <div className="absolute right-0.5 top-0.5 w-6 h-6 rounded-full bg-white shadow-md" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Sheet Preview */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Action Sheet
        </h4>
        <div className="max-w-sm">
          <div
            className="rounded-xl overflow-hidden mb-2"
            style={{ backgroundColor: 'hsl(var(--theme-card))' }}
          >
            {['Share', 'Copy Link', 'Add to Photos'].map((action, i) => (
              <button
                key={i}
                className="w-full px-4 py-3 text-center border-b last:border-b-0 text-sm"
                style={{
                  borderColor: 'hsl(var(--theme-border))',
                  color: appleColors.blue,
                }}
              >
                {action}
              </button>
            ))}
          </div>
          <button
            className="w-full px-4 py-3 rounded-xl text-center text-sm font-semibold"
            style={{
              backgroundColor: 'hsl(var(--theme-card))',
              color: appleColors.blue,
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Selection Controls */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Selection Controls
        </h4>
        <div className="flex items-center gap-8">
          {/* Checkbox */}
          <button
            onClick={() => setCheckboxChecked(!checkboxChecked)}
            className="flex items-center gap-2"
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{
                backgroundColor: checkboxChecked ? appleColors.blue : 'transparent',
                border: checkboxChecked ? 'none' : '2px solid hsl(var(--theme-border))',
              }}
            >
              {checkboxChecked && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Checkbox
            </span>
          </button>

          {/* Radio */}
          <div className="flex items-center gap-4">
            {['Option A', 'Option B'].map((option, i) => (
              <button key={i} className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: i === 0 ? appleColors.blue : 'hsl(var(--theme-border))' }}
                >
                  {i === 0 && (
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: appleColors.blue }} />
                  )}
                </div>
                <span className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================
export default function ApplePage() {
  return (
    <ProductPageLayout
      theme="apple"
      targetUser="users who expect intuitive, delightful experiences"
      problemStatement="Technology should feel human. Complexity is a failure of design."
      problemContext="Apple designs for the intersection of technology and the liberal arts. Every interface must feel inevitable, as if no other solution could exist. The Human Interface Guidelines encode decades of research into principles that make technology disappear."
      insight="The best interface is no interface. When technology truly serves people, users accomplish goals without thinking about the tool. This requires obsessive attention to detail, from 44pt touch targets to fluid spring animations."
      tradeoffs={['Simplicity over features', 'Clarity over density', 'Delight over efficiency']}
      appName="iOS Settings"
      appDescription="System configuration that feels like exploration"
      showToolbar={true}
      themeLabel="Apple"
      onReferenceToAI={(prompt) => { if (typeof window !== 'undefined') { sessionStorage.setItem('openclaw_theme_reference', prompt); sessionStorage.setItem('openclaw_theme_reference_timestamp', Date.now().toString()); } }}
      principles={[
        {
          title: 'Clarity',
          description: 'Text is legible at every size. Icons are precise. Adornments are subtle. A sharp focus on functionality motivates every design decision.',
        },
        {
          title: 'Deference',
          description: 'Fluid motion and a crisp interface help people understand and interact with content while never competing with it.',
        },
        {
          title: 'Depth',
          description: 'Visual layers and realistic motion convey hierarchy, impart vitality, and facilitate understanding.',
        },
        {
          title: 'Direct Manipulation',
          description: 'Through physical gestures, people feel connected to content. Rotation follows fingertips. Swiping propels through views.',
        },
      ]}
      quote={{
        text: 'Design is not just what it looks like and feels like. Design is how it works.',
        author: 'Steve Jobs',
      }}
    >
      {/* iOS Settings Demo */}
      <div className="flex justify-center">
        <Iphone15Pro width={320} height={652} className="drop-shadow-2xl">
          <IOSSettings />
        </Iphone15Pro>
      </div>

      {/* iMessage */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          iMessage Conversation
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Real-time messaging with expressive reactions, rich bubbles, and seamless input.
        </p>
        <div className="flex justify-center">
          <Iphone15Pro width={320} height={652} className="drop-shadow-2xl">
            <IMessageConversation />
          </Iphone15Pro>
        </div>
      </div>

      {/* Apple Music */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Apple Music Now Playing
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Immersive music experience with dynamic backgrounds and fluid controls.
        </p>
        <div className="flex justify-center">
          <Iphone15Pro width={320} height={652} className="drop-shadow-2xl">
            <AppleMusicNowPlaying />
          </Iphone15Pro>
        </div>
      </div>

      {/* macOS Finder */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          macOS Finder
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          File management with sidebar navigation, multiple view modes, and spatial organization.
        </p>
        <MacOSFinder />
      </div>

      {/* Component Library */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Apple HIG Component Library
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Core UI elements following Human Interface Guidelines with proper sizing, spacing, and interaction patterns.
        </p>
        <AppleComponentLibrary />
      </div>

      {/* System Colors */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          System Colors
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Apple&apos;s semantic color palette. Click to copy hex values.
        </p>
        <BrandColorSwatch colors={appleColors} columns={5} />
      </div>

    </ProductPageLayout>
  );
}
