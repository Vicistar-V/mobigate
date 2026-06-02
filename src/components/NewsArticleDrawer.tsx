import { useEffect, useState } from "react";
import { Heart, Share2, UserPlus, Check, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import type { NewsArticle } from "@/data/trendingHeadlines";

interface NewsArticleDrawerProps {
  article: NewsArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewsArticleDrawer = ({ article, open, onOpenChange }: NewsArticleDrawerProps) => {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Sync optimistic state whenever a new article is opened.
  useEffect(() => {
    if (article) {
      setIsFollowing(!!article.isFollowing);
      setIsLiked(!!article.isLiked);
      setLikeCount(article.likes ?? 0);
    }
  }, [article]);

  if (!article) return null;

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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[92dvh] p-0">
        <div className="flex h-full flex-col">
          {/* Scrollable article body */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Hero image */}
            <div className="relative">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="h-56 w-full object-cover sm:h-64"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <DrawerClose asChild>
                <button
                  type="button"
                  aria-label="Close article"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm active:scale-95 touch-manipulation"
                >
                  <X className="h-5 w-5" />
                </button>
              </DrawerClose>
              {/* Category badge over the hero */}
              <div className="absolute bottom-3 left-3">
                <span className="inline-block rounded bg-destructive px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-destructive-foreground">
                  {article.category}
                </span>
              </div>
            </div>

            <div className="px-4 pb-6 pt-4">
              {/* Title */}
              <h1 className="font-serif text-xl font-extrabold leading-tight text-foreground sm:text-2xl">
                {article.title}
              </h1>

              {/* Author + meta */}
              <div className="mt-3 flex items-center gap-2 border-b border-border pb-3">
                <img
                  src={article.authorAvatar}
                  alt={article.author}
                  className="h-9 w-9 rounded-full border border-border object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate font-serif text-sm font-semibold text-foreground">
                    {article.author}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {article.timeAgo} | {article.privacy}
                  </p>
                </div>
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
          </div>

          {/* Sticky action bar */}
          <div className="border-t border-border bg-card px-4 py-3">
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleFollow}
                aria-pressed={isFollowing}
                className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2.5 text-[13px] font-semibold transition-colors active:scale-95 touch-manipulation ${
                  isFollowing ? "bg-[hsl(142_71%_45%)] text-white" : "bg-foreground text-background"
                }`}
              >
                {isFollowing ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button
                type="button"
                onClick={handleLike}
                aria-pressed={isLiked}
                className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2.5 text-[13px] font-semibold transition-colors active:scale-95 touch-manipulation ${
                  isLiked ? "bg-destructive text-destructive-foreground" : "bg-foreground text-background"
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {likeCount > 0 ? likeCount.toLocaleString() : "Like"}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 rounded-md bg-foreground px-2 py-2.5 text-[13px] font-semibold text-background active:scale-95 touch-manipulation"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
