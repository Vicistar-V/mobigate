import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Heart, MessageCircle, Video, FileText, Image, Music, Link, ChevronDown, ChevronUp, FileIcon, MoreHorizontal, UserPlus } from "lucide-react";
import { getPostsByUserId, Post } from "@/data/posts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { contentsAdSlots } from "@/data/profileAds";

interface ProfileContentsTabProps {
  userName: string;
  userId: string;
}

// Helper function to get icon based on content type
const getContentTypeIcon = (type: string) => {
  switch(type) {
    case "Video":
      return <Video className="h-8 w-8 text-muted-foreground" />;
    case "Article":
      return <FileText className="h-8 w-8 text-muted-foreground" />;
    case "Photo":
      return <Image className="h-8 w-8 text-muted-foreground" />;
    case "Audio":
      return <Music className="h-8 w-8 text-muted-foreground" />;
    case "PDF":
      return <FileText className="h-8 w-8 text-muted-foreground" />;
    case "URL":
      return <Link className="h-8 w-8 text-muted-foreground" />;
    default:
      return <FileText className="h-8 w-8 text-muted-foreground" />;
  }
};

// Helper function to get badge color classes based on content type
const getContentTypeBadgeClass = (type: string) => {
  const variants: Record<string, string> = {
    "Video": "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    "Article": "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    "Photo": "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
    "Audio": "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
    "PDF": "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
    "URL": "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
  };
  return variants[type] || "bg-muted text-muted-foreground border-border";
};

// Helper function to sort content
const sortContent = (posts: Post[], sortBy: string) => {
  switch(sortBy) {
    case "recent":
      return [...posts].reverse(); // Newest first
    case "popular":
      return [...posts].sort((a, b) => {
        const likesA = parseInt(a.likes.replace(/[^0-9]/g, '')) || 0;
        const likesB = parseInt(b.likes.replace(/[^0-9]/g, '')) || 0;
        return likesB - likesA;
      });
    case "oldest":
      return posts; // Original order (oldest first)
    default:
      return posts;
  }
};

