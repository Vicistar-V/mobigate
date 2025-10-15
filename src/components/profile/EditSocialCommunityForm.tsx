import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Shield } from "lucide-react";
import { PrivacySelector } from "./PrivacySelector";

export interface SocialCommunity {
  id: string;
  name: string;
  type: "Town Union" | "Club" | "Association" | "Society" | "Group";
  role?: string;
  joinDate: string;
  status: "Active" | "Inactive";
  location?: string;
  privacy: "public" | "friends" | "only_me";
}

interface EditSocialCommunityFormProps {
  currentData: SocialCommunity[];
  onSave: (data: SocialCommunity[]) => void;
  onClose: () => void;
}

export const EditSocialCommunityForm = ({
  currentData,
  onSave,
  onClose,
}: EditSocialCommunityFormProps) => {
  const [communities, setCommunities] = useState<SocialCommunity[]>(currentData);
  const [globalPrivacy, setGlobalPrivacy] = useState<"public" | "friends" | "only_me" | "">("");

  const handlePrivacyChange = (id: string, privacy: "public" | "friends" | "only_me") => {
    setCommunities(prev =>
      prev.map(community =>
        community.id === id ? { ...community, privacy } : community
      )
    );
  };

  const handleGlobalPrivacyChange = (privacy: "public" | "friends" | "only_me") => {
    setGlobalPrivacy(privacy);
    setCommunities(prev =>
      prev.map(community => ({ ...community, privacy }))
    );
  };

  const handleSave = () => {
    onSave(communities);
    onClose();
  };

  const getPrivacyLabel = (privacy: string) => {
    switch (privacy) {
      case "public":
        return "🌐 Public";
      case "friends":
        return "👥 Friends";
      case "only_me":
        return "🔒 Only Me";
      default:
        return privacy;
    }
  };

  return (
    <div className="space-y-6 p-1">
      {/* Alert - Enhanced */}
      <Alert className="p-5 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <AlertDescription className="text-sm leading-relaxed">
            Social Communities are automatically added when you join organizations on Mobigate. 
            You can only manage privacy settings for these memberships.
          </AlertDescription>
        </div>
      </Alert>

      {/* Global Privacy Setting - Card Container */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold">Global Privacy Setting</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pl-7">
            Apply the same privacy setting to all communities
          </p>
        </div>
        
        <div className="pl-7">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Privacy Level</Label>
            <PrivacySelector
              value={globalPrivacy}
              onChange={(value) => handleGlobalPrivacyChange(value as "public" | "friends" | "only_me")}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Individual Communities */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold px-1">Individual Privacy Settings</h3>
        
        {communities.length > 0 ? (
          <div className="space-y-4">
            {communities.map((community) => (
              <div key={community.id} className="rounded-lg border bg-card p-4 space-y-4">
                {/* Community Header */}
                <div className="space-y-2">
                  <h4 className="font-medium text-base">{community.name}</h4>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center">
                      {community.type}
                    </span>
                    {community.role && (
                      <>
                        <span>•</span>
                        <span>{community.role}</span>
                      </>
                    )}
                    <span>•</span>
                    <span className={community.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                      {community.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(community.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                {/* Privacy Control */}
                <div className="space-y-2 pt-2 border-t">
                  <Label className="text-sm font-medium">Who can see this?</Label>
                  <PrivacySelector
                    value={community.privacy}
                    onChange={(value) => handlePrivacyChange(community.id, value as "public" | "friends" | "only_me")}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-muted/20 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              You haven't joined any Social Communities yet.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="w-full sm:w-auto min-h-[44px] sm:min-h-[40px]"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          className="w-full sm:w-auto min-h-[44px] sm:min-h-[40px]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
