// WallBannerSlideshow — public display surface
// Rotates active slides at their configured display interval. Handles
// click actions (url/email/whatsapp/viewer), shows optional "Sponsored"
// chip, and exposes an owner overlay: a "+" button that opens a quick
// menu (Create New / Edit / Delete / Pause).

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Pause, Play, Pencil, Trash2, FilePlus2, Settings2, Images } from "lucide-react";

import { cn } from "@/lib/utils";
import { WallBannerSlide } from "@/types/wallBanner";
import {
  getActiveSlidesFor,
  onSlidesChanged,
  resolveClickHref,
  togglePauseSlide,
  deleteSlide,
} from "@/lib/wallBannerStorage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { WallBannerEditDialog } from "./WallBannerEditDialog";
import { PostSundryBar } from "@/components/feed/PostSundryBar";

interface WallBannerSlideshowProps {
  ownerId: string;
  scope: "profile" | "home";
  /** Fallback image shown when there are no active slides. */
  fallbackImage?: string;
  fallbackAlt?: string;
  /** When true, owner-only overlay (Manage, Pause-pill) is rendered. */
  isOwner?: boolean;
  /** Owner clicks "Manage" — opens the manager dialog. */
  onManage?: () => void;
  /** Owner clicks the fallback "Change" button when no slides exist. */
  onChangeFallback?: () => void;
  /** Opens the in-app big viewer for the given slide (when linkAction = viewer). */
  onOpenViewer?: (slide: WallBannerSlide) => void;
  className?: string;
  heightClass?: string; // tailwind height util — defaults to h-48
  /** When true, overlay the universal sundry tools (Like/Comment/Share/Follow/Gift/Report). */
  showSundryBar?: boolean;
  /** Author/owner display name for sundry actions (Gift, Follow, Report). */
  authorName?: string;
  /** Author/owner avatar for sundry dialogs. */
  authorImage?: string;
}

