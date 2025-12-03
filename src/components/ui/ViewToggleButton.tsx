import { Button } from "@/components/ui/button";
import { Grid3x3, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "carousel" | "grid";

interface ViewToggleButtonProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
}

export function ViewToggleButton({ view, onViewChange, className }: ViewToggleButtonProps) {
  const toggleView = () => {
    onViewChange(view === "carousel" ? "grid" : "carousel");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleView}
      className={cn("h-8 w-8", className)}
      title={view === "carousel" ? "Switch to grid view" : "Switch to carousel view"}
    >
      {view === "carousel" ? (
        <Grid3x3 className="h-4 w-4" />
      ) : (
        <LayoutList className="h-4 w-4" />
      )}
    </Button>
  );
}
