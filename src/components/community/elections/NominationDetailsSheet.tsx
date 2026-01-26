import { useState } from "react";
import {
  UserPlus,
  ThumbsUp,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Award,
  Vote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Nomination } from "@/types/electionProcesses";
import { cn } from "@/lib/utils";

const getStatusBadge = (status: Nomination["status"]) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-emerald-500 text-white text-xs">Approved</Badge>
      );
    case "pending_approval":
      return <Badge className="bg-amber-500 text-white text-xs">Pending</Badge>;
    case "rejected":
      return <Badge className="bg-red-500 text-white text-xs">Rejected</Badge>;
    default:
      return null;
  }
};

interface NominationDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomination: Nomination | null;
  isCurrentUserNominee?: boolean;
  hasEndorsed?: boolean;
  onEndorse?: (nominationId: string) => void;
  onAccept?: (nominationId: string) => void;
  onDecline?: (nominationId: string) => void;
}

export function NominationDetailsSheet({
  open,
  onOpenChange,
  nomination,
  isCurrentUserNominee = false,
  hasEndorsed = false,
  onEndorse,
  onAccept,
  onDecline,
}: NominationDetailsSheetProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isEndorsing, setIsEndorsing] = useState(false);
  const [localHasEndorsed, setLocalHasEndorsed] = useState(hasEndorsed);

  if (!nomination) return null;

  const handleEndorse = () => {
    setIsEndorsing(true);
    setTimeout(() => {
      setLocalHasEndorsed(true);
      setIsEndorsing(false);
      toast({
        title: "Endorsement Added!",
        description: `You endorsed ${nomination.nomineeName} for ${nomination.officeName}`,
      });
      onEndorse?.(nomination.id);
    }, 500);
  };

  const handleAccept = () => {
    toast({
      title: "Nomination Accepted",
      description: "You have accepted this nomination",
    });
    onAccept?.(nomination.id);
    onOpenChange(false);
  };

  const handleDecline = () => {
    toast({
      title: "Nomination Declined",
      description: "You have declined this nomination",
      variant: "destructive",
    });
    onDecline?.(nomination.id);
    onOpenChange(false);
  };

  const Content = () => (
    <ScrollArea className="flex-1 overflow-y-auto touch-auto px-4 pb-6">
      <div className="space-y-4">
        {/* Nominee Info Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={nomination.nomineeAvatar} />
                <AvatarFallback className="text-lg">
                  {nomination.nomineeName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg leading-tight">
                  {nomination.nomineeName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Vote className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {nomination.officeName}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(nomination.status)}
                  {nomination.isSelfNomination && (
                    <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                      <User className="h-3 w-3 mr-1" />
                      Self-Nominated
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nomination Details */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Nominated By
              </span>
              <span className="font-medium text-sm">
                {nomination.isSelfNomination
                  ? "Self"
                  : nomination.nominatedByName}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Nominated
              </span>
              <span className="font-medium text-sm">
                {format(nomination.nominatedAt, "MMM d, yyyy")}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                Endorsements
              </span>
              <span className="font-bold text-primary text-base">
                {nomination.endorsementsCount + (localHasEndorsed && !hasEndorsed ? 1 : 0)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Nominee Response
              </span>
              <span className="font-medium text-sm">
                {nomination.acceptedByNominee ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Accepted
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Awaiting
                  </span>
                )}
              </span>
            </div>

            {nomination.acceptedAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Accepted On</span>
                <span className="font-medium text-sm">
                  {format(nomination.acceptedAt, "MMM d, yyyy")}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Qualification Status */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Qualification Status
            </h4>
            {nomination.qualificationStatus === "qualified" && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Qualified for Election</span>
              </div>
            )}
            {nomination.qualificationStatus === "pending" && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Qualification Pending</span>
              </div>
            )}
            {nomination.qualificationStatus === "disqualified" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                  <XCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Disqualified</span>
                </div>
                {nomination.disqualificationReason && (
                  <p className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
                    <strong>Reason:</strong> {nomination.disqualificationReason}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {/* Endorsement button for non-nominees */}
          {!isCurrentUserNominee && nomination.status === "approved" && (
            <Button
              onClick={handleEndorse}
              disabled={localHasEndorsed || isEndorsing}
              className={cn(
                "w-full h-12 text-base",
                localHasEndorsed
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  : "bg-gradient-to-r from-primary to-primary/80"
              )}
            >
              {localHasEndorsed ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Endorsed
                </>
              ) : isEndorsing ? (
                "Endorsing..."
              ) : (
                <>
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  Endorse This Candidate
                </>
              )}
            </Button>
          )}

          {/* Accept/Decline buttons for the nominee */}
          {isCurrentUserNominee && !nomination.acceptedByNominee && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleDecline}
                className="flex-1 h-12 text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="h-5 w-5 mr-2" />
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Accept
              </Button>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] flex flex-col">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Nomination Details
            </DrawerTitle>
          </DrawerHeader>
          <Content />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-hidden flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Nomination Details
          </DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}
