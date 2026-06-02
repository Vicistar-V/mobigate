// WallBannerEditDialog — add/edit slides.
// • Edit mode: works on a single existing slide.
// • Add mode: accepts ONE OR MANY files. With >1 file the dialog switches to
//   "Bulk add" — the main form holds the SHARED defaults that apply to every
//   uploaded item, but each thumbnail can be tapped to override any field for
//   that specific slide (caption, click action, duration, schedule, sponsored
//   tag, poster URL). A small dot on the thumbnail indicates overrides.
// • On save, each per-item override wins over the shared value; everything
//   else falls back to the shared form values.

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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Images,
  Settings2,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
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

/** Per-item override fields — every key is OPTIONAL. */
interface PendingOverrides {
  caption?: string;
  linkAction?: WallBannerLinkAction;
  linkValue?: string;
  displaySeconds?: number;
  startDate?: string;
  endDate?: string;
  sponsored?: boolean;
  sponsorLabel?: string;
  posterUrl?: string;
}

interface PendingItem {
  url: string;
  mediaType: WallBannerMediaType;
  name: string;
  overrides?: PendingOverrides;
}

// ---------------------------------------------------------------------------
// Per-item override sheet — defined OUTSIDE the parent function to avoid
// re-mount + keyboard focus loss on mobile (project memory rule).
// ---------------------------------------------------------------------------

interface BulkItemConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  index: number;
  total: number;
  item: PendingItem | null;
  /** Shared form values shown as placeholder text where no override exists. */
  shared: {
    caption: string;
    linkAction: WallBannerLinkAction;
    linkValue: string;
    displaySeconds: number;
    startDate: string;
    endDate: string;
    sponsored: boolean;
    sponsorLabel: string;
  };
  onSave: (overrides: PendingOverrides | undefined) => void;
}

