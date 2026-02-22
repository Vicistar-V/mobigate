import { useState, useRef } from "react";
import { Camera, Pencil, Trash2, Plus, FolderPlus } from "lucide-react";
import type { GalleryPhoto } from "@/data/mobigateInteractiveQuizData";
import { MediaGalleryViewer, type MediaItem } from "@/components/MediaGalleryViewer";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface WinnerGallerySectionProps {
  gallery: GalleryPhoto[];
  isOwner?: boolean;
  onGalleryChange?: (gallery: GalleryPhoto[]) => void;
}

export function WinnerGallerySection({ gallery, isOwner = false, onGalleryChange }: WinnerGallerySectionProps) {
  const { toast } = useToast();
  const [activeFolder, setActiveFolder] = useState("All");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [addToFolder, setAddToFolder] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = ["All", ...Array.from(new Set(gallery.map((g) => g.folder)))];
  const uniqueFolders = Array.from(new Set(gallery.map((g) => g.folder)));

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

  const handleDeletePhoto = (url: string) => {
    const updated = gallery.filter((g) => g.url !== url);
    onGalleryChange?.(updated);
    toast({ description: "Photo removed" });
  };

  const handleAddFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    if (uniqueFolders.includes(name)) {
      toast({ description: "Folder already exists", variant: "destructive" });
      return;
    }
    setNewFolderName("");
    setAddToFolder(name);
    // Trigger file input to add the first photo
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ description: "Please select an image file", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ description: "Image must be under 5MB", variant: "destructive" });
      return;
    }
    const url = URL.createObjectURL(file);
    const folder = addToFolder || uniqueFolders[0] || "General";
    const updated = [...gallery, { url, folder }];
    onGalleryChange?.(updated);
    setAddToFolder(null);
    toast({ description: `Photo added to "${folder}"` });
    // Reset input
    e.target.value = "";
  };

  const handleAddToExistingFolder = (folder: string) => {
    setAddToFolder(folder);
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  return (
    <div className="space-y-2.5">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Header */}
      <div className="flex items-center gap-2">
        <Camera className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold">Gallery</span>
        <span className="text-xs text-muted-foreground">({gallery.length})</span>
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

      {/* Edit Gallery Drawer */}
      {isOwner && (
        <Drawer open={editOpen} onOpenChange={setEditOpen}>
          <DrawerContent className="max-h-[85vh]" showClose>
            <DrawerHeader className="pb-2">
              <DrawerTitle className="text-base font-semibold">Manage Gallery</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="px-4 pb-6 space-y-4">
              {/* Folders with photos */}
              {uniqueFolders.map((folder) => {
                const folderPhotos = gallery.filter((g) => g.folder === folder);
                return (
                  <div key={folder} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{folder}</span>
                      <span className="text-xs text-muted-foreground">{folderPhotos.length} photos</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {folderPhotos.map((photo, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border/50">
                          <img src={photo.url} alt="" className="h-full w-full object-cover" />
                          <button
                            className="absolute top-0.5 right-0.5 p-1 rounded-full bg-black/60 touch-manipulation active:scale-[0.9] transition-transform"
                            onClick={() => handleDeletePhoto(photo.url)}
                          >
                            <Trash2 className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      ))}
                      {/* Add photo to this folder */}
                      <button
                        className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center touch-manipulation active:scale-[0.95] transition-transform bg-muted/30"
                        onClick={() => handleAddToExistingFolder(folder)}
                      >
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add new folder */}
              <div className="space-y-2 pt-2 border-t">
                <span className="text-sm font-medium flex items-center gap-1.5">
                  <FolderPlus className="h-4 w-4 text-muted-foreground" />
                  New Folder
                </span>
                <div className="flex gap-2">
                  <Input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name..."
                    className="h-9 text-sm flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddFolder();
                    }}
                  />
                  <Button
                    size="sm"
                    className="h-9 px-4 touch-manipulation active:scale-[0.95]"
                    disabled={!newFolderName.trim()}
                    onClick={handleAddFolder}
                  >
                    Create
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Creates a folder and prompts you to add the first photo</p>
              </div>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
