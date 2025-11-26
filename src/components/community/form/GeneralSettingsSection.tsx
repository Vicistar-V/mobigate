import { CommunityFormData } from "@/types/communityForm";
import { mockAdminOptions } from "@/data/communityFormOptions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GeneralSettingsSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

export function GeneralSettingsSection({
  formData,
  updateField,
  errors,
}: GeneralSettingsSectionProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="handover-time">Handover Time</Label>
          <Input
            id="handover-time"
            type="datetime-local"
            value={formData.handoverTime}
            onChange={(e) => updateField("handoverTime", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            The date and time when leadership changes take effect
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-manager">Community Account Manager</Label>
          <Select
            value={formData.communityAccountManager}
            onValueChange={(value) => updateField("communityAccountManager", value)}
          >
            <SelectTrigger id="account-manager">
              <SelectValue placeholder="Select account manager" />
            </SelectTrigger>
            <SelectContent>
              {mockAdminOptions.map((admin) => (
                <SelectItem key={admin.id} value={admin.id}>
                  {admin.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meetings-fee">Meetings Download Fee</Label>
          <Input
            id="meetings-fee"
            type="number"
            min="0"
            placeholder="0"
            value={formData.meetingsDownloadFee}
            onChange={(e) => updateField("meetingsDownloadFee", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Fee for downloading meeting recordings/documents
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="public-access-fee">Public Access Fee</Label>
          <Input
            id="public-access-fee"
            type="number"
            min="0"
            placeholder="0"
            value={formData.publicAccessFee}
            onChange={(e) => updateField("publicAccessFee", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Fee for public guests to access community resources
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="complaint-box-fee">Complaint Box Fee</Label>
          <Input
            id="complaint-box-fee"
            type="number"
            min="0"
            placeholder="0"
            value={formData.complaintBoxFee}
            onChange={(e) => updateField("complaintBoxFee", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Fee for submitting formal complaints
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="posting-fee">Posting Fee</Label>
          <Input
            id="posting-fee"
            type="number"
            min="0"
            placeholder="0"
            value={formData.postingFee}
            onChange={(e) => updateField("postingFee", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Fee for posting content to the community
          </p>
        </div>
      </div>
    </div>
  );
}
