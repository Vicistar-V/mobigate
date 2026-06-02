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
import { Plus, Upload, X, Image, Lock, DollarSign, Info, ImagePlus, ChevronDown, Shield } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast }          from "@/hooks/use-toast";
import { AlbumSelector }     from "./AlbumSelector";
import { CreateAlbumDialog } from "./CreateAlbumDialog";
import { useUserAlbums, useUserProfile } from "@/hooks/useWindowData";
import { mockAlbums }        from "@/data/posts";
import { LegalCopyrightAcceptance } from "@/components/common/LegalCopyrightAcceptance";
import { CopyrightDocumentsField } from "@/components/common/CopyrightDocumentsField";
import { AudiencePrivacySelector, DEFAULT_AUDIENCE_VALUE, appendAudienceToFormData, type AudienceValue } from "@/components/common/AudiencePrivacySelector";
import { ContentFeeNotice } from "@/components/media/ContentFeeNotice";
import { NonMonetizedPostFeeNotice } from "@/components/monetization/NonMonetizedPostFeeNotice";
import { MonetizationEligibilityCard } from "@/components/monetization/MonetizationEligibilityCard";
import { checkPostMonetizationEligibility, getMonetizedPostMinFee, monetizedPostMinFeeSettings } from "@/data/monetizationPolicy";
import { MAX_IMAGES_PER_POST, EXTRA_IMAGE_FEE } from "@/data/platformSettingsData";


const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

type PostType = "Photo" | "Video" | "Audio" | "Article" | "PDF" | "URL";

const NEEDS_THUMBNAIL: PostType[] = ["Video", "Audio", "Article", "PDF", "URL"];

// Suggested fee amounts
const FEE_PRESETS = [5, 10, 20, 50, 100, 200, 500];

interface CreatePostDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  presetMediaUrl?: string;
  presetTitle?: string;
}

