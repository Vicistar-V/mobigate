import { CommunityFormData, AccessLevel } from "@/types/communityForm";
import { accessLevelOptions } from "@/data/communityFormOptions";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PrivacySettingsSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

interface PrivacySelectWithCustomProps {
  id: string;
  label: string;
  value: AccessLevel;
  onChange: (value: AccessLevel) => void;
  customValue: string;
  onCustomChange: (value: string) => void;
}

function PrivacySelectWithCustom({ id, label, value, onChange, customValue, onCustomChange }: PrivacySelectWithCustomProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={(v) => onChange(v as AccessLevel)}>
        <SelectTrigger id={id}>
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
      {value === "specified-admin" && (
        <Input
          placeholder="Enter admin number(s), e.g. 1, 3, 5"
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          className="mt-1.5 text-sm"
        />
      )}
    </div>
  );
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

  const getCustomValue = () => {
    return (formData.specifiedAdminNumbers || []).sort((a, b) => a - b).join(", ");
  };

  const handleCustomInput = (input: string) => {
    const nums = input
      .split(/[,\s]+/)
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= 20);
    updateField("specifiedAdminNumbers", [...new Set(nums)]);
  };

  return (
    <div className="space-y-5">
      <div className="text-sm text-muted-foreground">
        Control who can view sensitive community information and activities.
      </div>

      <div className="space-y-4">
        <PrivacySelectWithCustom
          id="privacy-finances"
          label="Who Can See Community Finances"
          value={formData.privacyCommunityFinances}
          onChange={(v) => updateField("privacyCommunityFinances", v)}
          customValue={getCustomValue()}
          onCustomChange={handleCustomInput}
        />

        <PrivacySelectWithCustom
          id="privacy-member-finances"
          label="Who Can See Members' Financial Status"
          value={formData.privacyMembersFinancialStatus}
          onChange={(v) => updateField("privacyMembersFinancialStatus", v)}
          customValue={getCustomValue()}
          onCustomChange={handleCustomInput}
        />

        <PrivacySelectWithCustom
          id="privacy-complaints"
          label="Who Can See Members' Complaints"
          value={formData.privacyMembersComplaints}
          onChange={(v) => updateField("privacyMembersComplaints", v)}
          customValue={getCustomValue()}
          onCustomChange={handleCustomInput}
        />

        <PrivacySelectWithCustom
          id="privacy-recordings"
          label="Who Can See Recording of Meetings"
          value={formData.privacyRecordingMeetings}
          onChange={(v) => updateField("privacyRecordingMeetings", v)}
          customValue={getCustomValue()}
          onCustomChange={handleCustomInput}
        />

        <PrivacySelectWithCustom
          id="privacy-posts"
          label="Who Can See General Posts"
          value={formData.privacySeeGeneralPosts}
          onChange={(v) => updateField("privacySeeGeneralPosts", v)}
          customValue={getCustomValue()}
          onCustomChange={handleCustomInput}
        />

        <PrivacySelectWithCustom
          id="privacy-comments"
          label="Who Can See Members' Comments"
          value={formData.privacySeeMembersComments}
          onChange={(v) => updateField("privacySeeMembersComments", v)}
          customValue={getCustomValue()}
          onCustomChange={handleCustomInput}
        />

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
