'use client';

/**
 * EnhancedChatInput - Chat input with / slash commands and @ context references
 *
 * Features:
 * - Type / to open slash command picker
 * - Type @ to open context reference picker
 * - Keyboard navigation in pickers
 * - Auto-insert command/reference text
 * - Works with both text input and textarea
 */

import React, {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { AnimatePresence } from 'framer-motion';
import { SlashCommandPicker } from './SlashCommandPicker';
import { ContextReferencePicker } from '@/components/design-canvas/ContextReferencePicker';
import type { ContextReference, ReferenceType } from '@/lib/canvas/artifacts';
import type { SlashCommand } from '@/lib/8gent/slash-command-registry';

// ============================================================================
// Types
// ============================================================================

interface EnhancedChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onCommandSelect?: (command: SlashCommand, args?: string) => void;
  onReferenceInserted?: (reference: ContextReference) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  multiline?: boolean;
  rows?: number;
  autoFocus?: boolean;
  style?: React.CSSProperties;
  'aria-label'?: string;
  includeOwnerCommands?: boolean;
}

export interface EnhancedChatInputHandle {
  focus: () => void;
  blur: () => void;
  getValue: () => string;
  insertText: (text: string) => void;
}

type PickerMode = 'none' | 'slash' | 'reference';

// ============================================================================
// Component
// ============================================================================

export const EnhancedChatInput = forwardRef<
  EnhancedChatInputHandle,
  EnhancedChatInputProps
