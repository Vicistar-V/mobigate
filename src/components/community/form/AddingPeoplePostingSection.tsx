import { CommunityFormData, AccessLevel } from "@/types/communityForm";
import { accessLevelOptions } from "@/data/communityFormOptions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddingPeoplePostingSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

export function AddingPeoplePostingSection({
  formData,
  updateField,
  errors,
}: AddingPeoplePostingSectionProps) {
  const showSpecifiedAdminInput = 
    formData.whoCanAdd === "specified-admin" ||
    formData.whoCanApproveNewMembers === "specified-admin" ||
    formData.whoCanRemoveSuspendBlock === "specified-admin" ||
    formData.whoCanPost === "specified-admin" ||
    formData.whoCanEditPauseDeleteApprove === "specified-admin";

  return (
    <div className="space-y-5">
      {/* Adding People */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Adding People</h3>

        <div className="space-y-2">
          <Label htmlFor="who-can-add">Who Can Add Members</Label>
          <Select
            value={formData.whoCanAdd}
            onValueChange={(value) => updateField("whoCanAdd", value as AccessLevel)}
          >
            <SelectTrigger id="who-can-add">
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
          <Label htmlFor="who-can-approve">Who Can Approve New Members</Label>
          <Select
            value={formData.whoCanApproveNewMembers}
            onValueChange={(value) => updateField("whoCanApproveNewMembers", value as AccessLevel)}
          >
            <SelectTrigger id="who-can-approve">
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
          <Label htmlFor="who-can-remove">Who Can Remove/Suspend/Block Members</Label>
          <Select
            value={formData.whoCanRemoveSuspendBlock}
            onValueChange={(value) => updateField("whoCanRemoveSuspendBlock", value as AccessLevel)}
          >
            <SelectTrigger id="who-can-remove">
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

      {/* Posting on Community */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Posting on Community</h3>

        <div className="space-y-2">
          <Label htmlFor="who-can-post">Who Can Post</Label>
          <Select
            value={formData.whoCanPost}
            onValueChange={(value) => updateField("whoCanPost", value as AccessLevel)}
          >
            <SelectTrigger id="who-can-post">
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
          <Label htmlFor="who-can-edit">Who Can Edit/Pause/Delete/Approve Posts</Label>
          <Select
            value={formData.whoCanEditPauseDeleteApprove}
            onValueChange={(value) => updateField("whoCanEditPauseDeleteApprove", value as AccessLevel)}
          >
            <SelectTrigger id="who-can-edit">
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

      {/* Conditional Specified Admin Number */}
      {showSpecifiedAdminInput && (
        <div className="space-y-2 pt-4 border-t">
          <Label htmlFor="specified-admin-number">Specified Admin Number</Label>
          <Input
            id="specified-admin-number"
            type="number"
            min="1"
            max="20"
            placeholder="Enter admin number (1-20)"
            value={formData.specifiedAdminNumber}
            onChange={(e) => updateField("specifiedAdminNumber", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Enter the admin number (1-20) for permissions set to "Only a Specified Admin"
          </p>
        </div>
      )}
    </div>
  );
}
