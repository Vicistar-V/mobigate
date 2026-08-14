// src/components/TopTrendingHeadlines.tsx
// Keeps the original card design from project — adds multiple headlines that slide
import { useState, useRef, useEffect } from "react";
import { Heart, Share2, UserPlus, Check, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface TrendingHeadline {
  id: string;
  category: string;
  excerpt: string;
  fullContent: string;
  author: string;
  authorAvatar: string;
  imageUrl: string;
  thumbnail: string;
  timeAgo: string;
  privacy: string;
  likes: number;
  isLiked?: boolean;
  isFollowing?: boolean;
}

const NAV_LINKS = [
  { label: "Create New Story",   href: "#" },
  { label: "My Stories",         href: "#" },
  { label: "Others' Stories",    href: "#" },
  { label: "View Trending",      href: "#" },
  { label: "New Subscribers",    href: "#" },
  { label: "Privacy",            href: "#" },
];

const HEADLINES: TrendingHeadline[] = [
  {
    id: "h1", category: "LEADERSHIP",
    excerpt: "True leadership is not about authority, but about responsibility and vision. The most effective leaders inspire trust, empower their people, and stay accountable through every challenge, turning pressure into progress and doubt into direction for everyone who follows them.",
    fullContent: "True leadership is not about authority, but about responsibility and vision. The most effective leaders inspire trust, empower their people, and stay accountable through every challenge, turning pressure into progress and doubt into direction for everyone who follows them.\n\nGreat leaders listen more than they speak. They create environments where people feel safe to contribute their best ideas and admit their mistakes. They set a clear direction but remain flexible in their approach, adapting to changing circumstances without losing sight of their goals.\n\nLeadership is ultimately a service to others — a daily commitment to show up, do the work, and put the team's success above personal recognition. Those who lead this way leave a lasting legacy that extends far beyond their time in any role.",
    author: "Anthony Samuel Odiba", authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80",
    thumbnail: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=200&q=80",
    timeAgo: "2 Hours ago", privacy: "Public", likes: 1240,
  },
  {
    id: "h2", category: "WORLD NEWS",
    excerpt: "A historic moment unfolds at the Vatican as cardinals elect the first Pope of African descent in over a millennium, marking a profound turning point for the global Catholic community and 1.4 billion believers worldwide.",
    fullContent: "A historic moment unfolds at the Vatican as cardinals elect the first Pope of African descent in over a millennium, marking a profound turning point for the global Catholic community and 1.4 billion believers worldwide.\n\nThe new pontiff, widely respected for his pastoral work across three continents, addressed the faithful from the central balcony of St. Peter's Basilica to thunderous applause. Celebrations erupted across Nigeria, Congo, and Kenya within minutes of the white smoke appearing.\n\nAnalysts say the election signals a seismic shift in the Catholic Church's direction, with greater emphasis on the Global South and issues of poverty, climate change, and migration that disproportionately affect developing nations.",
    author: "Vatican Correspondent", authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    imageUrl: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&q=80",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80",
    timeAgo: "3 Hours ago", privacy: "Public", likes: 48200,
  },
  {
    id: "h3", category: "TECHNOLOGY",
    excerpt: "Researchers unveil a new generation of perovskite-silicon solar cells achieving 47.6% efficiency — shattering all previous world records and promising to make renewable power cheaper than coal in over 90% of global markets by 2028.",
    fullContent: "Scientists at MIT and the Fraunhofer Institute have jointly announced a perovskite-silicon tandem solar cell achieving 47.6% efficiency under standard test conditions — shattering the previous world record.\n\nThe cells can be manufactured using existing semiconductor fabs with minimal retooling, putting the production cost well below $0.12 per watt. If scaled commercially, analysts estimate it could make solar cheaper than coal in 92% of global markets by 2028, potentially displacing 800 gigawatts of fossil fuel capacity.\n\nEnvironmental groups have called the breakthrough a 'genuine game-changer' while energy investors have already begun shifting capital toward the sector.",
    author: "Science & Tech Desk", authorAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80",
    thumbnail: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&q=80",
    timeAgo: "5 Hours ago", privacy: "Public", likes: 17300,
  },
  {
    id: "h4", category: "SPORTS",
    excerpt: "Nigeria's Super Eagles write history in the most dramatic World Cup semi-final ever played, coming back from 2-0 down at half-time to defeat Brazil 3-2, with Victor Osimhen scoring a stunning hat-trick in just 23 breathtaking minutes.",
    fullContent: "In one of the greatest upsets in World Cup history, Nigeria's Super Eagles came back from 2-0 down at half-time to defeat Brazil 3-2 in the semi-final, booking their place in the final for the very first time.\n\nVictor Osimhen's hat-trick in 23 second-half minutes will be replayed for generations. Over 40 million Nigerians watched the match live, with spontaneous street parties erupting from Lagos to Abuja, Kano to Port Harcourt.\n\nThe final will be played on Saturday against hosts Germany in Munich. The Super Eagles, ranked 38th in the world coming into the tournament, have now beaten Argentina, France, and Brazil on their incredible run.",
    author: "Sports Desk", authorAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80",
    thumbnail: "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=200&q=80",
    timeAgo: "1 Hour ago", privacy: "Public", likes: 198000,
  },
  {
    id: "h5", category: "BUSINESS",
    excerpt: "Global stock indices climb to record highs after Apple, Microsoft, Alphabet and Meta all smash quarterly earnings forecasts, triggering the strongest single-day market rally of the year as investors pour over $9 billion into equities.",
    fullContent: "Wall Street and global markets experienced their strongest single-day rally of the year as Apple, Microsoft, Alphabet, and Meta all reported quarterly earnings that crushed analyst forecasts.\n\nThe S&P 500 rose 2.8%, with the NASDAQ leading gains at 4.1%. Retail investors poured a record $9.2 billion into equity funds in a single session. Tech sector market capitalisation grew by over $1.8 trillion in a single day.\n\nAnalysts warn that while the euphoria is warranted, valuations in AI-adjacent sectors are approaching territory that warrants caution — though few are predicting a near-term correction given the strength of underlying earnings.",
    author: "Financial Desk", authorAvatar: "https://randomuser.me/api/portraits/women/29.jpg",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=200&q=80",
    timeAgo: "4 Hours ago", privacy: "Public", likes: 29500,
  },
  {
    id: "h6", category: "ENTERTAINMENT",
    excerpt: "Director Chioma Obi's 'Daughters of the Delta' receives a 9-minute standing ovation at Cannes and wins the Palme d'Or — the first Nigerian film to claim cinema's most prestigious prize in its 78-year history.",
    fullContent: "In a historic night for African cinema, Chioma Obi's 'Daughters of the Delta' was awarded the Palme d'Or at the 78th Cannes Film Festival, receiving a 9-minute standing ovation that moved several jury members to tears.\n\nThe film, shot entirely in the Niger Delta with a non-professional cast, tells the story of three generations of women navigating environmental devastation and resilience. Streaming rights were acquired by Netflix within 24 hours for a reported $45 million.\n\nThe win has ignited renewed global debate about diversity in cinema awards, and has sent Nigerian filmmakers' international profile soaring to levels not seen in any previous generation.",
    author: "Entertainment", authorAvatar: "https://randomuser.me/api/portraits/women/61.jpg",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&q=80",
    timeAgo: "6 Hours ago", privacy: "Public", likes: 33700,
  },
];

// ── Article reader sheet (opens on double-click / double-tap) ─────────────────
function ArticleSheet({ headline, open, onClose }: { headline: TrendingHeadline | null; open: boolean; onClose: () => void }) {
  if (!headline) return null;
  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0 flex flex-col overflow-hidden">
        <SheetTitle className="sr-only">{headline.category}</SheetTitle>
        <div className="relative h-44 shrink-0 overflow-hidden">
          <img src={headline.imageUrl} alt={headline.category} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <span className="inline-block bg-destructive text-white text-[11px] font-bold uppercase px-2 py-0.5 rounded mb-1">{headline.category}</span>
            <p className="text-white text-sm font-bold leading-snug line-clamp-2">{headline.excerpt.split('.')[0]}.</p>
          </div>
        </div>
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <img src={headline.authorAvatar} alt={headline.author} className="h-8 w-8 rounded-full border object-cover" />
              <div>
                <p className="text-sm font-semibold">{headline.author}</p>
                <p className="text-xs text-muted-foreground">{headline.timeAgo} · {headline.privacy}</p>
              </div>
            </div>
            <div className="font-serif text-[14px] leading-relaxed whitespace-pre-line">{headline.fullContent}</div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ── HeadlineCard — original design, unchanged ─────────────────────────────────
function HeadlineCard({
  headline,
  onDoubleClick,
}: {
  headline: TrendingHeadline;
  onDoubleClick: () => void;
}) {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(!!headline.isFollowing);
  const [isLiked, setIsLiked] = useState(!!headline.isLiked);
  const [likeCount, setLikeCount] = useState(headline.likes);

  const handleFollow = () => {
    setIsFollowing(p => !p);
    toast({ description: !isFollowing ? `Following ${headline.author}` : `Unfollowed ${headline.author}` });
  };
  const handleLike = () => {
    setIsLiked(p => !p);
    setLikeCount(c => Math.max(0, c + (isLiked ? -1 : 1)));
  };
  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: headline.category, text: headline.excerpt, url: window.location.href });
      else { await navigator.clipboard?.writeText(window.location.href); toast({ description: "Link copied!" }); }
    } catch {}
  };
  const handleNav = (link: { label: string }) => toast({ description: `Opening "${link.label}"…` });

  return (
    <div className="rounded-b-xl border border-t-0 border-border bg-card p-3 shadow-sm shrink-0 w-full">
      <div className="grid grid-cols-[112px_1fr] gap-3">
        {/* Left: portrait + nav links */}
        <div className="flex flex-col gap-2">
          <div className="overflow-hidden rounded-lg border border-border bg-muted">
            <img src={headline.imageUrl} alt={headline.author} className="aspect-[3/4] h-full w-full object-cover" loading="lazy" />
          </div>
          <nav className="mt-1 flex flex-1 flex-col justify-between gap-3">
            {NAV_LINKS.map(link => (
              <button key={link.label} type="button" onClick={() => handleNav(link)}
                className="w-full text-left text-[13px] font-semibold leading-tight text-[hsl(212_95%_50%)] underline underline-offset-2 hover:opacity-80 active:opacity-60 touch-manipulation">
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: category + excerpt + author */}
        <div className="min-w-0">
          <div className="mb-2 inline-block rounded bg-destructive px-2 py-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-destructive-foreground">{headline.category}</span>
          </div>
          <button type="button" onClick={onDoubleClick} onDoubleClick={onDoubleClick}
            className="block w-full text-left active:opacity-90 touch-manipulation" aria-label={`Read full story: ${headline.category}`}>
            <img src={headline.thumbnail} alt="" className="float-left mr-2 mb-1 h-16 w-16 rounded-md border border-border object-cover" loading="lazy" />
            <p className="text-justify font-serif text-[13px] leading-snug text-foreground">
              {headline.excerpt}{" "}<span className="font-sans font-bold text-destructive">Read more...</span>
            </p>
          </button>
          {/* Author row */}
          <div className="mt-3 flex items-center gap-2">
            <img src={headline.authorAvatar} alt={headline.author} className="h-7 w-7 rounded-full border border-border object-cover" loading="lazy" />
            <div className="min-w-0">
              <p className="truncate font-serif text-[13px] font-semibold text-foreground">{headline.author}</p>
              <p className="text-[10px] text-muted-foreground">{headline.timeAgo} | {headline.privacy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Follow / Like / Share */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button type="button" onClick={handleFollow} aria-pressed={isFollowing}
          className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-[12px] font-semibold transition-colors active:scale-95 touch-manipulation ${isFollowing ? "bg-[hsl(142_71%_45%)] text-white" : "bg-foreground text-background"}`}>
          {isFollowing ? <Check className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
          {isFollowing ? "Following" : "Follow"}
        </button>
        <button type="button" onClick={handleLike} aria-pressed={isLiked}
          className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-[12px] font-semibold transition-colors active:scale-95 touch-manipulation ${isLiked ? "bg-destructive text-destructive-foreground" : "bg-foreground text-background"}`}>
          <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`} />
          {likeCount > 0 ? likeCount.toLocaleString() : "Like"}
        </button>
        <button type="button" onClick={handleShare}
          className="flex items-center justify-center gap-1.5 rounded-md bg-foreground px-2 py-2 text-[12px] font-semibold text-background active:scale-95 touch-manipulation">
          <Share2 className="h-3.5 w-3.5" />Share
        </button>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export const TopTrendingHeadlines = () => {
  const trackRef    = useRef<HTMLDivElement>(null);
  const pausedRef   = useRef(false);
  const dragRef     = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const lastTap     = useRef(0);
  const tapTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected,   setSelected]   = useState<TrendingHeadline | null>(null);
  const [readerOpen, setReaderOpen] = useState(false);

  const openArticle = (h: TrendingHeadline) => { setSelected(h); setReaderOpen(true); };

  // Double-tap detector
  const handleDoubleTap = (h: TrendingHeadline) => {
    const now = Date.now();
    if (now - lastTap.current < 350) {
      if (tapTimer.current) clearTimeout(tapTimer.current);
      openArticle(h);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
      tapTimer.current = setTimeout(() => { lastTap.current = 0; }, 400);
    }
  };

  // Update dot indicator
  const updateIdx = () => {
    const el = trackRef.current;
    if (!el) return;
    const w = el.scrollWidth / HEADLINES.length;
    setCurrentIdx(Math.round(el.scrollLeft / w));
  };

  // Auto-scroll right → left (1.2px every 20ms)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const id = setInterval(() => {
      if (pausedRef.current || dragRef.current.active) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollLeft += 1.2;
    }, 20);
    return () => clearInterval(id);
  }, []);

  const scrollBy = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "next" ? el.clientWidth : -el.clientWidth, behavior: "smooth" });
    pausedRef.current = true;
    setTimeout(() => { pausedRef.current = false; }, 2500);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    dragRef.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft };
    pausedRef.current = true;
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = dragRef.current.scrollLeft - (e.clientX - dragRef.current.startX);
  };
  const onPointerUp = () => {
    dragRef.current.active = false;
    setTimeout(() => { pausedRef.current = false; }, 1500);
  };

  return (
    <section aria-label="Top trending headlines">
      {/* Banner title — original design */}
      <div className="rounded-t-xl border border-b-0 border-border bg-background px-4 pt-3 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 shrink-0 text-destructive" />
            <h2 className="text-lg font-extrabold uppercase tracking-tight text-destructive sm:text-xl [font-stretch:condensed]">
              Top Trending Headlines!
            </h2>
          </div>
          {/* Navigation arrows */}
          <div className="flex gap-1">
            <button onClick={() => scrollBy("prev")} className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => scrollBy("next")} className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-2 h-[3px] w-full bg-destructive" />
        <div className="h-[2px] w-full bg-[hsl(142_71%_45%)]" />
      </div>

      {/* Sliding track — each HeadlineCard is one slide */}
      <div
        ref={trackRef}
        onScroll={updateIdx}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="flex overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", userSelect: "none", cursor: "grab", WebkitOverflowScrolling: "touch" }}
      >
        {HEADLINES.map(h => (
          <div key={h.id} className="shrink-0 w-full">
            <HeadlineCard headline={h} onDoubleClick={() => handleDoubleTap(h)} />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-2">
        {HEADLINES.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIdx ? "w-5 bg-destructive" : "w-1.5 bg-muted-foreground/30"}`} />
        ))}
      </div>

      <ArticleSheet headline={selected} open={readerOpen} onClose={() => setReaderOpen(false)} />
    </section>
  );
};