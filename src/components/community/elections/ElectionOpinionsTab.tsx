import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Menu, ThumbsUp, MessageCircle, Share2, Send, TrendingUp, Clock, Loader2 } from "lucide-react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const API = "/api/community/elections.php";

interface Opinion {
  id: string; author: string; avatar?: string; role: string; content: string;
  likes: number; comments: number; shares: number; timestamp: Date; hasLiked: boolean;
}
interface OpinionComment {
  id: string; author: string; avatar?: string; content: string; timestamp: Date; likes: number; hasLiked: boolean;
}

interface ElectionOpinionsTabProps {
  communityId?: string;
}

export const ElectionOpinionsTab = ({ communityId }: ElectionOpinionsTabProps) => {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [newOpinion, setNewOpinion] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "recent">("popular");
  const [commentOpinionId, setCommentOpinionId] = useState<string | null>(null);
  const [comments, setComments] = useState<OpinionComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const { toast } = useToast();

  const loadOpinions = useCallback(() => {
    if (!communityId) return;
    setLoading(true);
    fetch(`${API}?action=opinions&community_id=${communityId}&sort=${sortBy}`, { credentials: "include" })
      .then(async (r) => {
        const d = await r.json().catch(() => null);
        if (!r.ok || !d) throw new Error(d?.error || `Failed to load opinions (HTTP ${r.status})`);
        return d;
      })
      .then((d) => {
        const mapped: Opinion[] = (d.opinions ?? []).map((o: any) => ({
          id: o.id, author: o.author_name?.trim() || "Member", avatar: o.author_avatar || undefined,
          role: o.author_role ? o.author_role.charAt(0).toUpperCase() + o.author_role.slice(1) : "Member",
          content: o.content, likes: parseInt(o.likes_count, 10) || 0, comments: parseInt(o.comments_count, 10) || 0,
          shares: parseInt(o.shares_count, 10) || 0, timestamp: new Date(o.created_at), hasLiked: !!o.has_liked,
        }));
        setOpinions(mapped);
      })
      .catch((e) => {
        setOpinions([]);
        toast({ title: "Couldn't Load Opinions", description: e.message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [communityId, sortBy]);

  useEffect(() => { loadOpinions(); }, [loadOpinions]);

  const handleLike = async (opinionId: string) => {
    if (!communityId) return;
    setOpinions((prev) => prev.map((op) => op.id === opinionId ? { ...op, likes: op.hasLiked ? op.likes - 1 : op.likes + 1, hasLiked: !op.hasLiked } : op));
    try {
      const res = await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like_opinion", community_id: communityId, opinion_id: opinionId }),
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      loadOpinions(); // revert on failure by re-syncing with server
    }
  };

  const loadComments = (opinionId: string) => {
    if (!communityId) return;
    setLoadingComments(true);
    fetch(`${API}?action=opinion_comments&community_id=${communityId}&opinion_id=${opinionId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setComments((d.comments ?? []).map((c: any) => ({
          id: c.id, author: c.author_name?.trim() || "Member", avatar: c.author_avatar || undefined,
          content: c.content, timestamp: new Date(c.created_at), likes: parseInt(c.likes_count, 10) || 0, hasLiked: !!c.has_liked,
        })));
      })
      .catch(() => setComments([]))
      .finally(() => setLoadingComments(false));
  };

  const handleComment = (opinionId: string) => {
    setCommentOpinionId(opinionId);
    loadComments(opinionId);
  };

  const handlePostComment = async () => {
    if (!communityId || !commentOpinionId || !newComment.trim()) return;
    try {
      const res = await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "post_opinion_comment", community_id: communityId, opinion_id: commentOpinionId, content: newComment.trim() }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      setNewComment("");
      loadComments(commentOpinionId);
      setOpinions((prev) => prev.map((op) => op.id === commentOpinionId ? { ...op, comments: op.comments + 1 } : op));
    } catch (e: any) {
      toast({ title: "Couldn't Post Comment", description: e.message, variant: "destructive" });
    }
  };

  const handleShare = async (opinionId: string) => {
    if (!communityId) return;
    setOpinions((prev) => prev.map((op) => op.id === opinionId ? { ...op, shares: op.shares + 1 } : op));
    try {
      await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "share_opinion", community_id: communityId, opinion_id: opinionId }),
      });
      if (navigator.share) {
        navigator.share({ title: "Community Opinion", text: opinions.find((o) => o.id === opinionId)?.content }).catch(() => {});
      } else {
        toast({ title: "Shared", description: "Opinion shared successfully!" });
      }
    } catch {
      /* non-critical */
    }
  };

  const handleSubmit = async () => {
    if (!newOpinion.trim()) {
      toast({ title: "Empty Opinion", description: "Please write your opinion before posting", variant: "destructive" });
      return;
    }
    if (!communityId) return;
    setPosting(true);
    try {
      const res = await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "post_opinion", community_id: communityId, content: newOpinion.trim() }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Failed to post opinion");
      setNewOpinion("");
      toast({ title: "Opinion Posted", description: "Your opinion has been shared with the community" });
      loadOpinions();
    } catch (e: any) {
      toast({ title: "Couldn't Post Opinion", description: e.message, variant: "destructive" });
    } finally {
      setPosting(false);
    }
  };

  const sortedOpinions = [...opinions].sort((a, b) =>
    sortBy === "popular" ? b.likes - a.likes : b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Header Card */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-xl font-bold">Public Opinions</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Share your thoughts on what qualities and priorities our next leaders should have
        </p>
      </Card>

      {/* Write Opinion */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold">Share Your Opinion</h3>
        <Textarea
          placeholder="What qualities do you want to see in our next leaders? What issues should they prioritize?"
          value={newOpinion}
          onChange={(e) => setNewOpinion(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={handleSubmit} className="w-full" disabled={posting}>
          <Send className="h-4 w-4 mr-2" />
          {posting ? "Posting..." : "Post Opinion"}
        </Button>
      </Card>

      {/* Sort Options */}
      <div className="flex gap-2">
        <Button
          variant={sortBy === "popular" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("popular")}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Popular
        </Button>
        <Button
          variant={sortBy === "recent" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("recent")}
        >
          <Clock className="h-4 w-4 mr-2" />
          Recent
        </Button>
      </div>

      {/* Opinions Feed */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : sortedOpinions.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">No opinions shared yet — be the first!</div>
      ) : (
      <div className="space-y-3">
        {sortedOpinions.map((opinion) => (
          <Card key={opinion.id} className="p-4 space-y-3">
            {/* Author Info */}
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={opinion.avatar} alt={opinion.author} />
                <AvatarFallback>{opinion.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{opinion.author}</p>
                <p className="text-sm text-muted-foreground">{opinion.role}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(opinion.timestamp, { addSuffix: true })}
                </p>
              </div>
              <Badge variant={opinion.likes > 50 ? "default" : "secondary"} className="text-xs">
                {opinion.likes > 50 ? "Trending" : "Active"}
              </Badge>
            </div>

            {/* Opinion Content */}
            <p className="text-sm leading-relaxed">{opinion.content}</p>

            <Separator />

            {/* Engagement Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant={opinion.hasLiked ? "default" : "ghost"}
                size="sm"
                onClick={() => handleLike(opinion.id)}
                className="flex-1"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span className="text-xs">{opinion.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleComment(opinion.id)}
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">{opinion.comments}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(opinion.id)}
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-1" />
                <span className="text-xs">{opinion.shares}</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* Ads */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-opinions" />

      {/* People You May Know */}
      <PeopleYouMayKnow />

      {/* Comments Drawer */}
      <Drawer open={commentOpinionId !== null} onOpenChange={(open) => !open && setCommentOpinionId(null)}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Comments</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4 touch-auto space-y-3">
            {loadingComments ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Start the conversation!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={c.avatar} />
                    <AvatarFallback>{c.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted/50 rounded-lg p-2.5">
                    <p className="text-sm font-medium">{c.author}</p>
                    <p className="text-sm">{c.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(c.timestamp, { addSuffix: true })}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[44px] resize-none"
            />
            <Button onClick={handlePostComment} disabled={!newComment.trim()} size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
