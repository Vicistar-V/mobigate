import { useState } from "react";
import { Camera } from "lucide-react";
import type { GalleryPhoto } from "@/data/mobigateInteractiveQuizData";
import { MediaGalleryViewer, type MediaItem } from "@/components/MediaGalleryViewer";

interface WinnerGallerySectionProps {
  gallery: GalleryPhoto[];
}

export function WinnerGallerySection({ gallery }: WinnerGallerySectionProps) {
  const [activeFolder, setActiveFolder] = useState("All");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const folders = ["All", ...Array.from(new Set(gallery.map((g) => g.folder)))];

  const filtered = activeFolder === "All" ? gallery : gallery.filter((g) => g.folder === activeFolder);

  const mediaItems: MediaItem[] = filtered.map((g, i) => ({
    id: `gallery-${i}`,
    url: g.url,
    type: "photo" as const,
    title: g.folder,
  }));

  const handleThumbnailClick = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Camera className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold">Gallery</span>
        <span className="text-xs text-muted-foreground">({gallery.length})</span>
      </div>

      {/* Folder chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide touch-pan-x" style={{ scrollbarWidth: "none" }}>
        {folders.map((folder) => (
          <button
            key={folder}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all touch-manipulation active:scale-95 ${
              activeFolder === folder
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
            }`}
            onClick={() => setActiveFolder(folder)}
          >
            {folder}
          </button>
        ))}
      </div>

      {/* 3-column thumbnail grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {filtered.map((photo, idx) => (
          <button
            key={idx}
            className="aspect-square rounded-lg overflow-hidden border border-border/50 touch-manipulation active:scale-[0.97] transition-transform"
            onClick={() => handleThumbnailClick(idx)}
          >
            <img
              src={photo.url}
              alt={`Gallery ${idx + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Full-screen viewer */}
      <MediaGalleryViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        items={mediaItems}
        initialIndex={viewerIndex}
        galleryType="gallery"
      />
    </div>
  );
}
