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
      title: "THE POWER OF CONSISTENCY IN LIFE",
      subtitle: "- Small Daily Actions Lead to Massive Results",
      author: "SARAH OKAFOR",
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
      author: "JAMES ADEWALE",
      status: "Online" as const,
      views: "9.2k",
      comments: "567",
      likes: "1.8k",
      type: "Video" as const,
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
    },
    {
      title: "CRYPTOCURRENCY INVESTING FOR BEGINNERS",
      subtitle: "- What You Need to Know Before You Start",
      author: "CHIOMA EZE",
      status: "Offline" as const,
      views: "15k",
      comments: "1.2k",
      likes: "3.4k",
      type: "Article" as const,
      imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80"
    },
    {
      title: "FITNESS JOURNEY: FROM ZERO TO HERO",
      subtitle: "- My 90-Day Transformation Story",
      author: "DAVID OKONKWO",
      status: "Online" as const,
      views: "18k",
      comments: "945",
      likes: "4.1k",
      type: "Video" as const,
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
    },
    {
      title: "MENTAL HEALTH MATTERS",
      subtitle: "- Breaking the Stigma in African Communities",
      author: "DR. AMINA YUSUF",
      status: "Online" as const,
      views: "11k",
      comments: "678",
      likes: "2.7k",
      type: "Article" as const,
      imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80"
    },
    {
      title: "TECH STARTUPS IN NIGERIA",
      subtitle: "- Success Stories and Lessons Learned",
      author: "TUNDE BAKARE",
      status: "Offline" as const,
      views: "14k",
      comments: "823",
      likes: "3.2k",
      type: "Video" as const,
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
    },
    {
      title: "COOKING WITH LOVE: NIGERIAN DELICACIES",
      subtitle: "- Traditional Recipes with a Modern Twist",
      author: "CHEF NGOZI",
      status: "Online" as const,
      views: "22k",
      comments: "1.5k",
      likes: "5.6k",
      type: "Video" as const,
      imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
    },
    {
      title: "REAL ESTATE INVESTMENT STRATEGIES",
      subtitle: "- How to Build Wealth Through Property",
      author: "EMEKA NWOSU",
      status: "Offline" as const,
      views: "13k",
      comments: "734",
      likes: "2.9k",
      type: "Article" as const,
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
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
