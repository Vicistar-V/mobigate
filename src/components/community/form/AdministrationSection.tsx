import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CommunityFormData } from "@/types/communityForm";

interface AdministrationSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
}

export function AdministrationSection({ formData, updateField }: AdministrationSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="officeTenure" className="text-sm font-semibold">
          Office Tenure (Years)
        </Label>
        <Input
          id="officeTenure"
          type="number"
          min="1"
          max="10"
          value={formData.officeTenure}
          onChange={(e) => {
            const value = e.target.value;
            updateField("officeTenure", value === "" ? 1 : parseInt(value) || 1);
          }}
        />
        <p className="text-xs text-muted-foreground">
          How long should elected officials serve?
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="staffCount" className="text-sm font-semibold">
          Staff & Employees Count
        </Label>
        <Input
          id="staffCount"
          type="number"
          min="0"
          value={formData.staffCount}
          onChange={(e) => {
            const value = e.target.value;
            updateField("staffCount", value === "" ? 0 : parseInt(value) || 0);
          }}
          placeholder="Number of staff/employees"
        />
        <p className="text-xs text-muted-foreground">
          Total number of staff and employees
        </p>
      </div>
    </div>
  );
}
