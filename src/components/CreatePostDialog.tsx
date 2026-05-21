import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label }    from "@/components/ui/label";
import { Switch }   from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
<<<<<<< Updated upstream
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
=======
import { Plus, Upload, X, Image, Lock, DollarSign, Info } from "lucide-react";
import { useToast }          from "@/hooks/use-toast";
import { AlbumSelector }     from "./AlbumSelector";
import { CreateAlbumDialog } from "./CreateAlbumDialog";
import { useUserAlbums }     from "@/hooks/useWindowData";
import { mockAlbums }        from "@/data/posts";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

type PostType = "Photo" | "Video" | "Audio" | "Article" | "PDF" | "URL";

const NEEDS_THUMBNAIL: PostType[] = ["Video", "Audio", "Article", "PDF", "URL"];

// Suggested fee amounts
const FEE_PRESETS = [5, 10, 20, 50, 100, 200, 500];

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

  // Monetization
  const [isMonetized, setIsMonetized] = useState(false);
  const [accessFee,   setAccessFee]   = useState("10");

  const mediaRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const needsThumbnail = NEEDS_THUMBNAIL.includes(type);

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
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setMediaPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null);
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream

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
=======
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
    setIsMonetized(false); setAccessFee("10");
    if (mediaRef.current)  mediaRef.current.value  = "";
    if (thumbRef.current)  thumbRef.current.value  = "";
>>>>>>> Stashed changes
  };

  const feeValue = Math.max(0, parseFloat(accessFee) || 0);
  const isValidFee = !isMonetized || (feeValue > 0 && feeValue <= 10000);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: "Title is required", variant: "destructive" }); return;
    }
    if (isMonetized && !isValidFee) {
      toast({ title: "Invalid fee", description: "Fee must be between 1 and 10,000 Mobi", variant: "destructive" }); return;
    }
    setSubmitting(true); setProgress(0);

