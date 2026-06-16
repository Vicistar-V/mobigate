import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Heart, MessageCircle, Share2, Bookmark,
  Eye, X, ChevronLeft, ChevronRight,
  Play, Volume2, Send, CornerDownRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { NewsItem } from "@/data/newsData";

interface NewsDetailDialogProps {
  open:          boolean;
  onOpenChange:  (v: boolean) => void;
  news:          NewsItem | null;
  onLike?:       (id: string, e?: React.MouseEvent) => void;
  isLiked?:      boolean;
  likeCount?:    number;
  onPrev?:       () => void;
  onNext?:       () => void;
  hasPrev?:      boolean;
  hasNext?:      boolean;
}

const CATEGORY_COLOR: Record<string, string> = {
  announcements: "bg-red-100 text-red-700",
  events:        "bg-orange-100 text-orange-700",
  updates:       "bg-blue-100 text-blue-700",
  general:       "bg-gray-100 text-gray-700",
  affairs:       "bg-purple-100 text-purple-700",
};

/* ── Comment row ─────────────────────────────────────────────────────────── */
interface Comment {
  id: string; author: string; avatar?: string;
  text: string; time: string; replies?: Comment[];
}

function CommentRow({ comment, depth = 0, onReply }: { comment: Comment; depth?: number; onReply: (id: string, text: string) => void }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText]  = useState("");
  const [showReplies, setShowReplies] = useState(true);

  return (
    <div className={cn("flex gap-2.5", depth > 0 && "ml-8 mt-2")}>
      {depth > 0 && <CornerDownRight className="h-3 w-3 text-muted-foreground/40 mt-1.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <div className="flex gap-2">
          <Avatar className="h-7 w-7 shrink-0 mt-0.5">
            <AvatarImage src={comment.avatar} />
            <AvatarFallback className="text-xs">{comment.author[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="bg-muted/50 rounded-2xl px-3 py-2">
              <p className="text-xs font-semibold leading-tight">{comment.author}</p>
              <p className="text-sm mt-0.5 leading-snug whitespace-pre-wrap break-words">{comment.text}</p>
            </div>
            <div className="flex items-center gap-3 mt-1 px-1">
              <span className="text-[10px] text-muted-foreground">{comment.time}</span>
              {depth === 0 && (
                <button className="text-[11px] font-semibold text-muted-foreground hover:text-primary"
                  onClick={() => setShowReply(r => !r)}>Reply</button>
              )}
              {depth === 0 && (comment.replies?.length ?? 0) > 0 && (
                <button className="text-[11px] text-primary font-medium hover:underline"
                  onClick={() => setShowReplies(v => !v)}>
                  {showReplies ? `Hide ${comment.replies!.length} repl${comment.replies!.length === 1 ? "y" : "ies"}`
                               : `View ${comment.replies!.length} repl${comment.replies!.length === 1 ? "y" : "ies"}`}
                </button>
              )}
            </div>
            {showReply && (
              <div className="flex gap-2 items-center mt-2">
                <Input placeholder={`Reply to ${comment.author}…`} value={replyText} className="h-8 text-sm flex-1 rounded-full"
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && replyText.trim()) { onReply(comment.id, replyText.trim()); setReplyText(""); setShowReply(false); } }} />
                <Button size="icon" className="h-8 w-8 rounded-full shrink-0"
                  onClick={() => { if (replyText.trim()) { onReply(comment.id, replyText.trim()); setReplyText(""); setShowReply(false); } }}>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            {depth === 0 && showReplies && (comment.replies ?? []).map(r => (
              <CommentRow key={r.id} comment={r} depth={1} onReply={onReply} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Dialog ─────────────────────────────────────────────────────────── */
export function NewsDetailDialog({
  open, onOpenChange, news,
  onLike, isLiked, likeCount,
  onPrev, onNext, hasPrev, hasNext,
}: NewsDetailDialogProps) {
  const navigate = useNavigate();
  const [bookmarked,   setBookmarked]   = useState(false);
  const [commentText,  setCommentText]  = useState("");
  const [comments,     setComments]     = useState<Comment[]>([]);
  const [submitting,   setSubmitting]   = useState(false);

  if (!news) return null;

  const formattedDate = news.publishedAt || news.date
    ? (() => { try { return format(new Date(news.publishedAt || news.date!), "d MMM yyyy"); } catch { return ""; } })()
    : "";

  const catColor = CATEGORY_COLOR[news.category ?? "general"] ?? "bg-gray-100 text-gray-700";

  const handleSendComment = () => {
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    const c: Comment = {
      id: `c-${Date.now()}`, author: "You",
      text: commentText.trim(),
      time: "Just now", replies: [],
    };
    setComments(prev => [...prev, c]);
    setCommentText("");
    setSubmitting(false);
  };

  const handleReply = (parentId: string, text: string) => {
    setComments(prev => prev.map(c =>
      c.id === parentId
        ? { ...c, replies: [...(c.replies || []), { id: `r-${Date.now()}`, author: "You", text, time: "Just now" }] }
        : c
    ));
  };

  // Use Dialog on desktop, Sheet on mobile (handled with CSS)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl w-full p-0 gap-0 rounded-2xl flex flex-col"
        style={{ maxHeight: "90vh", height: "90vh" }}
      >
        <DialogTitle className="sr-only">News Article</DialogTitle>
        {/* ── FIXED HEADER ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background shrink-0">
          {/* Prev/Next nav */}
          <div className="flex items-center gap-1">
            {onPrev && (
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!hasPrev} onClick={onPrev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {onNext && (
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!hasNext} onClick={onNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              className={cn("p-1.5 rounded-lg hover:bg-muted transition-colors", bookmarked && "text-primary")}
              onClick={() => setBookmarked(b => !b)}
            >
              <Bookmark className={cn("h-5 w-5", bookmarked && "fill-primary")} />
            </button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── SCROLLABLE BODY — native scroll for reliable mobile support ── */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="px-4 md:px-5 py-4 space-y-4">

            {/* Image / Video */}
            {(news.thumbnail || news.imageUrl) && (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                <img
                  src={news.thumbnail || news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
                {news.mediaType === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                      <Play className="h-7 w-7 text-white fill-white ml-1" />
                    </div>
                  </div>
                )}
                {news.mediaType === "audio" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Volume2 className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>
            )}

            {/* Category + Breaking badge */}
            <div className="flex flex-wrap gap-2 items-center">
              {news.category && (
                <Badge className={cn("text-xs rounded-full px-3 capitalize", catColor)}>
                  {news.category}
                </Badge>
              )}
              {news.isBreaking && (
                <Badge variant="destructive" className="text-xs rounded-full px-3 animate-pulse">
                  🔴 Breaking
                </Badge>
              )}
              {news.featured && (
                <Badge className="text-xs rounded-full px-3 bg-amber-100 text-amber-700">
                  ⭐ Featured
                </Badge>
              )}
            </div>

            {/* Title */}
            <h2 className="font-bold text-xl leading-snug">{news.title}</h2>

            {/* Author row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => news.authorId && navigate(`/profile/${news.authorId}`)}>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={news.authorAvatar || news.authorProfileImage} />
                  <AvatarFallback className="font-semibold text-sm">
                    {(news.author || "U")[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold hover:text-primary">{news.author}</p>
                  <p className="text-xs text-muted-foreground">{formattedDate}</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" /> {(news.views || 0).toLocaleString()}
              </span>
            </div>

            <Separator />

            {/* Body text */}
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {news.content || news.description || news.summary || ""}
            </div>

            {/* Tags */}
            {(news.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {news.tags!.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs rounded-full px-2.5">{tag}</Badge>
                ))}
              </div>
            )}

            <Separator />

            {/* Stats row */}
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="font-semibold">{(likeCount ?? news.likes ?? 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">likes</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{(comments.length + (news.comments || 0)).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">comments</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{(news.shares || 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">shares</p>
              </div>
            </div>

            <Separator />

            {/* Comments header */}
            <p className="font-semibold text-base">Comments</p>

            {/* Comments list */}
            {comments.length === 0 && (news.comments ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No comments yet — be the first!</p>
            ) : (
              <div className="space-y-4 pb-2">
                {comments.map(c => (
                  <CommentRow key={c.id} comment={c} depth={0} onReply={handleReply} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── FIXED BOTTOM: Actions + Comment input ──────────────────── */}
        <div className="border-t bg-background shrink-0">
          {/* Action bar */}
          <div className="flex items-center gap-1 px-4 py-2.5">
            <button
              onClick={e => onLike?.(news.id, e)}
              className={cn("p-2 rounded-full hover:bg-muted transition-colors", isLiked && "text-red-500")}
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-red-500")} />
            </button>
            <button
              className="p-2 rounded-full hover:bg-muted transition-colors"
              onClick={() => document.getElementById("news-comment-input")?.focus()}
            >
              <MessageCircle className="h-5 w-5" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-muted transition-colors"
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
            >
              <Share2 className="h-5 w-5" />
            </button>
            <div className="flex-1" />
            <span className="text-sm font-semibold">
              {(likeCount ?? news.likes ?? 0).toLocaleString()} likes
            </span>
          </div>

          {/* Comment input */}
          <div className="flex items-center gap-2 px-4 pb-4">
            <Input
              id="news-comment-input"
              placeholder="Add a comment…"
              value={commentText}
              className="flex-1 h-10 rounded-full bg-muted border-0 text-sm"
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSendComment(); }}
            />
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-primary shrink-0"
              disabled={!commentText.trim() || submitting}
              onClick={handleSendComment}
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
