import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Medal, Star, UserPlus, MessageCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { format } from "date-fns";
import type { SeasonWinner } from "@/data/mobigateInteractiveQuizData";

interface QuizWinnerProfileDrawerProps {
  winner: SeasonWinner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchantName?: string;
  seasonName?: string;
}

export function QuizWinnerProfileDrawer({ winner, open, onOpenChange, merchantName, seasonName }: QuizWinnerProfileDrawerProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [isFan, setIsFan] = useState(false);

  useEffect(() => {
    if (!open) {
      setFriendRequestSent(false);
      setIsFan(false);
    }
  }, [open]);

  if (!winner) return null;

  const initials = winner.playerName.split(" ").map(n => n[0]).join("");

  const getPositionIcon = () => {
    switch (winner.position) {
      case "1st": return <Crown className="h-6 w-6 text-amber-500" />;
      case "2nd": return <Medal className="h-6 w-6 text-slate-400" />;
      case "3rd": return <Medal className="h-6 w-6 text-amber-700" />;
      default: return <Trophy className="h-6 w-6 text-purple-500" />;
    }
  };

  const getPositionLabel = () => {
    switch (winner.position) {
      case "1st": return "1st Place Champion";
      case "2nd": return "2nd Place Runner-Up";
      case "3rd": return "3rd Place Winner";
      default: return "Consolation Winner";
    }
  };

  const getPayoutBadge = () => {
    switch (winner.payoutStatus) {
      case "paid": return <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-xs">Paid</Badge>;
      case "processing": return <Badge className="bg-blue-500/15 text-blue-700 border-blue-500/30 text-xs">Processing</Badge>;
      default: return <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-xs">Pending</Badge>;
    }
  };

  const handleBecomeFan = () => {
    setIsFan(true);
    toast({
      title: "⭐ You're now a fan!",
      description: `M200 debited. You're now following ${winner.playerName}'s quiz journey!`,
    });
  };

  const handleAddFriend = () => {
    setFriendRequestSent(true);
    toast({
      title: "Friend request sent!",
      description: `Request sent to ${winner.playerName}`,
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh]" showClose>
        <DrawerHeader className="text-center pb-2">
          <DrawerTitle className="sr-only">Winner Profile</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="px-4 pb-6 space-y-5">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/30 flex items-center justify-center text-2xl font-bold text-amber-700 dark:text-amber-300 border-2 border-amber-300/50">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border">
                {getPositionIcon()}
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold">{winner.playerName}</h3>
              <p className="text-sm text-muted-foreground">{winner.state}, {winner.country}</p>
              <Badge className="mt-1.5 bg-amber-500/15 text-amber-700 border-amber-500/30 text-xs">
                {getPositionLabel()}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 bg-muted/30 rounded-xl p-4 border">
            {merchantName && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Merchant</span>
                <span className="font-semibold">{merchantName}</span>
              </div>
            )}
            {seasonName && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Season</span>
                <span className="font-semibold">{seasonName}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Prize Won</span>
              <span className="font-bold text-primary">₦{formatLocalAmount(winner.prizeAmount, "NGN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Score</span>
              <span className="font-semibold">{winner.score}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-semibold">{format(new Date(winner.completionDate), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Payout</span>
              {getPayoutBadge()}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12 text-sm touch-manipulation"
              onClick={() => { navigate(`/profile/${winner.id}`); onOpenChange(false); }}
            >
              <Eye className="h-4 w-4 mr-1.5" /> View Profile
            </Button>
            <Button
              variant="outline"
              className="h-12 text-sm touch-manipulation"
              disabled={friendRequestSent}
              onClick={handleAddFriend}
            >
              <UserPlus className="h-4 w-4 mr-1.5" />
              {friendRequestSent ? "Sent" : "Add Friend"}
            </Button>
            <Button
              variant="outline"
              className="h-12 text-sm touch-manipulation"
              onClick={() => toast({ title: "Message", description: `Opening chat with ${winner.playerName}...` })}
            >
              <MessageCircle className="h-4 w-4 mr-1.5" /> Message
            </Button>
            <Button
              className={`h-12 text-sm touch-manipulation ${isFan ? "bg-amber-500/15 text-amber-700 border border-amber-500/30 hover:bg-amber-500/20" : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"}`}
              disabled={isFan}
              onClick={handleBecomeFan}
            >
              <Star className="h-4 w-4 mr-1.5" fill={isFan ? "currentColor" : "none"} />
              {isFan ? "Fanned ⭐" : "Fan M200"}
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
