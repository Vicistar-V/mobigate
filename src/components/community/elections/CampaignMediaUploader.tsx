import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Image as ImageIcon,
  X,
  Plus,
  Star,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CampaignImage {
  id: string;
  file?: File;
  preview: string;
  type: "banner" | "profile" | "artwork";
  isPrimary?: boolean;
}

interface CampaignMediaUploaderProps {
  onImagesChange?: (images: CampaignImage[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export function CampaignMediaUploader({
  onImagesChange,
  maxImages = 6,
  maxSizeMB = 2,
}: CampaignMediaUploaderProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<CampaignImage[]>([]);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const artworkInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: CampaignImage["type"]
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, WebP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      toast({
        title: "File Too Large",
        description: `Maximum file size is ${maxSizeMB}MB. Your file is ${sizeMB.toFixed(1)}MB`,
        variant: "destructive",
      });
      return;
    }

    // Check max images for artwork
    if (type === "artwork" && images.filter(i => i.type === "artwork").length >= 4) {
      toast({
        title: "Maximum Reached",
        description: "You can upload up to 4 promotional artworks",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);

    // For banner and profile, replace existing
    let newImages: CampaignImage[];
    if (type === "banner" || type === "profile") {
      newImages = [
        ...images.filter(i => i.type !== type),
        { id: `${type}-${Date.now()}`, file, preview, type },
      ];
    } else {
      newImages = [
        ...images,
        { 
          id: `artwork-${Date.now()}`, 
          file, 
          preview, 
          type,
          isPrimary: images.filter(i => i.type === "artwork").length === 0,
        },
      ];
    }

    setImages(newImages);
    onImagesChange?.(newImages);

    // Reset input
    event.target.value = "";
  };

  const handleRemoveImage = (imageId: string) => {
    const imageToRemove = images.find(i => i.id === imageId);
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    let newImages = images.filter(i => i.id !== imageId);
    
    // If removed image was primary, make first artwork primary
    if (imageToRemove?.isPrimary && imageToRemove.type === "artwork") {
      const firstArtwork = newImages.find(i => i.type === "artwork");
      if (firstArtwork) {
        newImages = newImages.map(i => 
          i.id === firstArtwork.id ? { ...i, isPrimary: true } : i
        );
      }
    }

    setImages(newImages);
    onImagesChange?.(newImages);
  };

  const handleSetPrimary = (imageId: string) => {
    const newImages = images.map(i => ({
      ...i,
      isPrimary: i.type === "artwork" ? i.id === imageId : i.isPrimary,
    }));
    setImages(newImages);
    onImagesChange?.(newImages);
  };

  const bannerImage = images.find(i => i.type === "banner");
  const profileImage = images.find(i => i.type === "profile");
  const artworkImages = images.filter(i => i.type === "artwork");

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Campaign Media</Label>

      {/* Banner Upload */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Campaign Banner (Required)</p>
        {bannerImage ? (
          <div className="relative rounded-lg overflow-hidden aspect-[16/9] bg-muted">
            <img
              src={bannerImage.preview}
              alt="Campaign banner"
              className="w-full h-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={() => handleRemoveImage(bannerImage.id)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Badge className="absolute bottom-2 left-2 text-xs">Banner</Badge>
          </div>
        ) : (
          <Card
            className="border-dashed cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => bannerInputRef.current?.click()}
          >
            <CardContent className="p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium mt-2">Upload Banner</p>
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: 1200 x 675 (16:9)
              </p>
            </CardContent>
          </Card>
        )}
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, "banner")}
        />
      </div>

      {/* Profile Photo Upload */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Profile Photo (Required)</p>
        <div className="flex items-center gap-4">
          {profileImage ? (
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                <img
                  src={profileImage.preview}
                  alt="Profile photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-1 -right-1 h-6 w-6"
                onClick={() => handleRemoveImage(profileImage.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div
              className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => profileInputRef.current?.click()}
            >
              <div className="text-center">
                <ImageIcon className="h-6 w-6 mx-auto text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Photo</span>
              </div>
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">Candidate Photo</p>
            <p className="text-xs text-muted-foreground">
              Square format, min 200x200px
            </p>
          </div>
        </div>
        <input
          ref={profileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, "profile")}
        />
      </div>

      {/* Promotional Artwork Gallery */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Promotional Artwork (Optional, up to 4)
          </p>
          <span className="text-xs text-muted-foreground">
            {artworkImages.length}/4
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {artworkImages.map((artwork) => (
            <div key={artwork.id} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={artwork.preview}
                alt="Campaign artwork"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleSetPrimary(artwork.id)}
                  disabled={artwork.isPrimary}
                >
                  <Star className={`h-4 w-4 ${artwork.isPrimary ? "fill-yellow-500 text-yellow-500" : ""}`} />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemoveImage(artwork.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {artwork.isPrimary && (
                <Badge className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 bg-yellow-500">
                  <Star className="h-3 w-3 mr-0.5 fill-white" />
                  Primary
                </Badge>
              )}
            </div>
          ))}
          
          {artworkImages.length < 4 && (
            <div
              className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => artworkInputRef.current?.click()}
            >
              <div className="text-center">
                <Plus className="h-6 w-6 mx-auto text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add More</span>
              </div>
            </div>
          )}
        </div>
        <input
          ref={artworkInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, "artwork")}
        />
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
        <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          All images must be under {maxSizeMB}MB. Supported formats: JPG, PNG, WebP.
          The primary artwork will be displayed on campaign cards.
        </p>
      </div>
    </div>
  );
}
