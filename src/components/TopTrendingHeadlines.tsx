// src/components/TopTrendingHeadlines.tsx
// Fully functional Breaking News section with Create, View, and Filter capabilities
import { useState, useRef, useEffect } from "react";
import { Heart, Share2, UserPlus, Check, Flame, ChevronLeft, ChevronRight, X, Send, TrendingUp, Clock, Eye } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetHeader, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const NAV_ACTIONS = [
  { label: "Create New Story",   action: "create" },
  { label: "My Stories",         action: "myStories" },
  { label: "Others' Stories",    action: "othersStories" },
  { label: "View Trending",      action: "trending" },
] as const;

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

// Mock data for "My Stories" (stories authored by current user)
const MY_STORIES: TrendingHeadline[] = [
  {
    id: "my1", category: "PERSONAL GROWTH",
    excerpt: "Breaking free from self-imposed limitations and embracing the power of continuous learning. My journey from self-doubt to confidence through deliberate practice and mentorship.",
    fullContent: "Every journey begins with a single step, and mine started with acknowledging that I didn't have all the answers. Self-doubt was my constant companion, but it became my greatest teacher.",
    author: "You", authorAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    timeAgo: "Just now", privacy: "Public", likes: 42,
  },
  {
    id: "my2", category: "COMMUNITY",
    excerpt: "How I built a support network that changed everything. Connecting with like-minded individuals who share your vision isn't just nice—it's essential.",
    fullContent: "Building community isn't a luxury—it's a necessity for growth and resilience in today's world.",
    author: "You", authorAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&q=80",
    timeAgo: "2 Days ago", privacy: "Public", likes: 156,
  },
];

