import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Vote, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ElectionCandidate } from "@/data/electionData";

interface VoteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: ElectionCandidate | null;
  officeName: string;
  onConfirm: () => void;
}

export const VoteConfirmationDialog = ({
  open,
  onOpenChange,
  candidate,
  officeName,
  onConfirm,
}: VoteConfirmationDialogProps) => {
  const isMobile = useIsMobile();

  if (!candidate) return null;

  const getCandidateColorClass = (color: string) => {
    const colorMap = {
      green: 'bg-green-500',
      purple: 'bg-purple-600',
      magenta: 'bg-pink-500',
      orange: 'bg-orange-500',
      blue: 'bg-blue-500',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const content = (
    <div className="flex flex-col">
      {/* Warning Icon */}
      <div className="flex justify-center py-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Vote className="w-10 h-10 text-primary" />
        </div>
      </div>

      {/* Candidate Info */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Avatar className={`h-12 w-12 ${getCandidateColorClass(candidate.color)}`}>
          <AvatarFallback className="text-white text-lg font-bold">
            {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-left">
          <h3 className="font-bold text-lg">{candidate.name}</h3>
          <p className="text-sm text-muted-foreground">{officeName}</p>
        </div>
      </div>

      {/* Confirmation Message */}
      <div className="px-4 pb-6">
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              You are about to Vote <span className="font-bold text-foreground">{candidate.name}</span> for 
              the office of <span className="font-bold text-foreground">{officeName}</span> of this Community.
              To confirm, please click <span className="font-semibold text-primary">'Vote Now'</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        <Button 
          className="w-full h-12 text-base font-semibold"
          onClick={handleConfirm}
        >
          <Vote className="w-5 h-5 mr-2" />
          Vote Now
        </Button>
        <Button 
          variant="outline"
          className="w-full h-11"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle className="flex items-center justify-center gap-2 text-lg">
              <Vote className="w-5 h-5 text-primary" />
              Confirm Your Vote
            </DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center justify-center gap-2 text-lg">
            <Vote className="w-5 h-5 text-primary" />
            Confirm Your Vote
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
