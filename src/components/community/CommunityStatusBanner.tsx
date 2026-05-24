import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Play, Camera } from "lucide-react";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import { CommunityProfile, CommunityBannerMedia } from "@/types/community";
import { useSwipeable } from "react-swipeable";

interface CommunityStatusBannerProps {
  community: CommunityProfile;
  className?: string;
}

/**
 * Community Status Banner — mirrors the user Profile Status Banner pattern.
 *
 * Reads from:
 *   - community.bannerMedia      : ordered list of {url, type: photo|video}
 *   - community.bannerImage      : fallback single image when bannerMedia is empty
 *   - community.bannerRotateSeconds : auto-rotate interval (default 8s when multiple)
 *
 * Click / tap opens the full-screen MediaGalleryViewer at the active item.
 * Supports swipe-left / swipe-right on mobile, and prev/next chevrons on desktop.
 */
export const CommunityStatusBanner = ({ community, className = "" }: CommunityStatusBannerProps) => {
  // Build a stable media list (always at least one entry so the slot is never empty)
  const mediaList: CommunityBannerMedia[] = useMemo(() => {
    if (community.bannerMedia && community.bannerMedia.length > 0) {
      return community.bannerMedia;
    }
    if (community.bannerImage) {
      return [{ id: "banner-fallback", url: community.bannerImage, type: "photo" }];
    }
    return [];
  }, [community.bannerMedia, community.bannerImage]);

  const rotateSeconds = community.bannerRotateSeconds ?? (mediaList.length > 1 ? 8 : 0);

  const [activeIdx, setActiveIdx] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-rotate
  useEffect(() => {
    if (!rotateSeconds || mediaList.length < 2 || isPaused || viewerOpen) return;
    const current = mediaList[activeIdx];
    // For videos: advance when the video ends instead of on a fixed timer
    if (current?.type === "video") return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % mediaList.length);
    }, rotateSeconds * 1000);
    return () => clearInterval(id);
  }, [rotateSeconds, mediaList, activeIdx, isPaused, viewerOpen]);

  const goPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((i) => (i - 1 + mediaList.length) % mediaList.length);
  };
  const goNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((i) => (i + 1) % mediaList.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => mediaList.length > 1 && goNext(),
    onSwipedRight: () => mediaList.length > 1 && goPrev(),
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  // Build gallery items for the viewer
  const galleryItems: MediaItem[] = useMemo(
    () =>
      mediaList.map((m, idx) => ({
        id: m.id ?? `${community.id}-banner-${idx}`,
        url: m.url,
        type: m.type,
        title: m.title ?? `${community.name} — Status ${idx + 1}/${mediaList.length}`,
        author: community.name,
        authorImage: community.logoImage,
      })),
    [mediaList, community.id, community.name, community.logoImage]
  );

  // Empty state
  if (mediaList.length === 0) {
    return (
      <div className={`relative h-48 sm:h-64 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg flex items-center justify-center ${className}`}>
        <Camera className="h-16 w-16 text-primary/40" />
      </div>
    );
  }

  const active = mediaList[activeIdx];

  return (
    <>
      <div
        {...swipeHandlers}
        className={`relative h-48 sm:h-64 overflow-hidden bg-muted group ${className}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <button
          type="button"
          onClick={() => setViewerOpen(true)}
          className="absolute inset-0 w-full h-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Open ${active.type === "video" ? "video" : "photo"} ${activeIdx + 1} of ${mediaList.length} in full view`}
        >
          {active.type === "video" ? (
            <video
              ref={videoRef}
              key={active.url}
              src={active.url}
              poster={active.thumbnail}
              autoPlay
              muted
              playsInline
              onEnded={() => mediaList.length > 1 && setActiveIdx((i) => (i + 1) % mediaList.length)}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          ) : (
            <img
              key={active.url}
              src={active.url}
              alt={active.title ?? `${community.name} status banner`}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          )}

          {/* Subtle gradient at bottom so chips are legible */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />
        </button>

        {/* View chip (top-right) */}
        <span className="pointer-events-none absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {active.type === "video" ? (
            <>
              <Play className="h-3 w-3" />
              Play
            </>
          ) : (
            <>
              <Maximize2 className="h-3 w-3" />
              View
            </>
          )}
        </span>

        {/* Counter chip (top-left) */}
        {mediaList.length > 1 && (
          <span className="pointer-events-none absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            {activeIdx + 1} / {mediaList.length}
          </span>
        )}

        {/* Prev / Next chevrons (multi only) */}
        {mediaList.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-opacity opacity-70 hover:opacity-100 touch-manipulation active:scale-90"
              aria-label="Previous banner item"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-opacity opacity-70 hover:opacity-100 touch-manipulation active:scale-90"
              aria-label="Next banner item"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {mediaList.length > 1 && (
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {mediaList.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIdx ? "w-5 bg-white" : "w-1.5 bg-white/55"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <MediaGalleryViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        items={galleryItems}
        initialIndex={activeIdx}
        galleryType="banner"
      />
    </>
  );
};

export default CommunityStatusBanner;
