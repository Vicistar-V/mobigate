import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Play, Image, Headphones, FileText, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface ELibraryItem {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
  views?: string;
}

const mockItems: ELibraryItem[] = [
  {
    id: "1",
    title: "Getting Started with React",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    duration: "12:45",
    views: "2.3K"
  },
  {
    id: "2",
    title: "Advanced TypeScript Tips",
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=300&fit=crop",
    duration: "18:20",
    views: "1.8K"
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    duration: "15:30",
    views: "3.1K"
  },
  {
    id: "4",
    title: "Mobile App Development",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
    duration: "22:15",
    views: "4.5K"
  }
];

export const ELibrarySection = () => {
  const [activeTab, setActiveTab] = useState("videos");

  const getIcon = (type: string) => {
    switch (type) {
      case "videos":
        return <Play className="w-3 h-3" />;
      case "photos":
        return <Image className="w-3 h-3" />;
      case "audio":
        return <Headphones className="w-3 h-3" />;
      case "articles":
        return <FileText className="w-3 h-3" />;
      default:
        return <MoreHorizontal className="w-3 h-3" />;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base md:text-lg">Recommended E-Library Contents</h3>
        <button className="text-xs md:text-sm text-primary hover:underline">
          View All
        </button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ScrollArea className="w-full">
          <TabsList className="inline-flex w-full min-w-max">
            <TabsTrigger value="videos" className="text-xs md:text-sm gap-1.5">
              {getIcon("videos")}
              Videos
            </TabsTrigger>
            <TabsTrigger value="photos" className="text-xs md:text-sm gap-1.5">
              {getIcon("photos")}
              Photos
            </TabsTrigger>
            <TabsTrigger value="audio" className="text-xs md:text-sm gap-1.5">
              {getIcon("audio")}
              Audio
            </TabsTrigger>
            <TabsTrigger value="articles" className="text-xs md:text-sm gap-1.5">
              {getIcon("articles")}
              Articles
            </TabsTrigger>
            <TabsTrigger value="more" className="text-xs md:text-sm gap-1.5">
              {getIcon("more")}
              More
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value={activeTab} className="mt-4">
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-2">
              {mockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-40 md:w-48 cursor-pointer group"
                >
                  <div className="relative rounded-lg overflow-hidden mb-2 aspect-video bg-muted">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.duration && (
                      <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                        {item.duration}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <h4 className="text-xs md:text-sm font-medium line-clamp-2 mb-1">
                    {item.title}
                  </h4>
                  {item.views && (
                    <p className="text-xs text-muted-foreground">
                      {item.views} views
                    </p>
                  )}
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