export const CreatePostDialog = ({
  open: openProp,
  onOpenChange,
  hideTrigger = false,
  presetMediaUrl,
  presetTitle,
}: CreatePostDialogProps = {}) => {
  const { toast }   = useToast();
  const phpAlbums   = useUserAlbums();
  const albums      = phpAlbums || mockAlbums;
  const userProfile = useUserProfile();

  // ── Monetization eligibility (admin-gated thresholds) ──
  const monetizationProfile = {
    friendsCount:   userProfile?.stats?.friends   ?? 0,
    followersCount: userProfile?.stats?.followers ?? 0,
    followingCount: userProfile?.stats?.following ?? 0,
    verified:       userProfile?.verified         ?? false,
  };
  const eligibility = checkPostMonetizationEligibility(monetizationProfile);
  const canMonetize = eligibility.eligible;


  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const setOpen = (v: boolean) => {
    if (onOpenChange) onOpenChange(v);
    else setInternalOpen(v);
  };
  const [title,            setTitle]            = useState("");
  const [subtitle,         setSubtitle]         = useState("");
  const [description,      setDescription]      = useState("");
  const [type,             setType]             = useState<PostType>("Photo");
  const [mediaFile,        setMediaFile]        = useState<File | null>(null);
  const [mediaPreview,     setMediaPreview]     = useState<string | null>(null);
  // Photo posts support multiple images (up to MAX_IMAGES_PER_POST). First entry mirrors mediaFile.
  const [photoFiles,       setPhotoFiles]       = useState<File[]>([]);
  const [photoPreviews,    setPhotoPreviews]    = useState<string[]>([]);
  const [thumbnailFile,    setThumbnailFile]    = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [selectedAlbum,    setSelectedAlbum]    = useState<string | null>(null);
  const [showNewAlbum,     setShowNewAlbum]     = useState(false);
  const [submitting,       setSubmitting]       = useState(false);
  const [progress,         setProgress]         = useState(0);
  const [legalAccepted,    setLegalAccepted]    = useState(false);
  // Copyright protection
  const [copyrightEnabled, setCopyrightEnabled] = useState(false);
  const [copyrightFile,    setCopyrightFile]    = useState<File | null>(null);
  const [copyrightMarked,  setCopyrightMarked]  = useState(true);

  // Audience privacy
  const [audience, setAudience] = useState<AudienceValue>(DEFAULT_AUDIENCE_VALUE);

  // Collapsible sections (collapsed by default to save space)
  const [monetizationOpen, setMonetizationOpen] = useState(false);
  const [audienceOpen, setAudienceOpen] = useState(false);


  // Monetization
  const [isMonetized,  setIsMonetized]  = useState(false);
  const minFee = getMonetizedPostMinFee(type);
  const maxFee = monetizedPostMinFeeSettings.absoluteMaxMobi;
  const [accessFee,    setAccessFee]    = useState(String(minFee));
  const [creatorPct,   setCreatorPct]   = useState(60);
  const [monoEligible, setMonoEligible] = useState<null | { eligible: boolean; reasons: string[] }>(null);

  // Whenever post type changes, bump the access fee up to the new minimum
  // (never downwards — respect user's existing higher value).
  useEffect(() => {
    const current = parseFloat(accessFee) || 0;
    if (current < minFee) setAccessFee(String(minFee));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // Fetch creator earning % and monetisation eligibility
  useEffect(() => {
    fetch(`${API_BASE}/settings/creator_pct.php`, { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.pct) setCreatorPct(Number(d.pct)); })
      .catch(() => {});

    fetch(`${API_BASE}/posts/check_mono.php`, { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setMonoEligible(d); })
      .catch(() => {});
  }, []);

  // Force monetization OFF when eligibility is lost
  useEffect(() => {
    if (!canMonetize && isMonetized) setIsMonetized(false);
  }, [canMonetize, isMonetized]);


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

  const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList);

    // Photo posts: support up to MAX_IMAGES_PER_POST images
    if (type === "Photo") {
      const room = MAX_IMAGES_PER_POST - photoFiles.length;
      if (room <= 0) {
        toast({
          title: `Maximum ${MAX_IMAGES_PER_POST} images per post`,
          description: "Remove an image to add a different one.",
          variant: "destructive",
        });
        if (mediaRef.current) mediaRef.current.value = "";
        return;
      }
      const accepted: File[] = [];
      for (const file of incoming.slice(0, room)) {
        if (!file.type.startsWith("image/")) {
          toast({ title: "Images only for Photo posts", description: file.name, variant: "destructive" });
          continue;
        }
        if (file.size > 20 * 1024 * 1024) {
          toast({ title: "File too large", description: `${file.name} exceeds 20 MB`, variant: "destructive" });
          continue;
        }
        accepted.push(file);
      }
      if (accepted.length === 0) {
        if (mediaRef.current) mediaRef.current.value = "";
        return;
      }
      const previews = await Promise.all(accepted.map(readAsDataUrl));
      const nextFiles = [...photoFiles, ...accepted];
      const nextPreviews = [...photoPreviews, ...previews];
      setPhotoFiles(nextFiles);
      setPhotoPreviews(nextPreviews);
      // Mirror the first file into mediaFile/mediaPreview for backwards compatibility
      setMediaFile(nextFiles[0] ?? null);
      setMediaPreview(nextPreviews[0] ?? null);
      if (incoming.length > room) {
        toast({
          title: `Only added ${room} image${room === 1 ? "" : "s"}`,
          description: `Maximum ${MAX_IMAGES_PER_POST} images per post.`,
        });
      }
      if (mediaRef.current) mediaRef.current.value = "";
      return;
    }

    // Non-photo types: keep single-file behaviour
    const file = incoming[0];
    if (file.size > 100 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 100 MB", variant: "destructive" }); return;
    }
    setMediaFile(file);
    if (file.type.startsWith("image/")) {
      const preview = await readAsDataUrl(file);
      setMediaPreview(preview);
    } else {
      setMediaPreview(null);
    }
  };

  const removePhotoAt = (idx: number) => {
    const nextFiles = photoFiles.filter((_, i) => i !== idx);
    const nextPreviews = photoPreviews.filter((_, i) => i !== idx);
    setPhotoFiles(nextFiles);
    setPhotoPreviews(nextPreviews);
    setMediaFile(nextFiles[0] ?? null);
    setMediaPreview(nextPreviews[0] ?? null);
    if (mediaRef.current) mediaRef.current.value = "";
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
    setPhotoFiles([]); setPhotoPreviews([]);
    setThumbnailFile(null); setThumbnailPreview(null);
    setSelectedAlbum(null); setProgress(0);
    setIsMonetized(false); setAccessFee(String(minFee));
    setLegalAccepted(false);
    setAudience(DEFAULT_AUDIENCE_VALUE);
    if (mediaRef.current)  mediaRef.current.value  = "";
    if (thumbRef.current)  thumbRef.current.value  = "";
  };

  const imageCount = type === "Photo" ? Math.max(1, photoFiles.length || (mediaFile ? 1 : 1)) : 1;


  const feeValue = Math.max(0, parseFloat(accessFee) || 0);
  const isValidFee = !isMonetized || (feeValue >= minFee && feeValue <= maxFee);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: "Title is required", variant: "destructive" }); return;
    }
    if (isMonetized && !isValidFee) {
      toast({ title: "Access Fee too low", description: `Minimum Access Fee for ${type} posts is ${minFee} Mobi (max ${maxFee.toLocaleString()}).`, variant: "destructive" }); return;
    }
    setSubmitting(true); setProgress(0);

    try {
      const form = new FormData();
      form.append("title",        title.trim());
      form.append("subtitle",     subtitle.trim());
      form.append("content",      description.trim());
      form.append("post_type",    type.toLowerCase());
      form.append("is_monetized", isMonetized ? "1" : "0");
      form.append("access_fee",   isMonetized ? String(feeValue) : "0");
      if (selectedAlbum) form.append("album_id", selectedAlbum);
      appendAudienceToFormData(form, audience);
      if (type === "Photo" && photoFiles.length > 0) {
        // First image is primary, remaining are extras (for backwards-compatible PHP endpoint)
        form.append("media", photoFiles[0]);
        photoFiles.forEach((f, idx) => form.append(`photos[${idx}]`, f));
        form.append("image_count", String(photoFiles.length));
      } else if (mediaFile) {
        form.append("media", mediaFile);
      }
      if (thumbnailFile) form.append("thumbnail", thumbnailFile);
      if (copyrightEnabled && copyrightFile) form.append("copyright_document", copyrightFile);
      form.append("copyright_marked", copyrightMarked ? "1" : "0");

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

      <DialogContent className="w-[calc(100vw-0.5rem)] sm:w-full sm:max-w-[620px] max-h-[92dvh] overflow-y-auto overscroll-contain px-3 py-4 sm:p-6 rounded-xl">
        <DialogHeader className="text-left space-y-1 pr-6">
          <DialogTitle className="text-base sm:text-lg leading-snug break-words">Create a Post</DialogTitle>
          <DialogDescription className="text-sm leading-snug break-words">Share your content with the community.</DialogDescription>
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
              setPhotoFiles([]); setPhotoPreviews([]);
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

          {/* Posting Fee notice — non-monetized posts use the lower per-type rate */}
          {isMonetized ? (
            <ContentFeeNotice mediaType={type} imageCount={imageCount} compact />
          ) : (
            <NonMonetizedPostFeeNotice mediaType={type} compact />
          )}


          {/* Main Media File(s) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="mb-0">
                {type === "Photo" ? "Media Files *" : `${type} File`}
              </Label>
              {type === "Photo" && (
                <span className="text-sm font-medium text-muted-foreground">
                  {photoFiles.length} of {MAX_IMAGES_PER_POST} attached
                </span>
              )}
            </div>

            {type === "Photo" ? (
              <>
                {photoPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {photoPreviews.map((src, idx) => (
                      <div key={idx} className="relative rounded-lg border overflow-hidden bg-muted aspect-square">
                        <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-7 w-7 rounded-md shadow"
                          onClick={() => removePhotoAt(idx)}
                          aria-label={`Remove image ${idx + 1}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                        <span className="absolute bottom-1 left-1 text-[10px] font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded">
                          {idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {photoFiles.length < MAX_IMAGES_PER_POST ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => mediaRef.current?.click()}
                  >
                    <ImagePlus className="h-4 w-4 mr-2" />
                    {photoFiles.length === 0 ? "Upload Photo" : "Add More Files"}
                  </Button>
                ) : (
                  <p className="text-xs text-center text-muted-foreground bg-muted/60 rounded-md py-2">
                    Maximum {MAX_IMAGES_PER_POST} images reached. Remove one to add a different image.
                  </p>
                )}

                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  Attach up to {MAX_IMAGES_PER_POST} images to one post. First image is the cover.
                  Each extra image adds <span className="font-semibold text-foreground">M{EXTRA_IMAGE_FEE}</span> to the posting fee. (Max 20 MB each)
                </p>

                <input
                  ref={mediaRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMediaChange}
                  className="hidden"
                />
              </>
            ) : (
              <>
                {mediaPreview && (
                  <div className="relative rounded-lg border overflow-hidden bg-muted">
                    <img src={mediaPreview} alt="Preview" className="w-full h-44 object-cover" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2"
                      onClick={() => { setMediaFile(null); setMediaPreview(null); if (mediaRef.current) mediaRef.current.value = ""; }}>
                      <X className="h-4 w-4" />
                    </Button>
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
              </>
            )}
          </div>


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

          {/* ── MONETIZATION SECTION (collapsible) ── */}
          <Collapsible open={monetizationOpen} onOpenChange={setMonetizationOpen} className="rounded-xl border border-border bg-card">
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 p-3 sm:p-4 text-left">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isMonetized ? "bg-amber-400" : "bg-muted"}`}>
                  {isMonetized ? <Lock className="h-5 w-5 text-white" /> : <DollarSign className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div>
                  <p className="font-semibold text-sm">Monetisation</p>
                  <p className="text-xs text-muted-foreground">
                    {isMonetized ? `Monetized · ${feeValue} Mobi to unlock` : "Tap to set up paid access"}
                  </p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${monetizationOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3 sm:px-4 sm:pb-4">
          {!canMonetize ? (
            <MonetizationEligibilityCard profile={monetizationProfile} hideWhenEligible={false} />
          ) : (
          <div className={`rounded-xl border-2 p-3 sm:p-4 transition-all ${isMonetized ? "border-amber-300 bg-amber-50" : "border-dashed border-muted"}`}>
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
                onCheckedChange={v => { if (monoEligible?.eligible !== false) setIsMonetized(v); }}
                disabled={monoEligible?.eligible === false}
              />
            </div>


            {/* Fee settings — shown when monetized */}
            {isMonetized && (
              <div className="mt-4 space-y-3">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-amber-500" />
                    Access Fee (Mobi) *
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Min {minFee} Mobi
                    </span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        min={minFee}
                        max={maxFee}
                        step="1"
                        value={accessFee}
                        onChange={e => setAccessFee(e.target.value)}
                        onBlur={() => {
                          const v = parseFloat(accessFee) || 0;
                          if (v < minFee) setAccessFee(String(minFee));
                          else if (v > maxFee) setAccessFee(String(maxFee));
                        }}
                        placeholder={`Min ${minFee}`}
                        className={`pr-16 ${!isValidFee ? "border-red-400 focus:ring-red-400" : "border-amber-300 focus:ring-amber-400"}`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-600">Mobi</span>
                    </div>
                  </div>
                  {!isValidFee ? (
                    <p className="text-xs text-red-500">
                      Access Fee for {type} posts must be at least <strong>{minFee} Mobi</strong> (max {maxFee.toLocaleString()}).
                    </p>
                  ) : (
                    <p className="text-[11px] text-amber-700/80">
                      System minimum for {type}: <strong>{minFee} Mobi</strong>. You can set this higher, but not lower.
                    </p>
                  )}

                  {/* Preset amounts — only those at or above the system minimum */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {FEE_PRESETS.filter(p => p >= minFee).map(p => (
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
                    <p>• Viewers pay <strong>{feeValue > 0 ? feeValue : '?'} Mobi</strong> Access Fee from their Wallets to unlock this Post.</p>
                    <p>• Users without sufficient balance will see a paywall and cannot access the content.</p>
                    <p>• Your post thumbnail, title and description are always visible as a preview.</p>
                    <p>• Content Creator earns about <strong>{creatorPct}%</strong> of the Access Fee ({feeValue > 0 ? Math.round(feeValue * creatorPct / 100) : '?'} Mobi per unlock).</p>
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
          )}
            </CollapsibleContent>
          </Collapsible>

          {/* Audience Privacy (collapsible) */}
          <Collapsible open={audienceOpen} onOpenChange={setAudienceOpen} className="rounded-xl border border-border bg-card">
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 p-3 sm:p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Audience Privacy</p>
                  <p className="text-xs text-muted-foreground">Choose who can see this content</p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${audienceOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3 sm:px-4 sm:pb-4">
              <AudiencePrivacySelector value={audience} onChange={setAudience} />
            </CollapsibleContent>
          </Collapsible>

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
        </div>

        {/* Legal / Copyright acceptance — required before publishing */}
        <div className="px-1 pt-1">
          <LegalCopyrightAcceptance
            accepted={legalAccepted}
            onAcceptedChange={setLegalAccepted}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2">
          <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }} disabled={submitting}
            className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !isValidFee || !legalAccepted}
            className={`w-full sm:w-auto ${isMonetized ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}`}
          >
            {submitting
              ? `Uploading ${progress}%...`
              : isMonetized
                ? `🔒 Publish for ${feeValue} Mobi`
                : "🎉 Publish Free Post"
            }
          </Button>
        </div>

      </DialogContent>

      <CreateAlbumDialog open={showNewAlbum} onOpenChange={setShowNewAlbum} onAlbumCreated={(id, name) => {
        setSelectedAlbum(id);
        toast({ title: "Album created", description: `"${name}" ready.` });
      }} />
    </Dialog>
  );
};
