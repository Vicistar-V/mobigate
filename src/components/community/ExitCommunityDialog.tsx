import { useState } from "react";
import { X, AlertTriangle, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { exitReasons } from "@/data/membershipData";
import { useToast } from "@/hooks/use-toast";

interface ExitCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityName?: string;
}

export function ExitCommunityDialog({ 
  open, 
  onOpenChange,
  communityName = "Community" 
}: ExitCommunityDialogProps) {
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const { toast } = useToast();

  const handleSubmitRequest = () => {
    if (!reason) {
      toast({
        title: "Reason Required",
        description: "Please select a reason for leaving",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Exit Request Submitted",
      description: "Your exit request has been submitted for review",
    });

    // Reset form
    setReason("");
    setComments("");
    setIsConfirming(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Exit Community Request
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Warning Alert */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Important:</strong> Leaving the community is a serious decision. 
              Your request will be reviewed by community administrators. You may lose 
              access to certain benefits and privileges.
            </AlertDescription>
          </Alert>

          {/* Notice Period Info */}
          <Card className="border-primary/20">
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-2">Notice Period Information</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Standard notice period: 30 days</li>
                <li>• Financial obligations must be cleared before exit</li>
                <li>• Membership benefits will cease after approval</li>
                <li>• Request can be withdrawn within 7 days</li>
              </ul>
            </CardContent>
          </Card>

          {/* Exit Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-semibold">
                Reason for Leaving <span className="text-destructive">*</span>
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {exitReasons.map((exitReason) => (
                    <SelectItem key={exitReason} value={exitReason}>
                      {exitReason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments" className="text-sm font-semibold">
                Additional Comments (Optional)
              </Label>
              <Textarea
                id="comments"
                placeholder="Please provide any additional details about your decision to leave..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Your feedback helps us improve the community for remaining members
              </p>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
            <input
              type="checkbox"
              id="confirm"
              checked={isConfirming}
              onChange={(e) => setIsConfirming(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="confirm" className="text-xs text-muted-foreground cursor-pointer">
              I understand that this is a formal exit request and that I will be required to 
              complete any outstanding obligations before my exit is finalized. I acknowledge 
              that this process may take up to 30 days.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              disabled={!reason || !isConfirming}
              onClick={handleSubmitRequest}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Submit Exit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