function BulkItemConfigDialog({
  open,
  onOpenChange,
  index,
  total,
  item,
  shared,
  onSave,
}: BulkItemConfigDialogProps) {
  // Each override toggle has an "enabled?" boolean that controls whether the
  // field overrides the shared one. We seed from existing overrides on open.
  const [overrides, setOverrides] = useState<PendingOverrides>({});
  const [posterUrl, setPosterUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    setOverrides(item?.overrides || {});
    setPosterUrl(item?.overrides?.posterUrl || "");
  }, [open, item]);

  if (!item) return null;

  const set = <K extends keyof PendingOverrides>(
    key: K,
    value: PendingOverrides[K] | undefined,
  ) => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (value === undefined || value === "" || value === null) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const captionVal = overrides.caption ?? "";
  const linkActionVal = overrides.linkAction ?? shared.linkAction;
  const linkValueVal = overrides.linkValue ?? "";
  const displaySecondsVal =
    overrides.displaySeconds ?? shared.displaySeconds;
  const startDateVal = overrides.startDate ?? "";
  const endDateVal = overrides.endDate ?? "";
  const sponsoredVal = overrides.sponsored ?? shared.sponsored;
  const sponsorLabelVal = overrides.sponsorLabel ?? "";

  const hasAnyOverride = Object.keys(overrides).length > 0;

  const handleSave = () => {
    // Validate any per-item link if action requires a value (even if it falls
    // back to the shared one, we'll let the parent's shared validator catch it)
    if (
      overrides.linkAction &&
      (overrides.linkAction === "url" ||
        overrides.linkAction === "email" ||
        overrides.linkAction === "whatsapp") &&
      !((overrides.linkValue || shared.linkValue) || "").trim()
    ) {
      // soft warn only — still allow save (shared may be filled later)
    }
    // store posterUrl into overrides
    const finalOverrides: PendingOverrides = { ...overrides };
    if (posterUrl.trim()) finalOverrides.posterUrl = posterUrl.trim();
    else delete finalOverrides.posterUrl;
    onSave(Object.keys(finalOverrides).length ? finalOverrides : undefined);
    onOpenChange(false);
  };

  const handleResetAll = () => {
    setOverrides({});
    setPosterUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[92dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" />
            Customize slide #{index + 1}
            <span className="text-xs text-muted-foreground font-normal">
              of {total}
            </span>
          </DialogTitle>
          <DialogDescription>
            Override any setting for this specific slide. Empty fields fall
            back to your shared defaults.
          </DialogDescription>
        </DialogHeader>

        {/* Preview */}
        <div className="rounded-md overflow-hidden border bg-muted/40">
          {item.mediaType === "video" ? (
            <video
              src={item.url}
              className="w-full h-32 object-cover"
              muted
              controls
            />
          ) : (
            <img
              src={item.url}
              alt={item.name}
              className="w-full h-32 object-cover"
            />
          )}
          <div className="px-2 py-1 text-[11px] text-muted-foreground truncate">
            {item.name} · {item.mediaType}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {/* Caption override */}
          <div className="space-y-1.5">
            <Label className="flex items-center justify-between">
              <span>Caption</span>
              {overrides.caption !== undefined && (
                <button
                  type="button"
                  onClick={() => set("caption", undefined)}
                  className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Use shared
                </button>
              )}
            </Label>
            <Textarea
              rows={2}
              maxLength={140}
              placeholder={
                shared.caption
                  ? `Shared: "${shared.caption.replace(/\{n\}/g, String(index + 1))}"`
                  : "Leave blank to use shared caption / no caption"
              }
              value={captionVal}
              onChange={(e) => set("caption", e.target.value || undefined)}
            />
          </div>

          {/* Link action override */}
          <div className="space-y-1.5">
            <Label className="flex items-center justify-between">
              <span>When clicked…</span>
              {overrides.linkAction !== undefined && (
                <button
                  type="button"
                  onClick={() => {
                    set("linkAction", undefined);
                    set("linkValue", undefined);
                  }}
                  className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Use shared
                </button>
              )}
            </Label>
            <Select
              value={linkActionVal}
              onValueChange={(v) =>
                set("linkAction", v as WallBannerLinkAction)
              }
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
            {(linkActionVal === "url" ||
              linkActionVal === "email" ||
              linkActionVal === "whatsapp") && (
              <Input
                placeholder={
                  shared.linkValue
                    ? `Shared: ${shared.linkValue}`
                    : linkActionVal === "email"
                      ? "name@example.com"
                      : linkActionVal === "whatsapp"
                        ? "Phone number e.g. 2348012345678"
                        : "https://example.com"
                }
                value={linkValueVal}
                onChange={(e) => set("linkValue", e.target.value || undefined)}
              />
            )}
          </div>

          {/* Poster URL (only for video) */}
          {item.mediaType === "video" && (
            <div className="space-y-1.5">
              <Label className="flex items-center justify-between">
                <span>Video poster URL</span>
                {posterUrl && (
                  <button
                    type="button"
                    onClick={() => setPosterUrl("")}
                    className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" /> Clear
                  </button>
                )}
              </Label>
              <Input
                placeholder="https://… preview image"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
              />
            </div>
          )}

          {/* Display duration */}
          <div className="space-y-1.5">
            <Label className="flex items-center justify-between">
              <span>Display duration (seconds)</span>
              {overrides.displaySeconds !== undefined && (
                <button
                  type="button"
                  onClick={() => set("displaySeconds", undefined)}
                  className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Use shared ({shared.displaySeconds}s)
                </button>
              )}
            </Label>
            <Input
              type="number"
              min={2}
              max={600}
              value={displaySecondsVal}
              onChange={(e) =>
                set("displaySeconds", Number(e.target.value) || undefined)
              }
              onBlur={() => {
                if (overrides.displaySeconds !== undefined) {
                  set(
                    "displaySeconds",
                    Math.max(2, Math.min(600, Number(overrides.displaySeconds) || DEFAULT_DURATION)),
                  );
                }
              }}
            />
          </div>

          {/* Schedule */}
          <div className="space-y-1.5">
            <Label className="flex items-center justify-between">
              <span>Schedule (overrides shared)</span>
              {(overrides.startDate !== undefined ||
                overrides.endDate !== undefined) && (
                <button
                  type="button"
                  onClick={() => {
                    set("startDate", undefined);
                    set("endDate", undefined);
                  }}
                  className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Use shared
                </button>
              )}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder={shared.startDate || ""}
                value={startDateVal}
                onChange={(e) => set("startDate", e.target.value || undefined)}
              />
              <Input
                type="date"
                placeholder={shared.endDate || ""}
                value={endDateVal}
                onChange={(e) => set("endDate", e.target.value || undefined)}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Shared: {shared.startDate || "—"} → {shared.endDate || "—"}
            </p>
          </div>

          {/* Sponsored override */}
          <div className="rounded-md border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-semibold">Mark as Sponsored</Label>
                <p className="text-[11px] text-muted-foreground">
                  Shared default: {shared.sponsored ? "On" : "Off"}
                </p>
              </div>
              <Switch
                checked={sponsoredVal}
                onCheckedChange={(v) => set("sponsored", v)}
              />
            </div>
            {sponsoredVal && (
              <Input
                placeholder={
                  shared.sponsorLabel
                    ? `Shared label: ${shared.sponsorLabel}`
                    : 'Optional sponsor label, e.g. "Sponsored by Acme"'
                }
                value={sponsorLabelVal}
                onChange={(e) =>
                  set("sponsorLabel", e.target.value || undefined)
                }
              />
            )}
            {overrides.sponsored !== undefined && (
              <button
                type="button"
                onClick={() => {
                  set("sponsored", undefined);
                  set("sponsorLabel", undefined);
                }}
                className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> Use shared sponsored value
              </button>
            )}
          </div>

          {/* Summary */}
          {hasAnyOverride && (
            <div className="flex items-center gap-2 text-[11px] text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {Object.keys(overrides).length} field
              {Object.keys(overrides).length === 1 ? "" : "s"} overridden on
              this slide
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <Button variant="ghost" onClick={handleResetAll}>
            Reset all
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save overrides</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Main edit dialog
// ---------------------------------------------------------------------------

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

  // Bulk add state — list of pending uploads + per-item config dialog state
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [configIndex, setConfigIndex] = useState<number | null>(null);

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
      setConfigIndex(null);
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
      setConfigIndex(null);
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
      // Use a lightweight object URL instead of a base64 data URL. Videos/images
      // as base64 blow past the localStorage quota and make saving fail.
      setMediaUrl(URL.createObjectURL(file));
      setMediaType(file.type.startsWith("video/") ? "video" : "photo");
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

    // Object URLs keep localStorage tiny (just a short blob: reference) so even
    // large videos save successfully, instead of base64 data URLs that overflow
    // the storage quota and cause "Add slide" to silently fail.
    const items: PendingItem[] = accepted.map((file) => ({
      url: URL.createObjectURL(file),
      mediaType: file.type.startsWith("video/") ? "video" : "photo",
      name: file.name,
    }));
    setPending((prev) => [...prev, ...items]);
    const combined = [...pending, ...items];
    if (combined.length === 1) {
      setMediaUrl(combined[0].url);
      setMediaType(combined[0].mediaType);
    } else {
      setMediaUrl("");
    }
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

  const updatePendingOverrides = (i: number, overrides?: PendingOverrides) => {
    setPending((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, overrides } : p)),
    );
  };

  const clearAllOverrides = () => {
    setPending((prev) => prev.map((p) => ({ ...p, overrides: undefined })));
    toast({ title: "Per-item overrides cleared" });
  };

  const validateShared = (): string | null => {
    if (
      (linkAction === "url" ||
        linkAction === "email" ||
        linkAction === "whatsapp") &&
      !linkValue.trim()
    ) {
      // In bulk mode, only require shared value if at least one slide will
      // actually use the shared link (i.e. no override for linkValue / action)
      if (inBulk) {
        const allOverride = pending.every((p) => {
          const a = p.overrides?.linkAction ?? linkAction;
          if (a === "url" || a === "email" || a === "whatsapp") {
            return !!(p.overrides?.linkValue || "").trim();
          }
          return true; // viewer/none doesn't need value
        });
        if (allOverride) return null;
      }
      return "Provide a destination for the chosen click action (or override each slide).";
    }
    if (startDate && endDate && startDate > endDate) {
      return "End date must be on or after start date.";
    }
    return null;
  };

  const handleSave = () => {
    const sharedErr = validateShared();
    if (sharedErr) {
      toast({
        title: "Check your inputs",
        description: sharedErr,
        variant: "destructive",
      });
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
      const slides: WallBannerSlide[] = pending.map((p, i) => {
        const ov = p.overrides || {};
        const itemCaption =
          ov.caption !== undefined
            ? ov.caption.trim() || undefined
            : captionTpl
              ? captionTpl.replace(/\{n\}/g, String(i + 1))
              : undefined;
        const itemLinkAction = ov.linkAction ?? linkAction;
        const itemLinkValue =
          (ov.linkValue ?? linkValue).trim() || undefined;
        const itemSeconds = Math.max(
          2,
          Math.min(
            600,
            Number(ov.displaySeconds ?? clampedSeconds) || DEFAULT_DURATION,
          ),
        );
        const itemStart = (ov.startDate ?? startDate) || undefined;
        const itemEnd = (ov.endDate ?? endDate) || undefined;
        const itemSponsored = ov.sponsored ?? sponsored;
        const itemSponsorLabel = itemSponsored
          ? (ov.sponsorLabel ?? sponsorLabel).trim() || undefined
          : undefined;
        const itemPoster =
          (ov.posterUrl || "").trim() || undefined;

        return {
          id: newSlideId(),
          ownerId,
          scope,
          mediaType: p.mediaType,
          mediaUrl: p.url,
          posterUrl: itemPoster,
          caption: itemCaption,
          linkAction: itemLinkAction,
          linkValue:
            itemLinkAction === "url" ||
            itemLinkAction === "email" ||
            itemLinkAction === "whatsapp"
              ? itemLinkValue
              : undefined,
          displaySeconds: itemSeconds,
          startDate: itemStart,
          endDate: itemEnd,
          sponsored: itemSponsored,
          sponsorLabel: itemSponsorLabel,
          paused: false,
          createdAt: now,
          updatedAt: now,
        };
      });
      bulkInsertSlides(slides);
      const customised = pending.filter((p) => p.overrides).length;
      toast({
        title: `${slides.length} slides added`,
        description: customised
          ? `${customised} slide${customised === 1 ? "" : "s"} used custom overrides.`
          : "Your wall banner has been updated.",
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

  const customisedCount = pending.filter((p) => !!p.overrides).length;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[92dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {inBulk && <Images className="h-4 w-4 text-primary" />}
              {titleText}
            </DialogTitle>
            <DialogDescription>
              {inBulk
                ? "Configure shared defaults below — they apply to every uploaded item. Tap any thumbnail to customise that single slide."
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

              {/* Bulk preview grid — tap to customise that slide */}
              {inBulk && (
                <>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">
                      Tap a thumbnail to override settings just for that slide.
                    </span>
                    {customisedCount > 0 && (
                      <button
                        type="button"
                        onClick={clearAllOverrides}
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" /> Reset all
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 border rounded-md bg-muted/30">
                    {pending.map((p, i) => {
                      const customised = !!p.overrides;
                      return (
                        <div
                          key={`${p.name}-${i}`}
                          className={`relative aspect-square rounded overflow-hidden bg-muted group cursor-pointer transition-shadow ${
                            customised
                              ? "ring-2 ring-primary shadow-md"
                              : "hover:ring-2 hover:ring-primary/40"
                          }`}
                          role="button"
                          tabIndex={0}
                          onClick={() => setConfigIndex(i)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setConfigIndex(i);
                            }
                          }}
                          aria-label={`Customise slide ${i + 1}`}
                        >
                          {p.mediaType === "video" ? (
                            <video
                              src={p.url}
                              className="w-full h-full object-cover"
                              muted
                            />
                          ) : (
                            <img
                              src={p.url}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          {/* Customise icon overlay */}
                          <div className="absolute top-1 left-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-none">
                            <Settings2 className="h-3 w-3" />
                          </div>
                          {/* Override indicator dot */}
                          {customised && (
                            <span className="absolute top-1 left-7 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background pointer-events-none" />
                          )}
                          {/* Remove (X) — does NOT open config */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removePending(i);
                            }}
                            aria-label="Remove"
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate flex items-center justify-between">
                            <span>#{i + 1} · {p.mediaType}</span>
                            {customised && (
                              <Badge
                                variant="secondary"
                                className="h-3.5 text-[8px] px-1 py-0 bg-primary/90 text-primary-foreground border-0"
                              >
                                custom
                              </Badge>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {customisedCount > 0 && (
                    <p className="text-[11px] text-primary font-medium">
                      {customisedCount} of {pending.length} slide
                      {pending.length === 1 ? "" : "s"} customised individually
                    </p>
                  )}
                </>
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

            {/* Shared defaults header (bulk only) */}
            {inBulk && (
              <div className="pt-2 -mb-2">
                <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                  Shared defaults
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Used for every slide unless overridden per-slide.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>
                Caption{" "}
                {inBulk && (
                  <span className="text-muted-foreground font-normal">
                    (applied to all — use {"{n}"} for the index)
                  </span>
                )}
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
                onValueChange={(v) =>
                  setLinkAction(v as WallBannerLinkAction)
                }
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
                    Math.max(
                      2,
                      Math.min(
                        600,
                        Number(displaySeconds) || DEFAULT_DURATION,
                      ),
                    ),
                  )
                }
              />
              <p className="text-[11px] text-muted-foreground">
                2–600 seconds. Equivalent to{" "}
                {(displaySeconds / 60).toFixed(2)} minutes.
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
                    ? "Default for every uploaded slide (overridable per-slide)."
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

      {/* Per-item override sheet */}
      <BulkItemConfigDialog
        open={configIndex !== null}
        onOpenChange={(o) => {
          if (!o) setConfigIndex(null);
        }}
        index={configIndex ?? 0}
        total={pending.length}
        item={configIndex !== null ? pending[configIndex] || null : null}
        shared={{
          caption,
          linkAction,
          linkValue,
          displaySeconds,
          startDate,
          endDate,
          sponsored,
          sponsorLabel,
        }}
        onSave={(overrides) => {
          if (configIndex !== null) updatePendingOverrides(configIndex, overrides);
        }}
      />
    </>
  );
}
