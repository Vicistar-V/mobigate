import { CommunityFormData, AccessLevel } from "@/types/communityForm";
import { accessLevelOptions } from "@/data/communityFormOptions";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  return (
    <div className="space-y-6">
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
      </div>
    </div>
  );
}
