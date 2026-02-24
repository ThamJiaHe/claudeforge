import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prompt History',
  description: 'Browse and manage your previously generated Claude prompts.',
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
