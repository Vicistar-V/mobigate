import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { ChevronDown, Eye, MessageSquare, Share2, Video, Image as ImageIcon, FileText, TrendingUp, Heart, Play } from "lucide-react";
import { mockNewsData, NewsItem } from "@/data/newsData";
import { formatDistanceToNow } from "date-fns";
import { NewsDetailDialog } from "./NewsDetailDialog";
import { CreateNewsForm } from "./CreateNewsForm";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdCardProps } from "@/components/PremiumAdCard";
import React from "react";

const categoryFilters = [
  { value: "all", label: "All Categories" },
  { value: "announcements", label: "Announcements" },
  { value: "events", label: "Events" },
  { value: "updates", label: "Updates" },
  { value: "general", label: "General News" },
  { value: "affairs", label: "Community Affairs" },
];

const dateTimeFilters = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

const mediaTypeFilters = [
  { value: "all", label: "All Media" },
  { value: "video", label: "Videos" },
  { value: "photo", label: "Photos" },
  { value: "article", label: "Articles" },
];

const sortByFilters = [
  { value: "all", label: "Default" },
  { value: "trending", label: "Trending Now" },
  { value: "viewed", label: "Most Viewed" },
  { value: "commented", label: "Most Commented" },
  { value: "shared", label: "Most Shared" },
  { value: "latest", label: "Latest" },
];

interface CommunityNewsSectionProps {
  className?: string;
  premiumAdSlots?: PremiumAdCardProps[];
  showPeopleYouMayKnow?: boolean;
  canPostNews?: boolean;
}

