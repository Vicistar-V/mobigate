import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { CommunityFormData, CommunityInterest } from "@/types/communityForm";
import { classificationOptions, categoryOptions } from "@/data/communityFormOptions";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

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
          <SelectContent className="bg-background border z-50">
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

      {formData.classification === "other" && (
        <div className="space-y-2">
          <Label htmlFor="customClassification" className="text-sm font-medium">
            Specify Classification <span className="text-destructive">*</span>
          </Label>
          <Input
            id="customClassification"
            placeholder="Enter your custom classification"
            value={formData.customClassification}
            onChange={(e) => updateField("customClassification", e.target.value)}
            className="h-11"
          />
        </div>
      )}

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
          <SelectContent className="bg-background border z-50">
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

      {formData.category === "other" && (
        <div className="space-y-2">
          <Label htmlFor="customCategory" className="text-sm font-medium">
            Specify Category <span className="text-destructive">*</span>
          </Label>
          <Input
            id="customCategory"
            placeholder="Enter your custom category"
            value={formData.customCategory}
            onChange={(e) => updateField("customCategory", e.target.value)}
            className="h-11"
          />
        </div>
      )}

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
        <Label className="text-sm font-medium">
          Designation
        </Label>
        <div className="bg-muted rounded-md px-3 py-2 h-11 flex items-center">
          <span className="text-sm text-muted-foreground">System Assigned Automatically</span>
        </div>
        <div className="flex items-start gap-1.5 mt-1">
          <Info className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Community designation is automatically assigned based on member count (Tier-1 to Tier-10)
          </p>
        </div>
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
