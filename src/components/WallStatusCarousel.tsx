import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { WallStatusFilters } from "@/components/WallStatusFilters";
import { AdRotation } from "@/components/AdRotation";
import { PostOptionsMenu } from "@/components/PostOptionsMenu";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PremiumAdCardProps } from "@/components/PremiumAdCard";
import { PostDetailDialog } from "@/components/PostDetailDialog";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { Columns2, LayoutGrid } from "lucide-react";
import React, { useState } from "react";

interface Post {
  id?: string;
  title: string;
  imageUrl?: string;
  author: string;
  type: string;
  isOwner?: boolean;
}

interface AdSlot {
  slotId: string;
  ads: Array<{
    id: string;
    content: string;
    image: string;
    duration: number;
  }>;
}

interface PremiumAdSlot {
  slotId: string;
  ads: PremiumAdCardProps[];
}

interface WallStatusCarouselProps {
  items: Post[];
  adSlots?: AdSlot[];
  premiumAdSlots?: PremiumAdSlot[];
  view: "normal" | "large";
  onViewChange: (view: "normal" | "large") => void;
  filter: string;
  onFilterChange: (filter: string) => void;
  title?: string;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  onItemClick?: (post: Post) => void;
  showFriendsSuggestions?: boolean;
}

export const WallStatusCarousel = ({
  items,
  adSlots = [],
  premiumAdSlots = [],
  view,
  onViewChange,
  filter,
  onFilterChange,
  title = "Wall Status",
  onEdit,
  onDelete,
  onItemClick,
  showFriendsSuggestions = false
}: WallStatusCarouselProps) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(15);

  const filteredItems = filter === "all"
    ? items
    : items.filter(item => item.type.toLowerCase() === filter);

  const displayedItems = filteredItems.slice(0, visibleCount);
  const hasMoreItems = visibleCount < filteredItems.length;
  const canCollapse = visibleCount > 15;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 15, filteredItems.length));
  };

  const handleShowLess = () => {
    setVisibleCount(15);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDetails = (post: Post) => {
    if (onItemClick) {
      onItemClick(post);
    } else {
      setSelectedPost(post);
      setDetailOpen(true);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewChange(view === "normal" ? "large" : "normal")}
            className="gap-1"
          >
            {view === "normal" ? (
              <Columns2 className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Media Type Filters */}
      <div className="mb-4">
        <WallStatusFilters 
          activeFilter={filter} 
          onFilterChange={onFilterChange} 
        />
      </div>
      
      {/* Normal View - Horizontal Carousel */}
      {view === "normal" && (
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {displayedItems.map((item, index) => {
              const shouldShowAd = (index + 1) % 4 === 0 && index < displayedItems.length - 1;
              const adSlotIndex = Math.floor((index + 1) / 4) - 1;
              
              return (
                <React.Fragment key={`${item.title}-${index}`}>
                  <CarouselItem className="pl-2 md:pl-4 basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-[30%]">
                    <Card
                      className="h-[280px] sm:h-[320px] overflow-hidden relative group cursor-pointer"
                      onClick={() => openDetails(item)}
                    >
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                      <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10 text-xs sm:text-sm px-1.5 sm:px-2.5 py-0 sm:py-0.5" variant="destructive">
                        {item.type}
                      </Badge>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2 sm:p-3">
                        <p className="text-white text-sm sm:text-base font-medium truncate">{item.author}</p>
                        <p className="text-white/90 text-xs sm:text-sm truncate">{item.title}</p>
                      </div>
                      {onEdit && onDelete && (
                        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10" onClick={(e) => e.stopPropagation()}>
                          <PostOptionsMenu 
                            onEdit={() => onEdit(item)}
                            onDelete={() => onDelete(item.id ?? String(index))}
                          />
                        </div>
                      )}
                    </Card>
                  </CarouselItem>
                  
                  {/* Insert premium ad after every 4 posts */}
                  {shouldShowAd && premiumAdSlots.length > 0 && (
                    <CarouselItem className="pl-2 md:pl-4 basis-[90%] sm:basis-[65%] md:basis-[50%] lg:basis-[35%]">
                      <PremiumAdRotation
                        key={`premium-ad-${adSlotIndex}`}
                        slotId={`wall-status-premium-${adSlotIndex}`}
                        ads={premiumAdSlots[adSlotIndex % premiumAdSlots.length]?.ads || []}
                        context="wall-status"
                      />
                    </CarouselItem>
                  )}
                </React.Fragment>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      )}
      
      {/* Large View - 3-Column Vertical Grid with Ads */}
      {view === "large" && (
        <div className="space-y-4">
          {/* Friends Suggestions after 6 posts */}
          {showFriendsSuggestions && displayedItems.length > 6 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {displayedItems.slice(0, 6).map((item, index) => (
                  <Card 
                    key={`${item.title}-${index}`}
                    className="overflow-hidden relative group cursor-pointer"
                    onClick={() => openDetails(item)}
                  >
                    <div className="aspect-[16/9] relative overflow-hidden">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                      <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10 text-xs sm:text-sm px-1.5 sm:px-2.5 py-0 sm:py-0.5" variant="destructive">
                        {item.type}
                      </Badge>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2 sm:p-3">
                        <p className="text-white text-sm sm:text-base font-medium truncate">{item.author}</p>
                        <p className="text-white/90 text-xs sm:text-sm truncate">{item.title}</p>
                      </div>
                      {onEdit && onDelete && (
                        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10" onClick={(e) => e.stopPropagation()}>
                          <PostOptionsMenu 
                            onEdit={() => onEdit(item)}
                            onDelete={() => onDelete(item.id ?? String(index))}
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Friends Suggestions Component */}
              <div className="w-full my-4">
                <PeopleYouMayKnow />
              </div>
              
              {/* Remaining posts */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {displayedItems.slice(6).map((item, index) => {
                  const actualIndex = index + 6;
                  const shouldShowAd = (actualIndex + 1) % 4 === 0 && actualIndex < displayedItems.length - 1;
                  const adSlotIndex = Math.floor((actualIndex + 1) / 4) - 1;
                  const isLastInRow = (actualIndex + 1) % 3 === 0;
                  
                  // Show Friends Suggestions again every 12 posts after the first one
                  const shouldShowFriendsSuggestions = showFriendsSuggestions && 
                    (actualIndex + 1) % 12 === 0 && 
                    actualIndex < displayedItems.length - 1;
                  
                  return (
                    <React.Fragment key={`${item.title}-${actualIndex}`}>
                      <Card 
                        className="overflow-hidden relative group cursor-pointer"
                        onClick={() => openDetails(item)}
                      >
                        <div className="aspect-[16/9] relative overflow-hidden">
                          {item.imageUrl && (
                            <img 
                              src={item.imageUrl} 
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          )}
                          <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10 text-xs sm:text-sm px-1.5 sm:px-2.5 py-0 sm:py-0.5" variant="destructive">
                            {item.type}
                          </Badge>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2 sm:p-3">
                            <p className="text-white text-sm sm:text-base font-medium truncate">{item.author}</p>
                            <p className="text-white/90 text-xs sm:text-sm truncate">{item.title}</p>
                          </div>
                          {onEdit && onDelete && (
                            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10" onClick={(e) => e.stopPropagation()}>
                              <PostOptionsMenu 
                                onEdit={() => onEdit(item)}
                                onDelete={() => onDelete(item.id ?? String(actualIndex))}
                              />
                            </div>
                          )}
                        </div>
                      </Card>
                      
                      {/* Close grid for ads and Friends Suggestions */}
                      {(shouldShowAd && isLastInRow && premiumAdSlots.length > 0) || shouldShowFriendsSuggestions ? (
                        <React.Fragment>
                          {/* These will be rendered as full-width breaks */}
                        </React.Fragment>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </div>
              
              {/* Premium ads and Friends Suggestions as full-width breaks */}
              {displayedItems.slice(6).map((_, index) => {
                const actualIndex = index + 6;
                const shouldShowAd = (actualIndex + 1) % 4 === 0 && actualIndex < displayedItems.length - 1;
                const adSlotIndex = Math.floor((actualIndex + 1) / 4) - 1;
                const isLastInRow = (actualIndex + 1) % 3 === 0;
                const shouldShowFriendsSuggestions = showFriendsSuggestions && 
                  (actualIndex + 1) % 12 === 0 && 
                  actualIndex < displayedItems.length - 1;
                
                return (
                  <React.Fragment key={`break-${actualIndex}`}>
                    {shouldShowAd && isLastInRow && premiumAdSlots.length > 0 && (
                      <div className="w-full my-4">
                        <PremiumAdRotation
                          slotId={`wall-status-grid-premium-${adSlotIndex}`}
                          ads={premiumAdSlots[adSlotIndex % premiumAdSlots.length]?.ads || []}
                          context="wall-status"
                        />
                      </div>
                    )}
                    {shouldShowFriendsSuggestions && (
                      <div className="w-full my-4">
                        <PeopleYouMayKnow />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </>
          )}
          
          {/* Render without Friends Suggestions if not enabled or not enough posts */}
          {(!showFriendsSuggestions || displayedItems.length <= 6) && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {displayedItems.map((item, index) => {
            const shouldShowAd = (index + 1) % 4 === 0 && index < displayedItems.length - 1;
            const adSlotIndex = Math.floor((index + 1) / 4) - 1;
            const isLastInRow = (index + 1) % 3 === 0;
            
            return (
              <React.Fragment key={`${item.title}-${index}`}>
                <Card 
                  className="overflow-hidden relative group cursor-pointer"
                  onClick={() => openDetails(item)}
                >
                  <div className="aspect-[16/9] relative overflow-hidden">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                    <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10 text-xs sm:text-sm px-1.5 sm:px-2.5 py-0 sm:py-0.5" variant="destructive">
                      {item.type}
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2 sm:p-3">
                      <p className="text-white text-sm sm:text-base font-medium truncate">{item.author}</p>
                      <p className="text-white/90 text-xs sm:text-sm truncate">{item.title}</p>
                    </div>
{onEdit && onDelete && (
                     <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10" onClick={(e) => e.stopPropagation()}>
                       <PostOptionsMenu 
                         onEdit={() => onEdit(item)}
                         onDelete={() => onDelete(item.id ?? String(index))}
                       />
                     </div>
                   )}
                  </div>
                </Card>
                
                {/* Close grid before premium ad, then reopen */}
                {shouldShowAd && isLastInRow && premiumAdSlots.length > 0 && (
                  <React.Fragment>
                    {/* This will be rendered after the current grid row closes */}
                  </React.Fragment>
                )}
              </React.Fragment>
            );
          })}
          </div>
          
          {/* Premium ads as full-width breaks between grid sections */}
          {displayedItems
            .map((_, index) => {
              const shouldShowAd = (index + 1) % 4 === 0 && index < displayedItems.length - 1;
              const adSlotIndex = Math.floor((index + 1) / 4) - 1;
              const isLastInRow = (index + 1) % 3 === 0;
              
              if (shouldShowAd && isLastInRow && premiumAdSlots.length > 0) {
                return (
                  <div key={`premium-ad-break-${index}`} className="w-full my-4">
                    <PremiumAdRotation
                      slotId={`wall-status-grid-premium-${adSlotIndex}`}
                      ads={premiumAdSlots[adSlotIndex % premiumAdSlots.length]?.ads || []}
                      context="wall-status"
                    />
                  </div>
                );
              }
              return null;
            })
            .filter(Boolean)}
            </>
          )}
        </div>
      )}

      {/* Pagination Controls - Only in Large View */}
      {view === "large" && (hasMoreItems || canCollapse) && (
        <div className="flex justify-center items-center gap-6 mt-8 mb-4">
          {hasMoreItems && (
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              className="text-3xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 px-8 py-6 rounded-xl"
            >
              ...more
            </Button>
          )}
          {canCollapse && (
            <Button
              onClick={handleShowLess}
              variant="outline"
              size="lg"
              className="text-3xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 px-8 py-6 rounded-xl"
            >
              Less...
            </Button>
          )}
        </div>
      )}

      {/* Post Detail Dialog */}
      {selectedPost && (
        <PostDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          post={{
            id: selectedPost.id,
            title: selectedPost.title,
            subtitle: selectedPost.author,
            description: selectedPost.title,
            imageUrl: selectedPost.imageUrl,
            views: "0",
            comments: "0",
            likes: "0",
            author: selectedPost.author,
            authorProfileImage: "/placeholder.svg",
            userId: "1",
            status: "Offline",
            type: selectedPost.type as "Video" | "Article" | "Photo" | "Audio" | "PDF" | "URL",
            fee: "0"
          }}
        />
      )}
    </div>
  );
};
