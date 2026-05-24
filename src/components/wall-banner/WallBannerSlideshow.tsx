// WallBannerSlideshow — public display surface
// Rotates active slides at their configured display interval. Handles
// click actions (url/email/whatsapp/viewer), shows optional "Sponsored"
// chip, and exposes an optional owner overlay (Manage / pause indicator).

import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Pause, Play, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { WallBannerSlide } from "@/types/wallBanner";
import {
  getActiveSlidesFor,
  onSlidesChanged,
  resolveClickHref,
} from "@/lib/wallBannerStorage";

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
}: WallBannerSlideshowProps) {
  const [slides, setSlides] = useState<WallBannerSlide[]>(() =>
    getActiveSlidesFor(ownerId, scope),
  );
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

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
        {isOwner && (
          <div className="absolute bottom-3 right-3 flex gap-2 z-20">
            {onChangeFallback && (
              <button
                type="button"
                onClick={onChangeFallback}
                className="bg-black/55 hover:bg-black/70 text-white backdrop-blur-sm text-[11px] px-2 py-1 rounded flex items-center gap-1"
              >
                <Camera className="h-3 w-3" />
                Change
              </button>
            )}
            {onManage && (
              <button
                type="button"
                onClick={onManage}
                className="bg-primary/90 hover:bg-primary text-primary-foreground text-[11px] px-2 py-1 rounded flex items-center gap-1"
              >
                <Settings2 className="h-3 w-3" />
                Manage Banner
              </button>
            )}
          </div>
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
        <div className="absolute left-0 right-0 bottom-0 px-3 py-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white text-xs sm:text-sm font-medium pointer-events-none">
          <span className="line-clamp-2">{current.caption}</span>
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

      {/* Owner overlay */}
      {isOwner && (
        <div className="absolute bottom-3 right-3 z-20 flex gap-2">
          {onManage && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onManage();
              }}
              className="bg-black/55 hover:bg-black/75 text-white backdrop-blur-sm text-[11px] px-2 py-1 rounded flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <Settings2 className="h-3 w-3" />
              Manage
            </button>
          )}
        </div>
      )}
    </div>
  );
}
