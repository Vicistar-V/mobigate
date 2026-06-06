// PostSundryBar — the universal post/banner action toolbar
// --------------------------------------------------------
// Renders the six "sundry" tools that apply to every post & wall-banner image
// across Mobiface: Like, Comment, Share, Follow, Gift, Report.
//
// Each tool attracts an Admin-set Service Charge (see lib/sundryCharges). When
// the user has zero / insufficient Mobi, the FundWalletPrompt opens instantly
// with a "Fund Wallet Now" call-to-action. Like/Follow use optimistic UI.

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  UserCheck,
  Gift,
  Flag,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getSundryCharge,
  SUNDRY_LABELS,
  type SundryAction,
} from "@/lib/sundryCharges";
import { useWalletBalance } from "@/hooks/useWindowData";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";
import { generateShareUrl } from "@/lib/shareUtils";
import { FundWalletPrompt } from "./FundWalletPrompt";
import { CommentDialog } from "@/components/CommentDialog";
import { ShareDialog } from "@/components/ShareDialog";
import { SendGiftDialog } from "@/components/chat/SendGiftDialog";
import { ReportPostDialog } from "./ReportPostDialog";

export interface PostSundryBarProps {
  postId: string;
  title?: string;
  description?: string;
  author: string;
  authorId?: string;
  authorImage?: string;
  imageUrl?: string;
  postType?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  followers?: number;
  isLiked?: boolean;
  isFollowing?: boolean;
  isOwner?: boolean;
  /** "overlay" = translucent buttons for banner/media; "bar" = standard row. */
  variant?: "overlay" | "bar";
  className?: string;
  /** Stops click bubbling to a parent (e.g. a clickable card). */
  stopPropagation?: boolean;
}

function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

