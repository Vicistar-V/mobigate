import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GreetingSection } from "@/components/GreetingCard";
import { WallStatusCarousel } from "@/components/WallStatusCarousel";
import { ELibrarySection } from "@/components/ELibrarySection";
import { FeedPost } from "@/components/FeedPost";
import { AdCard } from "@/components/AdCard";
import { EditPostDialog } from "@/components/EditPostDialog";
import { useState } from "react";
import { feedPosts, Post } from "@/data/posts";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [contentFilter, setContentFilter] = useState<string>("all");
  const [wallStatusFilter, setWallStatusFilter] = useState<string>("all");
  const [wallStatusView, setWallStatusView] = useState<"normal" | "large">("normal");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
          <aside className="lg:col-span-1 space-y-6">
            <GreetingSection />
          </aside>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            <WallStatusCarousel 
              items={feedPosts}
              adSlots={adSlots}
              view={wallStatusView}
              onViewChange={setWallStatusView}
              filter={wallStatusFilter}
              onFilterChange={setWallStatusFilter}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
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
                </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
