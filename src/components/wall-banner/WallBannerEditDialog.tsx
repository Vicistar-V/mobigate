// WallBannerEditDialog — add/edit a single slide.
// Owner specifies media (photo/video URL or upload), caption, click action
// (URL/email/WhatsApp/viewer), display duration (seconds), schedule
// (start/end dates), and optional Sponsored tag.

import { useEffect, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import {
  WallBannerLinkAction,
  WallBannerMediaType,
  WallBannerSlide,
} from "@/types/wallBanner";
import { newSlideId, upsertSlide } from "@/lib/wallBannerStorage";

interface WallBannerEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerId: string;
  scope: "profile" | "home";
  initial?: WallBannerSlide | null;
}

const DEFAULT_DURATION = 6;

export function WallBannerEditDialog({
  open,
  onOpenChange,
  ownerId,
  scope,
  initial,
}: WallBannerEditDialogProps) {
  const { toast } = useToast();
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
    }
  }, [open, initial]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum size is 20MB.",
        variant: "destructive",
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaUrl(reader.result as string);
      setMediaType(file.type.startsWith("video/") ? "video" : "photo");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!mediaUrl.trim()) {
      toast({
        title: "Media required",
        description: "Add an image or video for the slide.",
        variant: "destructive",
      });
      return;
    }
    if (
      (linkAction === "url" ||
        linkAction === "email" ||
        linkAction === "whatsapp") &&
      !linkValue.trim()
    ) {
      toast({
        title: "Link required",
        description: "Provide a destination for the chosen click action.",
        variant: "destructive",
      });
      return;
    }
    if (startDate && endDate && startDate > endDate) {
      toast({
        title: "Invalid schedule",
        description: "End date must be on or after start date.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();
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
      displaySeconds: Math.max(2, Math.min(600, Number(displaySeconds) || DEFAULT_DURATION)),
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[92dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Edit banner slide" : "Add banner slide"}
          </DialogTitle>
          <DialogDescription>
            Configure how this image or video will display on your wall banner.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Media */}
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

          <div className="space-y-2">
            <Label>Upload file or paste URL</Label>
            <Input
              type="file"
              accept={mediaType === "video" ? "video/*" : "image/*"}
              onChange={handleFile}
            />
            <Input
              placeholder={
                mediaType === "video"
                  ? "https://… video URL"
                  : "https://… image URL"
              }
              value={mediaUrl.startsWith("data:") ? "" : mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
            />
            {mediaUrl && (
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
          </div>

          {mediaType === "video" && (
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
            <Label>Caption (optional)</Label>
            <Textarea
              rows={2}
              maxLength={140}
              placeholder="Short headline shown on the slide"
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
                Tag this slide as a paid / third-party advert.
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
            {initial ? "Save changes" : "Add slide"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
