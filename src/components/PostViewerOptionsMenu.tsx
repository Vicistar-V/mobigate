/**
 * components/PostViewerOptionsMenu.tsx
 *
 * The viewer-side "..." options menu shown on a post you are VIEWING (not your own).
 * Actions: Rate Post, Hide Post, Report Post, Block Author.
 *
 * All actions use optimistic UI — the menu closes and a toast confirms instantly,
 * matching the rest of Mobiface. Compatible with the existing PHP backend: the
 * optional callbacks let the parent fire the real network request.
 */

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Star, EyeOff, Flag, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PostViewerOptionsMenuProps {
  authorName: string;
  /** Optional: fired after optimistic UI so the parent can hit the PHP backend. */
  onRate?: (rating: number) => void;
  onHide?: () => void;
  onReport?: (reason: string) => void;
  onBlock?: () => void;
  className?: string;
}

const REPORT_REASONS = [
  "Spam or misleading",
  "Nudity or sexual content",
  "Hate speech or harassment",
  "Violence or dangerous acts",
  "False information",
  "Intellectual property violation",
  "Other",
];

export const PostViewerOptionsMenu = ({
  authorName,
  onRate,
  onHide,
  onReport,
  onBlock,
  className,
}: PostViewerOptionsMenuProps) => {
  const [showRate, setShowRate] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reportReason, setReportReason] = useState<string>("");
  const [reportDetails, setReportDetails] = useState("");

  const submitRating = () => {
    if (rating < 1) {
      toast.error("Please select a star rating first.");
      return;
    }
    setShowRate(false);
    toast.success(`Thanks! You rated this post ${rating} ★`);
    onRate?.(rating);
  };

  const handleHide = () => {
    toast.success("Post hidden. You won't see it again.");
    onHide?.();
  };

  const submitReport = () => {
    if (!reportReason) {
      toast.error("Please choose a reason for reporting.");
      return;
    }
    setShowReport(false);
    toast.success("Report submitted. Thank you for keeping Mobiface safe.");
    onReport?.(reportReason + (reportDetails ? ` — ${reportDetails}` : ""));
    setReportReason("");
    setReportDetails("");
  };

  const confirmBlock = () => {
    setShowBlock(false);
    toast.success(`${authorName} has been blocked.`);
    onBlock?.();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full bg-background/85 backdrop-blur-sm shadow-md border border-border hover:bg-background active:scale-95 transition-all",
              className,
            )}
            aria-label="Post options"
          >
            <MoreHorizontal className="h-5 w-5 text-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="w-52">
          <DropdownMenuItem onClick={() => setShowRate(true)} className="cursor-pointer">
            <Star className="mr-2 h-4 w-4" />
            Rate Post
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleHide} className="cursor-pointer">
            <EyeOff className="mr-2 h-4 w-4" />
            Hide Post
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowReport(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Flag className="mr-2 h-4 w-4" />
            Report Post
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowBlock(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <UserX className="mr-2 h-4 w-4" />
            Block Author
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rate Post */}
      <Dialog open={showRate} onOpenChange={setShowRate}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Rate this Post
            </DialogTitle>
            <DialogDescription>
              Tap a star to rate the quality of this content.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="touch-manipulation active:scale-90 transition-transform"
                aria-label={`${star} star`}
              >
                <Star
                  className={cn(
                    "h-9 w-9 transition-colors",
                    (hoverRating || rating) >= star
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground",
                  )}
                />
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRate(false)}>
              Cancel
            </Button>
            <Button onClick={submitRating}>Submit Rating</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Post */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-destructive" />
              Report Post
            </DialogTitle>
            <DialogDescription>
              Why are you reporting this post? Your report is anonymous.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-1">
            {REPORT_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => setReportReason(reason)}
                className={cn(
                  "w-full text-left text-sm rounded-lg border px-3 py-2.5 transition-colors touch-manipulation",
                  reportReason === reason
                    ? "border-destructive bg-destructive/10 text-destructive font-medium"
                    : "border-border hover:bg-muted",
                )}
              >
                {reason}
              </button>
            ))}
            <Textarea
              placeholder="Add more details (optional)"
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              className="mt-2 min-h-[72px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReport(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitReport}>
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Author */}
      <AlertDialog open={showBlock} onOpenChange={setShowBlock}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block {authorName}?</AlertDialogTitle>
            <AlertDialogDescription>
              You won't see posts, comments or messages from {authorName} anymore.
              You can unblock them later from your settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBlock}
              className="bg-destructive hover:bg-destructive/90"
            >
              Block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
