'use client';

/**
 * useContextReferences - Hook for managing @mention context references in text inputs
 *
 * Features:
 * - Detects @ symbol and triggers picker
 * - Tracks cursor position for insertion
 * - Handles reference insertion into text
 * - Keyboard navigation support
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { ContextReference, ReferenceType } from '@/lib/canvas/artifacts';

interface UseContextReferencesOptions {
  onReferenceInserted?: (reference: ContextReference, newText: string) => void;
  triggerCharacter?: string;
}

interface UseContextReferencesReturn {
  // State
  isPickerOpen: boolean;
  pickerPosition: { x: number; y: number } | undefined;
  searchQuery: string;
  filterType: ReferenceType | undefined;

  // Actions
  openPicker: (position?: { x: number; y: number }) => void;
  closePicker: () => void;
  handleSelect: (reference: ContextReference) => void;

  // Input handlers
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    currentValue: string,
    setValue: (value: string) => void
  ) => void;
  handleKeyDown: (
    e: React.KeyboardEvent,
    isPickerOpen: boolean
  ) => boolean; // returns true if event was handled

  // Refs
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  cursorPositionRef: React.MutableRefObject<number>;
}

export function useContextReferences(
  options: UseContextReferencesOptions = {}
): UseContextReferencesReturn {
  const { onReferenceInserted, triggerCharacter = '@' } = options;

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerPosition, setPickerPosition] = useState<{ x: number; y: number } | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ReferenceType | undefined>();

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const cursorPositionRef = useRef<number>(0);
  const triggerPositionRef = useRef<number>(0);

  // Open picker at position
  const openPicker = useCallback((position?: { x: number; y: number }) => {
    setIsPickerOpen(true);
    setPickerPosition(position);
    setSearchQuery('');
    setFilterType(undefined);
  }, []);

  // Close picker
  const closePicker = useCallback(() => {
    setIsPickerOpen(false);
    setSearchQuery('');
    setFilterType(undefined);
  }, []);

  // Handle reference selection
  const handleSelect = useCallback((reference: ContextReference) => {
    const input = inputRef.current;
    if (!input) {
      closePicker();
      return;
    }

    // Get current value
    const currentValue = input.value;
    const triggerPos = triggerPositionRef.current;
    const cursorPos = cursorPositionRef.current;

    // Build the reference text
    const refText = `@${reference.type}:${reference.displayName}`;

    // Replace from trigger position to current cursor position
    const before = currentValue.slice(0, triggerPos);
    const after = currentValue.slice(cursorPos);
    const newValue = `${before}${refText} ${after}`;

    // Update the input value
    if ('value' in input) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set || Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, newValue);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    // Set cursor position after the inserted reference
    const newCursorPos = triggerPos + refText.length + 1;
    setTimeout(() => {
      input.setSelectionRange(newCursorPos, newCursorPos);
      input.focus();
    }, 0);

    // Callback
    if (onReferenceInserted) {
      onReferenceInserted(reference, newValue);
    }

    closePicker();
  }, [closePicker, onReferenceInserted]);

  // Handle input change - detect @ trigger
  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    currentValue: string,
    setValue: (value: string) => void
  ) => {
    const input = e.target;
    const value = input.value;
    const cursorPos = input.selectionStart || 0;

    cursorPositionRef.current = cursorPos;
    setValue(value);

    // Check if we just typed the trigger character
    const charBefore = value[cursorPos - 1];
    const charTwoBefore = value[cursorPos - 2];

    if (charBefore === triggerCharacter && (!charTwoBefore || /\s/.test(charTwoBefore))) {
      // Get position for picker
      const rect = input.getBoundingClientRect();
      // Approximate position (could be improved with caret position detection)
      const position = {
        x: rect.left + Math.min(cursorPos * 8, rect.width - 300),
        y: rect.bottom + 4,
      };

      triggerPositionRef.current = cursorPos - 1;
      openPicker(position);
    } else if (isPickerOpen) {
      // Update search query with text after @
      const textAfterTrigger = value.slice(triggerPositionRef.current + 1, cursorPos);

      // Check for type prefix like @ticket: or @prd:
      const colonIndex = textAfterTrigger.indexOf(':');
      if (colonIndex > 0) {
        const typePrefix = textAfterTrigger.slice(0, colonIndex) as ReferenceType;
        const validTypes: ReferenceType[] = ['ticket', 'prd', 'project', 'task', 'note', 'canvas', 'memory', 'track', 'file'];
        if (validTypes.includes(typePrefix)) {
          setFilterType(typePrefix);
          setSearchQuery(textAfterTrigger.slice(colonIndex + 1));
        } else {
          setSearchQuery(textAfterTrigger);
        }
      } else {
        setSearchQuery(textAfterTrigger);
      }

      // Close picker if we've moved past the trigger context
      if (cursorPos <= triggerPositionRef.current || textAfterTrigger.includes(' ')) {
        closePicker();
      }
    }
  }, [triggerCharacter, isPickerOpen, openPicker, closePicker]);

  // Handle keyboard navigation in picker
  const handleKeyDown = useCallback((
    e: React.KeyboardEvent,
    pickerOpen: boolean
  ): boolean => {
    if (!pickerOpen) return false;

    // These keys are handled by the picker
    if (['ArrowDown', 'ArrowUp', 'Tab', 'Enter'].includes(e.key)) {
      // Don't prevent default - let the picker handle it
      return true;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      closePicker();
      return true;
    }

    return false;
  }, [closePicker]);

  // Close picker on click outside
  useEffect(() => {
    if (!isPickerOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-context-picker]') && target !== inputRef.current) {
        closePicker();
      }
    };

    document.addEventListener('mousedown', handleClickOutside as any);
    return () => document.removeEventListener('mousedown', handleClickOutside as any);
  }, [isPickerOpen, closePicker]);

  return {
    isPickerOpen,
    pickerPosition,
    searchQuery,
    filterType,
    openPicker,
    closePicker,
    handleSelect,
    handleInputChange,
    handleKeyDown,
    inputRef: inputRef as React.RefObject<HTMLInputElement | HTMLTextAreaElement>,
    cursorPositionRef,
  };
}

export default useContextReferences;
