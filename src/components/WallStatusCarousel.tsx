import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { WallStatusFilters } from "@/components/WallStatusFilters";
import { AdRotation } from "@/components/AdRotation";
import { PostOptionsMenu } from "@/components/PostOptionsMenu";
import { PostDetailDialog } from "@/components/PostDetailDialog";
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

interface WallStatusCarouselProps {
  items: Post[];
  adSlots?: AdSlot[];
  view: "normal" | "large";
  onViewChange: (view: "normal" | "large") => void;
  filter: string;
  onFilterChange: (filter: string) => void;
  title?: string;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
}

export const WallStatusCarousel = ({
  items,
  adSlots = [],
  view,
  onViewChange,
  filter,
  onFilterChange,
  title = "Wall Status",
  onEdit,
  onDelete
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
    setSelectedPost(post);
    setDetailOpen(true);
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
        <div className="relative -mx-4 px-4">
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-2">
              {displayedItems.map((item, index) => {
                const shouldShowAd = (index + 1) % 15 === 0 && index < displayedItems.length - 1;
                const adSlotIndex = Math.floor((index + 1) / 15) - 1;
                
                return (
                  <React.Fragment key={`${item.title}-${index}`}>
                    <Card 
                      className="flex-shrink-0 w-[70vw] max-w-[280px] aspect-[3/4] overflow-hidden relative group cursor-pointer"
                      onClick={() => openDetails(item)}
                    >
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                      <Badge className="absolute top-2 left-2 z-10" variant="destructive">
                        {item.type}
                      </Badge>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                        <p className="text-white text-sm font-medium truncate">{item.author}</p>
                        <p className="text-white/90 text-xs truncate">{item.title}</p>
                      </div>
{onEdit && onDelete && (
                          <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
                            <PostOptionsMenu 
                              onEdit={() => onEdit(item)}
                              onDelete={() => onDelete(item.id ?? String(index))}
                            />
                          </div>
                        )}
                    </Card>
                    
                    {/* Insert ad after every 15 posts */}
                    {shouldShowAd && adSlotIndex >= 0 && adSlotIndex < adSlots.length && (
                      <div className="flex-shrink-0 w-[70vw] max-w-[280px] aspect-[3/4]">
                        <AdRotation 
                          key={`ad-${adSlots[adSlotIndex].slotId}`}
                          slotId={adSlots[adSlotIndex].slotId}
                          ads={adSlots[adSlotIndex].ads}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
      
      {/* Large View - 3-Column Vertical Grid with Ads */}
      {view === "large" && (
        <div className="grid grid-cols-3 gap-3">
          {displayedItems.map((item, index) => {
            const shouldShowAd = (index + 1) % 15 === 0 && index < displayedItems.length - 1;
            const adSlotIndex = Math.floor((index + 1) / 15) - 1;
            
            return (
              <React.Fragment key={`${item.title}-${index}`}>
                <Card 
                  className="overflow-hidden relative group cursor-pointer"
                  onClick={() => openDetails(item)}
                >
                  <div className="aspect-[3/4]">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                    <Badge className="absolute top-2 left-2 z-10" variant="destructive">
                      {item.type}
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                      <p className="text-white text-sm font-medium truncate">{item.author}</p>
                      <p className="text-white/90 text-xs truncate">{item.title}</p>
                    </div>
{onEdit && onDelete && (
                     <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
                       <PostOptionsMenu 
                         onEdit={() => onEdit(item)}
                         onDelete={() => onDelete(item.id ?? String(index))}
                       />
                     </div>
                   )}
                  </div>
                </Card>
                
                {/* Insert ad after every 15 images (5 rows of 3) */}
                {shouldShowAd && adSlotIndex >= 0 && adSlotIndex < adSlots.length && (
                  <AdRotation 
                    key={`ad-${adSlots[adSlotIndex].slotId}`}
                    slotId={adSlots[adSlotIndex].slotId}
                    ads={adSlots[adSlotIndex].ads}
                  />
                )}
              </React.Fragment>
            );
          })}
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
