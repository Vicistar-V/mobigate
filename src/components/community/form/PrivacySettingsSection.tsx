import { CommunityFormData, AccessLevel } from "@/types/communityForm";
import { accessLevelOptions } from "@/data/communityFormOptions";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PrivacySettingsSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

export function PrivacySettingsSection({
  formData,
  updateField,
  errors,
}: PrivacySettingsSectionProps) {
  const showAdminSelector = 
    formData.privacyCommunityFinances === "specified-admin" ||
    formData.privacyMembersFinancialStatus === "specified-admin" ||
    formData.privacyMembersComplaints === "specified-admin" ||
    formData.privacyRecordingMeetings === "specified-admin" ||
    formData.privacySeeGeneralPosts === "specified-admin" ||
    formData.privacySeeMembersComments === "specified-admin";

  const toggleAdmin = (adminNum: number) => {
    const currentSelection = formData.specifiedAdminNumbers || [];
    if (currentSelection.includes(adminNum)) {
      updateField("specifiedAdminNumbers", currentSelection.filter(n => n !== adminNum));
    } else {
      updateField("specifiedAdminNumbers", [...currentSelection, adminNum]);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-sm text-muted-foreground">
        Control who can view sensitive community information and activities.
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="privacy-finances">Who Can See Community Finances</Label>
          <Select
            value={formData.privacyCommunityFinances}
            onValueChange={(value) => updateField("privacyCommunityFinances", value as AccessLevel)}
          >
            <SelectTrigger id="privacy-finances">
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              {accessLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="privacy-member-finances">Who Can See Members' Financial Status</Label>
          <Select
            value={formData.privacyMembersFinancialStatus}
            onValueChange={(value) => updateField("privacyMembersFinancialStatus", value as AccessLevel)}
          >
            <SelectTrigger id="privacy-member-finances">
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              {accessLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="privacy-complaints">Who Can See Members' Complaints</Label>
          <Select
            value={formData.privacyMembersComplaints}
            onValueChange={(value) => updateField("privacyMembersComplaints", value as AccessLevel)}
          >
            <SelectTrigger id="privacy-complaints">
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              {accessLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="privacy-recordings">Who Can See Recording of Meetings</Label>
          <Select
            value={formData.privacyRecordingMeetings}
            onValueChange={(value) => updateField("privacyRecordingMeetings", value as AccessLevel)}
          >
            <SelectTrigger id="privacy-recordings">
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              {accessLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="privacy-posts">Who Can See General Posts</Label>
          <Select
            value={formData.privacySeeGeneralPosts}
            onValueChange={(value) => updateField("privacySeeGeneralPosts", value as AccessLevel)}
          >
            <SelectTrigger id="privacy-posts">
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              {accessLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="privacy-comments">Who Can See Members' Comments</Label>
          <Select
            value={formData.privacySeeMembersComments}
            onValueChange={(value) => updateField("privacySeeMembersComments", value as AccessLevel)}
          >
            <SelectTrigger id="privacy-comments">
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              {accessLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showAdminSelector && (
          <div className="space-y-3 pt-4 border-t border-border">
            <div>
              <Label className="text-base font-medium">Specified Admin Numbers</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Select one or more admins who can access these settings
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                <Button
                  key={num}
                  type="button"
                  variant={(formData.specifiedAdminNumbers || []).includes(num) ? "default" : "outline"}
                  size="sm"
                  className="h-10 text-xs"
                  onClick={() => toggleAdmin(num)}
                >
                  Admin-{num}
                </Button>
              ))}
            </div>
            {(formData.specifiedAdminNumbers || []).length > 0 && (
              <p className="text-sm text-muted-foreground">
                Selected: {(formData.specifiedAdminNumbers || []).sort((a, b) => a - b).join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
