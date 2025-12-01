import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  selected?: boolean;
}

interface MediaPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: MediaItem[];
  initialIndex?: number;
}

export const MediaPreviewDialog = ({
  open,
  onOpenChange,
  items,
  initialIndex = 0,
}: MediaPreviewDialogProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(100);

  const selectedItems = items.filter((item) => item.selected);
  const previewItems = selectedItems.length > 0 ? selectedItems : items;
  const currentItem = previewItems[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setZoom(100);
    }
  };

  const handleNext = () => {
    if (currentIndex < previewItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setZoom(100);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  if (!currentItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle>
              Media Preview ({currentIndex + 1} / {previewItems.length})
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Main Preview Area */}
        <div className="relative bg-black/5 aspect-video flex items-center justify-center overflow-hidden">
          {currentItem.type === "image" ? (
            <img
              src={currentItem.url}
              alt={`Preview ${currentIndex + 1}`}
              style={{ transform: `scale(${zoom / 100})` }}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
            />
          ) : (
            <video
              src={currentItem.url}
              controls
              className="max-w-full max-h-full"
              style={{ transform: `scale(${zoom / 100})` }}
            />
          )}

          {/* Navigation Arrows */}
          {previewItems.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleNext}
                disabled={currentIndex === previewItems.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 space-y-4">
          {/* Zoom Controls (Images Only) */}
          {currentItem.type === "image" && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-4 w-4 mr-2" />
                Zoom Out
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-4 w-4 mr-2" />
                Zoom In
              </Button>
            </div>
          )}

          {/* Thumbnail Strip */}
          {previewItems.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {previewItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    setZoom(100);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                    index === currentIndex
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
