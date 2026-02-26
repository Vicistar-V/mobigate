import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Megaphone, Eye, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdvertisementPhotoUploader } from "@/components/community/advertisements/AdvertisementPhotoUploader";
import { AdvertisementPreviewSheet } from "@/components/community/advertisements/AdvertisementPreviewSheet";
import { AdvertisementSettingsSheet } from "@/components/community/advertisements/AdvertisementSettingsSheet";
import { advertisementCategories } from "@/data/advertisementData";
import type { AdvertisementFormData, AdvertisementCategory } from "@/types/advertisementSystem";

const initialFormData: AdvertisementFormData = {
  businessName: "",
  category: "other",
  customCategory: "",
  productTitle: "",
  description: "",
  city: "",
  phone1: "",
  phone2: "",
  email: "",
  website: "",
  media: [],
  audienceTargets: ["community_interface"],
  durationDays: 7,
};

export default function CreateAdvertisementPage() {
  const navigate = useNavigate();
  const { communityId } = useParams();
  const { toast } = useToast();
  const [formData, setFormData] = useState<AdvertisementFormData>(initialFormData);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const updateField = <K extends keyof AdvertisementFormData>(key: K, value: AdvertisementFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid = formData.businessName.trim() && formData.productTitle.trim() && formData.description.trim() && formData.city.trim() && formData.phone1.trim() && formData.media.length >= 1;

  const handleBack = () => {
    navigate(`/community/${communityId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 max-w-lg">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <Megaphone className="h-5 w-5 text-amber-600 shrink-0" />
            <h1 className="text-lg font-bold truncate">Create Advertisement</h1>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5 pb-32">
          {/* Business Name */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Business / Product Name *</Label>
            <Input
              value={formData.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
              placeholder="e.g. Amara's Kitchen"
              className="h-12 text-base"
              autoComplete="off"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Category *</Label>
            <Select value={formData.category} onValueChange={(v) => updateField("category", v as AdvertisementCategory)}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {advertisementCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="text-base py-3">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Category */}
          {formData.category === "other" && (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Specify Category *</Label>
              <Input
                value={formData.customCategory || ""}
                onChange={(e) => updateField("customCategory", e.target.value)}
                placeholder="e.g. Pet Supplies, Sports Equipment..."
                className="h-12 text-base"
                autoComplete="off"
              />
            </div>
          )}

          {/* Product Title */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Product / Service Title *</Label>
            <Input
              value={formData.productTitle}
              onChange={(e) => updateField("productTitle", e.target.value)}
              placeholder="e.g. Premium Catering Services"
              className="h-12 text-base"
              autoComplete="off"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Description * ({formData.description.length}/500)</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value.slice(0, 500))}
              placeholder="Describe your product or service..."
              className="min-h-[120px] text-base resize-none"
              autoComplete="off"
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">City / Location *</Label>
            <Input
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="e.g. Lagos, Nigeria"
              className="h-12 text-base"
              autoComplete="off"
            />
          </div>

          {/* Phone 1 */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Phone Number 1 *</Label>
            <Input
              value={formData.phone1}
              onChange={(e) => updateField("phone1", e.target.value)}
              placeholder="+234 801 234 5678"
              type="tel"
              className="h-12 text-base"
              autoComplete="off"
            />
          </div>

          {/* Phone 2 */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Phone Number 2 (Optional)</Label>
            <Input
              value={formData.phone2 || ""}
              onChange={(e) => updateField("phone2", e.target.value)}
              placeholder="+234 909 876 5432"
              type="tel"
              className="h-12 text-base"
              autoComplete="off"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Email Address (Optional)</Label>
            <Input
              value={formData.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="orders@business.ng"
              type="email"
              className="h-12 text-base"
              autoComplete="off"
            />
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Website URL (Optional)</Label>
            <Input
              value={formData.website || ""}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://yourbusiness.com"
              type="url"
              className="h-12 text-base"
              autoComplete="off"
            />
          </div>

          {/* Media Uploader */}
          <AdvertisementPhotoUploader
            media={formData.media}
            onMediaChange={(media) => updateField("media", media)}
          />
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm p-3 space-y-2 z-40">
        <div className="max-w-lg mx-auto">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-11 text-sm font-medium active:scale-[0.97]"
              onClick={() => setShowPreview(true)}
              disabled={!isFormValid}
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Preview
            </Button>
            <Button
              className="flex-1 h-11 text-sm font-medium active:scale-[0.97] bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => setShowSettings(true)}
              disabled={!isFormValid}
            >
              <Settings2 className="h-4 w-4 mr-1.5" />
              Audience & Fees
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-1.5">
            All advertisements require payment via Mobi Wallet
          </p>
        </div>
      </div>

      <AdvertisementPreviewSheet
        open={showPreview}
        onOpenChange={setShowPreview}
        formData={formData}
      />

      <AdvertisementSettingsSheet
        open={showSettings}
        onOpenChange={setShowSettings}
        formData={formData}
        onFormDataChange={setFormData}
      />
    </div>
  );
}
