import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { CommunityFormData, CommunityInterest } from "@/types/communityForm";
import { classificationOptions, categoryOptions } from "@/data/communityFormOptions";
import { cn } from "@/lib/utils";

interface ClassificationSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

export function ClassificationSection({ formData, updateField, errors }: ClassificationSectionProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="classification" className="text-sm font-medium">
          Classification <span className="text-destructive">*</span>
        </Label>
        <Select 
          value={formData.classification} 
          onValueChange={(value) => updateField("classification", value as any)}
        >
          <SelectTrigger id="classification" className={cn("h-11", errors.classification && "border-destructive focus-visible:ring-destructive")}>
            <SelectValue placeholder="Select classification" />
          </SelectTrigger>
          <SelectContent>
            {classificationOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.classification && (
          <p className="text-xs text-destructive">{errors.classification}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium">
          Type/Category <span className="text-destructive">*</span>
        </Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => updateField("category", value as any)}
        >
          <SelectTrigger id="category" className={cn("h-11", errors.category && "border-destructive focus-visible:ring-destructive")}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-xs text-destructive">{errors.category}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Community Interests</Label>
        <RadioGroup
          value={formData.interest} 
          onValueChange={(value) => updateField("interest", value as CommunityInterest)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="personal" id="personal" />
            <Label htmlFor="personal" className="font-normal cursor-pointer">Personal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public" className="font-normal cursor-pointer">Public</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="designation" className="text-sm font-medium">
          Designation <span className="text-destructive">*</span>
        </Label>
        <Input
          id="designation"
          value={formData.designation}
          onChange={(e) => updateField("designation", e.target.value)}
          placeholder="Enter community designation"
          className={cn("h-11", errors.designation && "border-destructive focus-visible:ring-destructive")}
        />
        {errors.designation && (
          <p className="text-xs text-destructive">{errors.designation}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Founder</Label>
        <Input
          value={formData.founderName}
          disabled
          className="bg-muted h-11"
        />
        <p className="text-xs text-muted-foreground">You are set as the founder</p>
      </div>
    </div>
  );
}
