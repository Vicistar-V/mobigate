// ReportPostDialog — report a post or its author
// ----------------------------------------------
// Lightweight reason-picker used by the universal PostSundryBar. Reporting
// attracts an Admin-set service charge (handled by the caller). Optimistic:
// confirms instantly and closes.

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";

interface ReportPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  author: string;
  postTitle?: string;
  onReported?: () => void;
}

const REASONS = [
  "Spam or misleading",
  "Harassment or hate speech",
  "Nudity or sexual content",
  "Violence or dangerous acts",
  "Scam or fraud",
  "Intellectual property violation",
  "Other",
];

export function ReportPostDialog({
  open,
  onOpenChange,
  author,
  postTitle,
  onReported,
}: ReportPostDialogProps) {
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState("");

  const submit = () => {
    if (!reason) {
      toast.error("Please select a reason for reporting.");
      return;
    }
    // Optimistic confirmation.
    onReported?.();
    toast.success("Report submitted", {
      description: `Thanks — our team will review this ${postTitle ? "post" : "content"}.`,
    });
    setReason(null);
    setDetails("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Flag className="h-4 w-4 text-destructive" />
            Report {postTitle ? "Post" : "Author"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Let us know what's wrong with {postTitle ? "this post" : `${author}'s content`}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setReason(r)}
              className={cn(
                "w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors",
                reason === r
                  ? "border-destructive bg-destructive/5 text-destructive font-medium"
                  : "hover:bg-muted",
              )}
            >
              {r}
            </button>
          ))}
        </div>

        <Textarea
          placeholder="Add more details (optional)…"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          className="resize-none text-sm"
        />

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={submit}>
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
