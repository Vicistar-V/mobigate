import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Phone, Gift, User, UserPlus, Users, Calendar, Video, ExternalLink } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CommunityNotification, formatRelativeTime } from "@/data/communityNotificationsData";
import { SendGiftDialog } from "@/components/chat/SendGiftDialog";
import { ActiveCallDialog } from "@/components/chat/ActiveCallDialog";

interface NotificationDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: CommunityNotification | null;
}

export function NotificationDetailDrawer({
  open,
  onOpenChange,
  notification
}: NotificationDetailDrawerProps) {
  const navigate = useNavigate();
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);

  if (!notification) return null;

  const isPersonNotification = !!notification.avatar && !!notification.personName;

  const handleChat = () => {
    onOpenChange(false);
    toast.success(`Opening chat with ${notification.personName || "member"}...`);
    // Navigate to chat or open chat dialog
  };

  const handleCall = () => {
    setShowCallDialog(true);
  };

  const handleGift = () => {
    setShowGiftDialog(true);
  };

  const handleViewProfile = () => {
    onOpenChange(false);
    navigate("/profile");
    toast.info(`Viewing ${notification.personName || "member"}'s profile`);
  };

  const handleAddFriend = () => {
    toast.success(`Friend request sent to ${notification.personName || "member"}!`);
  };

  const handleAddToCircle = () => {
    toast.success(`${notification.personName || "Member"} added to your circle!`);
  };

  const handleViewEvent = () => {
    onOpenChange(false);
    toast.info("Opening event details...");
  };

  const handleJoinMeeting = () => {
    onOpenChange(false);
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
    return personActions.slice(0, 4); // Default actions
  };

  const actions = getActionsForType();

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle className="sr-only">Notification Details</DrawerTitle>
          </DrawerHeader>

          <div className="px-6 pb-8 space-y-6">
            {/* Person Avatar or Icon */}
            <div className="flex flex-col items-center">
              {notification.avatar ? (
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={notification.avatar} alt={notification.personName || ""} />
                    <AvatarFallback className="text-2xl">
                      {notification.personName?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500 border-3 border-background" />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-10 w-10 text-primary" />
                </div>
              )}

              {notification.personName && (
                <p className="mt-3 font-semibold text-lg">{notification.personName}</p>
              )}
            </div>

            {/* Notification Content */}
            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg">{notification.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground/70">
                {formatRelativeTime(notification.timestamp)}
              </p>
            </div>

            {/* Action Grid - Mobile Optimized */}
            <div className={`grid gap-3 ${actions.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-95"
                  onClick={action.onClick}
                >
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
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
    </>
  );
}
