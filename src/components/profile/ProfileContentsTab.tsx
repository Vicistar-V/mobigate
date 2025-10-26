import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Heart, MessageCircle, Video, FileText, Image, Music, Link, ChevronDown, ChevronUp, FileIcon, MoreHorizontal, UserPlus, Share2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import { CommentDialog } from "@/components/CommentDialog";
import { ShareDialog } from "@/components/ShareDialog";
import { generateShareUrl } from "@/lib/shareUtils";

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
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  
  // Media Gallery states
  const [mediaGalleryOpen, setMediaGalleryOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  
  // Comment Dialog states
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPostForComment, setSelectedPostForComment] = useState<Post | null>(null);
  
  // Share Dialog states
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareTitle, setShareTitle] = useState("");
  const [shareDescription, setShareDescription] = useState("");

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

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast({
          title: "Removed like",
          description: "Post unliked successfully",
        });
      } else {
        newSet.add(postId);
        toast({
          title: "Liked!",
          description: "Post liked successfully",
        });
      }
      return newSet;
    });
  };

  const formatFollowerCount = (count: string | undefined): string => {
    if (!count) return "0";
    return count;
  };

  // Open media gallery when clicking on card or image
  const openMediaGallery = (post: Post, index: number) => {
    // Convert visible posts to MediaItem format
    const items: MediaItem[] = visiblePosts.map((p) => ({
      id: p.id,
      url: p.imageUrl || "",
      type: p.type.toLowerCase() === "video" ? "video" : p.type.toLowerCase() === "audio" ? "audio" : "photo",
      title: p.title,
      description: p.subtitle,
      author: p.author,
      authorImage: p.authorProfileImage,
      authorUserId: p.userId,
      likes: parseInt(p.likes.replace(/[^0-9]/g, '')) || 0,
      comments: parseInt(p.comments.replace(/[^0-9]/g, '')) || 0,
      followers: p.followers,
      isLiked: likedPosts.has(p.id),
      isOwner: p.isOwner,
    }));
    
    setGalleryItems(items);
    setGalleryInitialIndex(index);
    setMediaGalleryOpen(true);
  };

  // Open comment dialog when clicking comment count
  const openCommentDialog = (post: Post) => {
    setSelectedPostForComment(post);
    setCommentDialogOpen(true);
  };

  // Open share dialog
  const openShareDialog = (post: Post) => {
    setShareUrl(generateShareUrl('post', post.id));
    setShareTitle(post.title);
    setShareDescription(post.subtitle || "");
    setShareDialogOpen(true);
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
                className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/50"
                onClick={() => openMediaGallery(post, index)}
              >
                {/* Top: Full-Width Thumbnail or Icon */}
                <div className="w-full aspect-[4/3] sm:aspect-video bg-muted flex items-center justify-center">
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

                {/* Bottom: Content Info */}
                <div className="p-3 sm:p-4 space-y-2.5">
                  {/* Title */}
                  <h3 className="font-semibold text-base sm:text-lg line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  
                  {/* Badge directly under title */}
                  <Badge 
                    variant="secondary" 
                    className="text-xs font-medium w-fit"
                  >
                    {post.type}
                  </Badge>

                  {/* Description (2-3 lines max) */}
                  {post.subtitle && (
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.subtitle}
                    </p>
                  )}

                  {/* Metadata Row */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap pt-2">
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">{post.views}</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleLike(post.id, e)}
                      className={`flex items-center gap-1.5 h-auto p-1.5 hover:bg-accent transition-colors ${
                        likedPosts.has(post.id) ? 'text-red-500 hover:text-red-600' : ''
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      <span className="font-medium">{post.likes}</span>
                    </Button>
                    <button
                      className="flex items-center gap-1.5 hover:underline transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCommentDialog(post);
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-medium">{post.comments}</span>
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openShareDialog(post);
                      }}
                      className="flex items-center gap-1.5 h-auto p-1.5 hover:bg-accent transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    {post.followers && !post.isOwner && (
                      <Button
                        variant={followingAuthors.has(post.userId) ? "secondary" : "default"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowAuthor(post.userId);
                        }}
                        className="gap-1.5 h-7 px-3 text-xs ml-auto"
                        aria-label={followingAuthors.has(post.userId) ? "Unfollow" : "Follow"}
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>{followingAuthors.has(post.userId) ? "Following" : "Follow"}</span>
                        <span className="opacity-75">({formatFollowerCount(post.followers)})</span>
                      </Button>
                    )}
                    {post.fee && (
                      <span className={`font-semibold text-base text-emerald-600 dark:text-emerald-400 ${post.followers && !post.isOwner ? '' : 'ml-auto'}`}>
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

      {/* Media Gallery Viewer */}
      <MediaGalleryViewer
        open={mediaGalleryOpen}
        onOpenChange={setMediaGalleryOpen}
        items={galleryItems}
        initialIndex={galleryInitialIndex}
        showActions={true}
        galleryType="post"
      />

      {/* Comment Dialog */}
      {selectedPostForComment && (
        <CommentDialog
          open={commentDialogOpen}
          onOpenChange={setCommentDialogOpen}
          post={{
            id: selectedPostForComment.id,
            title: selectedPostForComment.title,
            subtitle: selectedPostForComment.subtitle,
            author: selectedPostForComment.author,
            authorProfileImage: selectedPostForComment.authorProfileImage,
            type: selectedPostForComment.type,
            imageUrl: selectedPostForComment.imageUrl,
            views: selectedPostForComment.views,
            likes: selectedPostForComment.likes,
          }}
        />
      )}

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        shareUrl={shareUrl}
        title={shareTitle}
        description={shareDescription}
      />
    </div>
  );
};
