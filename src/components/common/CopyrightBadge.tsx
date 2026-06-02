/**
 * components/common/CopyrightBadge.tsx
 *
 * The "✓Copyright" designation marker shown on the bottom-right of copyrighted
 * post media (images / videos), matching the Mobigate design.
 *
 * Render it inside a `relative` media container. Authors can disable the marker
 * per-post (post.copyrightMarked === false) — when disabled, render nothing.
 */

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyrightBadgeProps {
  /** Size variant — "sm" for cards/thumbnails, "md" for full media viewers */
  size?: "sm" | "md";
  className?: string;
}

export const CopyrightBadge = ({ size = "sm", className }: CopyrightBadgeProps) => {
  const isMd = size === "md";
  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-2 right-2 z-10 flex items-center gap-1 font-semibold text-white",
        "drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] select-none",
        isMd ? "text-2xl sm:text-3xl gap-1.5" : "text-xs gap-0.5",
        className,
      )}
      aria-label="Copyright protected content"
      title="Copyright protected — registered with Mobigate"
    >
      <Check className={cn("shrink-0", isMd ? "h-6 w-6 sm:h-7 sm:w-7" : "h-3.5 w-3.5")} strokeWidth={3} />
      <span className="tracking-tight">Copyright</span>
    </div>
  );
};
