import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CommunityFormData } from "@/types/communityForm";
import { leadershipStyleOptions, topmostOfficeOptions, deputyOfficeOptions } from "@/data/communityFormOptions";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeadershipSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

export function LeadershipSection({ formData, updateField, errors }: LeadershipSectionProps) {
  const [showCustomTopmost, setShowCustomTopmost] = useState(false);
  const [showCustomDeputy, setShowCustomDeputy] = useState(false);
  const [customTopmostOptions, setCustomTopmostOptions] = useState<string[]>([]);
  const [customDeputyOptions, setCustomDeputyOptions] = useState<string[]>([]);

  const selectTopmostOffice = (office: string) => {
    updateField("topmostOffice", office);
  };

  const selectDeputyOffice = (office: string) => {
    updateField("deputyOffice", office);
  };

  const addCustomTopmostOffice = () => {
    if (formData.customTopmostOffice.trim()) {
      const customOffice = formData.customTopmostOffice.trim();
      setCustomTopmostOptions([...customTopmostOptions, customOffice]);
      updateField("topmostOffice", customOffice);
      updateField("customTopmostOffice", "");
      setShowCustomTopmost(false);
    }
  };

  const addCustomDeputyOffice = () => {
    if (formData.customDeputyOffice.trim()) {
      const customOffice = formData.customDeputyOffice.trim();
      setCustomDeputyOptions([...customDeputyOptions, customOffice]);
      updateField("deputyOffice", customOffice);
      updateField("customDeputyOffice", "");
      setShowCustomDeputy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="leadershipStyle" className="text-sm font-medium">
          Selection/Election Style <span className="text-destructive">*</span>
        </Label>
        <Select 
          value={formData.leadershipStyle} 
          onValueChange={(value) => updateField("leadershipStyle", value as any)}
        >
          <SelectTrigger id="leadershipStyle" className={cn("h-11", errors.leadershipStyle && "border-destructive focus-visible:ring-destructive")}>
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
          <Label className="text-sm font-medium">Topmost Office</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCustomTopmost(!showCustomTopmost)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Custom
          </Button>
        </div>

        {showCustomTopmost && (
          <div className="flex gap-2">
            <Input
              placeholder="Enter custom office title"
              value={formData.customTopmostOffice}
              onChange={(e) => updateField("customTopmostOffice", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCustomTopmostOffice()}
              className="h-10"
            />
            <Button type="button" size="sm" onClick={addCustomTopmostOffice} className="shrink-0">
              Add
            </Button>
          </div>
        )}

        <RadioGroup value={formData.topmostOffice} onValueChange={selectTopmostOffice}>
          <div className="grid grid-cols-2 gap-3">
            {[...topmostOfficeOptions, ...customTopmostOptions].map(office => (
              <div key={office} className="flex items-center space-x-2">
                <RadioGroupItem
                  id={`topmost-${office}`}
                  value={office}
                />
                <Label htmlFor={`topmost-${office}`} className="text-sm font-normal cursor-pointer">
                  {office}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        {formData.topmostOffice && (
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">
              Selected: {formData.topmostOffice}
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Deputy Office</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCustomDeputy(!showCustomDeputy)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Custom
          </Button>
        </div>

        {showCustomDeputy && (
          <div className="flex gap-2">
            <Input
              placeholder="Enter custom deputy title"
              value={formData.customDeputyOffice}
              onChange={(e) => updateField("customDeputyOffice", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCustomDeputyOffice()}
              className="h-10"
            />
            <Button type="button" size="sm" onClick={addCustomDeputyOffice} className="shrink-0">
              Add
            </Button>
          </div>
        )}

        <RadioGroup value={formData.deputyOffice} onValueChange={selectDeputyOffice}>
          <div className="grid grid-cols-2 gap-3">
            {[...deputyOfficeOptions, ...customDeputyOptions].map(office => (
              <div key={office} className="flex items-center space-x-2">
                <RadioGroupItem
                  id={`deputy-${office}`}
                  value={office}
                />
                <Label htmlFor={`deputy-${office}`} className="text-sm font-normal cursor-pointer">
                  {office}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        {formData.deputyOffice && (
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">
              Selected: {formData.deputyOffice}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
