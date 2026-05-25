import { Coins, Wallet, Info } from "lucide-react";
import {
  getNonMonetizedPostFee,
  type NonMonetizedPostType,
} from "@/data/monetizationPolicy";

interface NonMonetizedPostFeeNoticeProps {
  /** Post media type (Photo / Video / Audio / Article / PDF / URL). */
  mediaType: NonMonetizedPostType | string;
  /** Compact variant for tight drawers. */
  compact?: boolean;
}

const ICON_BY_TYPE: Record<string, string> = {
  Video: "🎬",
  Audio: "🎵",
  Photo: "📷",
  Article: "📝",
  PDF: "📄",
  URL: "🔗",
};

/**
 * Notice shown when a post is being published as NON-MONETIZED.
 * Charges a small per-type fee from creator's Mobi Wallet.
 * Revenue is retained 100% by the platform (no creator royalty).
 */
export const NonMonetizedPostFeeNotice = ({
  mediaType,
  compact = false,
}: NonMonetizedPostFeeNoticeProps) => {
  const fee = getNonMonetizedPostFee(mediaType);
  const icon = ICON_BY_TYPE[String(mediaType)] ?? "📌";

  return (
    <div
      className={`rounded-lg border border-sky-500/30 bg-sky-500/5 ${
        compact ? "p-3" : "p-3.5"
      } space-y-2`}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <Coins className="h-5 w-5 text-sky-600 shrink-0" />
        <p className="text-sm sm:text-base font-bold text-foreground">
          Free Post — Posting Fee
        </p>
        <span className="ml-auto text-[10px] uppercase tracking-wide font-bold text-sky-700 bg-sky-500/15 px-2 py-0.5 rounded">
          Not Monetized
        </span>
      </div>

      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-xl sm:text-2xl font-bold text-foreground whitespace-nowrap">
          {fee.toLocaleString()} Mobi
        </span>
        <span className="text-xs sm:text-sm font-medium text-muted-foreground">
          for {icon} {String(mediaType)}
        </span>
      </div>

      <p className="text-[12px] sm:text-[13px] text-foreground leading-snug flex items-start gap-1.5">
        <Wallet className="h-4 w-4 mt-0.5 shrink-0 text-sky-700" />
        <span>
          <strong>{fee.toLocaleString()} Mobi</strong> will be debited from your{" "}
          <span className="font-bold">Mobi Wallet</span> on publish. The post will be visible
          to everyone — no Access Fee.
        </span>
      </p>

      {!compact && (
        <p className="text-[11px] sm:text-[12px] text-muted-foreground leading-snug flex items-start gap-1.5">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            Because this post is not monetized, all token revenue is retained by the platform.
            Switch on <strong>Monetize this post</strong> above to earn royalties from your content.
          </span>
        </p>
      )}
    </div>
  );
};
