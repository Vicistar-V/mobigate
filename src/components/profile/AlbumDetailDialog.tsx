import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Lock, Users, Globe, MoreVertical, Pencil, Trash2, PauseCircle, PlayCircle, Clock } from "lucide-react";
import { Album, Post } from "@/data/posts";
import { useState } from "react";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import { toast } from "sonner";

interface AlbumDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  album: Album & { isSystem?: boolean };
  items: Array<{ id: string; url: string; title?: string; author?: string; type?: string }>;
  isOwner?: boolean;
}

type ItemState = {
  paused?: boolean;
  resumeAt?: string;
  title?: string;
  deleted?: boolean;
};

export const AlbumDetailDialog = ({
  open,
  onOpenChange,
  album,
  items,
  isOwner = false,
}: AlbumDetailDialogProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [itemStates, setItemStates] = useState<Record<string, ItemState>>({});
  const [editingItem, setEditingItem] = useState<{ id: string; title: string } | null>(null);
  const [pausingItem, setPausingItem] = useState<{ id: string; resumeAt: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const getPrivacyIcon = () => {
    if (album.privacy === "Private") return <Lock className="h-3 w-3" />;
    if (album.privacy === "Friends") return <Users className="h-3 w-3" />;
    return <Globe className="h-3 w-3" />;
  };

  const handlePhotoClick = (index: number) => {
    setSelectedIndex(index);
  };

  const visibleItems = items.filter((i) => !itemStates[i.id]?.deleted);

  const mediaItems: MediaItem[] = visibleItems.map((item) => ({
    id: item.id,
    type: "photo" as const,
    url: item.url,
    title: itemStates[item.id]?.title ?? item.title ?? album.name,
    author: item.author || "You",
    authorImage: "/placeholder.svg",
    likes: 0,
    comments: 0,
  }));

  const handleDelete = (id: string) => {
    setItemStates((s) => ({ ...s, [id]: { ...s[id], deleted: true } }));
    setConfirmDelete(null);
    toast.success("Item removed");
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    setItemStates((s) => ({ ...s, [editingItem.id]: { ...s[editingItem.id], title: editingItem.title } }));
    toast.success("Caption updated");
    setEditingItem(null);
  };

  const handleSavePause = () => {
    if (!pausingItem) return;
    setItemStates((s) => ({
      ...s,
      [pausingItem.id]: { ...s[pausingItem.id], paused: true, resumeAt: pausingItem.resumeAt || undefined },
    }));
    toast.success(pausingItem.resumeAt ? "Paused until scheduled time" : "Item paused");
    setPausingItem(null);
  };

  const handleResume = (id: string) => {
    setItemStates((s) => ({ ...s, [id]: { ...s[id], paused: false, resumeAt: undefined } }));
    toast.success("Item resumed");
  };

  return (
    <>
      <Dialog open={open && selectedIndex === null} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[92dvh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
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
              <div className="flex items-center gap-3 text-base text-muted-foreground flex-wrap">
                <span className="font-medium">{visibleItems.length} items</span>
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

          <div className="flex-1 overflow-y-auto pr-2">
            {visibleItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No items in this album yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {visibleItems.map((item, index) => {
                  const state = itemStates[item.id] || {};
                  const title = state.title ?? item.title;
                  return (
                    <div
                      key={item.id}
                      className="aspect-square overflow-hidden rounded-lg group relative bg-muted"
                    >
                      <button
                        type="button"
                        onClick={() => handlePhotoClick(index)}
                        className="absolute inset-0 w-full h-full"
                        aria-label="Open photo"
                      >
                        <img
                          src={item.url}
                          alt={title || "Photo"}
                          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                            state.paused ? "opacity-50 grayscale" : ""
                          }`}
                          loading="lazy"
                        />
                      </button>

                      {state.paused && (
                        <div className="absolute top-2 left-2 z-10 pointer-events-none">
                          <Badge className="bg-amber-500 text-white text-[10px] gap-1">
                            <PauseCircle className="h-3 w-3" /> Paused
                          </Badge>
                        </div>
                      )}

                      {isOwner && (
                        <div className="absolute top-1.5 right-1.5 z-20">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8 rounded-full bg-background/90 backdrop-blur shadow-md hover:bg-background"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 z-50">
                              <DropdownMenuItem
                                onClick={() => setEditingItem({ id: item.id, title: title || "" })}
                              >
                                <Pencil className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              {state.paused ? (
                                <DropdownMenuItem onClick={() => handleResume(item.id)}>
                                  <PlayCircle className="h-4 w-4 mr-2" /> Resume
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => setPausingItem({ id: item.id, resumeAt: "" })}
                                >
                                  <PauseCircle className="h-4 w-4 mr-2" /> Pause / Suspend
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setConfirmDelete(item.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}

                      {(title || (state.paused && state.resumeAt)) && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                          {title && <p className="text-white text-xs truncate">{title}</p>}
                          {state.paused && state.resumeAt && (
                            <p className="text-white/80 text-[10px] flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" /> Resumes {new Date(state.resumeAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editingItem} onOpenChange={(o) => !o && setEditingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="caption">Caption / Title</Label>
            <Textarea
              id="caption"
              value={editingItem?.title || ""}
              onChange={(e) => setEditingItem((s) => (s ? { ...s, title: e.target.value } : s))}
              rows={3}
              placeholder="Add a caption..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pause dialog */}
      <Dialog open={!!pausingItem} onOpenChange={(o) => !o && setPausingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pause / Suspend Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Hide this item temporarily. Optionally set a date and time when it should automatically resume.
            </p>
            <Label htmlFor="resumeAt">Resume Time (optional)</Label>
            <Input
              id="resumeAt"
              type="datetime-local"
              value={pausingItem?.resumeAt || ""}
              onChange={(e) => setPausingItem((s) => (s ? { ...s, resumeAt: e.target.value } : s))}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to pause indefinitely (you can manually resume any time).
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPausingItem(null)}>Cancel</Button>
            <Button onClick={handleSavePause}>
              <PauseCircle className="h-4 w-4 mr-2" /> Pause
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this item?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will remove the item from your album. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => confirmDelete && handleDelete(confirmDelete)}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </DialogFooter>
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
