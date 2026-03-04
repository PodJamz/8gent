'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Users,
  Trash2,
  Download,
  Copy,
  ExternalLink,
  Edit3,
  Check,
  X,
  Building2,
  MapPin,
  MessageSquare,
  Linkedin,
  Mail,
  Github,
} from 'lucide-react';
import type { ShortlistItem, ShortlistTag, SocialLinks } from '@/lib/humans/types';
import { TAG_LABELS, TAG_COLORS } from '@/lib/humans/types';
import { getXUrl } from '@/lib/humans/search-provider';

// X/Twitter icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Social link button for quick access - keeps branded colors
function SocialLinkButton({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${color}`}
      title={label}
    >
      {icon}
    </a>
  );
}

interface ShortlistPanelProps {
  items: ShortlistItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ShortlistItem>) => void;
  onClear: () => void;
  onExportMarkdown: () => string;
  onCopyToClipboard: () => Promise<void>;
}

interface ShortlistCardProps {
  item: ShortlistItem;
  index: number;
  onRemove: () => void;
  onUpdate: (updates: Partial<ShortlistItem>) => void;
}

function ShortlistCard({ item, index, onRemove, onUpdate }: ShortlistCardProps) {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(item.notes);
  const prefersReducedMotion = useReducedMotion();

  const handleSaveNote = () => {
    onUpdate({ notes: noteText });
    setIsEditingNote(false);
  };

  const handleCancelNote = () => {
    setNoteText(item.notes);
    setIsEditingNote(false);
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
      transition={{ delay: index * 0.03 }}
      className="p-4 rounded-2xl"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        border: '1px solid hsl(var(--theme-border) / 0.5)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-sm truncate"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            {item.name}
          </h3>
          {item.title && (
            <p
              className="text-xs truncate"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {item.title}
            </p>
          )}
        </div>

        <button
          onClick={onRemove}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all flex-shrink-0 hover:text-rose-400"
          style={{
            backgroundColor: 'hsl(var(--theme-secondary) / 0.5)',
            color: 'hsl(var(--theme-muted-foreground))',
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Meta */}
      <div
        className="flex items-center gap-3 text-xs mb-3"
        style={{ color: 'hsl(var(--theme-muted-foreground))' }}
      >
        {item.company && (
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {item.company}
          </span>
        )}
        {item.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {item.location}
          </span>
        )}
      </div>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.tags.map(tag => (
            <span
              key={tag}
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${TAG_COLORS[tag]}`}
            >
              {TAG_LABELS[tag]}
            </span>
          ))}
        </div>
      )}

      {/* Notes */}
      <div className="mb-3">
        {isEditingNote ? (
          <div className="space-y-2">
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add a note..."
              className="w-full px-3 py-2 rounded-lg text-xs resize-none focus:outline-none"
              style={{
                backgroundColor: 'hsl(var(--theme-secondary) / 0.5)',
                border: '1px solid hsl(var(--theme-border))',
                color: 'hsl(var(--theme-foreground))',
              }}
              rows={3}
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveNote}
                className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1 hover:bg-emerald-500/30 transition-all"
              >
                <Check className="w-3 h-3" />
                Save
              </button>
              <button
                onClick={handleCancelNote}
                className="px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all"
                style={{
                  backgroundColor: 'hsl(var(--theme-secondary))',
                  color: 'hsl(var(--theme-muted-foreground))',
                }}
              >
                <X className="w-3 h-3" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsEditingNote(true)}
            className="w-full flex items-start gap-2 p-2 rounded-lg text-left transition-all"
            style={{
              backgroundColor: 'hsl(var(--theme-secondary) / 0.3)',
              border: '1px solid hsl(var(--theme-border) / 0.3)',
            }}
          >
            <MessageSquare
              className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            />
            {item.notes ? (
              <span
                className="text-xs line-clamp-2"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                {item.notes}
              </span>
            ) : (
              <span
                className="text-xs italic opacity-50"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                Add a note...
              </span>
            )}
          </button>
        )}
      </div>

      {/* Social Links - Quick Connect (keeps branded colors) */}
      <div className="flex flex-wrap items-center gap-1.5">
        {item.socialLinks?.linkedin && (
          <SocialLinkButton
            href={item.socialLinks.linkedin}
            icon={<Linkedin className="w-3 h-3" />}
            label="LinkedIn"
            color="bg-[#0077B5]/20 text-[#0077B5] hover:bg-[#0077B5]/30"
          />
        )}
        {item.socialLinks?.x && (
          <SocialLinkButton
            href={getXUrl(item.socialLinks.x)}
            icon={<XIcon className="w-2.5 h-2.5" />}
            label={`@${item.socialLinks.x}`}
            color="bg-[hsl(var(--theme-secondary))] text-[hsl(var(--theme-foreground))] opacity-70 hover:opacity-100"
          />
        )}
        {item.socialLinks?.email && (
          <SocialLinkButton
            href={`mailto:${item.socialLinks.email}`}
            icon={<Mail className="w-3 h-3" />}
            label={item.socialLinks.email}
            color="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
          />
        )}
        {item.socialLinks?.github && (
          <SocialLinkButton
            href={item.socialLinks.github}
            icon={<Github className="w-3 h-3" />}
            label="GitHub"
            color="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
          />
        )}
        {/* Fallback source link if no social links */}
        {!item.socialLinks?.linkedin && !item.socialLinks?.x && !item.socialLinks?.email && item.links.length > 0 && (
          <a
            href={item.links[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-all"
            style={{
              backgroundColor: 'hsl(var(--theme-secondary) / 0.5)',
              color: 'hsl(var(--theme-muted-foreground))',
            }}
          >
            <ExternalLink className="w-3 h-3" />
            Source
          </a>
        )}
      </div>
    </motion.div>
  );
}

