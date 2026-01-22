import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ElectionCandidate } from "@/data/electionData";

interface ChangeVoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previousCandidate: ElectionCandidate | null;
  newCandidate: ElectionCandidate | null;
  officeName: string;
  timeRemainingMinutes: number;
  onConfirm: () => void;
}

export const ChangeVoteDialog = ({
  open,
  onOpenChange,
  previousCandidate,
  newCandidate,
  officeName,
  timeRemainingMinutes,
  onConfirm,
}: ChangeVoteDialogProps) => {
  const isMobile = useIsMobile();

  if (!previousCandidate || !newCandidate) return null;

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

  const formatTimeRemaining = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const content = (
    <div className="flex flex-col">
      {/* Warning Icon */}
      <div className="flex justify-center py-6">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center">
          <RefreshCw className="w-10 h-10 text-amber-500" />
        </div>
      </div>

      {/* Vote Change Visualization */}
      <div className="flex items-center justify-center gap-3 px-4 mb-4">
        {/* Previous Candidate */}
        <div className="flex flex-col items-center">
          <Avatar className={`h-14 w-14 ${getCandidateColorClass(previousCandidate.color)} opacity-60`}>
            <AvatarFallback className="text-white text-base font-bold">
              {previousCandidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs text-muted-foreground mt-2 text-center max-w-[80px] line-clamp-2">
            {previousCandidate.name}
          </p>
          <span className="text-xs text-red-500 font-medium">Previous</span>
        </div>

        {/* Arrow */}
        <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />

        {/* New Candidate */}
        <div className="flex flex-col items-center">
          <Avatar className={`h-14 w-14 ${getCandidateColorClass(newCandidate.color)} ring-2 ring-primary ring-offset-2`}>
            <AvatarFallback className="text-white text-base font-bold">
              {newCandidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs text-foreground mt-2 text-center max-w-[80px] line-clamp-2 font-medium">
            {newCandidate.name}
          </p>
          <span className="text-xs text-primary font-medium">New Vote</span>
        </div>
      </div>

      {/* Time Remaining Badge */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 px-3 py-1.5 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4" />
          {formatTimeRemaining(timeRemainingMinutes)} remaining to change
        </div>
      </div>

      {/* Warning Message */}
      <div className="px-4 pb-6">
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed">
              <p className="mb-2">
                You are about to change your vote from <span className="font-bold">{previousCandidate.name}</span> to{" "}
                <span className="font-bold">{newCandidate.name}</span> for the office of{" "}
                <span className="font-bold">{officeName}</span>.
              </p>
              <p className="text-amber-600 dark:text-amber-400 font-medium">
                This will cancel your previous vote.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        <Button 
          className="w-full h-12 text-base font-semibold bg-amber-500 hover:bg-amber-600"
          onClick={handleConfirm}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Change Vote
        </Button>
        <Button 
          variant="outline"
          className="w-full h-11"
          onClick={() => onOpenChange(false)}
        >
          Keep Previous Vote
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
              <RefreshCw className="w-5 h-5 text-amber-500" />
              Change Your Vote
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
            <RefreshCw className="w-5 h-5 text-amber-500" />
            Change Your Vote
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
