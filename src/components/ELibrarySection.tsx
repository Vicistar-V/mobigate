import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Play, Image, Headphones, FileText, MoreHorizontal } from "lucide-react";

interface ELibrarySectionProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const ELibrarySection = ({ activeFilter, onFilterChange }: ELibrarySectionProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-3 h-3" />;
      case "photo":
        return <Image className="w-3 h-3" />;
      case "audio":
        return <Headphones className="w-3 h-3" />;
      case "article":
        return <FileText className="w-3 h-3" />;
      default:
        return <MoreHorizontal className="w-3 h-3" />;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base md:text-lg">Filter Contents</h3>
      </div>
      
      <ScrollArea className="w-full">
        <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full">
          <TabsList className="inline-flex w-full min-w-max">
            <TabsTrigger value="all" className="text-xs md:text-sm gap-1.5">
              All
            </TabsTrigger>
            <TabsTrigger value="video" className="text-xs md:text-sm gap-1.5">
              {getIcon("video")}
              Videos
            </TabsTrigger>
            <TabsTrigger value="photo" className="text-xs md:text-sm gap-1.5">
              {getIcon("photo")}
              Photos
            </TabsTrigger>
            <TabsTrigger value="audio" className="text-xs md:text-sm gap-1.5">
              {getIcon("audio")}
              Audio
            </TabsTrigger>
            <TabsTrigger value="article" className="text-xs md:text-sm gap-1.5">
              {getIcon("article")}
              Articles
            </TabsTrigger>
            <TabsTrigger value="more" className="text-xs md:text-sm gap-1.5">
              {getIcon("more")}
              More
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
};
