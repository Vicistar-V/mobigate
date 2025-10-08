import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeedPost } from "@/components/FeedPost";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Heart, Gift, MessageCircle, MoreVertical, Camera } from "lucide-react";
import { AdCard } from "@/components/AdCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ELibrarySection } from "@/components/ELibrarySection";
import { useState } from "react";
import { getPostsByUserId, Post } from "@/data/posts";
import profileBanner from "@/assets/profile-banner.jpg";
import { WallStatusCarousel } from "@/components/WallStatusCarousel";
import { ProfileAboutTab } from "@/components/ProfileAboutTab";
import { EditPostDialog } from "@/components/EditPostDialog";
import { EditProfilePictureDialog } from "@/components/profile/EditProfilePictureDialog";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const Profile = () => {
  const [contentFilter, setContentFilter] = useState<string>("all");
  const [wallStatusFilter, setWallStatusFilter] = useState<string>("all");
  const [wallStatusView, setWallStatusView] = useState<"normal" | "large">("normal");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingProfilePicture, setEditingProfilePicture] = useState(false);
  const [editingBanner, setEditingBanner] = useState(false);
  const { toast } = useToast();
  
  // Load profile image from localStorage or use default
  const [profileImage, setProfileImage] = useState<string>(() => {
    const saved = localStorage.getItem("profileImage");
    return saved || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80";
  });

  // Load banner image from localStorage or use default
  const [bannerImage, setBannerImage] = useState<string>(() => {
    const saved = localStorage.getItem("bannerImage");
    return saved || profileBanner;
  });

  // Save profile image to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("profileImage", profileImage);
  }, [profileImage]);

  // Save banner image to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bannerImage", bannerImage);
  }, [bannerImage]);
  
  // Get posts for this specific user and manage as state
  const [userPosts, setUserPosts] = useState<Post[]>(() => getPostsByUserId("1"));
  
  const userProfile = {
    name: "Amaka Jane Johnson",
    location: "Lagos, Nigeria",
    profileImage: profileImage,
    verified: true,
    status: "Online" as const,
    isFriend: true,
    stats: {
      friends: "4.6k",
      followers: "586",
      following: "421",
      likes: "8.5k",
      gifts: "142",
      contents: "318"
    }
  };

  // Ad data for rotation
  const adSlots = [
    {
      slotId: "profile-slot-1",
      ads: [
        {
          id: "ad-p1-1",
          content: "Premium Content Upgrade - 50% Off!",
          image: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-p1-2",
          content: "New Features Available Now",
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
          duration: 10
        },
      ]
    },
    {
      slotId: "profile-slot-2",
      ads: [
        {
          id: "ad-p2-1",
          content: "Limited Time Offer - Join Premium",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-p2-2",
          content: "Exclusive Member Benefits",
          image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
          duration: 10
        },
      ]
    },
    {
      slotId: "profile-slot-3",
      ads: [
        {
          id: "ad-p3-1",
          content: "Boost Your Reach - Advertise Here",
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-p3-2",
          content: "Connect With More Friends",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
          duration: 10
        },
      ]
    },
  ];

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  };

  const handleSavePost = (updatedPost: Post) => {
    setUserPosts(posts => 
      posts.map(p => p.id === updatedPost.id ? updatedPost : p)
    );
  };

  const handleDeletePost = (postId: string) => {
    setUserPosts(posts => posts.filter(p => p.id !== postId));
    toast({
      title: "Post deleted",
      description: "Your post has been deleted successfully",
    });
  };

  // Filter wall status posts based on media type
  const filteredWallPosts = wallStatusFilter === "all"
    ? userPosts
    : userPosts.filter(post => post.type.toLowerCase() === wallStatusFilter);

  // Filter e-library content posts
  const filteredPosts = contentFilter === "all" 
    ? userPosts 
    : userPosts.filter(post => post.type.toLowerCase() === contentFilter);

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6 flex-1">
        {/* Profile Header Card */}
        <Card className="mb-6 overflow-hidden">
          {/* Profile Banner */}
          <div className="relative h-48 bg-muted group">
            <img 
              src={bannerImage} 
              alt="Profile Banner"
              className="w-full h-full object-cover"
            />
            <Button 
              size="sm" 
              className="absolute bottom-4 right-4 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              onClick={() => setEditingBanner(true)}
            >
              <Camera className="h-4 w-4 mr-2" />
              Change Banner
            </Button>
          </div>
          
          <div className="px-6 pb-6">
            {/* Profile Image and Name Row */}
            <div className="relative flex items-start justify-between">
              {/* Profile Image and Name Column */}
              <div className="flex flex-col items-start -mt-20">
                <div className="relative group">
                  <img 
                    src={userProfile.profileImage} 
                    alt={userProfile.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-card"
                  />
                  <button
                    onClick={() => setEditingProfilePicture(true)}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
                  >
                    <Camera className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                </div>
                <div className="mt-3">
                  <h1 className="text-4xl font-extrabold">{userProfile.name}</h1>
                  {userProfile.verified && (
                    <p className="text-emerald-600 font-bold italic text-sm">Verified Content Creator</p>
                  )}
                </div>
              </div>

              {/* Online Indicator - Under Banner, Far Right */}
              {userProfile.status === "Online" && (
                <div className="mt-4 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-bold">
                  Online
                </div>
              )}
            </div>

            {/* Stats and Actions Container */}
            <div className="mt-6">

            <div className="space-y-3">

              {/* Stats */}
              <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span>
                  <span className="font-bold text-foreground">{userProfile.stats.friends}</span> Friends
                </span>
                <span>|</span>
                <span>
                  <span className="font-bold text-foreground">{userProfile.stats.followers}</span> Followers
                </span>
                <span>|</span>
                <span>
                  <span className="font-bold text-foreground">{userProfile.stats.following}</span> Following
                </span>
                <span>|</span>
                <span>
                  <span className="font-bold text-foreground">{userProfile.stats.likes}</span> Likes
                </span>
                <span>|</span>
                <span>
                  <span className="font-bold text-foreground">{userProfile.stats.gifts}</span> Gifts
                </span>
                <span>|</span>
                <span>
                  <span className="font-bold text-foreground">{userProfile.stats.contents}</span> Contents
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="default" size="sm" className="gap-2 bg-black hover:bg-black/80">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button size="sm" className="gap-2 bg-yellow-400 hover:bg-yellow-500 text-black">
                  <Heart className="h-4 w-4" />
                  Like
                </Button>
                <Button size="sm" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </Button>
                <Button size="sm" className="gap-2 bg-purple-500 hover:bg-purple-600 text-white">
                  <Gift className="h-4 w-4" />
                  Gift
                </Button>
                <Button size="icon" variant="destructive" className="rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Friend Status */}
              {userProfile.isFriend && (
                <p className="text-emerald-600 font-medium">
                  You are Friends with {userProfile.name}
                </p>
              )}
            </div>
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="status" className="w-full">
          <ScrollArea className="w-full whitespace-nowrap mb-6">
            <TabsList className="inline-flex w-auto">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="contents">Contents</TabsTrigger>
              <TabsTrigger value="gifts">Gifts</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
              <TabsTrigger value="followers">Followers</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="mobi-circle">Mobi-Circle</TabsTrigger>
              <TabsTrigger value="mobi-shop">Mobi-Shop</TabsTrigger>
              <TabsTrigger value="biz-catalogue">Biz-Catalogue</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="status" className="space-y-6">
            {/* Create Monetized Post */}
            <CreatePostDialog />

            {/* Wall Status */}
            <WallStatusCarousel 
              items={userPosts}
              adSlots={adSlots}
              view={wallStatusView}
              onViewChange={setWallStatusView}
              filter={wallStatusFilter}
              onFilterChange={setWallStatusFilter}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />

            {/* Feed Posts with Filter */}
            <div className="space-y-0">
              <ELibrarySection activeFilter={contentFilter} onFilterChange={setContentFilter} />
              <div className="space-y-6 mt-6">
                {filteredPosts.map((post, index) => (
                <div key={post.id || index}>
                  <FeedPost 
                    {...post}
                  />
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
          </TabsContent>

          <TabsContent value="about">
            <ProfileAboutTab userName={userProfile.name} />
          </TabsContent>

          <TabsContent value="friends">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Friends</h2>
              <p className="text-muted-foreground">Friends list will be displayed here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="contents">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contents</h2>
              <p className="text-muted-foreground">User contents will be displayed here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="gifts">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Gifts</h2>
              <p className="text-muted-foreground">Gifts received will be displayed here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="likes">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Likes</h2>
              <p className="text-muted-foreground">Liked posts will be displayed here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="followers">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Followers</h2>
              <p className="text-muted-foreground">Followers list will be displayed here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="following">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Following</h2>
              <p className="text-muted-foreground">Following list will be displayed here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="mobi-circle">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Mobi-Circle</h2>
              <p className="text-muted-foreground">Welcome to your Mobi-Circle community hub.</p>
            </Card>
          </TabsContent>

          <TabsContent value="mobi-shop">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">My Mobi-Shop @ Mobi-Store</h2>
              <p className="text-muted-foreground">Manage your Mobi-Shop and products here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="biz-catalogue">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Biz-Catalogue</h2>
              <p className="text-muted-foreground">Browse and manage your business catalogue.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {editingPost && (
        <EditPostDialog
          post={editingPost}
          open={!!editingPost}
          onOpenChange={(open) => !open && setEditingPost(null)}
          onSave={handleSavePost}
        />
      )}

      <EditProfilePictureDialog
        open={editingProfilePicture}
        onOpenChange={setEditingProfilePicture}
        currentImage={profileImage}
        onSave={setProfileImage}
      />

      <EditProfilePictureDialog
        open={editingBanner}
        onOpenChange={setEditingBanner}
        currentImage={bannerImage}
        onSave={setBannerImage}
      />
    </div>
  );
};

export default Profile;
