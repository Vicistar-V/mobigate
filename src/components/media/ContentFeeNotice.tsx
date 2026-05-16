import { Coins, Wallet, Info } from "lucide-react";
import {
  getContentPostingFee,
  getContentPostingFeeRange,
  isMotionMedia,
  type ContentMediaType,
} from "@/data/platformSettingsData";

interface ContentFeeNoticeProps {
  mediaType: ContentMediaType | string;
  /** Compact variant for tight drawers */
  compact?: boolean;
}

/**
 * Displays the Content Posting Fee that will be debited from the creator's
 * Mobi Wallet when this piece of content is published.
 *
 * Video / Audio media: M300 – M500.
 * Still media (Photo / Article / News / PDF / URL): M200 – M300.
 */
export const ContentFeeNotice = ({ mediaType, compact = false }: ContentFeeNoticeProps) => {
  const fee = getContentPostingFee(mediaType);
  const { min, max } = getContentPostingFeeRange(mediaType);
  const motion = isMotionMedia(mediaType);

  return (
    <div
      className={`rounded-lg border border-amber-500/40 bg-amber-500/5 ${
        compact ? "p-2.5" : "p-3"
      } space-y-1.5`}
    >
      <div className="flex items-center gap-2">
        <Coins className="h-4 w-4 text-amber-600 shrink-0" />
        <p className="text-sm font-semibold text-foreground">
          Content Posting Fee
        </p>
        <span className="ml-auto text-[10px] uppercase tracking-wide font-semibold text-amber-700 bg-amber-500/15 px-1.5 py-0.5 rounded">
          {motion ? "Video / Audio" : "Still Media"}
        </span>
      </div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-lg font-bold text-foreground whitespace-nowrap">
          M{fee.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          (range M{min} – M{max})
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-snug flex items-start gap-1">
        <Wallet className="h-3 w-3 mt-0.5 shrink-0" />
        <span>
          M{fee.toLocaleString()} will be debited from your{" "}
          <span className="font-semibold text-foreground">Mobi Wallet</span> when
          you publish this {mediaType.toString().toLowerCase()}. This payment is
          non-refundable.
        </span>
      </p>
      {!compact && (
        <p className="text-[10px] text-muted-foreground/80 leading-snug flex items-start gap-1">
          <Info className="h-3 w-3 mt-0.5 shrink-0" />
          <span>
            Visitors can pay your Access Fee (M5 – M100) to view this content –
            you earn from every paid view.
          </span>
        </p>
      )}
    </div>
  );
};
