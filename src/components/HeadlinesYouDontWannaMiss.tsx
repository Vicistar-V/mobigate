import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
  fallbackMissedHeadlines,
  missedToArticle,
  type MissedHeadline,
  type NewsArticle,
} from "@/data/trendingHeadlines";
import { useMissedHeadlines } from "@/hooks/useWindowData";
import { NewsArticleDrawer } from "./NewsArticleDrawer";

const INITIAL_VISIBLE = 3;
const STEP = 3;

export const HeadlinesYouDontWannaMiss = () => {
  const phpHeadlines = useMissedHeadlines() as MissedHeadline[] | null;
  const headlines =
    phpHeadlines && phpHeadlines.length > 0 ? phpHeadlines : fallbackMissedHeadlines;

  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [readerOpen, setReaderOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const openArticle = (item: MissedHeadline) => {
    setActiveArticle(missedToArticle(item));
    setReaderOpen(true);
  };

  const visibleHeadlines = headlines.slice(0, visibleCount);
  const remaining = headlines.length - visibleCount;
  const allShown = remaining <= 0;

  const showMore = () =>
    setVisibleCount((c) => Math.min(c + STEP, headlines.length));
  const showLess = () => setVisibleCount(INITIAL_VISIBLE);

  return (
    <section className="mt-6" aria-label="Headlines you don't wanna miss">
      <h2 className="mb-3 text-base font-extrabold text-destructive sm:text-lg">
        Headlines you don&apos;t wanna miss!
      </h2>

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {visibleHeadlines.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => openArticle(item)}
            className="flex w-full gap-3 p-3 text-left active:bg-muted/50 transition-colors touch-manipulation"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[13px] font-bold leading-snug text-foreground line-clamp-2">
                {item.title}
              </h3>
              <p className="mt-1 text-[12px] leading-snug text-muted-foreground line-clamp-2">
                {item.excerpt}
              </p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{item.timeAgo}</span>
                <span className="inline-flex items-center gap-0.5 text-[12px] font-bold text-destructive">
                  ...More!
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {headlines.length > INITIAL_VISIBLE && (
        <button
          type="button"
          onClick={allShown ? showLess : showMore}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-3 text-[13px] font-bold text-primary active:bg-muted/50 transition-colors touch-manipulation"
        >
          {allShown ? (
            <>
              Show less
              <ChevronDown className="h-4 w-4 rotate-180" />
            </>
          ) : (
            <>
              View More Exciting Headlines
              <span className="text-muted-foreground">({remaining})</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}

      <NewsArticleDrawer
        article={activeArticle}
        open={readerOpen}
        onOpenChange={setReaderOpen}
      />
    </section>
  );
};
