import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Megaphone, Users, Calendar, Star, Eye, Heart,
  MessageCircle, Share2, Plus, Search, Loader2,
  X, ChevronLeft, ChevronRight, Send, Bookmark,
  Bell, Award, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCommunityContent, ContentItem } from "@/hooks/useCommunityContent";

interface Props { communityId?: string; isOwner?: boolean; isMember?: boolean; }

const TYPE_CONFIG: Record<string, { label: string; icon: React.FC<{ className?: string }>; color: string; bg: string }> = {
  announcement:  { label: "Announcement", icon: Megaphone, color: "text-yellow-700", bg: "bg-yellow-100" },
  event:         { label: "Event",        icon: Calendar,  color: "text-orange-700", bg: "bg-orange-100" },
  news:          { label: "News",         icon: FileText,  color: "text-blue-700",   bg: "bg-blue-100"   },
  status:        { label: "Update",       icon: Bell,      color: "text-green-700",  bg: "bg-green-100"  },
  vibe:          { label: "Vibe",         icon: Star,      color: "text-pink-700",   bg: "bg-pink-100"   },
  default:       { label: "Post",         icon: FileText,  color: "text-gray-700",   bg: "bg-gray-100"   },
};

/* ── Post Detail Dialog ─────────────────────────────────────────────────── */
function PostDetailDialog({ item, open, onOpenChange, onLike, isLiked, likeCount, onPrev, onNext, hasPrev, hasNext }: {
  item: ContentItem | null; open: boolean; onOpenChange: (v: boolean) => void;
  onLike?: (id: string) => void; isLiked?: boolean; likeCount?: number;
  onPrev?: () => void; onNext?: () => void; hasPrev?: boolean; hasNext?: boolean;
}) {
  const [bookmarked,  setBookmarked]  = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments,    setComments]    = useState<Array<{ id: string; author: string; text: string; time: string }>>([]);

  if (!item) return null;
  const cfg    = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.default;
  const TypeIcon = cfg.icon;
  const timeAgo = item.publishedAt || item.submittedAt
    ? (() => { try { return formatDistanceToNow(new Date(item.publishedAt || item.submittedAt!), { addSuffix: true }); } catch { return ""; } })()
    : "";

  const sendComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [...prev, { id: `c-${Date.now()}`, author: "You", text: commentText.trim(), time: "Just now" }]);
    setCommentText("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 gap-0 rounded-2xl flex flex-col" style={{ maxHeight: "90vh", height: "90vh" }}>
        <DialogTitle className="sr-only">Post Details</DialogTitle>
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <div className="flex gap-1">
            {onPrev && <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!hasPrev} onClick={onPrev}><ChevronLeft className="h-4 w-4" /></Button>}
            {onNext && <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!hasNext} onClick={onNext}><ChevronRight className="h-4 w-4" /></Button>}
          </div>
          <div className="flex gap-1">
            <button className={cn("p-1.5 rounded-lg hover:bg-muted", bookmarked && "text-primary")} onClick={() => setBookmarked(b => !b)}>
              <Bookmark className={cn("h-5 w-5", bookmarked && "fill-primary")} />
            </button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}><X className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="px-4 md:px-5 py-4 space-y-4">
            {item.thumbnail && <div className="aspect-video rounded-xl overflow-hidden"><img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" /></div>}
            <Badge className={cn("text-xs rounded-full px-3 gap-1", cfg.bg, cfg.color)}>
              <TypeIcon className="h-3 w-3" />{cfg.label}
            </Badge>
            {item.title && <h2 className="font-bold text-xl leading-snug">{item.title}</h2>}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-9 w-9"><AvatarImage src={item.authorAvatar} /><AvatarFallback className="font-semibold text-sm">{(item.authorName || "U")[0]}</AvatarFallback></Avatar>
                <div><p className="text-sm font-semibold">{item.authorName}</p><p className="text-xs text-muted-foreground">{timeAgo}</p></div>
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Eye className="h-3.5 w-3.5" />{(item.views || 0).toLocaleString()}</span>
            </div>
            <Separator />
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{item.content || item.description}</p>
            {(item.tags ?? []).length > 0 && <div className="flex flex-wrap gap-1.5">{item.tags!.map(t => <Badge key={t} variant="outline" className="text-xs rounded-full px-2.5">{t}</Badge>)}</div>}
            <Separator />
            <div className="flex gap-6 text-sm">
              {[{ label: "likes", v: likeCount ?? item.likes ?? 0 }, { label: "comments", v: comments.length + (item.comments || 0) }].map(s => (
                <div key={s.label} className="text-center"><p className="font-semibold">{s.v.toLocaleString()}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
              ))}
            </div>
            <Separator />
            <p className="font-semibold text-base">Comments</p>
            {comments.length === 0 ? <p className="text-sm text-muted-foreground py-2">No comments yet.</p> : (
              <div className="space-y-3 pb-2">
                {comments.map(c => (
                  <div key={c.id} className="flex gap-2">
                    <Avatar className="h-7 w-7 shrink-0"><AvatarFallback className="text-xs">{c.author[0]}</AvatarFallback></Avatar>
                    <div><div className="bg-muted/50 rounded-2xl px-3 py-2"><p className="text-xs font-semibold">{c.author}</p><p className="text-sm">{c.text}</p></div>
                    <p className="text-[10px] text-muted-foreground mt-1 px-1">{c.time}</p></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t bg-background shrink-0">
          <div className="flex items-center gap-1 px-4 py-2.5">
            <button onClick={() => onLike?.(item.id)} className={cn("p-2 rounded-full hover:bg-muted", isLiked && "text-red-500")}><Heart className={cn("h-5 w-5", isLiked && "fill-red-500")} /></button>
            <button className="p-2 rounded-full hover:bg-muted" onClick={() => document.getElementById("ic-comment-input")?.focus()}><MessageCircle className="h-5 w-5" /></button>
            <button className="p-2 rounded-full hover:bg-muted" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}><Share2 className="h-5 w-5" /></button>
            <div className="flex-1" /><span className="text-sm font-semibold">{(likeCount ?? item.likes ?? 0).toLocaleString()} likes</span>
          </div>
          <div className="flex gap-2 px-4 pb-4">
            <Input id="ic-comment-input" placeholder="Add a comment…" value={commentText}
              className="flex-1 h-10 rounded-full bg-muted border-0 text-sm"
              onChange={e => setCommentText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") sendComment(); }} />
            <Button size="icon" className="h-10 w-10 rounded-full bg-primary shrink-0" disabled={!commentText.trim()} onClick={sendComment}><Send className="h-4 w-4 text-white" /></Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Create Post Dialog ─────────────────────────────────────────────────── */
function CreatePostDialog({ communityId, onCreated, open, onOpenChange }: {
  communityId?: string; onCreated: () => void; open: boolean; onOpenChange: (v: boolean) => void;
}) {
  const [type,       setType]       = useState("announcement");
  const [title,      setTitle]      = useState("");
  const [content,    setContent]    = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) { toast.error("Content is required"); return; }
    if (!communityId) { toast.error("Community not found"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/community/content.php", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", community_id: communityId, type, title: title.trim(), content: content.trim(), status: "pending" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Post submitted! Pending admin approval.");
      onCreated(); onOpenChange(false);
      setTitle(""); setContent(""); setType("announcement");
    } catch { toast.error("Failed to submit post."); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-0 gap-0 rounded-2xl flex flex-col" style={{ maxHeight: "85vh" }}>
        <DialogTitle className="sr-only">Create Post</DialogTitle>
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <h2 className="font-bold text-lg">Create Post</h2>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}><X className="h-4 w-4" /></Button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(TYPE_CONFIG).filter(([k]) => k !== "default").map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder="Title (optional)" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="What's happening in the community?" value={content} rows={6}
            onChange={e => setContent(e.target.value)} className="resize-none" />
        </div>
        <div className="border-t px-4 py-3 shrink-0 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="flex-1" disabled={!content.trim() || submitting} onClick={handleSubmit}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
            {submitting ? "Posting…" : "Submit Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Main section ───────────────────────────────────────────────────────── */
export function InsideCommunitySection({ communityId, isOwner, isMember = true }: Props) {
  const { items, loading, hasMore, loadMore, refresh } = useCommunityContent(communityId, {
    status: "active", limit: 20,
  });
  const [search,     setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [likedIds,   setLikedIds]   = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [selected,   setSelected]   = useState<ContentItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    let r = items;
    if (search) r = r.filter(i => (i.title + " " + (i.description || "")).toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== "all") r = r.filter(i => i.type === typeFilter);
    return r;
  }, [items, search, typeFilter]);

  const selectedIdx = selected ? filtered.findIndex(i => i.id === selected.id) : -1;

  const handleLike = (id: string) => {
    setLikedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    setLikeCounts(prev => {
      const base = items.find(i => i.id === id)?.likes ?? 0;
      return { ...prev, [id]: likedIds.has(id) ? base : base + 1 };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Inside Community</h2>
        {(isOwner || isMember) && (
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Post</Button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(TYPE_CONFIG).filter(([k]) => k !== "default").map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && items.length === 0 ? (
        <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">{search || typeFilter !== "all" ? "No posts match your filters" : "No community posts yet"}</p>
          {(isOwner || isMember) && <Button size="sm" className="mt-3" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" /> Create the first post</Button>}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filtered.map(item => {
              const cfg   = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.default;
              const TypeIcon = cfg.icon;
              const liked = likedIds.has(item.id);
              const likes = likeCounts[item.id] ?? item.likes ?? 0;
              const timeAgo = item.publishedAt
                ? (() => { try { return formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true }); } catch { return ""; } })()
                : "";
              return (
                <Card key={item.id} className="hover:shadow-sm transition-shadow cursor-pointer" onClick={() => { setSelected(item); setDetailOpen(true); }}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", cfg.bg)}>
                        <TypeIcon className={cn("h-5 w-5", cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={cn("text-[10px] rounded-full px-2 gap-0.5", cfg.bg, cfg.color)}>
                            <TypeIcon className="h-2.5 w-2.5" />{cfg.label}
                          </Badge>
                        </div>
                        {item.title && <h3 className="font-semibold text-sm mt-1 line-clamp-2">{item.title}</h3>}
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{item.description || item.content}</p>
                      </div>
                      {item.thumbnail && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5"><AvatarImage src={item.authorAvatar} /><AvatarFallback className="text-[8px]">{(item.authorName || "U")[0]}</AvatarFallback></Avatar>
                      <span className="text-xs text-muted-foreground flex-1">{item.authorName}</span>
                      <span className="text-xs text-muted-foreground">{timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground border-t pt-2">
                      <button onClick={e => { e.stopPropagation(); handleLike(item.id); }} className={cn("flex items-center gap-0.5 hover:text-red-500", liked && "text-red-500")}>
                        <Heart className={cn("h-3.5 w-3.5", liked && "fill-red-500")} />{likes}
                      </button>
                      <span className="flex items-center gap-0.5"><MessageCircle className="h-3.5 w-3.5" />{item.comments}</span>
                      <span className="flex items-center gap-0.5 ml-auto"><Eye className="h-3.5 w-3.5" />{(item.views || 0).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {hasMore && (
            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={loadMore} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Load more
              </Button>
            </div>
          )}
        </>
      )}

      <CreatePostDialog communityId={communityId} onCreated={refresh} open={createOpen} onOpenChange={setCreateOpen} />
      <PostDetailDialog
        item={selected} open={detailOpen} onOpenChange={setDetailOpen}
        onLike={handleLike}
        isLiked={selected ? likedIds.has(selected.id) : false}
        likeCount={selected ? (likeCounts[selected.id] ?? selected.likes ?? 0) : 0}
        onPrev={() => selectedIdx > 0 && setSelected(filtered[selectedIdx - 1])}
        onNext={() => selectedIdx < filtered.length - 1 && setSelected(filtered[selectedIdx + 1])}
        hasPrev={selectedIdx > 0} hasNext={selectedIdx < filtered.length - 1}
      />
    </div>
  );
}
