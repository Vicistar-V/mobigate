import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { ChevronDown, Eye, MessageSquare, Share2, Video, Image as ImageIcon, FileText, TrendingUp } from "lucide-react";
import { mockNewsData, NewsItem } from "@/data/newsData";
import { formatDistanceToNow } from "date-fns";

const categoryFilters = [
  { value: "all", label: "All Categories" },
  { value: "announcements", label: "Announcements" },
  { value: "events", label: "Events" },
  { value: "updates", label: "Updates" },
  { value: "general", label: "General News" },
  { value: "affairs", label: "Community Affairs" },
];

const dateTimeMediaFilters = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "video", label: "Videos Only" },
  { value: "photo", label: "Photos Only" },
  { value: "article", label: "Articles Only" },
];

const trendingFilters = [
  { value: "all", label: "All" },
  { value: "trending", label: "Trending Now" },
  { value: "viewed", label: "Most Viewed" },
  { value: "commented", label: "Most Commented" },
  { value: "shared", label: "Most Shared" },
  { value: "latest", label: "Latest" },
];

interface CommunityNewsSectionProps {
  className?: string;
}

export function CommunityNewsSection({ className }: CommunityNewsSectionProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateTimeMediaFilter, setDateTimeMediaFilter] = useState("all");
  const [trendingFilter, setTrendingFilter] = useState("all");

  // Filter and sort news items
  const filteredNews = useMemo(() => {
    let filtered = [...mockNewsData];

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Date/Time/Media filter
    if (dateTimeMediaFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        
        switch (dateTimeMediaFilter) {
          case "today":
            return itemDate >= today;
          case "week":
            return itemDate >= weekAgo;
          case "month":
            return itemDate >= monthAgo;
          case "year":
            return itemDate >= yearAgo;
          case "video":
            return item.mediaType === "video";
          case "photo":
            return item.mediaType === "photo";
          case "article":
            return item.mediaType === "article";
          default:
            return true;
        }
      });
    }

    // Trending filter
    if (trendingFilter !== "all") {
      switch (trendingFilter) {
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
  }, [categoryFilter, dateTimeMediaFilter, trendingFilter]);

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

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">News Info</h2>
      </div>

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
            <DropdownMenuContent align="start" className="w-56">
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

          {/* Date/Time/Media Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span className="text-sm">
                  {dateTimeMediaFilters.find((f) => f.value === dateTimeMediaFilter)?.label || "Time/Media"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {dateTimeMediaFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setDateTimeMediaFilter(filter.value)}
                  className={dateTimeMediaFilter === filter.value ? "bg-accent" : ""}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Trending Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span className="text-sm">
                  {trendingFilters.find((f) => f.value === trendingFilter)?.label || "Sort"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {trendingFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setTrendingFilter(filter.value)}
                  className={trendingFilter === filter.value ? "bg-accent" : ""}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active Filters Display */}
        {(categoryFilter !== "all" || dateTimeMediaFilter !== "all" || trendingFilter !== "all") && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {categoryFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {categoryFilters.find((f) => f.value === categoryFilter)?.label}
              </Badge>
            )}
            {dateTimeMediaFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {dateTimeMediaFilters.find((f) => f.value === dateTimeMediaFilter)?.label}
              </Badge>
            )}
            {trendingFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {trendingFilters.find((f) => f.value === trendingFilter)?.label}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategoryFilter("all");
                setDateTimeMediaFilter("all");
                setTrendingFilter("all");
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
        {filteredNews.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No news items match your filters.</p>
          </Card>
        ) : (
          filteredNews.map((news) => (
            <Card key={news.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
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
                  <p className="text-sm text-muted-foreground leading-relaxed">
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
                          <Video className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span>{news.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    <span>{news.comments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Share2 className="h-4 w-4" />
                    <span>{news.shares.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Results count */}
      {filteredNews.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Showing {filteredNews.length} of {mockNewsData.length} news items
        </div>
      )}
    </div>
  );
}
