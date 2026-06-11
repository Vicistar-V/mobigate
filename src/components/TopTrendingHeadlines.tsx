import { useState } from "react";
import { Heart, Share2, UserPlus, Check, Flame } from "lucide-react";
import {
  fallbackTrendingHeadline,
  trendingNavLinks,
  trendingToArticle,
  type TrendingHeadline,
} from "@/data/trendingHeadlines";
import { useTrendingHeadline } from "@/hooks/useWindowData";
import { useToast } from "@/hooks/use-toast";
import { NewsArticleDrawer } from "./NewsArticleDrawer";

export const TopTrendingHeadlines = () => {
  const phpHeadline = useTrendingHeadline() as TrendingHeadline | null;
  const headline = phpHeadline || fallbackTrendingHeadline;
  const { toast } = useToast();
  const [readerOpen, setReaderOpen] = useState(false);

  // Optimistic UI — toggle instantly, no spinners.
  const [isFollowing, setIsFollowing] = useState(!!headline.isFollowing);
  const [isLiked, setIsLiked] = useState(!!headline.isLiked);
  const [likeCount, setLikeCount] = useState(headline.likes ?? 0);


  const handleFollow = () => {
    setIsFollowing((prev) => {
      const next = !prev;
      toast({ description: next ? `Following ${headline.author}` : `Unfollowed ${headline.author}` });
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
      title: headline.category,
      text: headline.excerpt,
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
      /* user dismissed share sheet — no-op */
    }
  };

  return (
    <section className="mt-6" aria-label="Top trending headlines">
      {/* Banner title — bright red condensed uppercase on white, news-web aesthetic */}
      <div className="rounded-t-xl border border-b-0 border-border bg-background px-4 pt-3 pb-0">
        <div className="flex items-center justify-center gap-2">
          <Flame className="h-5 w-5 shrink-0 text-destructive" />
          <h2 className="text-center text-lg font-extrabold uppercase tracking-tight text-destructive sm:text-xl [font-stretch:condensed]">
            Top Trending Headlines!
          </h2>
        </div>
        {/* Red rule + green accent line beneath the title */}
        <div className="mt-2 h-[3px] w-full bg-destructive" />
        <div className="h-[2px] w-full bg-[hsl(142_71%_45%)]" />
      </div>

      {/* Card body */}
      <div className="rounded-b-xl border border-t-0 border-border bg-card p-3 shadow-sm">
        <div className="grid grid-cols-[112px_1fr] gap-3">
          {/* Left: portrait + nav links */}
          <div className="flex flex-col gap-2">
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={headline.imageUrl}
                alt={headline.author}
                className="aspect-[3/4] h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <nav className="mt-1 flex flex-1 flex-col justify-between gap-3" aria-label="Story navigation">
              {trendingNavLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleNav(link)}
                  className="w-full text-left text-[13px] font-semibold leading-tight text-[hsl(212_95%_50%)] underline underline-offset-2 transition-opacity hover:opacity-80 active:opacity-60 touch-manipulation"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: category box + excerpt + author */}
          <div className="min-w-0">
            <div className="mb-2 inline-block rounded bg-destructive px-2 py-1">
              <span className="text-[11px] font-bold uppercase tracking-wide text-destructive-foreground">
                {headline.category}
              </span>
            </div>

            {/* Excerpt with float-left thumbnail so text wraps and fills the bottom gap.
                The whole block opens the full article reader. */}
            <button
              type="button"
              onClick={() => setReaderOpen(true)}
              className="block w-full text-left active:opacity-90 touch-manipulation"
              aria-label={`Read full story: ${headline.category}`}
            >
              <img
                src={headline.thumbnail}
                alt=""
                className="float-left mr-2 mb-1 h-16 w-16 rounded-md border border-border object-cover"
                loading="lazy"
              />
              <p className="text-justify font-serif text-[13px] leading-snug text-foreground">
                {headline.excerpt}{" "}
                <span className="font-sans font-bold text-destructive">Read more...</span>
              </p>
            </button>


            {/* Author row */}
            <div className="mt-3 flex items-center gap-2">
              <img
                src={headline.authorAvatar}
                alt={headline.author}
                className="h-7 w-7 rounded-full border border-border object-cover"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="truncate font-serif text-[13px] font-semibold text-foreground">
                  {headline.author}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {headline.timeAgo} | {headline.privacy}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleFollow}
            aria-pressed={isFollowing}
            className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-[12px] font-semibold transition-colors active:scale-95 touch-manipulation ${
              isFollowing
                ? "bg-[hsl(142_71%_45%)] text-white"
                : "bg-foreground text-background"
            }`}
          >
            {isFollowing ? <Check className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
            {isFollowing ? "Following" : "Follow"}
          </button>
          <button
            type="button"
            onClick={handleLike}
            aria-pressed={isLiked}
            className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-[12px] font-semibold transition-colors active:scale-95 touch-manipulation ${
              isLiked ? "bg-destructive text-destructive-foreground" : "bg-foreground text-background"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`} />
            {likeCount > 0 ? likeCount.toLocaleString() : "Like"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 rounded-md bg-foreground px-2 py-2 text-[12px] font-semibold text-background active:scale-95 touch-manipulation"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>
      </div>

      <NewsArticleDrawer
        article={trendingToArticle(headline)}
        open={readerOpen}
        onOpenChange={setReaderOpen}
      />
    </section>
  );
};
