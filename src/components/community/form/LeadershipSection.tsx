import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CommunityFormData } from "@/types/communityForm";
import { leadershipStyleOptions, topmostOfficeOptions, deputyOfficeOptions } from "@/data/communityFormOptions";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LeadershipSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

export function LeadershipSection({ formData, updateField, errors }: LeadershipSectionProps) {
  const [showCustomTopmost, setShowCustomTopmost] = useState(false);
  const [showCustomDeputy, setShowCustomDeputy] = useState(false);

  const toggleTopmostOffice = (office: string) => {
    const current = formData.topmostOffices;
    if (current.includes(office)) {
      updateField("topmostOffices", current.filter(o => o !== office));
    } else {
      updateField("topmostOffices", [...current, office]);
    }
  };

  const toggleDeputyOffice = (office: string) => {
    const current = formData.deputyOffices;
    if (current.includes(office)) {
      updateField("deputyOffices", current.filter(o => o !== office));
    } else {
      updateField("deputyOffices", [...current, office]);
    }
  };

  const addCustomTopmostOffice = () => {
    if (formData.customTopmostOffice.trim()) {
      updateField("topmostOffices", [...formData.topmostOffices, formData.customTopmostOffice.trim()]);
      updateField("customTopmostOffice", "");
      setShowCustomTopmost(false);
    }
  };

  const addCustomDeputyOffice = () => {
    if (formData.customDeputyOffice.trim()) {
      updateField("deputyOffices", [...formData.deputyOffices, formData.customDeputyOffice.trim()]);
      updateField("customDeputyOffice", "");
      setShowCustomDeputy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="leadershipStyle" className="text-sm font-semibold">
          Selection/Election Style <span className="text-destructive">*</span>
        </Label>
        <Select 
          value={formData.leadershipStyle} 
          onValueChange={(value) => updateField("leadershipStyle", value as any)}
        >
          <SelectTrigger id="leadershipStyle" className={errors.leadershipStyle ? "border-destructive" : ""}>
            <SelectValue placeholder="Select leadership style" />
          </SelectTrigger>
          <SelectContent>
            {leadershipStyleOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.leadershipStyle && (
          <p className="text-xs text-destructive">{errors.leadershipStyle}</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Topmost Offices</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCustomTopmost(!showCustomTopmost)}
          >
            <Plus className="h-3 w-3" />
            Add Custom
          </Button>
        </div>

        {showCustomTopmost && (
          <div className="flex gap-2">
            <Input
              placeholder="Enter custom office title"
              value={formData.customTopmostOffice}
              onChange={(e) => updateField("customTopmostOffice", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCustomTopmostOffice()}
            />
            <Button type="button" size="sm" onClick={addCustomTopmostOffice}>
              Add
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {topmostOfficeOptions.map(office => (
            <div key={office} className="flex items-center space-x-2">
              <Checkbox
                id={`topmost-${office}`}
                checked={formData.topmostOffices.includes(office)}
                onCheckedChange={() => toggleTopmostOffice(office)}
              />
              <Label htmlFor={`topmost-${office}`} className="text-sm font-normal cursor-pointer">
                {office}
              </Label>
            </div>
          ))}
        </div>

        {formData.topmostOffices.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.topmostOffices.map(office => (
              <Badge key={office} variant="secondary" className="gap-1">
                {office}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleTopmostOffice(office)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Deputy Offices</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCustomDeputy(!showCustomDeputy)}
          >
            <Plus className="h-3 w-3" />
            Add Custom
          </Button>
        </div>

        {showCustomDeputy && (
          <div className="flex gap-2">
            <Input
              placeholder="Enter custom deputy title"
              value={formData.customDeputyOffice}
              onChange={(e) => updateField("customDeputyOffice", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCustomDeputyOffice()}
            />
            <Button type="button" size="sm" onClick={addCustomDeputyOffice}>
              Add
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {deputyOfficeOptions.map(office => (
            <div key={office} className="flex items-center space-x-2">
              <Checkbox
                id={`deputy-${office}`}
                checked={formData.deputyOffices.includes(office)}
                onCheckedChange={() => toggleDeputyOffice(office)}
              />
              <Label htmlFor={`deputy-${office}`} className="text-sm font-normal cursor-pointer">
                {office}
              </Label>
            </div>
          ))}
        </div>

        {formData.deputyOffices.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.deputyOffices.map(office => (
              <Badge key={office} variant="secondary" className="gap-1">
                {office}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleDeputyOffice(office)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
