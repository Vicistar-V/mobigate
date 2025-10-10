import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";

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
  const [visibleCount, setVisibleCount] = useState(24);

  const displayedPhotos = photos.slice(0, visibleCount);
  const hasMorePhotos = visibleCount < photos.length;
  const canShowLess = visibleCount > 24;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 24, photos.length));
  };

  const handleShowLess = () => {
    setVisibleCount(24);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePhotoClick = (index: number) => {
    setSelectedIndex(index);
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
      <div className="text-center py-12">
        <p className="text-muted-foreground">No photos to display yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        {displayedPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className="aspect-square overflow-hidden rounded-lg cursor-pointer group relative"
            onClick={() => handlePhotoClick(index)}
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
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white">
                  {photo.type === "profile-picture" ? "Profile" : "Banner"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

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
