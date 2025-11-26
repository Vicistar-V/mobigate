import { Card } from "@/components/ui/card";
import { MapPin, Building, Mail, Phone, Users, Target, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CommunityProfile } from "@/types/community";

interface CommunityAboutTabProps {
  community: CommunityProfile;
}

export function CommunityAboutTab({ community }: CommunityAboutTabProps) {
  return (
    <div className="space-y-6">
      {/* Vision/Mission Statement */}
      {community.visionStatement && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Vision Statement</h3>
              <p className="text-muted-foreground leading-relaxed">{community.visionStatement}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Basic Information */}
      <Card className="p-4 sm:p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          Community Information
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground min-w-[120px]">Type:</span>
            <span className="text-sm text-foreground">{community.type}</span>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground min-w-[120px]">Status:</span>
            <span className="text-sm text-foreground">{community.status}</span>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground min-w-[120px]">Members:</span>
            <span className="text-sm text-foreground flex items-center gap-1">
              <Users className="h-4 w-4" />
              {community.memberCount.toLocaleString()}
            </span>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground min-w-[120px]">
              Established:
            </span>
            <span className="text-sm text-foreground">
              {community.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </Card>

      {/* Origination */}
      {(community.originCountry || community.originState || community.originCity) && (
        <Card className="p-4 sm:p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Origination
          </h3>

          <div className="space-y-4">
            {community.originCountry && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground min-w-[120px]">
                    Country:
                  </span>
                  <span className="text-sm text-foreground">{community.originCountry}</span>
                </div>
                <Separator />
              </>
            )}

            {community.originState && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground min-w-[120px]">
                    State/Province:
                  </span>
                  <span className="text-sm text-foreground">{community.originState}</span>
                </div>
                <Separator />
              </>
            )}

            {community.originCity && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground min-w-[120px]">
                  City/County:
                </span>
                <span className="text-sm text-foreground">{community.originCity}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Official Contacts */}
      {(community.officeAddress || community.telephone || community.emailAddress) && (
        <Card className="p-4 sm:p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Official Contacts
          </h3>

          <div className="space-y-4">
            {community.officeAddress && (
              <>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
                    <p className="text-sm text-foreground">{community.officeAddress}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {community.telephone && (
              <>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Telephone</p>
                    <p className="text-sm text-foreground">{community.telephone}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {community.emailAddress && (
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                  <p className="text-sm text-foreground">{community.emailAddress}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Description */}
      <Card className="p-4 sm:p-6">
        <h3 className="font-semibold text-foreground mb-4">About</h3>
        <p className="text-muted-foreground leading-relaxed">{community.description}</p>
      </Card>
    </div>
  );
}
