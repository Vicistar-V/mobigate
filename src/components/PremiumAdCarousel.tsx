import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PremiumAdMedia } from "./PremiumAdCard";

interface PremiumAdCarouselProps {
  items: PremiumAdMedia[];
}

export const PremiumAdCarousel = ({ items }: PremiumAdCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 50,
  });

  if (items.length === 0) return null;

  return (
    <div className="relative bg-muted">
      {/* Carousel Container */}
      <div
        {...swipeHandlers}
        className="relative aspect-video sm:aspect-[16/9] overflow-hidden"
      >
        {/* Images */}
        <div
          className="flex transition-transform duration-300 ease-out h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="min-w-full h-full relative flex-shrink-0"
            >
              <img
                src={item.url}
                alt={item.caption || `Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with caption and price */}
              {(item.caption || item.price) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
                  {item.caption && (
                    <p className="text-white text-xs sm:text-sm font-medium mb-1">
                      {item.caption}
                    </p>
                  )}
                  {item.price && (
                    <p className="text-white text-lg sm:text-2xl font-bold">
                      {item.price}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Buttons - Desktop */}
        {items.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white border-2 border-white/20 z-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white border-2 border-white/20 z-10"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 sm:w-8 bg-white"
                  : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Item Counter */}
      {items.length > 1 && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/60 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
          {currentIndex + 1} / {items.length}
        </div>
      )}
    </div>
  );
};
