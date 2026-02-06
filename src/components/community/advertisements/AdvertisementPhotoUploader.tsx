import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, ImageIcon, Video, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AdMediaItem } from "@/types/advertisementSystem";

interface AdvertisementPhotoUploaderProps {
  media: AdMediaItem[];
  onMediaChange: (media: AdMediaItem[]) => void;
  maxItems?: number;
}

export function AdvertisementPhotoUploader({
  media,
  onMediaChange,
  maxItems = 4,
}: AdvertisementPhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = maxItems - media.length;
    if (remaining <= 0) {
      toast({
        title: "Maximum Media Reached",
        description: `You can upload a maximum of ${maxItems} photos/videos`,
        variant: "destructive",
      });
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remaining);

    filesToProcess.forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        toast({ title: "Invalid file", description: "Only image and video files are allowed", variant: "destructive" });
        return;
      }

      const maxSize = isVideo ? 10 * 1024 * 1024 : 2 * 1024 * 1024;
      const maxLabel = isVideo ? "10MB" : "2MB";

      if (file.size > maxSize) {
        toast({ title: "File too large", description: `Max file size for ${isVideo ? "videos" : "images"} is ${maxLabel}`, variant: "destructive" });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const newItem: AdMediaItem = {
          url: result,
          type: isVideo ? 'video' : 'image',
        };
        onMediaChange([...media, newItem]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeMedia = (index: number) => {
    onMediaChange(media.filter((_, i) => i !== index));
  };

  const slots = Array.from({ length: maxItems }, (_, i) => i);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Product Photos & Videos ({media.length}/{maxItems})
      </label>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((index) => {
          const item = media[index];
          if (item) {
            return (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted"
              >
                {item.type === 'video' ? (
                  <div className="relative w-full h-full bg-black">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    {/* Play icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="h-10 w-10 rounded-full bg-black/60 flex items-center justify-center">
                        <Play className="h-5 w-5 text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Index badge */}
                <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {index + 1}
                </div>
                {/* Type indicator */}
                <div className="absolute bottom-1 left-1 bg-black/60 text-white p-1 rounded">
                  {item.type === 'video' ? (
                    <Video className="h-3 w-3" />
                  ) : (
                    <ImageIcon className="h-3 w-3" />
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={() => removeMedia(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          }
          return (
            <button
              key={index}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:text-primary active:scale-[0.97] transition-all touch-manipulation"
            >
              {index === 0 ? (
                <>
                  <div className="flex items-center gap-1">
                    <ImageIcon className="h-5 w-5" />
                    <Video className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-medium">Add Media</span>
                </>
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </button>
          );
        })}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
      <p className="text-[11px] text-muted-foreground">
        JPG, PNG, WebP, MP4, WebM • Images max 2MB, Videos max 10MB
      </p>
    </div>
  );
}
