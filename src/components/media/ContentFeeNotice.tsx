import { Coins, Wallet, Info, Images } from "lucide-react";
import {
  getContentPostingFee,
  getContentPostingFeeForCount,
  getContentPostingFeeRange,
  isMotionMedia,
  EXTRA_IMAGE_FEE,
  MAX_IMAGES_PER_POST,
  type ContentMediaType,
} from "@/data/platformSettingsData";

interface ContentFeeNoticeProps {
  mediaType: ContentMediaType | string;
  /** Number of images attached (Photo posts only). Defaults to 1. */
  imageCount?: number;
  /** Compact variant for tight drawers */
  compact?: boolean;
}

/**
 * Displays the Content Posting Fee that will be debited from the creator's
 * Mobi Wallet when this piece of content is published.
 *
 * Video / Audio media: M300 – M500.
 * Still media (Photo / Article / News / PDF / URL): M200 – M300.
 * Photo posts scale by image count: 1 = M200, 2 = M250, 3 = M300.
 */
export const ContentFeeNotice = ({
  mediaType,
  imageCount = 1,
  compact = false,
}: ContentFeeNoticeProps) => {
  const baseFee = getContentPostingFee(mediaType);
  const fee = getContentPostingFeeForCount(mediaType, imageCount);
  const { min, max } = getContentPostingFeeRange(mediaType);
  const motion = isMotionMedia(mediaType);
  const isPhoto = mediaType === "Photo";
  const safeCount = Math.max(1, Math.min(MAX_IMAGES_PER_POST, imageCount || 1));
  const extras = isPhoto ? safeCount - 1 : 0;

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
      {isPhoto && (
        <div className="rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-1.5">
          <p className="text-[11px] font-semibold text-foreground flex items-center gap-1">
            <Images className="h-3 w-3 text-amber-700 shrink-0" />
            {safeCount} of {MAX_IMAGES_PER_POST} image{safeCount === 1 ? "" : "s"} attached
          </p>
          <p className="text-[10.5px] text-muted-foreground leading-snug mt-0.5">
            Base M{baseFee.toLocaleString()}
            {extras > 0 && (
              <>
                {" "}+ {extras} extra image{extras === 1 ? "" : "s"} × M{EXTRA_IMAGE_FEE}
                {" "}= <span className="font-semibold text-foreground">M{fee.toLocaleString()}</span>
              </>
            )}
            {extras === 0 && (
              <>
                {" "}· add up to {MAX_IMAGES_PER_POST - safeCount} more (+M{EXTRA_IMAGE_FEE} each)
              </>
            )}
          </p>
        </div>
      )}
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