>(function EnhancedChatInput(
  {
    value,
    onChange,
    onKeyDown,
    onCommandSelect,
    onReferenceInserted,
    placeholder = 'Message 8gent... Use / for commands, @ for context',
    disabled,
    className,
    multiline = false,
    rows = 1,
    autoFocus,
    style,
    'aria-label': ariaLabel,
    includeOwnerCommands = false,
  },
  ref
) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Picker state
  const [pickerMode, setPickerMode] = useState<PickerMode>('none');
  const [pickerPosition, setPickerPosition] = useState<{ x: number; y: number } | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ReferenceType | undefined>();
  const triggerPositionRef = useRef<number>(0);
  const cursorPositionRef = useRef<number>(0);

  // Track if we're in a picker-handled keydown
  const isPickerKeydownRef = useRef(false);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    getValue: () => value,
    insertText: (text: string) => {
      const input = inputRef.current;
      if (!input) return;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newValue = value.slice(0, start) + text + value.slice(end);
      onChange(newValue);
      // Set cursor after inserted text
      setTimeout(() => {
        input.setSelectionRange(start + text.length, start + text.length);
        input.focus();
      }, 0);
    },
  }));

  // Handle input change - detect / or @ triggers
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const input = e.target;
      const newValue = input.value;
      const cursorPos = input.selectionStart || 0;

      cursorPositionRef.current = cursorPos;
      onChange(newValue);

      const charBefore = newValue[cursorPos - 1];
      const charTwoBefore = newValue[cursorPos - 2];
      const isAtWordStart = !charTwoBefore || /\s/.test(charTwoBefore);

      // Get position for picker
      const getPickerPosition = () => {
        const rect = input.getBoundingClientRect();
        return {
          x: rect.left + 20,
          y: rect.bottom + 4,
        };
      };

      // Check for slash command trigger (/ at start of input or after space)
      if (charBefore === '/' && (cursorPos === 1 || isAtWordStart)) {
        triggerPositionRef.current = cursorPos - 1;
        setPickerMode('slash');
        setPickerPosition(getPickerPosition());
        setSearchQuery('');
        return;
      }

      // Check for @ reference trigger
      if (charBefore === '@' && isAtWordStart) {
        triggerPositionRef.current = cursorPos - 1;
        setPickerMode('reference');
        setPickerPosition(getPickerPosition());
        setSearchQuery('');
        setFilterType(undefined);
        return;
      }

      // Update search query if picker is open
      if (pickerMode !== 'none') {
        const textAfterTrigger = newValue.slice(triggerPositionRef.current + 1, cursorPos);

        // Check for type prefix in reference mode (e.g., @ticket: or @prd:)
        if (pickerMode === 'reference') {
          const colonIndex = textAfterTrigger.indexOf(':');
          if (colonIndex > 0) {
            const typePrefix = textAfterTrigger.slice(0, colonIndex) as ReferenceType;
            const validTypes: ReferenceType[] = [
              'ticket',
              'prd',
              'project',
              'task',
              'note',
              'canvas',
              'memory',
              'track',
              'file',
              'skill',
              'dimension',
              'tool',
            ];
            if (validTypes.includes(typePrefix)) {
              setFilterType(typePrefix);
              setSearchQuery(textAfterTrigger.slice(colonIndex + 1));
            } else {
              setFilterType(undefined);
              setSearchQuery(textAfterTrigger);
            }
          } else {
            setFilterType(undefined);
            setSearchQuery(textAfterTrigger);
          }
        } else {
          // Slash command search
          setSearchQuery(textAfterTrigger);
        }

        // Close picker if we've moved past the trigger context
        if (cursorPos <= triggerPositionRef.current || textAfterTrigger.includes(' ')) {
          setPickerMode('none');
        }
      }
    },
    [onChange, pickerMode]
  );

  // Handle slash command selection
  const handleCommandSelect = useCallback(
    (command: SlashCommand) => {
      const triggerPos = triggerPositionRef.current;
      const cursorPos = cursorPositionRef.current;

      // Build the command text
      let cmdText = `/${command.name}`;
      if (command.parameter) {
        cmdText += ' ';
      }

      // Replace from trigger position to current cursor position
      const before = value.slice(0, triggerPos);
      const after = value.slice(cursorPos);
      const newValue = `${before}${cmdText}${after}`;

      onChange(newValue);

      // Set cursor position after the command
      const newCursorPos = triggerPos + cmdText.length;
      setTimeout(() => {
        const input = inputRef.current;
        if (input) {
          input.setSelectionRange(newCursorPos, newCursorPos);
          input.focus();
        }
      }, 0);

      // Notify parent
      if (onCommandSelect) {
        onCommandSelect(command);
      }

      setPickerMode('none');
    },
    [value, onChange, onCommandSelect]
  );

  // Handle context reference selection
  const handleReferenceSelect = useCallback(
    (reference: ContextReference) => {
      const triggerPos = triggerPositionRef.current;
      const cursorPos = cursorPositionRef.current;

      // Build the reference text
      const refText = `@${reference.type}:${reference.displayName}`;

      // Replace from trigger position to current cursor position
      const before = value.slice(0, triggerPos);
      const after = value.slice(cursorPos);
      const newValue = `${before}${refText} ${after}`;

      onChange(newValue);

      // Set cursor position after the inserted reference
      const newCursorPos = triggerPos + refText.length + 1;
      setTimeout(() => {
        const input = inputRef.current;
        if (input) {
          input.setSelectionRange(newCursorPos, newCursorPos);
          input.focus();
        }
      }, 0);

      // Callback
      if (onReferenceInserted) {
        onReferenceInserted(reference);
      }

      setPickerMode('none');
    },
    [value, onChange, onReferenceInserted]
  );

  // Handle keyboard
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Let picker handle navigation keys when open
      if (pickerMode !== 'none') {
        if (['ArrowDown', 'ArrowUp', 'Tab', 'Escape'].includes(e.key)) {
          // Don't call preventDefault here - let the picker handle it
          isPickerKeydownRef.current = true;
          return;
        }

        // Handle Enter in picker
        if (e.key === 'Enter') {
          isPickerKeydownRef.current = true;
          return;
        }
      }

      // Close picker on Escape
      if (e.key === 'Escape' && pickerMode !== 'none') {
        e.preventDefault();
        setPickerMode('none');
        return;
      }

      // Pass through to parent handler
      if (onKeyDown) {
        onKeyDown(e);
      }
    },
    [pickerMode, onKeyDown]
  );

  // Close picker handlers
  const handleClosePicker = useCallback(() => {
    setPickerMode('none');
  }, []);

  // Common input props
  const commonProps = {
    ref: inputRef as React.Ref<HTMLInputElement & HTMLTextAreaElement>,
    value,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    placeholder,
    disabled,
    className,
    autoFocus,
    style,
    'aria-label': ariaLabel,
  };

  return (
    <div className="relative">
      {multiline ? (
        <textarea {...commonProps} rows={rows} />
      ) : (
        <input type="text" {...commonProps} />
      )}

      <AnimatePresence>
        {/* Slash Command Picker */}
        {pickerMode === 'slash' && (
          <div
            data-slash-picker
            className="fixed z-[100]"
            style={{
              left: pickerPosition?.x || 0,
              top: pickerPosition?.y || 0,
            }}
          >
            <SlashCommandPicker
              isOpen={true}
              onClose={handleClosePicker}
              onSelect={handleCommandSelect}
              searchQuery={searchQuery}
              includeOwnerOnly={includeOwnerCommands}
            />
          </div>
        )}

        {/* Context Reference Picker */}
        {pickerMode === 'reference' && (
          <div
            data-context-picker
            className="fixed z-[100]"
            style={{
              left: pickerPosition?.x || 0,
              top: pickerPosition?.y || 0,
            }}
          >
            <ContextReferencePicker
              isOpen={true}
              onClose={handleClosePicker}
              onSelect={handleReferenceSelect}
              searchQuery={searchQuery}
              filterType={filterType}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default EnhancedChatInput;
