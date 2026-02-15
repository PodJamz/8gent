// Force dynamic rendering - this page uses Clerk auth
export const dynamic = 'force-dynamic';

export default function MemoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
