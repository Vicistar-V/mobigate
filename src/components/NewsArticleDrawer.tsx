import { useEffect, useRef, useState } from "react";
import { Heart, Share2, UserPlus, Check, X, MessageCircle, Send, Gift } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { SendGiftDialog } from "@/components/chat/SendGiftDialog";
import { ShareDialog } from "@/components/ShareDialog";
import type { NewsArticle } from "@/data/trendingHeadlines";

interface NewsArticleDrawerProps {
  article: NewsArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ArticleComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
}

const seedComments = (article: NewsArticle): ArticleComment[] => [
  {
    id: `${article.id}-c1`,
    author: "Grace Okonkwo",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Grace%20Okonkwo&backgroundColor=2980b9",
    text: "This perfectly captures what real leadership looks like today. 👏",
    timeAgo: "1h",
  },
  {
    id: `${article.id}-c2`,
    author: "Daniel Mensah",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Daniel%20Mensah&backgroundColor=27ae60",
    text: "Emotional intelligence over raw ambition — well said.",
    timeAgo: "42m",
  },
];

export const NewsArticleDrawer = ({ article, open, onOpenChange }: NewsArticleDrawerProps) => {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  // Comments
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [draft, setDraft] = useState("");

  // Gifting
  const [showGift, setShowGift] = useState(false);
  const [giftCount, setGiftCount] = useState(0);

  const galleryRef = useRef<HTMLDivElement>(null);
  const countedRef = useRef<string | null>(null);

  // Sync optimistic state whenever a new article is opened.
  useEffect(() => {
    if (article) {
      setIsFollowing(!!article.isFollowing);
      setIsLiked(!!article.isLiked);
      setLikeCount(article.likes ?? 0);
      setActiveImage(0);
      setShowComments(false);
      setDraft("");
      setComments(seedComments(article));
      setViewCount(article.views ?? 0);
      setShowGift(false);
      setGiftCount(article.gifts ?? 0);
    }
  }, [article]);

  // Auto-increment the view counter once per opened article (optimistic).
  useEffect(() => {
    if (open && article && countedRef.current !== article.id) {
      countedRef.current = article.id;
      setViewCount((c) => c + 1);
    }
    if (!open) countedRef.current = null;
  }, [open, article]);

  if (!article) return null;

  const media = (article.images && article.images.length ? article.images : [article.imageUrl])
    .filter(Boolean)
    .slice(0, 3);

  const handleFollow = () => {
    setIsFollowing((prev) => {
      const next = !prev;
      toast({ description: next ? `Following ${article.author}` : `Unfollowed ${article.author}` });
      return next;
    });
  };

  const handleLike = () => {
    setIsLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => Math.max(0, c + (next ? 1 : -1)));
      return next;
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.content[0] ?? article.title,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard?.writeText(shareData.url);
        toast({ description: "Link copied to clipboard" });
      }
    } catch {
      /* dismissed — no-op */
    }
  };

  const handlePostComment = () => {
    const text = draft.trim();
    if (!text) return;
    const newComment: ArticleComment = {
      id: `${article.id}-c-${Date.now()}`,
      author: "You",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=You&backgroundColor=c0392b",
      text,
      timeAgo: "now",
    };
    setComments((prev) => [newComment, ...prev]);
    setDraft("");
  };

  const onGalleryScroll = () => {
    const el = galleryRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== activeImage) setActiveImage(idx);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[92dvh] p-0">
        <div className="flex h-full flex-col">
          {/* ── Fixed media gallery (swipes horizontally, never scrolls vertically) ── */}
          {media.length > 0 && (
            <div className="relative shrink-0">
              <div
                ref={galleryRef}
                onScroll={onGalleryScroll}
                className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {media.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${article.title} ${i + 1}`}
                    className="h-56 w-full shrink-0 snap-center object-cover sm:h-64"
                    draggable={false}
                  />
                ))}
              </div>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <DrawerClose asChild>
                <button
                  type="button"
                  aria-label="Close article"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm active:scale-95 touch-manipulation"
                >
                  <X className="h-5 w-5" />
                </button>
              </DrawerClose>

              {/* Image dots (only when >1) */}
              {media.length > 1 && (
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                  {media.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeImage ? "w-4 bg-white" : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Category badge over the hero */}
              <div className="absolute bottom-3 left-3">
                <span className="inline-block rounded bg-destructive px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-destructive-foreground">
                  {article.category}
                </span>
              </div>
            </div>
          )}

          {/* When there are no images, keep a close button visible */}
          {media.length === 0 && (
            <div className="flex shrink-0 items-center justify-end px-4 pt-3">
              <DrawerClose asChild>
                <button
                  type="button"
                  aria-label="Close article"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground active:scale-95 touch-manipulation"
                >
                  <X className="h-5 w-5" />
                </button>
              </DrawerClose>
            </div>
          )}

          {/* ── Scrollable text body (only this area scrolls vertically) ── */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-4">
            {/* Title */}
            <h1 className="font-serif text-xl font-extrabold leading-tight text-foreground sm:text-2xl">
              {article.title}
            </h1>

            {/* Author + meta + views */}
            <div className="mt-3 flex items-center gap-2 border-b border-border pb-3">
              <img
                src={article.authorAvatar}
                alt={article.author}
                className="h-9 w-9 rounded-full border border-border object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-sm font-semibold text-foreground">
                  {article.author}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {article.timeAgo} | {article.privacy}
                </p>
              </div>
              {/* Views counter */}
              <span className="flex items-center gap-1 whitespace-nowrap text-[12px] font-semibold text-muted-foreground">
                <span className="text-destructive">⏺</span>
                {viewCount.toLocaleString()}
                <span className="text-muted-foreground/70">views</span>
              </span>
            </div>

            {/* Body paragraphs */}
            <div className="mt-4 space-y-3">
              {article.content.map((para, i) => (
                <p
                  key={i}
                  className={`text-justify font-serif text-[15px] leading-relaxed text-foreground ${
                    i === 0 ? "first-letter:float-left first-letter:mr-1.5 first-letter:font-extrabold first-letter:text-4xl first-letter:leading-none first-letter:text-destructive" : ""
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* ── Fixed action bar (never moves) ── */}
          <div className="border-t border-border bg-card px-3 py-3">
            <div className="grid grid-cols-5 gap-1.5">
              <button
                type="button"
                onClick={handleFollow}
                aria-pressed={isFollowing}
                className={`flex min-w-0 items-center justify-center gap-1 rounded-md px-1 py-2.5 text-[11px] font-semibold transition-colors active:scale-95 touch-manipulation ${
                  isFollowing ? "bg-[hsl(142_71%_45%)] text-white" : "bg-foreground text-background"
                }`}
              >
                {isFollowing ? <Check className="h-4 w-4 shrink-0" /> : <UserPlus className="h-4 w-4 shrink-0" />}
                <span className="truncate">{isFollowing ? "Following" : "Follow"}</span>
              </button>

              <button
                type="button"
                onClick={handleLike}
                aria-pressed={isLiked}
                className={`flex min-w-0 items-center justify-center gap-1 rounded-md px-1 py-2.5 text-[11px] font-semibold transition-colors active:scale-95 touch-manipulation ${
                  isLiked ? "bg-destructive text-destructive-foreground" : "bg-foreground text-background"
                }`}
              >
                <Heart className={`h-4 w-4 shrink-0 ${isLiked ? "fill-current" : ""}`} />
                <span className="truncate">{likeCount > 0 ? likeCount.toLocaleString() : "Like"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowComments(true)}
                className="flex min-w-0 items-center justify-center gap-1 rounded-md bg-foreground px-1 py-2.5 text-[11px] font-semibold text-background active:scale-95 touch-manipulation"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span className="truncate">{comments.length > 0 ? comments.length.toLocaleString() : "Comment"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowGift(true)}
                className="flex min-w-0 items-center justify-center gap-1 rounded-md bg-[hsl(280_70%_55%)] px-1 py-2.5 text-[11px] font-semibold text-white active:scale-95 touch-manipulation"
              >
                <Gift className="h-4 w-4 shrink-0" />
                <span className="truncate">{giftCount > 0 ? giftCount.toLocaleString() : "Gift"}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex min-w-0 items-center justify-center gap-1 rounded-md bg-foreground px-1 py-2.5 text-[11px] font-semibold text-background active:scale-95 touch-manipulation"
              >
                <Share2 className="h-4 w-4 shrink-0" />
                <span className="truncate">Share</span>
              </button>
            </div>
          </div>

          {/* ── Comments panel (slides over the article) ── */}
          {showComments && (
            <div className="absolute inset-0 z-20 flex flex-col bg-background">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="text-base font-bold text-foreground">
                  Comments ({comments.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setShowComments(false)}
                  aria-label="Close comments"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground active:scale-95 touch-manipulation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4">
                {comments.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Be the first to comment.
                  </p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex gap-2.5">
                      <img
                        src={c.avatar}
                        alt={c.author}
                        className="h-8 w-8 shrink-0 rounded-full border border-border object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2">
                          <p className="text-[13px] font-semibold text-foreground">{c.author}</p>
                          <p className="text-[14px] leading-snug text-foreground">{c.text}</p>
                        </div>
                        <p className="mt-1 pl-1 text-[11px] text-muted-foreground">{c.timeAgo}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment composer */}
              <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-2.5">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handlePostComment(); }}
                  placeholder="Write a comment…"
                  className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-[14px] text-foreground outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handlePostComment}
                  disabled={!draft.trim()}
                  aria-label="Post comment"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity active:scale-95 disabled:opacity-40 touch-manipulation"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Send Gift dialog ── */}
          <SendGiftDialog
            isOpen={showGift}
            onClose={() => setShowGift(false)}
            recipientName={article.author}
            recipientId={article.authorId}
            onSendGift={() => {
              // Optimistically bump the visible gift tally; the dialog itself
              // confirms + deducts the Mobi balance on success.
              setGiftCount((c) => c + 1);
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
