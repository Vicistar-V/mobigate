// WallBannerManagerDialog — owner CRUD with multi-select bulk actions.
// • Every slide carries a Select checkbox.
// • Select many → Delete or Pause/Resume in bulk.
// • Select exactly one → Edit/Change is enabled.
// • Per-row quick actions (Pause / Edit / Delete) remain available.

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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pause,
  Play,
  Pencil,
  Trash2,
  Plus,
  Clock,
  Calendar,
  Link2,
  Images,
  CheckSquare,
  Square,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WallBannerSlide } from "@/types/wallBanner";
import {
  getSlidesFor,
  onSlidesChanged,
  togglePauseSlide,
  deleteSlide,
  bulkDeleteSlides,
  bulkSetPaused,
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
  return `${slide.startDate || "—"} → ${slide.endDate || "—"}`;
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
  const [bulkAddOpen, setBulkAddOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    setSlides(getSlidesFor(ownerId, scope));
    const off = onSlidesChanged(() => setSlides(getSlidesFor(ownerId, scope)));
    return off;
  }, [open, ownerId, scope]);

  // Clear selection whenever the dialog closes
  useEffect(() => {
    if (!open) setSelected(new Set());
  }, [open]);

  // Drop ids from selection that no longer exist
  useEffect(() => {
    setSelected((prev) => {
      const ids = new Set(slides.map((s) => s.id));
      const next = new Set([...prev].filter((id) => ids.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [slides]);

  const selectedSlides = useMemo(
    () => slides.filter((s) => selected.has(s.id)),
    [slides, selected],
  );
  const allSelected = slides.length > 0 && selected.size === slides.length;
  const singleSelected = selected.size === 1 ? selectedSlides[0] : null;
  const anyPaused = selectedSlides.some((s) => s.paused);
  const anyPlaying = selectedSlides.some((s) => !s.paused);

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(slides.map((s) => s.id)));
  };

  const handleBulkDelete = () => {
    if (!selected.size) return;
    if (
      !confirm(
        `Delete ${selected.size} slide${selected.size === 1 ? "" : "s"}? This cannot be undone.`,
      )
    )
      return;
    bulkDeleteSlides([...selected]);
    toast({ title: `${selected.size} slide(s) deleted` });
    setSelected(new Set());
  };

  const handleBulkPause = (paused: boolean) => {
    if (!selected.size) return;
    bulkSetPaused([...selected], paused);
    toast({
      title: paused
        ? `${selected.size} slide(s) paused`
        : `${selected.size} slide(s) resumed`,
    });
  };

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

          {/* Top toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 py-2">
            <p className="text-xs text-muted-foreground">
              {slides.length} slide{slides.length === 1 ? "" : "s"}
              {selected.size > 0 && (
                <> · <span className="text-primary font-semibold">{selected.size} selected</span></>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add single
              </Button>
              <Button size="sm" onClick={() => setBulkAddOpen(true)}>
                <Images className="h-4 w-4 mr-1" />
                Bulk upload
              </Button>
            </div>
          </div>

          {/* Selection bar */}
          {slides.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-2 rounded-md border bg-muted/30">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 text-[11px] px-2"
                onClick={toggleAll}
              >
                {allSelected ? (
                  <CheckSquare className="h-4 w-4 mr-1" />
                ) : (
                  <Square className="h-4 w-4 mr-1" />
                )}
                {allSelected ? "Unselect all" : "Select all"}
              </Button>

              <div className="h-5 w-px bg-border" />

              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px]"
                disabled={!singleSelected}
                onClick={() => singleSelected && setEditing(singleSelected)}
              >
                <Pencil className="h-3 w-3 mr-1" />
                Edit / Change
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px]"
                disabled={!selected.size || !anyPlaying}
                onClick={() => handleBulkPause(true)}
              >
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px]"
                disabled={!selected.size || !anyPaused}
                onClick={() => handleBulkPause(false)}
              >
                <Play className="h-3 w-3 mr-1" />
                Resume
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px] text-destructive border-destructive/40"
                disabled={!selected.size}
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>

              {selected.size > 1 && (
                <span className="ml-auto text-[10px] text-muted-foreground">
                  Edit needs a single selection
                </span>
              )}
            </div>
          )}

          {slides.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground border rounded-md">
              No slides yet. Click <strong>Bulk upload</strong> to add many at
              once, or <strong>Add single</strong>.
            </div>
          ) : (
            <ul className="space-y-2 mt-2">
              {slides.map((s) => {
                const isSel = selected.has(s.id);
                return (
                  <li
                    key={s.id}
                    className={`flex gap-3 p-2 border rounded-md bg-card transition-colors ${
                      isSel ? "ring-2 ring-primary border-primary" : ""
                    }`}
                  >
                    <div className="flex items-start pt-1">
                      <Checkbox
                        checked={isSel}
                        onCheckedChange={() => toggleOne(s.id)}
                        aria-label="Select slide"
                      />
                    </div>
                    <div
                      className="h-20 w-28 shrink-0 rounded-md overflow-hidden bg-muted cursor-pointer"
                      onClick={() => toggleOne(s.id)}
                    >
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
                      <p className="text-sm font-semibold truncate">
                        {s.caption ||
                          (s.mediaType === "video"
                            ? "Video slide"
                            : "Photo slide")}
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
                            if (
                              confirm(
                                "Delete this slide? This cannot be undone.",
                              )
                            ) {
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
                );
              })}
            </ul>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single-add dialog */}
      <WallBannerEditDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        ownerId={ownerId}
        scope={scope}
      />
      {/* Bulk-add dialog — same component, opens directly in bulk mode */}
      <WallBannerEditDialog
        open={bulkAddOpen}
        onOpenChange={setBulkAddOpen}
        ownerId={ownerId}
        scope={scope}
        bulkMode
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
