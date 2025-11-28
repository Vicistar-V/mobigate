import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CampaignMediaItem } from "@/data/fundraiserData";
import { ChevronLeft, ChevronRight, Upload, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface MediaGalleryUploadProps {
  items: CampaignMediaItem[];
  onItemsChange: (items: CampaignMediaItem[]) => void;
}

export const MediaGalleryUpload = ({
  items,
  onItemsChange,
}: MediaGalleryUploadProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Upload Media",
      description: "Photo/Video upload feature coming soon!",
    });
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

  const toggleSelection = (itemId: string) => {
    const updated = items.map((item) =>
      item.id === itemId ? { ...item, selected: !item.selected } : item
    );
    onItemsChange(updated);
  };

  const handlePreview = () => {
    toast({
      title: "Preview Selected Media",
      description: "Preview feature coming soon!",
    });
  };

  const handleDelete = () => {
    const selectedItems = items.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select media items to delete",
        variant: "destructive",
      });
      return;
    }

    const updated = items.filter((item) => !item.selected);
    onItemsChange(updated);
    setCurrentIndex(0);
    
    toast({
      title: "Deleted",
      description: `${selectedItems.length} item(s) deleted`,
    });
  };

  const handleSave = () => {
    toast({
      title: "Saved",
      description: "Media gallery saved successfully!",
    });
  };

  const currentItem = items[currentIndex];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-700"
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
              
              {/* Checkbox Overlay */}
              <div className="absolute top-3 right-3 bg-white/90 p-2 rounded">
                <Checkbox
                  checked={currentItem.selected || false}
                  onCheckedChange={() => toggleSelection(currentItem.id)}
                />
              </div>

              {/* Navigation Arrows */}
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="rounded-full bg-white/80 hover:bg-white"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentIndex === items.length - 1}
                  className="rounded-full bg-white/80 hover:bg-white"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              {/* Counter */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {items.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
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
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePreview}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                PREVIEW
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                DELETE
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                SAVE
              </Button>
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No media uploaded yet</p>
            <p className="text-sm">Click upload to add photos or videos</p>
          </div>
        )}
      </div>
    </Card>
  );
};
