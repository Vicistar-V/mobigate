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
        compact ? "p-3" : "p-3.5"
      } space-y-2`}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <Coins className="h-5 w-5 text-amber-600 shrink-0" />
        <p className="text-base font-bold text-foreground">
          Content Posting Fee
        </p>
        <span className="ml-auto text-[11px] uppercase tracking-wide font-bold text-amber-700 bg-amber-500/15 px-2 py-0.5 rounded">
          {motion ? "Video / Audio" : "Still Media"}
        </span>
      </div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl font-bold text-foreground whitespace-nowrap">
          M{fee.toLocaleString()}
        </span>
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          (range M{min} – M{max})
        </span>
      </div>
      {isPhoto && (
        <div className="rounded-md bg-amber-500/10 border border-amber-500/30 px-2.5 py-2">
          <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Images className="h-4 w-4 text-amber-700 shrink-0" />
            {safeCount} of {MAX_IMAGES_PER_POST} image{safeCount === 1 ? "" : "s"} attached
          </p>
          <p className="text-[13px] text-muted-foreground leading-snug mt-1">
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
      <p className="text-[13px] text-foreground leading-relaxed flex items-start gap-1.5">
        <Wallet className="h-4 w-4 mt-0.5 shrink-0 text-amber-700" />
        <span>
          M{fee.toLocaleString()} will be debited from your{" "}
          <span className="font-bold text-foreground">Mobi Wallet</span> when
          you publish this {mediaType.toString().toLowerCase()}. This payment is
          non-refundable.
        </span>
      </p>
      {!compact && (
        <p className="text-[13px] text-muted-foreground leading-relaxed flex items-start gap-1.5">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            Visitors can pay your Access Fee (M5 – M100) to view this content –
            you earn from every paid view.
          </span>
        </p>
      )}
    </div>
  );
};
