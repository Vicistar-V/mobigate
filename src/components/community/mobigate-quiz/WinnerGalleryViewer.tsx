import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, X, Image, FolderOpen } from "lucide-react";
import { Drawer, DrawerContent, DrawerBody } from "@/components/ui/drawer";
import type { GalleryFolder, GalleryMediaItem } from "@/data/winnerMediaData";

interface WinnerGalleryViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: GalleryFolder[];
  playerName: string;
}

export function WinnerGalleryViewer({ open, onOpenChange, folders, playerName }: WinnerGalleryViewerProps) {
  const [selectedFolder, setSelectedFolder] = useState<GalleryFolder | null>(null);
  const [viewingImage, setViewingImage] = useState<{ item: GalleryMediaItem; index: number } | null>(null);

  const totalPhotos = folders.reduce((sum, f) => sum + f.items.length, 0);

  const handleClose = () => {
    if (viewingImage) {
      setViewingImage(null);
    } else if (selectedFolder) {
      setSelectedFolder(null);
    } else {
      onOpenChange(false);
    }
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (!viewingImage || !selectedFolder) return;
    const items = selectedFolder.items;
    const newIndex = direction === "prev"
      ? (viewingImage.index - 1 + items.length) % items.length
      : (viewingImage.index + 1) % items.length;
    setViewingImage({ item: items[newIndex], index: newIndex });
  };

  return (
    <Drawer open={open} onOpenChange={(o) => { if (!o) { setSelectedFolder(null); setViewingImage(null); } onOpenChange(o); }}>
      <DrawerContent className="max-h-[95vh] z-[150]" showClose={false}>
        <DrawerBody className="p-0 overflow-y-auto touch-auto overscroll-contain">
          {/* Full-screen image viewer */}
          {viewingImage && selectedFolder ? (
            <div className="fixed inset-0 bg-black z-[300] flex flex-col">
              <div className="flex items-center justify-between p-3 text-white">
                <button onClick={() => setViewingImage(null)} className="p-2 touch-manipulation active:scale-95">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium">{viewingImage.index + 1} / {selectedFolder.items.length}</span>
                <button onClick={() => { setViewingImage(null); setSelectedFolder(null); onOpenChange(false); }} className="p-2 touch-manipulation active:scale-95">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center relative px-2">
                <button
                  className="absolute left-1 z-10 p-1.5 bg-white/20 backdrop-blur-sm rounded-full touch-manipulation active:scale-95"
                  onClick={() => navigateImage("prev")}
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <img
                  src={viewingImage.item.url}
                  alt={viewingImage.item.caption || ""}
                  className="max-h-[75vh] max-w-full object-contain rounded-lg"
                />
                <button
                  className="absolute right-1 z-10 p-1.5 bg-white/20 backdrop-blur-sm rounded-full touch-manipulation active:scale-95"
                  onClick={() => navigateImage("next")}
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              </div>
              {viewingImage.item.caption && (
                <div className="p-4 text-center text-white">
                  <p className="text-sm">{viewingImage.item.caption}</p>
                  {viewingImage.item.date && <p className="text-xs text-white/60 mt-1">{viewingImage.item.date}</p>}
                </div>
              )}
              {/* Thumbnail strip */}
              <div className="flex gap-1.5 p-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {selectedFolder.items.map((item, idx) => (
                  <button
                    key={item.id}
                    className={`shrink-0 h-12 w-12 rounded-lg overflow-hidden border-2 touch-manipulation ${
                      idx === viewingImage.index ? "border-white" : "border-transparent opacity-50"
                    }`}
                    onClick={() => setViewingImage({ item, index: idx })}
                  >
                    <img src={item.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          ) : selectedFolder ? (
            /* Folder contents - grid of photos */
            <div className="pb-6">
              <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center gap-3 p-3 border-b">
                <button onClick={() => setSelectedFolder(null)} className="p-1.5 touch-manipulation active:scale-95">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{selectedFolder.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedFolder.items.length} photos</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-0.5 p-0.5">
                {selectedFolder.items.map((item, idx) => (
                  <button
                    key={item.id}
                    className="aspect-square overflow-hidden touch-manipulation active:opacity-80"
                    onClick={() => setViewingImage({ item, index: idx })}
                  >
                    <img src={item.url} alt={item.caption || ""} className="h-full w-full object-cover" />
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
                  <h3 className="font-semibold text-sm">{playerName}'s Gallery</h3>
                  <p className="text-xs text-muted-foreground">{folders.length} folders · {totalPhotos} photos</p>
                </div>
                <Image className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-3 p-3">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    className="text-left rounded-xl overflow-hidden border bg-card shadow-sm touch-manipulation active:scale-[0.97] transition-transform"
                    onClick={() => setSelectedFolder(folder)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={folder.coverUrl} alt={folder.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-2.5">
                      <div className="flex items-center gap-1.5">
                        <FolderOpen className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span className="font-semibold text-sm truncate">{folder.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{folder.items.length} photos</p>
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
