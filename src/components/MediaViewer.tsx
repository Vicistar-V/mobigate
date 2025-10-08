import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaUrl?: string;
  mediaType: "Video" | "Article" | "Photo" | "Audio" | "PDF" | "URL";
  title: string;
}

export const MediaViewer = ({
  open,
  onOpenChange,
  mediaUrl,
  mediaType,
  title,
}: MediaViewerProps) => {
  const renderMedia = () => {
    if (!mediaUrl) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No media available
        </div>
      );
    }

    switch (mediaType) {
      case "Video":
        return (
          <video
            src={mediaUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        );

      case "Audio":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">Playing audio</p>
            </div>
            <audio
              src={mediaUrl}
              controls
              autoPlay
              className="w-full max-w-2xl"
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        );

      case "Photo":
        return (
          <img
            src={mediaUrl}
            alt={title}
            className="w-full h-full object-contain"
          />
        );

      case "PDF":
        return (
          <iframe
            src={mediaUrl}
            title={title}
            className="w-full h-full"
          />
        );

      case "URL":
      case "Article":
        return (
          <iframe
            src={mediaUrl}
            title={title}
            className="w-full h-full"
          />
        );

      default:
        return (
          <img
            src={mediaUrl}
            alt={title}
            className="w-full h-full object-contain"
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 gap-0 bg-black/95">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="w-full h-full">
          {renderMedia()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
