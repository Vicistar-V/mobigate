import { Card } from "@/components/ui/card";
import { 
  MapPin, 
  Building, 
  Mail, 
  Phone, 
  Users, 
  Target, 
  Globe,
  Calendar,
  Award,
  FolderOpen,
  Crown,
  CalendarDays,
  Contact,
  Info
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CommunityProfile } from "@/types/community";
import { getCommunityTier, getTierRange } from "@/lib/communityTierUtils";

interface CommunityAboutTabProps {
  community: CommunityProfile;
}

// Helper component for section headers
const AboutSectionHeader = ({ 
  icon: Icon, 
  title 
}: { 
  icon: React.ElementType; 
  title: string;
}) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-1 h-6 bg-primary rounded-full" />
    <Icon className="h-5 w-5 text-primary flex-shrink-0" />
    <h3 className="font-semibold text-foreground">{title}</h3>
  </div>
);

// Helper component for info rows
const InfoRow = ({ 
  label, 
  value,
  isLink = false
}: { 
  label?: string; 
  value?: string | number;
  isLink?: boolean;
}) => {
  if (!value) return null;
  
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      )}
      {isLink ? (
        <a 
          href={`mailto:${value}`} 
          className="text-sm text-primary hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm text-foreground whitespace-pre-line">{value}</p>
      )}
    </div>
  );
};

