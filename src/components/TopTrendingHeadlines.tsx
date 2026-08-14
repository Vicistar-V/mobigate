// src/components/TopTrendingHeadlines.tsx
// Fully functional Breaking News & Stories section with dynamic sticky reading UX
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Heart,
  Share2,
  UserPlus,
  Check,
  Flame,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  TrendingUp,
  Clock,
  Eye,
  Minimize2,
  Maximize2,
  Bookmark,
  BookOpen,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export interface TrendingHeadline {
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

const NAV_ACTIONS = [
  { label: "Create New Story", action: "create" },
  { label: "My Stories", action: "myStories" },
  { label: "Others' Stories", action: "othersStories" },
  { label: "View Trending", action: "trending" },
] as const;

const HEADLINES: TrendingHeadline[] = [
  {
    id: "h1",
    category: "LEADERSHIP",
    excerpt:
      "True leadership is not about authority, but about responsibility and vision. The most effective leaders inspire trust, empower their people, and stay accountable through every challenge, turning pressure into progress and doubt into direction for everyone who follows them.",
    fullContent:
      "True leadership is not about authority, but about responsibility and vision. The most effective leaders inspire trust, empower their people, and stay accountable through every challenge, turning pressure into progress and doubt into direction for everyone who follows them.\n\nGreat leaders listen more than they speak. They create environments where people feel safe to contribute their best ideas and admit their mistakes. They set a clear direction but remain flexible in their approach, adapting to changing circumstances without losing sight of their goals.\n\nLeadership is ultimately a service to others — a daily commitment to show up, do the work, and put the team's success above personal recognition. Those who lead this way leave a lasting legacy that extends far beyond their time in any role.",
    author: "Anthony Samuel Odiba",
    authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    imageUrl:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=200&q=80",
    timeAgo: "2 Hours ago",
    privacy: "Public",
    likes: 1240,
  },
  {
    id: "h2",
    category: "WORLD NEWS",
    excerpt:
      "A historic moment unfolds at the Vatican as cardinals elect the first Pope of African descent in over a millennium, marking a profound turning point for the global Catholic community and 1.4 billion believers worldwide.",
    fullContent:
      "A historic moment unfolds at the Vatican as cardinals elect the first Pope of African descent in over a millennium, marking a profound turning point for the global Catholic community and 1.4 billion believers worldwide.\n\nThe new pontiff, widely respected for his pastoral work across three continents, addressed the faithful from the central balcony of St. Peter's Basilica to thunderous applause. Celebrations erupted across Nigeria, Congo, and Kenya within minutes of the white smoke appearing.\n\nAnalysts say the election signals a seismic shift in the Catholic Church's direction, with greater emphasis on the Global South and issues of poverty, climate change, and migration that disproportionately affect developing nations.",
    author: "Vatican Correspondent",
    authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    imageUrl:
      "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80",
    timeAgo: "3 Hours ago",
    privacy: "Public",
    likes: 48200,
  },
  {
    id: "h3",
    category: "TECHNOLOGY",
    excerpt:
      "Researchers unveil a new generation of perovskite-silicon solar cells achieving 47.6% efficiency — shattering all previous world records and promising to make renewable power cheaper than coal in over 90% of global markets by 2028.",
    fullContent:
      "Scientists at MIT and the Fraunhofer Institute have jointly announced a perovskite-silicon tandem solar cell achieving 47.6% efficiency under standard test conditions — shattering the previous world record.\n\nThe cells can be manufactured using existing semiconductor fabs with minimal retooling, putting the production cost well below $0.12 per watt. If scaled commercially, analysts estimate it could make solar cheaper than coal in 92% of global markets by 2028, potentially displacing 800 gigawatts of fossil fuel capacity.\n\nEnvironmental groups have called the breakthrough a 'genuine game-changer' while energy investors have already begun shifting capital toward the sector.",
    author: "Science & Tech Desk",
    authorAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    imageUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&q=80",
    timeAgo: "5 Hours ago",
    privacy: "Public",
    likes: 17300,
  },
  {
    id: "h4",
    category: "SPORTS",
    excerpt:
      "Nigeria's Super Eagles write history in the most dramatic World Cup semi-final ever played, coming back from 2-0 down at half-time to defeat Brazil 3-2, with Victor Osimhen scoring a stunning hat-trick in just 23 breathtaking minutes.",
    fullContent:
      "In one of the greatest upsets in World Cup history, Nigeria's Super Eagles came back from 2-0 down at half-time to defeat Brazil 3-2 in the semi-final, booking their place in the final for the very first time.\n\nVictor Osimhen's hat-trick in 23 second-half minutes will be replayed for generations. Over 40 million Nigerians watched the match live, with spontaneous street parties erupting from Lagos to Abuja, Kano to Port Harcourt.\n\nThe final will be played on Saturday against hosts Germany in Munich. The Super Eagles, ranked 38th in the world coming into the tournament, have now beaten Argentina, France, and Brazil on their incredible run.",
    author: "Sports Desk",
    authorAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
    imageUrl:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=200&q=80",
    timeAgo: "1 Hour ago",
    privacy: "Public",
    likes: 198000,
  },
  {
    id: "h5",
    category: "BUSINESS",
    excerpt:
      "Global stock indices climb to record highs after Apple, Microsoft, Alphabet and Meta all smash quarterly earnings forecasts, triggering the strongest single-day market rally of the year as investors pour over $9 billion into equities.",
    fullContent:
      "Wall Street and global markets experienced their strongest single-day rally of the year as Apple, Microsoft, Alphabet, and Meta all reported quarterly earnings that crushed analyst forecasts.\n\nThe S&P 500 rose 2.8%, with the NASDAQ leading gains at 4.1%. Retail investors poured a record $9.2 billion into equity funds in a single session. Tech sector market capitalisation grew by over $1.8 trillion in a single day.\n\nAnalysts warn that while the euphoria is warranted, valuations in AI-adjacent sectors are approaching territory that warrants caution — though few are predicting a near-term correction given the strength of underlying earnings.",
    author: "Financial Desk",
    authorAvatar: "https://randomuser.me/api/portraits/women/29.jpg",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=200&q=80",
    timeAgo: "4 Hours ago",
    privacy: "Public",
    likes: 29500,
  },
  {
    id: "h6",
    category: "ENTERTAINMENT",
    excerpt:
      "Director Chioma Obi's 'Daughters of the Delta' receives a 9-minute standing ovation at Cannes and wins the Palme d'Or — the first Nigerian film to claim cinema's most prestigious prize in its 78-year history.",
    fullContent:
      "In a historic night for African cinema, Chioma Obi's 'Daughters of the Delta' was awarded the Palme d'Or at the 78th Cannes Film Festival, receiving a 9-minute standing ovation that moved several jury members to tears.\n\nThe film, shot entirely in the Niger Delta with a non-professional cast, tells the story of three generations of women navigating environmental devastation and resilience. Streaming rights were acquired by Netflix within 24 hours for a reported $45 million.\n\nThe win has ignited renewed global debate about diversity in cinema awards, and has sent Nigerian filmmakers' international profile soaring to levels not seen in any previous generation.",
    author: "Entertainment",
    authorAvatar: "https://randomuser.me/api/portraits/women/61.jpg",
    imageUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&q=80",
    timeAgo: "6 Hours ago",
    privacy: "Public",
    likes: 33700,
  },
];

const MY_STORIES: TrendingHeadline[] = [
  {
    id: "my1",
    category: "PERSONAL GROWTH",
    excerpt:
      "Breaking free from self-imposed limitations and embracing the power of continuous learning. My journey from self-doubt to confidence through deliberate practice and mentorship.",
    fullContent:
      "Every journey begins with a single step, and mine started with acknowledging that I didn't have all the answers. Self-doubt was my constant companion, but it became my greatest teacher.\n\nWhen we stop trying to prove ourselves to others and start investing in our internal growth, everything shifts. You don't need a map for the entire mountain; you just need enough light for the next step.",
    author: "You",
    authorAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    timeAgo: "Just now",
    privacy: "Public",
    likes: 42,
  },
  {
    id: "my2",
    category: "COMMUNITY",
    excerpt:
      "How I built a support network that changed everything. Connecting with like-minded individuals who share your vision isn't just nice—it's essential.",
    fullContent:
      "Building community isn't a luxury—it's a necessity for growth and resilience in today's fast-paced world.\n\nSurround yourself with people who talk about ideas, visions, and solutions rather than problems and people. When you win together, everyone rises.",
    author: "You",
    authorAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&q=80",
    timeAgo: "2 Days ago",
    privacy: "Public",
    likes: 156,
  },
];

const OTHERS_STORIES: TrendingHeadline[] = [
  {
    id: "other1",
    category: "INNOVATION",
    excerpt:
      "How AI is reshaping creative industries. A deep dive into generative tools, their impact, and what creators need to know about the future of their craft.",
    fullContent:
      "The creative industry is undergoing a seismic shift. What was once thought impossible is now possible in seconds.\n\nGenerative AI will not replace artists; but artists using AI will replace those who refuse to adapt. The future belongs to hybrid thinkers who combine deep human empathy with algorithmic superpowers.",
    author: "Sarah Chen",
    authorAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
    imageUrl:
      "https://images.unsplash.com/photo-1620712014215-7b7ef97a4c91?w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1620712014215-7b7ef97a4c91?w=200&q=80",
    timeAgo: "3 Hours ago",
    privacy: "Public",
    likes: 5230,
  },
  {
    id: "other2",
    category: "SOCIAL IMPACT",
    excerpt:
      "From grassroots to global: How small acts of kindness scale into movements. Real stories of change-makers transforming their communities one action at a time.",
    fullContent:
      "Change doesn't always come from the top. Sometimes the most powerful movements start in the quietest moments.\n\nWhen communities band together around micro-initiatives—cleaning local waterways, funding school lunches, mentoring youth—they create momentum that governments can no longer ignore.",
    author: "Marcus Williams",
    authorAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    imageUrl:
      "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1552581234-26160f608093?w=200&q=80",
    timeAgo: "5 Hours ago",
    privacy: "Public",
    likes: 8920,
  },
  {
    id: "other3",
    category: "WELLNESS",
    excerpt:
      "The mental health crisis in tech: Why burnout is real and how to prevent it. Honest conversations with 50+ founders about their struggles and solutions.",
    fullContent:
      "Success in tech comes with a hidden cost that many don't talk about openly.\n\nOver 68% of founders report experiencing acute symptoms of depression or burnout during the growth phase of their startups. Normalizing rest, prioritizing physical wellness, and seeking professional therapy are foundational pillars of sustainable longevity.",
    author: "Dr. Amara Okafor",
    authorAvatar: "https://randomuser.me/api/portraits/women/25.jpg",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    timeAgo: "7 Hours ago",
    privacy: "Public",
    likes: 12450,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 🌟 ADVANCED ARTICLE READER (Mobile Optimized with Shrink/Dock UX & Sticky Title)
// ─────────────────────────────────────────────────────────────────────────────
interface ArticleReaderProps {
  headline: TrendingHeadline | null;
  open: boolean;
  onClose: () => void;
}

function ArticleReaderSheet({ headline, open, onClose }: ArticleReaderProps) {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  // States for UX mechanics
  const [isScrolled, setIsScrolled] = useState(false);
  const [manualMinimized, setManualMinimized] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Sync state when headline changes
  useEffect(() => {
    if (headline) {
      setIsLiked(!!headline.isLiked);
      setLikesCount(headline.likes || 0);
      setIsFollowing(!!headline.isFollowing);
      setManualMinimized(false);
      setIsScrolled(false);
      setReadingProgress(0);
    }
  }, [headline]);

  // Handle scroll event for dynamic sticky header & progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight - target.clientHeight;

    if (scrollHeight > 0) {
      setReadingProgress(Math.min(100, (scrollTop / scrollHeight) * 100));
    }

    // Shrink threshold
    if (scrollTop > 50 && !isScrolled) {
      setIsScrolled(true);
    } else if (scrollTop <= 50 && isScrolled) {
      setIsScrolled(false);
    }
  };

  const isMinimized = manualMinimized || isScrolled;

  const toggleManualMinimize = () => {
    setManualMinimized((prev) => !prev);
  };

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikesCount((c) => Math.max(0, c + (isLiked ? -1 : 1)));
  };

  const handleShare = async () => {
    if (!headline) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: headline.category,
          text: headline.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard?.writeText(window.location.href);
        toast({ description: "Story link copied to clipboard!" });
      }
    } catch {
      // Ignored
    }
  };

  if (!headline) return null;

  // Title calculation
  const firstSentence = headline.excerpt.split(".")[0] + ".";

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[94vh] sm:h-[90vh] max-w-3xl mx-auto rounded-t-3xl p-0 flex flex-col overflow-hidden border-t border-border shadow-2xl bg-background"
      >
        <SheetTitle className="sr-only">{headline.category}</SheetTitle>

        {/* ── TOP READING PROGRESS BAR ── */}
        <div className="w-full bg-muted/40 h-1 z-50">
          <div
            className="h-full bg-destructive transition-all duration-150 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* ── TOP STICKY APP BAR ── */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-3.5 py-2.5 bg-background/95 backdrop-blur-md border-b border-border/80 transition-all duration-300">
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 active:scale-95 transition-transform shrink-0"
              aria-label="Back / Close"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            {/* When minimized/scrolled: Show Docked Small Thumbnail + Category Badge + Sticky Title */}
            <div
              className={`flex items-center gap-2 min-w-0 transition-all duration-300 ${
                isMinimized
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <img
                src={headline.thumbnail || headline.imageUrl}
                alt=""
                onClick={toggleManualMinimize}
                className="h-8 w-8 rounded-md object-cover border border-border/60 shrink-0 cursor-pointer shadow-sm active:scale-95"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="bg-destructive text-white text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded shrink-0">
                    {headline.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">
                    {headline.author}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-foreground truncate leading-tight mt-0.5">
                  {firstSentence}
                </h3>
              </div>
            </div>
          </div>

          {/* Quick Action Icons in Header */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={toggleManualMinimize}
              className={`h-8 px-2 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${
                isMinimized
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              title={isMinimized ? "Expand Photo Banner" : "Minimize Photo"}
            >
              {isMinimized ? (
                <>
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline text-[11px]">Photo</span>
                </>
              ) : (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline text-[11px]">Focus</span>
                </>
              )}
            </button>

            <button
              onClick={handleLike}
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                isLiked
                  ? "bg-destructive text-white"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
              aria-label="Like story"
            >
              <Heart
                className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`}
              />
            </button>

            <button
              onClick={handleShare}
              className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 active:scale-95 transition-transform"
              aria-label="Share story"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* ── SCROLLABLE STORY CONTENT ── */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          {/* ── COLLAPSIBLE HERO IMAGE (Tappable & Shrinkable) ── */}
          <div
            onClick={toggleManualMinimize}
            className={`relative overflow-hidden cursor-pointer transition-all duration-500 ease-in-out select-none group ${
              isMinimized
                ? "h-0 opacity-0 pointer-events-none"
                : "h-56 sm:h-72 opacity-100"
            }`}
          >
            <img
              src={headline.imageUrl}
              alt={headline.category}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent" />

            {/* Tap to minimize hint badge */}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/10">
              <Minimize2 className="h-3 w-3" />
              <span>Tap to shrink image</span>
            </div>

            {/* Over-image category badge & heading */}
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block bg-destructive text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded shadow-sm mb-2 tracking-wider">
                {headline.category}
              </span>
              <p className="text-white text-base sm:text-lg font-extrabold leading-snug drop-shadow-md line-clamp-2">
                {firstSentence}
              </p>
            </div>
          </div>

          {/* ── MAIN READING BODY ── */}
          <main className="px-4 py-5 max-w-2xl mx-auto">
            {/* If minimized manually or by scroll, show a compact docked top banner */}
            {isMinimized && (
              <div className="mb-4 flex items-center justify-between p-2.5 rounded-xl bg-muted/60 border border-border">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={headline.thumbnail || headline.imageUrl}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover border shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-destructive uppercase tracking-wider block">
                      {headline.category}
                    </span>
                    <p className="text-xs font-semibold text-foreground truncate">
                      {firstSentence}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleManualMinimize}
                  className="shrink-0 px-2.5 py-1 text-[11px] font-semibold bg-background hover:bg-background/80 rounded-lg border text-foreground flex items-center gap-1"
                >
                  <Maximize2 className="h-3 w-3" /> Expand
                </button>
              </div>
            )}

            {/* ── MAIN STORY HEADING (In-page) ── */}
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground leading-tight font-serif mb-3">
              {firstSentence}
            </h1>

            {/* ── AUTHOR & META STRIP (Scrolls naturally away) ── */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
              <div className="flex items-center gap-3">
                <img
                  src={headline.authorAvatar}
                  alt={headline.author}
                  className="h-10 w-10 rounded-full border border-border object-cover"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-foreground">
                      {headline.author}
                    </p>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline" />
                    <span>{headline.timeAgo}</span>
                    <span>•</span>
                    <span>{headline.privacy}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsFollowing((p) => !p);
                  toast({
                    description: !isFollowing
                      ? `Following ${headline.author}`
                      : `Unfollowed ${headline.author}`,
                  });
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
                  isFollowing
                    ? "bg-emerald-600 text-white"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {isFollowing ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <UserPlus className="h-3 w-3" />
                )}
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>

            {/* ── STORY PARAGRAPHS ── */}
            <article className="space-y-4 font-serif text-[15px] sm:text-[16px] leading-relaxed text-foreground/90 selection:bg-destructive selection:text-white">
              {headline.fullContent.split("\n\n").map((para, idx) => (
                <p key={idx} className="text-justify">
                  {idx === 0 ? (
                    <>
                      <span className="float-left text-4xl font-sans font-black mr-2 leading-none text-destructive">
                        {para.charAt(0)}
                      </span>
                      {para.slice(1)}
                    </>
                  ) : (
                    para
                  )}
                </p>
              ))}
            </article>

            {/* ── ENGAGEMENT BAR (Bottom of Article) ── */}
            <div className="mt-8 pt-5 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                    isLiked
                      ? "bg-destructive text-white"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span>{likesCount.toLocaleString()} Likes</span>
                </button>

                <button
                  onClick={() => {
                    setIsBookmarked((b) => !b);
                    toast({
                      description: !isBookmarked
                        ? "Saved to bookmarks"
                        : "Removed from bookmarks",
                    });
                  }}
                  className={`p-2 rounded-full border transition-all ${
                    isBookmarked
                      ? "bg-foreground text-background"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <Bookmark
                    className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-xs font-bold hover:opacity-90 active:scale-95 transition-all"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Story</span>
              </button>
            </div>
          </main>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 📝 CREATE STORY DIALOG
// ─────────────────────────────────────────────────────────────────────────────
function CreateStoryDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("BREAKING NEWS");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("Public");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    onSubmit({ title, category, content, privacy });
    setTitle("");
    setContent("");
    setCategory("BREAKING NEWS");
    setPrivacy("Public");
    toast({ description: "Story published successfully! 🎉" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-destructive" />
            Share Your Breaking News Story
          </DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1.5 text-muted-foreground">
              Headline Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your story about?"
              className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-destructive"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1.5 text-muted-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-destructive"
              >
                <option>BREAKING NEWS</option>
                <option>TECHNOLOGY</option>
                <option>BUSINESS</option>
                <option>SPORTS</option>
                <option>ENTERTAINMENT</option>
                <option>WORLD NEWS</option>
                <option>LEADERSHIP</option>
                <option>PERSONAL GROWTH</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1.5 text-muted-foreground">
                Privacy
              </label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-destructive"
              >
                <option>Public</option>
                <option>Friends</option>
                <option>Private</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1.5 text-muted-foreground">
              Story Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, news, facts, and insights..."
              className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-destructive min-h-[140px] resize-none"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              {content.length} characters
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-destructive text-destructive-foreground py-2.5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="h-4 w-4" /> Publish Story
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-muted text-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 📚 STORIES LIST SHEET ("My Stories" & "Others' Stories")
// ─────────────────────────────────────────────────────────────────────────────
function StoriesSheet({
  title,
  stories,
  open,
  onClose,
  onSelectStory,
}: {
  title: string;
  stories: TrendingHeadline[];
  open: boolean;
  onClose: () => void;
  onSelectStory: (story: TrendingHeadline) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[75vh] max-w-2xl mx-auto rounded-t-3xl p-0 flex flex-col bg-background"
      >
        <div className="px-4 pt-4 pb-2 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-destructive" />
            <SheetTitle className="text-base font-bold">{title}</SheetTitle>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2.5 p-4">
            {stories.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-sm">No stories yet</p>
              </div>
            ) : (
              stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => {
                    onClose();
                    onSelectStory(story);
                  }}
                  className="w-full text-left p-3 rounded-xl border border-border hover:bg-muted/50 transition-all cursor-pointer active:scale-[0.98] bg-card shadow-xs"
                >
                  <div className="flex gap-3">
                    <img
                      src={story.thumbnail || story.imageUrl}
                      alt=""
                      className="h-20 w-20 rounded-lg object-cover shrink-0 border border-border/50"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="inline-block bg-destructive text-white text-[10px] font-black uppercase px-2 py-0.5 rounded mb-1">
                        {story.category}
                      </span>
                      <p className="font-bold text-xs sm:text-sm line-clamp-2 text-foreground leading-snug">
                        {story.excerpt}
                      </p>
                      <div className="flex items-center gap-2.5 mt-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {story.timeAgo}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-destructive font-semibold">
                          <Heart className="h-3 w-3 fill-current" />{" "}
                          {story.likes.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔥 VIEW TRENDING DIALOG
// ─────────────────────────────────────────────────────────────────────────────
function ViewTrendingDialog({
  open,
  onClose,
  headlines,
  onSelectStory,
}: {
  open: boolean;
  onClose: () => void;
  headlines: TrendingHeadline[];
  onSelectStory: (story: TrendingHeadline) => void;
}) {
  const [sortBy, setSortBy] = useState<"trending" | "recent" | "views">(
    "trending"
  );

  const sortedHeadlines = useMemo(() => {
    return [...headlines].sort((a, b) => {
      if (sortBy === "trending") return (b.likes || 0) - (a.likes || 0);
      return 0;
    });
  }, [headlines, sortBy]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-5">
        <DialogHeader className="pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-destructive" />
            <DialogTitle className="text-lg font-black uppercase tracking-tight">
              Top Trending Stories
            </DialogTitle>
          </div>
          <DialogClose />
        </DialogHeader>

        <div className="py-2">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            <button
              onClick={() => setSortBy("trending")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1 ${
                sortBy === "trending"
                  ? "bg-destructive text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" /> Trending
            </button>
            <button
              onClick={() => setSortBy("recent")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1 ${
                sortBy === "recent"
                  ? "bg-destructive text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              <Clock className="h-3.5 w-3.5" /> Recent
            </button>
            <button
              onClick={() => setSortBy("views")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1 ${
                sortBy === "views"
                  ? "bg-destructive text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> Most Read
            </button>
          </div>

          <div className="space-y-2">
            {sortedHeadlines.map((story, idx) => (
              <div
                key={story.id}
                onClick={() => {
                  onClose();
                  onSelectStory(story);
                }}
                className="w-full text-left p-3 rounded-xl border border-border hover:bg-muted/50 transition-all cursor-pointer active:scale-[0.98] bg-card"
              >
                <div className="flex gap-3 items-center">
                  <div className="text-xl font-black text-destructive w-7 shrink-0 text-center">
                    #{idx + 1}
                  </div>
                  <img
                    src={story.thumbnail || story.imageUrl}
                    alt=""
                    className="h-16 w-16 rounded-lg object-cover shrink-0 border"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="inline-block bg-destructive text-white text-[9px] font-black px-1.5 py-0.5 rounded mb-1 uppercase">
                      {story.category}
                    </span>
                    <p className="font-bold text-xs line-clamp-2 text-foreground">
                      {story.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                      <span>📊 {story.likes.toLocaleString()} likes</span>
                      <span>•</span>
                      <span>{story.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🧭 ACTION TOOLBAR
// ─────────────────────────────────────────────────────────────────────────────
function ActionToolbar({
  onActionClick,
}: {
  onActionClick: (action: (typeof NAV_ACTIONS)[number]["action"]) => void;
}) {
  return (
    <div className="border-b border-border bg-background px-4 py-2.5">
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {NAV_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => onActionClick(action.action)}
            className="shrink-0 px-3.5 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground font-bold text-xs transition-transform active:scale-95 touch-manipulation whitespace-nowrap shadow-2xs"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🃏 HEADLINE CAROUSEL CARD
// ─────────────────────────────────────────────────────────────────────────────
function HeadlineCard({
  headline,
  onOpenStory,
}: {
  headline: TrendingHeadline;
  onOpenStory: () => void;
}) {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(!!headline.isFollowing);
  const [isLiked, setIsLiked] = useState(!!headline.isLiked);
  const [likeCount, setLikeCount] = useState(headline.likes);

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing((p) => !p);
    toast({
      description: !isFollowing
        ? `Following ${headline.author}`
        : `Unfollowed ${headline.author}`,
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((p) => !p);
    setLikeCount((c) => Math.max(0, c + (isLiked ? -1 : 1)));
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: headline.category,
          text: headline.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard?.writeText(window.location.href);
        toast({ description: "Link copied!" });
      }
    } catch {}
  };

  return (
    <div className="rounded-b-xl border border-t-0 border-border bg-card p-3 shadow-sm shrink-0 w-full">
      <div className="flex gap-3">
        {/* Left: featured image - clicking directly opens story */}
        <div
          onClick={onOpenStory}
          className="shrink-0 w-24 h-32 rounded-lg border border-border bg-muted overflow-hidden cursor-pointer active:scale-95 transition-transform"
        >
          <img
            src={headline.imageUrl}
            alt={headline.category}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Right: content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="mb-1.5 inline-block rounded bg-destructive px-2 py-0.5">
              <span className="text-[10px] font-black uppercase tracking-wide text-destructive-foreground">
                {headline.category}
              </span>
            </div>
            <div
              onClick={onOpenStory}
              className="cursor-pointer block text-left active:opacity-80 touch-manipulation"
              aria-label={`Read full story: ${headline.category}`}
            >
              <p className="text-justify font-serif text-[12.5px] leading-snug text-foreground line-clamp-3">
                {headline.excerpt}{" "}
                <span className="font-sans font-bold text-destructive hover:underline">
                  Read more...
                </span>
              </p>
            </div>
          </div>

          {/* Author info */}
          <div className="mt-2 flex items-center gap-2">
            <img
              src={headline.authorAvatar}
              alt={headline.author}
              className="h-6 w-6 rounded-full border border-border object-cover shrink-0"
              loading="lazy"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-[11px] font-bold text-foreground">
                {headline.author}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {headline.timeAgo}
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
          className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-bold transition-colors active:scale-95 touch-manipulation ${
            isFollowing
              ? "bg-emerald-600 text-white"
              : "bg-foreground text-background"
          }`}
        >
          {isFollowing ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <UserPlus className="h-3.5 w-3.5" />
          )}
          {isFollowing ? "Following" : "Follow"}
        </button>

        <button
          type="button"
          onClick={handleLike}
          aria-pressed={isLiked}
          className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-bold transition-colors active:scale-95 touch-manipulation ${
            isLiked
              ? "bg-destructive text-destructive-foreground"
              : "bg-foreground text-background"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`} />
          {likeCount > 0 ? likeCount.toLocaleString() : "Like"}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 rounded-md bg-foreground px-2 py-1.5 text-[11px] font-bold text-background active:scale-95 touch-manipulation"
        >
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 MAIN COMPONENT EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const TopTrendingHeadlines = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const lastTap = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedStory, setSelectedStory] = useState<TrendingHeadline | null>(
    null
  );
  const [readerOpen, setReaderOpen] = useState(false);

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [myStoriesOpen, setMyStoriesOpen] = useState(false);
  const [othersStoriesOpen, setOthersStoriesOpen] = useState(false);
  const [trendingOpen, setTrendingOpen] = useState(false);

  const openArticle = useCallback((h: TrendingHeadline) => {
    setSelectedStory(h);
    setReaderOpen(true);
  }, []);

  const handleActionClick = (action: (typeof NAV_ACTIONS)[number]["action"]) => {
    switch (action) {
      case "create":
        setCreateOpen(true);
        break;
      case "myStories":
        setMyStoriesOpen(true);
        break;
      case "othersStories":
        setOthersStoriesOpen(true);
        break;
      case "trending":
        setTrendingOpen(true);
        break;
    }
  };

  const handleCreateStory = (data: any) => {
    toast({ description: `"${data.title}" published! 🚀` });
  };

  // Double-tap detector on slides
  const handleDoubleTap = (h: TrendingHeadline) => {
    const now = Date.now();
    if (now - lastTap.current < 350) {
      if (tapTimer.current) clearTimeout(tapTimer.current);
      openArticle(h);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
      tapTimer.current = setTimeout(() => {
        lastTap.current = 0;
      }, 400);
    }
  };

  // Update dot indicator on scroll
  const updateIdx = () => {
    const el = trackRef.current;
    if (!el) return;
    const w = el.scrollWidth / HEADLINES.length;
    setCurrentIdx(Math.round(el.scrollLeft / w));
  };

  // Auto-scroll loop
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const id = setInterval(() => {
      if (pausedRef.current || dragRef.current.active) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollLeft += 1.2;
      }
    }, 25);
    return () => clearInterval(id);
  }, []);

  const scrollBy = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "next" ? el.clientWidth : -el.clientWidth,
      behavior: "smooth",
    });
    pausedRef.current = true;
    setTimeout(() => {
      pausedRef.current = false;
    }, 2500);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
    };
    pausedRef.current = true;
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft =
      dragRef.current.scrollLeft - (e.clientX - dragRef.current.startX);
  };

  const onPointerUp = () => {
    dragRef.current.active = false;
    setTimeout(() => {
      pausedRef.current = false;
    }, 1500);
  };

  return (
    <section aria-label="Top trending headlines" className="w-full">
      {/* Header Banner */}
      <div className="rounded-t-xl border border-b-0 border-border bg-background px-4 pt-3 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 shrink-0 text-destructive" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-destructive [font-stretch:condensed]">
              Top Trending Headlines!
            </h2>
          </div>
          {/* Navigation arrows */}
          <div className="flex gap-1">
            <button
              onClick={() => scrollBy("prev")}
              className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              aria-label="Previous story"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollBy("next")}
              className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              aria-label="Next story"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-2 h-[3px] w-full bg-destructive" />
        <div className="h-[2px] w-full bg-emerald-600" />
      </div>

      {/* Action Toolbar */}
      <ActionToolbar onActionClick={handleActionClick} />

      {/* Carousel Track */}
      <div
        ref={trackRef}
        onScroll={updateIdx}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="flex overflow-x-auto scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          userSelect: "none",
          cursor: "grab",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {HEADLINES.map((h) => (
          <div key={h.id} className="shrink-0 w-full">
            <HeadlineCard
              headline={h}
              onOpenStory={() => openArticle(h)}
            />
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-1.5 mt-2">
        {HEADLINES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIdx ? "w-5 bg-destructive" : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* ── UNIFIED FULL-SCREEN / DRAWER ARTICLE READER ── */}
      <ArticleReaderSheet
        headline={selectedStory}
        open={readerOpen}
        onClose={() => setReaderOpen(false)}
      />

      {/* ── MODALS & SHEETS ── */}
      <CreateStoryDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateStory}
      />
      <StoriesSheet
        title="My Stories"
        stories={MY_STORIES}
        open={myStoriesOpen}
        onClose={() => setMyStoriesOpen(false)}
        onSelectStory={(story) => openArticle(story)}
      />
      <StoriesSheet
        title="Featured Stories from Others"
        stories={OTHERS_STORIES}
        open={othersStoriesOpen}
        onClose={() => setOthersStoriesOpen(false)}
        onSelectStory={(story) => openArticle(story)}
      />
      <ViewTrendingDialog
        headlines={HEADLINES}
        open={trendingOpen}
        onClose={() => setTrendingOpen(false)}
        onSelectStory={(story) => openArticle(story)}
      />
    </section>
  );
};
export default TopTrendingHeadlines;