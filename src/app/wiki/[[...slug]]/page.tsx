import { notFound } from 'next/navigation';
import { getDocsTree, getDocByPath, getBreadcrumbs, type DocNode } from '@/lib/docs';
import WikiPageClient from './WikiPageClient';

interface WikiPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function WikiPage({ params }: WikiPageProps) {
  const { slug } = await params;
  // Root wiki page uses 'index' (which maps to README.md)
  const docPath = slug?.join('/') || 'index';

  // Get docs tree for sidebar
  const { nodes: tree } = getDocsTree();

  // Get the specific doc
  let doc = getDocByPath(docPath);

  // If no specific doc found and this is the root, try 'index'
  if (!doc && (!slug || slug.length === 0)) {
    doc = getDocByPath('index');
  }

  if (!doc) {
    notFound();
  }

  // Get breadcrumbs
  const breadcrumbs = getBreadcrumbs(docPath);

  return (
    <WikiPageClient
      doc={doc}
      tree={tree}
      breadcrumbs={breadcrumbs}
    />
  );
}

// Generate static paths for all docs
export async function generateStaticParams() {
  const { flatList } = getDocsTree();

  return [
    { slug: [] }, // Root /wiki
    ...flatList.map(doc => ({
      slug: doc.path.split('/').filter(Boolean),
    })),
  ];
}

export const dynamicParams = true;
