import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CampaignMediaItem } from "@/data/fundraiserData";
import { ChevronLeft, ChevronRight, Upload, Eye, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MediaUploadDialog } from "@/components/community/MediaUploadDialog";
import { MediaPreviewDialog } from "@/components/community/MediaPreviewDialog";

interface MediaGalleryUploadProps {
  items: CampaignMediaItem[];
  onItemsChange: (items: CampaignMediaItem[]) => void;
}

export const MediaGalleryUpload = ({
  items,
  onItemsChange,
}: MediaGalleryUploadProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const { toast } = useToast();

  const handleUpload = () => {
    setShowUploadDialog(true);
  };

  const handleUploadComplete = (
    files: Array<{ url: string; type: "image" | "video" }>
  ) => {
    const newItems: CampaignMediaItem[] = files.map((file, index) => ({
      id: `media-${Date.now()}-${index}`,
      url: file.url,
      type: file.type === "image" ? "photo" : "video",
    }));
    onItemsChange([...items, ...newItems]);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreview = () => {
    if (items.length === 0) return;
    setShowPreviewDialog(true);
  };

  const handleDelete = () => {
    if (items.length === 0) return;
    const updated = items.filter((_, i) => i !== currentIndex);
    onItemsChange(updated);
    setCurrentIndex(Math.min(currentIndex, Math.max(0, updated.length - 1)));
    toast({
      title: "Deleted",
      description: "Current media item deleted",
    });
  };

  const handleDeleteThumbnail = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onItemsChange(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(Math.max(0, updated.length - 1));
    } else if (index < currentIndex) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSave = () => {
    toast({
      title: "Saved",
      description: "Media gallery saved successfully!",
    });
  };

  const currentItem = items[currentIndex];

  return (
    <>
      <Card className="p-4">
        <div className="space-y-3">
          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-sm h-10"
          >
            <Upload className="h-4 w-4 mr-2" />
            UPLOAD PHOTO / VIDEO
          </Button>

          {/* Carousel */}
          {items.length > 0 && (
            <div className="space-y-3">
              {/* Main Image Display */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={currentItem.url}
                  alt={`Media ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {items.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      className="rounded-full bg-white/80 hover:bg-white h-8 w-8"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={handleNext}
                      disabled={currentIndex === items.length - 1}
                      className="rounded-full bg-white/80 hover:bg-white h-8 w-8"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}

                {/* Counter */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-0.5 rounded-full text-xs">
                  {currentIndex + 1} / {items.length}
                </div>
              </div>

              {/* Thumbnail Strip with X delete buttons */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative flex-shrink-0"
                  >
                    <div
                      onClick={() => setCurrentIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                        index === currentIndex
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* X delete button on thumbnail */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteThumbnail(index);
                      }}
                      className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Buttons - contained within card */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={handlePreview}
                  className="text-xs h-9 px-2"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Preview
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="text-xs h-9 px-2"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
                <Button
                  onClick={handleSave}
                  className="text-xs h-9 px-2 bg-green-600 hover:bg-green-700"
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          {items.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">No media uploaded yet</p>
              <p className="text-xs">Click upload to add photos or videos</p>
            </div>
          )}
        </div>
      </Card>

      <MediaUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUploadComplete={handleUploadComplete}
      />

      <MediaPreviewDialog
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        items={items.map((item) => ({
          ...item,
          type: item.type === "photo" ? "image" : "video",
        }))}
        initialIndex={currentIndex}
      />
    </>
  );
};
