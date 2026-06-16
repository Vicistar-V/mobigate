import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Heart, MessageCircle, Share2, Bookmark, Eye, X,
  ChevronLeft, ChevronRight, Play, Volume2, Images,
  Send, CornerDownRight, UserPlus, UserCheck, Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { VibeItem } from "@/data/communityVibesData";

interface VibeDetailDialogProps {
  open:         boolean;
  onOpenChange: (v: boolean) => void;
  vibe:         VibeItem | null;
  onLike?:      (id: string) => void;
  isLiked?:     boolean;
  likeCount?:   number;
  onPrev?:      () => void;
  onNext?:      () => void;
  hasPrev?:     boolean;
  hasNext?:     boolean;
}

const MEDIA_ICON: Record<string, React.FC<{ className?: string }>> = {
  video:   Play,
  audio:   Volume2,
  gallery: Images,
};

const MEDIA_COLOR: Record<string, string> = {
  video:   "bg-indigo-100 text-indigo-700",
  photo:   "bg-blue-100 text-blue-700",
  audio:   "bg-pink-100 text-pink-700",
  gallery: "bg-purple-100 text-purple-700",
};

/* ── Comment row ─────────────────────────────────────────────────────────── */
interface Comment { id: string; author: string; avatar?: string; text: string; time: string; replies?: Comment[]; }

