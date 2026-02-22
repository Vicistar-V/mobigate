import { useState } from "react";
import { Video, Play } from "lucide-react";
import type { VideoHighlight } from "@/data/mobigateInteractiveQuizData";
import { MediaGalleryViewer, type MediaItem } from "@/components/MediaGalleryViewer";

interface WinnerVideoHighlightsSectionProps {
  videoHighlights: VideoHighlight[];
}

export function WinnerVideoHighlightsSection({ videoHighlights }: WinnerVideoHighlightsSectionProps) {
  const [activeFolder, setActiveFolder] = useState("All");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const folders = ["All", ...Array.from(new Set(videoHighlights.map((v) => v.folder)))];

  const filtered = activeFolder === "All" ? videoHighlights : videoHighlights.filter((v) => v.folder === activeFolder);

  const mediaItems: MediaItem[] = filtered.map((v, i) => ({
    id: `video-${i}`,
    url: v.url,
    type: "video" as const,
    title: v.title,
  }));

  const handleVideoClick = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Video className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold">Video Highlights</span>
        <span className="text-xs text-muted-foreground">({videoHighlights.length})</span>
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

      {/* Horizontal scroll video cards */}
      <div
        className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-1 touch-pan-x"
        style={{ scrollbarWidth: "none" }}
      >
        {filtered.map((video, idx) => (
          <button
            key={idx}
            className="shrink-0 w-[140px] snap-start rounded-xl overflow-hidden border border-border/50 touch-manipulation active:scale-[0.97] transition-transform bg-muted/30"
            onClick={() => handleVideoClick(idx)}
          >
            <div className="relative aspect-video">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow">
                  <Play className="h-4 w-4 text-foreground fill-foreground ml-0.5" />
                </div>
              </div>
              {/* Duration badge */}
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                {video.duration}
              </div>
            </div>
            <div className="px-2 py-1.5">
              <p className="text-[11px] font-medium text-foreground line-clamp-2 text-left leading-tight">
                {video.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Full-screen viewer */}
      <MediaGalleryViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        items={mediaItems}
        initialIndex={viewerIndex}
      />
    </div>
  );
}