export function WallBannerSlideshow({
  ownerId,
  scope,
  fallbackImage,
  fallbackAlt = "Profile Banner",
  isOwner = false,
  onManage,
  onChangeFallback,
  onOpenViewer,
  className,
  heightClass = "h-48",
  showSundryBar = false,
  authorName = "this user",
  authorImage,
}: WallBannerSlideshowProps) {
  const [slides, setSlides] = useState<WallBannerSlide[]>(() =>
    getActiveSlidesFor(ownerId, scope),
  );
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editSlide, setEditSlide] = useState<WallBannerSlide | null>(null);
  // Controlled open-state for the owner "+" quick-menu. Keeping it here (instead
  // of letting the dropdown manage its own state inside an inline component)
  // prevents the menu from snapping shut whenever the parent re-renders — e.g.
  // the live clock ticking or the slideshow auto-rotating every few seconds.
  const [menuOpen, setMenuOpen] = useState(false);

  // The owner "+" quick-menu trigger and content (reused for both states).
  // IMPORTANT: this is a plain render function (called inline), NOT a nested
  // React component invoked as <OwnerPlusMenu/>. Rendering it inline keeps it
  // part of the parent's element tree so React never unmounts/remounts it on
  // re-render — which was causing the dropdown to close instantly.
  const renderOwnerPlusMenu = (slide?: WallBannerSlide | null) => (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label="Wall banner options"
          className="h-9 w-9 rounded-full bg-black/55 hover:bg-black/75 text-white backdrop-blur-sm flex items-center justify-center shadow-md active:scale-95 transition-transform touch-manipulation"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        className="w-52 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem onSelect={() => setCreateOpen(true)}>
          <FilePlus2 className="h-4 w-4 mr-2" />
          Create New
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setBulkOpen(true)}>
          <Images className="h-4 w-4 mr-2" />
          Bulk Upload…
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={!slide}
          onSelect={() => slide && setEditSlide(slide)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit / Modify
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!slide}
          onSelect={() => {
            if (!slide) return;
            togglePauseSlide(slide.id);
            toast({
              title: slide.paused ? "Slide resumed" : "Slide paused",
            });
          }}
        >
          {slide?.paused ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Resume
            </>
          ) : (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause / Suspend
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!slide}
          className="text-destructive focus:text-destructive"
          onSelect={() => {
            if (!slide) return;
            if (confirm("Delete this slide? This cannot be undone.")) {
              deleteSlide(slide.id);
              toast({ title: "Slide deleted" });
            }
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete / Remove
        </DropdownMenuItem>
        {onManage && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onManage()}>
              <Settings2 className="h-4 w-4 mr-2" />
              Manage all slides…
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );


  // Refresh slides when storage changes or owner/scope updates
  useEffect(() => {
    setSlides(getActiveSlidesFor(ownerId, scope));
    const off = onSlidesChanged(() => {
      setSlides(getActiveSlidesFor(ownerId, scope));
    });
    // Re-evaluate schedule once per minute so date windows auto-apply
    const tick = window.setInterval(() => {
      setSlides(getActiveSlidesFor(ownerId, scope));
    }, 60_000);
    return () => {
      off();
      window.clearInterval(tick);
    };
  }, [ownerId, scope]);

  // Clamp idx when list shrinks
  useEffect(() => {
    if (idx >= slides.length) setIdx(0);
  }, [slides.length, idx]);

  const current = slides[idx];

  // Auto-rotation timer (per slide)
  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (slides.length < 2 || !current) return;
    const seconds = Math.max(2, current.displaySeconds || 6);
    timerRef.current = window.setTimeout(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, seconds * 1000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [current, slides.length]);

  const allSlideCount = useMemo(
    () => slides.length,
    [slides.length],
  );

  // No active slides — show fallback image
  if (!current) {
    return (
      <div
        className={cn(
          "relative bg-muted group overflow-hidden",
          heightClass,
          className,
        )}
      >
        {fallbackImage && (
          <img
            src={fallbackImage}
            alt={fallbackAlt}
            className="w-full h-full object-cover"
          />
        )}
        {showSundryBar && (
          <div className="absolute left-2 right-14 bottom-2 z-20">
            <PostSundryBar
              postId={`${ownerId}-${scope}-banner`}
              title={fallbackAlt}
              author={authorName}
              authorId={ownerId}
              authorImage={authorImage}
              imageUrl={fallbackImage}
              postType="Banner"
              isOwner={isOwner}
              variant="overlay"
            />
          </div>
        )}
        {isOwner && (
          <div className="absolute bottom-3 right-3 z-20">
            {renderOwnerPlusMenu(null)}
          </div>
        )}
        {isOwner && (
          <>
            <WallBannerEditDialog
              open={createOpen}
              onOpenChange={setCreateOpen}
              ownerId={ownerId}
              scope={scope}
            />
            <WallBannerEditDialog
              open={bulkOpen}
              onOpenChange={setBulkOpen}
              ownerId={ownerId}
              scope={scope}
              bulkMode
            />
          </>
        )}
      </div>
    );
  }

  // Click handler for a slide
  const handleSlideClick = () => {
    const href = resolveClickHref(current);
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    if (current.linkAction === "viewer" || current.linkAction === "play") {
      onOpenViewer?.(current);
    }
  };

  return (
    <div
      className={cn(
        "relative bg-muted group overflow-hidden",
        heightClass,
        className,
      )}
    >
      {/* Media */}
      {current.mediaType === "video" ? (
        <video
          key={current.id}
          src={current.mediaUrl}
          poster={current.posterUrl}
          className="w-full h-full object-cover cursor-pointer"
          autoPlay
          muted
          loop
          playsInline
          onClick={handleSlideClick}
        />
      ) : (
        <img
          key={current.id}
          src={current.mediaUrl}
          alt={current.caption || fallbackAlt}
          className="w-full h-full object-cover cursor-pointer"
          onClick={handleSlideClick}
          loading="lazy"
        />
      )}

      {/* Sponsored chip */}
      {current.sponsored && (
        <span className="absolute top-2 left-2 z-10 bg-black/65 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
          {current.sponsorLabel?.trim() || "Sponsored"}
        </span>
      )}

      {/* Caption */}
      {current.caption && (
        <div className={cn(
          "absolute left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white text-xs sm:text-sm font-medium pointer-events-none",
          showSundryBar ? "bottom-11" : "bottom-0",
        )}>
          <span className="line-clamp-2">{current.caption}</span>
        </div>
      )}

      {/* Universal sundry tools overlay */}
      {showSundryBar && (
        <div className="absolute left-2 right-14 bottom-2 z-20">
          <PostSundryBar
            postId={current.id}
            title={current.caption || fallbackAlt}
            author={authorName}
            authorId={ownerId}
            authorImage={authorImage}
            imageUrl={current.mediaUrl}
            postType="Banner"
            isOwner={isOwner}
            variant="overlay"
          />
        </div>
      )}

      {/* Slide indicator dots */}
      {allSlideCount > 1 && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-1.5 py-1">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                setIdx(i);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === idx ? "w-4 bg-white" : "w-1.5 bg-white/50",
              )}
            />
          ))}
        </div>
      )}

      {/* Owner overlay — "+" quick menu */}
      {isOwner && (
        <div className="absolute bottom-3 right-3 z-20">
          {renderOwnerPlusMenu(current)}
        </div>
      )}

      {/* Owner-only edit dialogs (mounted inside slideshow so owner overlay is self-contained) */}
      {isOwner && (
        <>
          <WallBannerEditDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            ownerId={ownerId}
            scope={scope}
          />
          <WallBannerEditDialog
            open={bulkOpen}
            onOpenChange={setBulkOpen}
            ownerId={ownerId}
            scope={scope}
            bulkMode
          />
          <WallBannerEditDialog
            open={!!editSlide}
            onOpenChange={(o) => {
              if (!o) setEditSlide(null);
            }}
            ownerId={ownerId}
            scope={scope}
            initial={editSlide}
          />
        </>
      )}
    </div>
  );
}
