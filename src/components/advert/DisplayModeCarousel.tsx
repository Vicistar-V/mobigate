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
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev === 0 ? modes.length - 1 : prev - 1;
      onSelectMode(modes[newIndex]);
      return newIndex;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev === modes.length - 1 ? 0 : prev + 1;
      onSelectMode(modes[newIndex]);
      return newIndex;
    });
  };

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      setIsDragging(true);
      setDragOffset(eventData.deltaX);
    },
    onSwipedLeft: () => {
      setIsDragging(false);
      setDragOffset(0);
      goToNext();
    },
    onSwipedRight: () => {
      setIsDragging(false);
      setDragOffset(0);
      goToPrevious();
    },
    onTap: () => {
      setIsDragging(false);
      setDragOffset(0);
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 50,
  });

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div
        {...swipeHandlers}
        className="relative overflow-hidden"
      >
        {/* Cards Container */}
        <div
          className={`flex gap-4 ${!isDragging ? 'transition-transform duration-300 ease-out' : ''}`}
          style={{
            transform: `translateX(calc(50% - 42.5% - ${currentIndex * 85}% - ${currentIndex * 16}px + ${dragOffset}px))`,
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
