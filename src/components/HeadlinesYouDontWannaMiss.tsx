import { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  fallbackMissedHeadlines,
  missedToArticle,
  type MissedHeadline,
  type NewsArticle,
} from "@/data/trendingHeadlines";
import { useMissedHeadlines } from "@/hooks/useWindowData";
import { NewsArticleDrawer } from "./NewsArticleDrawer";

export const HeadlinesYouDontWannaMiss = () => {
  const phpHeadlines = useMissedHeadlines() as MissedHeadline[] | null;
  const headlines =
    phpHeadlines && phpHeadlines.length > 0 ? phpHeadlines : fallbackMissedHeadlines;

  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [readerOpen, setReaderOpen] = useState(false);

  const openArticle = (item: MissedHeadline) => {
    setActiveArticle(missedToArticle(item));
    setReaderOpen(true);
  };

  return (
    <section className="mt-6" aria-label="Headlines you don't wanna miss">
      <h2 className="mb-3 text-base font-extrabold text-destructive sm:text-lg">
        Headlines you don&apos;t wanna miss!
      </h2>

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {headlines.map((item) => (
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

      <NewsArticleDrawer
        article={activeArticle}
        open={readerOpen}
        onOpenChange={setReaderOpen}
      />
    </section>
  );
};
