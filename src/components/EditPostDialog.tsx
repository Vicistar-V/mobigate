import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/data/posts";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface EditPostDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedPost: Post) => void;
}

export const EditPostDialog = ({
  post,
  open,
  onOpenChange,
  onSave,
}: EditPostDialogProps) => {
  const [title, setTitle] = useState(post.title);
  const [subtitle, setSubtitle] = useState(post.subtitle || "");
  const [description, setDescription] = useState(post.description || "");
  const [type, setType] = useState(post.type);
  const [imageUrl, setImageUrl] = useState(post.imageUrl || "");
  const [newMediaFile, setNewMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewMediaFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Media selected",
        description: `${file.name} ready to upload`,
      });
    }
  };

  const handleRemoveMedia = () => {
    setNewMediaFile(null);
    setMediaPreview(null);
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would upload the newMediaFile to storage here
    // and get back the URL to save in the post
    const finalImageUrl = mediaPreview || imageUrl;

    const updatedPost: Post = {
      ...post,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      description: description.trim() || undefined,
      type,
      imageUrl: finalImageUrl || undefined,
    };

    onSave(updatedPost);
    toast({
      title: "Success",
      description: "Post updated successfully",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Enter post subtitle (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description / Story</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add accompanying story, description or more information about your media"
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Content Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Photo">Photo</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
                <SelectItem value="Audio">Audio</SelectItem>
                <SelectItem value="Article">Article</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="URL">URL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Media File</Label>
            
            {/* Current or New Media Preview */}
            {(mediaPreview || imageUrl) && (
              <div className="relative rounded-lg border overflow-hidden bg-muted">
                <img 
                  src={mediaPreview || imageUrl} 
                  alt="Media preview" 
                  className="w-full h-48 object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveMedia}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {mediaPreview || imageUrl ? "Change Media" : "Upload Media"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="text-base text-muted-foreground">
              Supported formats: Images, Videos, Audio, PDF (Max 20MB)
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
