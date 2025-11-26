import { CommunityFormData } from "@/types/communityForm";
import { currencyOptions } from "@/data/communityFormOptions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OriginationContactsSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

export function OriginationContactsSection({
  formData,
  updateField,
  errors,
}: OriginationContactsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Origination */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Origination</h3>

        <div className="space-y-2">
          <Label htmlFor="origin-country">Country of Origin</Label>
          <Input
            id="origin-country"
            placeholder="Enter country"
            value={formData.originCountry}
            onChange={(e) => updateField("originCountry", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="origin-state">State/Province of Origin</Label>
          <Input
            id="origin-state"
            placeholder="Enter state or province"
            value={formData.originState}
            onChange={(e) => updateField("originState", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="origin-city">City/County of Origin</Label>
          <Input
            id="origin-city"
            placeholder="Enter city or county"
            value={formData.originCity}
            onChange={(e) => updateField("originCity", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vision-statement">Vision Statement</Label>
          <Textarea
            id="vision-statement"
            placeholder="Enter community vision statement"
            value={formData.visionStatement}
            onChange={(e) => updateField("visionStatement", e.target.value)}
            rows={4}
          />
        </div>
      </div>

      {/* Official Contacts */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Official Contacts</h3>

        <div className="space-y-2">
          <Label htmlFor="office-address">Office Address</Label>
          <Textarea
            id="office-address"
            placeholder="Enter official address"
            value={formData.officeAddress}
            onChange={(e) => updateField("officeAddress", e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telephone">Telephone</Label>
          <Input
            id="telephone"
            type="tel"
            placeholder="Enter phone number"
            value={formData.telephone}
            onChange={(e) => updateField("telephone", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-address">Email Address</Label>
          <Input
            id="email-address"
            type="email"
            placeholder="Enter email address"
            value={formData.emailAddress}
            onChange={(e) => updateField("emailAddress", e.target.value)}
          />
        </div>
      </div>

      {/* Official Currency */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Official Currency</h3>

        <div className="space-y-2">
          <Label htmlFor="default-currency">Default Currency</Label>
          <Select
            value={formData.defaultCurrency}
            onValueChange={(value) => updateField("defaultCurrency", value)}
          >
            <SelectTrigger id="default-currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.defaultCurrency === "custom" && (
          <div className="space-y-2">
            <Label htmlFor="custom-currency">Custom Currency</Label>
            <Input
              id="custom-currency"
              placeholder="Enter custom currency (e.g., Bitcoin, Mobi)"
              value={formData.customCurrency}
              onChange={(e) => updateField("customCurrency", e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
