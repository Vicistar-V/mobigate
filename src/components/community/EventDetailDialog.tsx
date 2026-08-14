import { useCommunityPostInteraction, type ApiComment } from "@/hooks/useCommunityPostInteraction";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isPast, isToday, isFuture } from "date-fns";
import {
  Heart, MessageCircle, Share2, Bookmark,
  Eye, X, ChevronLeft, ChevronRight,
  MapPin, Calendar, Clock, Users, CheckCircle,
  Send, CornerDownRight, ExternalLink, Loader2,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { EventItem } from "@/data/eventsData";

interface EventDetailDialogProps {
  communityId?: string;
  open:          boolean;
  onOpenChange:  (v: boolean) => void;
  event:         EventItem | null;
  communityId?:  string;
  onLike?:       (id: string, e?: React.MouseEvent) => void;
  isLiked?:      boolean;
  likeCount?:    number;
  onPrev?:       () => void;
  onNext?:       () => void;
  hasPrev?:      boolean;
  hasNext?:      boolean;
}

const VENUE_BADGE: Record<string, string> = {
  physical: "bg-green-100 text-green-700",
  online:   "bg-blue-100 text-blue-700",
  hybrid:   "bg-purple-100 text-purple-700",
};

interface Comment { id: string; author: string; avatar?: string; text: string; time: string; replies?: Comment[]; }


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

function CommentRow({ comment, depth = 0, onReply }: { comment: ApiComment; depth?: number; onReply: (id: string, text: string) => void }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText]  = useState("");
  const [showReplies, setShowReplies] = useState(true);

  return (
    <div className={cn("flex gap-2.5", depth > 0 && "ml-8 mt-2")}>
      {depth > 0 && <CornerDownRight className="h-3 w-3 text-muted-foreground/40 mt-1.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <div className="flex gap-2">
          <Avatar className="h-7 w-7 shrink-0 mt-0.5">
            <AvatarImage src={comment.profile_photo} />
            <AvatarFallback className="text-xs">{(comment.author_name || "U")[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="bg-muted/50 rounded-2xl px-3 py-2">
              <p className="text-xs font-semibold leading-tight">{comment.author_name}</p>
              <p className="text-sm mt-0.5 leading-snug whitespace-pre-wrap break-words">{comment.content}</p>
            </div>
            <div className="flex items-center gap-3 mt-1 px-1">
              <span className="text-[10px] text-muted-foreground">{commentTimeAgo(comment.created_at)}</span>
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
                <Input placeholder={`Reply to ${comment.author_name}…`} value={replyText}
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

export function EventDetailDialog({
  communityId, open, onOpenChange, event,
  onLike, isLiked, likeCount,
  onPrev, onNext, hasPrev, hasNext,
}: EventDetailDialogProps) {
  const navigate = useNavigate();
  const [bookmarked,    setBookmarked]    = useState(false);
  const [rsvped,        setRsvped]        = useState(false);
  const [rsvpCount,     setRsvpCount]     = useState(0);
  const [rsvpLoading,   setRsvpLoading]   = useState(false);
  const [commentText,   setCommentText]   = useState("");
  const [comments,      setComments]      = useState<ApiComment[]>([]);
  const [localLiked,    setLocalLiked]    = useState(isLiked ?? false);
  const [localLikeCount,setLocalLikeCount]= useState(likeCount ?? 0);
  const { fetchComments, toggleLike, submitComment, recordView } = useCommunityPostInteraction(communityId);
  useEffect(() => { if (open && event?.id) { recordView(event.id); fetchComments(event.id).then(setComments); } }, [open, event?.id]);
  useEffect(() => { setLocalLiked(isLiked ?? false); setLocalLikeCount(likeCount ?? 0); }, [isLiked, likeCount]);

  if (!event) return null;

  const startDate   = event.startDate ? new Date(event.startDate) : event.date ? new Date(event.date) : null;
  const endDate     = event.endDate   ? new Date(event.endDate)   : null;
  const realRsvp    = rsvpCount || event.rsvpCount || 0;
  const realCap     = event.capacity || 0;
  const rsvpPct     = realCap > 0 ? Math.min(100, (realRsvp / realCap) * 100) : 0;

  const timing = !startDate ? { label: "No date", color: "text-muted-foreground" }
    : isToday(startDate) ? { label: "Today",    color: "text-green-600" }
    : isFuture(startDate) ? { label: "Upcoming", color: "text-blue-600" }
    : { label: "Past",     color: "text-gray-400" };

  const handleRsvp = async () => {
    if (!communityId || !event.id) return;
    setRsvpLoading(true);
    try {
      const res = await fetch("/api/community/content.php", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rsvp", community_id: communityId, post_id: event.id }),
      });
      if (res.ok) {
        const d = await res.json();
        setRsvped(true);
        setRsvpCount(d.rsvpCount ?? realRsvp + 1);
        toast.success("You're going! 🎉");
      }
    } catch { toast.error("Could not RSVP. Try again."); }
    finally { setRsvpLoading(false); }
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !event?.id) return;
    const result = await submitComment(event.id, commentText.trim());
    setComments(prev => [...prev, result ?? { id:`tmp-${Date.now()}`, content:commentText.trim(), author_name:"You", profile_photo:null, created_at:new Date().toISOString(), replies:[] }]);
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
        <DialogTitle className="sr-only">Event Details</DialogTitle>
        {/* ── FIXED HEADER ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background shrink-0">
          <div className="flex items-center gap-1">
            {onPrev && <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!hasPrev} onClick={onPrev}><ChevronLeft className="h-4 w-4" /></Button>}
            {onNext && <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!hasNext} onClick={onNext}><ChevronRight className="h-4 w-4" /></Button>}
          </div>
          <div className="flex items-center gap-1">
            <button className={cn("p-1.5 rounded-lg hover:bg-muted transition-colors", bookmarked && "text-primary")} onClick={() => setBookmarked(b => !b)}>
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

            {/* Cover image */}
            {(event.thumbnail || event.imageUrl) && (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                <img src={event.thumbnail || event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <Badge className={cn("text-xs font-semibold", timing.color, "bg-background/90")}>{timing.label}</Badge>
                </div>
              </div>
            )}

            {/* Venue type + timing badges */}
            <div className="flex flex-wrap gap-2">
              {event.venueType && (
                <Badge className={cn("text-xs rounded-full px-3 capitalize", VENUE_BADGE[event.venueType] || "bg-gray-100 text-gray-700")}>
                  {event.venueType}
                </Badge>
              )}
              {!event.thumbnail && !event.imageUrl && (
                <Badge className={cn("text-xs font-semibold", timing.color, "bg-muted")}>{timing.label}</Badge>
              )}
              {event.spotlight && <Badge className="text-xs rounded-full px-3 bg-amber-100 text-amber-700">⭐ Spotlight</Badge>}
            </div>

            {/* Title */}
            <h2 className="font-bold text-xl leading-snug">{event.title}</h2>

            {/* Organizer row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => (event as any).authorId && navigate(`/profile/${(event as any).authorId}`)}>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={event.organizerAvatar || (event as any).authorProfileImage} />
                  <AvatarFallback className="font-semibold text-sm">{(event.organizer || event.author || "U")[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold hover:text-primary">{event.organizer || event.author}</p>
                  <p className="text-xs text-muted-foreground">Organizer</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" /> {(event.views || 0).toLocaleString()}
              </span>
            </div>

            <Separator />

            {/* Event details */}
            <div className="space-y-3">
              {startDate && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-medium text-primary uppercase">{format(startDate, "MMM")}</span>
                    <span className="text-base font-bold text-primary leading-none">{format(startDate, "d")}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{format(startDate, "EEEE, MMMM d, yyyy")}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {format(startDate, "h:mm a")}
                      {endDate && ` — ${format(endDate, "h:mm a")}`}
                    </p>
                  </div>
                </div>
              )}
              {event.venue && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.venue}</p>
                    {event.venueType && (
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">{event.venueType} event</p>
                    )}
                  </div>
                </div>
              )}
              {realCap > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{realRsvp} / {realCap} attending</p>
                    <Progress value={rsvpPct} className="h-1.5 mt-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">{Math.round(rsvpPct)}% capacity filled</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {event.description || ""}
            </div>

            {/* Tags */}
            {(event.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {event.tags!.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs rounded-full px-2.5">{tag}</Badge>
                ))}
              </div>
            )}

            <Separator />

            {/* RSVP */}
            {isFuture(startDate || new Date()) && !isPast(startDate || new Date()) && (
              <Button
                className={cn("w-full gap-2", rsvped && "bg-green-600 hover:bg-green-700")}
                onClick={handleRsvp}
                disabled={rsvped || rsvpLoading}
              >
                {rsvpLoading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : rsvped
                    ? <><CheckCircle className="h-4 w-4" /> You're Going!</>
                    : <><Calendar className="h-4 w-4" /> RSVP Now</>}
              </Button>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              {[
                { label: "likes",    value: likeCount ?? event.likes ?? 0 },
                { label: "comments", value: comments.length + (event.comments || 0) },
                { label: "shares",   value: event.shares || 0 },
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
            {comments.length === 0 && (event.comments ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No comments yet — be the first!</p>
            ) : (
              <div className="space-y-4 pb-2">
                {comments.map(c => <CommentRow key={c.id} comment={c} depth={0} onReply={handleReply} />)}
              </div>
            )}
          </div>
        </div>

        {/* ── FIXED FOOTER ─────────────────────────────────────────────── */}
        <div className="border-t bg-background shrink-0">
          <div className="flex items-center gap-1 px-4 py-2.5">
            <button onClick={e => onLike?.(event.id, e)}
              className={cn("p-2 rounded-full hover:bg-muted transition-colors", isLiked && "text-red-500")}>
              <Heart className={cn("h-5 w-5", isLiked && "fill-red-500")} />
            </button>
            <button className="p-2 rounded-full hover:bg-muted"
              onClick={() => document.getElementById("event-comment-input")?.focus()}>
              <MessageCircle className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-muted"
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}>
              <Share2 className="h-5 w-5" />
            </button>
            <div className="flex-1" />
            <span className="text-sm font-semibold">{localLikeCount.toLocaleString()} likes</span>
          </div>
          <div className="flex items-center gap-2 px-4 pb-4">
            <Input
              id="event-comment-input"
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
