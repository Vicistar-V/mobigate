import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Gift, Gamepad2 } from "lucide-react";
import { useState } from "react";

interface GiftsAndGamesMenuProps {
  onGiftClick: () => void;
  onQuizClick: () => void;
}

export const GiftsAndGamesMenu = ({ onGiftClick, onQuizClick }: GiftsAndGamesMenuProps) => {
  const [open, setOpen] = useState(false);

  const handleGiftClick = () => {
    setOpen(false);
    onGiftClick();
  };

  const handleQuizClick = () => {
    setOpen(false);
    onQuizClick();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground"
          type="button"
        >
          <div className="relative">
            <Gift className="h-5 w-5" />
            <Gamepad2 className="h-3 w-3 absolute -bottom-0.5 -right-0.5 text-primary" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10"
            onClick={handleGiftClick}
          >
            <Gift className="h-5 w-5 text-primary" />
            <span>Send Gift</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10"
            onClick={handleQuizClick}
          >
            <Gamepad2 className="h-5 w-5 text-primary" />
            <span>Play Quiz Game</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
