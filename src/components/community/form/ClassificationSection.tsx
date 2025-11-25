import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { CommunityFormData, CommunityInterest } from "@/types/communityForm";
import { classificationOptions, categoryOptions } from "@/data/communityFormOptions";

interface ClassificationSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

export function ClassificationSection({ formData, updateField, errors }: ClassificationSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="classification" className="text-sm font-semibold">
          Classification <span className="text-destructive">*</span>
        </Label>
        <Select 
          value={formData.classification} 
          onValueChange={(value) => updateField("classification", value as any)}
        >
          <SelectTrigger id="classification" className={errors.classification ? "border-destructive" : ""}>
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
        <Label htmlFor="category" className="text-sm font-semibold">
          Choose Type/Category <span className="text-destructive">*</span>
        </Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => updateField("category", value as any)}
        >
          <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
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
        <Label className="text-sm font-semibold">Community Interests</Label>
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
        <Label htmlFor="designation" className="text-sm font-semibold">
          Designation <span className="text-destructive">*</span>
        </Label>
        <Input
          id="designation"
          value={formData.designation}
          onChange={(e) => updateField("designation", e.target.value)}
          placeholder="Enter community designation"
          className={errors.designation ? "border-destructive" : ""}
        />
        {errors.designation && (
          <p className="text-xs text-destructive">{errors.designation}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Founding/Creating</Label>
        <Input
          value={formData.founderName}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">You are set as the founder by default</p>
      </div>
    </div>
  );
}