export function CommunityNewsSection({ 
  className,
  premiumAdSlots = [],
  showPeopleYouMayKnow = false,
  canPostNews = true
}: CommunityNewsSectionProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateTimeFilter, setDateTimeFilter] = useState("all");
  const [mediaTypeFilter, setMediaTypeFilter] = useState("all");
  const [sortByFilter, setSortByFilter] = useState("all");
  
  // State for news detail dialog
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  // State for likes
  const [likedNews, setLikedNews] = useState<Set<string>>(new Set());
  const [newsLikes, setNewsLikes] = useState<Record<string, number>>({});
  
  // State for pagination
  const [visibleNewsCount, setVisibleNewsCount] = useState(10);
  
  // State for user-created news
  const [userNews, setUserNews] = useState<NewsItem[]>([]);
  
  // Reset visible count when filters change
  useEffect(() => {
    setVisibleNewsCount(10);
  }, [categoryFilter, dateTimeFilter, mediaTypeFilter, sortByFilter]);

  // Filter and sort news items
  const filteredNews = useMemo(() => {
    // Combine user-created news with existing news data
    let filtered = [...userNews, ...mockNewsData];

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Date/Time filter
    if (dateTimeFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        
        switch (dateTimeFilter) {
          case "today":
            return itemDate >= today;
          case "week":
            return itemDate >= weekAgo;
          case "month":
            return itemDate >= monthAgo;
          case "year":
            return itemDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    // Media Type filter
    if (mediaTypeFilter !== "all") {
      filtered = filtered.filter((item) => item.mediaType === mediaTypeFilter);
    }

    // Sort By filter
    if (sortByFilter !== "all") {
      switch (sortByFilter) {
        case "trending":
          filtered = filtered.filter((item) => item.trending);
          break;
        case "viewed":
          filtered.sort((a, b) => b.views - a.views);
          break;
        case "commented":
          filtered.sort((a, b) => b.comments - a.comments);
          break;
        case "shared":
          filtered.sort((a, b) => b.shares - a.shares);
          break;
        case "latest":
          filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          break;
      }
    }

    return filtered;
  }, [categoryFilter, dateTimeFilter, mediaTypeFilter, sortByFilter, userNews]);
  
  // Pagination logic
  const displayedNews = filteredNews.slice(0, visibleNewsCount);
  const hasMoreNews = visibleNewsCount < filteredNews.length;
  const canCollapseNews = visibleNewsCount > 10;

  const handleLoadMore = () => {
    setVisibleNewsCount((prev) => Math.min(prev + 10, filteredNews.length));
  };

  const handleShowLess = () => {
    setVisibleNewsCount(10);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getMediaIcon = (mediaType: NewsItem["mediaType"]) => {
    switch (mediaType) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "photo":
        return <ImageIcon className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: NewsItem["category"]) => {
    switch (category) {
      case "announcements":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "events":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "updates":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "general":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      case "affairs":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Handler to open news detail dialog
  const handleNewsClick = (news: NewsItem) => {
    setSelectedNews(news);
    setDetailOpen(true);
  };

  // Handler for like toggle
  const handleLike = (newsId: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent card click
    setLikedNews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
        setNewsLikes(p => ({ ...p, [newsId]: (p[newsId] || mockNewsData.find(n => n.id === newsId)?.likes || 0) - 1 }));
      } else {
        newSet.add(newsId);
        setNewsLikes(p => ({ ...p, [newsId]: (p[newsId] || mockNewsData.find(n => n.id === newsId)?.likes || 0) + 1 }));
      }
      return newSet;
    });
  };

  // Handler for share
  const handleShare = async (news: NewsItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ description: "Link copied to clipboard" });
    }
  };

  const handleNewsCreated = (news: NewsItem) => {
    setUserNews(prev => [news, ...prev]);
    toast({
      title: "Success!",
      description: "Your news has been published successfully.",
    });
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">News Info</h2>
      </div>

      {/* Create News Form */}
      {canPostNews && (
        <CreateNewsForm 
          onNewsCreated={handleNewsCreated}
          canPost={canPostNews}
        />
      )}

      {/* Filter Tabs */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap gap-2">
          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span className="text-sm">
                  {categoryFilters.find((f) => f.value === categoryFilter)?.label || "Category"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background">
              {categoryFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setCategoryFilter(filter.value)}
                  className={categoryFilter === filter.value ? "bg-accent" : ""}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date/Time Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span className="text-sm">
                  {dateTimeFilters.find((f) => f.value === dateTimeFilter)?.label || "Date/Time"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background">
              {dateTimeFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setDateTimeFilter(filter.value)}
                  className={dateTimeFilter === filter.value ? "bg-accent" : ""}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Media Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span className="text-sm">
                  {mediaTypeFilters.find((f) => f.value === mediaTypeFilter)?.label || "Media Type"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background">
              {mediaTypeFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setMediaTypeFilter(filter.value)}
                  className={mediaTypeFilter === filter.value ? "bg-accent" : ""}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort By Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span className="text-sm">
                  {sortByFilters.find((f) => f.value === sortByFilter)?.label || "Sort By"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background">
              {sortByFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setSortByFilter(filter.value)}
                  className={sortByFilter === filter.value ? "bg-accent" : ""}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active Filters Display */}
        {(categoryFilter !== "all" || dateTimeFilter !== "all" || mediaTypeFilter !== "all" || sortByFilter !== "all") && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {categoryFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {categoryFilters.find((f) => f.value === categoryFilter)?.label}
              </Badge>
            )}
            {dateTimeFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {dateTimeFilters.find((f) => f.value === dateTimeFilter)?.label}
              </Badge>
            )}
            {mediaTypeFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {mediaTypeFilters.find((f) => f.value === mediaTypeFilter)?.label}
              </Badge>
            )}
            {sortByFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {sortByFilters.find((f) => f.value === sortByFilter)?.label}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategoryFilter("all");
                setDateTimeFilter("all");
                setMediaTypeFilter("all");
                setSortByFilter("all");
              }}
              className="h-6 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* News Items */}
      <div className="space-y-4">
        {displayedNews.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No news items match your filters.</p>
          </Card>
        ) : (
          displayedNews.map((news, index) => (
            <React.Fragment key={news.id}>
              <Card 
                className="p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]"
                onClick={() => handleNewsClick(news)}
              >
                <div className="space-y-3">
                  {/* Header with badges */}
                  <div className="flex flex-wrap items-start gap-2">
                    <Badge className={getCategoryColor(news.category)}>
                      {categoryFilters.find((f) => f.value === news.category)?.label}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      {getMediaIcon(news.mediaType)}
                      <span className="capitalize">{news.mediaType}</span>
                    </Badge>
                    {news.trending && (
                      <Badge variant="default" className="gap-1 bg-primary">
                        <TrendingUp className="h-3 w-3" />
                        Trending
                      </Badge>
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(news.date), { addSuffix: true })}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-foreground mb-2">
                      {news.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {news.description}
                    </p>
                  </div>

                  {/* Thumbnail for media items */}
                  {news.thumbnail && (news.mediaType === "video" || news.mediaType === "photo") && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={news.thumbnail}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                      {news.mediaType === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/90 flex items-center justify-center">
                            <Play className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Interactive Engagement Bar */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleLike(news.id, e)}
                      className={cn(
                        "gap-1.5 hover:bg-accent",
                        likedNews.has(news.id) && "text-red-500"
                      )}
                    >
                      <Heart className={cn("h-4 w-4", likedNews.has(news.id) && "fill-current")} />
                      <span>{(newsLikes[news.id] ?? news.likes).toLocaleString()}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-accent">
                      <MessageSquare className="h-4 w-4" />
                      <span>{news.comments.toLocaleString()}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleShare(news, e)}
                      className="gap-1.5 hover:bg-accent"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>{news.shares.toLocaleString()}</span>
                    </Button>
                    
                    <div className="ml-auto flex items-center gap-1.5 text-muted-foreground text-sm">
                      <Eye className="h-4 w-4" />
                      <span>{news.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Insert premium ad after every 4 news items */}
              {(index + 1) % 4 === 0 && 
               index < displayedNews.length - 1 && 
               premiumAdSlots.length > 0 && (
                <div className="my-6">
                  <PremiumAdRotation
                    slotId={`news-premium-${Math.floor((index + 1) / 4)}`}
                    ads={[premiumAdSlots[Math.floor((index + 1) / 4) % premiumAdSlots.length]]}
                    context="feed"
                  />
                </div>
              )}

              {/* Insert People You May Know after every 10 news items */}
              {showPeopleYouMayKnow &&
               (index + 1) % 10 === 0 &&
               index < displayedNews.length - 1 && (
                <div className="my-6">
                  <PeopleYouMayKnow />
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {(hasMoreNews || canCollapseNews) && (
        <div className="flex justify-center items-center gap-6 mt-8 mb-4">
          {hasMoreNews && (
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              className="text-3xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 px-8 py-6 rounded-xl transition-all active:scale-95"
            >
              ...more
            </Button>
          )}
          {canCollapseNews && (
            <Button
              onClick={handleShowLess}
              variant="outline"
              size="lg"
              className="text-3xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 px-8 py-6 rounded-xl transition-all active:scale-95"
            >
              Less...
            </Button>
          )}
        </div>
      )}

      {/* Results count */}
      {displayedNews.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Showing {displayedNews.length} of {filteredNews.length} news items
          {filteredNews.length < mockNewsData.length && 
            ` (filtered from ${mockNewsData.length} total)`
          }
        </div>
      )}

      {/* News Detail Dialog */}
      {selectedNews && (
        <NewsDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          news={selectedNews}
          onLike={handleLike}
          isLiked={likedNews.has(selectedNews.id)}
          likeCount={newsLikes[selectedNews.id] ?? selectedNews.likes}
        />
      )}
    </div>
  );
}
