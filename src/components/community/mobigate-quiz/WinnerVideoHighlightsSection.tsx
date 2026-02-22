import { useState, useRef } from "react";
import { Video, Play, Pencil, Trash2, Plus } from "lucide-react";
import type { VideoHighlight } from "@/data/mobigateInteractiveQuizData";
import { MediaGalleryViewer, type MediaItem } from "@/components/MediaGalleryViewer";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface WinnerVideoHighlightsSectionProps {
  videoHighlights: VideoHighlight[];
  isOwner?: boolean;
  onVideoHighlightsChange?: (highlights: VideoHighlight[]) => void;
}

export function WinnerVideoHighlightsSection({ videoHighlights, isOwner = false, onVideoHighlightsChange }: WinnerVideoHighlightsSectionProps) {
  const { toast } = useToast();
  const [activeFolder, setActiveFolder] = useState("All");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [addVideoOpen, setAddVideoOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newFolder, setNewFolder] = useState("");
  const [newVideoFile, setNewVideoFile] = useState<{ url: string; thumbnail: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = ["All", ...Array.from(new Set(videoHighlights.map((v) => v.folder)))];
  const uniqueFolders = Array.from(new Set(videoHighlights.map((v) => v.folder)));

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

  const handleDeleteVideo = (index: number) => {
    const updated = videoHighlights.filter((_, i) => i !== index);
    onVideoHighlightsChange?.(updated);
    toast({ description: "Video removed" });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast({ description: "Please select a video file", variant: "destructive" });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast({ description: "Video must be under 50MB", variant: "destructive" });
      return;
    }
    const url = URL.createObjectURL(file);
    setNewVideoFile({ url, thumbnail: url });
    e.target.value = "";
  };

  const handleAddVideo = () => {
    if (!newVideoFile || !newTitle.trim()) return;
    const folder = newFolder.trim() || uniqueFolders[0] || "General";
    const newHighlight: VideoHighlight = {
      url: newVideoFile.url,
      thumbnail: newVideoFile.thumbnail,
      title: newTitle.trim(),
      folder,
      duration: "0:30",
    };
    onVideoHighlightsChange?.([...videoHighlights, newHighlight]);
    setNewTitle("");
    setNewFolder("");
    setNewVideoFile(null);
    setAddVideoOpen(false);
    toast({ description: `Video added to "${folder}"` });
  };

  return (
    <div className="space-y-2.5">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Header */}
      <div className="flex items-center gap-2">
        <Video className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold">Video Highlights</span>
        <span className="text-xs text-muted-foreground">({videoHighlights.length})</span>
        {isOwner && (
          <button
            className="ml-auto p-1.5 rounded-lg bg-muted/60 border border-border touch-manipulation active:scale-[0.95] transition-transform"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
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
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow">
                  <Play className="h-4 w-4 text-foreground fill-foreground ml-0.5" />
                </div>
              </div>
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
        galleryType="video-highlights"
      />

      {/* Edit Videos Drawer */}
      {isOwner && (
        <Drawer open={editOpen} onOpenChange={setEditOpen}>
          <DrawerContent className="max-h-[85vh]" showClose>
            <DrawerHeader className="pb-2">
              <DrawerTitle className="text-base font-semibold">Manage Videos</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="px-4 pb-6 space-y-3">
              {videoHighlights.map((video, idx) => (
                <div key={idx} className="flex gap-3 items-center p-2 rounded-xl border bg-muted/20">
                  <div className="relative shrink-0 w-16 aspect-video rounded-lg overflow-hidden">
                    <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover" />
                    <div className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[9px] px-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{video.title}</p>
                    <p className="text-xs text-muted-foreground">{video.folder}</p>
                  </div>
                  <button
                    className="p-2 rounded-lg bg-destructive/10 touch-manipulation active:scale-[0.9] transition-transform"
                    onClick={() => handleDeleteVideo(idx)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              ))}

              {/* Add Video button */}
              <Button
                variant="outline"
                className="w-full h-11 touch-manipulation active:scale-[0.97] gap-2"
                onClick={() => setAddVideoOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Video
              </Button>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}

      {/* Add Video Drawer */}
      {isOwner && (
        <Drawer open={addVideoOpen} onOpenChange={setAddVideoOpen}>
          <DrawerContent className="max-h-[75vh]" showClose>
            <DrawerHeader className="pb-2">
              <DrawerTitle className="text-base font-semibold">Add Video</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="px-4 pb-6 space-y-4">
              {/* Select file */}
              {!newVideoFile ? (
                <button
                  className="w-full aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 bg-muted/30 touch-manipulation active:scale-[0.97] transition-transform"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Video className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tap to select video</span>
                </button>
              ) : (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border bg-black">
                  <video src={newVideoFile.url} className="h-full w-full object-contain" />
                  <button
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 touch-manipulation active:scale-[0.9]"
                    onClick={() => setNewVideoFile(null)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-white" />
                  </button>
                </div>
              )}

              {/* Title */}
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Video title..."
                className="h-10 text-sm"
              />

              {/* Folder */}
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">Folder (optional — defaults to first existing)</span>
                <Input
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                  placeholder={uniqueFolders[0] || "General"}
                  className="h-10 text-sm"
                />
              </div>

              <Button
                className="w-full h-11 touch-manipulation active:scale-[0.97]"
                disabled={!newVideoFile || !newTitle.trim()}
                onClick={handleAddVideo}
              >
                Add Video
              </Button>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
