import React, { useState, useMemo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Columns2, LayoutGrid } from "lucide-react";
import { AlbumCard } from "./AlbumCard";
import { AlbumDetailDialog } from "./AlbumDetailDialog";
import { AllPhotosGrid } from "./AllPhotosGrid";
import { AllVideosGrid } from "./AllVideosGrid";
import { Album, Post, mockAlbums } from "@/data/posts";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { albumsCarouselAdSlots } from "@/data/profileAds";
import { getRandomAdSlot } from "@/lib/adUtils";
import { useUserAlbums } from "@/hooks/useWindowData";
import { RenameAlbumDialog } from "@/components/RenameAlbumDialog";
import { useToast } from "@/hooks/use-toast";

interface ProfileAlbumsTabProps {
  userId: string;
  profileImageHistory: string[];
  bannerImageHistory: string[];
  userPosts: Post[];
  /** When true, show owner Edit/Delete controls on each album. Defaults to true. */
  isOwner?: boolean;
}

export const ProfileAlbumsTab = ({
  userId,
  profileImageHistory,
  bannerImageHistory,
  userPosts,
  isOwner = true,
}: ProfileAlbumsTabProps) => {
  const phpAlbums = useUserAlbums();
  const { toast } = useToast();

  const [selectedAlbum, setSelectedAlbum] = useState<(Album & { isSystem?: boolean }) | null>(null);
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [albumsView, setAlbumsView] = useState<"normal" | "large">("normal");
  const [visibleCount, setVisibleCount] = useState(15);
  const [albumOverrides, setAlbumOverrides] = useState<Record<string, { name?: string; deleted?: boolean }>>({});
  const [renameTarget, setRenameTarget] = useState<(Album & { isSystem?: boolean }) | null>(null);

  const handleAlbumClick = (album: Album & { isSystem?: boolean }) => {
    setSelectedAlbum(album);
    setAlbumDialogOpen(true);
  };



  // Get user-created albums (from mockAlbums) with posts assigned to them.
  // Apply owner overrides (rename/delete) so changes reflect in the UI.
  const userAlbums = useMemo(() => {
    const baseAlbums = phpAlbums || mockAlbums;
    return baseAlbums
      .filter((album) => !albumOverrides[album.id]?.deleted)
      .map((album) => {
        const postsInAlbum = userPosts.filter((post) => post.albumId === album.id);
        return {
          ...album,
          name: albumOverrides[album.id]?.name ?? album.name,
          itemCount: postsInAlbum.length,
          coverImage: postsInAlbum[0]?.imageUrl || album.coverImage,
        };
      })
      .filter((album) => album.itemCount > 0); // Only show albums with items
  }, [phpAlbums, userPosts, albumOverrides]);

  const handleAlbumRename = (newName: string) => {
    if (!renameTarget) return;
    setAlbumOverrides((prev) => ({
      ...prev,
      [renameTarget.id]: { ...prev[renameTarget.id], name: newName },
    }));
    toast({
      title: "Album renamed",
      description: `"${renameTarget.name}" is now "${newName}".`,
    });
    setRenameTarget(null);
  };

  const handleAlbumDelete = (album: Album & { isSystem?: boolean }) => {
    setAlbumOverrides((prev) => ({
      ...prev,
      [album.id]: { ...prev[album.id], deleted: true },
    }));
    toast({
      title: "Album deleted",
      description: `"${album.name}" was removed from your profile.`,
    });
  };

  const handleAlbumChangeCover = (album: Album & { isSystem?: boolean }) => {
    toast({
      title: "Change cover",
      description: `Open "${album.name}" and select an item as the new cover.`,
    });
    setSelectedAlbum(album);
    setAlbumDialogOpen(true);
  };


  // System albums (always shown if they have items)
  const systemAlbums: (Album & { isSystem: boolean })[] = [];
  if (profileImageHistory.length > 0) systemAlbums.push({
    id: "system_profile_pics", name: "Profile Pictures", description: "All your profile pictures",
    coverImage: profileImageHistory[0] || "/placeholder.svg", itemCount: profileImageHistory.length,
    privacy: "Public", createdAt: "System", isSystem: true,
  });
  if (bannerImageHistory.length > 0) systemAlbums.push({
    id: "system_profile_banners", name: "Profile Banners", description: "All your banner images",
    coverImage: bannerImageHistory[0] || "/placeholder.svg", itemCount: bannerImageHistory.length,
    privacy: "Public", createdAt: "System", isSystem: true,
  });

  const allAlbums = [...systemAlbums, ...albums];

  // All photos from posts
  const allPhotos = [
    ...profileImageHistory.map((url, i) => ({ id: `pp_${i}`, url, type: "profile-picture" as const, date: new Date(Date.now() - i * 86400000).toISOString(), title: "Profile Picture" })),
    ...bannerImageHistory.map((url, i) => ({ id: `bn_${i}`, url, type: "banner" as const, date: new Date(Date.now() - i * 86400000).toISOString(), title: "Profile Banner" })),
    ...userPosts.filter(p => p.imageUrl && p.type === "Photo").map(p => ({ id: p.id, url: p.imageUrl!, type: "post" as const, date: p.id || "", title: p.title, author: p.author })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const allVideos = userPosts.filter(p => p.imageUrl && p.type === "Video").map(p => ({
    id: p.id, url: p.imageUrl!, type: "post" as const, date: p.id || "", title: p.title, author: p.author,
  }));

  const getAlbumItems = (album: Album & { isSystem?: boolean }) => {
    if (album.id === "system_profile_pics") return profileImageHistory.map((url, i) => ({ id: `pp_${i}`, url, title: "Profile Picture" }));
    if (album.id === "system_profile_banners") return bannerImageHistory.map((url, i) => ({ id: `bn_${i}`, url, title: "Profile Banner" }));
    return userPosts.filter(p => p.albumId === album.id && p.imageUrl).map(p => ({ id: p.id, url: p.imageUrl!, title: p.title, author: p.author, type: p.type }));
  };

  const displayed = albumsView === "large" ? allAlbums.slice(0, visibleCount) : allAlbums;

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-8">
      {allAlbums.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Albums</h2>
              <Button variant="outline" size="sm" onClick={() => setAlbumsView(v => v === "normal" ? "large" : "normal")} className="gap-1">
                {albumsView === "normal" ? <Columns2 className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {albumsView === "normal" && (
            <div className="relative -mx-4 px-4">
              <ScrollArea className="w-full">
                <div className="flex gap-3 pb-2">
                  {allAlbums.map((album, index) => {
                    const shouldShowAd = (index + 1) % 4 === 0 && index < allAlbums.length - 1;
                    return (
                      <React.Fragment key={album.id}>
                        <AlbumCard
                          album={album}
                          onClick={() => handleAlbumClick(album)}
                          variant="carousel"
                          isOwner={isOwner}
                          onEdit={() => setRenameTarget(album)}
                          onDelete={() => handleAlbumDelete(album)}
                          onChangeCover={() => handleAlbumChangeCover(album)}
                        />
                        
                        {shouldShowAd && (
                          <div className="flex-shrink-0 w-[85vw] sm:w-[90vw] max-w-[400px]">
                            <PremiumAdRotation slotId={`albums-carousel-${Math.floor((index+1)/4)}`} ads={getRandomAdSlot(albumsCarouselAdSlots)} context="albums-carousel" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}

          {albumsView === "large" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {displayedAlbums.map((album, index) => {
                  const adSlotNumber = Math.floor(index / 4);
                  const shouldShowAd = (index + 1) % 4 === 0 && index < displayedAlbums.length - 1;
                  
                  return (
                    <React.Fragment key={album.id}>
                      <AlbumCard
                        album={album}
                        onClick={() => handleAlbumClick(album)}
                        variant="grid"
                        isOwner={isOwner}
                        onEdit={() => setRenameTarget(album)}
                        onDelete={() => handleAlbumDelete(album)}
                        onChangeCover={() => handleAlbumChangeCover(album)}
                      />
                      
                      {shouldShowAd && (
                        <div className="col-span-2 my-2">
                          <PremiumAdRotation
                            slotId={`albums-grid-premium-${adSlotNumber}`}
                            ads={getRandomAdSlot(albumsCarouselAdSlots)}
                            context="albums-carousel"
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              {allAlbums.length > visibleCount && (
                <Button variant="outline" size="lg" onClick={() => setVisibleCount(v => v + 15)} className="w-full">...more</Button>
              )}
              {visibleCount > 15 && (
                <Button variant="outline" size="lg" onClick={() => setVisibleCount(15)} className="w-full">Less...</Button>
              )}
            </div>
          )}
        </div>
      )}

      <div>
        <Tabs defaultValue="photos" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Media Gallery</h2>
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="photos">All Photos ({allPhotos.length})</TabsTrigger>
              <TabsTrigger value="videos">All Videos ({allVideos.length})</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="photos"><AllPhotosGrid photos={allPhotos} /></TabsContent>
          <TabsContent value="videos"><AllVideosGrid videos={allVideos} /></TabsContent>
        </Tabs>
      </div>

      {selectedAlbum && (
        <AlbumDetailDialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen} album={selectedAlbum} items={getAlbumItems(selectedAlbum)} />
      )}

      {/* Rename Album */}
      <RenameAlbumDialog
        open={!!renameTarget}
        onOpenChange={(o) => !o && setRenameTarget(null)}
        currentName={renameTarget?.name ?? ""}
        onRename={handleAlbumRename}
      />
    </div>
  );
};