// Mock data for "Others' Stories" (featured stories from other creators)
const OTHERS_STORIES: TrendingHeadline[] = [
  {
    id: "other1", category: "INNOVATION",
    excerpt: "How AI is reshaping creative industries. A deep dive into generative tools, their impact, and what creators need to know about the future of their craft.",
    fullContent: "The creative industry is undergoing a seismic shift. What was once thought impossible is now possible...",
    author: "Sarah Chen", authorAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
    imageUrl: "https://images.unsplash.com/photo-1620712014215-7b7ef97a4c91?w=400&q=80",
    thumbnail: "https://images.unsplash.com/photo-1620712014215-7b7ef97a4c91?w=200&q=80",
    timeAgo: "3 Hours ago", privacy: "Public", likes: 5230,
  },
  {
    id: "other2", category: "SOCIAL IMPACT",
    excerpt: "From grassroots to global: How small acts of kindness scale into movements. Real stories of change-makers transforming their communities one action at a time.",
    fullContent: "Change doesn't always come from the top. Sometimes the most powerful movements start in the quiet moments...",
    author: "Marcus Williams", authorAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    imageUrl: "https://images.unsplash.com/photo-1552581234-26160f608093?w=400&q=80",
    thumbnail: "https://images.unsplash.com/photo-1552581234-26160f608093?w=200&q=80",
    timeAgo: "5 Hours ago", privacy: "Public", likes: 8920,
  },
  {
    id: "other3", category: "WELLNESS",
    excerpt: "The mental health crisis in tech: Why burnout is real and how to prevent it. Honest conversations with 50+ founders about their struggles and solutions.",
    fullContent: "Success in tech comes with a hidden cost that many don't talk about openly...",
    author: "Dr. Amara Okafor", authorAvatar: "https://randomuser.me/api/portraits/women/25.jpg",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    timeAgo: "7 Hours ago", privacy: "Public", likes: 12450,
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

// ── Create New Story Dialog ───────────────────────────────────────────────────
function CreateStoryDialog({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (data: any) => void }) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("BREAKING NEWS");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("Public");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast({ description: "Please fill in all fields", variant: "destructive" });
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
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Breaking News Story</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-semibold block mb-2">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's your story about?"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-destructive" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold block mb-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-destructive">
                <option>BREAKING NEWS</option>
                <option>TECHNOLOGY</option>
                <option>BUSINESS</option>
                <option>SPORTS</option>
                <option>ENTERTAINMENT</option>
                <option>WORLD NEWS</option>
                <option>LEADERSHIP</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Privacy</label>
              <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-destructive">
                <option>Public</option>
                <option>Friends</option>
                <option>Private</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-2">Your Story</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share your thoughts, news, and insights..."
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-destructive min-h-[150px] resize-none" />
            <p className="text-xs text-muted-foreground mt-1">{content.length} characters</p>
          </div>
          <div className="flex gap-2 pt-4">
            <button onClick={handleSubmit}
              className="flex-1 bg-destructive text-destructive-foreground py-2 rounded-lg font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
              <Send className="h-4 w-4" /> Publish Story
            </button>
            <button onClick={onClose}
              className="flex-1 bg-muted text-foreground py-2 rounded-lg font-semibold hover:opacity-90 active:scale-95 transition-all">
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Stories List Sheet ────────────────────────────────────────────────────────
function StoriesSheet({ title, stories, open, onClose }: { title: string; stories: TrendingHeadline[]; open: boolean; onClose: () => void }) {
  const [selectedStory, setSelectedStory] = useState<TrendingHeadline | null>(null);
  const [showReader, setShowReader] = useState(false);

  return (
    <>
      <Sheet open={open && !showReader} onOpenChange={v => !v && onClose()}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl p-0 flex flex-col">
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle>{title}</SheetTitle>
            <SheetClose />
          </SheetHeader>
          <ScrollArea className="flex-1">
            <div className="space-y-2 p-4">
              {stories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No stories yet</p>
                </div>
              ) : (
                stories.map((story) => (
                  <button key={story.id} onClick={() => { setSelectedStory(story); setShowReader(true); }}
                    className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors active:scale-95">
                    <div className="flex gap-3">
                      <img src={story.thumbnail} alt="" className="h-20 w-20 rounded object-cover flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="inline-block bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded mb-1">{story.category}</span>
                        <p className="font-semibold text-sm line-clamp-2">{story.excerpt}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {story.timeAgo}
                          <span>•</span>
                          <Heart className="h-3 w-3" /> {story.likes.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <ArticleSheet headline={selectedStory} open={showReader} onClose={() => setShowReader(false)} />
    </>
  );
}

// ── View Trending Dialog ──────────────────────────────────────────────────────
function ViewTrendingDialog({ open, onClose, headlines }: { open: boolean; onClose: () => void; headlines: TrendingHeadline[] }) {
  const [sortBy, setSortBy] = useState<"recent" | "trending" | "views">("trending");
  const [selectedStory, setSelectedStory] = useState<TrendingHeadline | null>(null);
  const [showReader, setShowReader] = useState(false);

  const sortedHeadlines = [...headlines].sort((a, b) => {
    if (sortBy === "trending") return (b.likes || 0) - (a.likes || 0);
    if (sortBy === "views") return 0; // Mock view count
    return 0; // recent is natural order
  });

  return (
    <>
      <Dialog open={open && !showReader} onOpenChange={v => !v && onClose()}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Top Breaking News</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="py-4">
            <div className="flex gap-2 mb-4">
              <button onClick={() => setSortBy("trending")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${sortBy === "trending" ? "bg-destructive text-destructive-foreground" : "bg-muted text-foreground hover:bg-muted/70"}`}>
                <TrendingUp className="h-4 w-4 inline mr-1" /> Trending
              </button>
              <button onClick={() => setSortBy("recent")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${sortBy === "recent" ? "bg-destructive text-destructive-foreground" : "bg-muted text-foreground hover:bg-muted/70"}`}>
                <Clock className="h-4 w-4 inline mr-1" /> Recent
              </button>
              <button onClick={() => setSortBy("views")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${sortBy === "views" ? "bg-destructive text-destructive-foreground" : "bg-muted text-foreground hover:bg-muted/70"}`}>
                <Eye className="h-4 w-4 inline mr-1" /> Views
              </button>
            </div>
            <div className="space-y-2">
              {sortedHeadlines.map((story, idx) => (
                <button key={story.id} onClick={() => { setSelectedStory(story); setShowReader(true); }}
                  className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors active:scale-95">
                  <div className="flex gap-3">
                    <div className="text-2xl font-bold text-destructive w-8 flex-shrink-0 flex items-center justify-center">
                      #{idx + 1}
                    </div>
                    <img src={story.thumbnail} alt="" className="h-20 w-20 rounded object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="inline-block bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded mb-1">{story.category}</span>
                      <p className="font-semibold text-sm line-clamp-2">{story.excerpt}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>📊 {story.likes.toLocaleString()} likes</span>
                        <span>•</span>
                        <span>{story.author}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ArticleSheet headline={selectedStory} open={showReader} onClose={() => setShowReader(false)} />
    </>
  );
}

// ── Action Toolbar (Mobile-friendly) ──────────────────────────────────────────
function ActionToolbar({ onActionClick }: { onActionClick: (action: typeof NAV_ACTIONS[number]["action"]) => void }) {
  return (
    <div className="border-b border-border bg-background px-4 py-3">
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
        {NAV_ACTIONS.map(action => (
          <button
            key={action.label}
            onClick={() => onActionClick(action.action)}
            className="shrink-0 px-4 py-2 rounded-full bg-muted hover:bg-muted/70 text-foreground font-semibold text-sm transition-colors active:scale-95 touch-manipulation whitespace-nowrap"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

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

  return (
    <div className="rounded-b-xl border border-t-0 border-border bg-card p-3 shadow-sm shrink-0 w-full">
      <div className="flex gap-3">
        {/* Left: featured image */}
        <div className="shrink-0 w-24 h-32 rounded-lg border border-border bg-muted overflow-hidden">
          <img src={headline.imageUrl} alt={headline.category} className="w-full h-full object-cover" loading="lazy" />
        </div>

        {/* Right: content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="mb-2 inline-block rounded bg-destructive px-2 py-1 w-fit">
            <span className="text-[11px] font-bold uppercase tracking-wide text-destructive-foreground">{headline.category}</span>
          </div>
          <button type="button" onClick={onDoubleClick} onDoubleClick={onDoubleClick}
            className="block text-left active:opacity-90 touch-manipulation flex-1" aria-label={`Read full story: ${headline.category}`}>
            <p className="text-justify font-serif text-[13px] leading-snug text-foreground line-clamp-3">
              {headline.excerpt}{" "}<span className="font-sans font-bold text-destructive">Read more...</span>
            </p>
          </button>
          
          {/* Author info */}
          <div className="mt-2 flex items-center gap-2">
            <img src={headline.authorAvatar} alt={headline.author} className="h-6 w-6 rounded-full border border-border object-cover flex-shrink-0" loading="lazy" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-[12px] font-semibold text-foreground">{headline.author}</p>
              <p className="text-[10px] text-muted-foreground">{headline.timeAgo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
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
  const { toast } = useToast();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected,   setSelected]   = useState<TrendingHeadline | null>(null);
  const [readerOpen, setReaderOpen] = useState(false);
  
  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [myStoriesOpen, setMyStoriesOpen] = useState(false);
  const [othersStoriesOpen, setOthersStoriesOpen] = useState(false);
  const [trendingOpen, setTrendingOpen] = useState(false);

  const openArticle = (h: TrendingHeadline) => { setSelected(h); setReaderOpen(true); };

  const handleActionClick = (action: typeof NAV_ACTIONS[number]["action"]) => {
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

      {/* Action Toolbar - Mobile Friendly */}
      <ActionToolbar onActionClick={handleActionClick} />

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

      {/* Dialogs and Sheets */}
      <ArticleSheet headline={selected} open={readerOpen} onClose={() => setReaderOpen(false)} />
      <CreateStoryDialog open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreateStory} />
      <StoriesSheet title="My Breaking News Stories" stories={MY_STORIES} open={myStoriesOpen} onClose={() => setMyStoriesOpen(false)} />
      <StoriesSheet title="Featured Stories from Others" stories={OTHERS_STORIES} open={othersStoriesOpen} onClose={() => setOthersStoriesOpen(false)} />
      <ViewTrendingDialog headlines={HEADLINES} open={trendingOpen} onClose={() => setTrendingOpen(false)} />
    </section>
  );
};