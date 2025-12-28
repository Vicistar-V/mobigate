import { useState } from "react";
import { X, Upload, Image, Video, FileText, Music } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface CreateCommunityContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const contentTypes = [
  { value: "photo", label: "Photo", icon: Image },
  { value: "video", label: "Video", icon: Video },
  { value: "document", label: "Document", icon: FileText },
  { value: "audio", label: "Audio", icon: Music },
];

export function CreateCommunityContentDialog({ 
  open, 
  onOpenChange 
}: CreateCommunityContentDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState("photo");
  const [mediaPreview, setMediaPreview] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 50MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setDescription("");
    setContentType("photo");
    setMediaPreview("");
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your content",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Content Created!",
      description: "Your monetized content has been published",
    });
    resetForm();
    onOpenChange(false);
  };

  const getAcceptedFileTypes = () => {
    switch (contentType) {
      case "video": return "video/*";
      case "audio": return "audio/*";
      case "document": return ".pdf,.doc,.docx,.txt";
      case "photo":
      default: return "image/*";
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] flex flex-col touch-auto overflow-hidden">
        <DrawerHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-lg font-bold">Create Monetized Content</DrawerTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 max-h-[calc(90vh-140px)] min-h-0 touch-auto">
          <div className="p-4 space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter content title..."
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Subtitle</Label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Optional subtitle..."
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your content..."
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Content Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Media Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Upload Media</Label>
              {mediaPreview ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  {contentType === "audio" ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <audio controls className="w-full max-w-[90%]">
                        <source src={mediaPreview} />
                      </audio>
                    </div>
                  ) : contentType === "document" ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-16 w-16 text-muted-foreground" />
                    </div>
                  ) : (
                    <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setMediaPreview("")}
                    className="absolute top-2 right-2 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/30">
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">
                    Click to upload {contentTypes.find(t => t.value === contentType)?.label.toLowerCase()}
                  </span>
                  <input
                    type="file"
                    accept={getAcceptedFileTypes()}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Pricing Note */}
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <p className="text-xs text-amber-600 dark:text-amber-400">
                💰 This content will be monetized. Set your pricing in the next step after publishing.
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-background space-y-2">
          <Button onClick={handleSubmit} className="w-full">
            Publish Monetized Content
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
