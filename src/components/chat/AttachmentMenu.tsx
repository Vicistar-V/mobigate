import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Plus, ImageIcon, Paperclip } from "lucide-react";
import { useState } from "react";

interface AttachmentMenuProps {
  onImageSelect: () => void;
  onFileSelect: () => void;
  disabled?: boolean;
}

export const AttachmentMenu = ({
  onImageSelect,
  onFileSelect,
  disabled,
}: AttachmentMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 text-[#54656f] hover:text-foreground"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        side="top" 
        align="start"
        className="w-48 p-2"
      >
        <div className="grid grid-cols-2 gap-2">
          {/* Photos */}
          <Button
            onClick={() => {
              onImageSelect();
              setOpen(false);
            }}
            variant="outline"
            className="h-20 flex flex-col gap-2 hover:bg-primary/10"
          >
            <ImageIcon className="h-6 w-6 text-primary" />
            <span className="text-sm">Photos</span>
          </Button>

          {/* Files */}
          <Button
            onClick={() => {
              onFileSelect();
              setOpen(false);
            }}
            variant="outline"
            className="h-20 flex flex-col gap-2 hover:bg-primary/10"
          >
            <Paperclip className="h-6 w-6 text-primary" />
            <span className="text-sm">Files</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
