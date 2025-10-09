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
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Social Communities are automatically added when you join organizations on Mobigate. 
          You can only manage privacy settings for these memberships.
        </AlertDescription>
      </Alert>

      {/* Global Privacy Setting */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <Label className="text-base font-semibold">Global Privacy Setting</Label>
        </div>
        <p className="text-sm text-muted-foreground">Apply the same privacy setting to all communities</p>
        <PrivacySelector
          value={globalPrivacy}
          onChange={(value) => handleGlobalPrivacyChange(value as "public" | "friends" | "only_me")}
        />
      </div>

      <Separator />

      {/* Individual Community Privacy */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Individual Privacy Settings</Label>
        
        {communities.length > 0 ? (
          <div className="space-y-4">
            {communities.map((community, index) => (
              <div key={community.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{community.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {community.type}
                      {community.role && ` • ${community.role}`}
                      {` • ${community.status}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Member since: {new Date(community.joinDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`privacy-${community.id}`} className="text-sm">
                      Who can see this?
                    </Label>
                    <PrivacySelector
                      value={community.privacy}
                      onChange={(value) => handlePrivacyChange(community.id, value as "public" | "friends" | "only_me")}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You haven't joined any Social Communities yet.
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};
