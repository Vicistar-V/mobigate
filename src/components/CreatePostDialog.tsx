import { useState, useRef, useEffect } from "react";
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
import { Plus, Upload, X, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlbumSelector } from "./AlbumSelector";
import { CreateAlbumDialog } from "./CreateAlbumDialog";
import { useUserAlbums } from "@/hooks/useWindowData";
import { mockAlbums } from "@/data/posts";
import {
  MediaMonetizationFields,
  defaultMonetizationValue,
  type MediaMonetizationValue,
} from "@/components/media/MediaMonetizationFields";
import { ContentFeeNotice } from "@/components/media/ContentFeeNotice";
import {
  getContentPostingFee,
  getContentPostingFeeForCount,
  MAX_IMAGES_PER_POST,
} from "@/data/platformSettingsData";

interface CreatePostDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  presetMediaUrl?: string | null;
  presetTitle?: string;
}

export const CreatePostDialog = ({ open: controlledOpen, onOpenChange, hideTrigger, presetMediaUrl, presetTitle }: CreatePostDialogProps = {}) => {
  const { toast } = useToast();
  const phpAlbums = useUserAlbums();
  const albums = phpAlbums || mockAlbums;
  
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (v: boolean) => {
    if (!isControlled) setInternalOpen(v);
    onOpenChange?.(v);
  };
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"Photo" | "Video" | "Audio" | "Article" | "PDF" | "URL">("Photo");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [showNewAlbumDialog, setShowNewAlbumDialog] = useState(false);
  const [monetization, setMonetization] = useState<MediaMonetizationValue>(
    defaultMonetizationValue()
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prefill from preset media when dialog opens
  useEffect(() => {
    if (open && presetMediaUrl) {
      setMediaPreviews([presetMediaUrl]);
      setMediaFiles([]);
      setType("Photo");
      if (presetTitle) setTitle(presetTitle);
    }
  }, [open, presetMediaUrl, presetTitle]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || []);
    if (incoming.length === 0) return;

    const oversized = incoming.filter((f) => f.size > 20 * 1024 * 1024);
    if (oversized.length > 0) {
      toast({
        title: "Error",
        description: `${oversized.length} file(s) exceed the 20MB limit and were skipped`,
        variant: "destructive",
      });
    }
    let valid = incoming.filter((f) => f.size <= 20 * 1024 * 1024);
    if (valid.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Enforce 3-image maximum per Photo post
    if (type === "Photo") {
      const remainingSlots = Math.max(0, MAX_IMAGES_PER_POST - mediaPreviews.length);
      if (remainingSlots === 0) {
        toast({
          title: "Maximum reached",
          description: `Photo posts allow up to ${MAX_IMAGES_PER_POST} images. Remove one to add another.`,
          variant: "destructive",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (valid.length > remainingSlots) {
        toast({
          title: `Only ${remainingSlots} more allowed`,
          description: `Photo posts cap at ${MAX_IMAGES_PER_POST} images. Extra files were skipped.`,
          variant: "destructive",
        });
        valid = valid.slice(0, remainingSlots);
      }
    }

    setMediaFiles((prev) => [...prev, ...valid]);

    valid.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    const extraCost = type === "Photo" && mediaPreviews.length >= 1
      ? ` (+M50 per extra image)`
      : "";
    toast({
      title: valid.length > 1 ? `${valid.length} files selected` : "Media selected",
      description: valid.length > 1
        ? `Added ${valid.length} files to this post${extraCost}`
        : `${valid[0].name} ready to upload${extraCost}`,
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  const handleRemoveMediaAt = (index: number) => {
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setDescription("");
    setType("Photo");
    setMediaFiles([]);
    setMediaPreviews([]);
    setSelectedAlbum(null);
    setMonetization(defaultMonetizationValue());
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAlbumCreated = (albumId: string, albumName: string) => {
    setSelectedAlbum(albumId);
    toast({
      title: "Album created",
      description: `"${albumName}" is now ready for your posts.`,
    });
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    const albumName = selectedAlbum
      ? albums.find(a => a.id === selectedAlbum)?.name
      : null;

    const fee = getContentPostingFeeForCount(type, mediaPreviews.length);

    toast({
      title: `M${fee.toLocaleString()} debited from Mobi Wallet`,
      description: albumName
        ? `Post published to "${albumName}". Content fee M${fee.toLocaleString()} (non-refundable).`
        : `Your monetized post is live. Content fee M${fee.toLocaleString()} (non-refundable).`,
    });


    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
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
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Monetized Post</DialogTitle>
          <DialogDescription>
            Share your content and start earning from views and engagement.
          </DialogDescription>
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

          {/* Content posting fee notice based on selected media type */}
          <ContentFeeNotice mediaType={type} />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Media Files</Label>
              {mediaPreviews.length > 0 && (
                <span className="text-[11px] text-muted-foreground">
                  {mediaPreviews.length} file{mediaPreviews.length === 1 ? "" : "s"} attached
                </span>
              )}
            </div>

            {/* Multi-file preview grid */}
            {mediaPreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {mediaPreviews.map((src, idx) => (
                  <div
                    key={`${idx}-${src.slice(0, 24)}`}
                    className="relative rounded-lg border overflow-hidden bg-muted aspect-square"
                  >
                    <img
                      src={src}
                      alt={`Media preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => handleRemoveMediaAt(idx)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
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
                {mediaPreviews.length > 0 ? (
                  <>
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Add More Files
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Media
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="text-base text-muted-foreground">
              Attach multiple images or files to one post. Supported: Images, Videos, Audio, PDF (Max 20MB each)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="album">Album (Optional)</Label>
            <AlbumSelector
              value={selectedAlbum}
              onChange={setSelectedAlbum}
              onCreateNew={() => setShowNewAlbumDialog(true)}
            />
            <p className="text-base text-muted-foreground">
              Organize your post into an album for better management
            </p>
          </div>

          <MediaMonetizationFields
            value={monetization}
            onChange={setMonetization}
            hideAudio={type === "Video"}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => {
            resetForm();
            setOpen(false);
          }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Publish • Pay M{getContentPostingFee(type).toLocaleString()}
          </Button>
        </div>
      </DialogContent>
      
      <CreateAlbumDialog
        open={showNewAlbumDialog}
        onOpenChange={setShowNewAlbumDialog}
        onAlbumCreated={handleAlbumCreated}
      />
    </Dialog>
  );
};
