import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MoveHorizontal, MoveVertical } from "lucide-react";
import React, { useState } from "react";
import { MediaViewer } from "@/components/MediaViewer";

type ViewMode = "carousel" | "grid";

interface PersonImage {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  country?: string;
}

interface OurPeopleCarouselProps {
  items: PersonImage[];
}

export const OurPeopleCarousel = ({ items }: OurPeopleCarouselProps) => {
  const [selectedPerson, setSelectedPerson] = useState<PersonImage | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("carousel");

  const handlePersonClick = (person: PersonImage) => {
    setSelectedPerson(person);
    setViewerOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Our People, Our Strength</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === "carousel" ? "grid" : "carousel")}
          className="gap-1.5 transition-all duration-200"
          title={viewMode === "carousel" ? "Switch to Vertical View" : "Switch to Horizontal View"}
        >
          {viewMode === "carousel" ? (
            <>
              <MoveHorizontal className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Horizontal</span>
            </>
          ) : (
            <>
              <MoveVertical className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Vertical</span>
            </>
          )}
        </Button>
      </div>
      
      {viewMode === "carousel" ? (
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {items.map((item, index) => (
              <CarouselItem key={`${item.title}-${index}`} className="pl-2 md:pl-4 basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-[30%]">
                <Card 
                  className="h-[65vh] overflow-hidden relative group cursor-pointer"
                  onClick={() => handlePersonClick(item)}
                >
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2 sm:p-3">
                    <p className="text-white text-sm sm:text-base font-semibold truncate">{item.name}</p>
                    <p className="text-white/90 text-xs sm:text-sm truncate">{item.title}</p>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item, index) => (
            <Card 
              key={`${item.title}-${index}`}
              className="aspect-[3/4] overflow-hidden relative group cursor-pointer"
              onClick={() => handlePersonClick(item)}
            >
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2">
                <p className="text-white text-xs sm:text-sm font-semibold truncate">{item.name}</p>
                <p className="text-white/90 text-[10px] sm:text-xs truncate">{item.title}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedPerson && (
        <MediaViewer
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          mediaUrl={selectedPerson.imageUrl}
          mediaType="Photo"
          title={selectedPerson.name}
          author={selectedPerson.title}
          likes={0}
          comments={0}
          showActions={true}
        />
      )}
    </div>
  );
};
