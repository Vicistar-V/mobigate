import { useIsMobile } from "@/hooks/use-mobile";
import { DisplayModeCard } from "./DisplayModeCard";
import { DisplayMode, AdvertCategory } from "@/types/advert";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface DisplayModeSelectorProps {
  category: AdvertCategory;
  displayMode: DisplayMode;
  onSelectMode: (mode: DisplayMode) => void;
}

export function DisplayModeSelector({
  category,
  displayMode,
  onSelectMode,
}: DisplayModeSelectorProps) {
  const isMobile = useIsMobile();

  const modes: DisplayMode[] = ["single", "multiple", "rollout"];

  if (isMobile) {
    return (
      <Carousel
        opts={{
          align: "center",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {modes.map((mode) => (
            <CarouselItem key={mode} className="pl-0 basis-[85%] flex">
              <DisplayModeCard
                mode={mode}
                selected={displayMode === mode}
                category={category}
                onSelect={() => onSelectMode(mode)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:auto-rows-fr">
      {modes.map((mode) => (
        <DisplayModeCard
          key={mode}
          mode={mode}
          selected={displayMode === mode}
          category={category}
          onSelect={() => onSelectMode(mode)}
        />
      ))}
    </div>
  );
}
