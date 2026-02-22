import { useState, useRef } from "react";
import { ArrowLeft, Play, X, ChevronLeft, ChevronRight, FolderOpen, Video, Eye } from "lucide-react";
import { Drawer, DrawerContent, DrawerBody } from "@/components/ui/drawer";
import type { VideoFolder, VideoHighlightItem } from "@/data/winnerMediaData";

function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

interface WinnerVideoViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: VideoFolder[];
  playerName: string;
}

export function WinnerVideoViewer({ open, onOpenChange, folders, playerName }: WinnerVideoViewerProps) {
  const [selectedFolder, setSelectedFolder] = useState<VideoFolder | null>(null);
  const [playingVideo, setPlayingVideo] = useState<{ item: VideoHighlightItem; index: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const totalVideos = folders.reduce((sum, f) => sum + f.items.length, 0);

  const handleClose = () => {
    if (playingVideo) {
      setPlayingVideo(null);
    } else if (selectedFolder) {
      setSelectedFolder(null);
    } else {
      onOpenChange(false);
    }
  };

  const navigateVideo = (direction: "prev" | "next") => {
    if (!playingVideo || !selectedFolder) return;
    const items = selectedFolder.items;
    const newIndex = direction === "prev"
      ? (playingVideo.index - 1 + items.length) % items.length
      : (playingVideo.index + 1) % items.length;
    setPlayingVideo({ item: items[newIndex], index: newIndex });
  };

  return (
    <Drawer open={open} onOpenChange={(o) => { if (!o) { setSelectedFolder(null); setPlayingVideo(null); } onOpenChange(o); }}>
      <DrawerContent className="max-h-[95vh] z-[150]" showClose={false}>
        <DrawerBody className="p-0 overflow-y-auto touch-auto overscroll-contain">
          {/* Full-screen video player */}
          {playingVideo && selectedFolder ? (
            <div className="fixed inset-0 bg-black z-[300] flex flex-col">
              <div className="flex items-center justify-between p-3 text-white">
                <button onClick={() => setPlayingVideo(null)} className="p-2 touch-manipulation active:scale-95">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium truncate px-2">{playingVideo.item.title}</span>
                <button onClick={() => { setPlayingVideo(null); setSelectedFolder(null); onOpenChange(false); }} className="p-2 touch-manipulation active:scale-95">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center relative px-2">
                <button
                  className="absolute left-1 z-10 p-1.5 bg-white/20 backdrop-blur-sm rounded-full touch-manipulation active:scale-95"
                  onClick={() => navigateVideo("prev")}
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <video
                  ref={videoRef}
                  src={playingVideo.item.url}
                  controls
                  autoPlay
                  className="max-h-[70vh] max-w-full rounded-lg"
                  playsInline
                />
                <button
                  className="absolute right-1 z-10 p-1.5 bg-white/20 backdrop-blur-sm rounded-full touch-manipulation active:scale-95"
                  onClick={() => navigateVideo("next")}
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="p-4 text-white">
                <p className="font-semibold text-sm">{playingVideo.item.title}</p>
                <div className="flex items-center gap-3 text-xs text-white/60 mt-1">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatViews(playingVideo.item.views)}</span>
                  <span>{playingVideo.item.duration}</span>
                  {playingVideo.item.date && <span>{playingVideo.item.date}</span>}
                </div>
              </div>
              {/* Video thumbnail strip */}
              <div className="flex gap-2 p-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {selectedFolder.items.map((item, idx) => (
                  <button
                    key={item.id}
                    className={`shrink-0 w-20 rounded-lg overflow-hidden border-2 touch-manipulation ${
                      idx === playingVideo.index ? "border-white" : "border-transparent opacity-50"
                    }`}
                    onClick={() => setPlayingVideo({ item, index: idx })}
                  >
                    <div className="relative aspect-video">
                      <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-3 w-3 text-white" fill="white" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : selectedFolder ? (
            /* Folder contents - list of videos */
            <div className="pb-6">
              <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center gap-3 p-3 border-b">
                <button onClick={() => setSelectedFolder(null)} className="p-1.5 touch-manipulation active:scale-95">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{selectedFolder.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedFolder.items.length} videos</p>
                </div>
              </div>
              <div className="space-y-2 p-3">
                {selectedFolder.items.map((item, idx) => (
                  <button
                    key={item.id}
                    className="w-full flex gap-3 p-2 rounded-xl border bg-card touch-manipulation active:scale-[0.98] transition-transform text-left"
                    onClick={() => setPlayingVideo({ item, index: idx })}
                  >
                    <div className="relative shrink-0 w-28 rounded-lg overflow-hidden">
                      <div className="aspect-video">
                        <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="h-3.5 w-3.5 text-foreground ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                        {item.duration}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                      <p className="font-semibold text-sm leading-tight line-clamp-2">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                        <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{formatViews(item.views)}</span>
                        {item.date && <span>{item.date}</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Folder list */
            <div className="pb-6">
              <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center gap-3 p-3 border-b">
                <button onClick={() => onOpenChange(false)} className="p-1.5 touch-manipulation active:scale-95">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{playerName}'s Videos</h3>
                  <p className="text-xs text-muted-foreground">{folders.length} folders · {totalVideos} videos</p>
                </div>
                <Video className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-3 p-3">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    className="w-full text-left rounded-xl overflow-hidden border bg-card shadow-sm touch-manipulation active:scale-[0.97] transition-transform"
                    onClick={() => setSelectedFolder(folder)}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img src={folder.coverUrl} alt={folder.name} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-white">
                            <FolderOpen className="h-4 w-4 text-amber-400" />
                            <span className="font-bold text-sm">{folder.name}</span>
                          </div>
                          <p className="text-xs text-white/70 mt-0.5">{folder.items.length} videos</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play className="h-4 w-4 text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
