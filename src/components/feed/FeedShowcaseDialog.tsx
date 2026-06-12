import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Check, Eye, Heart, MessageCircle } from "lucide-react";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";

export type FeedSortKey =
  | "newest"
  | "oldest"
  | "trending"
  | "most-viewed"
  | "most-liked";

const SORT_OPTIONS: { key: FeedSortKey; label: string; group: string }[] = [
  { key: "newest", label: "Newest first", group: "Time" },
  { key: "oldest", label: "Oldest first", group: "Time" },
  { key: "trending", label: "Most Trending", group: "Trending" },
  { key: "most-viewed", label: "Most Viewed", group: "Popularity" },
  { key: "most-liked", label: "Most Liked", group: "Popularity" },
];

const ts = (i: MediaItem) => {
  const t = Date.parse(i.timestamp || "");
  return Number.isNaN(t) ? 0 : t;
};
const engagement = (i: MediaItem) =>
  (i.likes || 0) + (i.comments || 0) + (i.views || 0);

export const sortFeedItems = (items: MediaItem[], key: FeedSortKey): MediaItem[] => {
  const arr = [...items];
  switch (key) {
    case "newest":
      return arr.sort((a, b) => ts(b) - ts(a));
    case "oldest":
      return arr.sort((a, b) => ts(a) - ts(b));
    case "trending":
      return arr.sort((a, b) => engagement(b) - engagement(a));
    case "most-viewed":
      return arr.sort((a, b) => (b.views || 0) - (a.views || 0));
    case "most-liked":
      return arr.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    default:
      return arr;
  }
};

interface FeedShowcaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: MediaItem[];
}

/**
 * A full-window gallery of every item in a feed area (Stories / Vibes & Flexing /
 * Breaking News). Includes a Filter menu to sort by Time, Trending and
 * Popularity. Tapping any thumbnail opens the rich MediaGalleryViewer.
 */
export const FeedShowcaseDialog = ({
  open,
  onOpenChange,
  title,
  items,
}: FeedShowcaseDialogProps) => {
  const [sortKey, setSortKey] = useState<FeedSortKey>("newest");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [startIdx, setStartIdx] = useState(0);

  const sorted = useMemo(() => sortFeedItems(items, sortKey), [items, sortKey]);
  const activeLabel = SORT_OPTIONS.find((o) => o.key === sortKey)?.label ?? "Sort";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl w-[96vw] h-[92dvh] p-0 gap-0 flex flex-col overflow-hidden rounded-2xl">
          <DialogHeader className="px-4 py-3 border-b shrink-0">
            <div className="flex items-center justify-between gap-2">
              <DialogTitle className="text-base sm:text-lg truncate">{title}</DialogTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Sort posts by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {SORT_OPTIONS.map((o, i) => {
                    const prevGroup = SORT_OPTIONS[i - 1]?.group;
                    return (
                      <div key={o.key}>
                        {o.group !== prevGroup && (
                          <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-muted-foreground pt-2">
                            {o.group}
                          </DropdownMenuLabel>
                        )}
                        <DropdownMenuItem
                          onClick={() => setSortKey(o.key)}
                          className="flex items-center justify-between"
                        >
                          {o.label}
                          {sortKey === o.key && <Check className="h-4 w-4 text-primary" />}
                        </DropdownMenuItem>
                      </div>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-xs text-muted-foreground text-left mt-0.5">
              {sorted.length} {sorted.length === 1 ? "post" : "posts"} · Sorted by {activeLabel}
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-3">
            {sorted.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                Nothing to show here yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sorted.map((item, idx) => (
                  <button
                    key={item.id || `${item.url}-${idx}`}
                    type="button"
                    onClick={() => {
                      setStartIdx(idx);
                      setViewerOpen(true);
                    }}
                    className="group flex flex-col text-left rounded-xl overflow-hidden border border-border bg-card active:scale-[0.98] transition-transform touch-manipulation"
                  >
                    {/* Taller-than-wide media (height ≈ 2× width) */}
                    <div className="relative w-full aspect-[1/2] bg-muted overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.title || ""}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2 space-y-1">
                      {item.title && (
                        <p className="text-xs font-semibold leading-tight line-clamp-2">{item.title}</p>
                      )}
                      <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{item.views || 0}</span>
                        <span className="flex items-center gap-0.5"><Heart className="h-3 w-3" />{item.likes || 0}</span>
                        <span className="flex items-center gap-0.5"><MessageCircle className="h-3 w-3" />{item.comments || 0}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <MediaGalleryViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        items={sorted}
        initialIndex={startIdx}
        galleryType="post"
      />
    </>
  );
};
