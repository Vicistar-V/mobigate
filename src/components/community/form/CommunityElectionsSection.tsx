import { CommunityFormData, AccessLevel } from "@/types/communityForm";
import { accessLevelOptions } from "@/data/communityFormOptions";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface CommunityElectionsSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

export function CommunityElectionsSection({
  formData,
  updateField,
  errors,
}: CommunityElectionsSectionProps) {
  // Check if any election field needs admin selection
  const showAdminSelector = 
    formData.whoCanVote === "specified-admin" ||
    formData.whoCanViewElectionResults === "specified-admin" ||
    formData.whoCanViewAccreditedVoters === "specified-admin" ||
    formData.whoCanDownloadResources === "specified-admin";

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
      <div className="text-sm text-muted-foreground">
        Configure access controls for community elections and voting processes.
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="who-can-vote">Who Can Vote</Label>
          <Select
            value={formData.whoCanVote}
            onValueChange={(value) => updateField("whoCanVote", value as AccessLevel)}
          >
            <SelectTrigger id="who-can-vote">
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
          <Label htmlFor="view-results">Who Can View Election Results</Label>
          <Select
            value={formData.whoCanViewElectionResults}
            onValueChange={(value) => updateField("whoCanViewElectionResults", value as AccessLevel)}
          >
            <SelectTrigger id="view-results">
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
          <Label htmlFor="view-voters">Who Can View Accredited Voters</Label>
          <Select
            value={formData.whoCanViewAccreditedVoters}
            onValueChange={(value) => updateField("whoCanViewAccreditedVoters", value as AccessLevel)}
          >
            <SelectTrigger id="view-voters">
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
          <Label htmlFor="download-resources">Who Can Download Resources</Label>
          <Select
            value={formData.whoCanDownloadResources}
            onValueChange={(value) => updateField("whoCanDownloadResources", value as AccessLevel)}
          >
            <SelectTrigger id="download-resources">
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
      {showAdminSelector && (
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
