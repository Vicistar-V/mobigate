import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CommunityFormData } from "@/types/communityForm";
import { genderOptions, membershipChoiceOptions } from "@/data/communityFormOptions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MembershipSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

export function MembershipSection({ formData, updateField, errors }: MembershipSectionProps) {
  // Calculate gender ratio
  const getMenWomenRatio = () => {
    if (formData.gender === "males") return "100% Men, 0% Women";
    if (formData.gender === "females") return "0% Men, 100% Women";
    return "50% Men, 50% Women";
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="gender" className="text-sm font-medium">
          Gender <span className="text-destructive">*</span>
        </Label>
        <Select 
          value={formData.gender} 
          onValueChange={(value) => updateField("gender", value as any)}
        >
          <SelectTrigger id="gender" className="h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {genderOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Men/Women Ratio</Label>
        <div className="p-3 rounded-lg bg-muted/50 border">
          <Badge variant="secondary" className="font-normal">
            {getMenWomenRatio()}
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">Automatically calculated</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="membershipChoice" className="text-sm font-medium">
          Membership Choice <span className="text-destructive">*</span>
        </Label>
        <Select 
          value={formData.membershipChoice} 
          onValueChange={(value) => updateField("membershipChoice", value as any)}
        >
          <SelectTrigger id="membershipChoice" className="h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {membershipChoiceOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="populationStrength" className="text-sm font-medium">
          Population Strength <span className="text-destructive">*</span>
        </Label>
        <Input
          id="populationStrength"
          type="number"
          min="1"
          value={formData.populationStrength || ""}
          onChange={(e) => updateField("populationStrength", parseInt(e.target.value) || 0)}
          placeholder="Enter expected population"
          className={cn("h-11", errors.populationStrength && "border-destructive focus-visible:ring-destructive")}
        />
        {errors.populationStrength && (
          <p className="text-xs text-destructive">{errors.populationStrength}</p>
        )}
      </div>
    </div>
  );
}
