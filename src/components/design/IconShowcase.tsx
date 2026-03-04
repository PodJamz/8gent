'use client';
import { motion } from 'framer-motion';
import {
  Home, Search, Settings, User, Bell, Mail, Heart, Star,
  Share2, Download, Upload, Edit, Trash2, Plus, Minus, Check,
  X, ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Menu, Grid,
  List, Filter, Clock, Calendar, MapPin, Phone, Camera,
  Image, Video, Music, Mic, Volume2, VolumeX, Play, Pause,
  SkipForward, SkipBack, Shuffle, Repeat, Sun, Moon, Cloud,
  Zap, Wifi, Bluetooth, Battery, Lock, Unlock, Eye, EyeOff,
  Copy, Clipboard, Send, MessageCircle, MessagesSquare,
  ThumbsUp, ThumbsDown, Bookmark, Flag, Tag, Hash, AtSign,
  Link, ExternalLink, Globe, Code, Terminal, Database,
  Server, Cpu, HardDrive, Monitor, Smartphone, Tablet,
  Laptop, Watch, Headphones, Speaker, Printer, Folder,
  File, FileText, Archive, Package, Box, ShoppingCart,
  CreditCard, DollarSign, TrendingUp, TrendingDown,
  BarChart2, PieChart, Activity, Award, Target, Crosshair,
  Compass, Navigation, Map, Layers, Layout, Columns,
  Square, Circle, Triangle, Hexagon, Octagon, Pentagon,
  type LucideIcon,
} from 'lucide-react';

interface IconShowcaseProps {
  className?: string;
  variant?: 'grid' | 'list' | 'featured';
  iconSet?: 'all' | 'navigation' | 'media' | 'communication' | 'interface' | 'objects';
}

const iconCategories: Record<string, { name: string; icon: LucideIcon }[]> = {
  navigation: [
    { name: 'Home', icon: Home },
    { name: 'Search', icon: Search },
    { name: 'Menu', icon: Menu },
    { name: 'Arrow Right', icon: ArrowRight },
    { name: 'Chevron', icon: ChevronRight },
    { name: 'External', icon: ExternalLink },
  ],
  media: [
    { name: 'Play', icon: Play },
    { name: 'Pause', icon: Pause },
    { name: 'Music', icon: Music },
    { name: 'Video', icon: Video },
    { name: 'Camera', icon: Camera },
    { name: 'Image', icon: Image },
  ],
  communication: [
    { name: 'Mail', icon: Mail },
    { name: 'Message', icon: MessageCircle },
    { name: 'Bell', icon: Bell },
    { name: 'Send', icon: Send },
    { name: 'Phone', icon: Phone },
    { name: 'Share', icon: Share2 },
  ],
  interface: [
    { name: 'Settings', icon: Settings },
    { name: 'User', icon: User },
    { name: 'Edit', icon: Edit },
    { name: 'Plus', icon: Plus },
    { name: 'Check', icon: Check },
    { name: 'Close', icon: X },
  ],
  objects: [
    { name: 'Heart', icon: Heart },
    { name: 'Star', icon: Star },
    { name: 'Bookmark', icon: Bookmark },
    { name: 'Clock', icon: Clock },
    { name: 'Calendar', icon: Calendar },
    { name: 'Map Pin', icon: MapPin },
  ],
};

const featuredIcons: { name: string; icon: LucideIcon; size: 'sm' | 'md' | 'lg' }[] = [
  { name: 'Home', icon: Home, size: 'lg' },
  { name: 'Search', icon: Search, size: 'md' },
  { name: 'Settings', icon: Settings, size: 'md' },
  { name: 'Heart', icon: Heart, size: 'lg' },
  { name: 'Star', icon: Star, size: 'md' },
  { name: 'Bell', icon: Bell, size: 'sm' },
  { name: 'Mail', icon: Mail, size: 'md' },
  { name: 'User', icon: User, size: 'lg' },
  { name: 'Edit', icon: Edit, size: 'sm' },
  { name: 'Share', icon: Share2, size: 'md' },
  { name: 'Download', icon: Download, size: 'sm' },
  { name: 'Upload', icon: Upload, size: 'sm' },
];

export function IconShowcase({ className = '', variant = 'grid', iconSet = 'all' }: IconShowcaseProps) {
  if (variant === 'featured') {
    return (
      <div className={`${className}`}>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {featuredIcons.map((item, index) => {
            const Icon = item.icon;
            const sizeClass = item.size === 'lg' ? 'w-12 h-12' : item.size === 'md' ? 'w-10 h-10' : 'w-8 h-8';
            const iconSize = item.size === 'lg' ? 24 : item.size === 'md' ? 20 : 16;

            return (
              <motion.div
                key={item.name}
                className={`${sizeClass} flex items-center justify-center rounded-xl`}
                style={{ backgroundColor: 'hsl(var(--theme-card))' }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, backgroundColor: 'hsl(var(--theme-primary) / 0.1)' }}
              >
                <Icon
                  className="transition-colors"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                  size={iconSize}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  const categories = iconSet === 'all' ? iconCategories : { [iconSet]: iconCategories[iconSet] };

  if (variant === 'list') {
    return (
      <div className={`space-y-6 ${className}`}>
        {Object.entries(categories).map(([category, icons]) => (
          <div key={category}>
            <h4
              className="text-xs uppercase tracking-wide mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {icons.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'hsl(var(--theme-card))',
                      borderColor: 'hsl(var(--theme-border))',
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Icon className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                    <span className="text-xs" style={{ color: 'hsl(var(--theme-foreground))' }}>
                      {item.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className={`${className}`}>
      {Object.entries(categories).map(([category, icons]) => (
        <div key={category} className="mb-6 last:mb-0">
          <h4
            className="text-xs uppercase tracking-wide mb-3"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            {category}
          </h4>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {icons.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  className="aspect-square flex items-center justify-center rounded-lg border transition-colors group cursor-pointer"
                  style={{
                    backgroundColor: 'hsl(var(--theme-card))',
                    borderColor: 'hsl(var(--theme-border))',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: 'hsl(var(--theme-primary))',
                  }}
                  title={item.name}
                >
                  <Icon
                    className="w-5 h-5 transition-colors group-hover:text-white"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Compact inline icon display
export function IconRow({ className = '' }: { className?: string }) {
  const icons = [Home, Search, Heart, Star, Bell, Settings, User, Mail];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.2, color: 'hsl(var(--theme-primary))' }}
          className="cursor-pointer"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      ))}
    </div>
  );
}
