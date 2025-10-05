import { Header } from "@/components/Header";
import { GreetingSection } from "@/components/GreetingCard";
import { WallStatus } from "@/components/WallStatus";
import { ELibrarySection } from "@/components/ELibrarySection";
import { FeedPost } from "@/components/FeedPost";
import { AdCard } from "@/components/AdCard";
import { useState } from "react";
import { feedPosts } from "@/data/posts";

const Index = () => {
  const [contentFilter, setContentFilter] = useState<string>("all");

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
