import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RejectionReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentTitle: string;
  onConfirm: (reason: string, notifyAuthor: boolean) => void;
}

const predefinedReasons = [
  "Content violates community guidelines",
  "Inappropriate or offensive content",
  "Misleading or inaccurate information",
  "Poor quality or formatting issues",
  "Duplicate content",
  "Copyright or intellectual property concerns",
  "Requires additional information or context",
  "Other (please specify)"
];

export function RejectionReasonDialog({
  open,
  onOpenChange,
  contentTitle,
  onConfirm
}: RejectionReasonDialogProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [notifyAuthor, setNotifyAuthor] = useState(true);

  const handleConfirm = () => {
    const finalReason = selectedReason === "Other (please specify)" 
      ? customReason 
      : selectedReason;
    
    if (finalReason.trim()) {
      onConfirm(finalReason, notifyAuthor);
      resetForm();
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setSelectedReason("");
    setCustomReason("");
    setNotifyAuthor(true);
  };

  const isValid = selectedReason && (selectedReason !== "Other (please specify)" || customReason.trim());

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Reject Content
          </DialogTitle>
          <DialogDescription className="text-left">
            Please provide a reason for rejecting <span className="font-medium">"{contentTitle}"</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Rejection Reason</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                {predefinedReasons.map(reason => (
                  <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedReason === "Other (please specify)" && (
            <div className="space-y-2">
              <Label>Custom Reason</Label>
              <Textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please explain why this content is being rejected..."
                rows={3}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Notify Author</Label>
              <p className="text-xs text-muted-foreground">Send email notification to the content author</p>
            </div>
            <Switch checked={notifyAuthor} onCheckedChange={setNotifyAuthor} />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!isValid}
            className="flex-1"
          >
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
