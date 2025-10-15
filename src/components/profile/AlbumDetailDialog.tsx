import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Lock, Users, Globe } from "lucide-react";
import { Album, Post } from "@/data/posts";
import { useState } from "react";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";

interface AlbumDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  album: Album & { isSystem?: boolean };
  items: Array<{ id: string; url: string; title?: string; author?: string; type?: string }>;
}

export const AlbumDetailDialog = ({
  open,
  onOpenChange,
  album,
  items,
}: AlbumDetailDialogProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const getPrivacyIcon = () => {
    if (album.privacy === "Private") return <Lock className="h-3 w-3" />;
    if (album.privacy === "Friends") return <Users className="h-3 w-3" />;
    return <Globe className="h-3 w-3" />;
  };

  const handlePhotoClick = (index: number) => {
    setSelectedIndex(index);
  };

  // Convert items to MediaItems for the gallery viewer
  const mediaItems: MediaItem[] = items.map((item) => ({
    id: item.id,
    type: "photo" as const,
    url: item.url,
    title: item.title || album.name,
    author: item.author || "You",
    authorImage: "/placeholder.svg",
    likes: 0,
    comments: 0,
  }));

  return (
    <>
      <Dialog open={open && selectedIndex === null} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-2xl">{album.name}</DialogTitle>
                {album.isSystem && (
                  <Badge variant="outline" className="text-base">
                    System Album
                  </Badge>
                )}
              </div>
              {album.description && (
                <p className="text-base text-muted-foreground">{album.description}</p>
              )}
              <div className="flex items-center gap-3 text-base text-muted-foreground">
                <span className="font-medium">{album.itemCount} items</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  {getPrivacyIcon()}
                  <span>{album.privacy}</span>
                </div>
                {album.createdAt !== "System" && (
                  <>
                    <span>•</span>
                    <span>Created {new Date(album.createdAt).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Photos Grid */}
          <div className="flex-1 overflow-y-auto pr-2">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No items in this album yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="aspect-square overflow-hidden rounded-lg cursor-pointer group relative"
                    onClick={() => handlePhotoClick(index)}
                  >
                    <img
                      src={item.url}
                      alt={item.title || "Photo"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                    
                    {/* Info overlay on hover */}
                    {item.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm truncate">{item.title}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Media Gallery Viewer */}
      {selectedIndex !== null && (
        <MediaGalleryViewer
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedIndex(null);
            }
          }}
          items={mediaItems}
          initialIndex={selectedIndex}
          showActions={true}
          galleryType="post"
        />
      )}
    </>
  );
};