export function PostSundryBar({
  postId,
  title,
  description,
  author,
  authorId,
  authorImage,
  imageUrl,
  postType = "Post",
  likes = 0,
  comments = 0,
  shares = 0,
  followers = 0,
  isLiked: initialLiked = false,
  isFollowing: initialFollowing = false,
  isOwner = false,
  variant = "bar",
  className,
  stopPropagation = true,
}: PostSundryBarProps) {
  const wallet = useWalletBalance();

  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [following, setFollowing] = useState(initialFollowing);
  const [followerCount, setFollowerCount] = useState(followers);
  const [commentCount, setCommentCount] = useState(comments);
  const [shareCount, setShareCount] = useState(shares);

  const [commentOpen, setCommentOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const [fundOpen, setFundOpen] = useState(false);
  const [fundContext, setFundContext] = useState<{ label: string; amount: number }>({
    label: "",
    amount: 0,
  });

  const shareUrl = generateShareUrl("post", postId || "unknown");

  /**
   * Gate a charged action behind the wallet balance.
   * Returns true if the user can proceed (sufficient funds), otherwise opens
   * the Fund Wallet prompt and returns false.
   */
  const ensureFunds = (action: SundryAction): boolean => {
    const charge = getSundryCharge(action);
    if (charge <= 0) return true;
    if ((wallet.mobi ?? 0) >= charge) return true;
    setFundContext({ label: `${SUNDRY_LABELS[action]} this ${postType.toLowerCase()}`, amount: charge });
    setFundOpen(true);
    return false;
  };

  const noteCharge = (action: SundryAction) => {
    const charge = getSundryCharge(action);
    if (charge > 0) {
      toast.message(`Service charge: ${formatMobi(charge)}`, {
        description: `Debited from your Mobi Wallet for ${SUNDRY_LABELS[action]}.`,
      });
    }
  };

  const handleLike = () => {
    if (liked) {
      // Un-like is free (reversal); no charge.
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
      return;
    }
    if (!ensureFunds("like")) return;
    setLiked(true);
    setLikeCount((c) => c + 1);
    noteCharge("like");
  };

  const handleFollow = () => {
    if (following) {
      setFollowing(false);
      setFollowerCount((c) => Math.max(0, c - 1));
      toast.success(`Unfollowed ${author}`);
      return;
    }
    if (!ensureFunds("follow")) return;
    setFollowing(true);
    setFollowerCount((c) => c + 1);
    noteCharge("follow");
    toast.success(`Now following ${author}`);
  };

  const handleComment = () => {
    if (!ensureFunds("comment")) return;
    setCommentOpen(true);
  };

  const handleShare = () => {
    if (!ensureFunds("share")) return;
    setShareOpen(true);
  };

  const handleGift = () => {
    // Gift "charge" is the gift's own value — the gift dialog runs its own
    // balance check & funding flow, so just open it.
    setGiftOpen(true);
  };

  const handleReport = () => {
    if (!ensureFunds("report")) return;
    setReportOpen(true);
  };

  const wrap = (fn: () => void) => (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
    fn();
  };

  const isOverlay = variant === "overlay";

  const btnBase = cn(
    "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all active:scale-95 touch-manipulation",
    isOverlay
      ? "bg-black/45 text-white backdrop-blur-sm hover:bg-black/65"
      : "bg-muted text-foreground hover:bg-muted/70",
  );

  const charge = (a: SundryAction) => getSundryCharge(a);

  return (
    <>
      <div
        className={cn(
          "flex flex-wrap items-center gap-1.5 sm:gap-2",
          className,
        )}
        onClick={(e) => stopPropagation && e.stopPropagation()}
      >
        {/* Like */}
        <button
          type="button"
          onClick={wrap(handleLike)}
          className={cn(btnBase, liked && (isOverlay ? "bg-red-600/80" : "bg-red-100 text-red-600"))}
          aria-label="Like"
          title={charge("like") ? `Like · ${formatMobi(charge("like"))}` : "Like"}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-current")} />
          <span>{fmtCount(likeCount)}</span>
        </button>

        {/* Comment */}
        <button
          type="button"
          onClick={wrap(handleComment)}
          className={btnBase}
          aria-label="Comment"
          title={charge("comment") ? `Comment · ${formatMobi(charge("comment"))}` : "Comment"}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{fmtCount(commentCount)}</span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={wrap(handleShare)}
          className={btnBase}
          aria-label="Share"
          title={charge("share") ? `Share · ${formatMobi(charge("share"))}` : "Share"}
        >
          <Share2 className="h-4 w-4" />
          <span>{fmtCount(shareCount)}</span>
        </button>

        {/* Follow (hidden for own posts) */}
        {!isOwner && (
          <button
            type="button"
            onClick={wrap(handleFollow)}
            className={cn(
              btnBase,
              following && (isOverlay ? "bg-primary/80" : "bg-primary/10 text-primary"),
            )}
            aria-label={following ? "Unfollow" : "Follow"}
            title={charge("follow") ? `Follow · ${formatMobi(charge("follow"))}` : "Follow"}
          >
            {following ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            <span className="hidden xs:inline sm:inline">
              {following ? "Following" : "Follow"}
            </span>
          </button>
        )}

        {/* Gift (hidden for own posts) */}
        {!isOwner && (
          <button
            type="button"
            onClick={wrap(handleGift)}
            className={cn(btnBase, isOverlay ? "" : "bg-amber-100 text-amber-700 hover:bg-amber-200")}
            aria-label="Send gift"
            title="Send a gift to the author"
          >
            <Gift className="h-4 w-4" />
            <span className="hidden xs:inline sm:inline">Gift</span>
          </button>
        )}

        {/* Report */}
        <button
          type="button"
          onClick={wrap(handleReport)}
          className={cn(btnBase, isOverlay ? "" : "hover:bg-destructive/10 hover:text-destructive")}
          aria-label="Report"
          title={charge("report") ? `Report · ${formatMobi(charge("report"))}` : "Report"}
        >
          <Flag className="h-4 w-4" />
          <span className="hidden xs:inline sm:inline">Report</span>
        </button>
      </div>

      {/* Insufficient-funds prompt */}
      <FundWalletPrompt
        open={fundOpen}
        onOpenChange={setFundOpen}
        actionLabel={fundContext.label}
        requiredAmount={fundContext.amount}
        balance={wallet.mobi ?? 0}
      />

      {/* Comment */}
      <CommentDialog
        open={commentOpen}
        onOpenChange={setCommentOpen}
        postId={postId}
        postTitle={title}
        onCommentAdded={() => setCommentCount((c) => c + 1)}
        onCommentDeleted={() => setCommentCount((c) => Math.max(0, c - 1))}
      />

      {/* Share */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={(o) => {
          setShareOpen(o);
          if (!o) setShareCount((c) => c + 1);
        }}
        shareUrl={shareUrl}
        title={title}
        description={description}
        imageUrl={imageUrl}
        author={author}
        postType={postType}
      />

      {/* Gift */}
      {!isOwner && (
        <SendGiftDialog
          isOpen={giftOpen}
          onClose={() => setGiftOpen(false)}
          recipientName={author}
          recipientId={authorId}
          onSendGift={() => setGiftOpen(false)}
        />
      )}

      {/* Report */}
      <ReportPostDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        author={author}
        postTitle={title}
        onReported={() => noteCharge("report")}
      />
    </>
  );
}
