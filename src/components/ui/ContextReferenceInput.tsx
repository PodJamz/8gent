'use client';

/**
 * ContextReferenceInput - Input wrapper with @mention context reference support
 *
 * Wrap any text input or textarea with this component to add @mention support
 * for referencing tickets, PRDs, projects, tasks, etc.
 */

import React, { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ContextReferencePicker } from '@/components/design-canvas/ContextReferencePicker';
import type { ContextReference, ReferenceType } from '@/lib/canvas/artifacts';

interface ContextReferenceInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onReferenceInserted?: (reference: ContextReference) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  multiline?: boolean;
  rows?: number;
  autoFocus?: boolean;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

export interface ContextReferenceInputHandle {
  focus: () => void;
  blur: () => void;
  getValue: () => string;
}

export const ContextReferenceInput = forwardRef<ContextReferenceInputHandle, ContextReferenceInputProps>(
  function ContextReferenceInput(
    {
      value,
      onChange,
      onKeyDown,
      onReferenceInserted,
      placeholder,
      disabled,
      className,
      multiline = false,
      rows = 1,
      autoFocus,
      style,
      'aria-label': ariaLabel,
    },
    ref
  ) {
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerPosition, setPickerPosition] = useState<{ x: number; y: number } | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<ReferenceType | undefined>();
    const triggerPositionRef = useRef<number>(0);
    const cursorPositionRef = useRef<number>(0);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      getValue: () => value,
    }));

    // Handle input change - detect @ trigger
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const input = e.target;
      const newValue = input.value;
      const cursorPos = input.selectionStart || 0;

      cursorPositionRef.current = cursorPos;
      onChange(newValue);

      // Check if we just typed @
      const charBefore = newValue[cursorPos - 1];
      const charTwoBefore = newValue[cursorPos - 2];

      if (charBefore === '@' && (!charTwoBefore || /\s/.test(charTwoBefore))) {
        // Get position for picker
        const rect = input.getBoundingClientRect();
        const position = {
          x: rect.left + 20,
          y: rect.bottom + 4,
        };

        triggerPositionRef.current = cursorPos - 1;
        setIsPickerOpen(true);
        setPickerPosition(position);
        setSearchQuery('');
        setFilterType(undefined);
      } else if (isPickerOpen) {
        // Update search query with text after @
        const textAfterTrigger = newValue.slice(triggerPositionRef.current + 1, cursorPos);

        // Check for type prefix like @ticket: or @prd:
        const colonIndex = textAfterTrigger.indexOf(':');
        if (colonIndex > 0) {
          const typePrefix = textAfterTrigger.slice(0, colonIndex) as ReferenceType;
          const validTypes: ReferenceType[] = ['ticket', 'prd', 'project', 'task', 'note', 'canvas', 'memory', 'track', 'file', 'skill', 'dimension', 'tool'];
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

        // Close picker if we've moved past the trigger context
        if (cursorPos <= triggerPositionRef.current || textAfterTrigger.includes(' ')) {
          setIsPickerOpen(false);
        }
      }
    }, [onChange, isPickerOpen]);

    // Handle reference selection
    const handleSelect = useCallback((reference: ContextReference) => {
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

      setIsPickerOpen(false);
    }, [value, onChange, onReferenceInserted]);

    // Handle keyboard
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (isPickerOpen && e.key === 'Escape') {
        e.preventDefault();
        setIsPickerOpen(false);
        return;
      }

      // Pass through to parent handler
      if (onKeyDown) {
        onKeyDown(e);
      }
    }, [isPickerOpen, onKeyDown]);

    // Close picker handler
    const handleClosePicker = useCallback(() => {
      setIsPickerOpen(false);
    }, []);

    const commonProps = {
      ref: inputRef as any,
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
          {isPickerOpen && (
            <div
              data-context-picker
              className="fixed z-[100]"
              style={{
                left: pickerPosition?.x || 0,
                top: pickerPosition?.y || 0,
              }}
            >
              <ContextReferencePicker
                isOpen={isPickerOpen}
                onClose={handleClosePicker}
                onSelect={handleSelect}
                searchQuery={searchQuery}
                filterType={filterType}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

export default ContextReferenceInput;
