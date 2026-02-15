'use client';

import { Paperclip, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileAttachment } from '@/hooks/useFileAttachment';

interface AttachmentButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'glass' | 'minimal';
  className?: string;
}

export function AttachmentButton({
  onClick,
  disabled,
  variant = 'default',
  className = '',
}: AttachmentButtonProps) {
  const baseStyles = 'p-2 rounded-lg transition-all flex-shrink-0';

  const variantStyles = {
    default: 'hover:bg-muted',
    glass: 'hover:bg-white/10',
    minimal: 'hover:opacity-80',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ color: 'hsl(var(--theme-muted-foreground))' }}
      title="Attach file"
      aria-label="Attach file"
    >
      <Paperclip className="w-5 h-5" />
    </button>
  );
}

interface AttachmentPreviewProps {
  attachments: FileAttachment[];
  onRemove: (id: string) => void;
  formatFileSize: (bytes: number) => string;
  variant?: 'default' | 'glass' | 'compact';
  className?: string;
}

export function AttachmentPreview({
  attachments,
  onRemove,
  formatFileSize,
  variant = 'default',
  className = '',
}: AttachmentPreviewProps) {
  if (attachments.length === 0) return null;

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type === 'application/pdf' || type.startsWith('text/')) return FileText;
    return File;
  };

  const containerStyles = {
    default: 'bg-muted/50 border border-border/50',
    glass: 'bg-white/5 border border-white/10',
    compact: 'bg-transparent',
  };

  return (
    <div className={`flex flex-wrap gap-2 p-2 rounded-lg ${containerStyles[variant]} ${className}`}>
      <AnimatePresence mode="popLayout">
        {attachments.map((attachment) => {
          const FileIcon = getFileIcon(attachment.type);

          return (
            <motion.div
              key={attachment.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
            >
              {attachment.preview ? (
                // Image preview
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={attachment.preview}
                    alt={attachment.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ) : (
                // File preview
                <div
                  className="w-16 h-16 rounded-lg flex flex-col items-center justify-center gap-1 p-1"
                  style={{
                    background: variant === 'glass'
                      ? 'rgba(255,255,255,0.1)'
                      : 'hsl(var(--theme-muted))',
                  }}
                >
                  <FileIcon className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <span
                    className="text-[9px] truncate w-full text-center"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    {attachment.name.length > 10
                      ? `${attachment.name.slice(0, 8)}...`
                      : attachment.name}
                  </span>
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(attachment.id)}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'hsl(0 84% 60%)',
                  color: 'white',
                }}
                aria-label={`Remove ${attachment.name}`}
              >
                <X className="w-3 h-3" />
              </button>

              {/* File size tooltip */}
              <div
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                {formatFileSize(attachment.size)}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

interface HiddenFileInputProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  multiple?: boolean;
}

export function HiddenFileInput({
  inputRef,
  onChange,
  accept,
  multiple = true,
}: HiddenFileInputProps) {
  return (
    <input
      ref={inputRef}
      type="file"
      onChange={onChange}
      accept={accept}
      multiple={multiple}
      className="hidden"
      aria-hidden="true"
    />
  );
}
