import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ELibrarySection = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Recommended E-Library Contents</h3>
        <span className="text-sm text-muted-foreground">All</span>
      </div>
      
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="videos" className="text-xs">Videos</TabsTrigger>
          <TabsTrigger value="photos" className="text-xs">Photos</TabsTrigger>
          <TabsTrigger value="audio" className="text-xs">Audio</TabsTrigger>
          <TabsTrigger value="articles" className="text-xs">Articles</TabsTrigger>
          <TabsTrigger value="more" className="text-xs">More</TabsTrigger>
        </TabsList>
      </Tabs>
    </Card>
  );
};
