'use client';

import { useState, useCallback, useRef } from 'react';

export interface FileAttachment {
  id: string;
  file: File;
  name: string;
  type: string;
  size: number;
  preview?: string; // Base64 data URL for images
}

export interface UseFileAttachmentOptions {
  maxFiles?: number;
  maxSizeBytes?: number;
  acceptedTypes?: string[];
  onError?: (error: string) => void;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_MAX_FILES = 5;
const DEFAULT_ACCEPTED_TYPES = [
  'image/*',
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/json',
  'text/csv',
];

export function useFileAttachment(options: UseFileAttachmentOptions = {}) {
  const {
    maxFiles = DEFAULT_MAX_FILES,
    maxSizeBytes = DEFAULT_MAX_SIZE,
    acceptedTypes = DEFAULT_ACCEPTED_TYPES,
    onError,
  } = options;

  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => `attach_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const isAcceptedType = useCallback((file: File): boolean => {
    return acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return file.type.startsWith(`${category}/`);
      }
      return file.type === type;
    });
  }, [acceptedTypes]);

  const createPreview = useCallback((file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(undefined);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    });
  }, []);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // Check max files limit
    if (attachments.length + fileArray.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsProcessing(true);

    const newAttachments: FileAttachment[] = [];

    for (const file of fileArray) {
      // Validate file type
      if (!isAcceptedType(file)) {
        onError?.(`File type not supported: ${file.type || 'unknown'}`);
        continue;
      }

      // Validate file size
      if (file.size > maxSizeBytes) {
        const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
        onError?.(`File too large: ${file.name} (max ${maxSizeMB}MB)`);
        continue;
      }

      const preview = await createPreview(file);

      newAttachments.push({
        id: generateId(),
        file,
        name: file.name,
        type: file.type,
        size: file.size,
        preview,
      });
    }

    setAttachments(prev => [...prev, ...newAttachments]);
    setIsProcessing(false);
  }, [attachments.length, maxFiles, maxSizeBytes, isAcceptedType, createPreview, onError]);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  }, []);

  const clearAttachments = useCallback(() => {
    setAttachments([]);
  }, []);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  }, [addFiles]);

  // Format file size for display
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  // Get files ready for upload (as FormData-compatible array)
  const getFilesForUpload = useCallback(() => {
    return attachments.map(a => a.file);
  }, [attachments]);

  // Convert attachments to base64 for API calls
  const getAttachmentsAsBase64 = useCallback(async (): Promise<Array<{
    name: string;
    type: string;
    data: string;
  }>> => {
    const results = await Promise.all(
      attachments.map(async (attachment) => {
        const data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(attachment.file);
        });

        return {
          name: attachment.name,
          type: attachment.type,
          data,
        };
      })
    );

    return results;
  }, [attachments]);

  return {
    attachments,
    isProcessing,
    fileInputRef,
    addFiles,
    removeAttachment,
    clearAttachments,
    openFilePicker,
    handleFileInputChange,
    formatFileSize,
    getFilesForUpload,
    getAttachmentsAsBase64,
    hasAttachments: attachments.length > 0,
    acceptedTypesString: acceptedTypes.join(','),
  };
}
