import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ThumbStripItem {
  id?: string;
  imageUrl: string;
  title?: string;
}

interface ScrollableThumbStripProps {
  items: ThumbStripItem[];
  activeIdx: number;
  onSelect: (idx: number) => void;
  /** The italic underlined label in the middle of the footer (e.g. "Enjoy more exciting stories"). */
  moreLabel: string;
  /** Fired when the user taps the center text — opens the full media gallery. */
  onSeeAll: () => void;
  /** Tailwind HSL token used to tint active borders/arrows, e.g. "212 95% 50%". */
  accent?: string;
}

/**
 * A horizontally scrollable thumbnail strip with real Play-style scroll
 * arrows (◄ / ►). Each arrow is genuinely interactive: it scrolls the strip
 * and visually dims when there is nothing left to scroll in that direction.
 * The center label opens a larger gallery window with every media item.
 */
export const ScrollableThumbStrip = ({
  items,
  activeIdx,
  onSelect,
  moreLabel,
  onSeeAll,
  accent = "212 95% 50%",
}: ScrollableThumbStripProps) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  // Auto-scroll is paused briefly whenever the user interacts with the strip.
  const pausedUntilRef = useRef(0);

  // Re-evaluate which direction still has hidden content.
  const updateScrollState = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // A small tolerance avoids sub-pixel rounding flicker.
    setCanLeft(scrollLeft > 2);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = stripRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, items.length]);

  // ── Auto-scroll (marquee): content drifts from right → left continuously.
  //    Pauses while the user touches/hovers and loops back to the start.
  useEffect(() => {
    const el = stripRef.current;
    if (!el || items.length <= 1) return;

    const pause = () => { pausedUntilRef.current = Date.now() + 2500; };
    el.addEventListener("pointerdown", pause, { passive: true });
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("wheel", pause, { passive: true });
    el.addEventListener("mouseenter", pause);

    const id = window.setInterval(() => {
      if (Date.now() < pausedUntilRef.current) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      // Loop back to the beginning once we reach the end.
      el.scrollLeft = el.scrollLeft >= max - 1 ? 0 : el.scrollLeft + 1;
    }, 30);

    return () => {
      window.clearInterval(id);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("wheel", pause);
      el.removeEventListener("mouseenter", pause);
    };
  }, [items.length]);

  // Keep the active thumbnail visible when it changes (e.g. via arrows above).
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const active = el.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    // Recompute after the smooth scroll settles.
    const t = setTimeout(updateScrollState, 350);
    return () => clearTimeout(t);
  }, [activeIdx, updateScrollState]);

  const scrollByAmount = (dir: "left" | "right") => {
    const el = stripRef.current;
    if (el) {
      const amount = Math.max(el.clientWidth * 0.7, 140);
      el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
    // Always advance the featured selection too, so the arrows are useful even
    // when every thumbnail already fits on screen (no horizontal overflow).
    if (items.length > 1) {
      const next =
        dir === "left"
          ? (activeIdx - 1 + items.length) % items.length
          : (activeIdx + 1) % items.length;
      onSelect(next);
    }
  };

  if (!items.length) return null;

  return (
    <div className="mt-2 rounded-lg border border-border bg-card/50 p-1.5">
      {/* Thumbnail row */}
      <div
        ref={stripRef}
        className="flex flex-row gap-2 overflow-x-auto overflow-y-hidden touch-pan-x overscroll-x-contain snap-x snap-mandatory [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((post, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={`thumb-${i}-${post.id ?? i}`}
              type="button"
              data-active={isActive}
              onClick={() => onSelect(i)}
              className={`relative shrink-0 h-16 w-16 snap-start rounded-md overflow-hidden bg-muted active:scale-95 transition-all touch-manipulation ${
                isActive
                  ? "ring-2 ring-red-500 border-2 border-red-500 shadow-md scale-[1.04]"
                  : "border border-foreground/30 opacity-90 hover:opacity-100"
              }`}
              aria-label={`Show ${post.title || "item"} in big view`}
              aria-pressed={isActive}
            >
              <img
                src={post.imageUrl}
                alt={post.title || ""}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 bg-red-600 text-white text-[9px] font-bold text-center py-0.5">
                  Showing
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer: ◄  see-all text  ► */}
      <div className="mt-2 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollByAmount("left")}
          aria-label="Previous story"
          className="h-8 w-8 rounded-full border flex items-center justify-center transition-all touch-manipulation bg-foreground text-background border-foreground shadow-md active:scale-90"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={3} />
        </button>

        <button
          type="button"
          onClick={onSeeAll}
          className="italic font-bold underline underline-offset-2 text-[13px] text-center leading-tight px-1 active:opacity-70 touch-manipulation"
          style={{ color: `hsl(${accent})` }}
        >
          {moreLabel}
        </button>

        <button
          type="button"
          onClick={() => scrollByAmount("right")}
          aria-label="Next story"
          className="h-8 w-8 rounded-full border flex items-center justify-center transition-all touch-manipulation bg-foreground text-background border-foreground shadow-md active:scale-90"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
