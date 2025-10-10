import { useState, useMemo } from "react";
import { AlbumCard } from "./AlbumCard";
import { AlbumDetailDialog } from "./AlbumDetailDialog";
import { AllPhotosGrid } from "./AllPhotosGrid";
import { mockAlbums, Album, Post } from "@/data/posts";
import { Button } from "@/components/ui/button";

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
  const [selectedAlbum, setSelectedAlbum] = useState<(Album & { isSystem?: boolean }) | null>(null);
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [visibleAlbumCount, setVisibleAlbumCount] = useState(4);

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
    return mockAlbums.map((album) => {
      const postsInAlbum = userPosts.filter((post) => post.albumId === album.id);
      return {
        ...album,
        itemCount: postsInAlbum.length,
        coverImage: postsInAlbum[0]?.imageUrl || album.coverImage,
      };
    }).filter((album) => album.itemCount > 0); // Only show albums with items
  }, [userPosts]);

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

  // Prepare all photos for the "All Photos" grid
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
        date: new Date(Date.now() - index * 86400000).toISOString(), // Simulate dates
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

    // Add post images (only Photo and Video types with imageUrl)
    userPosts
      .filter((post) => post.imageUrl && (post.type === "Photo" || post.type === "Video"))
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

    // Sort by most recent (assuming id or date indicates recency)
    return photos.sort((a, b) => b.date.localeCompare(a.date));
  }, [profileImageHistory, bannerImageHistory, userPosts]);

  // Pagination logic for albums
  const displayedAlbums = allAlbums.slice(0, visibleAlbumCount);
  const hasMoreAlbums = visibleAlbumCount < allAlbums.length;
  const canCollapseAlbums = visibleAlbumCount > 4;

  const handleLoadMoreAlbums = () => {
    setVisibleAlbumCount(prev => Math.min(prev + 4, allAlbums.length));
  };

  const handleShowLessAlbums = () => {
    setVisibleAlbumCount(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  return (
    <div className="space-y-8">
      {/* Albums Grid Section */}
      {allAlbums.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Albums</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onClick={() => handleAlbumClick(album)}
              />
            ))}
          </div>
          
          {/* Expansion Controls */}
          {(hasMoreAlbums || canCollapseAlbums) && (
            <div className="flex justify-center items-center gap-6 mt-6">
              {hasMoreAlbums && (
                <Button
                  onClick={handleLoadMoreAlbums}
                  variant="outline"
                  size="lg"
                  className="text-3xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 px-8 py-6 rounded-xl"
                >
                  ...more
                </Button>
              )}
              {canCollapseAlbums && (
                <Button
                  onClick={handleShowLessAlbums}
                  variant="outline"
                  size="lg"
                  className="text-3xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 px-8 py-6 rounded-xl"
                >
                  Less...
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* All Photos Grid Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Photos</h2>
        <AllPhotosGrid photos={allPhotos} />
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