export function ShortlistPanel({
  items,
  onRemove,
  onUpdate,
  onClear,
  onExportMarkdown,
  onCopyToClipboard,
}: ShortlistPanelProps) {
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleCopy = async () => {
    await onCopyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const markdown = onExportMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `humans-shortlist-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <h2
            className="font-semibold text-sm"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            Shortlist
          </h2>
          <span
            className="px-2 py-0.5 rounded-full text-xs"
            style={{
              backgroundColor: 'hsl(var(--theme-secondary))',
              color: 'hsl(var(--theme-muted-foreground))',
            }}
          >
            {items.length}
          </span>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2">
            {showClearConfirm ? (
              <div className="flex items-center gap-2">
                <span
                  className="text-xs"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  Clear all?
                </span>
                <button
                  onClick={() => {
                    onClear();
                    setShowClearConfirm(false);
                  }}
                  className="px-2 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-medium hover:bg-rose-500/30 transition-all"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: 'hsl(var(--theme-secondary))',
                    color: 'hsl(var(--theme-muted-foreground))',
                  }}
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="transition-colors hover:text-rose-400"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 -mx-4 px-4">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <Users
                className="w-10 h-10 mb-3 opacity-20"
                style={{ color: 'hsl(var(--theme-foreground))' }}
              />
              <p
                className="text-sm mb-1 opacity-60"
                style={{ color: 'hsl(var(--theme-foreground))' }}
              >
                No people saved yet
              </p>
              <p
                className="text-xs opacity-40"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                Add people from search results
              </p>
            </motion.div>
          ) : (
            items.map((item, index) => (
              <ShortlistCard
                key={item.id}
                item={item}
                index={index}
                onRemove={() => onRemove(item.id)}
                onUpdate={updates => onUpdate(item.id, updates)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Export Actions */}
      {items.length > 0 && (
        <div
          className="pt-4 mt-4 space-y-2"
          style={{ borderTop: '1px solid hsl(var(--theme-border) / 0.5)' }}
        >
          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
            style={{
              backgroundColor: 'hsl(var(--theme-secondary) / 0.5)',
              border: '1px solid hsl(var(--theme-border))',
              color: 'hsl(var(--theme-foreground) / 0.7)',
            }}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
            style={{
              backgroundColor: 'hsl(var(--theme-primary) / 0.1)',
              border: '1px solid hsl(var(--theme-primary) / 0.3)',
              color: 'hsl(var(--theme-primary))',
            }}
          >
            <Download className="w-4 h-4" />
            Download Markdown
          </button>
        </div>
      )}
    </div>
  );
}
