import React, { useState, useMemo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Columns2, LayoutGrid } from "lucide-react";
import { AlbumCard } from "./AlbumCard";
import { AlbumDetailDialog } from "./AlbumDetailDialog";
import { AllPhotosGrid } from "./AllPhotosGrid";
import { AllVideosGrid } from "./AllVideosGrid";
import { mockAlbums, Album, Post } from "@/data/posts";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { albumsCarouselAdSlots } from "@/data/profileAds";
import { getRandomAdSlot } from "@/lib/adUtils";
import { useUserAlbums } from "@/hooks/useWindowData";

interface ProfileAlbumsTabProps {
  userId: string;
  profileImageHistory: string[];
  bannerImageHistory: string[];
  userPosts: Post[];
}

export const ProfileAlbumsTab = ({
  userId,
  profileImageHistory,
  bannerImageHistory,
  userPosts,
}: ProfileAlbumsTabProps) => {
  const phpAlbums = useUserAlbums();
  
  const [selectedAlbum, setSelectedAlbum] = useState<(Album & { isSystem?: boolean }) | null>(null);
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [albumsView, setAlbumsView] = useState<"normal" | "large">("normal");
  const [visibleAlbumCount, setVisibleAlbumCount] = useState(15);

  // Create system albums
  const profilePicturesAlbum: Album & { isSystem: boolean } = useMemo(
    () => ({
      id: "system_profile_pics",
      name: "Profile Pictures",
      description: "All your profile pictures",
      coverImage: profileImageHistory[0] || "/placeholder.svg",
      itemCount: profileImageHistory.length,
      privacy: "Public",
      createdAt: "System",
      isSystem: true,
    }),
    [profileImageHistory]
  );

  const profileBannersAlbum: Album & { isSystem: boolean } = useMemo(
    () => ({
      id: "system_profile_banners",
      name: "Profile Banners",
      description: "All your banner images",
      coverImage: bannerImageHistory[0] || "/placeholder.svg",
      itemCount: bannerImageHistory.length,
      privacy: "Public",
      createdAt: "System",
      isSystem: true,
    }),
    [bannerImageHistory]
  );

  // Get user-created albums (from mockAlbums) with posts assigned to them
  const userAlbums = useMemo(() => {
    const baseAlbums = phpAlbums || mockAlbums;
    return baseAlbums.map((album) => {
      const postsInAlbum = userPosts.filter((post) => post.albumId === album.id);
      return {
        ...album,
        itemCount: postsInAlbum.length,
        coverImage: postsInAlbum[0]?.imageUrl || album.coverImage,
      };
    }).filter((album) => album.itemCount > 0); // Only show albums with items
  }, [phpAlbums, userPosts]);

  // Combine all albums for carousel
  const allAlbums = useMemo(() => {
    const albums: (Album & { isSystem?: boolean })[] = [];
    
    // Add system albums first (if they have items)
    if (profilePicturesAlbum.itemCount > 0) albums.push(profilePicturesAlbum);
    if (profileBannersAlbum.itemCount > 0) albums.push(profileBannersAlbum);
    
    // Add user albums
    albums.push(...userAlbums);
    
    return albums;
  }, [profilePicturesAlbum, profileBannersAlbum, userAlbums]);

  // Prepare all photos for the "All Photos" grid (excluding videos)
  const allPhotos = useMemo(() => {
    const photos: Array<{
      id: string;
      url: string;
      type: "profile-picture" | "banner" | "post";
      date: string;
      title?: string;
      author?: string;
    }> = [];

    // Add profile pictures
    profileImageHistory.forEach((url, index) => {
      photos.push({
        id: `profile_pic_${index}`,
        url,
        type: "profile-picture",
        date: new Date(Date.now() - index * 86400000).toISOString(),
        title: "Profile Picture",
      });
    });

    // Add banner images
    bannerImageHistory.forEach((url, index) => {
      photos.push({
        id: `banner_${index}`,
        url,
        type: "banner",
        date: new Date(Date.now() - index * 86400000).toISOString(),
        title: "Profile Banner",
      });
    });

    // Add ONLY Photo type posts (exclude videos)
    userPosts
      .filter((post) => post.imageUrl && post.type === "Photo")
      .forEach((post) => {
        photos.push({
          id: post.id || `post_${Math.random()}`,
          url: post.imageUrl!,
          type: "post",
          date: post.id || new Date().toISOString(),
          title: post.title,
          author: post.author,
        });
      });

    return photos.sort((a, b) => b.date.localeCompare(a.date));
  }, [profileImageHistory, bannerImageHistory, userPosts]);

  // Prepare all videos for the "All Videos" grid
  const allVideos = useMemo(() => {
    const videos: Array<{
      id: string;
      url: string;
      type: "post";
      date: string;
      title?: string;
      author?: string;
    }> = [];

    // Add ONLY Video type posts
    userPosts
      .filter((post) => post.imageUrl && post.type === "Video")
      .forEach((post) => {
        videos.push({
          id: post.id || `video_${Math.random()}`,
          url: post.imageUrl!,
          type: "post",
          date: post.id || new Date().toISOString(),
          title: post.title,
          author: post.author,
        });
      });

    return videos.sort((a, b) => b.date.localeCompare(a.date));
  }, [userPosts]);

  // Handle album click
  const handleAlbumClick = (album: Album & { isSystem?: boolean }) => {
    setSelectedAlbum(album);
    setAlbumDialogOpen(true);
  };

  // Get items for selected album
  const getAlbumItems = (album: Album & { isSystem?: boolean }) => {
    if (album.id === "system_profile_pics") {
      return profileImageHistory.map((url, index) => ({
        id: `profile_pic_${index}`,
        url,
        title: "Profile Picture",
      }));
    }

    if (album.id === "system_profile_banners") {
      return bannerImageHistory.map((url, index) => ({
        id: `banner_${index}`,
        url,
        title: "Profile Banner",
      }));
    }

    // Regular album - get posts assigned to it
    return userPosts
      .filter((post) => post.albumId === album.id && post.imageUrl)
      .map((post) => ({
        id: post.id || `post_${Math.random()}`,
        url: post.imageUrl!,
        title: post.title,
        author: post.author,
        type: post.type,
      }));
  };

  const displayedAlbums = albumsView === "large" 
    ? allAlbums.slice(0, visibleAlbumCount) 
    : allAlbums;

  const handleLoadMore = () => {
    setVisibleAlbumCount((prev) => prev + 15);
  };

  const handleShowLess = () => {
    setVisibleAlbumCount(15);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      {/* Albums Section */}
      {allAlbums.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Albums</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAlbumsView(albumsView === "normal" ? "large" : "normal")}
                className="gap-1"
              >
                {albumsView === "normal" ? (
                  <Columns2 className="h-4 w-4" />
                ) : (
                  <LayoutGrid className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Carousel View */}
          {albumsView === "normal" && (
            <div className="relative -mx-4 px-4">
              <ScrollArea className="w-full">
                <div className="flex gap-3 pb-2">
                  {allAlbums.map((album, index) => {
                    const shouldShowAd = (index + 1) % 4 === 0 && index < allAlbums.length - 1;
                    const adSlotIndex = Math.floor((index + 1) / 4) - 1;
                    
                    return (
                      <React.Fragment key={album.id}>
                        <AlbumCard
                          album={album}
                          onClick={() => handleAlbumClick(album)}
                          variant="carousel"
                        />
                        
                        {shouldShowAd && (
                          <div className="flex-shrink-0 w-[85vw] sm:w-[90vw] max-w-[400px]">
                            <PremiumAdRotation
                              slotId={`albums-carousel-premium-${adSlotIndex}`}
                              ads={getRandomAdSlot(albumsCarouselAdSlots)}
                              context="albums-carousel"
                            />
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

          {/* Grid View */}
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

              {/* Pagination Controls */}
              {allAlbums.length > visibleAlbumCount && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleLoadMore}
                    className="w-full sm:w-auto"
                  >
                    ...more
                  </Button>
                </div>
              )}

              {visibleAlbumCount > 15 && allAlbums.length >= visibleAlbumCount && (
                <div className="flex justify-center mt-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShowLess}
                    className="w-full sm:w-auto"
                  >
                    Less...
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* All Photos/Videos Tabbed Section */}
      <div>
        <Tabs defaultValue="photos" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Media Gallery</h2>
            <TabsList className="grid w-full sm:w-auto sm:max-w-md grid-cols-2">
              <TabsTrigger value="photos" className="text-sm sm:text-base">
                All Photos ({allPhotos.length})
              </TabsTrigger>
              <TabsTrigger value="videos" className="text-sm sm:text-base">
                All Videos ({allVideos.length})
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="photos" className="mt-0">
            <AllPhotosGrid photos={allPhotos} />
          </TabsContent>
          
          <TabsContent value="videos" className="mt-0">
            <AllVideosGrid videos={allVideos} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Album Detail Dialog */}
      {selectedAlbum && (
        <AlbumDetailDialog
          open={albumDialogOpen}
          onOpenChange={setAlbumDialogOpen}
          album={selectedAlbum}
          items={getAlbumItems(selectedAlbum)}
        />
      )}
    </div>
  );
};
