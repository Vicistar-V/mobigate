// WallBannerEditDialog — add/edit slides.
// • Edit mode: works on a single existing slide.
// • Add mode: accepts ONE OR MANY files. When >1 file is chosen the dialog
//   switches to "Bulk add" — shared settings (caption template, click action,
//   duration, schedule, sponsored) are applied to all new slides at once.

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Images } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  WallBannerLinkAction,
  WallBannerMediaType,
  WallBannerSlide,
} from "@/types/wallBanner";
import {
  bulkInsertSlides,
  newSlideId,
  upsertSlide,
} from "@/lib/wallBannerStorage";

interface WallBannerEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerId: string;
  scope: "profile" | "home";
  initial?: WallBannerSlide | null;
  /** When true, the file input opens in multi-select mode. */
  bulkMode?: boolean;
}

const DEFAULT_DURATION = 6;
const MAX_BYTES = 20 * 1024 * 1024;

interface PendingItem {
  url: string;
  mediaType: WallBannerMediaType;
  name: string;
}

export function WallBannerEditDialog({
  open,
  onOpenChange,
  ownerId,
  scope,
  initial,
  bulkMode = false,
}: WallBannerEditDialogProps) {
  const { toast } = useToast();
  const isEdit = !!initial;

  // Single slide state (used for edit + single-file add)
  const [mediaType, setMediaType] = useState<WallBannerMediaType>("photo");
  const [mediaUrl, setMediaUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [linkAction, setLinkAction] = useState<WallBannerLinkAction>("viewer");
  const [linkValue, setLinkValue] = useState("");
  const [displaySeconds, setDisplaySeconds] = useState<number>(DEFAULT_DURATION);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sponsored, setSponsored] = useState(false);
  const [sponsorLabel, setSponsorLabel] = useState("");

  // Bulk add state — list of pending uploads
  const [pending, setPending] = useState<PendingItem[]>([]);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setMediaType(initial.mediaType);
      setMediaUrl(initial.mediaUrl);
      setPosterUrl(initial.posterUrl || "");
      setCaption(initial.caption || "");
      setLinkAction(initial.linkAction);
      setLinkValue(initial.linkValue || "");
      setDisplaySeconds(initial.displaySeconds || DEFAULT_DURATION);
      setStartDate(initial.startDate || "");
      setEndDate(initial.endDate || "");
      setSponsored(!!initial.sponsored);
      setSponsorLabel(initial.sponsorLabel || "");
      setPending([]);
    } else {
      setMediaType("photo");
      setMediaUrl("");
      setPosterUrl("");
      setCaption("");
      setLinkAction("viewer");
      setLinkValue("");
      setDisplaySeconds(DEFAULT_DURATION);
      setStartDate("");
      setEndDate("");
      setSponsored(false);
      setSponsorLabel("");
      setPending([]);
    }
  }, [open, initial]);

  // Toggle between single-file and bulk based on `pending` count when adding
  const inBulk = !isEdit && pending.length > 1;

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Edit mode → only first file replaces the current media
    if (isEdit) {
      const file = files[0];
      if (file.size > MAX_BYTES) {
        toast({
          title: "File too large",
          description: "Maximum size is 20MB.",
          variant: "destructive",
        });
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
        setMediaType(file.type.startsWith("video/") ? "video" : "photo");
      };
      reader.readAsDataURL(file);
      e.target.value = "";
      return;
    }

    // Add mode → enqueue every accepted file
    const accepted: File[] = [];
    let skipped = 0;
    for (const f of files) {
      if (f.size > MAX_BYTES) {
        skipped++;
        continue;
      }
      accepted.push(f);
    }
    if (skipped) {
      toast({
        title: `${skipped} file${skipped === 1 ? "" : "s"} skipped`,
        description: "Max size per file is 20MB.",
        variant: "destructive",
      });
    }
    if (!accepted.length) {
      e.target.value = "";
      return;
    }

    Promise.all(
      accepted.map(
        (file) =>
          new Promise<PendingItem>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () =>
              resolve({
                url: reader.result as string,
                mediaType: file.type.startsWith("video/") ? "video" : "photo",
                name: file.name,
              });
            reader.readAsDataURL(file);
          }),
      ),
    ).then((items) => {
      setPending((prev) => [...prev, ...items]);
      // If only ONE file total (and no URL typed), sync the single-slide preview
      const combined = [...pending, ...items];
      if (combined.length === 1) {
        setMediaUrl(combined[0].url);
        setMediaType(combined[0].mediaType);
      } else {
        // bulk path — clear single-slide preview
        setMediaUrl("");
      }
    });
    e.target.value = "";
  };

  const removePending = (i: number) => {
    setPending((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      if (next.length === 1) {
        setMediaUrl(next[0].url);
        setMediaType(next[0].mediaType);
      } else if (next.length === 0) {
        setMediaUrl("");
      }
      return next;
    });
  };

  const validateShared = (): string | null => {
    if (
      (linkAction === "url" ||
        linkAction === "email" ||
        linkAction === "whatsapp") &&
      !linkValue.trim()
    ) {
      return "Provide a destination for the chosen click action.";
    }
    if (startDate && endDate && startDate > endDate) {
      return "End date must be on or after start date.";
    }
    return null;
  };

  const handleSave = () => {
    const shared = validateShared();
    if (shared) {
      toast({ title: "Check your inputs", description: shared, variant: "destructive" });
      return;
    }

    const now = new Date().toISOString();
    const clampedSeconds = Math.max(
      2,
      Math.min(600, Number(displaySeconds) || DEFAULT_DURATION),
    );

    // BULK ADD path
    if (inBulk) {
      const captionTpl = caption.trim();
      const slides: WallBannerSlide[] = pending.map((p, i) => ({
        id: newSlideId(),
        ownerId,
        scope,
        mediaType: p.mediaType,
        mediaUrl: p.url,
        posterUrl: undefined,
        caption: captionTpl
          ? captionTpl.replace(/\{n\}/g, String(i + 1))
          : undefined,
        linkAction,
        linkValue: linkValue.trim() || undefined,
        displaySeconds: clampedSeconds,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sponsored,
        sponsorLabel: sponsored ? sponsorLabel.trim() || undefined : undefined,
        paused: false,
        createdAt: now,
        updatedAt: now,
      }));
      bulkInsertSlides(slides);
      toast({
        title: `${slides.length} slides added`,
        description: "Your wall banner has been updated.",
      });
      onOpenChange(false);
      return;
    }

    // SINGLE add or EDIT
    if (!mediaUrl.trim()) {
      toast({
        title: "Media required",
        description: "Add an image or video for the slide.",
        variant: "destructive",
      });
      return;
    }
    const slide: WallBannerSlide = {
      id: initial?.id || newSlideId(),
      ownerId,
      scope,
      mediaType,
      mediaUrl: mediaUrl.trim(),
      posterUrl: posterUrl.trim() || undefined,
      caption: caption.trim() || undefined,
      linkAction,
      linkValue: linkValue.trim() || undefined,
      displaySeconds: clampedSeconds,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sponsored,
      sponsorLabel: sponsored ? sponsorLabel.trim() || undefined : undefined,
      paused: initial?.paused || false,
      createdAt: initial?.createdAt || now,
      updatedAt: now,
    };
    upsertSlide(slide);
    toast({
      title: initial ? "Slide updated" : "Slide added",
      description: "Your wall banner has been saved.",
    });
    onOpenChange(false);
  };

  const titleText = useMemo(() => {
    if (isEdit) return "Edit banner slide";
    if (inBulk) return `Bulk add — ${pending.length} slides`;
    return "Add banner slide";
  }, [isEdit, inBulk, pending.length]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[92dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {inBulk && <Images className="h-4 w-4 text-primary" />}
            {titleText}
          </DialogTitle>
          <DialogDescription>
            {inBulk
              ? "Configure the shared settings — they apply to every uploaded item."
              : "Configure how this image or video will display on your wall banner."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Media type (single mode only) */}
          {!inBulk && (
            <div className="space-y-2">
              <Label>Media type</Label>
              <Select
                value={mediaType}
                onValueChange={(v) => setMediaType(v as WallBannerMediaType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* File picker */}
          <div className="space-y-2">
            <Label>
              {isEdit
                ? "Replace media (file or paste URL)"
                : "Upload one or many files"}
            </Label>
            <Input
              type="file"
              multiple={!isEdit}
              accept={
                isEdit && mediaType === "video"
                  ? "video/*"
                  : isEdit
                    ? "image/*"
                    : "image/*,video/*"
              }
              onChange={handleFiles}
            />
            {!isEdit && (
              <p className="text-[11px] text-muted-foreground">
                Pick multiple files to add them all at once (max 20MB each).
              </p>
            )}

            {/* URL input — only in single mode */}
            {!inBulk && (
              <Input
                placeholder={
                  mediaType === "video"
                    ? "https://… video URL"
                    : "https://… image URL"
                }
                value={mediaUrl.startsWith("data:") ? "" : mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
              />
            )}

            {/* Single preview */}
            {!inBulk && mediaUrl && (
              <div className="rounded-md overflow-hidden border bg-muted/40">
                {mediaType === "video" ? (
                  <video
                    src={mediaUrl}
                    className="w-full h-32 object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt="preview"
                    className="w-full h-32 object-cover"
                  />
                )}
              </div>
            )}

            {/* Bulk preview grid */}
            {inBulk && (
              <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 border rounded-md bg-muted/30">
                {pending.map((p, i) => (
                  <div
                    key={`${p.name}-${i}`}
                    className="relative aspect-square rounded overflow-hidden bg-muted group"
                  >
                    {p.mediaType === "video" ? (
                      <video src={p.url} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removePending(i)}
                      aria-label="Remove"
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate">
                      #{i + 1} · {p.mediaType}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {mediaType === "video" && !inBulk && (
            <div className="space-y-2">
              <Label>Video poster URL (optional)</Label>
              <Input
                placeholder="https://… preview image"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>
              Caption {inBulk && <span className="text-muted-foreground font-normal">(applied to all — use {"{n}"} for the index)</span>}
            </Label>
            <Textarea
              rows={2}
              maxLength={140}
              placeholder={
                inBulk
                  ? 'e.g. "Promo slide {n}" — leave blank for no caption'
                  : "Short headline shown on the slide"
              }
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          {/* Link action */}
          <div className="space-y-2">
            <Label>When clicked…</Label>
            <Select
              value={linkAction}
              onValueChange={(v) => setLinkAction(v as WallBannerLinkAction)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Open in big viewer</SelectItem>
                <SelectItem value="url">Navigate to URL</SelectItem>
                <SelectItem value="email">Open email</SelectItem>
                <SelectItem value="whatsapp">Open WhatsApp chat</SelectItem>
                <SelectItem value="none">Do nothing</SelectItem>
              </SelectContent>
            </Select>
            {(linkAction === "url" ||
              linkAction === "email" ||
              linkAction === "whatsapp") && (
              <Input
                placeholder={
                  linkAction === "email"
                    ? "name@example.com"
                    : linkAction === "whatsapp"
                      ? "Phone number e.g. 2348012345678"
                      : "https://example.com"
                }
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
              />
            )}
          </div>

          {/* Display duration */}
          <div className="space-y-2">
            <Label>Display duration (seconds per view)</Label>
            <Input
              type="number"
              min={2}
              max={600}
              value={displaySeconds}
              onChange={(e) => setDisplaySeconds(Number(e.target.value))}
              onBlur={() =>
                setDisplaySeconds(
                  Math.max(2, Math.min(600, Number(displaySeconds) || DEFAULT_DURATION)),
                )
              }
            />
            <p className="text-[11px] text-muted-foreground">
              2–600 seconds. Equivalent to {(displaySeconds / 60).toFixed(2)} minutes.
            </p>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Start date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground -mt-2">
            Leave dates empty to run indefinitely.
          </p>

          {/* Sponsored */}
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label className="font-semibold">Mark as Sponsored</Label>
              <p className="text-[11px] text-muted-foreground">
                {inBulk
                  ? "Tag every uploaded slide as a paid / third-party advert."
                  : "Tag this slide as a paid / third-party advert."}
              </p>
            </div>
            <Switch checked={sponsored} onCheckedChange={setSponsored} />
          </div>
          {sponsored && (
            <Input
              placeholder='Optional sponsor label, e.g. "Sponsored by Acme"'
              value={sponsorLabel}
              onChange={(e) => setSponsorLabel(e.target.value)}
            />
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEdit
              ? "Save changes"
              : inBulk
                ? `Add ${pending.length} slides`
                : "Add slide"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
