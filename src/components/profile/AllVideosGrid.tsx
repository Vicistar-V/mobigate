import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import { Play, Video } from "lucide-react";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { albumVideosAdSlots } from "@/data/profileAds";
import { getRandomAdSlot } from "@/lib/adUtils";

interface VideoItem {
  id: string;
  url: string;
  type: "post";
  date: string;
  title?: string;
  author?: string;
}

interface AllVideosGridProps {
  videos: VideoItem[];
}

export const AllVideosGrid = ({ videos }: AllVideosGridProps) => {
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

  const displayedVideos = videos.slice(0, visibleCount);
  const hasMoreVideos = visibleCount < videos.length;
  const canShowLess = visibleCount > itemsPerLoad;

  // Calculate ad break intervals based on grid columns
  const adBreakInterval = useMemo(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    if (width < 640) return 8; // Mobile: 2 cols × 4 rows
    if (width < 1024) return 12; // Tablet: 3 cols × 4 rows
    return 16; // Desktop: 4 cols × 4 rows
  }, [itemsPerLoad]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + itemsPerLoad, videos.length));
  };

  const handleShowLess = () => {
    setVisibleCount(itemsPerLoad);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleVideoClick = (videoIndex: number) => {
    setSelectedIndex(videoIndex);
  };

  // Convert videos to MediaItems for the gallery viewer
  const mediaItems: MediaItem[] = videos.map((video) => ({
    id: video.id,
    type: "video" as const,
    url: video.url,
    title: video.title || "Video",
    author: video.author || "You",
    authorImage: "/placeholder.svg",
    likes: 0,
    comments: 0,
  }));

  if (videos.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/30 rounded-lg">
        <Video className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-lg text-muted-foreground">No videos to display yet.</p>
        <p className="text-base text-muted-foreground/70 mt-2">Upload some videos to see them here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayedVideos.map((video, index) => {
        const shouldShowAd = (index + 1) % adBreakInterval === 0 && index < displayedVideos.length - 1;
        
        return (
          <div key={`video-section-${index}`}>
            {/* Start or continue grid */}
            {index % adBreakInterval === 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-6">
                {displayedVideos.slice(
                  index,
                  Math.min(index + adBreakInterval, displayedVideos.length)
                ).map((video, subIndex) => {
                  const videoIndex = index + subIndex;
                  return (
                    <div
                      key={video.id}
                      className="aspect-square overflow-hidden rounded-lg cursor-pointer group relative"
                      onClick={() => handleVideoClick(videoIndex)}
                    >
                      <img
                        src={video.url}
                        alt={video.title || "Video"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                      
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Play className="h-6 w-6 sm:h-8 sm:w-8 text-black ml-1" fill="currentColor" />
                        </div>
                      </div>
                      
                      {/* Video badge */}
                      <div className="absolute top-2 left-2 z-10">
                        <span className="text-sm px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-white flex items-center gap-1">
                          <Video className="h-2.5 w-2.5" />
                          Video
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Insert Ad after complete rows */}
            {shouldShowAd && (
              <div className="w-full mb-6">
                <PremiumAdRotation
                  slotId={`album-videos-premium-${Math.floor((index + 1) / adBreakInterval)}`}
                  ads={getRandomAdSlot(albumVideosAdSlots)}
                  context="feed"
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Pagination Controls */}
      {(hasMoreVideos || canShowLess) && (
        <div className="flex justify-center items-center gap-4 sm:gap-6 mt-8">
          {hasMoreVideos && (
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              className="text-xl sm:text-2xl font-bold text-primary hover:text-primary hover:bg-primary/10 border-2 border-primary/20 px-6 py-5 sm:px-8 sm:py-6 rounded-xl"
            >
              ...more
            </Button>
          )}
          {canShowLess && (
            <Button
              onClick={handleShowLess}
              variant="outline"
              size="lg"
              className="text-xl sm:text-2xl font-bold text-primary hover:text-primary hover:bg-primary/10 border-2 border-primary/20 px-6 py-5 sm:px-8 sm:py-6 rounded-xl"
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
