import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { WallStatusFilters } from "@/components/WallStatusFilters";
import { AdRotation } from "@/components/AdRotation";
import { PostOptionsMenu } from "@/components/PostOptionsMenu";
import { Columns2, LayoutGrid } from "lucide-react";
import React from "react";

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
  const filteredItems = filter === "all"
    ? items
    : items.filter(item => item.type.toLowerCase() === filter);

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
              {filteredItems.map((item, index) => {
                const shouldShowAd = (index + 1) % 15 === 0 && index < filteredItems.length - 1;
                const adSlotIndex = Math.floor((index + 1) / 15) - 1;
                
                return (
                  <React.Fragment key={`${item.title}-${index}`}>
                    <Card 
                      className="flex-shrink-0 w-[70vw] max-w-[280px] aspect-[3/4] overflow-hidden relative group cursor-pointer"
                    >
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                        <p className="text-white text-sm font-medium truncate">{item.author}</p>
                        <p className="text-white/90 text-xs truncate">{item.title}</p>
                      </div>
{onEdit && onDelete && (
                          <div className="absolute top-2 right-2 z-10">
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
          {filteredItems.slice(0, 45).map((item, index) => {
            const shouldShowAd = (index + 1) % 15 === 0 && index < 44;
            const adSlotIndex = Math.floor((index + 1) / 15) - 1;
            
            return (
              <React.Fragment key={`${item.title}-${index}`}>
                <Card 
                  className="overflow-hidden relative group cursor-pointer"
                >
                  <div className="aspect-[3/4]">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                      <p className="text-white text-sm font-medium truncate">{item.author}</p>
                      <p className="text-white/90 text-xs truncate">{item.title}</p>
                    </div>
{onEdit && onDelete && (
                     <div className="absolute top-2 right-2 z-10">
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
    </div>
  );
};
