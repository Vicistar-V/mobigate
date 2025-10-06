import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

type FilterType = "all" | "user" | "friends";

export const WallStatus = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

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
  ];

  const filteredItems = activeFilter === "all" 
    ? allStatusItems 
    : allStatusItems.filter(item => item.type === activeFilter);

  // Always show exactly 3 items (pad with placeholders if needed)
  const displayItems = [...filteredItems];
  while (displayItems.length < 3) {
    displayItems.push({
      id: `placeholder-${displayItems.length}`,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      title: "No more status",
      type: "user" as const,
      author: "You"
    });
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="font-semibold text-lg">Wall Status</h3>
        
        <ToggleGroup type="single" value={activeFilter} onValueChange={(value) => value && setActiveFilter(value as FilterType)}>
          <ToggleGroupItem value="all" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            All
          </ToggleGroupItem>
          <ToggleGroupItem value="user" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            User's
          </ToggleGroupItem>
          <ToggleGroupItem value="friends" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            Friends
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {displayItems.slice(0, 3).map((item) => (
          <Card key={item.id} className="aspect-[3/4] overflow-hidden relative group cursor-pointer">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
              <p className="text-white text-xs font-medium">{item.author}</p>
              <p className="text-white/80 text-xs truncate">{item.title}</p>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};
