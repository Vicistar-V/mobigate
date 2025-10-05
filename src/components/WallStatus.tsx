import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const WallStatus = () => {
  const statusItems = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Wall Status</h3>
        <Button variant="outline" size="sm">
          Filter Posts
        </Button>
      </div>
      
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {statusItems.map((item) => (
            <CarouselItem key={item} className="md:basis-1/2 lg:basis-1/3">
              <Card className="aspect-video bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Status {item}</p>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Card>
  );
};
