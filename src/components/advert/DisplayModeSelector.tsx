import { useIsMobile } from "@/hooks/use-mobile";
import { DisplayModeCard } from "./DisplayModeCard";
import { DisplayModeCarousel } from "./DisplayModeCarousel";
import { DisplayMode, AdvertCategory } from "@/types/advert";

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

  if (isMobile) {
    return (
      <DisplayModeCarousel
        category={category}
        displayMode={displayMode}
        onSelectMode={onSelectMode}
      />
    );
  }

  const modes: DisplayMode[] = ["single", "multiple", "rollout"];

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
