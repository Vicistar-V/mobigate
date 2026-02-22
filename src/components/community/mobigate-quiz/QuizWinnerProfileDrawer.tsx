import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Medal, Star, UserPlus, MessageCircle, Eye, Shield, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { format } from "date-fns";
import type { SeasonWinner } from "@/data/mobigateInteractiveQuizData";

function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

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
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setFriendRequestSent(false);
      setIsFan(false);
      setCurrentPhoto(0);
    }
  }, [open]);

  if (!winner) return null;

  const photos = winner.photos?.length ? winner.photos : [winner.playerAvatar];

  const getPositionIcon = () => {
    switch (winner.position) {
      case "1st": return <Crown className="h-5 w-5 text-amber-500" />;
      case "2nd": return <Medal className="h-5 w-5 text-slate-400" />;
      case "3rd": return <Medal className="h-5 w-5 text-amber-700" />;
      default: return <Trophy className="h-5 w-5 text-purple-500" />;
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

  const getTierColor = (tier: number) => {
    if (tier >= 6) return "bg-purple-500/15 text-purple-700 border-purple-500/30";
    if (tier >= 4) return "bg-blue-500/15 text-blue-700 border-blue-500/30";
    if (tier >= 2) return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";
    return "bg-muted text-muted-foreground border-border";
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

  const handleShare = async () => {
    const shareData = {
      title: `${winner.playerName} - Quiz Winner`,
      text: `Check out ${winner.playerName}'s ${winner.position} place win with a score of ${winner.score}%!`,
      url: window.location.origin + `/profile/${winner.id}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({ title: "Link copied!", description: "Winner profile link copied to clipboard" });
      }
    } catch {
      await navigator.clipboard.writeText(shareData.url);
      toast({ title: "Link copied!", description: "Winner profile link copied to clipboard" });
    }
  };

  const handleGalleryScroll = () => {
    const el = galleryRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setCurrentPhoto(index);
  };

  const scrollToPhoto = (index: number) => {
    const el = galleryRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh]" showClose>
        <DrawerHeader className="text-center pb-2">
          <DrawerTitle className="sr-only">Winner Profile</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="px-4 pb-6 space-y-4 overflow-y-auto touch-auto overscroll-contain">
          {/* Slidable Photo Gallery */}
          <div className="relative">
            <div
              ref={galleryRef}
              className="flex overflow-x-auto snap-x snap-mandatory touch-pan-x"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
              onScroll={handleGalleryScroll}
            >
              {photos.map((photo, idx) => (
                <div key={idx} className="snap-center shrink-0 w-full">
                  <div className="aspect-square mx-auto max-w-[280px] rounded-2xl overflow-hidden border-2 border-amber-300/30 shadow-lg">
                    <img src={photo} alt={`${winner.playerName} photo ${idx + 1}`} className="h-full w-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
            {/* Dots indicator */}
            {photos.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-2">
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    className={`h-2 rounded-full transition-all touch-manipulation ${
                      idx === currentPhoto ? "w-5 bg-amber-500" : "w-2 bg-muted-foreground/30"
                    }`}
                    onClick={() => scrollToPhoto(idx)}
                  />
                ))}
              </div>
            )}
            {/* Position badge overlay */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 ml-[-140px]">
              <div className="bg-background/80 backdrop-blur-sm rounded-full p-1.5 border shadow-sm">
                {getPositionIcon()}
              </div>
            </div>
          </div>

          {/* Name & Badges */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold">{winner.playerName}</h3>
            <p className="text-sm text-muted-foreground">{winner.state}, {winner.country}</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-xs">
                {getPositionLabel()}
              </Badge>
              <Badge className={`text-xs ${getTierColor(winner.tier)}`}>
                <Shield className="h-3 w-3 mr-0.5" /> Tier {winner.tier}
              </Badge>
            </div>
            {winner.tier >= 6 && (
              <p className="text-sm font-semibold text-purple-700">Celebrity</p>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-muted/30 rounded-xl p-3 border">
              <p className="text-lg font-bold">{formatCompact(winner.followers)}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-3 border">
              <p className="text-lg font-bold">{formatCompact(winner.fans)}</p>
              <p className="text-xs text-muted-foreground">Fans</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-3 border">
              <p className="text-lg font-bold">T{winner.tier}</p>
              <p className="text-xs text-muted-foreground">Tier</p>
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
          <div className="grid grid-cols-3 gap-2.5">
            <Button
              variant="outline"
              className="h-14 text-xs touch-manipulation active:scale-[0.97] flex flex-col items-center gap-1 px-1"
              onClick={() => { navigate(`/profile/${winner.id}`); onOpenChange(false); }}
            >
              <Eye className="h-5 w-5" />
              <span>Profile</span>
            </Button>
            <Button
              variant="outline"
              className="h-14 text-xs touch-manipulation active:scale-[0.97] flex flex-col items-center gap-1 px-1"
              disabled={friendRequestSent}
              onClick={handleAddFriend}
            >
              <UserPlus className="h-5 w-5" />
              <span>{friendRequestSent ? "Sent" : "Add Friend"}</span>
            </Button>
            <Button
              variant="outline"
              className="h-14 text-xs touch-manipulation active:scale-[0.97] flex flex-col items-center gap-1 px-1"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('openChatWithUser', {
                    detail: {
                      odooUserId: winner.id,
                      userName: winner.playerName,
                      userAvatar: winner.playerAvatar
                    }
                  }));
                }, 300);
              }}
            >
              <MessageCircle className="h-5 w-5" />
              <span>Message</span>
            </Button>
            <Button
              className={`h-14 text-xs touch-manipulation active:scale-[0.97] flex flex-col items-center gap-1 px-1 ${isFan ? "bg-amber-500/15 text-amber-700 border border-amber-500/30 hover:bg-amber-500/20" : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"}`}
              disabled={isFan}
              onClick={handleBecomeFan}
            >
              <Star className="h-5 w-5" fill={isFan ? "currentColor" : "none"} />
              <span>{isFan ? "Fanned" : "Fan M200"}</span>
            </Button>
            <Button
              variant="outline"
              className="h-14 text-xs touch-manipulation active:scale-[0.97] flex flex-col items-center gap-1 px-1"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
