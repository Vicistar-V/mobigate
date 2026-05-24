// WallBannerManagerDialog — owner CRUD over their banner slides.
// Lists existing slides with quick Pause/Resume, Edit, Replace and Delete.

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
import { Badge } from "@/components/ui/badge";
import {
  Pause,
  Play,
  Pencil,
  Trash2,
  Plus,
  Clock,
  Calendar,
  Link2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WallBannerSlide } from "@/types/wallBanner";
import {
  getSlidesFor,
  onSlidesChanged,
  togglePauseSlide,
  deleteSlide,
} from "@/lib/wallBannerStorage";
import { WallBannerEditDialog } from "./WallBannerEditDialog";

interface WallBannerManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerId: string;
  scope: "profile" | "home";
}

function formatRange(slide: WallBannerSlide): string {
  if (!slide.startDate && !slide.endDate) return "Always on";
  const s = slide.startDate || "—";
  const e = slide.endDate || "—";
  return `${s} → ${e}`;
}

function actionLabel(slide: WallBannerSlide): string {
  switch (slide.linkAction) {
    case "url":
      return `URL: ${slide.linkValue || "—"}`;
    case "email":
      return `Email: ${slide.linkValue || "—"}`;
    case "whatsapp":
      return `WhatsApp: ${slide.linkValue || "—"}`;
    case "viewer":
    case "play":
      return "Open in viewer";
    default:
      return "No action";
  }
}

export function WallBannerManagerDialog({
  open,
  onOpenChange,
  ownerId,
  scope,
}: WallBannerManagerDialogProps) {
  const { toast } = useToast();
  const [slides, setSlides] = useState<WallBannerSlide[]>([]);
  const [editing, setEditing] = useState<WallBannerSlide | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSlides(getSlidesFor(ownerId, scope));
    const off = onSlidesChanged(() =>
      setSlides(getSlidesFor(ownerId, scope)),
    );
    return off;
  }, [open, ownerId, scope]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[92dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Wall Banner</DialogTitle>
            <DialogDescription>
              Add, edit, pause or remove the photos and videos that rotate on
              your {scope === "home" ? "homepage" : "profile"} banner.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between py-2">
            <p className="text-xs text-muted-foreground">
              {slides.length} slide{slides.length === 1 ? "" : "s"}
            </p>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add slide
            </Button>
          </div>

          {slides.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground border rounded-md">
              No slides yet. Click <strong>Add slide</strong> to create your
              first one.
            </div>
          ) : (
            <ul className="space-y-2">
              {slides.map((s) => (
                <li
                  key={s.id}
                  className="flex gap-3 p-2 border rounded-md bg-card"
                >
                  <div className="h-20 w-28 shrink-0 rounded-md overflow-hidden bg-muted">
                    {s.mediaType === "video" ? (
                      <video
                        src={s.mediaUrl}
                        poster={s.posterUrl}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={s.mediaUrl}
                        alt={s.caption || "slide"}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {s.caption || (s.mediaType === "video" ? "Video slide" : "Photo slide")}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {s.sponsored && (
                            <Badge variant="secondary" className="text-[10px]">
                              {s.sponsorLabel || "Sponsored"}
                            </Badge>
                          )}
                          {s.paused && (
                            <Badge variant="destructive" className="text-[10px]">
                              Paused
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[10px]">
                            {s.mediaType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1.5 text-[11px] text-muted-foreground space-y-0.5">
                      <p className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {s.displaySeconds}s per view
                      </p>
                      <p className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {formatRange(s)}
                      </p>
                      <p className="flex items-center gap-1 truncate">
                        <Link2 className="h-3 w-3" /> {actionLabel(s)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px]"
                        onClick={() => {
                          togglePauseSlide(s.id);
                          toast({
                            title: s.paused ? "Slide resumed" : "Slide paused",
                          });
                        }}
                      >
                        {s.paused ? (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px]"
                        onClick={() => setEditing(s)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] text-destructive border-destructive/40"
                        onClick={() => {
                          if (confirm("Delete this slide? This cannot be undone.")) {
                            deleteSlide(s.id);
                            toast({ title: "Slide deleted" });
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WallBannerEditDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        ownerId={ownerId}
        scope={scope}
      />
      <WallBannerEditDialog
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
        ownerId={ownerId}
        scope={scope}
        initial={editing}
      />
    </>
  );
}
