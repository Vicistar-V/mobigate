import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FilterDialog } from "./FilterDialog";
import { Grid3x3, Grid2x2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type FilterType = "all" | "user" | "friends";

export const WallStatus = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortFilter, setSortFilter] = useState("all");
  const [wallStatusView, setWallStatusView] = useState<"normal" | "large">("normal");

  const filterOptions = [
    { value: "all", label: "All Posts" },
    { value: "recent", label: "Most Recent" },
    { value: "popular", label: "Most Popular" },
    { value: "trending", label: "Trending" },
  ];

  const allStatusItems: Array<{
    id: number | string;
    image: string;
    title: string;
    type: "user" | "friends";
    author: string;
  }> = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      title: "Team Collaboration",
      type: "user" as const,
      author: "You"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
      title: "Creative Workspace",
      type: "friends" as const,
      author: "John Doe"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
      title: "Business Meeting",
      type: "friends" as const,
      author: "Jane Smith"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
      title: "Innovation Hub",
      type: "user" as const,
      author: "You"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
      title: "Digital Strategy",
      type: "friends" as const,
      author: "Sarah Wilson"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
      title: "Tech Community",
      type: "friends" as const,
      author: "Mike Johnson"
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
      title: "Project Planning",
      type: "user" as const,
      author: "You"
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
      title: "Team Success",
      type: "friends" as const,
      author: "Emma Davis"
    },
  ];

  const filteredItems = activeFilter === "all" 
    ? allStatusItems 
    : allStatusItems.filter(item => item.type === activeFilter);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="font-semibold text-lg">Wall Status</h3>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWallStatusView(wallStatusView === "normal" ? "large" : "normal")}
            className="gap-1"
          >
            {wallStatusView === "normal" ? (
              <Grid2x2 className="h-4 w-4" />
            ) : (
              <Grid3x3 className="h-4 w-4" />
            )}
          </Button>
          
          <ToggleGroup type="single" value={activeFilter} onValueChange={(value) => value && setActiveFilter(value as FilterType)}>
            <ToggleGroupItem value="all" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="user" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              User's
            </ToggleGroupItem>
            <ToggleGroupItem value="friends" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              Friends'
            </ToggleGroupItem>
          </ToggleGroup>
          
          <FilterDialog
            title="Filter Wall Status"
            description="Choose how you want to sort the wall status posts."
            options={filterOptions}
            defaultValue={sortFilter}
            onApply={setSortFilter}
            triggerLabel="Filter"
          />
        </div>
      </div>
      
      {/* Normal View - Horizontal Carousel */}
      {wallStatusView === "normal" && (
        <div className="relative">
          <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
            <div className="flex gap-3 pb-2 flex-nowrap snap-x snap-mandatory">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="flex-none min-w-[33.333%] basis-1/3 snap-start aspect-[3/4] overflow-hidden relative group cursor-pointer"
                >
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2">
                    <p className="text-white text-[10px] font-medium truncate">{item.author}</p>
                    <p className="text-white/80 text-[9px] truncate">{item.title}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Large View - Horizontal Carousel with Bigger Cards */}
      {wallStatusView === "large" && (
        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
          <div className="flex gap-6 pb-4">
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className="inline-block w-[80%] max-w-[500px] flex-shrink-0 overflow-hidden relative group cursor-pointer"
              >
                <div className="h-[600px]">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <p className="text-white text-base font-medium">{item.author}</p>
                    <p className="text-white/90 text-sm">{item.title}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </Card>
  );
};
