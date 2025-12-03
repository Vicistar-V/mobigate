import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  UserPlus, 
  UserCheck, 
  Users, 
  X, 
  User, 
  GraduationCap, 
  Briefcase, 
  Trophy, 
  Phone, 
  Mail, 
  MapPin, 
  Star,
  Building,
  ChevronDown,
  Pencil,
  Camera
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ExecutiveMember, ExecutiveProfile } from "@/data/communityExecutivesData";
import { Separator } from "@/components/ui/separator";
import { AddToCircleDialog } from "@/components/AddToCircleDialog";
import { cn } from "@/lib/utils";
import { useCommunityUser } from "@/hooks/useCommunityUser";
import { AdminRoleBadge } from "./AdminRoleBadge";
import { EditCommunityProfileDialog } from "./EditCommunityProfileDialog";
import { EditCommunityPhotoDialog } from "./EditCommunityPhotoDialog";

interface ExecutiveDetailSheetProps {
  member: ExecutiveMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CollapsibleSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection = ({ icon, title, children, defaultOpen = true }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between py-2 hover:bg-muted/50 rounded-md px-2 -mx-2 transition-colors">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-sm font-bold uppercase tracking-wide">
              {title}
            </h3>
          </div>
          <ChevronDown 
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const ExecutiveDetailSheet = ({
  member,
  open,
  onOpenChange,
}: ExecutiveDetailSheetProps) => {
  const [requestSent, setRequestSent] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAddToCircle, setShowAddToCircle] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditPhoto, setShowEditPhoto] = useState(false);
  const [communityImage, setCommunityImage] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const { isOwnProfile } = useCommunityUser();

  if (!member) return null;

