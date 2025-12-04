import { Button } from "@/components/ui/button";
import { MoveHorizontal, MoveVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "carousel" | "grid";

interface ViewToggleButtonProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
  showLabel?: boolean;
}

export function ViewToggleButton({ view, onViewChange, className, showLabel = false }: ViewToggleButtonProps) {
  const toggleView = () => {
    onViewChange(view === "carousel" ? "grid" : "carousel");
  };

  const isHorizontal = view === "carousel";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleView}
      className={cn("gap-1.5 transition-all duration-200", className)}
      title={isHorizontal ? "Switch to Vertical View" : "Switch to Horizontal View"}
    >
      {isHorizontal ? (
        <>
          <MoveHorizontal className="h-4 w-4" />
          {showLabel && <span className="text-xs">Horizontal</span>}
        </>
      ) : (
        <>
          <MoveVertical className="h-4 w-4" />
          {showLabel && <span className="text-xs">Vertical</span>}
        </>
      )}
    </Button>
  );
}
