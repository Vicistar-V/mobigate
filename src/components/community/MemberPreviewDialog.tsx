import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  UserPlus, 
  UserCheck, 
  X, 
  User, 
  MessageSquare,
  Users,
  Calendar,
  Circle,
  Expand
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import { AddToCircleDialog } from "@/components/AddToCircleDialog";
import { MediaViewer } from "@/components/MediaViewer";

interface MemberPreviewDialogProps {
  member: ExecutiveMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  displayImage?: string;
}

export const MemberPreviewDialog = ({
  member,
  open,
  onOpenChange,
  displayImage,
}: MemberPreviewDialogProps) => {
  const [requestSent, setRequestSent] = useState(false);
  const [showAddToCircle, setShowAddToCircle] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!member) return null;

  const imageUrl = displayImage || member.communityImageUrl || member.imageUrl;

  // Mock data for preview
  const memberSince = "2015";
  const mutualFriends = 45;
  const isOnline = true;
  
  // Mock interaction data for photo
  const photoLikes = 128;
  const photoComments = 24;
  const photoFollowers = "1.2K";

  const handleAddFriend = () => {
    if (member.isFriend) {
      toast({
        title: "Already Friends",
        description: `You are already friends with ${member.name}`,
      });
      return;
    }

    setRequestSent(true);
    toast({
      title: "Request Sent",
      description: `Friend request sent to ${member.name}`,
    });
  };

  const handleMessage = () => {
    toast({
      title: "Opening Chat",
      description: `Starting conversation with ${member.name}`,
    });
    // Could navigate to chat page
  };

  const handleViewMainProfile = () => {
    onOpenChange(false);
    navigate(`/profile/${member.id}`);
  };

  const getFriendButtonState = () => {
    if (member.isFriend) {
      return { icon: UserCheck, text: "Friends", variant: "secondary" as const };
    }
    if (requestSent) {
      return { icon: UserCheck, text: "Request Sent", variant: "secondary" as const };
    }
    return { icon: UserPlus, text: "Add Friend", variant: "outline" as const };
  };

  const friendState = getFriendButtonState();

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] flex flex-col">
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

          <ScrollArea className="flex-1 overflow-y-auto touch-auto">
            <div className="px-5 py-6 flex flex-col items-center">
              {/* Larger Photo with Online Status - Clickable */}
              <div className="relative mb-4">
                <div 
                  className="h-32 w-28 rounded-xl overflow-hidden border-3 border-primary/20 bg-muted shadow-lg cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all relative group"
                  onClick={() => setShowPhotoViewer(true)}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted text-3xl font-semibold text-muted-foreground">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  {/* Expand overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
                    <Expand className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                  </div>
                </div>
                {/* Online Status Indicator */}
                {isOnline && (
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background flex items-center justify-center shadow-sm">
                    <Circle className="h-3.5 w-3.5 fill-green-500 text-green-500" />
                  </div>
                )}
              </div>

              {/* Name and Position */}
              <h2 className="text-xl font-bold text-center">{member.name}</h2>
              <p className="text-sm text-primary font-semibold mt-1 text-center">
                {member.position}
              </p>
              {member.tenure && (
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  {member.tenure}
                </p>
              )}

              {/* Member Info Row */}
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Member since {memberSince}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{mutualFriends} mutual friends</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-5 pb-8 space-y-3">
              {/* Primary Button - View Profile */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleViewMainProfile}
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>

              {/* Secondary Actions Row */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={friendState.variant}
                  size="default"
                  onClick={handleAddFriend}
                  disabled={member.isFriend || requestSent}
                >
                  <friendState.icon className="h-4 w-4 mr-2" />
                  {friendState.text}
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleMessage}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>

              {/* Add to Circle Button */}
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowAddToCircle(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Add to Circle
              </Button>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Add to Circle Dialog */}
      <AddToCircleDialog
        open={showAddToCircle}
        onOpenChange={setShowAddToCircle}
        userName={member.name}
      />

      {/* Photo Expanded View */}
      <MediaViewer
        open={showPhotoViewer}
        onOpenChange={setShowPhotoViewer}
        mediaUrl={imageUrl || ""}
        mediaType="Photo"
        title={`${member.name}'s Photo`}
        author={member.name}
        authorUserId={member.id}
        likes={photoLikes}
        comments={photoComments}
        followers={photoFollowers}
        showActions={true}
      />
    </>
  );
};
