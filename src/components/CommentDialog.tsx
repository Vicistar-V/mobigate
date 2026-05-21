import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button }   from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart, Trash2, Reply, Send, Loader2, MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth }  from "@/contexts/AuthContext";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

interface Comment {
  id:              string;
  post_id:         string;
  user_id:         string;
  parent_id:       string | null;
  body:            string;
  like_count:      number;
  created_at:      string;
  author_name:     string;
  author_username: string;
  author_avatar:   string | null;
  is_online:       boolean;
  is_own:          boolean;
}

interface CommentDialogProps {
  open:             boolean;
  onOpenChange:     (open: boolean) => void;
  postId?:          string;
  postTitle?:       string;
  onCommentAdded?:  () => void;
  onCommentDeleted?:() => void;
  // kept for backward compat with existing callers
  post?: {
    id?: string; title?: string; subtitle?: string;
    author?: string; authorProfileImage?: string;
    type?: string; imageUrl?: string; views?: string; likes?: string;
  };
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800)return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const CommentDialog = ({
  open, onOpenChange, postId: propPostId, postTitle,
  onCommentAdded, onCommentDeleted, post,
}: CommentDialogProps) => {
  const { toast }    = useToast();
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const inputRef     = useRef<HTMLTextAreaElement>(null);

  // resolve postId from either the new prop or the legacy post.id
  const postId = propPostId || post?.id || "";
  const title  = postTitle  || post?.title || "Post";

  const [comments,    setComments]    = useState<Comment[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [text,        setText]        = useState("");
  const [replyTo,     setReplyTo]     = useState<Comment | null>(null);
  const [deletingId,  setDeletingId]  = useState<string | null>(null);

  // ── Fetch comments ─────────────────────────────────────────────────────────
  const fetchComments = useCallback(async () => {
    if (!postId || !open) return;
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/comments/list.php?post_id=${postId}`, { credentials: "include" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setComments(data.comments || []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId, open]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  // ── Submit comment ─────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!text.trim() || !postId) return;
    setSubmitting(true);
    try {
      const res  = await fetch(`${API_BASE}/comments/add.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id:   postId,
          body:      text.trim(),
          parent_id: replyTo?.id || null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setComments(prev => [data.comment, ...prev]);
        setText("");
        setReplyTo(null);
        onCommentAdded?.();
        toast({ title: "Comment posted!" });
      } else {
        toast({ title: "Error", description: data.error || "Could not post comment", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Cannot reach server", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete comment ─────────────────────────────────────────────────────────
  const handleDelete = async (comment: Comment) => {
    setDeletingId(comment.id);
    try {
      const res  = await fetch(`${API_BASE}/comments/delete.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_id: comment.id }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => prev.filter(c => c.id !== comment.id));
        onCommentDeleted?.();
        toast({ title: "Comment deleted" });
      }
    } catch {
      toast({ title: "Error", description: "Cannot reach server", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  // ── Reply ──────────────────────────────────────────────────────────────────
  const handleReply = (comment: Comment) => {
    setReplyTo(comment);
    setText(`@${comment.author_username} `);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClose = () => {
    setText(""); setReplyTo(null); onOpenChange(false);
  };

  // Group: top-level first, then replies
  const topLevel = comments.filter(c => !c.parent_id);
  const replies  = comments.filter(c => !!c.parent_id);

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`flex gap-3 ${isReply ? "ml-10 mt-2" : "mt-4"}`}>
      <button className="flex-shrink-0" onClick={() => navigate(`/profile/${comment.user_id}`)}>
        <Avatar className="h-9 w-9">
          <AvatarImage src={comment.author_avatar || undefined} />
          <AvatarFallback>{comment.author_name.substring(0, 2)}</AvatarFallback>
        </Avatar>
      </button>

      <div className="flex-1 min-w-0">
        <div className="bg-muted/50 rounded-2xl px-3 py-2">
          <button
            className="font-semibold text-sm hover:underline text-left"
            onClick={() => navigate(`/profile/${comment.user_id}`)}
          >
            {comment.author_name}
          </button>
          <p className="text-sm mt-0.5 break-words">{comment.body}</p>
        </div>

        <div className="flex items-center gap-3 mt-1 px-1">
          <span className="text-xs text-muted-foreground">{timeAgo(comment.created_at)}</span>
          {!isReply && (
            <button
              className="text-xs text-muted-foreground hover:text-primary font-medium flex items-center gap-1"
              onClick={() => handleReply(comment)}
            >
              <Reply className="h-3 w-3" />Reply
            </button>
          )}
          {comment.like_count > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Heart className="h-3 w-3 fill-red-500 text-red-500" />
              {comment.like_count}
            </span>
          )}
          {comment.is_own && (
            <button
              className="text-xs text-destructive hover:text-destructive/80 font-medium flex items-center gap-1 ml-auto"
              onClick={() => handleDelete(comment)}
              disabled={deletingId === comment.id}
            >
              {deletingId === comment.id
                ? <Loader2 className="h-3 w-3 animate-spin" />
                : <Trash2 className="h-3 w-3" />
              }
              Delete
            </button>
          )}
        </div>

        {/* Replies to this comment */}
        {replies.filter(r => r.parent_id === comment.id).map(reply => (
          <CommentItem key={reply.id} comment={reply} isReply />
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-3 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Comments on "{title}"
          </DialogTitle>
        </DialogHeader>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-4 py-2 min-h-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
            </div>
          ) : topLevel.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-2 text-muted-foreground">
              <MessageSquare className="h-12 w-12 opacity-20" />
              <p className="text-sm font-medium">No comments yet</p>
              <p className="text-xs">Be the first to comment!</p>
            </div>
          ) : (
            <div className="pb-4">
              {topLevel.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t px-4 py-3 shrink-0 bg-card">
          {replyTo && (
            <div className="flex items-center justify-between mb-2 bg-primary/10 rounded-lg px-3 py-1.5">
              <span className="text-xs text-primary font-medium">
                Replying to @{replyTo.author_username}
              </span>
              <button
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => { setReplyTo(null); setText(""); }}
              >
                Cancel
              </button>
            </div>
          )}

          {user ? (
            <div className="flex gap-2">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={user.profilePhoto || undefined} />
                <AvatarFallback>{(user.fullName || user.username || "U").substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea
                  ref={inputRef}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Write a comment..."
                  className="min-h-[40px] max-h-[120px] resize-none text-sm py-2"
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="h-10 w-10 shrink-0 self-end"
                  onClick={handleSubmit}
                  disabled={!text.trim() || submitting}
                >
                  {submitting
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Send className="h-4 w-4" />
                  }
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-center text-muted-foreground py-2">
              Please log in to comment
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
