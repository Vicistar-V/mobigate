import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
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
  Camera,
  Eye,
  MessageSquare,
  Award
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ExecutiveMember, ExecutiveProfile } from "@/data/communityExecutivesData";
import { Separator } from "@/components/ui/separator";
import { AddToCircleDialog } from "@/components/AddToCircleDialog";
import { cn } from "@/lib/utils";
import { useCommunityUser } from "@/hooks/useCommunityUser";
import { AdminRoleBadge } from "./AdminRoleBadge";
import { EditCommunityProfileDialog } from "./EditCommunityProfileDialog";
import { EditCommunityPhotoDialog } from "./EditCommunityPhotoDialog";
import { ContributionsDialog } from "./ContributionsDialog";

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
  const [showContributions, setShowContributions] = useState(false);
  const [communityImage, setCommunityImage] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const { isOwnProfile } = useCommunityUser();
  const navigate = useNavigate();

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

  const handleViewMainProfile = () => {
    onOpenChange(false);
    navigate(`/profile/${member.id}`);
  };

  const handleHeaderClick = () => {
    onOpenChange(false);
    navigate(`/profile/${member.id}`);
  };

  const handleSaveProfile = (updatedProfile: Partial<ExecutiveProfile>, updatedMilestones?: string[]) => {
    console.log("Updated profile:", updatedProfile);
    if (updatedMilestones) {
      console.log("Updated milestones:", updatedMilestones);
    }
  };

  const handleSavePhoto = (newImage: string) => {
    setCommunityImage(newImage);
  };

  const profile = member.profile;

  // Check if Leadership/Administrative Milestones section has content
  const hasLeadershipMilestones = (member.electedDate || member.tenureDuration || (member.milestones && member.milestones.length > 0));

  // Check if Personal Resume/CV section has content
  const hasPersonalResume = profile && (
    profile.bio ||
    profile.profession ||
    profile.stateOfOrigin ||
    profile.lga ||
    profile.hometown ||
    (profile.education && profile.education.length > 0) ||
    (profile.previousPositions && profile.previousPositions.length > 0) ||
    (profile.professionalAchievements && profile.professionalAchievements.length > 0) ||
    (profile.skills && profile.skills.length > 0) ||
    (profile.awards && profile.awards.length > 0) ||
    profile.phone ||
    profile.email
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh] h-[95vh] flex flex-col overflow-hidden">
        {/* Close Button - Absolute positioned */}
        <DrawerClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 h-8 w-8 z-10 rounded-full bg-muted/80"
          >
            <X className="h-4 w-4" />
          </Button>
        </DrawerClose>

        {/* ========== STATIC HEADER SEGMENT ========== */}
        <div 
          className="flex-shrink-0 px-5 pt-4 pb-3 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={handleHeaderClick}
        >
          {/* Admin Role Badge - Only visible to own profile */}
          {isOwn && member.adminRole && (
            <div className="pb-2">
              <AdminRoleBadge adminRole={member.adminRole} />
            </div>
          )}

          {/* Photo, Name, Position - Clickable to navigate to main profile */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Avatar className="h-20 w-20 border-3 border-primary/20">
                <AvatarImage
                  src={displayImage}
                  alt={member.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isOwn && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEditPhoto(true);
                  }}
                >
                  <Camera className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold leading-tight">{member.name}</h2>
              <p className="text-sm text-primary font-semibold mt-0.5">
                {member.position}
              </p>
              {member.tenure && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {member.tenure}
                </p>
              )}
            </div>
          </div>

          {/* Edit Profile Button - Only visible to own profile */}
          {isOwn && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={(e) => {
                e.stopPropagation();
                setShowEditProfile(true);
              }}
            >
              <Pencil className="h-3.5 w-3.5 mr-2" />
              Edit Community Profile
            </Button>
          )}
        </div>

        <Separator />

        {/* ========== SCROLLABLE MIDDLE SEGMENT ========== */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-4">
            
            {/* LEADERSHIP/ADMINISTRATIVE MILESTONES SECTION */}
            {hasLeadershipMilestones && (
              <CollapsibleSection
                icon={<Award className="h-4 w-4 text-primary" />}
                title="Leadership/Administrative Milestones"
                defaultOpen={true}
              >
                <div className="space-y-3">
                  {/* Elected Date and Tenure Duration */}
                  {(member.electedDate || member.tenureDuration) && (
                    <div className="space-y-2 bg-muted/30 rounded-lg p-3">
                      {member.electedDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-muted-foreground">
                            Elected:
                          </span>
                          <span className="text-sm font-semibold">
                            {member.electedDate}
                          </span>
                        </div>
                      )}
                      {member.tenureDuration && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-muted-foreground">
                            Tenure Duration:
                          </span>
                          <span className="text-sm font-semibold">
                            {member.tenureDuration}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Milestones List */}
                  {member.milestones && member.milestones.length > 0 && (
                    <ul className="space-y-1.5">
                      {member.milestones.map((milestone, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary font-bold text-sm mt-0.5">•</span>
                          <span className="text-sm">{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CollapsibleSection>
            )}

            {hasLeadershipMilestones && hasPersonalResume && <Separator />}

            {/* PERSONAL RESUME/CV SECTION */}
            {hasPersonalResume && (
              <CollapsibleSection
                icon={<User className="h-4 w-4 text-primary" />}
                title="Personal Resume/CV"
                defaultOpen={true}
              >
                <div className="space-y-4">
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

                  {/* Education */}
                  {profile.education && profile.education.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          Education
                        </span>
                      </div>
                      <ul className="space-y-2 ml-6">
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
                    </div>
                  )}

                  {/* Previous Community Positions */}
                  {profile.previousPositions && profile.previousPositions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          Previous Community Positions
                        </span>
                      </div>
                      <ul className="space-y-2 ml-6">
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
                    </div>
                  )}

                  {/* Professional Achievements */}
                  {profile.professionalAchievements && profile.professionalAchievements.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          Professional Achievements
                        </span>
                      </div>
                      <ul className="space-y-1.5 ml-6">
                        {profile.professionalAchievements.map((achievement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary font-bold text-sm mt-0.5">•</span>
                            <span className="text-sm">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Skills */}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          Skills
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 ml-6">
                        {profile.skills.map((skill, index) => (
                          <span key={index} className="inline-flex items-center bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Awards */}
                  {profile.awards && profile.awards.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          Awards & Recognitions
                        </span>
                      </div>
                      <ul className="space-y-2 ml-6">
                        {profile.awards.map((award, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary font-bold text-sm mt-0.5">•</span>
                            <div className="flex-1">
                              <span className="text-sm font-medium">{award.title}</span>
                              <div className="text-xs text-muted-foreground">
                                {award.organization}{award.year && ` (${award.year})`}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Contact */}
                  {(profile.phone || profile.email) && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          Contact
                        </span>
                      </div>
                      <div className="space-y-2 ml-6">
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
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            )}

            {/* Placeholder if no content */}
            {!hasLeadershipMilestones && !hasPersonalResume && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No profile information available yet.</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        {/* ========== STATIC FOOTER SEGMENT - STACKED BUTTONS ========== */}
        {!isOwn && (
          <div className="flex-shrink-0 px-5 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] bg-card space-y-2">
            {/* Row 1: Add Friend + Follow */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={member.isFriend || requestSent ? "secondary" : "default"}
                size="sm"
                className="h-10"
                onClick={handleAddFriend}
                disabled={member.isFriend || requestSent}
              >
                {member.isFriend ? (
                  <>
                    <UserCheck className="h-4 w-4 mr-1.5" />
                    <span className="text-xs font-medium">Friends</span>
                  </>
                ) : requestSent ? (
                  <>
                    <UserCheck className="h-4 w-4 mr-1.5" />
                    <span className="text-xs font-medium">Sent</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1.5" />
                    <span className="text-xs font-medium">Add Friend</span>
                  </>
                )}
              </Button>

              <Button
                variant={isFollowing ? "secondary" : "default"}
                size="sm"
                className="h-10"
                onClick={handleFollow}
              >
                <UserCheck className="h-4 w-4 mr-1.5" />
                <span className="text-xs font-medium">
                  {isFollowing ? "Following" : "Follow"}
                </span>
              </Button>
            </div>

            {/* Row 2: Add to Circle + View Main Profile */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-10" 
                onClick={handleAddToCircle}
              >
                <Users className="h-4 w-4 mr-1.5" />
                <span className="text-xs font-medium">Add to Circle</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                className="h-10" 
                onClick={handleViewMainProfile}
              >
                <Eye className="h-4 w-4 mr-1.5" />
                <span className="text-xs font-medium">View Profile</span>
              </Button>
            </div>

            {/* Row 3: Contributions - Full Width */}
            <Button 
              variant="secondary" 
              size="sm"
              className="w-full h-10" 
              onClick={() => setShowContributions(true)}
            >
              <MessageSquare className="h-4 w-4 mr-1.5" />
              <span className="text-xs font-medium">Contributions</span>
            </Button>
          </div>
        )}

        {/* For own profile - only show View Profile and Contributions */}
        {isOwn && (
          <div className="flex-shrink-0 px-5 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] bg-card space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-10" 
                onClick={handleViewMainProfile}
              >
                <Eye className="h-4 w-4 mr-1.5" />
                <span className="text-xs font-medium">View Profile</span>
              </Button>

              <Button 
                variant="secondary" 
                size="sm"
                className="h-10" 
                onClick={() => setShowContributions(true)}
              >
                <MessageSquare className="h-4 w-4 mr-1.5" />
                <span className="text-xs font-medium">Contributions</span>
              </Button>
            </div>
          </div>
        )}
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
        onSave={(profile, milestones) => handleSaveProfile(profile, milestones)}
      />

      <EditCommunityPhotoDialog
        open={showEditPhoto}
        onOpenChange={setShowEditPhoto}
        currentImage={displayImage}
        onSave={handleSavePhoto}
      />

      <ContributionsDialog
        open={showContributions}
        onOpenChange={setShowContributions}
        member={member}
      />
    </Drawer>
  );
};