<<<<<<< Updated upstream
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
=======
    try {
      const form = new FormData();
      form.append("title",        title.trim());
      form.append("subtitle",     subtitle.trim());
      form.append("content",      description.trim());
      form.append("post_type",    type.toLowerCase());
      form.append("is_monetized", isMonetized ? "1" : "0");
      form.append("access_fee",   isMonetized ? String(feeValue) : "0");
      if (selectedAlbum) form.append("album_id", selectedAlbum);
      if (mediaFile)     form.append("media",    mediaFile);
      if (thumbnailFile) form.append("thumbnail", thumbnailFile);

      const result = await new Promise<{ success: boolean; error?: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = e => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload  = () => { try { resolve(JSON.parse(xhr.responseText)); } catch { reject(new Error("Invalid response")); } };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.open("POST", `${API_BASE}/posts/create.php`);
        xhr.withCredentials = true;
        xhr.send(form);
      });

      if (result.success) {
        const albumName = selectedAlbum ? albums.find(a => a.id === selectedAlbum)?.name : null;
        toast({
          title: isMonetized ? `Post published 🔒 — ${feeValue} Mobi to unlock` : "Post published! 🎉",
          description: albumName ? `Added to "${albumName}".` : undefined,
        });
        resetForm(); setOpen(false);
        window.dispatchEvent(new CustomEvent("postCreated"));
      } else {
        toast({ title: "Error", description: result.error || "Could not publish.", variant: "destructive" });
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

      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
>>>>>>> Stashed changes
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
          <DialogDescription>Share your content with the community.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter post title" />
          </div>

          {/* Subtitle */}
          <div className="space-y-1.5">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Optional subtitle" />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description / Story</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Add a description, story or more information..." className="min-h-[80px]" />
          </div>

          {/* Content Type */}
          <div className="space-y-1.5">
            <Label>Content Type</Label>
            <Select value={type} onValueChange={(v: any) => {
              setType(v); setMediaFile(null); setMediaPreview(null);
              if (mediaRef.current) mediaRef.current.value = "";
            }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
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

<<<<<<< Updated upstream
          {/* Content posting fee notice based on selected media type + image count */}
          <ContentFeeNotice
            mediaType={type}
            imageCount={type === "Photo" ? Math.max(1, mediaPreviews.length) : 1}
          />


          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Media Files</Label>
              {mediaPreviews.length > 0 && (
                <span className="text-[11px] text-muted-foreground">
                  {mediaPreviews.length}
                  {type === "Photo" ? ` / ${MAX_IMAGES_PER_POST}` : ""} file
                  {mediaPreviews.length === 1 ? "" : "s"} attached
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
=======
          {/* Main Media File */}
          <div className="space-y-1.5">
            <Label>{type === "Photo" ? "Photo *" : `${type} File`}</Label>
            {mediaPreview && (
              <div className="relative rounded-lg border overflow-hidden bg-muted">
                <img src={mediaPreview} alt="Preview" className="w-full h-44 object-cover" />
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2"
                  onClick={() => { setMediaFile(null); setMediaPreview(null); if (mediaRef.current) mediaRef.current.value = ""; }}>
                  <X className="h-4 w-4" />
                </Button>
>>>>>>> Stashed changes
              </div>
            )}
            {mediaFile && !mediaPreview && (
              <div className="flex items-center justify-between rounded-lg border bg-muted px-3 py-2">
                <span className="text-sm truncate">{mediaFile.name}</span>
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0"
                  onClick={() => { setMediaFile(null); if (mediaRef.current) mediaRef.current.value = ""; }}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <Button type="button" variant="outline" className="w-full" onClick={() => mediaRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />{mediaFile ? "Change File" : `Upload ${type} File`}
            </Button>
            <input ref={mediaRef} type="file" accept={mediaAccept[type]} onChange={handleMediaChange} className="hidden" />
          </div>

<<<<<<< Updated upstream
            {/* Upload Button */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={type === "Photo" && mediaPreviews.length >= MAX_IMAGES_PER_POST}
                onClick={() => fileInputRef.current?.click()}
              >
                {mediaPreviews.length > 0 ? (
                  <>
                    <ImagePlus className="h-4 w-4 mr-2" />
                    {type === "Photo" && mediaPreviews.length >= MAX_IMAGES_PER_POST
                      ? `Maximum ${MAX_IMAGES_PER_POST} images reached`
                      : `Add More Files${type === "Photo" ? ` (+M50 each, up to ${MAX_IMAGES_PER_POST})` : ""}`}
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
                multiple={type !== "Photo" || mediaPreviews.length + 1 < MAX_IMAGES_PER_POST}
                accept={type === "Photo" ? "image/*" : "image/*,video/*,audio/*,.pdf"}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="text-base text-muted-foreground">
              {type === "Photo"
                ? `Up to ${MAX_IMAGES_PER_POST} images per Photo post. 1st image M200, +M50 for each extra image (Max 20MB each).`
                : "Attach multiple images or files to one post. Supported: Images, Videos, Audio, PDF (Max 20MB each)"}
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
=======
          {/* Thumbnail for non-photo types */}
          {needsThumbnail && (
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2">
                <Image className="h-4 w-4" />Thumbnail Image
                <span className="text-xs text-muted-foreground font-normal">(shown on post card)</span>
              </Label>
              {thumbnailPreview && (
                <div className="relative rounded-lg border overflow-hidden bg-muted">
                  <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-32 object-cover" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2"
                    onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); if (thumbRef.current) thumbRef.current.value = ""; }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Button type="button" variant="outline" className="w-full" onClick={() => thumbRef.current?.click()}>
                <Image className="h-4 w-4 mr-2" />{thumbnailFile ? "Change Thumbnail" : "Upload Thumbnail Image"}
              </Button>
              <input ref={thumbRef} type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
            </div>
          )}

          {/* ── MONETIZATION SECTION ── */}
          <div className={`rounded-xl border-2 p-4 transition-all ${isMonetized ? "border-amber-300 bg-amber-50" : "border-dashed border-muted"}`}>
            {/* Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isMonetized ? "bg-amber-400" : "bg-muted"}`}>
                  {isMonetized ? <Lock className="h-5 w-5 text-white" /> : <DollarSign className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div>
                  <p className="font-semibold text-sm">Monetize this post</p>
                  <p className="text-xs text-muted-foreground">Charge viewers Mobi to access your content</p>
                </div>
              </div>
              <Switch
                checked={isMonetized}
                onCheckedChange={setIsMonetized}
              />
            </div>

            {/* Fee settings — shown when monetized */}
            {isMonetized && (
              <div className="mt-4 space-y-3">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-amber-500" />
                    Access Fee (Mobi) *
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        min="1"
                        max="10000"
                        step="1"
                        value={accessFee}
                        onChange={e => setAccessFee(e.target.value)}
                        placeholder="e.g. 50"
                        className={`pr-16 ${!isValidFee ? "border-red-400 focus:ring-red-400" : "border-amber-300 focus:ring-amber-400"}`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-600">Mobi</span>
                    </div>
                  </div>
                  {!isValidFee && (
                    <p className="text-xs text-red-500">Fee must be between 1 and 10,000 Mobi</p>
                  )}

                  {/* Preset amounts */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {FEE_PRESETS.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setAccessFee(String(p))}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          accessFee === String(p)
                            ? "bg-amber-500 text-white"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        {p} Mobi
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info box */}
                <div className="flex gap-2 bg-amber-100/70 rounded-lg p-3">
                  <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800 space-y-1">
                    <p className="font-semibold">How monetization works:</p>
                    <p>• Viewers pay <strong>{feeValue > 0 ? feeValue : '?'} Mobi</strong> from their wallet to unlock this post.</p>
                    <p>• Users without sufficient balance will see a paywall and cannot access the content.</p>
                    <p>• Your post thumbnail, title and description are always visible as a preview.</p>
                    <p>• You keep <strong>100%</strong> of the Mobi earned.</p>
                  </div>
                </div>
              </div>
            )}

            {!isMonetized && (
              <p className="text-xs text-muted-foreground mt-3">
                🆓 Post will be <strong>free</strong> — anyone can view it without paying.
              </p>
            )}
          </div>

          {/* Album */}
          <div className="space-y-1.5">
            <Label>Album (Optional)</Label>
            <AlbumSelector value={selectedAlbum} onChange={setSelectedAlbum} onCreateNew={() => setShowNewAlbum(true)} />
          </div>

          {/* Progress */}
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
>>>>>>> Stashed changes
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }} disabled={submitting}>
            Cancel
          </Button>
<<<<<<< Updated upstream
          <Button onClick={handleSubmit}>
            Publish • Pay M{getContentPostingFeeForCount(type, mediaPreviews.length).toLocaleString()}
          </Button>

=======
          <Button
            onClick={handleSubmit}
            disabled={submitting || !isValidFee}
            className={isMonetized ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
          >
            {submitting
              ? `Uploading ${progress}%...`
              : isMonetized
                ? `🔒 Publish for ${feeValue} Mobi`
                : "🎉 Publish Free Post"
            }
          </Button>
>>>>>>> Stashed changes
        </div>
      </DialogContent>

      <CreateAlbumDialog open={showNewAlbum} onOpenChange={setShowNewAlbum} onAlbumCreated={(id, name) => {
        setSelectedAlbum(id);
        toast({ title: "Album created", description: `"${name}" ready.` });
      }} />
    </Dialog>
  );
};
