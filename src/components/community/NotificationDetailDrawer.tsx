import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  Phone, 
  Gift, 
  User, 
  UserPlus, 
  Users, 
  Calendar, 
  Video, 
  ExternalLink,
  Heart,
  Share2,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { CommunityNotification, formatRelativeTime } from "@/data/communityNotificationsData";
import { SendGiftDialog } from "@/components/chat/SendGiftDialog";
import { ActiveCallDialog } from "@/components/chat/ActiveCallDialog";
import { ShareDialog } from "@/components/ShareDialog";
import { CommentSection } from "@/components/CommentSection";

interface NotificationDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: CommunityNotification | null;
  onCloseAll?: () => void;
}

export function NotificationDetailDrawer({
  open,
  onOpenChange,
  notification,
  onCloseAll
}: NotificationDetailDrawerProps) {
  const navigate = useNavigate();
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  
  // Engagement states
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(24);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [commentCount] = useState(8);

  if (!notification) return null;

  const isPersonNotification = !!notification.avatar && !!notification.personName;
  const isBirthdayNotification = notification.type === "birthday" || 
    notification.title?.toLowerCase().includes("birthday") ||
    notification.message?.toLowerCase().includes("birthday");

  const closeAll = () => {
    onOpenChange(false);
    onCloseAll?.();
  };

  // Engagement handlers
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
      toast.success("Removed like");
    } else {
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
      toast.success("Liked! ❤️");
    }
  };

  const handleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      toast.success(`Unfollowed ${notification.personName || "user"}`);
    } else {
      setIsFollowing(true);
      toast.success(`Now following ${notification.personName || "user"}`);
    }
  };

  const handleShare = () => {
    closeAll();
    setTimeout(() => setShowShareDialog(true), 150);
  };

  const handleChat = () => {
    closeAll();
    window.dispatchEvent(new CustomEvent('openChatWithUser', {
      detail: { 
        userId: notification.id,
        userName: notification.personName || "Member",
        userAvatar: notification.avatar
      }
    }));
  };

  const handleCall = () => {
    closeAll();
    setTimeout(() => setShowCallDialog(true), 150);
  };

  const handleGift = () => {
    closeAll();
    setTimeout(() => setShowGiftDialog(true), 150);
  };

  const handleViewProfile = () => {
    closeAll();
    navigate("/profile");
  };

  const handleAddFriend = () => {
    closeAll();
    toast.success(`Friend request sent to ${notification.personName || "member"}!`);
  };

  const handleAddToCircle = () => {
    closeAll();
    toast.success(`${notification.personName || "Member"} added to your circle!`);
  };

  const handleViewEvent = () => {
    closeAll();
    toast.info("Opening event details...");
  };

  const handleJoinMeeting = () => {
    closeAll();
    toast.info("Joining meeting...");
  };

  // Actions for person-related notifications
  const personActions = [
    { icon: MessageCircle, label: "Chat", onClick: handleChat, color: "text-blue-500" },
    { icon: Phone, label: "Call", onClick: handleCall, color: "text-green-500" },
    { icon: Gift, label: "Gift", onClick: handleGift, color: "text-pink-500" },
    { icon: User, label: "Profile", onClick: handleViewProfile, color: "text-purple-500" },
    { icon: UserPlus, label: "Friend", onClick: handleAddFriend, color: "text-orange-500" },
    { icon: Users, label: "Circle", onClick: handleAddToCircle, color: "text-cyan-500" },
  ];

  // Actions for event/meeting notifications
  const eventActions = [
    { icon: Calendar, label: "View Details", onClick: handleViewEvent, color: "text-orange-500" },
    { icon: ExternalLink, label: "Open", onClick: handleViewEvent, color: "text-blue-500" },
  ];

  const meetingActions = [
    { icon: Video, label: "Join Meeting", onClick: handleJoinMeeting, color: "text-purple-500" },
    { icon: Calendar, label: "Add to Calendar", onClick: () => toast.success("Added to calendar!"), color: "text-green-500" },
  ];

  const getActionsForType = () => {
    if (isPersonNotification) return personActions;
    if (notification.type === "event") return eventActions;
    if (notification.type === "meeting") return meetingActions;
    return personActions.slice(0, 4);
  };

  const actions = getActionsForType();

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] flex flex-col touch-auto overflow-hidden">
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle className="sr-only">Notification Details</DrawerTitle>
          </DrawerHeader>

          <ScrollArea className="flex-1 max-h-[calc(90vh-60px)] min-h-0 touch-auto">
            <div className="px-4 pb-8 space-y-4">
              {/* Person Avatar or Icon */}
              <div className="flex flex-col items-center">
                {notification.avatar ? (
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                      <AvatarImage src={notification.avatar} alt={notification.personName || ""} />
                      <AvatarFallback className="text-2xl">
                        {notification.personName?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                )}

                {notification.personName && (
                  <p className="mt-2 font-semibold text-base">{notification.personName}</p>
                )}
              </div>

              {/* Notification Content */}
              <div className="text-center space-y-1.5">
                <h3 className="font-bold text-base">{notification.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed px-2">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {formatRelativeTime(notification.timestamp)}
                </p>
              </div>

              {/* Engagement Bar - Like, Comment, Share, Follow */}
              <div className="flex items-center justify-around py-3 border-y border-border/50">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className="flex flex-col items-center gap-1 min-w-[50px] touch-manipulation active:scale-95 transition-transform"
                >
                  <Heart 
                    className={`h-5 w-5 transition-colors ${
                      isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    }`} 
                  />
                  <span className={`text-xs font-medium ${
                    isLiked ? "text-red-500" : "text-muted-foreground"
                  }`}>
                    {likeCount}
                  </span>
                </button>

                {/* Comments Button */}
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex flex-col items-center gap-1 min-w-[50px] touch-manipulation active:scale-95 transition-transform"
                >
                  <MessageSquare 
                    className={`h-5 w-5 transition-colors ${
                      showComments ? "fill-primary/20 text-primary" : "text-muted-foreground"
                    }`} 
                  />
                  <span className={`text-xs font-medium ${
                    showComments ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {commentCount}
                  </span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1 min-w-[50px] touch-manipulation active:scale-95 transition-transform"
                >
                  <Share2 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Share</span>
                </button>

                {/* Follow Button */}
                <button
                  onClick={handleFollow}
                  className="flex flex-col items-center gap-1 min-w-[50px] touch-manipulation active:scale-95 transition-transform"
                >
                  <UserPlus 
                    className={`h-5 w-5 transition-colors ${
                      isFollowing ? "fill-primary text-primary" : "text-muted-foreground"
                    }`} 
                  />
                  <span className={`text-xs font-medium ${
                    isFollowing ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {isFollowing ? "Following" : "Follow"}
                  </span>
                </button>
              </div>

              {/* Birthday Wishes / Comments Section */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center justify-between w-full px-1"
                >
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold flex items-center gap-1.5">
                      {isBirthdayNotification ? "🎂 Birthday Wishes" : "💬 Comments"}
                    </h4>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                      {commentCount}
                    </span>
                  </div>
                  {showComments ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {showComments && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <CommentSection 
                      postId={notification.id} 
                      showHeader={false}
                    />
                  </div>
                )}
              </div>

              <Separator className="my-2" />

              {/* Action Grid - Mobile Optimized */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground px-1">Quick Actions</p>
                <div className={`grid gap-2 ${actions.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="flex flex-col items-center justify-center gap-1.5 h-16 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-95"
                      onClick={action.onClick}
                    >
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                      <span className="text-xs font-medium">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Gift Dialog */}
      <SendGiftDialog
        isOpen={showGiftDialog}
        onClose={() => setShowGiftDialog(false)}
        recipientName={notification.personName || "Member"}
        onSendGift={(giftData) => {
          toast.success(`${giftData.giftData.name} sent to ${notification.personName || "member"}!`);
          setShowGiftDialog(false);
        }}
      />

      {/* Call Dialog */}
      <ActiveCallDialog
        isOpen={showCallDialog}
        onClose={() => setShowCallDialog(false)}
        recipientName={notification.personName || "Member"}
        recipientAvatar={notification.avatar}
      />

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        shareUrl={`https://mobigate.lovable.app/notification/${notification.id}`}
        title={isBirthdayNotification 
          ? `Wish ${notification.personName || "them"} a Happy Birthday! 🎂` 
          : notification.title
        }
        description={notification.message}
      />
    </>
  );
}