export const ProfileContentsTab = ({ userName, userId }: ProfileContentsTabProps) => {
  const [sortBy, setSortBy] = useState<string>("recent");
  const [visibleCount, setVisibleCount] = useState<number>(15);
  const [contentFilter, setContentFilter] = useState<string>("all");
  const [followingAuthors, setFollowingAuthors] = useState<Set<string>>(new Set());

  const handleFollowAuthor = (authorUserId: string) => {
    setFollowingAuthors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(authorUserId)) {
        newSet.delete(authorUserId);
      } else {
        newSet.add(authorUserId);
      }
      return newSet;
    });
  };

  const formatFollowerCount = (count: string | undefined): string => {
    if (!count) return "0";
    return count;
  };

  // Filter options configuration
  const primaryFilters = [
    { value: "all", label: "All", icon: null },
    { value: "Video", label: "Videos", icon: Video },
    { value: "Photo", label: "Photos", icon: Image },
    { value: "Article", label: "Articles", icon: FileText },
  ];

  const moreFilters = [
    { value: "Audio", label: "Audio", icon: Music },
    { value: "PDF", label: "PDF", icon: FileIcon },
    { value: "URL", label: "URL Links", icon: Link },
  ];

  // Fetch user's posts
  const userPosts = useMemo(() => getPostsByUserId(userId), [userId]);
  
  // Prepare premium ad slots for rotation
  const premiumAdSlots = contentsAdSlots.map((ads, index) => ({
    slotId: `contents-premium-${index}`,
    ads: ads,
  }));
  
  // Calculate content counts
  const contentCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: userPosts.length,
      Video: 0,
      Photo: 0,
      Article: 0,
      Audio: 0,
      PDF: 0,
      URL: 0,
    };
    
    userPosts.forEach(post => {
      counts[post.type] = (counts[post.type] || 0) + 1;
    });
    
    return counts;
  }, [userPosts]);

  // Filter content by type
  const filterContent = (posts: Post[], filterType: string) => {
    if (filterType === "all") return posts;
    return posts.filter(post => post.type === filterType);
  };

  // Apply filtering first, then sorting
  const filteredPosts = useMemo(() => filterContent(userPosts, contentFilter), [userPosts, contentFilter]);
  const sortedPosts = useMemo(() => sortContent(filteredPosts, sortBy), [filteredPosts, sortBy]);
  
  // Get visible posts based on pagination
  const visiblePosts = sortedPosts.slice(0, visibleCount);
  
  const hasMore = visibleCount < sortedPosts.length;
  const canShowLess = visibleCount > 15;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 15, sortedPosts.length));
  };

  const handleShowLess = () => {
    setVisibleCount(15);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Empty state
  if (userPosts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-semibold mb-2">No Content Posted Yet</h3>
        <p className="text-sm text-muted-foreground">
          {userName} hasn't posted any content yet. Check back later!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-lg font-semibold">
            All Contents <span className="text-muted-foreground">({sortedPosts.length})</span>
          </h2>
          
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Type Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary Filters */}
          {primaryFilters.map((filter) => {
            const isActive = contentFilter === filter.value;
            const Icon = filter.icon;
            const count = contentCounts[filter.value] || 0;
            
            return (
              <Button
                key={filter.value}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setContentFilter(filter.value)}
                className="gap-1.5"
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{filter.label}</span>
                <span className={isActive ? "opacity-90" : "text-muted-foreground"}>
                  ({count})
                </span>
              </Button>
            );
          })}

          {/* More Filters Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <MoreHorizontal className="h-4 w-4" />
                <span>More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {moreFilters.map((filter) => {
                const isActive = contentFilter === filter.value;
                const Icon = filter.icon;
                const count = contentCounts[filter.value] || 0;
                
                return (
                  <DropdownMenuItem
                    key={filter.value}
                    onClick={() => setContentFilter(filter.value)}
                    className={isActive ? "bg-accent" : ""}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span>{filter.label}</span>
                    <span className="ml-auto text-muted-foreground text-sm">
                      ({count})
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content List with Ads and People Suggestions */}
      <div className="space-y-3">
        {visiblePosts.map((post, index) => {
          // Calculate if we should show People You May Know (every 12 posts)
          const shouldShowPeopleSuggestions = (index + 1) % 12 === 0 && index < visiblePosts.length - 1;
          
          // Calculate if we should show an ad after this post (every 6 posts, but NOT when people suggestions show)
          const shouldShowAd = (index + 1) % 6 === 0 && !shouldShowPeopleSuggestions && index < visiblePosts.length - 1 && premiumAdSlots.length > 0;
          const adSlotIndex = Math.floor((index + 1) / 6) - 1;
          
          return (
            <React.Fragment key={post.id}>
              {/* Content Card */}
              <Card 
                className="flex gap-4 p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/50"
              >
                {/* Left: Thumbnail or Icon */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  {post.imageUrl ? (
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getContentTypeIcon(post.type)
                  )}
                </div>

                {/* Right: Content Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Title & Badge Row */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={`flex-shrink-0 text-sm ${getContentTypeBadgeClass(post.type)}`}
                    >
                      {post.type}
                    </Badge>
                  </div>

                  {/* Description (2-3 lines max) */}
                  {post.subtitle && (
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {post.subtitle}
                    </p>
                  )}

                  {/* Metadata Row */}
                  <div className="flex items-center gap-3 sm:gap-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span className="font-medium">{post.views}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span className="font-medium">{post.likes}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span className="font-medium">{post.comments}</span>
                    </span>
                    {post.followers && !post.isOwner && (
                      <Button
                        variant={followingAuthors.has(post.userId) ? "secondary" : "default"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowAuthor(post.userId);
                        }}
                        className="gap-1 h-6 px-2 text-sm ml-auto"
                        aria-label={followingAuthors.has(post.userId) ? "Unfollow" : "Follow"}
                      >
                        <UserPlus className="h-3 w-3" />
                        <span className="hidden sm:inline">{followingAuthors.has(post.userId) ? "Following" : "Follow"}</span>
                        <span className="opacity-80">({formatFollowerCount(post.followers)})</span>
                      </Button>
                    )}
                    {post.fee && (
                      <span className={`font-semibold text-emerald-600 dark:text-emerald-400 ${post.followers && !post.isOwner ? '' : 'ml-auto'}`}>
                        {post.fee}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
              
              {/* Premium Ad after every 6 posts */}
              {shouldShowAd && (
                <div className="w-full my-4">
                  <PremiumAdRotation
                    slotId={premiumAdSlots[adSlotIndex % premiumAdSlots.length]?.slotId}
                    ads={premiumAdSlots[adSlotIndex % premiumAdSlots.length]?.ads || []}
                    context="profile"
                  />
                </div>
              )}
              
              {/* People You May Know after every 12 posts */}
              {shouldShowPeopleSuggestions && (
                <div className="w-full my-4">
                  <PeopleYouMayKnow />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Pagination Buttons */}
      {(hasMore || canShowLess) && (
        <div className="flex gap-3 justify-center pt-4">
          {hasMore && (
            <Button 
              onClick={handleLoadMore}
              variant="outline"
              className="min-w-[140px]"
            >
              Load More
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          )}
          {canShowLess && (
            <Button 
              onClick={handleShowLess}
              variant="ghost"
              className="min-w-[140px]"
            >
              Show Less
              <ChevronUp className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
