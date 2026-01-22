import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy,
  X, 
  User, 
  MessageSquare,
  Users,
  Calendar,
  Award,
  Vote,
  TrendingUp,
  UserCheck,
  UserPlus,
  CheckCircle2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ElectionWinner } from "@/data/electionData";
import { format } from "date-fns";
import { VoteBoxGroup } from "../shared/VoteBoxGroup";
import { AddToCircleDialog } from "@/components/AddToCircleDialog";

interface WinnerProfileSheetProps {
  winner: ElectionWinner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WinnerProfileSheet = ({
  winner,
  open,
  onOpenChange,
}: WinnerProfileSheetProps) => {
  const [showAddToCircle, setShowAddToCircle] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [addedToCircle, setAddedToCircle] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Reset states when winner changes or drawer closes
  useEffect(() => {
    if (!open) {
      setFriendRequestSent(false);
      setAddedToCircle(false);
    }
  }, [open, winner?.id]);

  if (!winner) return null;

  const handleViewProfile = () => {
    onOpenChange(false);
    navigate(`/profile/${winner.memberId}`);
  };

  const handleAddFriend = () => {
    setFriendRequestSent(true);
    toast({
      title: "Request Sent",
      description: `Friend request sent to ${winner.candidateName}`,
    });
  };

  const handleAddToCircle = () => {
    setShowAddToCircle(true);
  };

  const handleCircleDialogClose = (isOpen: boolean) => {
    setShowAddToCircle(isOpen);
    if (!isOpen) {
      // Assume circle was added when dialog closes
      setAddedToCircle(true);
    }
  };

  const margin = winner.votes - Math.floor(winner.votes * (1 - winner.percentage / 100) * 0.6);

  const getElectionTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'general':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'emergency':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'by-election':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] flex flex-col touch-auto overflow-hidden">
          {/* Close Button */}
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 h-8 w-8 z-10 rounded-full bg-muted/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>

          <div className="flex-1 overflow-y-auto overscroll-contain touch-auto min-h-0">
            <div className="px-5 py-6 pb-28">
              {/* Winner Photo with Trophy Overlay */}
              <div className="flex justify-center mb-5">
                <div className="relative">
                  <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-yellow-500 shadow-lg">
                    <img
                      src={winner.image}
                      alt={winner.candidateName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* Trophy Badge */}
                  <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center shadow-md">
                    <Trophy className="h-5 w-5 text-black" />
                  </div>
                </div>
              </div>

              {/* Winner Badge */}
              <div className="flex justify-center mb-3">
                <Badge className="bg-yellow-500 text-black px-3 py-1">
                  <Award className="w-3.5 h-3.5 mr-1.5" />
                  Election Winner
                </Badge>
              </div>

              {/* Name and Office */}
              <h2 className="text-xl font-bold text-center">{winner.candidateName}</h2>
              <p className="text-sm text-primary font-semibold mt-1 text-center">
                {winner.office}
              </p>

              {/* Election Info */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Badge variant="outline" className={getElectionTypeBadgeStyle(winner.electionType)}>
                  <Vote className="w-3 h-3 mr-1" />
                  {winner.electionType.charAt(0).toUpperCase() + winner.electionType.slice(1).replace('-', ' ')}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-2">
                {winner.electionName}
              </p>

              {/* Vote Statistics */}
              <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2 mb-3 justify-center">
                  <TrendingUp className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">Vote Statistics</span>
                </div>
                <div className="flex justify-center">
                  <VoteBoxGroup
                    values={[winner.votes, `${winner.percentage.toFixed(1)}%`, margin]}
                    labels={['Votes', 'Share', 'Margin']}
                    colorClass="border-yellow-500 bg-yellow-50"
                    isLarge={true}
                  />
                </div>
              </div>

              {/* Announcement Date */}
              <div className="flex items-center justify-center gap-2 mt-5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Announced: {format(winner.announcedAt, "MMMM dd, yyyy 'at' h:mm a")}</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {/* Primary Button - View Profile */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleViewProfile}
                >
                  <User className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>

                {/* Friend Request Button - Full Width when request not sent */}
                {!friendRequestSent ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handleAddFriend}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Friend
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    disabled
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Friend Request Sent
                  </Button>
                )}

                {/* Add to Circle Button */}
                {!addedToCircle ? (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={handleAddToCircle}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add to Circle
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full text-green-600"
                    disabled
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Added to Circle
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Add to Circle Dialog */}
      <AddToCircleDialog
        open={showAddToCircle}
        onOpenChange={handleCircleDialogClose}
        userName={winner.candidateName}
      />
    </>
  );
};