  const isOwn = isOwnProfile(member.id);
  const displayImage = communityImage || member.communityImageUrl || member.imageUrl;

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
    setShowAddToCircle(true);
  };

  const handleSaveProfile = (updatedProfile: Partial<ExecutiveProfile>) => {
    // In a real app, this would update the backend
    console.log("Updated profile:", updatedProfile);
  };

  const handleSavePhoto = (newImage: string) => {
    setCommunityImage(newImage);
  };

  const profile = member.profile;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh] flex flex-col">
        {/* Header with Close Button - Fixed */}
        <DrawerHeader className="relative border-b pb-3 flex-shrink-0">
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
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-4 pb-6">
            {/* Admin Role Badge - Only visible to own profile */}
            {isOwn && member.adminRole && (
              <div className="py-3">
                <AdminRoleBadge adminRole={member.adminRole} />
              </div>
            )}

            {/* Large Profile Photo */}
            <div className="flex justify-center py-5 relative">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-primary/10">
                  <AvatarImage
                    src={displayImage}
                    alt={member.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isOwn && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                    onClick={() => setShowEditPhoto(true)}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Name and Position */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold mb-1">{member.name}</h2>
              <p className="text-base text-primary font-semibold">
                {member.position} {member.tenure}
              </p>
            </div>

            {/* Edit Profile Button - Only visible to own profile */}
            {isOwn && (
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={() => setShowEditProfile(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit My Community Profile
              </Button>
            )}

            {/* Elected Date and Tenure Duration */}
            {(member.electedDate || member.tenureDuration) && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
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
              </>
            )}

            {/* PERSONAL PROFILE SECTION */}
            {profile && (
              <>
                <Separator className="my-4" />
                <CollapsibleSection
                  icon={<User className="h-4 w-4 text-primary" />}
                  title="Personal Profile"
                  defaultOpen={true}
                >
                  <div className="space-y-3">
                    {/* Bio/About */}
                    {profile.bio && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          About
                        </span>
                        <p className="text-sm leading-relaxed">{profile.bio}</p>
                      </div>
                    )}

                    {/* Profession */}
                    {profile.profession && (
                      <div className="flex items-start gap-3">
                        <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="text-xs font-medium text-muted-foreground uppercase block">
                            Profession
                          </span>
                          <span className="text-sm font-medium">{profile.profession}</span>
                        </div>
                      </div>
                    )}

                    {/* Origin */}
                    {(profile.stateOfOrigin || profile.lga || profile.hometown) && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="text-xs font-medium text-muted-foreground uppercase block">
                            Origin
                          </span>
                          <div className="text-sm">
                            {profile.lga && <span className="font-medium">{profile.lga} LGA</span>}
                            {profile.lga && profile.stateOfOrigin && ", "}
                            {profile.stateOfOrigin && <span>{profile.stateOfOrigin}</span>}
                            {profile.hometown && (
                              <div className="text-muted-foreground text-xs mt-0.5">
                                Hometown: {profile.hometown}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleSection>
              </>
            )}

            {/* EDUCATION SECTION */}
            {profile?.education && profile.education.length > 0 && (
              <>
                <Separator className="my-4" />
                <CollapsibleSection
                  icon={<GraduationCap className="h-4 w-4 text-primary" />}
                  title="Education"
                  defaultOpen={false}
                >
                  <ul className="space-y-2">
                    {profile.education.map((edu, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary font-bold text-sm mt-0.5">•</span>
                        <div className="flex-1">
                          <span className="text-sm font-medium">{edu.qualification}</span>
                          <div className="text-xs text-muted-foreground">
                            {edu.institution}
                            {edu.year && ` (${edu.year})`}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CollapsibleSection>
              </>
            )}

            {/* PREVIOUS COMMUNITY POSITIONS */}
            {profile?.previousPositions && profile.previousPositions.length > 0 && (
              <>
                <Separator className="my-4" />
                <CollapsibleSection
                  icon={<Building className="h-4 w-4 text-primary" />}
                  title="Previous Community Positions"
                  defaultOpen={false}
                >
                  <ul className="space-y-2">
                    {profile.previousPositions.map((pos, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary font-bold text-sm mt-0.5">•</span>
                        <div className="flex-1">
                          <span className="text-sm font-medium">{pos.position}</span>
                          <div className="text-xs text-muted-foreground">
                            {pos.period}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CollapsibleSection>
              </>
            )}

            {/* PROFESSIONAL ACHIEVEMENTS */}
            {profile?.professionalAchievements && profile.professionalAchievements.length > 0 && (
              <>
                <Separator className="my-4" />
                <CollapsibleSection
                  icon={<Trophy className="h-4 w-4 text-primary" />}
                  title="Professional Achievements"
                  defaultOpen={false}
                >
                  <ul className="space-y-1.5">
                    {profile.professionalAchievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary font-bold text-sm mt-0.5">•</span>
                        <span className="text-sm">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CollapsibleSection>
              </>
            )}

            {/* CONTACT SECTION */}
            {(profile?.phone || profile?.email) && (
              <>
                <Separator className="my-4" />
                <CollapsibleSection
                  icon={<Phone className="h-4 w-4 text-primary" />}
                  title="Contact"
                  defaultOpen={false}
                >
                  <div className="space-y-2">
                    {profile.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{profile.phone}</span>
                      </div>
                    )}
                    {profile.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm break-all">{profile.email}</span>
                      </div>
                    )}
                  </div>
                </CollapsibleSection>
              </>
            )}

            {/* LEADERSHIP MILESTONES */}
            {member.milestones && member.milestones.length > 0 && (
              <>
                <Separator className="my-4" />
                <CollapsibleSection
                  icon={<Star className="h-4 w-4 text-primary" />}
                  title="Leadership Milestones"
                  defaultOpen={true}
                >
                  <ul className="space-y-1.5">
                    {member.milestones.map((milestone, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary font-bold text-sm mt-0.5">•</span>
                        <span className="text-sm">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </CollapsibleSection>
              </>
            )}

            <Separator className="my-4" />

            {/* Action Buttons - Hide some for own profile */}
            {!isOwn && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                <Button
                  variant={
                    member.isFriend || requestSent ? "secondary" : "default"
                  }
                  size="sm"
                  className="w-full"
                  onClick={handleAddFriend}
                  disabled={member.isFriend || requestSent}
                >
                  {member.isFriend ? (
                    <>
                      <UserCheck className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Friends</span>
                    </>
                  ) : requestSent ? (
                    <>
                      <UserCheck className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Sent</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Add Friend</span>
                    </>
                  )}
                </Button>

                <Button
                  variant={isFollowing ? "secondary" : "default"}
                  size="sm"
                  className="w-full"
                  onClick={handleFollow}
                >
                  <UserCheck className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">
                    {isFollowing ? "Following" : "Follow"}
                  </span>
                </Button>

                <Button variant="outline" size="sm" className="w-full" onClick={handleAddToCircle}>
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Circle</span>
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DrawerContent>

      <AddToCircleDialog
        open={showAddToCircle}
        onOpenChange={setShowAddToCircle}
        userName={member?.name || ""}
      />

      <EditCommunityProfileDialog
        open={showEditProfile}
        onOpenChange={setShowEditProfile}
        member={member}
        onSave={handleSaveProfile}
      />

      <EditCommunityPhotoDialog
        open={showEditPhoto}
        onOpenChange={setShowEditPhoto}
        currentImage={displayImage}
        onSave={handleSavePhoto}
      />
    </Drawer>
  );
};
