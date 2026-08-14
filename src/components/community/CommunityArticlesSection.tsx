import { useState, useMemo, useCallback, useEffect } from "react";
import { format } from "date-fns";
import {
  BookOpen, Plus, Search, Clock, Eye, Heart, MessageCircle,
  Bookmark, Share2, ChevronDown, Star, Tag, Loader2, Send,
  CornerDownRight, X, ChevronLeft, ChevronRight,
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
import { useCommunityPostInteraction, type ApiComment } from "@/hooks/useCommunityPostInteraction";

function commentTimeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch { return ""; }
}

interface Props {
  communityId?: string;
  isOwner?:     boolean;
  isMember?:    boolean;
}

const CATEGORIES = ["all", "community news", "culture", "development", "education", "opinion", "other"];
const CAT_COLOR: Record<string, string> = {
  "community news": "bg-blue-100 text-blue-700",
  "culture":        "bg-purple-100 text-purple-700",
  "development":    "bg-green-100 text-green-700",
  "education":      "bg-orange-100 text-orange-700",
  "opinion":        "bg-pink-100 text-pink-700",
  "other":          "bg-gray-100 text-gray-700",
};

/* ── Create Article Dialog ──────────────────────────────────────────────── */
function CreateArticleDialog({ communityId, onCreated, open, onOpenChange }: {
  communityId?: string; onCreated: () => void;
  open: boolean; onOpenChange: (v: boolean) => void;
}) {
  const [title,       setTitle]       = useState("");
  const [content,     setContent]     = useState("");
  const [category,    setCategory]    = useState("community news");
  const [tags,        setTags]        = useState("");
  const [readTime,    setReadTime]    = useState("");
  const [thumbnail,   setThumbnail]   = useState("");
  const [thumbFile,   setThumbFile]   = useState<File | null>(null);
  const [submitting,  setSubmitting]  = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) { toast.error("Title and content are required"); return; }
    if (!communityId) { toast.error("Community not found"); return; }
    setSubmitting(true);
    try {
      let thumbUrl = thumbnail;
      if (thumbFile) {
        const fd = new FormData();
        fd.append("file", thumbFile);
        fd.append("community_id", communityId);
        const up = await fetch("/api/community/upload_post_media.php", { method: "POST", credentials: "include", body: fd });
        if (up.ok) { const d = await up.json(); thumbUrl = d.url || thumbnail; }
      }
      const res = await fetch("/api/community/content.php", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create", community_id: communityId, type: "article",
          title: title.trim(), content: content.trim(),
          category, tags: tags.split(",").map(t => t.trim()).filter(Boolean).join(","),
          read_time: readTime, thumbnail: thumbUrl, status: "pending",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Article submitted! Pending admin approval.");
      onCreated();
      onOpenChange(false);
      setTitle(""); setContent(""); setCategory("community news"); setTags(""); setReadTime(""); setThumbnail(""); setThumbFile(null);
    } catch { toast.error("Failed to submit article."); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 gap-0 rounded-2xl flex flex-col" style={{ maxHeight: "90vh", height: "90vh" }}>
        <DialogTitle className="sr-only">Write Article</DialogTitle>
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <h2 className="font-bold text-lg flex items-center gap-2"><BookOpen className="h-5 w-5 text-purple-600" /> Write Article</h2>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}><X className="h-4 w-4" /></Button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 space-y-4" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="space-y-1">
            <label className="text-sm font-medium">Title *</label>
            <Input placeholder="Article title…" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.filter(c => c !== "all").map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Read time</label>
              <Input placeholder="e.g. 5 min" value={readTime} onChange={e => setReadTime(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Tags (comma-separated)</label>
            <Input placeholder="community, development, …" value={tags} onChange={e => setTags(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Cover image</label>
            <Input type="file" accept="image/*" onChange={e => {
              const f = e.target.files?.[0];
              if (f) { setThumbFile(f); setThumbnail(URL.createObjectURL(f)); }
            }} className="text-sm" />
            {thumbnail && <img src={thumbnail} className="w-full h-32 object-cover rounded-lg mt-2" />}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Content *</label>
            <Textarea placeholder="Write your article content here…" value={content} rows={10}
              onChange={e => setContent(e.target.value)} className="resize-none" />
            <p className="text-xs text-muted-foreground text-right">{content.length} chars</p>
          </div>
        </div>
        <div className="border-t px-4 py-3 shrink-0 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={!title.trim() || !content.trim() || submitting} onClick={handleSubmit}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            {submitting ? "Submitting…" : "Submit Article"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Article Detail Dialog ──────────────────────────────────────────────── */
function ArticleDetailDialog({ communityId, article, open, onOpenChange, onLike, isLiked, likeCount, onPrev, onNext, hasPrev, hasNext }: {
  communityId?: string; article: ContentItem | null; open: boolean; onOpenChange: (v: boolean) => void;
  onLike?: (id: string) => void; isLiked?: boolean; likeCount?: number;
  onPrev?: () => void; onNext?: () => void; hasPrev?: boolean; hasNext?: boolean;
}) {
  const [bookmarked,  setBookmarked]  = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments,    setComments]    = useState<ApiComment[]>([]);
  const [localLiked,  setLocalLiked]  = useState(isLiked ?? false);
  const [localCount,  setLocalCount]  = useState(likeCount ?? 0);
  const { fetchComments, toggleLike, submitComment, recordView } =
    useCommunityPostInteraction(communityId);
  useEffect(() => {
    if (open && article?.id) { recordView(article.id); fetchComments(article.id).then(setComments); }
  }, [open, article?.id]);
  useEffect(() => { setLocalLiked(isLiked ?? false); setLocalCount(likeCount ?? 0); }, [isLiked, likeCount]);

  if (!article) return null;

  const dateStr = article.publishedAt
    ? (() => { try { return format(new Date(article.publishedAt), "d MMM yyyy"); } catch { return ""; } })() : "";

  const catColor = CAT_COLOR[article.category ?? ""] ?? "bg-gray-100 text-gray-700";

  const sendComment = async () => {
    if (!commentText.trim() || !article?.id) return;
    const r = await submitComment(article.id, commentText.trim());
    setComments(prev => [...prev, r ?? { id:`tmp-${Date.now()}`, content:commentText.trim(), author_name:"You", profile_photo:null, created_at:new Date().toISOString(), replies:[] }]);
    setCommentText("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 gap-0 rounded-2xl flex flex-col" style={{ maxHeight: "90vh", height: "90vh" }}>
        {/* Header */}
        <DialogTitle className="sr-only">Article</DialogTitle>
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

        {/* Scrollable body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="px-4 md:px-5 py-4 space-y-4">
            {article.thumbnail && (
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {article.category && <Badge className={cn("text-xs rounded-full px-3 capitalize", catColor)}>{article.category}</Badge>}
              {article.featured && <Badge className="text-xs rounded-full px-3 bg-amber-100 text-amber-700"><Star className="h-3 w-3 mr-1 inline" />Featured</Badge>}
              {article.readTime && <Badge variant="secondary" className="text-xs rounded-full px-3"><Clock className="h-3 w-3 mr-1 inline" />{article.readTime}</Badge>}
            </div>
            <h2 className="font-bold text-xl leading-snug">{article.title}</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={article.authorAvatar} />
                  <AvatarFallback className="font-semibold text-sm">{(article.authorName || "U")[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{article.authorName}</p>
                  <p className="text-xs text-muted-foreground">{dateStr}</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" /> {(article.views || 0).toLocaleString()}
              </span>
            </div>
            <Separator />
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{article.content || article.description}</div>
            {(article.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {article.tags!.map(t => <Badge key={t} variant="outline" className="text-xs rounded-full px-2.5"><Tag className="h-3 w-3 mr-1" />{t}</Badge>)}
              </div>
            )}
            <Separator />
            <div className="flex gap-6 text-sm">
              {[{ label: "likes", v: localCount }, { label: "comments", v: comments.length + (article.comments || 0) }, { label: "views", v: article.views || 0 }].map(s => (
                <div key={s.label} className="text-center"><p className="font-semibold">{s.v.toLocaleString()}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
              ))}
            </div>
            <Separator />
            <p className="font-semibold text-base">Comments</p>
            {comments.length === 0 ? <p className="text-sm text-muted-foreground py-2">No comments yet — share your thoughts!</p> : (
              <div className="space-y-4 pb-2">
                {comments.map(c => (
                  <div key={c.id} className="flex gap-2">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarImage src={c.profile_photo || undefined} />
                      <AvatarFallback className="text-xs">{(c.author_name || "U")[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="bg-muted/50 rounded-2xl px-3 py-2">
                        <p className="text-xs font-semibold">{c.author_name}</p>
                        <p className="text-sm">{c.content}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 px-1">{commentTimeAgo(c.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-background shrink-0">
          <div className="flex items-center gap-1 px-4 py-2.5">
            <button onClick={() => onLike?.(article.id)} className={cn("p-2 rounded-full hover:bg-muted", isLiked && "text-red-500")}>
              <Heart className={cn("h-5 w-5", isLiked && "fill-red-500")} />
            </button>
            <button className="p-2 rounded-full hover:bg-muted" onClick={() => document.getElementById("article-comment-input")?.focus()}>
              <MessageCircle className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-muted" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}>
              <Share2 className="h-5 w-5" />
            </button>
            <div className="flex-1" />
            <span className="text-sm font-semibold">{(likeCount ?? article.likes ?? 0).toLocaleString()} likes</span>
          </div>
          <div className="flex gap-2 px-4 pb-4">
            <Input id="article-comment-input" placeholder="Add a comment…" value={commentText}
              className="flex-1 h-10 rounded-full bg-muted border-0 text-sm"
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendComment(); }} />
            <Button size="icon" className="h-10 w-10 rounded-full bg-primary shrink-0"
              disabled={!commentText.trim()} onClick={sendComment}>
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Main section ───────────────────────────────────────────────────────── */
export function CommunityArticlesSection({ communityId, isOwner, isMember = true }: Props) {
  const { items, loading, hasMore, loadMore, refresh } = useCommunityContent(communityId, {
    type: "article", status: "active", limit: 12,
  });
  const [search,       setSearch]       = useState("");
  const [category,     setCategory]     = useState("all");
  const [likedIds,     setLikedIds]     = useState<Set<string>>(new Set());
  const [likeCounts,   setLikeCounts]   = useState<Record<string, number>>({});
  const [selected,     setSelected]     = useState<ContentItem | null>(null);
  const [detailOpen,   setDetailOpen]   = useState(false);
  const [createOpen,   setCreateOpen]   = useState(false);

  const filtered = useMemo(() => {
    let r = items;
    if (search) r = r.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || (a.description || "").toLowerCase().includes(search.toLowerCase()));
    if (category !== "all") r = r.filter(a => a.category === category);
    return r;
  }, [items, search, category]);

  const { toggleLike: apiToggleLike, submitComment: apiSubmitComment,
          fetchComments: apiFetchComments, recordView: apiRecordView } =
    useCommunityPostInteraction(communityId);

  const handleLike = useCallback(async (id: string) => {
    const wasLiked = likedIds.has(id);
    setLikedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    setLikeCounts(prev => {
      const base = items.find(i => i.id === id)?.likes ?? 0;
      return { ...prev, [id]: wasLiked ? Math.max(0, base - 1) : base + 1 };
    });
    await apiToggleLike(id, wasLiked);
  }, [items, likedIds, apiToggleLike]);

  const openDetail = (item: ContentItem) => { setSelected(item); setDetailOpen(true); };

  const selectedIdx = selected ? filtered.findIndex(a => a.id === selected.id) : -1;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2"><BookOpen className="h-5 w-5 text-purple-600" /> Articles</h2>
        {(isOwner || isMember) && (
          <Button size="sm" className="gap-1.5 bg-purple-600 hover:bg-purple-700" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> Write Article
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search articles…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c === "all" ? "All Categories" : c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Articles grid */}
      {loading && items.length === 0 ? (
        <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">{search || category !== "all" ? "No articles match your filters" : "No articles yet"}</p>
          {(isOwner || isMember) && <Button size="sm" className="mt-3 bg-purple-600 hover:bg-purple-700" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" /> Write the first article</Button>}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(article => {
              const liked   = likedIds.has(article.id);
              const likes   = likeCounts[article.id] ?? article.likes ?? 0;
              const dateStr = article.publishedAt ? (() => { try { return format(new Date(article.publishedAt), "d MMM yyyy"); } catch { return ""; } })() : "";
              const catColor = CAT_COLOR[article.category ?? ""] ?? "bg-gray-100 text-gray-700";
              return (
                <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group" onClick={() => openDetail(article)}>
                  {article.thumbnail && (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <CardContent className="p-4 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {article.category && <Badge className={cn("text-[10px] rounded-full px-2 capitalize", catColor)}>{article.category}</Badge>}
                      {article.featured && <Badge className="text-[10px] rounded-full px-2 bg-amber-100 text-amber-700">⭐ Featured</Badge>}
                      {article.readTime && <Badge variant="secondary" className="text-[10px] rounded-full px-2"><Clock className="h-2.5 w-2.5 mr-0.5 inline" />{article.readTime}</Badge>}
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 leading-snug">{article.title}</h3>
                    {article.description && <p className="text-xs text-muted-foreground line-clamp-2">{article.description}</p>}
                    <div className="flex items-center gap-2 pt-1">
                      <Avatar className="h-5 w-5"><AvatarImage src={article.authorAvatar} /><AvatarFallback className="text-[8px]">{(article.authorName || "U")[0]}</AvatarFallback></Avatar>
                      <span className="text-xs text-muted-foreground flex-1 truncate">{article.authorName}</span>
                      <span className="text-xs text-muted-foreground">{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
                      <button onClick={e => { e.stopPropagation(); handleLike(article.id); }} className={cn("flex items-center gap-0.5 hover:text-red-500", liked && "text-red-500")}>
                        <Heart className={cn("h-3.5 w-3.5", liked && "fill-red-500")} /> {likes}
                      </button>
                      <span className="flex items-center gap-0.5"><MessageCircle className="h-3.5 w-3.5" />{article.comments}</span>
                      <span className="flex items-center gap-0.5 ml-auto"><Eye className="h-3.5 w-3.5" />{(article.views || 0).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {hasMore && (
            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={loadMore} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />} Load more
              </Button>
            </div>
          )}
        </>
      )}

      <CreateArticleDialog communityId={communityId} onCreated={refresh} open={createOpen} onOpenChange={setCreateOpen} />

      <ArticleDetailDialog
        communityId={communityId}
        article={selected} open={detailOpen} onOpenChange={setDetailOpen}
        onLike={handleLike}
        isLiked={selected ? likedIds.has(selected.id) : false}
        likeCount={selected ? (likeCounts[selected.id] ?? selected.likes ?? 0) : 0}
        onPrev={() => selectedIdx > 0 && setSelected(filtered[selectedIdx - 1])}
        onNext={() => selectedIdx < filtered.length - 1 && setSelected(filtered[selectedIdx + 1])}
        hasPrev={selectedIdx > 0}
        hasNext={selectedIdx < filtered.length - 1}
      />
    </div>
  );
}
