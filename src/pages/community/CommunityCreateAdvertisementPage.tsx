// src/pages/community/CommunityCreateAdvertisementPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Megaphone, Eye, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { AdvertisementPreviewSheet } from "@/components/community/advertisements/AdvertisementPreviewSheet";
import { AdvertisementSettingsSheet } from "@/components/community/advertisements/AdvertisementSettingsSheet";
import { AdvertisementPhotoUploader } from "@/components/community/advertisements/AdvertisementPhotoUploader";
import { advertisementCategories } from "@/data/advertisementData";
import type { AdvertisementFormData } from "@/types/advertisementSystem";
import { toast } from "sonner";

const defaultFormData: AdvertisementFormData = {
  businessName: "",
  category: "food_drink",
  productTitle: "",
  description: "",
  city: "",
  phone1: "",
  phone2: "",
  email: "",
  website: "",
  media: [],
  audienceTargets: ["community_members"],
  durationDays: 7,
};

export default function CommunityCreateAdvertisementPage() {
  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();

  const [formData, setFormData]   = useState<AdvertisementFormData>(defaultFormData);
  const [showPreview, setShowPreview]   = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleBack = () => navigate(`/community/${communityId}`);

  const isFormValid =
    formData.businessName.trim() &&
    formData.productTitle.trim() &&
    formData.description.trim() &&
    formData.city.trim() &&
    formData.phone1.trim() &&
    formData.media.length >= 1;

  const handlePublish = async (fees: { baseFee: number; audiencePremium: number; totalFee: number; communityShare: number; mobifaceShare: number }) => {
    if (!communityId) return;
    const res = await fetch('/api/community/advertisements.php', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action:           'create',
        community_id:     communityId,
        business_name:    formData.businessName,
        category:         formData.category,
        product_title:    formData.productTitle,
        description:      formData.description,
        city:             formData.city,
        phone1:           formData.phone1,
        phone2:           formData.phone2 ?? '',
        email:            formData.email ?? '',
        website:          formData.website ?? '',
        media:            formData.media,
        audience_targets: formData.audienceTargets,
        duration_days:    formData.durationDays,
        base_fee:         fees.baseFee,
        audience_premium: fees.audiencePremium,
        total_fee_mobi:   fees.totalFee,
        community_share:  fees.communityShare,
        mobiface_share:   fees.mobifaceShare,
        status:           'active',
      }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(d.error || 'Failed to create ad');
    toast.success('Advertisement created and is now live!');
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
              placeholder="e.g. Mama's Kitchen, Tech Hub Solutions"
              value={formData.businessName}
              onChange={(e) => setFormData(p => ({ ...p, businessName: e.target.value }))}
              className="h-11"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(v) => setFormData(p => ({ ...p, category: v as any }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {advertisementCategories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product/Service Title */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Product / Service Title *</Label>
            <Input
              placeholder="e.g. Fresh Homemade Jollof Rice, Web Design Services"
              value={formData.productTitle}
              onChange={(e) => setFormData(p => ({ ...p, productTitle: e.target.value }))}
              className="h-11"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Description *</Label>
            <Textarea
              placeholder="Describe your product or service in detail..."
              value={formData.description}
              onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">City / Location *</Label>
            <Input
              placeholder="e.g. Lagos, Abuja, Port Harcourt"
              value={formData.city}
              onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
              className="h-11"
            />
          </div>

          {/* Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Phone 1 *</Label>
              <Input
                type="tel"
                placeholder="08012345678"
                value={formData.phone1}
                onChange={(e) => setFormData(p => ({ ...p, phone1: e.target.value }))}
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Phone 2</Label>
              <Input
                type="tel"
                placeholder="Optional"
                value={formData.phone2 ?? ""}
                onChange={(e) => setFormData(p => ({ ...p, phone2: e.target.value }))}
                className="h-11"
              />
            </div>
          </div>

          {/* Email & Website */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Email</Label>
              <Input
                type="email"
                placeholder="business@email.com"
                value={formData.email ?? ""}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Website</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={formData.website ?? ""}
                onChange={(e) => setFormData(p => ({ ...p, website: e.target.value }))}
                className="h-11"
              />
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Photos / Videos * <span className="text-muted-foreground">(up to 4)</span></Label>
            <AdvertisementPhotoUploader
              media={formData.media}
              onMediaChange={(media) => setFormData(p => ({ ...p, media }))}
              maxItems={4}
            />
          </div>
        </div>
      </main>

      {/* Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm p-3 space-y-2 z-40">
        <div className="max-w-lg mx-auto">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-11 text-sm font-medium"
              onClick={() => setShowPreview(true)}
              disabled={!isFormValid}
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Preview
            </Button>
            <Button
              className="flex-1 h-11 text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white"
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
        onPublish={handlePublish}
      />
    </div>
  );
}
