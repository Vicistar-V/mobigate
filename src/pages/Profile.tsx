import { Header } from "@/components/Header";
import { FeedPost } from "@/components/FeedPost";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Heart, Gift, MapPin } from "lucide-react";
import { AdCard } from "@/components/AdCard";

const Profile = () => {
  const userProfile = {
    name: "Amaka Jane Johnson",
    location: "Lagos, Nigeria",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    stats: {
      posts: "245",
      likes: "12.5k",
      comments: "3.2k",
      followers: "8.9k",
      following: "456"
    }
  };

  const userPosts = [
    {
      title: "SOME SECRET TRUTH ABOUT WOMEN",
      subtitle: "- How Much Do You Know About Your Woman?",
      author: "AMAKA JANE JOHNSON",
      status: "Online" as const,
      views: "6.8k",
      comments: "255",
      likes: "584",
      type: "Video" as const,
      imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80"
    },
    {
      title: "I DON'T GET INVOLVED ROMANTICALLY WITH SMALL BOYS",
      subtitle: "- Last Time I Did, It Almost Got Me Washing Dishes For A Thousand Years In Abuja!",
      author: "AMAKA JANE JOHNSON",
      status: "Online" as const,
      views: "8k",
      comments: "875",
      likes: "1.9k",
      type: "Video" as const,
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80"
    },
    {
      title: "THE POWER OF CONSISTENCY IN LIFE",
      subtitle: "- Small Daily Actions Lead to Massive Results",
      author: "AMAKA JANE JOHNSON",
      status: "Online" as const,
      views: "12k",
      comments: "432",
      likes: "2.3k",
      type: "Article" as const,
      imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80"
    },
    {
      title: "BUILDING YOUR PERSONAL BRAND IN 2025",
      subtitle: "- Digital Marketing Strategies That Actually Work",
      author: "AMAKA JANE JOHNSON",
      status: "Online" as const,
      views: "9.2k",
      comments: "567",
      likes: "1.8k",
      type: "Video" as const,
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header Card */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img 
                src={userProfile.profileImage} 
                alt={userProfile.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{userProfile.location}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{userProfile.stats.posts}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{userProfile.stats.likes}</p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{userProfile.stats.comments}</p>
                  <p className="text-xs text-muted-foreground">Comments</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{userProfile.stats.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{userProfile.stats.following}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="default" size="sm" className="gap-2">
                  <Phone className="h-4 w-4" />
                  CALL
                </Button>
                <Button variant="secondary" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Like
                </Button>
                <Button variant="outline" size="sm" className="gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  <Gift className="h-4 w-4" />
                  GIFT
                </Button>
                <Button variant="outline" size="sm" className="gap-2 border-purple-600 text-purple-600 hover:bg-purple-50">
                  <Gift className="h-4 w-4" />
                  GIFT
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="contents">Contents</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-6">
            {/* Wall Status Header */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Wall Status</h2>
                <Button variant="destructive" size="sm">Her Posts</Button>
              </div>
            </Card>

            {/* Feed Posts */}
            <div className="space-y-6">
              {userPosts.map((post, index) => (
                <div key={index}>
                  <FeedPost {...post} />
                  {/* Insert ad after every 2 posts */}
                  {(index + 1) % 2 === 0 && index < userPosts.length - 1 && (
                    <div className="my-6">
                      <AdCard />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-muted-foreground">User information will be displayed here.</p>
            </Card>
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
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
