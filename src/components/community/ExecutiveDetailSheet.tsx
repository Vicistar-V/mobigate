import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, UserCheck, Users, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import { Separator } from "@/components/ui/separator";

interface ExecutiveDetailSheetProps {
  member: ExecutiveMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExecutiveDetailSheet = ({
  member,
  open,
  onOpenChange,
}: ExecutiveDetailSheetProps) => {
  const [requestSent, setRequestSent] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();

  if (!member) return null;

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

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing
        ? `You unfollowed ${member.name}`
        : `You are now following ${member.name}`,
    });
  };

  const handleAddToCircle = () => {
    toast({
      title: "Coming Soon",
      description: "Add to Circle feature will be available soon",
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        {/* Header with Close Button */}
        <DrawerHeader className="relative border-b pb-3">
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
          <DrawerTitle className="text-center text-base">
            Executive Profile
          </DrawerTitle>
        </DrawerHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 pb-6">
          {/* Large Profile Photo */}
          <div className="flex justify-center py-6">
            <Avatar className="h-40 w-40 border-4 border-primary/10">
              <AvatarImage
                src={member.imageUrl}
                alt={member.name}
                className="object-cover"
              />
              <AvatarFallback className="text-5xl">
                {member.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name and Position */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">{member.name}</h2>
            <p className="text-lg text-primary font-semibold">
              {member.position} {member.tenure}
            </p>
          </div>

          <Separator className="my-6" />

          {/* Elected Date and Tenure Duration */}
          {(member.electedDate || member.tenureDuration) && (
            <div className="space-y-3 mb-6">
              {member.electedDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Elected:
                  </span>
                  <span className="text-sm font-semibold">
                    {member.electedDate}
                  </span>
                </div>
              )}
              {member.tenureDuration && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Tenure:
                  </span>
                  <span className="text-sm font-semibold">
                    {member.tenureDuration}
                  </span>
                </div>
              )}
            </div>
          )}

          {member.milestones && member.milestones.length > 0 && (
            <>
              <Separator className="my-6" />

              {/* Leadership/Administrative Milestones */}
              <div className="mb-6">
                <h3 className="text-base font-semibold mb-4">
                  Leadership/Administrative Milestones:
                </h3>
                <ul className="space-y-3">
                  {member.milestones.map((milestone, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary font-bold text-lg mt-0.5">
                        •
                      </span>
                      <span className="text-sm text-foreground flex-1">
                        {milestone}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <Separator className="my-6" />

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={
                member.isFriend || requestSent ? "secondary" : "default"
              }
              className="w-full"
              onClick={handleAddFriend}
              disabled={member.isFriend || requestSent}
            >
              {member.isFriend ? (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  <span className="text-xs">Friends</span>
                </>
              ) : requestSent ? (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  <span className="text-xs">Request Sent</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  <span className="text-xs">Add Friend</span>
                </>
              )}
            </Button>

            <Button
              variant={isFollowing ? "secondary" : "default"}
              className="w-full"
              onClick={handleFollow}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              <span className="text-xs">
                {isFollowing ? "Following" : "Follow"}
              </span>
            </Button>

            <Button variant="outline" className="w-full" onClick={handleAddToCircle}>
              <Users className="h-4 w-4 mr-2" />
              <span className="text-xs">Add to Circle</span>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
