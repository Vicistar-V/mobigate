import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Heart, MessageCircle, Share2,
  Bookmark, X, ChevronLeft, ChevronRight,
  Send, Loader2, CornerDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import type { CommunityPost } from "@/hooks/useCommunityPosts";

const API = "/api";

interface Comment {
  id:            string;
  content:       string;
  author_name:   string;
  profile_photo: string | null;
  author_id?:    string;
  created_at:    string;
  parent_id?:    string | null;
  likes?:        number;
  replies?:      Comment[];
}

interface Props {
  post:           CommunityPost | null;
  open:           boolean;
  onOpenChange:   (v: boolean) => void;
  onLike:         (postId: string, isLiked: boolean) => void;
  onDelete:       (postId: string) => void;
  onComment:      (postId: string, content: string, parentId?: string) => Promise<boolean>;
  onView:         (postId: string) => void;
  onPrev?:        () => void;
  onNext?:        () => void;
  hasPrev?:       boolean;
  hasNext?:       boolean;
  positionLabel?: string;
}

/* ── Comment row with reply support ─────────────────────────────────────── */
function CommentRow({
  comment, postId, depth = 0, onReply,
}: {
  comment:  Comment;
  postId:   string;
  depth?:   number;
  onReply:  (parentId: string, text: string) => Promise<boolean>;
}) {
  const [showReplyBox, setShowReplyBox]   = useState(false);
  const [replyText,    setReplyText]      = useState("");
  const [sending,      setSending]        = useState(false);
  const [showReplies,  setShowReplies]    = useState(true);
  const replyRef = useRef<HTMLInputElement>(null);

  const sendReply = async () => {
    if (!replyText.trim() || sending) return;
    setSending(true);
    const ok = await onReply(comment.id, replyText.trim());
    setSending(false);
    if (ok !== false) { setReplyText(""); setShowReplyBox(false); }
  };

  const dateStr = comment.created_at
    ? (() => { try { return format(new Date(comment.created_at), "d MMM yyyy"); } catch { return ""; } })()
    : "";

  return (
    <div className={cn(depth > 0 && "ml-9")}>
      <div className="flex gap-3">
        {depth > 0 && <CornerDownRight className="h-3 w-3 mt-2 text-muted-foreground/40 shrink-0" />}
        <Avatar className="h-8 w-8 shrink-0 mt-0.5">
          <AvatarImage src={comment.profile_photo || undefined} />
          <AvatarFallback className="text-xs bg-muted font-semibold">
            {(comment.author_name || "U")[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">{comment.author_name}</p>
          <p className="text-sm text-foreground mt-0.5 leading-relaxed">{comment.content}</p>
          {/* Meta: date · likes · Reply */}
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground">{dateStr}</span>
            {(comment.likes ?? 0) > 0 && (
              <span className="text-xs text-muted-foreground">{comment.likes} likes</span>
            )}
            {depth === 0 && (
              <button
                className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                onClick={() => {
                  setShowReplyBox(r => !r);
                  if (!showReplyBox) setTimeout(() => replyRef.current?.focus(), 100);
                }}
              >
                Reply
              </button>
            )}
          </div>

          {/* Show / hide replies toggle */}
          {depth === 0 && (comment.replies?.length ?? 0) > 0 && (
            <button
              className="text-xs text-primary font-medium mt-1 hover:underline"
              onClick={() => setShowReplies(v => !v)}
            >
              {showReplies
                ? `Hide ${comment.replies!.length} repl${comment.replies!.length === 1 ? "y" : "ies"}`
                : `View ${comment.replies!.length} repl${comment.replies!.length === 1 ? "y" : "ies"}`}
            </button>
          )}

          {/* Inline reply input */}
          {showReplyBox && (
            <div className="flex gap-2 items-center mt-2">
              <Input
                ref={replyRef}
                placeholder={`Reply to ${comment.author_name}…`}
                value={replyText}
                className="h-8 text-sm flex-1 rounded-full"
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") sendReply(); if (e.key === "Escape") { setShowReplyBox(false); setReplyText(""); } }}
              />
              <Button size="icon" className="h-8 w-8 rounded-full bg-primary shrink-0"
                disabled={!replyText.trim() || sending} onClick={sendReply}>
                {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </Button>
            </div>
          )}

          {/* Nested replies */}
          {depth === 0 && showReplies && (comment.replies?.length ?? 0) > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies!.map(r => (
                <CommentRow key={r.id} comment={r} postId={postId} depth={1} onReply={onReply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Dialog ─────────────────────────────────────────────────────────── */
export function CommunityPostDetailSheet({
  post, open, onOpenChange,
  onLike, onDelete, onComment, onView,
  onPrev, onNext, hasPrev, hasNext, positionLabel,
}: Props) {
  const navigate = useNavigate();
  const [commentText,  setCommentText]  = useState("");
  const [submitting,   setSubmitting]   = useState(false);
  const [comments,     setComments]     = useState<Comment[]>([]);
  const [loadingComs,  setLoadingComs]  = useState(false);
  const [bookmarked,   setBookmarked]   = useState(false);
  const [viewed,       setViewed]       = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || !post) { setComments([]); setViewed(false); return; }
    if (post.latestComments?.length) {
      setComments(post.latestComments.map((c: any) => ({ ...c, replies: c.replies || [] })));
    }
    loadComments(post.id);
    // Fire onView only once — the first time this post is opened in the sheet
    if (!viewed) {
      setViewed(true);
      onView(post.id);   // server + sessionStorage guard ensures DB only counts once
    }
  }, [open, post?.id]);

  const loadComments = async (postId: string) => {
    setLoadingComs(true);
    try {
      const res = await fetch(`${API}/community/posts.php?community_id=_&post_id=${postId}`, { credentials: "include" });
      if (res.ok) { const d = await res.json(); setComments(d.comments || []); }
    } catch {} finally { setLoadingComs(false); }
  };

  const handleReply = async (parentId: string, text: string): Promise<boolean> => {
    if (!post) return false;
    const ok = await onComment(post.id, text, parentId);
    if (ok !== false) {
      setComments(prev => prev.map(c =>
        c.id === parentId
          ? { ...c, replies: [...(c.replies || []), { id: `tmp-${Date.now()}`, content: text, author_name: "You", profile_photo: null, created_at: new Date().toISOString(), replies: [] }] }
          : c
      ));
    }
    return ok;
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || submitting || !post) return;
    setSubmitting(true);
    const ok = await onComment(post.id, commentText.trim());
    if (ok !== false) {
      setComments(prev => [...prev, { id: `tmp-${Date.now()}`, content: commentText.trim(), author_name: "You", profile_photo: null, created_at: new Date().toISOString(), replies: [] }]);
      setCommentText("");
    }
    setSubmitting(false);
  };

  if (!post) return null;

  const formattedDate = post.timestamp
    ? (() => { try { return format(new Date(post.timestamp), "d MMM yyyy"); } catch { return ""; } })()
    : "";

  const totalCommentCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full p-0 gap-0 overflow-hidden rounded-2xl bg-background"
        style={{ maxHeight: "92vh" }}>

        <div className="flex flex-col md:flex-row h-full" style={{ maxHeight: "92vh" }}>

          {/* ════════════════════════════════════════════
              LEFT — Dark media panel (hidden on mobile)
          ════════════════════════════════════════════ */}
          <div className="hidden md:flex relative bg-black flex-col items-center justify-center"
            style={{ minWidth: 0, flex: "0 0 58%" }}>

            {/* Close */}
            <button className="absolute top-3 right-3 z-20 text-white bg-black/40 rounded-full p-1.5 hover:bg-black/70"
              onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </button>

            {/* Prev arrow */}
            {onPrev && (
              <button disabled={!hasPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 text-white bg-black/40 rounded-full p-2 hover:bg-black/70 disabled:opacity-30"
                onClick={onPrev}>
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {/* Next arrow */}
            {onNext && (
              <button disabled={!hasNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-white bg-black/40 rounded-full p-2 hover:bg-black/70 disabled:opacity-30"
                onClick={onNext}>
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            {/* Media */}
            {post.imageUrl ? (
              <img src={post.imageUrl} alt={post.title || "Post"} className="max-h-full max-w-full object-contain" />
            ) : post.videoUrl ? (
              <video src={post.videoUrl} controls className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-white/30">
                <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1}>
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              </div>
            )}

            {/* Position label */}
            {positionLabel && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/60 text-xs">
                {positionLabel}
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════
              RIGHT — Content + Comments panel
          ════════════════════════════════════════════ */}
          <div className="flex-1 flex flex-col min-h-0 bg-background overflow-hidden">

            {/* ── Mobile only: image at top ── */}
            <div className="md:hidden relative bg-black">
              {post.imageUrl
                ? <img src={post.imageUrl} alt={post.title || "Post"} className="w-full max-h-64 object-cover" />
                : post.videoUrl
                  ? <video src={post.videoUrl} controls className="w-full max-h-64 object-contain" />
                  : null}
              {/* Mobile close */}
              <button className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1.5"
                onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </button>
              {/* Mobile prev/next */}
              {onPrev && (
                <button disabled={!hasPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-1.5 disabled:opacity-30"
                  onClick={onPrev}>
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              {onNext && (
                <button disabled={!hasNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-1.5 disabled:opacity-30"
                  onClick={onNext}>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* ── FIXED TOP: Author row ── */}
            <div className="flex items-start justify-between gap-2 px-4 md:px-5 py-3 border-b bg-background shrink-0">
              <div className="flex items-center gap-3 cursor-pointer"
                onClick={() => post.authorId && navigate(`/profile/${post.authorId}`)}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.authorImage} />
                  <AvatarFallback className="font-semibold bg-muted">
                    {(post.author || "U")[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm text-foreground hover:text-primary">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{formattedDate}</p>
                </div>
              </div>
              <button
                className={cn("p-1.5 rounded-lg hover:bg-muted transition-colors", bookmarked && "text-primary")}
                onClick={() => setBookmarked(b => !b)}>
                <Bookmark className={cn("h-5 w-5", bookmarked && "fill-primary")} />
              </button>
            </div>

            {/* Scrollable content */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="px-4 md:px-5 py-4 space-y-4">

                <Separator />

                {/* Title + subtitle + body */}
                {post.title && (
                  <h2 className="font-bold text-base text-foreground leading-snug">{post.title}</h2>
                )}
                {post.description && (() => {
                  // If there's a newline, first line = subtitle, rest = body
                  const lines = post.description.split('\n');
                  if (lines.length > 1) {
                    return (
                      <>
                        <p className="text-sm text-primary/80 leading-snug -mt-2">{lines[0]}</p>
                        <p className="text-sm text-foreground leading-relaxed">{lines.slice(1).join('\n').trim()}</p>
                      </>
                    );
                  }
                  return <p className="text-sm text-foreground leading-relaxed">{post.description}</p>;
                })()}

                {/* Tag chip (type badge) */}
                {post.type && post.type !== "status" && (
                  <div>
                    <Badge variant="outline" className="text-xs rounded-full px-3">
                      {post.type.replace(/-/g, " ")}
                    </Badge>
                  </div>
                )}

                {/* Stats row: views · likes · comments · shares */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{post.views >= 1000 ? `${(post.views/1000).toFixed(1)}K` : post.views || 0}</p>
                    <p className="text-xs text-muted-foreground">views</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{post.likes}</p>
                    <p className="text-xs text-muted-foreground">likes</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{post.comments}</p>
                    <p className="text-xs text-muted-foreground">comments</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">shares</p>
                  </div>
                </div>

                <Separator />

                {/* Comments header */}
                <p className="font-semibold text-base text-foreground">Comments</p>

                {/* Comments list */}
                {loadingComs ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No comments yet — be the first!</p>
                ) : (
                  <div className="space-y-5 pb-2">
                    {comments.map(c => (
                      <CommentRow key={c.id} comment={c} postId={post.id} depth={0} onReply={handleReply} />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* ── Bottom action bar + comment input ── */}
            <div className="border-t bg-background shrink-0">
              {/* Like / Comment / Share + like count */}
              <div className="flex items-center gap-1 px-4 py-2.5">
                <button
                  className={cn("p-2 rounded-full hover:bg-muted transition-colors", post.isLiked && "text-red-500")}
                  onClick={() => onLike(post.id, post.isLiked)}>
                  <Heart className={cn("h-5 w-5", post.isLiked && "fill-red-500")} />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
                  onClick={() => setTimeout(() => inputRef.current?.focus(), 50)}>
                  <MessageCircle className="h-5 w-5" />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
                  onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}>
                  <Share2 className="h-5 w-5" />
                </button>
                <div className="flex-1" />
                <span className="text-sm font-semibold text-foreground">
                  {post.likes.toLocaleString()} likes
                </span>
              </div>

              {/* Comment input */}
              <div className="flex items-center gap-2 px-4 pb-4">
                <Input
                  ref={inputRef}
                  placeholder="Add a comment..."
                  value={commentText}
                  className="flex-1 h-10 rounded-full bg-muted border-0 text-sm"
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSendComment(); }}
                />
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shrink-0"
                  disabled={!commentText.trim() || submitting}
                  onClick={handleSendComment}>
                  {submitting
                    ? <Loader2 className="h-4 w-4 animate-spin text-white" />
                    : <Send className="h-4 w-4 text-white" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