function CommentRow({ comment, depth = 0, onReply }: { comment: Comment; depth?: number; onReply: (id: string, text: string) => void }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
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
                <Input placeholder={`Reply to ${comment.author}…`} value={replyText}
                  className="h-8 text-sm flex-1 rounded-full"
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

/* ── Main dialog ─────────────────────────────────────────────────────────── */
export function VibeDetailDialog({
  open, onOpenChange, vibe,
  onLike, isLiked, likeCount,
  onPrev, onNext, hasPrev, hasNext,
}: VibeDetailDialogProps) {
  const navigate   = useNavigate();
  const [bookmarked,  setBookmarked]  = useState(false);
  const [following,   setFollowing]   = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments,    setComments]    = useState<Comment[]>([]);

  if (!vibe) return null;

  const timeAgo = vibe.date
    ? (() => { try { return formatDistanceToNow(new Date(vibe.date), { addSuffix: true }); } catch { return ""; } })()
    : "";

  const MediaIcon = MEDIA_ICON[vibe.mediaType] ?? null;
  const mediaColor = MEDIA_COLOR[vibe.mediaType] ?? "bg-gray-100 text-gray-600";

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [...prev, { id: `c-${Date.now()}`, author: "You", text: commentText.trim(), time: "Just now", replies: [] }]);
    setCommentText("");
  };

  const handleReply = (parentId: string, text: string) => {
    setComments(prev => prev.map(c =>
      c.id === parentId
        ? { ...c, replies: [...(c.replies || []), { id: `r-${Date.now()}`, author: "You", text, time: "Just now" }] }
        : c
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl w-full p-0 gap-0 rounded-2xl flex flex-col"
        style={{ maxHeight: "90vh", height: "90vh" }}
      >
        <DialogTitle className="sr-only">Vibe Details</DialogTitle>
        {/* ── FIXED HEADER ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background shrink-0">
          <div className="flex items-center gap-1">
            {onPrev && <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!hasPrev} onClick={onPrev}><ChevronLeft className="h-4 w-4" /></Button>}
            {onNext && <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!hasNext} onClick={onNext}><ChevronRight className="h-4 w-4" /></Button>}
          </div>
          <div className="flex items-center gap-1">
            <button className={cn("p-1.5 rounded-lg hover:bg-muted transition-colors", bookmarked && "text-primary")}
              onClick={() => setBookmarked(b => !b)}>
              <Bookmark className={cn("h-5 w-5", bookmarked && "fill-primary")} />
            </button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── SCROLLABLE BODY — native scroll ──────────────────────────── */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="space-y-4">
            {/* Media player area */}
            <div className="relative bg-black">
              {vibe.thumbnail || vibe.mediaUrl ? (
                <>
                  {vibe.mediaType === "video" ? (
                    <video
                      src={vibe.mediaUrl}
                      poster={vibe.thumbnail}
                      controls
                      className="w-full max-h-72 object-contain"
                    />
                  ) : vibe.mediaType === "audio" ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                      {vibe.thumbnail && (
                        <img src={vibe.thumbnail} alt={vibe.title} className="w-32 h-32 rounded-xl object-cover shadow-lg" />
                      )}
                      <audio src={vibe.mediaUrl} controls className="w-full px-4" />
                    </div>
                  ) : (
                    <img
                      src={vibe.thumbnail || vibe.mediaUrl}
                      alt={vibe.title}
                      className="w-full max-h-72 object-contain"
                    />
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-48 text-white/20">
                  {MediaIcon ? <MediaIcon className="h-16 w-16" /> : <Images className="h-16 w-16" />}
                </div>
              )}
            </div>

            <div className="px-4 space-y-4">
              {/* Type badge + spotlight */}
              <div className="flex flex-wrap gap-2 items-center">
                <Badge className={cn("text-xs rounded-full px-3 capitalize", mediaColor)}>
                  {vibe.mediaType}
                </Badge>
                {vibe.spotlight && (
                  <Badge className="text-xs rounded-full px-3 bg-amber-100 text-amber-700 gap-1">
                    <Sparkles className="h-3 w-3" /> Spotlight
                  </Badge>
                )}
                {vibe.duration && (
                  <Badge variant="secondary" className="text-xs rounded-full px-3">{vibe.duration}</Badge>
                )}
              </div>

              {/* Title */}
              <h2 className="font-bold text-xl leading-snug">{vibe.title}</h2>

              {/* Author row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 cursor-pointer"
                  onClick={() => vibe.authorId && navigate(`/profile/${vibe.authorId}`)}>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={vibe.authorProfileImage} />
                    <AvatarFallback className="font-semibold text-sm">{(vibe.author || "U")[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold hover:text-primary">{vibe.author}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3.5 w-3.5" /> {(vibe.views || 0).toLocaleString()}
                  </span>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1"
                    onClick={() => { setFollowing(f => !f); toast.success(following ? "Unfollowed" : "Following!"); }}>
                    {following
                      ? <><UserCheck className="h-3 w-3" /> Following</>
                      : <><UserPlus className="h-3 w-3" /> Follow</>}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Description */}
              {vibe.description && (
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{vibe.description}</p>
              )}

              <Separator />

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                {[
                  { label: "likes",    value: likeCount ?? vibe.likes ?? 0 },
                  { label: "comments", value: comments.length + (vibe.comments || 0) },
                  { label: "shares",   value: vibe.shares || 0 },
                  { label: "views",    value: vibe.views  || 0 },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="font-semibold">{s.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Comments */}
              <p className="font-semibold text-base">Comments</p>
              {comments.length === 0 && (vibe.comments ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No comments yet — drop a vibe! 🎵</p>
              ) : (
                <div className="space-y-4 pb-2">
                  {comments.map(c => <CommentRow key={c.id} comment={c} depth={0} onReply={handleReply} />)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── FIXED FOOTER ─────────────────────────────────────────────── */}
        <div className="border-t bg-background shrink-0">
          {/* Action bar */}
          <div className="flex items-center gap-1 px-4 py-2.5">
            <button onClick={() => onLike?.(vibe.id)}
              className={cn("p-2 rounded-full hover:bg-muted transition-colors", isLiked && "text-red-500")}>
              <Heart className={cn("h-5 w-5", isLiked && "fill-red-500")} />
            </button>
            <button className="p-2 rounded-full hover:bg-muted"
              onClick={() => document.getElementById("vibe-comment-input")?.focus()}>
              <MessageCircle className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-muted"
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}>
              <Share2 className="h-5 w-5" />
            </button>
            <div className="flex-1" />
            <span className="text-sm font-semibold">{(likeCount ?? vibe.likes ?? 0).toLocaleString()} likes</span>
          </div>
          {/* Comment input */}
          <div className="flex items-center gap-2 px-4 pb-4">
            <Input
              id="vibe-comment-input"
              placeholder="Add a comment…"
              value={commentText}
              className="flex-1 h-10 rounded-full bg-muted border-0 text-sm"
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSendComment(); }}
            />
            <Button size="icon" className="h-10 w-10 rounded-full bg-primary shrink-0"
              disabled={!commentText.trim()} onClick={handleSendComment}>
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