// Helper function to format dates
const formatDate = (date?: Date) => {
  if (!date) return undefined;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function to capitalize first letter
const capitalize = (str?: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper function to format gender
const formatGender = (gender?: string) => {
  if (!gender) return undefined;
  if (gender === "both") return "Males and Females";
  return capitalize(gender);
};

export function CommunityAboutTab({ community }: CommunityAboutTabProps) {
  return (
    <div className="space-y-4">
      {/* Header with Community Name */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-center gap-3">
          <Building className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-foreground">{community.name}</h2>
            <p className="text-xs text-muted-foreground">{community.type}</p>
          </div>
        </div>
      </Card>

      {/* Vision Statement */}
      {community.visionStatement && (
        <Card className="p-4">
          <AboutSectionHeader icon={Target} title="Vision Statement" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {community.visionStatement}
          </p>
        </Card>
      )}

      {/* Creation */}
      <Card className="p-4">
        <AboutSectionHeader icon={Calendar} title="Creation" />
        <InfoRow value={formatDate(community.createdAt)} />
      </Card>

      {/* Designations - System Assigned based on member count */}
      <Card className="p-4">
        <AboutSectionHeader icon={Award} title="Designations" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {getCommunityTier(community.memberCount)}
          </p>
          <p className="text-xs text-muted-foreground">
            ({getTierRange(getCommunityTier(community.memberCount))})
          </p>
        </div>
      </Card>

      {/* Location */}
      <Card className="p-4">
        <AboutSectionHeader icon={MapPin} title="Location" />
        <div className="space-y-3">
          {community.currentCity && (
            <>
              <InfoRow label="Current City" value={community.currentCity} />
              <Separator />
            </>
          )}
          {(community.originCity || community.originState) && (
            <>
              <InfoRow 
                label="Origination" 
                value={`${community.originCity}${community.originState ? `, ${community.originState}` : ''}`} 
              />
              <Separator />
            </>
          )}
          {community.parentBody && (
            <InfoRow label="Parent Body" value={community.parentBody} />
          )}
        </div>
      </Card>

      {/* Classification */}
      {(community.classification || community.category) && (
        <Card className="p-4">
          <AboutSectionHeader icon={FolderOpen} title="Classification" />
          <InfoRow 
            value={`${community.category || ''} ${community.classification || ''}`.trim()} 
          />
        </Card>
      )}

      {/* Founded/Formed */}
      {(community.foundedLocation || community.foundedDate) && (
        <Card className="p-4">
          <AboutSectionHeader icon={Calendar} title="Founded/Formed" />
          <div className="space-y-2">
            {community.foundedLocation && (
              <InfoRow value={`At ${community.foundedLocation}`} />
            )}
            {community.foundedDate && (
              <InfoRow value={formatDate(community.foundedDate)} />
            )}
          </div>
        </Card>
      )}

      {/* Membership & Gender */}
      {(community.gender || community.populationStrength) && (
        <Card className="p-4">
          <AboutSectionHeader icon={Users} title="Membership & Gender" />
          <div className="space-y-3">
            {community.gender && (
              <>
                <InfoRow label="Gender" value={formatGender(community.gender)} />
                <Separator />
              </>
            )}
            {community.populationStrength && (
              <>
                <InfoRow 
                  label="Population Strength" 
                  value={`Over ${community.populationStrength.toLocaleString()} Members`} 
                />
                <Separator />
              </>
            )}
            {(community.maleMembers || community.femaleMembers) && (
              <>
                <InfoRow 
                  label="Men/Women Ratio" 
                  value={`${community.maleMembers || 0}/${community.femaleMembers || 0} Membership`} 
                />
                <Separator />
              </>
            )}
            {community.membershipChoice && (
              <InfoRow 
                label="Membership Choice" 
                value={capitalize(community.membershipChoice)} 
              />
            )}
          </div>
        </Card>
      )}

      {/* Leadership Style */}
      {(community.leadershipStyle || community.topmostOffice) && (
        <Card className="p-4">
          <AboutSectionHeader icon={Crown} title="Leadership Style" />
          <div className="space-y-3">
            {community.leadershipStyle && (
              <>
                <InfoRow label="Election" value={community.leadershipStyle} />
                <Separator />
              </>
            )}
            {community.topmostOffice && (
              <>
                <InfoRow label="Topmost Leadership" value={community.topmostOffice} />
                <Separator />
              </>
            )}
            {community.hasManagementCommittee && (
              <InfoRow 
                label="Administration/Leadership" 
                value={`• Management/Executive Committee\n• Office Tenure: ${community.officeTenure || 'N/A'} years\n• Staff & Employees: ${community.staffCount || 'N/A'}`} 
              />
            )}
          </div>
        </Card>
      )}

      {/* Meetings/Gathering */}
      {(community.generalMeetingSchedule || community.executiveMeetingSchedule) && (
        <Card className="p-4">
          <AboutSectionHeader icon={CalendarDays} title="Meetings/Gathering" />
          <div className="space-y-3">
            {community.generalMeetingSchedule && (
              <>
                <InfoRow label="General Meetings" value={community.generalMeetingSchedule} />
                <Separator />
              </>
            )}
            {community.executiveMeetingSchedule && (
              <>
                <InfoRow label="Executive Meetings" value={community.executiveMeetingSchedule} />
                <Separator />
              </>
            )}
            {community.meetingAttendance && (
              <InfoRow 
                label="Meetings Attendance" 
                value={capitalize(community.meetingAttendance)} 
              />
            )}
          </div>
        </Card>
      )}

      {/* Contact Information */}
      {(community.officeAddress || community.telephone || community.emailAddress) && (
        <Card className="p-4">
          <AboutSectionHeader icon={Contact} title="Contact Information" />
          <div className="space-y-3">
            {community.officeAddress && (
              <>
                <InfoRow value={community.officeAddress} />
                <Separator />
              </>
            )}
            {community.telephone && (
              <>
                <InfoRow label="Tel:" value={community.telephone} />
                {community.telephone2 && (
                  <InfoRow value={community.telephone2} />
                )}
                <Separator />
              </>
            )}
            {community.emailAddress && (
              <InfoRow label="E-mail:" value={community.emailAddress} isLink />
            )}
          </div>
        </Card>
      )}

      {/* About */}
      <Card className="p-4">
        <AboutSectionHeader icon={Info} title="About" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {community.description}
        </p>
      </Card>
    </div>
  );
}
