import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlbumSelector } from "./AlbumSelector";
import { CreateAlbumDialog } from "./CreateAlbumDialog";
import { useUserAlbums } from "@/hooks/useWindowData";
import { mockAlbums } from "@/data/posts";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "https://angola-press.com/en/api";

export const CreatePostDialog = () => {
  const { toast } = useToast();
  const phpAlbums = useUserAlbums();
  const albums = phpAlbums || mockAlbums;

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"Photo" | "Video" | "Audio" | "Article" | "PDF" | "URL">("Photo");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [showNewAlbumDialog, setShowNewAlbumDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast({ title: "Error", description: "File size must be less than 20MB", variant: "destructive" });
        return;
      }
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setMediaPreview(reader.result as string);
      reader.readAsDataURL(file);
      toast({ title: "Media selected", description: `${file.name} ready to upload` });
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setDescription("");
    setType("Photo");
    setMediaFile(null);
    setMediaPreview(null);
    setSelectedAlbum(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAlbumCreated = (albumId: string, albumName: string) => {
    setSelectedAlbum(albumId);
    toast({ title: "Album created", description: `"${albumName}" is now ready for your posts.` });
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("title",      title.trim());
      form.append("subtitle",   subtitle.trim());
      form.append("content",    description.trim());
      form.append("post_type",  type.toLowerCase());
      form.append("access_fee", "0");
      if (selectedAlbum) form.append("album_id", selectedAlbum);
      if (mediaFile)     form.append("media",    mediaFile);

      const xhr = new XMLHttpRequest();

      const result = await new Promise<{ success: boolean; error?: string }>((resolve, reject) => {
        xhr.onload  = () => { try { resolve(JSON.parse(xhr.responseText)); } catch { reject(new Error("Invalid response")); } };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.open("POST", `${API_BASE}/posts/create.php`);
        xhr.withCredentials = true;
        xhr.send(form);
      });

      if (result.success) {
        const albumName = selectedAlbum ? albums.find(a => a.id === selectedAlbum)?.name : null;
        toast({
          title: "Post published!",
          description: albumName ? `Your post has been published to "${albumName}".` : "Your monetized post has been created.",
        });
        resetForm();
        setOpen(false);
        window.dispatchEvent(new CustomEvent("postCreated"));
      } else {
        toast({ title: "Error", description: result.error || "Could not publish post.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Upload failed.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
      <DialogTrigger asChild>
        <button className="w-full p-3 sm:p-5 bg-card border-2 border-success/30 rounded-lg shadow-sm hover:shadow-md hover:border-success/50 transition-all cursor-pointer group">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                Create a Monetized Status Post
              </p>
              <p className="text-xs sm:text-base text-muted-foreground mt-0.5 sm:mt-1 truncate">
                Share your thoughts and earn
              </p>
            </div>
            <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:scale-110 transition-transform shrink-0" />
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Monetized Post</DialogTitle>
          <DialogDescription>Share your content and start earning from views and engagement.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter post title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Enter post subtitle (optional)" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description / Story</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add accompanying story, description or more information about your media" className="min-h-[120px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Content Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger id="type"><SelectValue /></SelectTrigger>
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
            {mediaPreview && (
              <div className="relative rounded-lg border overflow-hidden bg-muted">
                <img src={mediaPreview} alt="Media preview" className="w-full h-48 object-cover" />
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={handleRemoveMedia}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                {mediaPreview ? "Change Media" : "Upload Media"}
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*,video/*,audio/*,.pdf" onChange={handleFileChange} className="hidden" />
            </div>
            <p className="text-base text-muted-foreground">Supported formats: Images, Videos, Audio, PDF (Max 20MB)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="album">Album (Optional)</Label>
            <AlbumSelector value={selectedAlbum} onChange={setSelectedAlbum} onCreateNew={() => setShowNewAlbumDialog(true)} />
            <p className="text-base text-muted-foreground">Organize your post into an album for better management</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Publishing..." : "Publish Post"}
          </Button>
        </div>
      </DialogContent>

      <CreateAlbumDialog open={showNewAlbumDialog} onOpenChange={setShowNewAlbumDialog} onAlbumCreated={handleAlbumCreated} />
    </Dialog>
  );
};
