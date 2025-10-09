import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GreetingSection } from "@/components/GreetingCard";
import { WallStatusCarousel } from "@/components/WallStatusCarousel";
import { ELibrarySection } from "@/components/ELibrarySection";
import { FeedPost } from "@/components/FeedPost";
import { AdCard } from "@/components/AdCard";
import { EditPostDialog } from "@/components/EditPostDialog";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { useState } from "react";
import { feedPosts, Post, wallStatusPosts } from "@/data/posts";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [contentFilter, setContentFilter] = useState<string>("all");
  const [wallStatusFilter, setWallStatusFilter] = useState<string>("all");
  const [wallStatusView, setWallStatusView] = useState<"normal" | "large">("normal");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [mediaGalleryOpen, setMediaGalleryOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsEditDialogOpen(true);
  };

  const handleSavePost = (updatedPost: Post) => {
    // In a real app, this would update the post in the database
    console.log("Saving post:", updatedPost);
    toast({
      title: "Post updated",
      description: "Your Wall Status post has been updated successfully.",
    });
  };

  const handleDeletePost = (postId: string) => {
    // In a real app, this would delete the post from the database
    console.log("Deleting post:", postId);
    toast({
      title: "Post deleted",
      description: "Your Wall Status post has been deleted successfully.",
      variant: "destructive",
    });
  };

  // Open media gallery for wall status
  const openWallStatusGallery = (initialPost: Post) => {
    // Convert wall status posts to MediaItem format
    const items: MediaItem[] = wallStatusPosts.map((post) => ({
      id: post.id,
      url: post.url,
      type: post.type,
      author: post.author,
      authorImage: post.authorImage,
      title: post.title,
      description: post.description,
      timestamp: post.timestamp,
      likes: post.likes,
      comments: post.comments,
      isLiked: post.isLiked,
    }));
    const initialIndex = wallStatusPosts.findIndex(p => p.id === initialPost.id);
    setGalleryItems(items);
    setGalleryInitialIndex(initialIndex >= 0 ? initialIndex : 0);
    setMediaGalleryOpen(true);
  };

  // Convert wall status posts to Post format for WallStatusCarousel
  const wallStatusPostsForCarousel = wallStatusPosts.map(post => ({
    id: post.id,
    title: post.title || "Wall Status",
    subtitle: post.description,
    description: post.description,
    author: post.author,
    authorProfileImage: post.authorImage,
    userId: "1",
    status: "Online" as const,
    views: "0",
    comments: String(post.comments),
    likes: String(post.likes),
    type: post.type === "video" ? "Video" as const : "Photo" as const,
    imageUrl: post.url,
    isOwner: false
  }));

  const adSlots = [
    {
      slotId: "home-slot-1",
      ads: [
        {
          id: "ad-h1-1",
          content: "Premium Content Upgrade - 50% Off!",
          image: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-h1-2",
          content: "New Features Available Now",
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
          duration: 10
        },
      ]
    },
    {
      slotId: "home-slot-2",
      ads: [
        {
          id: "ad-h2-1",
          content: "Limited Time Offer - Join Premium",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-h2-2",
          content: "Exclusive Member Benefits",
          image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
          duration: 10
        },
      ]
    },
    {
      slotId: "home-slot-3",
      ads: [
        {
          id: "ad-h3-1",
          content: "Boost Your Reach - Advertise Here",
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-h3-2",
          content: "Connect With More Friends",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
          duration: 10
        },
      ]
    },
  ];

  const filteredPosts = contentFilter === "all" 
    ? feedPosts 
    : feedPosts.filter(post => post.type.toLowerCase() === contentFilter);

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 py-6 flex-1">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Greeting Section */}
          <aside className="lg:col-span-1 space-y-6 min-w-0">
            <GreetingSection />
          </aside>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {/* Create Monetized Post - Directly above Wall Status */}
            <CreatePostDialog />
            
            <WallStatusCarousel
              items={wallStatusPostsForCarousel}
              adSlots={adSlots}
              view={wallStatusView}
              onViewChange={setWallStatusView}
              filter={wallStatusFilter}
              onFilterChange={setWallStatusFilter}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onItemClick={openWallStatusGallery}
            />
            
            {editingPost && (
              <EditPostDialog
                post={editingPost}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onSave={handleSavePost}
              />
            )}
            
            {/* Feed Posts with Filter */}
            <div className="space-y-0">
              <ELibrarySection activeFilter={contentFilter} onFilterChange={setContentFilter} />
              <div className="space-y-6 mt-6">
                {filteredPosts.map((post, index) => (
                <div key={index}>
                  <FeedPost {...post} />
                  {/* Insert ad after every 5 posts */}
                  {(index + 1) % 5 === 0 && index < filteredPosts.length - 1 && (
                    <div className="my-6">
                      <AdCard />
                    </div>
                  )}
                  {/* Insert People You May Know after every 10 posts */}
                  {(index + 1) % 10 === 0 && index < filteredPosts.length - 1 && (
                    <div className="my-6">
                      <PeopleYouMayKnow compact />
                    </div>
                  )}
                </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <MediaGalleryViewer
        open={mediaGalleryOpen}
        onOpenChange={setMediaGalleryOpen}
        items={galleryItems}
        initialIndex={galleryInitialIndex}
        showActions={true}
        galleryType="wall-status"
      />
    </div>
  );
};

export default Index;
