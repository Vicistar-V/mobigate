import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label }    from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, X, Image } from "lucide-react";
import { useToast }          from "@/hooks/use-toast";
import { AlbumSelector }     from "./AlbumSelector";
import { CreateAlbumDialog } from "./CreateAlbumDialog";
import { useUserAlbums }     from "@/hooks/useWindowData";
import { mockAlbums }        from "@/data/posts";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

type PostType = "Photo" | "Video" | "Audio" | "Article" | "PDF" | "URL";

// Types that need a separate thumbnail (not photo itself)
const NEEDS_THUMBNAIL: PostType[] = ["Video", "Audio", "Article", "PDF", "URL"];

export const CreatePostDialog = () => {
  const { toast }   = useToast();
  const phpAlbums   = useUserAlbums();
  const albums      = phpAlbums || mockAlbums;

  const [open,             setOpen]             = useState(false);
  const [title,            setTitle]            = useState("");
  const [subtitle,         setSubtitle]         = useState("");
  const [description,      setDescription]      = useState("");
  const [type,             setType]             = useState<PostType>("Photo");
  const [mediaFile,        setMediaFile]        = useState<File | null>(null);
  const [mediaPreview,     setMediaPreview]     = useState<string | null>(null);
  const [thumbnailFile,    setThumbnailFile]    = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [selectedAlbum,    setSelectedAlbum]    = useState<string | null>(null);
  const [showNewAlbum,     setShowNewAlbum]     = useState(false);
  const [submitting,       setSubmitting]       = useState(false);
  const [progress,         setProgress]         = useState(0);

  const mediaRef     = useRef<HTMLInputElement>(null);
  const thumbRef     = useRef<HTMLInputElement>(null);

  const needsThumbnail = NEEDS_THUMBNAIL.includes(type);

  // Accept rules per type
  const mediaAccept: Record<PostType, string> = {
    Photo:   "image/*",
    Video:   "video/*",
    Audio:   "audio/*",
    Article: ".pdf,.doc,.docx,.txt",
    PDF:     ".pdf",
    URL:     "image/*",
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 100 MB", variant: "destructive" }); return;
    }
    setMediaFile(file);
    // Only show preview if it's an image
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setMediaPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null); // video/audio/pdf — no inline preview
    }
    toast({ title: "File selected", description: file.name });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Images only for thumbnail", variant: "destructive" }); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Thumbnail too large", description: "Max 5 MB", variant: "destructive" }); return;
    }
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setTitle(""); setSubtitle(""); setDescription(""); setType("Photo");
    setMediaFile(null); setMediaPreview(null);
    setThumbnailFile(null); setThumbnailPreview(null);
    setSelectedAlbum(null); setProgress(0);
    if (mediaRef.current)  mediaRef.current.value  = "";
    if (thumbRef.current)  thumbRef.current.value  = "";
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: "Title is required", variant: "destructive" }); return;
    }
    setSubmitting(true);
    setProgress(0);

    try {
      const form = new FormData();
      form.append("title",      title.trim());
      form.append("subtitle",   subtitle.trim());
      form.append("content",    description.trim());
      form.append("post_type",  type.toLowerCase());
      form.append("access_fee", "0");
      if (selectedAlbum) form.append("album_id", selectedAlbum);
      if (mediaFile)     form.append("media",    mediaFile);
      // Thumbnail: use thumbnail file if provided, else media file if it's an image
      if (thumbnailFile) {
        form.append("thumbnail", thumbnailFile);
      }

      const result = await new Promise<{ success: boolean; error?: string; post_id?: string }>(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = e => {
            if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
          };
          xhr.onload  = () => { try { resolve(JSON.parse(xhr.responseText)); } catch { reject(new Error("Invalid response")); } };
          xhr.onerror = () => reject(new Error("Network error"));
          xhr.open("POST", `${API_BASE}/posts/create.php`);
          xhr.withCredentials = true;
          xhr.send(form);
        }
      );

      if (result.success) {
        const albumName = selectedAlbum ? albums.find(a => a.id === selectedAlbum)?.name : null;
        toast({
          title: "Post published!",
          description: albumName ? `Published to "${albumName}".` : "Your post has been created.",
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
    <Dialog open={open} onOpenChange={v => { if (!v) resetForm(); setOpen(v); }}>
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
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter post title" />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Enter post subtitle (optional)" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description / Story</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Add accompanying story, description or more information about your media"
              className="min-h-[100px]" />
          </div>

          {/* Content Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Content Type</Label>
            <Select value={type} onValueChange={(v: any) => { setType(v); setMediaFile(null); setMediaPreview(null); if (mediaRef.current) mediaRef.current.value = ""; }}>
              <SelectTrigger id="type"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Photo">📷 Photo</SelectItem>
                <SelectItem value="Video">🎬 Video</SelectItem>
                <SelectItem value="Audio">🎵 Audio</SelectItem>
                <SelectItem value="Article">📝 Article</SelectItem>
                <SelectItem value="PDF">📄 PDF</SelectItem>
                <SelectItem value="URL">🔗 URL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Main Media File */}
          <div className="space-y-2">
            <Label>
              {type === "Photo" ? "Photo *" : `${type} File`}
            </Label>

            {/* Preview for images */}
            {mediaPreview && (
              <div className="relative rounded-lg border overflow-hidden bg-muted">
                <img src={mediaPreview} alt="Preview" className="w-full h-48 object-cover" />
                <Button type="button" variant="destructive" size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => { setMediaFile(null); setMediaPreview(null); if (mediaRef.current) mediaRef.current.value = ""; }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* File name for non-image uploads */}
            {mediaFile && !mediaPreview && (
              <div className="flex items-center justify-between rounded-lg border bg-muted px-3 py-2">
                <span className="text-sm truncate">{mediaFile.name}</span>
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0"
                  onClick={() => { setMediaFile(null); if (mediaRef.current) mediaRef.current.value = ""; }}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            <Button type="button" variant="outline" className="w-full"
              onClick={() => mediaRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              {mediaFile ? "Change File" : `Upload ${type} File`}
            </Button>
            <input ref={mediaRef} type="file" accept={mediaAccept[type]}
              onChange={handleMediaChange} className="hidden" />
            <p className="text-xs text-muted-foreground">
              {type === "Photo"   && "JPG, PNG, GIF, WebP — Max 20 MB"}
              {type === "Video"   && "MP4, MOV, AVI, WebM — Max 100 MB"}
              {type === "Audio"   && "MP3, WAV, OGG, M4A — Max 50 MB"}
              {type === "Article" && "PDF, DOC, DOCX, TXT — Max 20 MB"}
              {type === "PDF"     && "PDF files — Max 20 MB"}
              {type === "URL"     && "Upload a preview image for the URL"}
            </p>
          </div>

          {/* Thumbnail — shown for Video, Audio, Article, PDF, URL */}
          {needsThumbnail && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Thumbnail Image
                <span className="text-xs text-muted-foreground font-normal">(shown on post card)</span>
              </Label>

              {thumbnailPreview && (
                <div className="relative rounded-lg border overflow-hidden bg-muted">
                  <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-36 object-cover" />
                  <Button type="button" variant="destructive" size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); if (thumbRef.current) thumbRef.current.value = ""; }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Button type="button" variant="outline" className="w-full"
                onClick={() => thumbRef.current?.click()}>
                <Image className="h-4 w-4 mr-2" />
                {thumbnailFile ? "Change Thumbnail" : "Upload Thumbnail Image"}
              </Button>
              <input ref={thumbRef} type="file" accept="image/*"
                onChange={handleThumbnailChange} className="hidden" />
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WebP — Max 5 MB. This image will display on the post card.
              </p>
            </div>
          )}

          {/* Album */}
          <div className="space-y-2">
            <Label htmlFor="album">Album (Optional)</Label>
            <AlbumSelector value={selectedAlbum} onChange={setSelectedAlbum} onCreateNew={() => setShowNewAlbum(true)} />
            <p className="text-xs text-muted-foreground">Organise your post into an album</p>
          </div>

          {/* Progress bar */}
          {submitting && progress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading...</span><span>{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? `Uploading ${progress}%...` : "Publish Post"}
          </Button>
        </div>
      </DialogContent>

      <CreateAlbumDialog open={showNewAlbum} onOpenChange={setShowNewAlbum} onAlbumCreated={(id, name) => {
        setSelectedAlbum(id);
        toast({ title: "Album created", description: `"${name}" ready for your posts.` });
      }} />
    </Dialog>
  );
};
