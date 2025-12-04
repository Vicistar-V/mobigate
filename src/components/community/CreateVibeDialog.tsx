import { useState } from "react";
import { X, Upload, Eye, Edit, Trash2, Send } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import type { VibeItem } from "@/data/communityVibesData";

interface CreateVibeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVibeCreated?: (vibe: VibeItem) => void;
}

export function CreateVibeDialog({ open, onOpenChange, onVibeCreated }: CreateVibeDialogProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState<VibeItem["mediaType"]>("photo");
  const [spotlight, setSpotlight] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaPreview("");
    setMediaFile(null);
  };

  const handlePreview = () => {
    if (!title || !description) {
      toast.error("Please fill in title and description");
      return;
    }
    setIsPreviewMode(true);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMediaType("photo");
    setSpotlight(false);
    setMediaPreview("");
    setMediaFile(null);
    setIsPreviewMode(false);
  };

  const handlePublish = () => {
    if (!title || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newVibe: VibeItem = {
      id: `vibe-${Date.now()}`,
      title,
      description,
      mediaType,
      mediaUrl: mediaPreview || undefined,
      thumbnail: mediaPreview || undefined,
      spotlight,
      date: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      author: "Current User",
      authorProfileImage: "/placeholder.svg",
      authorId: "current-user"
    };

    onVibeCreated?.(newVibe);
    toast.success("Vibe published successfully!");
    resetForm();
    onOpenChange(false);
  };

  const getMediaTypeDisplay = (type: VibeItem["mediaType"]) => {
    const map = { video: "Video", photo: "Photo", audio: "Audio/Sound", gallery: "Gallery" };
    return map[type];
  };

  const getAcceptedFileTypes = () => {
    switch (mediaType) {
      case "video": return "video/*";
      case "audio": return "audio/*";
      case "photo":
      case "gallery": return "image/*";
      default: return "*/*";
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-lg font-bold">Create Community Vibe</DrawerTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 max-h-[calc(90vh-140px)]">
          {!isPreviewMode ? (
            <div className="p-4 space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter vibe title..."
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share your emotions and vibes..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Media Type */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Media Type</Label>
                <Select value={mediaType} onValueChange={(val) => setMediaType(val as VibeItem["mediaType"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photo">Photo</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio/Sound</SelectItem>
                    <SelectItem value="gallery">Gallery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Spotlight Toggle */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-sm font-semibold">Spotlight Vibe</Label>
                  <p className="text-xs text-muted-foreground">Feature this vibe prominently</p>
                </div>
                <Switch checked={spotlight} onCheckedChange={setSpotlight} />
              </div>

              {/* Media Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Upload Media (Optional)</Label>
                {mediaPreview ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    {mediaType === "audio" ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <audio controls className="w-full max-w-[90%]">
                          <source src={mediaPreview} />
                        </audio>
                      </div>
                    ) : (
                      <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={removeMedia}
                      className="absolute top-2 right-2 h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/30">
                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">
                      Click to upload {getMediaTypeDisplay(mediaType).toLowerCase()}
                    </span>
                    <input
                      type="file"
                      accept={getAcceptedFileTypes()}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          ) : (
            /* Preview Mode */
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Preview</h3>
                <Button variant="outline" size="sm" onClick={() => setIsPreviewMode(false)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>

              <Card className="border-2 overflow-hidden">
                {mediaPreview && (
                  <div className="aspect-video relative bg-muted">
                    {mediaType === "audio" ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <audio controls className="w-full max-w-[90%]">
                          <source src={mediaPreview} />
                        </audio>
                      </div>
                    ) : (
                      <img src={mediaPreview} alt={title} className="w-full h-full object-cover" />
                    )}
                    {spotlight && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium">
                          SPOTLIGHT
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold">{title}</h4>
                    <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary capitalize">
                      {getMediaTypeDisplay(mediaType)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </Card>
            </div>
          )}
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-background space-y-2">
          {!isPreviewMode ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handlePreview} disabled={!title || !description}>
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
              <Button onClick={handlePublish} disabled={!title || !description} className="w-full">
                <Send className="w-4 h-4 mr-1" />
                Publish Vibe
              </Button>
            </>
          ) : (
            <Button onClick={handlePublish} className="w-full">
              <Send className="w-4 h-4 mr-1" />
              Publish Vibe
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
