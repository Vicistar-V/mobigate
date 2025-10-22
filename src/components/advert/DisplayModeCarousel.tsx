import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { DisplayModeCard } from "./DisplayModeCard";
import { DisplayMode, AdvertCategory } from "@/types/advert";

interface DisplayModeCarouselProps {
  category: AdvertCategory;
  displayMode: DisplayMode;
  onSelectMode: (mode: DisplayMode) => void;
}

export function DisplayModeCarousel({
  category,
  displayMode,
  onSelectMode,
}: DisplayModeCarouselProps) {
  const modes: DisplayMode[] = ["single", "multiple", "rollout"];
  const [currentIndex, setCurrentIndex] = useState(
    modes.indexOf(displayMode)
  );

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? modes.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === modes.length - 1 ? 0 : prev + 1));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 50,
  });

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div
        {...swipeHandlers}
        className="relative overflow-hidden px-4"
      >
        {/* Cards Container */}
        <div
          className="flex transition-transform duration-300 ease-out gap-4"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 16}px))`,
          }}
        >
          {modes.map((mode) => (
            <div
              key={mode}
              className="min-w-[85%] flex-shrink-0"
            >
              <DisplayModeCard
                mode={mode}
                selected={displayMode === mode}
                category={category}
                onSelect={() => {
                  onSelectMode(mode);
                  setCurrentIndex(modes.indexOf(mode));
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {modes.map((mode, index) => (
          <button
            key={mode}
            onClick={() => {
              setCurrentIndex(index);
              onSelectMode(mode);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 bg-primary"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to ${mode} display mode`}
          />
        ))}
      </div>
    </div>
  );
}
