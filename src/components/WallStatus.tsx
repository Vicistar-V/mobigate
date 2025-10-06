import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FilterDialog } from "./FilterDialog";
import { LayoutGrid, Columns2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AdRotation } from "./AdRotation";
import React from "react";

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
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80",
      title: "Morning Coffee",
      type: "user" as const,
      author: "You"
    },
    {
      id: 10,
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
      title: "Design Workshop",
      type: "friends" as const,
      author: "Alex Chen"
    },
    {
      id: 11,
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
      title: "Code Review",
      type: "user" as const,
      author: "You"
    },
    {
      id: 12,
      image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&q=80",
      title: "Team Celebration",
      type: "friends" as const,
      author: "Maria Garcia"
    },
    {
      id: 13,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      title: "Development Sprint",
      type: "user" as const,
      author: "You"
    },
    {
      id: 14,
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80",
      title: "Creative Brainstorm",
      type: "friends" as const,
      author: "David Lee"
    },
    {
      id: 15,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      title: "Analytics Review",
      type: "user" as const,
      author: "You"
    },
    {
      id: 16,
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80",
      title: "Fitness Journey",
      type: "friends" as const,
      author: "Emily Brown"
    },
    {
      id: 17,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      title: "Office Views",
      type: "user" as const,
      author: "You"
    },
    {
      id: 18,
      image: "https://images.unsplash.com/photo-1511376777868-611b54f68947?w=800&q=80",
      title: "Late Night Work",
      type: "friends" as const,
      author: "Tom Anderson"
    },
    {
      id: 19,
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      title: "Project Launch",
      type: "user" as const,
      author: "You"
    },
    {
      id: 20,
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80",
      title: "Team Building",
      type: "friends" as const,
      author: "Lisa Wang"
    },
    {
      id: 21,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
      title: "Tech Conference",
      type: "user" as const,
      author: "You"
    },
    {
      id: 22,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
      title: "Workshop Session",
      type: "friends" as const,
      author: "Ryan Kim"
    },
    {
      id: 23,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
      title: "Stand-up Meeting",
      type: "user" as const,
      author: "You"
    },
    {
      id: 24,
      image: "https://images.unsplash.com/photo-1529119513726-b034c827a632?w=800&q=80",
      title: "Weekend Vibes",
      type: "friends" as const,
      author: "Sophie Martin"
    },
    {
      id: 25,
      image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80",
      title: "Product Demo",
      type: "user" as const,
      author: "You"
    },
    {
      id: 26,
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80",
      title: "Coffee Chat",
      type: "friends" as const,
      author: "Chris Taylor"
    },
    {
      id: 27,
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80",
      title: "Team Photo",
      type: "user" as const,
      author: "You"
    },
    {
      id: 28,
      image: "https://images.unsplash.com/photo-1542744095-291d1f67b221?w=800&q=80",
      title: "Design Critique",
      type: "friends" as const,
      author: "Nina Patel"
    },
    {
      id: 29,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      title: "Hackathon Win",
      type: "user" as const,
      author: "You"
    },
    {
      id: 30,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
      title: "Strategy Meeting",
      type: "friends" as const,
      author: "Jake Wilson"
    },
    {
      id: 31,
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80",
      title: "Coffee Break",
      type: "user" as const,
      author: "You"
    },
    {
      id: 32,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
      title: "Team Lunch",
      type: "friends" as const,
      author: "Kate Miller"
    },
    {
      id: 33,
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
      title: "Remote Work",
      type: "user" as const,
      author: "You"
    },
    {
      id: 34,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      title: "Brainstorm Session",
      type: "friends" as const,
      author: "Mark Davis"
    },
    {
      id: 35,
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80",
      title: "Friday Fun",
      type: "user" as const,
      author: "You"
    },
    {
      id: 36,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
      title: "Tech Talk",
      type: "friends" as const,
      author: "Anna Lopez"
    },
    {
      id: 37,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
      title: "Product Planning",
      type: "user" as const,
      author: "You"
    },
    {
      id: 38,
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80",
      title: "Office Party",
      type: "friends" as const,
      author: "Ben Harris"
    },
    {
      id: 39,
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
      title: "Client Meeting",
      type: "user" as const,
      author: "You"
    },
    {
      id: 40,
      image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80",
      title: "Morning Routine",
      type: "friends" as const,
      author: "Julia White"
    },
    {
      id: 41,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
      title: "Workspace Setup",
      type: "user" as const,
      author: "You"
    },
    {
      id: 42,
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
      title: "Creative Process",
      type: "friends" as const,
      author: "Sam Green"
    },
    {
      id: 43,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      title: "Code Marathon",
      type: "user" as const,
      author: "You"
    },
    {
      id: 44,
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
      title: "Deep Work",
      type: "friends" as const,
      author: "Olivia Young"
    },
    {
      id: 45,
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
      title: "Milestone Achieved",
      type: "user" as const,
      author: "You"
    },
  ];

  // Ad data for rotation
  const adSlots = [
    {
      slotId: "slot-1",
      ads: [
        {
          id: "ad-1-1",
          content: "Premium Content Upgrade - 50% Off!",
          image: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-1-2",
          content: "New Features Available Now",
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
          duration: 10
        },
      ]
    },
    {
      slotId: "slot-2",
      ads: [
        {
          id: "ad-2-1",
          content: "Limited Time Offer - Join Premium",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-2-2",
          content: "Exclusive Member Benefits",
          image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
          duration: 10
        },
      ]
    },
    {
      slotId: "slot-3",
      ads: [
        {
          id: "ad-3-1",
          content: "Boost Your Reach - Advertise Here",
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-3-2",
          content: "Connect With More Friends",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
          duration: 10
        },
      ]
    },
  ];

  const filteredItems = activeFilter === "all" 
    ? allStatusItems 
    : allStatusItems.filter(item => item.type === activeFilter);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">Wall Status</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWallStatusView(wallStatusView === "normal" ? "large" : "normal")}
            className="gap-1"
          >
            {wallStatusView === "normal" ? (
              <Columns2 className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
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
      
      {/* Large View - 3-Column Vertical Grid with Ads */}
      {wallStatusView === "large" && (
        <div className="grid grid-cols-3 gap-3">
          {filteredItems.slice(0, 45).map((item, index) => {
            const shouldShowAd = (index + 1) % 15 === 0 && index < 44;
            const adSlotIndex = Math.floor((index + 1) / 15) - 1;
            
            return (
              <React.Fragment key={item.id}>
                <Card 
                  className="overflow-hidden relative group cursor-pointer"
                >
                  <div className="aspect-[3/4]">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                      <p className="text-white text-sm font-medium truncate">{item.author}</p>
                      <p className="text-white/90 text-xs truncate">{item.title}</p>
                    </div>
                  </div>
                </Card>
                
                {/* Insert ad after every 15 images (5 rows of 3) */}
                {shouldShowAd && adSlotIndex >= 0 && adSlotIndex < adSlots.length && (
                  <AdRotation 
                    key={`ad-${adSlots[adSlotIndex].slotId}`}
                    slotId={adSlots[adSlotIndex].slotId}
                    ads={adSlots[adSlotIndex].ads}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </Card>
  );
};
