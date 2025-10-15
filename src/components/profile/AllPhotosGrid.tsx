import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageIcon } from "lucide-react";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { albumPhotosAdSlots } from "@/data/profileAds";
import { getRandomAdSlot } from "@/lib/adUtils";

interface Photo {
  id: string;
  url: string;
  type: "profile-picture" | "banner" | "post";
  date: string;
  title?: string;
  author?: string;
}

interface AllPhotosGridProps {
  photos: Photo[];
}

export const AllPhotosGrid = ({ photos }: AllPhotosGridProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // Responsive items per load: 10 rows based on grid columns
  // Mobile (2 cols): 20 items, Tablet (3 cols): 30 items, Desktop (4 cols): 40 items
  const [itemsPerLoad, setItemsPerLoad] = useState(() => {
    if (typeof window === 'undefined') return 40;
    const width = window.innerWidth;
    if (width < 640) return 20;
    if (width < 1024) return 30;
    return 40;
  });
  
  const [visibleCount, setVisibleCount] = useState(itemsPerLoad);

  useEffect(() => {
    const updateItemsPerLoad = () => {
      const width = window.innerWidth;
      let newItemsPerLoad = 40; // Desktop default
      
      if (width < 640) {
        newItemsPerLoad = 20; // Mobile: 2 cols × 10 rows
      } else if (width < 1024) {
        newItemsPerLoad = 30; // Tablet: 3 cols × 10 rows
      }
      
      setItemsPerLoad(newItemsPerLoad);
      setVisibleCount(newItemsPerLoad);
    };
    
    window.addEventListener('resize', updateItemsPerLoad);
    return () => window.removeEventListener('resize', updateItemsPerLoad);
  }, []);

  const displayedPhotos = photos.slice(0, visibleCount);
  const hasMorePhotos = visibleCount < photos.length;
  const canShowLess = visibleCount > itemsPerLoad;

  // Calculate ad break intervals based on grid columns
  const adBreakInterval = useMemo(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    if (width < 640) return 8; // Mobile: 2 cols × 4 rows
    if (width < 1024) return 12; // Tablet: 3 cols × 4 rows
    return 16; // Desktop: 4 cols × 4 rows
  }, [itemsPerLoad]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + itemsPerLoad, photos.length));
  };

  const handleShowLess = () => {
    setVisibleCount(itemsPerLoad);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePhotoClick = (photoIndex: number) => {
    // Calculate actual photo index excluding ads
    setSelectedIndex(photoIndex);
  };

  // Convert photos to MediaItems for the gallery viewer
  const mediaItems: MediaItem[] = photos.map((photo) => ({
    id: photo.id,
    type: "photo" as const,
    url: photo.url,
    title: photo.title || "Photo",
    author: photo.author || "You",
    authorImage: "/placeholder.svg",
    likes: 0,
    comments: 0,
  }));

  if (photos.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/30 rounded-lg">
        <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-lg text-muted-foreground">No photos to display yet.</p>
        <p className="text-base text-muted-foreground/70 mt-2">Upload some photos to see them here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayedPhotos.map((photo, index) => {
        const shouldShowAd = (index + 1) % adBreakInterval === 0 && index < displayedPhotos.length - 1;
        
        return (
          <div key={`photo-section-${index}`}>
            {/* Start or continue grid */}
            {index % adBreakInterval === 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-6">
                {displayedPhotos.slice(
                  index,
                  Math.min(index + adBreakInterval, displayedPhotos.length)
                ).map((photo, subIndex) => {
                  const photoIndex = index + subIndex;
                  return (
                    <div
                      key={photo.id}
                      className="aspect-square overflow-hidden rounded-lg cursor-pointer group relative"
                      onClick={() => handlePhotoClick(photoIndex)}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title || "Photo"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      
                      {/* Type badge */}
                      {photo.type !== "post" && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white">
                            {photo.type === "profile-picture" ? "Profile" : "Banner"}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Insert Ad after complete rows */}
            {shouldShowAd && (
              <div className="w-full mb-6">
                <PremiumAdRotation
                  slotId={`album-photos-premium-${Math.floor((index + 1) / adBreakInterval)}`}
                  ads={getRandomAdSlot(albumPhotosAdSlots)}
                  context="feed"
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Pagination Controls */}
      {(hasMorePhotos || canShowLess) && (
        <div className="flex justify-center items-center gap-6 mt-8">
          {hasMorePhotos && (
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              className="text-2xl font-bold text-primary hover:text-primary hover:bg-primary/10 border-2 border-primary/20 px-8 py-6 rounded-xl"
            >
              ...more
            </Button>
          )}
          {canShowLess && (
            <Button
              onClick={handleShowLess}
              variant="outline"
              size="lg"
              className="text-2xl font-bold text-primary hover:text-primary hover:bg-primary/10 border-2 border-primary/20 px-8 py-6 rounded-xl"
            >
              Less...
            </Button>
          )}
        </div>
      )}

      {/* Media Gallery Viewer */}
      {selectedIndex !== null && (
        <MediaGalleryViewer
          open={true}
          onOpenChange={(open) => !open && setSelectedIndex(null)}
          items={mediaItems}
          initialIndex={selectedIndex}
          showActions={true}
          galleryType="post"
        />
      )}
    </div>
  );
};
