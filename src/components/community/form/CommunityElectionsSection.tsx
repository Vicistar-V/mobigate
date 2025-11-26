import { CommunityFormData, AccessLevel } from "@/types/communityForm";
import { accessLevelOptions } from "@/data/communityFormOptions";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  return (
    <div className="space-y-6">
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
    </div>
  );
}
