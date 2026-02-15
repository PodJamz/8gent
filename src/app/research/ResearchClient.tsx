"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "@/lib/openclaw/hooks";
import { api } from '@/lib/convex-shim';
import { Id } from "../../../convex/_generated/dataModel";
import { PageTransition } from "@/components/ios/PageTransition";
import {
  Globe,
  Search,
  Plus,
  FolderPlus,
  Bookmark,
  Star,
  Archive,
  ExternalLink,
  MoreHorizontal,
  Loader2,
  BookOpen,
  CheckCircle2,
  Clock,
  Github,
  FileText,
  Video,
  Image as ImageIcon,
  Package,
  Code,
  Users,
  Building2,
  Link2,
  StickyNote,
  Trash2,
  FolderOpen,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";

type ContentType =
  | "article"
  | "github_repo"
  | "github_readme"
  | "github_file"
  | "documentation"
  | "video"
  | "tweet"
  | "image"
  | "pdf"
  | "code_snippet"
  | "api_docs"
  | "package"
  | "person"
  | "company"
  | "product"
  | "bookmark"
  | "note"
  | "other";

type Status = "saved" | "reading" | "completed" | "archived";

interface ResearchItem {
  _id: Id<"researchItems">;
  title: string;
  sourceUrl: string;
  sourceDomain: string;
  sourceTitle?: string;
  sourceFavicon?: string;
  contentType: ContentType;
  summary?: string;
  notes?: string;
  tags: string[];
  excerpt?: string;
  thumbnailUrl?: string;
  status: Status;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
  githubData?: {
    owner: string;
    repo: string;
    stars?: number;
    forks?: number;
    language?: string;
    description?: string;
    topics?: string[];
  };
  aiSummary?: string;
}

interface ResearchCollection {
  _id: Id<"researchCollections">;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  itemCount: number;
  isPinned: boolean;
}

const contentTypeIcons: Record<ContentType, typeof Globe> = {
  article: FileText,
  github_repo: Github,
  github_readme: Github,
  github_file: Github,
  documentation: BookOpen,
  video: Video,
  tweet: Globe,
  image: ImageIcon,
  pdf: FileText,
  code_snippet: Code,
  api_docs: Code,
  package: Package,
  person: Users,
  company: Building2,
  product: Package,
  bookmark: Bookmark,
  note: StickyNote,
  other: Link2,
};

const statusIcons: Record<Status, typeof Clock> = {
  saved: Bookmark,
  reading: BookOpen,
  completed: CheckCircle2,
  archived: Archive,
};

export function ResearchClient() {
  const { user, isLoaded } = useUser();
  const [activeView, setActiveView] = useState<"all" | "collections" | "favorites">("all");
  const [selectedCollection, setSelectedCollection] = useState<Id<"researchCollections"> | null>(null);
  const [selectedItem, setSelectedItem] = useState<ResearchItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [showNewCollectionDialog, setShowNewCollectionDialog] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [filterType, setFilterType] = useState<ContentType | "all">("all");

  // Convex queries
  const collections = useQuery(
    api.research.getCollections,
    user ? { ownerId: user.id } : "skip"
  );

  const items = useQuery(
    api.research.getResearchItems,
    user
      ? {
          ownerId: user.id,
          collectionId: selectedCollection ?? undefined,
          favoritesOnly: activeView === "favorites",
        }
      : "skip"
  );

  const stats = useQuery(api.research.getResearchStats, user ? { ownerId: user.id } : "skip");

  // Convex mutations
  const createItem = useMutation(api.research.createResearchItem);
  const updateItem = useMutation(api.research.updateResearchItem);
  const deleteItem = useMutation(api.research.deleteResearchItem);
  const createCollection = useMutation(api.research.createCollection);

  // Filter and search items
  const filteredItems = items?.filter((item) => {
    if (filterType !== "all" && item.contentType !== filterType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.sourceDomain.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Handle URL scraping
  const handleScrapeUrl = useCallback(async () => {
    if (!urlInput.trim() || !user) return;

    setIsScraping(true);
    try {
      const response = await fetch("/api/research/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to scrape URL");
      }

      const data = await response.json();

      // Create research item with scraped data
      await createItem({
        ownerId: user.id,
        collectionId: selectedCollection ?? undefined,
        sourceUrl: data.url,
        sourceDomain: data.domain,
        sourceTitle: data.title,
        sourceFavicon: data.favicon,
        contentType: data.contentType || "bookmark",
        title: data.title || urlInput,
        summary: data.summary,
        content: data.content,
        excerpt: data.excerpt,
        thumbnailUrl: data.thumbnail,
        images: data.images,
        githubData: data.githubData,
        videoData: data.videoData,
        packageData: data.packageData,
        aiSummary: data.aiSummary,
        aiKeywords: data.aiKeywords,
        tags: data.tags || [],
      });

      setUrlInput("");
      setIsAddingUrl(false);
    } catch (error) {
      console.error("Scraping error:", error);
    } finally {
      setIsScraping(false);
    }
  }, [urlInput, user, createItem, selectedCollection]);

  // Handle create collection
  const handleCreateCollection = useCallback(async () => {
    if (!newCollectionName.trim() || !user) return;

    await createCollection({
      ownerId: user.id,
      name: newCollectionName.trim(),
    });

    setNewCollectionName("");
    setShowNewCollectionDialog(false);
  }, [newCollectionName, user, createCollection]);

  // Handle toggle favorite
  const handleToggleFavorite = useCallback(
    async (item: ResearchItem) => {
      await updateItem({
        itemId: item._id,
        isFavorite: !item.isFavorite,
      });
    },
    [updateItem]
  );

  // Handle update status
  const handleUpdateStatus = useCallback(
    async (item: ResearchItem, status: Status) => {
      await updateItem({
        itemId: item._id,
        status,
      });
    },
    [updateItem]
  );

  // Handle delete item
  const handleDeleteItem = useCallback(
    async (item: ResearchItem) => {
      if (confirm("Delete this research item?")) {
        await deleteItem({ itemId: item._id });
        if (selectedItem?._id === item._id) {
          setSelectedItem(null);
        }
      }
    },
    [deleteItem, selectedItem]
  );

  if (!isLoaded) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
        </div>
      </PageTransition>
    );
  }

  if (!user) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <Globe className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">Sign in to access Research</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {selectedItem ? (
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : selectedCollection ? (
                <button
                  onClick={() => setSelectedCollection(null)}
                  className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : null}
              <div className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-400" />
                <h1 className="text-lg font-semibold">Research</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddingUrl(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          {!selectedItem && (
            <div className="px-4 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search research..."
                  className="w-full bg-white/10 rounded-lg pl-10 pr-4 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          )}

          {/* Navigation tabs */}
          {!selectedItem && !selectedCollection && (
            <div className="flex gap-1 px-4 pb-3">
              {(["all", "collections", "favorites"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeView === view
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="pb-20">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              // Item detail view
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4"
              >
                <ItemDetail
                  item={selectedItem}
                  onToggleFavorite={() => handleToggleFavorite(selectedItem)}
                  onUpdateStatus={(status) => handleUpdateStatus(selectedItem, status)}
                  onDelete={() => handleDeleteItem(selectedItem)}
                />
              </motion.div>
            ) : activeView === "collections" ? (
              // Collections view
              <motion.div
                key="collections"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 space-y-4"
              >
                {/* Stats */}
                {stats && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold">{stats.totalItems}</p>
                      <p className="text-xs text-white/40">Items</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold">{stats.totalCollections}</p>
                      <p className="text-xs text-white/40">Collections</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold">{stats.favorites}</p>
                      <p className="text-xs text-white/40">Favorites</p>
                    </div>
                  </div>
                )}

                {/* New collection button */}
                <button
                  onClick={() => setShowNewCollectionDialog(true)}
                  className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <FolderPlus className="w-5 h-5 text-blue-400" />
                  <span className="text-white/80">New Collection</span>
                </button>

                {/* Collections list */}
                <div className="space-y-2">
                  {collections?.map((collection) => (
                    <button
                      key={collection._id}
                      onClick={() => {
                        setSelectedCollection(collection._id);
                        setActiveView("all");
                      }}
                      className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: collection.color + "20" }}
                        >
                          <FolderOpen className="w-5 h-5" style={{ color: collection.color }} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{collection.name}</p>
                          <p className="text-sm text-white/40">{collection.itemCount} items</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/40" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              // Items list view
              <motion.div
                key="items"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 space-y-3"
              >
                {/* Content type filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  {["all", "github_repo", "article", "documentation", "video", "package"].map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type as ContentType | "all")}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                          filterType === type
                            ? "bg-blue-500 text-white"
                            : "bg-white/10 text-white/60 hover:bg-white/20"
                        }`}
                      >
                        {type === "all" ? "All" : type.replace("_", " ")}
                      </button>
                    )
                  )}
                </div>

                {/* Items list */}
                {filteredItems?.length === 0 ? (
                  <div className="text-center py-12">
                    <Globe className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40">No research items yet</p>
                    <button
                      onClick={() => setIsAddingUrl(true)}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      Add your first item
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredItems?.map((item) => (
                      <ItemCard
                        key={item._id}
                        item={item as ResearchItem}
                        onSelect={() => setSelectedItem(item as ResearchItem)}
                        onToggleFavorite={() => handleToggleFavorite(item as ResearchItem)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Add URL Dialog */}
        <AnimatePresence>
          {isAddingUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
              onClick={() => setIsAddingUrl(false)}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="w-full max-w-md bg-zinc-900 rounded-2xl p-6 space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Add Research</h2>
                  <button
                    onClick={() => setIsAddingUrl(false)}
                    className="p-2 hover:bg-white/10 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Enter URL to scrape..."
                    className="w-full bg-white/10 rounded-xl pl-11 pr-4 py-3 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleScrapeUrl();
                    }}
                  />
                </div>

                <button
                  onClick={handleScrapeUrl}
                  disabled={!urlInput.trim() || isScraping}
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-xl py-3 font-medium transition-colors"
                >
                  {isScraping ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Scraping...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Scrape & Save
                    </>
                  )}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Collection Dialog */}
        <AnimatePresence>
          {showNewCollectionDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
              onClick={() => setShowNewCollectionDialog(false)}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="w-full max-w-md bg-zinc-900 rounded-2xl p-6 space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-semibold">New Collection</h2>

                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name..."
                  className="w-full bg-white/10 rounded-xl px-4 py-3 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateCollection();
                  }}
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowNewCollectionDialog(false)}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCollection}
                    disabled={!newCollectionName.trim()}
                    className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-xl font-medium transition-colors"
                  >
                    Create
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

// Item Card Component
function ItemCard({
  item,
  onSelect,
  onToggleFavorite,
}: {
  item: ResearchItem;
  onSelect: () => void;
  onToggleFavorite: () => void;
}) {
  const Icon = contentTypeIcons[item.contentType] || Globe;
  const StatusIcon = statusIcons[item.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors"
    >
      <button onClick={onSelect} className="w-full text-left p-4">
        <div className="flex gap-3">
          {/* Thumbnail or icon */}
          <div className="flex-shrink-0">
            {item.thumbnailUrl ? (
              <img
                src={item.thumbnailUrl}
                alt=""
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-white/40" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className="flex-shrink-0 p-1"
              >
                <Star
                  className={`w-4 h-4 ${item.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white/40"}`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
              {item.sourceFavicon && (
                <img src={item.sourceFavicon} alt="" className="w-4 h-4 rounded" />
              )}
              <span className="truncate">{item.sourceDomain}</span>
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex gap-1.5 mt-2">
                {item.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* GitHub stats */}
            {item.githubData && (
              <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {item.githubData.stars?.toLocaleString()}
                </span>
                {item.githubData.language && <span>{item.githubData.language}</span>}
              </div>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}

// Item Detail Component
function ItemDetail({
  item,
  onToggleFavorite,
  onUpdateStatus,
  onDelete,
}: {
  item: ResearchItem;
  onToggleFavorite: () => void;
  onUpdateStatus: (status: Status) => void;
  onDelete: () => void;
}) {
  const Icon = contentTypeIcons[item.contentType] || Globe;

  return (
    <div className="space-y-6">
      {/* Header image */}
      {item.thumbnailUrl && (
        <div className="aspect-video rounded-xl overflow-hidden">
          <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Title and actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{item.title}</h1>
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-400 hover:underline mt-1"
          >
            {item.sourceFavicon && (
              <img src={item.sourceFavicon} alt="" className="w-4 h-4 rounded" />
            )}
            {item.sourceDomain}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Star
              className={`w-5 h-5 ${item.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white/60"}`}
            />
          </button>
          <button onClick={onDelete} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Trash2 className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>

      {/* Status buttons */}
      <div className="flex gap-2">
        {(["saved", "reading", "completed"] as const).map((status) => {
          const StatusIcon = statusIcons[status];
          return (
            <button
              key={status}
              onClick={() => onUpdateStatus(status)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.status === status
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              <StatusIcon className="w-4 h-4" />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          );
        })}
      </div>

      {/* GitHub data */}
      {item.githubData && (
        <div className="bg-white/5 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            <span className="font-medium">
              {item.githubData.owner}/{item.githubData.repo}
            </span>
          </div>

          {item.githubData.description && (
            <p className="text-sm text-white/60">{item.githubData.description}</p>
          )}

          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              {item.githubData.stars?.toLocaleString()}
            </span>
            {item.githubData.forks !== undefined && (
              <span className="text-white/60">{item.githubData.forks} forks</span>
            )}
            {item.githubData.language && (
              <span className="text-white/60">{item.githubData.language}</span>
            )}
          </div>

          {item.githubData.topics && item.githubData.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.githubData.topics.map((topic) => (
                <span key={topic} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Summary */}
      {item.aiSummary && (
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium">AI Summary</span>
          </div>
          <p className="text-sm text-white/60">{item.aiSummary}</p>
        </div>
      )}

      {/* User notes */}
      {item.notes && (
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-2">Notes</h3>
          <p className="text-sm text-white/60">{item.notes}</p>
        </div>
      )}

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Metadata */}
      <div className="text-xs text-white/40 space-y-1">
        <p>
          Added {new Date(item.createdAt).toLocaleDateString()} at{" "}
          {new Date(item.createdAt).toLocaleTimeString()}
        </p>
        <p>Type: {item.contentType.replace("_", " ")}</p>
      </div>
    </div>
  );
}
