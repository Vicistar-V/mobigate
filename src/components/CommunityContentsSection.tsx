import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Play, Image as ImageIcon, FileText, Headphones,
  FileIcon, Link2, MoreHorizontal, Settings,
  Eye, Heart, MessageCircle, Loader2, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { CommunityPost } from "@/hooks/useCommunityPosts";

const API = "/api";

interface CommunityContentsSectionProps {
  communityId: string;
  onPostClick: (post: CommunityPost) => void;
  title?: string;
}

interface Counts { [key: string]: number }

const PRIMARY_FILTERS = [
  { value: "all",     label: "All",      icon: null },
  { value: "video",   label: "Videos",   icon: Play },
  { value: "photo",   label: "Photos",   icon: ImageIcon },
  { value: "article", label: "Articles", icon: FileText },
];

const MORE_FILTERS = [
  { value: "audio",   label: "Audio",     icon: Headphones },
  { value: "content", label: "Documents", icon: FileIcon },
  { value: "vibe",    label: "Vibes",     icon: Link2 },
];

const TYPE_BADGE: Record<string, string> = {
  video:       "bg-indigo-100 text-indigo-700",
  photo:       "bg-blue-100 text-blue-700",
  article:     "bg-purple-100 text-purple-700",
  audio:       "bg-pink-100 text-pink-700",
  content:     "bg-orange-100 text-orange-700",
  vibe:        "bg-red-100 text-red-700",
  event:       "bg-green-100 text-green-700",
  announcement:"bg-yellow-100 text-yellow-700",
  status:      "bg-gray-100 text-gray-700",
};

function fmtCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "k";
  return String(n);
}

export function CommunityContentsSection({
  communityId, onPostClick, title = "Community Contents",
}: CommunityContentsSectionProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [counts,       setCounts]       = useState<Counts>({});
  const [posts,        setPosts]        = useState<CommunityPost[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [hasMore,      setHasMore]      = useState(false);
  const [offset,       setOffset]       = useState(0);

  /* ── Fetch counts ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!communityId) return;
    fetch(`${API}/community/posts.php?community_id=${communityId}&counts_only=1`, {
      credentials: "include",
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.counts) setCounts(d.counts); })
      .catch(() => {});
  }, [communityId]);

  /* ── Fetch posts by filter ────────────────────────────────────────────── */
  const fetchPosts = useCallback(async (reset = true) => {
    if (!communityId) return;
    setLoading(true);
    const off  = reset ? 0 : offset;
    const type = activeFilter !== "all" ? `&type=${encodeURIComponent(activeFilter)}` : "";
    try {
      const res  = await fetch(
        `${API}/community/posts.php?community_id=${communityId}&limit=12&offset=${off}${type}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPosts(prev => reset ? data.posts : [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setOffset(reset ? data.posts.length : off + data.posts.length);
    } catch {}
    finally { setLoading(false); }
  }, [communityId, activeFilter, offset]);

  useEffect(() => { fetchPosts(true); }, [communityId, activeFilter]);

  const handleFilter = (v: string) => {
    if (v === activeFilter) return;
    setActiveFilter(v);
    setOffset(0);
  };

  const isMoreActive = MORE_FILTERS.some(f => f.value === activeFilter);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base">{title}</h3>
        <Button variant="ghost" size="sm" onClick={() => fetchPosts(true)} className="h-7 px-2 text-xs">
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        {PRIMARY_FILTERS.map(f => {
          const Icon    = f.icon;
          const count   = counts[f.value] ?? 0;
          const active  = activeFilter === f.value;
          return (
            <Button
              key={f.value}
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilter(f.value)}
              className="text-xs h-8 gap-1.5"
            >
              {Icon && <Icon className="h-3 w-3" />}
              {f.label}{count > 0 ? ` (${fmtCount(count)})` : ""}
            </Button>
          );
        })}

        {/* More dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={isMoreActive ? "default" : "outline"}
              size="sm"
              className="text-xs h-8 gap-1.5"
            >
              <MoreHorizontal className="h-3 w-3" /> More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card z-50">
            {MORE_FILTERS.map(f => {
              const Icon  = f.icon;
              const count = counts[f.value] ?? 0;
              return (
                <DropdownMenuItem
                  key={f.value}
                  onClick={() => handleFilter(f.value)}
                  className={activeFilter === f.value ? "bg-primary text-primary-foreground" : ""}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {f.label}{count > 0 ? ` (${fmtCount(count)})` : ""}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="font-semibold text-primary cursor-pointer">
              <Settings className="h-4 w-4 mr-2" /> Manage Contents
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content grid */}
      {loading && posts.length === 0 ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No {activeFilter === "all" ? "" : activeFilter + " "}content yet</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {posts.map(post => (
              <Card
                key={post.id}
                className="overflow-hidden cursor-pointer group hover:shadow-md transition-shadow"
                onClick={() => onPostClick(post)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title || ""}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : post.videoUrl ? (
                    <div className="w-full h-full flex items-center justify-center bg-black/80">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                      <FileText className="h-8 w-8" />
                    </div>
                  )}

                  {/* Type badge overlay */}
                  {post.type && post.type !== "status" && (
                    <span className={cn(
                      "absolute top-1.5 left-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded",
                      TYPE_BADGE[post.type] || "bg-gray-100 text-gray-700"
                    )}>
                      {post.type}
                    </span>
                  )}

                  {/* Video play overlay */}
                  {post.videoUrl && post.imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content info */}
                <div className="p-2.5 space-y-1">
                  {post.title && (
                    <p className="text-xs font-semibold line-clamp-2 leading-snug">{post.title}</p>
                  )}
                  {!post.title && post.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">{post.description}</p>
                  )}
                  {/* Stats */}
                  <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground pt-0.5">
                    <span className="flex items-center gap-0.5">
                      <Eye className="h-3 w-3" />{fmtCount(post.views || 0)}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Heart className="h-3 w-3" />{fmtCount(post.likes)}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="h-3 w-3" />{fmtCount(post.comments)}
                    </span>
                    <span className="ml-auto text-[9px]">
                      {post.timestamp ? (() => {
                        try { return format(new Date(post.timestamp), "d MMM"); } catch { return ""; }
                      })() : ""}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="outline" size="sm"
                onClick={() => fetchPosts(false)}
                disabled={loading}
                className="text-xs"
              >
                {loading && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
