import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Newspaper } from "lucide-react";
import { NewsCard } from "./NewsCard";
import { communityNewsData, NewsItem } from "@/data/newsData";
import { useToast } from "@/hooks/use-toast";

interface NewsFilters {
  category: string;
  dateTimeMedia: string;
  trending: string;
}

interface CommunityNewsSectionProps {
  activeFilters: NewsFilters;
  onFilterChange: (filters: NewsFilters) => void;
  title?: string;
}

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

export function CommunityNewsSection({
  activeFilters,
  onFilterChange,
  title = "News Info",
}: CommunityNewsSectionProps) {
  const { toast } = useToast();

  const handleFilterChange = (filterType: keyof NewsFilters, value: string) => {
    onFilterChange({
      ...activeFilters,
      [filterType]: value,
    });
  };

  // Filter news based on active filters
  const filteredNews = communityNewsData.filter((news) => {
    // Category filter
    if (activeFilters.category !== "all" && news.category !== activeFilters.category) {
      return false;
    }

    // Date/Time/Media filter
    if (activeFilters.dateTimeMedia !== "all") {
      const filter = activeFilters.dateTimeMedia;
      const now = new Date();
      const newsDate = new Date(news.date);

      if (filter === "today") {
        const isToday = newsDate.toDateString() === now.toDateString();
        if (!isToday) return false;
      } else if (filter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (newsDate < weekAgo) return false;
      } else if (filter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (newsDate < monthAgo) return false;
      } else if (filter === "year") {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        if (newsDate < yearAgo) return false;
      } else if (["video", "photo", "article"].includes(filter)) {
        if (news.mediaType !== filter) return false;
      }
    }

    return true;
  });

  // Sort news based on trending filter
  const sortedNews = [...filteredNews].sort((a, b) => {
    switch (activeFilters.trending) {
      case "viewed":
        return b.views - a.views;
      case "commented":
        return b.comments - a.comments;
      case "shared":
        return b.shares - a.shares;
      case "latest":
        return b.date.getTime() - a.date.getTime();
      case "trending":
        // Simple trending algorithm: combine views, comments, and shares
        const trendingScoreA = a.views * 0.5 + a.comments * 2 + a.shares * 3;
        const trendingScoreB = b.views * 0.5 + b.comments * 2 + b.shares * 3;
        return trendingScoreB - trendingScoreA;
      default:
        return b.date.getTime() - a.date.getTime(); // Default to latest
    }
  });

  const handleNewsClick = (news: NewsItem) => {
    toast({
      title: news.title,
      description: "News details coming soon!",
    });
  };

  const getCategoryLabel = () => {
    return categoryFilters.find(f => f.value === activeFilters.category)?.label || "All Categories";
  };

  const getDateTimeMediaLabel = () => {
    return dateTimeMediaFilters.find(f => f.value === activeFilters.dateTimeMedia)?.label || "All Time";
  };

  const getTrendingLabel = () => {
    return trendingFilters.find(f => f.value === activeFilters.trending)?.label || "All";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filter Tabs - Horizontal Scroll on Mobile */}
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-shrink-0 h-9"
                >
                  <span className="font-medium text-xs sm:text-sm">
                    {getCategoryLabel()}
                  </span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                  {activeFilters.category !== "all" && (
                    <Badge variant="secondary" className="ml-2 px-1 py-0 h-4 text-xs">
                      1
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {categoryFilters.map((filter) => (
                  <DropdownMenuItem
                    key={filter.value}
                    onClick={() => handleFilterChange("category", filter.value)}
                    className={activeFilters.category === filter.value ? "bg-accent" : ""}
                  >
                    {filter.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date/Time/Media Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-shrink-0 h-9"
                >
                  <span className="font-medium text-xs sm:text-sm">
                    {getDateTimeMediaLabel()}
                  </span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                  {activeFilters.dateTimeMedia !== "all" && (
                    <Badge variant="secondary" className="ml-2 px-1 py-0 h-4 text-xs">
                      1
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {dateTimeMediaFilters.map((filter) => (
                  <DropdownMenuItem
                    key={filter.value}
                    onClick={() => handleFilterChange("dateTimeMedia", filter.value)}
                    className={activeFilters.dateTimeMedia === filter.value ? "bg-accent" : ""}
                  >
                    {filter.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Trending Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-shrink-0 h-9"
                >
                  <span className="font-medium text-xs sm:text-sm">
                    {getTrendingLabel()}
                  </span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                  {activeFilters.trending !== "all" && (
                    <Badge variant="secondary" className="ml-2 px-1 py-0 h-4 text-xs">
                      1
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {trendingFilters.map((filter) => (
                  <DropdownMenuItem
                    key={filter.value}
                    onClick={() => handleFilterChange("trending", filter.value)}
                    className={activeFilters.trending === filter.value ? "bg-accent" : ""}
                  >
                    {filter.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* News Grid */}
        {sortedNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedNews.map((news) => (
              <NewsCard 
                key={news.id} 
                news={news} 
                onClick={() => handleNewsClick(news)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No news found matching your filters</p>
            <Button
              variant="link"
              onClick={() => onFilterChange({ category: "all", dateTimeMedia: "all", trending: "all" })}
              className="mt-2"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
