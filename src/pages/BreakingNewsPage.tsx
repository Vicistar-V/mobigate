import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  Newspaper,
  Eye,
  MessageCircle,
  Share2,
  Clock,
  Flame,
} from "lucide-react";
import { feedPosts } from "@/data/posts";

const CATEGORIES = [
  "All",
  "Trending",
  "Local",
  "Sports",
  "Business",
  "Tech",
  "Politics",
] as const;

const BreakingNewsPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] =
    useState<(typeof CATEGORIES)[number]>("All");

  // Use article-style posts as the news pool, plus a couple of mixed
  const newsPool = useMemo(
    () =>
      feedPosts.filter(
        (p) => p.type === "Article" || p.type === "URL" || p.type === "PDF"
      ),
    []
  );

  // Synthesise category + time for display since data doesn't carry them
  const enriched = useMemo(
    () =>
      newsPool.map((p, i) => {
        const cat = CATEGORIES[(i % (CATEGORIES.length - 1)) + 1];
        const minutesAgo = 8 + ((i * 17) % 600);
        const hot = i % 3 === 0;
        return { post: p, category: cat, minutesAgo, hot };
      }),
    [newsPool]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter(({ post, category, hot }) => {
      if (activeCat === "Trending") {
        if (!hot) return false;
      } else if (activeCat !== "All" && category !== activeCat) {
        return false;
      }
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        (post.subtitle || "").toLowerCase().includes(q)
      );
    });
  }, [enriched, query, activeCat]);


  const topStory = filtered[0];
  const rest = filtered.slice(1);

  const formatTime = (m: number) =>
    m < 60 ? `${m}m ago` : m < 60 * 24 ? `${Math.floor(m / 60)}h ago` : `${Math.floor(m / 60 / 24)}d ago`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Sticky page bar */}
      <div className="sticky top-[var(--header-height)] z-30 bg-card border-b">
        <div className="px-3 py-2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
              <Newspaper className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold leading-tight truncate">
                Breaking News
              </h1>
              <p className="text-[11px] text-muted-foreground leading-tight truncate">
                Latest headlines across the Mobigate community
              </p>
            </div>
          </div>
          <Badge className="ml-auto bg-red-600 text-white text-[10px] h-5">
            LIVE
          </Badge>
        </div>

        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search headlines, reporters…"
              className="pl-9 h-9 text-[13px] rounded-full"
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto scrollbar-hide touch-pan-x">
          {CATEGORIES.map((c) => {
            const active = activeCat === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCat(c)}
                className={`shrink-0 h-7 px-3 rounded-full text-[11px] font-semibold border transition-colors ${
                  active
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-card text-foreground border-border hover:border-red-500/60"
                }`}
              >
                {c === "Trending" && (
                  <Flame className="h-3 w-3 inline mr-1 -mt-0.5" />
                )}
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-3 space-y-3 max-w-2xl mx-auto">
        {!topStory && (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            No headlines match your filters.
          </Card>
        )}

        {/* Top story (hero) */}
        {topStory && (
          <Card className="overflow-hidden border border-red-500/30">
            {topStory.post.imageUrl && (
              <div className="relative">
                <img
                  src={topStory.post.imageUrl}
                  alt={topStory.post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <Badge className="bg-red-600 text-white text-[10px]">
                    Top Story
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {topStory.category}
                  </Badge>
                </div>
              </div>
            )}
            <div className="p-3">
              <h2 className="text-[15px] font-bold leading-snug line-clamp-3">
                {topStory.post.title}
              </h2>
              {topStory.post.subtitle && (
                <p className="text-[12px] text-muted-foreground mt-1 line-clamp-2">
                  {topStory.post.subtitle}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={topStory.post.authorProfileImage} />
                  <AvatarFallback>
                    {topStory.post.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{topStory.post.author}</span>
                <span>·</span>
                <Clock className="h-3 w-3" />
                <span>{formatTime(topStory.minutesAgo)}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Rest as compact list */}
        {rest.map(({ post, category, minutesAgo, hot }) => (
          <Card
            key={post.id}
            className="overflow-hidden border border-border/60"
          >
            <div className="flex gap-2 p-2">
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-20 w-24 rounded-md object-cover shrink-0"
                  loading="lazy"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Badge variant="secondary" className="text-[9px] h-4 px-1.5">
                    {category}
                  </Badge>
                  {hot && (
                    <Badge className="bg-orange-500 text-white text-[9px] h-4 px-1.5">
                      <Flame className="h-2.5 w-2.5 mr-0.5" /> Hot
                    </Badge>
                  )}
                </div>
                <h3 className="text-[13px] font-semibold leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                  <span className="truncate max-w-[40%]">{post.author}</span>
                  <span>·</span>
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(minutesAgo)}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Eye className="h-3 w-3" /> {post.views}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MessageCircle className="h-3 w-3" /> {post.comments}
                  </span>
                  <button
                    type="button"
                    className="flex items-center gap-0.5 ml-auto hover:text-foreground"
                  >
                    <Share2 className="h-3 w-3" /> Share
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BreakingNewsPage;
