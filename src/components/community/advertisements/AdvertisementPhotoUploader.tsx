import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdvertisementPhotoUploaderProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export function AdvertisementPhotoUploader({
  photos,
  onPhotosChange,
  maxPhotos = 4,
}: AdvertisementPhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = maxPhotos - photos.length;
    if (remaining <= 0) {
      toast({
        title: "Maximum Photos Reached",
        description: `You can upload a maximum of ${maxPhotos} photos`,
        variant: "destructive",
      });
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remaining);

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast({ title: "Invalid file", description: "Only image files are allowed", variant: "destructive" });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "File too large", description: "Max file size is 2MB", variant: "destructive" });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onPhotosChange([...photos, result]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  const slots = Array.from({ length: maxPhotos }, (_, i) => i);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Product Photos ({photos.length}/{maxPhotos})
      </label>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((index) => {
          const photo = photos[index];
          if (photo) {
            return (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted"
              >
                <img
                  src={photo}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {index + 1}
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={() => removePhoto(index)}
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
                  <ImageIcon className="h-6 w-6" />
                  <span className="text-[11px] font-medium">Add Photo</span>
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
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
      <p className="text-[11px] text-muted-foreground">
        JPG, PNG or WebP • Max 2MB each
      </p>
    </div>
  );
}
