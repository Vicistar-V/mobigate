import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeedPost } from "@/components/FeedPost";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  MessageCircle,
  Share2,
  Camera,
  UserPlus,
  UserMinus,
  DollarSign,
} from "lucide-react";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { WallStatusCarousel } from "@/components/WallStatusCarousel";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { ELibrarySection } from "@/components/ELibrarySection";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { useToast } from "@/hooks/use-toast";
import { Post, wallStatusPosts } from "@/data/posts";
import { getCommunityById, getCommunityPosts } from "@/data/communityProfileData";
import { CommunityAboutTab } from "@/components/community/CommunityAboutTab";
import { CommunityMembershipTab } from "@/components/community/CommunityMembershipTab";
import { CommunityQuickLinks } from "@/components/community/CommunityQuickLinks";
import { CommunityMainMenu } from "@/components/community/CommunityMainMenu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const CommunityProfile = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const [activeTab, setActiveTab] = useState<string>("status");
  const [contentFilter, setContentFilter] = useState<string>("all");
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [visiblePostCount, setVisiblePostCount] = useState(20);
  const { toast } = useToast();
  const tabsSectionRef = useRef<HTMLDivElement>(null);

  // Get community data
  const community = getCommunityById(communityId || "1");
  const communityPosts = getCommunityPosts(communityId || "1");

  if (!community) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Community not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Unliked" : "Liked",
      description: isLiked
        ? "You unliked this community"
        : "You liked this community",
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing
        ? `You unfollowed ${community.name}`
        : `You are now following ${community.name}`,
    });
  };

  const handleJoinLeave = () => {
    setIsMember(!isMember);
    toast({
      title: isMember ? "Left Community" : "Joined Community",
      description: isMember
        ? `You left ${community.name}`
        : `You joined ${community.name}`,
    });
  };

  const handleShare = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link Copied",
      description: "Community link has been copied to clipboard",
    });
  };

  const handleDonate = () => {
    toast({
      title: "Donate",
      description: "Donation feature coming soon!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-5xl">
        {/* Banner and Logo Section */}
        <Card className="overflow-hidden mb-4">
          {/* Banner */}
          <div className="relative h-48 sm:h-64 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
            {community.bannerImage ? (
              <img
                src={community.bannerImage}
                alt="Community Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="h-16 w-16 text-primary/40" />
              </div>
            )}
          </div>

          {/* Logo and Info */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
              {/* Logo */}
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background">
                <AvatarImage src={community.logoImage || community.coverImage} alt={community.name} />
                <AvatarFallback className="text-2xl sm:text-3xl">
                  {community.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Name and Stats */}
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {community.name}
                </h1>
                <p className="text-sm text-muted-foreground mb-3">
                  {community.followers.toLocaleString()} Followers | {community.likes.toLocaleString()} Likes
                </p>
              </div>

              {/* Donate Button */}
              {community.donationEnabled && (
                <Button
                  onClick={handleDonate}
                  className="bg-green-600 hover:bg-green-700 self-start sm:self-end"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Donate To Community
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={isMember ? "secondary" : "default"}
                size="sm"
                onClick={handleJoinLeave}
              >
                {isMember ? (
                  <>
                    <UserMinus className="h-4 w-4 mr-2" />
                    Leave
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleFollow}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>

              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>

              <CommunityMainMenu
                isOwner={community.isOwner}
                isAdmin={community.role === "Admin"}
                isMember={community.isMember || isMember}
              />
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <div ref={tabsSectionRef}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="w-full grid grid-cols-3 h-auto">
              <TabsTrigger value="status" className="text-xs sm:text-sm">
                Status
              </TabsTrigger>
              <TabsTrigger value="about" className="text-xs sm:text-sm">
                About
              </TabsTrigger>
              <TabsTrigger value="membership" className="text-xs sm:text-sm">
                Membership
              </TabsTrigger>
            </TabsList>

            {/* Status Tab */}
            <TabsContent value="status" className="space-y-6 mt-6">
              {/* Motto */}
              {community.motto && (
                <div className="text-center py-4">
                  <p className="text-lg italic text-muted-foreground">"{community.motto}"</p>
                </div>
              )}

              {/* MobiFundRaiser Badge */}
              {community.fundRaiserEnabled && (
                <div className="flex justify-center mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-primary/10 border-primary text-primary hover:bg-primary/20"
                    onClick={() => toast({
                      title: "MobiFundRaiser",
                      description: "Community fundraiser feature coming soon!",
                    })}
                  >
                    MobiFundRaiser
                  </Button>
                </div>
              )}

              {/* Wall Status */}
              <WallStatusCarousel
                items={communityPosts.slice(0, 3)}
                view="normal"
                filter="all"
                onViewChange={() => {}}
                onFilterChange={() => {}}
              />

              {/* Create Post Button */}
              <div className="space-y-2">
                <Button
                  onClick={() => toast({
                    title: "Create Post",
                    description: "Post creation feature coming soon!",
                  })}
                  className="w-full"
                  variant="outline"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Create Post on Community's Status
                </Button>
                <p className="text-xs text-center text-muted-foreground italic">
                  [Admin could turn off this in Privacy Setting]
                </p>
              </div>

              {/* E-Library Section */}
              <ELibrarySection
                activeFilter={contentFilter}
                onFilterChange={setContentFilter}
                title="Recommended Community Gallery"
              />

              {/* Community Posts */}
              <div className="space-y-4">
                {communityPosts.slice(0, visiblePostCount).map((post) => (
                  <FeedPost
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    subtitle={post.subtitle}
                    description={post.description}
                    author={post.author}
                    authorProfileImage={post.authorProfileImage}
                    userId={post.userId}
                    status={post.status}
                    views={post.views}
                    comments={post.comments}
                    likes={post.likes}
                    type={post.type}
                    imageUrl={post.imageUrl}
                  />
                ))}
              </div>

              {/* People You May Know */}
              <PeopleYouMayKnow />
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="mt-6">
              <CommunityAboutTab community={community} />
            </TabsContent>

            {/* Membership Tab */}
            <TabsContent value="membership" className="mt-6">
              <CommunityMembershipTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Create Post Dialog */}
      <CreatePostDialog />
    </div>
  );
};

export default CommunityProfile;
