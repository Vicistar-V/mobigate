import { CommunityFormData, AccessLevel } from "@/types/communityForm";
import { accessLevelOptions } from "@/data/communityFormOptions";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  const showSpecifiedAdminSelector = 
    formData.whoCanAdd === "specified-admin" ||
    formData.whoCanApproveNewMembers === "specified-admin" ||
    formData.whoCanRemoveSuspendBlock === "specified-admin" ||
    formData.whoCanPost === "specified-admin" ||
    formData.whoCanEditPauseDeleteApprove === "specified-admin";

  // Toggle admin selection
  const toggleAdmin = (adminNum: number) => {
    const currentSelection = formData.specifiedAdminNumbers || [];
    if (currentSelection.includes(adminNum)) {
      updateField("specifiedAdminNumbers", currentSelection.filter(n => n !== adminNum));
    } else {
      updateField("specifiedAdminNumbers", [...currentSelection, adminNum]);
    }
  };

  const specifiedAdminNumbers = formData.specifiedAdminNumbers || [];

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
