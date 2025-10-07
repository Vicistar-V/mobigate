import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, X, User } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string;
  onChange: (imageData: string | undefined) => void;
  type?: "avatar" | "logo";
  placeholder?: string;
}

export const ImageUploader = ({ value, onChange, type = "avatar", placeholder }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onChange(base64String);
      toast.success("Image uploaded successfully");
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange(undefined);
    toast.success("Image removed");
  };

  if (type === "avatar") {
    return (
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={preview} alt="Profile" />
          <AvatarFallback>
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        <div className="flex gap-2">
          <label htmlFor="image-upload">
            <Button type="button" size="sm" variant="outline" asChild>
              <span className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </span>
            </Button>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {preview && (
            <Button type="button" size="sm" variant="ghost" onClick={handleRemove}>
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Logo type
  return (
    <div className="space-y-2">
      {preview ? (
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded border flex items-center justify-center overflow-hidden bg-background">
            <img src={preview} alt="Logo" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="flex gap-2">
            <label htmlFor="logo-upload">
              <Button type="button" size="sm" variant="outline" asChild>
                <span className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Change
                </span>
              </Button>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <Button type="button" size="sm" variant="ghost" onClick={handleRemove}>
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <label htmlFor="logo-upload">
          <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
            <div className="flex flex-col items-center gap-2 text-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{placeholder || "Upload Logo"}</p>
                <p className="text-xs text-muted-foreground">Max 2MB, PNG, JPG, WEBP</p>
              </div>
            </div>
          </div>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
};
