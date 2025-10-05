import { Header } from "@/components/Header";
import { GreetingSection } from "@/components/GreetingCard";
import { WallStatus } from "@/components/WallStatus";
import { ELibrarySection } from "@/components/ELibrarySection";
import { FeedPost } from "@/components/FeedPost";
import { AdCard } from "@/components/AdCard";
import { useState } from "react";

const Index = () => {
  const [contentFilter, setContentFilter] = useState<string>("all");
  const feedPosts = [
    {
      title: "SOME SECRET TRUTH ABOUT WOMEN",
      subtitle: "- How Much Do You Know About Your Woman?",
      author: "PETER NKEMJKA (PPEC)",
      authorProfileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      userId: "1",
      status: "Offline" as const,
      views: "6.8k",
      comments: "255",
      likes: "584",
      type: "Video" as const,
      imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80"
    },
    {
      title: "BEAUTIFUL SUNSET PHOTOGRAPHY",
      subtitle: "- Captured at Lekki Beach, Lagos",
      author: "SARAH OKAFOR",
      authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      userId: "2",
      status: "Online" as const,
      views: "5.2k",
      comments: "189",
      likes: "923",
      type: "Photo" as const,
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
    },
    {
      title: "MOTIVATIONAL PODCAST EPISODE 45",
      subtitle: "- Finding Your Purpose in Life",
      author: "JAMES ADEWALE",
      authorProfileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      userId: "3",
      status: "Online" as const,
      views: "4.1k",
      comments: "67",
      likes: "512",
      type: "Audio" as const,
      imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80"
    },
    {
      title: "I DON'T GET INVOLVED ROMANTICALLY WITH SMALL BOYS",
      subtitle: "- Last Time I Did, It Almost Got Me Washing Dishes For A Thousand Years In Abuja!",
      author: "PETER NKEMJKA (PPEC)",
      authorProfileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      userId: "1",
      status: "Offline" as const,
      views: "8k",
      comments: "875",
      likes: "1.9k",
      type: "Video" as const,
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80"
    },
    {
      title: "DELICIOUS NIGERIAN JOLLOF RICE",
      subtitle: "- Step by Step Photo Guide",
      author: "CHEF NGOZI",
      authorProfileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
      userId: "8",
      status: "Online" as const,
      views: "11k",
      comments: "456",
      likes: "2.1k",
      type: "Photo" as const,
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80"
    },
    {
      title: "THE POWER OF CONSISTENCY IN LIFE",
      subtitle: "- Small Daily Actions Lead to Massive Results",
      author: "SARAH OKAFOR",
      authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      userId: "2",
      status: "Online" as const,
      views: "12k",
      comments: "432",
      likes: "2.3k",
      type: "Article" as const,
      imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80"
    },
    {
      title: "RELAXING MEDITATION AUDIO",
      subtitle: "- 30 Minutes of Pure Calm",
      author: "DR. AMINA YUSUF",
      authorProfileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
      userId: "6",
      status: "Online" as const,
      views: "6.7k",
      comments: "123",
      likes: "845",
      type: "Audio" as const,
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
    },
    {
      title: "BUILDING YOUR PERSONAL BRAND IN 2025",
      subtitle: "- Digital Marketing Strategies That Actually Work",
      author: "JAMES ADEWALE",
      authorProfileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      userId: "3",
      status: "Online" as const,
      views: "9.2k",
      comments: "567",
      likes: "1.8k",
      type: "Video" as const,
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
    },
    {
      title: "AFRICAN FASHION PHOTOGRAPHY",
      subtitle: "- Ankara Styles Collection 2025",
      author: "CHIOMA EZE",
      authorProfileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      userId: "4",
      status: "Offline" as const,
      views: "8.5k",
      comments: "298",
      likes: "1.4k",
      type: "Photo" as const,
      imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80"
    },
    {
      title: "CRYPTOCURRENCY INVESTING FOR BEGINNERS",
      subtitle: "- What You Need to Know Before You Start",
      author: "CHIOMA EZE",
      authorProfileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      userId: "4",
      status: "Offline" as const,
      views: "15k",
      comments: "1.2k",
      likes: "3.4k",
      type: "Article" as const,
      imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80"
    },
  ];

  const filteredPosts = contentFilter === "all" 
    ? feedPosts 
    : feedPosts.filter(post => post.type.toLowerCase() === contentFilter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Greeting Section */}
          <aside className="lg:col-span-1 space-y-6">
            <GreetingSection />
          </aside>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <WallStatus />
            
            {/* Feed Posts with Filter */}
            <div className="space-y-0">
              <ELibrarySection activeFilter={contentFilter} onFilterChange={setContentFilter} />
              <div className="space-y-6 mt-6">
                {filteredPosts.map((post, index) => (
                <div key={index}>
                  <FeedPost {...post} />
                  {/* Insert ad after every 2 posts */}
                  {(index + 1) % 2 === 0 && index < filteredPosts.length - 1 && (
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
    </div>
  );
};

export default Index;
