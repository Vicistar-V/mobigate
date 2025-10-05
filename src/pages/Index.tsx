import { Header } from "@/components/Header";
import { UserProfileCard } from "@/components/UserProfileCard";
import { WallStatus } from "@/components/WallStatus";
import { ELibrarySection } from "@/components/ELibrarySection";
import { FeedPost } from "@/components/FeedPost";
import { AdCard } from "@/components/AdCard";

const Index = () => {
  const feedPosts = [
    {
      title: "SOME SECRET TRUTH ABOUT WOMEN",
      subtitle: "- How Much Do You Know About Your Woman?",
      author: "PETER NKEMJKA (PPEC)",
      status: "Offline" as const,
      views: "6.8k",
      comments: "255",
      likes: "584",
      type: "Video" as const,
      imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80"
    },
    {
      title: "I DON'T GET INVOLVED ROMANTICALLY WITH SMALL BOYS",
      subtitle: "- Last Time I Did, It Almost Got Me Washing Dishes For A Thousand Years In Abuja!",
      author: "PETER NKEMJKA (PPEC)",
      status: "Offline" as const,
      views: "8k",
      comments: "875",
      likes: "1.9k",
      type: "Video" as const,
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80"
    },
    {
      title: "I DON'T GET INVOLVED ROMANTICALLY WITH SMALL BOYS",
      subtitle: "- Last Time I Did, It Almost Got Me Washing Dishes For A Thousand Years In Abuja!",
      author: "PETER NKEMJKA (PPEC)",
      status: "Offline" as const,
      views: "8k",
      comments: "875",
      likes: "1.9k",
      type: "Article" as const,
    },
    {
      title: "SOME SECRET TRUTH ABOUT WOMEN",
      subtitle: "- How Much Do You Know About Your Woman?",
      author: "PETER NKEMJKA (PPEC)",
      status: "Offline" as const,
      views: "6.8k",
      comments: "255",
      likes: "584",
      type: "Article" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - User Profile */}
          <aside className="lg:col-span-1 space-y-6">
            <UserProfileCard />
          </aside>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <WallStatus />
            <ELibrarySection />
            
            {/* Feed Posts */}
            <div className="space-y-6">
              {feedPosts.map((post, index) => (
                <div key={index}>
                  <FeedPost {...post} />
                  {/* Insert ad after every 2 posts */}
                  {(index + 1) % 2 === 0 && index < feedPosts.length - 1 && (
                    <div className="my-6">
                      <AdCard />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
