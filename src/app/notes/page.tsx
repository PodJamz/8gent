import { NotesApp } from '@/components/notes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Quick capture notes with markdown support and folders',
};

export default function NotesPage() {
  return <NotesApp />;
}
