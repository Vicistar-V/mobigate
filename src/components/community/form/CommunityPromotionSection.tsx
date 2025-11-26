import { CommunityFormData, PromotionVisibility, GuestAccessType } from "@/types/communityForm";
import { promotionVisibilityOptions } from "@/data/communityFormOptions";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CommunityPromotionSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

export function CommunityPromotionSection({
  formData,
  updateField,
  errors,
}: CommunityPromotionSectionProps) {
  const handleToggleVisibility = (field: "communitySuggestion" | "communityVisibility", value: PromotionVisibility) => {
    const current = formData[field];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateField(field, updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Control how your community is discovered and who can see it.
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-base">Community Suggestion</Label>
          <p className="text-xs text-muted-foreground">
            Where should this community be suggested to users?
          </p>
          <div className="space-y-2">
            {promotionVisibilityOptions.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <Checkbox
                  id={`suggestion-${option.value}`}
                  checked={formData.communitySuggestion.includes(option.value as PromotionVisibility)}
                  onCheckedChange={() => handleToggleVisibility("communitySuggestion", option.value as PromotionVisibility)}
                />
                <Label
                  htmlFor={`suggestion-${option.value}`}
                  className="text-sm font-normal leading-tight cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base">Community Visibility</Label>
          <p className="text-xs text-muted-foreground">
            Who can see and discover this community?
          </p>
          <div className="space-y-2">
            {promotionVisibilityOptions.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <Checkbox
                  id={`visibility-${option.value}`}
                  checked={formData.communityVisibility.includes(option.value as PromotionVisibility)}
                  onCheckedChange={() => handleToggleVisibility("communityVisibility", option.value as PromotionVisibility)}
                />
                <Label
                  htmlFor={`visibility-${option.value}`}
                  className="text-sm font-normal leading-tight cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base">Public Guest Users</Label>
          <p className="text-xs text-muted-foreground">
            Allow non-members to view public community content?
          </p>
          <RadioGroup
            value={formData.publicGuestUsers}
            onValueChange={(value) => updateField("publicGuestUsers", value as GuestAccessType)}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="allowed" id="guest-allowed" />
              <Label htmlFor="guest-allowed" className="font-normal">
                Allowed
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="not-allowed" id="guest-not-allowed" />
              <Label htmlFor="guest-not-allowed" className="font-normal">
                Not Allowed
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
