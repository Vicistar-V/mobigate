import { useEffect, useState } from "react";
import { ExternalLink, Maximize2 } from "lucide-react";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import profileBanner from "@/assets/profile-banner.jpg";

/**
 * Read-only banner widget that renders the user's Status Banner using the
 * same settings the user configured in Profile → Change Banner:
 *   - bannerImage           : current banner
 *   - bannerImageHistory    : list of banners to cycle through
 *   - bannerClickAction     : "viewer" | "url"
 *   - bannerLinkedUrl       : URL to open when clickAction === "url"
 *   - bannerRotateSeconds   : interval in seconds (0 = off)
 *
 * Mounted on the user's own Homepage so the banner is visible there too.
 */
export const UserStatusBanner = ({ className = "" }: { className?: string }) => {
  const read = () => {
    if (typeof window === "undefined") {
      return {
        image: profileBanner,
        history: [profileBanner] as string[],
        action: "viewer" as "viewer" | "url",
        url: "",
        seconds: 0,
      };
    }
    const image = localStorage.getItem("bannerImage") || profileBanner;
    let history: string[] = [image];
    try {
      const raw = localStorage.getItem("bannerImageHistory");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) history = parsed;
      }
    } catch {}
    if (!history.includes(image)) history = [image, ...history];
    return {
      image,
      history,
      action: (localStorage.getItem("bannerClickAction") as "viewer" | "url") || "viewer",
      url: localStorage.getItem("bannerLinkedUrl") || "",
      seconds: parseInt(localStorage.getItem("bannerRotateSeconds") || "0", 10) || 0,
    };
  };

  const [settings, setSettings] = useState(read);
  const [rotateIdx, setRotateIdx] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Refresh when other tabs/views update the banner settings
  useEffect(() => {
    const handler = () => setSettings(read());
    window.addEventListener("storage", handler);
    window.addEventListener("focus", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("focus", handler);
    };
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (!settings.seconds || settings.history.length < 2) return;
    const id = setInterval(() => {
      setRotateIdx((i) => (i + 1) % settings.history.length);
    }, settings.seconds * 1000);
    return () => clearInterval(id);
  }, [settings.seconds, settings.history.length]);

  const displayImage =
    settings.seconds && settings.history.length > 1
      ? settings.history[rotateIdx % settings.history.length]
      : settings.image;

  const isLinked = settings.action === "url" && !!settings.url;

  const handleClick = () => {
    if (isLinked) {
      window.open(settings.url, "_blank", "noopener,noreferrer");
      return;
    }
    setViewerOpen(true);
  };

  const galleryItems: MediaItem[] = settings.history.map((url, index) => ({
    id: `banner-${index}`,
    url,
    type: "photo",
    title: index === 0 ? "Current Banner" : `Banner ${settings.history.length - index}`,
    author: "You",
  }));

  return (
    <>
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-border bg-muted shadow-sm ${className}`}
      >
        <button
          type="button"
          onClick={handleClick}
          className="block w-full aspect-[16/6] sm:aspect-[16/5] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={isLinked ? `Open ${settings.url}` : "Open banner in viewer"}
        >
          <img
            src={displayImage}
            alt="Your status banner"
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {isLinked ? (
              <>
                <ExternalLink className="h-3 w-3" />
                Open link
              </>
            ) : (
              <>
                <Maximize2 className="h-3 w-3" />
                View
              </>
            )}
          </span>
          {settings.seconds > 0 && settings.history.length > 1 && (
            <span className="pointer-events-none absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">
              Auto-rotating
            </span>
          )}
        </button>
      </div>

      <MediaGalleryViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        items={galleryItems}
        initialIndex={Math.max(
          0,
          settings.history.findIndex((u) => u === displayImage),
        )}
        galleryType="banner"
      />
    </>
  );
};

export default UserStatusBanner;
