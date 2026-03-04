'use client';

import { useEffect, useMemo, useRef } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from '@codemirror/view';
import { EditorState, Extension } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { python } from '@codemirror/lang-python';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, indentOnInput } from '@codemirror/language';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { lintKeymap } from '@codemirror/lint';

interface CodeEditorProps {
  fileName: string;
  initialValue?: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}

function getLanguageExtension(fileName: string): Extension {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  switch (ext) {
    case 'js':
    case 'jsx':
      return javascript({ jsx: true });
    case 'ts':
    case 'tsx':
      return javascript({ jsx: true, typescript: true });
    case 'css':
    case 'scss':
    case 'sass':
      return css();
    case 'html':
    case 'htm':
      return html();
    case 'json':
      return json();
    case 'md':
    case 'mdx':
      return markdown();
    case 'py':
      return python();
    default:
      return javascript();
  }
}

// Custom dark theme to match our UI
const customTheme = EditorView.theme({
  '&': {
    backgroundColor: '#0d1117',
    color: '#c9d1d9',
    height: '100%',
  },
  '.cm-content': {
    caretColor: '#f97316',
    fontFamily: 'var(--font-mono, ui-monospace, monospace)',
    fontSize: '13px',
    lineHeight: '1.6',
    padding: '12px 0',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#f97316',
  },
  '.cm-selectionBackground, ::selection': {
    backgroundColor: '#264f78',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  '.cm-gutters': {
    backgroundColor: '#0d1117',
    color: '#484f58',
    border: 'none',
    paddingRight: '8px',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 12px 0 20px',
    minWidth: '40px',
  },
  '.cm-foldGutter .cm-gutterElement': {
    padding: '0 4px',
  },
  '.cm-tooltip': {
    backgroundColor: '#1c2128',
    border: '1px solid #30363d',
    borderRadius: '6px',
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li': {
      padding: '4px 8px',
    },
    '& > ul > li[aria-selected]': {
      backgroundColor: '#264f78',
    },
  },
  '.cm-searchMatch': {
    backgroundColor: '#ffd33d33',
    outline: '1px solid #ffd33d66',
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: '#ffd33d66',
  },
  '&.cm-focused .cm-matchingBracket': {
    backgroundColor: '#264f78',
    outline: '1px solid #58a6ff',
  },
});

export function CodeEditor({
  fileName,
  initialValue = '',
  onChange,
  readOnly = false,
  className = '',
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const languageExtension = useMemo(() => getLanguageExtension(fileName), [fileName]);

  useEffect(() => {
    if (!editorRef.current) return;

    const extensions: Extension[] = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...completionKeymap,
        ...lintKeymap,
        indentWithTab,
      ]),
      oneDark,
      customTheme,
      languageExtension,
      indentationMarkers(),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChange(update.state.doc.toString());
        }
      }),
    ];

    if (readOnly) {
      extensions.push(EditorState.readOnly.of(true));
    }

    const state = EditorState.create({
      doc: initialValue,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageExtension, readOnly]);

  // Update content when initialValue changes externally
  useEffect(() => {
    if (viewRef.current) {
      const currentContent = viewRef.current.state.doc.toString();
      if (currentContent !== initialValue) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentContent.length,
            insert: initialValue,
          },
        });
      }
    }
  }, [initialValue]);

  return (
    <div
      ref={editorRef}
      className={`w-full h-full overflow-auto bg-[#0d1117] ${className}`}
    />
  );
}

export default CodeEditor;
