import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { leaveCommunity } from "@/hooks/useCommunity";

interface ExitCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId?: string;
  communityName?: string;
  onLeft?: () => void;
}

export function ExitCommunityDialog({
  open, onOpenChange, communityId, communityName = "this community", onLeft,
}: ExitCommunityDialogProps) {
  const { toast }   = useToast();
  const [leaving, setLeaving] = useState(false);

  const handleConfirm = async () => {
    if (!communityId) return;
    setLeaving(true);
    try {
      const ok = await leaveCommunity(communityId);
      if (ok) {
        toast({ title: "Left community", description: `You have left ${communityName}.` });
        onLeft?.();
        onOpenChange(false);
      } else {
        toast({ title: "Error", description: "Could not leave community. Try again.", variant: "destructive" });
      }
    } finally { setLeaving(false); }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-destructive" />
            Leave {communityName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will lose access to members-only content and your member status.
            You can apply to rejoin at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={leaving}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleConfirm} disabled={leaving}>
            {leaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Leaving...</> : "Yes, Leave"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
