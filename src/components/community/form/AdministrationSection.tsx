import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CommunityFormData } from "@/types/communityForm";

interface AdministrationSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
}

export function AdministrationSection({ formData, updateField }: AdministrationSectionProps) {
  // Local state for display values (allows empty strings while typing)
  const [tenureDisplay, setTenureDisplay] = useState<string>(
    formData.officeTenure.toString()
  );
  const [staffDisplay, setStaffDisplay] = useState<string>(
    formData.staffCount.toString()
  );

  // Sync display state when form data changes externally
  useEffect(() => {
    setTenureDisplay(formData.officeTenure.toString());
  }, [formData.officeTenure]);

  useEffect(() => {
    setStaffDisplay(formData.staffCount.toString());
  }, [formData.staffCount]);
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
          value={tenureDisplay}
          onChange={(e) => {
            const value = e.target.value;
            setTenureDisplay(value);
            
            // Only update form if valid number
            if (value !== "" && !isNaN(parseInt(value))) {
              updateField("officeTenure", parseInt(value));
            }
          }}
          onBlur={() => {
            // On blur, if empty, reset to default
            if (tenureDisplay === "" || isNaN(parseInt(tenureDisplay))) {
              setTenureDisplay("1");
              updateField("officeTenure", 1);
            }
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
          value={staffDisplay}
          onChange={(e) => {
            const value = e.target.value;
            setStaffDisplay(value);
            
            // Only update form if valid number
            if (value !== "" && !isNaN(parseInt(value))) {
              updateField("staffCount", parseInt(value));
            }
          }}
          onBlur={() => {
            // On blur, if empty, reset to default
            if (staffDisplay === "" || isNaN(parseInt(staffDisplay))) {
              setStaffDisplay("0");
              updateField("staffCount", 0);
            }
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
