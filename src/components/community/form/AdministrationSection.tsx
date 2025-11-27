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
  const [adminsDisplay, setAdminsDisplay] = useState<string>(
    formData.maxAdminsAllowed.toString()
  );

  // Sync display state when form data changes externally
  useEffect(() => {
    setTenureDisplay(formData.officeTenure.toString());
  }, [formData.officeTenure]);

  useEffect(() => {
    setStaffDisplay(formData.staffCount.toString());
  }, [formData.staffCount]);

  useEffect(() => {
    setAdminsDisplay(formData.maxAdminsAllowed.toString());
  }, [formData.maxAdminsAllowed]);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="officeTenure" className="text-sm font-medium">
          Office Tenure (Years)
        </Label>
        <Input
          id="officeTenure"
          type="number"
          min="1"
          max="10"
          value={tenureDisplay}
          className="h-11"
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
        <Label htmlFor="maxAdminsAllowed" className="text-sm font-medium">
          Number of Admins Allowed
        </Label>
        <Input
          id="maxAdminsAllowed"
          type="number"
          min="1"
          max="20"
          value={adminsDisplay}
          className="h-11"
          onChange={(e) => {
            const value = e.target.value;
            setAdminsDisplay(value);
            
            // Only update form if valid number
            if (value !== "" && !isNaN(parseInt(value))) {
              updateField("maxAdminsAllowed", parseInt(value));
            }
          }}
          onBlur={() => {
            // On blur, if empty, reset to default
            if (adminsDisplay === "" || isNaN(parseInt(adminsDisplay))) {
              setAdminsDisplay("1");
              updateField("maxAdminsAllowed", 1);
            }
          }}
          placeholder="Number of admins (1-20)"
        />
        <p className="text-xs text-muted-foreground">
          Maximum number of administrators for this community
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="staffCount" className="text-sm font-medium">
          Staff & Employees Count
        </Label>
        <Input
          id="staffCount"
          type="number"
          min="0"
          value={staffDisplay}
          className="h-11"
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
