import { CommunityFormData, AccessLevel } from "@/types/communityForm";
import { accessLevelOptions } from "@/data/communityFormOptions";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddingPeoplePostingSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

interface AccessSelectWithCustomProps {
  id: string;
  label: string;
  value: AccessLevel;
  onChange: (value: AccessLevel) => void;
  customValue: string;
  onCustomChange: (value: string) => void;
}

function AccessSelectWithCustom({ id, label, value, onChange, customValue, onCustomChange }: AccessSelectWithCustomProps) {
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

export function AddingPeoplePostingSection({
  formData,
  updateField,
  errors,
}: AddingPeoplePostingSectionProps) {
  const showSpecifiedAdminSelector = 
    formData.whoCanAdd === "specified-admin" ||
    formData.whoCanApproveNewMembers === "specified-admin" ||
    formData.whoCanRemoveSuspendBlock === "specified-admin" ||
    formData.whoCanPost === "specified-admin" ||
    formData.whoCanEditPauseDeleteApprove === "specified-admin";

  const toggleAdmin = (adminNum: number) => {
    const currentSelection = formData.specifiedAdminNumbers || [];
    if (currentSelection.includes(adminNum)) {
      updateField("specifiedAdminNumbers", currentSelection.filter(n => n !== adminNum));
    } else {
      updateField("specifiedAdminNumbers", [...currentSelection, adminNum]);
    }
  };

  const specifiedAdminNumbers = formData.specifiedAdminNumbers || [];

  // Custom input values per field (stored as comma-separated in specifiedAdminNumbers)
  const getCustomValueForField = () => {
    return specifiedAdminNumbers.sort((a, b) => a - b).join(", ");
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
      {/* Adding People */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Adding People</h3>

        <AccessSelectWithCustom
          id="who-can-add"
          label="Who Can Add Members"
          value={formData.whoCanAdd}
          onChange={(v) => updateField("whoCanAdd", v)}
          customValue={getCustomValueForField()}
          onCustomChange={handleCustomInput}
        />

        <AccessSelectWithCustom
          id="who-can-approve"
          label="Who Can Approve New Members"
          value={formData.whoCanApproveNewMembers}
          onChange={(v) => updateField("whoCanApproveNewMembers", v)}
          customValue={getCustomValueForField()}
          onCustomChange={handleCustomInput}
        />

        <AccessSelectWithCustom
          id="who-can-remove"
          label="Who Can Remove/Suspend/Block Members"
          value={formData.whoCanRemoveSuspendBlock}
          onChange={(v) => updateField("whoCanRemoveSuspendBlock", v)}
          customValue={getCustomValueForField()}
          onCustomChange={handleCustomInput}
        />
      </div>

      {/* Posting on Community */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Posting on Community</h3>

        <AccessSelectWithCustom
          id="who-can-post"
          label="Who Can Post"
          value={formData.whoCanPost}
          onChange={(v) => updateField("whoCanPost", v)}
          customValue={getCustomValueForField()}
          onCustomChange={handleCustomInput}
        />

        <AccessSelectWithCustom
          id="who-can-edit"
          label="Who Can Edit/Pause/Delete/Approve Posts"
          value={formData.whoCanEditPauseDeleteApprove}
          onChange={(v) => updateField("whoCanEditPauseDeleteApprove", v)}
          customValue={getCustomValueForField()}
          onCustomChange={handleCustomInput}
        />
      </div>

      {/* Multi-Select Admin Buttons */}
      {showSpecifiedAdminSelector && (
        <div className="space-y-3 pt-4 border-t border-border">
          <Label>Specified Admin Numbers</Label>
          <p className="text-xs text-muted-foreground">
            Select one or more admins (tap to toggle selection)
          </p>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
              <Button
                key={num}
                type="button"
                variant={specifiedAdminNumbers.includes(num) ? "default" : "outline"}
                size="sm"
                className="h-10 text-xs"
                onClick={() => toggleAdmin(num)}
              >
                Admin-{num}
              </Button>
            ))}
          </div>
          {specifiedAdminNumbers.length > 0 && (
            <p className="text-xs text-primary font-medium">
              Selected: {specifiedAdminNumbers.sort((a, b) => a - b).join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
