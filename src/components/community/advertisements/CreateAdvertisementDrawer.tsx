import { useState, useCallback } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Megaphone, X, Eye, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdvertisementPhotoUploader } from "./AdvertisementPhotoUploader";
import { AdvertisementPreviewSheet } from "./AdvertisementPreviewSheet";
import { AdvertisementSettingsSheet } from "./AdvertisementSettingsSheet";
import { advertisementCategories } from "@/data/advertisementData";
import type { AdvertisementFormData, AdvertisementCategory } from "@/types/advertisementSystem";

interface CreateAdvertisementDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

export function CreateAdvertisementDrawer({ open, onOpenChange }: CreateAdvertisementDrawerProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AdvertisementFormData>(initialFormData);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  // Track if we should reopen the drawer after child sheet closes
  const [pendingReopen, setPendingReopen] = useState(false);

  const updateField = <K extends keyof AdvertisementFormData>(key: K, value: AdvertisementFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid = formData.businessName.trim() && formData.productTitle.trim() && formData.description.trim() && formData.city.trim() && formData.phone1.trim();

  // Close parent drawer, then open child sheet after delay (prevents modal stacking)
  const handleOpenPreview = useCallback(() => {
    onOpenChange(false);
    setPendingReopen(true);
    setTimeout(() => setShowPreview(true), 150);
  }, [onOpenChange]);

  const handleOpenSettings = useCallback(() => {
    onOpenChange(false);
    setPendingReopen(true);
    setTimeout(() => setShowSettings(true), 150);
  }, [onOpenChange]);

  // When child sheet closes, reopen parent drawer
  const handlePreviewClose = useCallback((isOpen: boolean) => {
    setShowPreview(isOpen);
    if (!isOpen && pendingReopen) {
      setPendingReopen(false);
      setTimeout(() => onOpenChange(true), 150);
    }
  }, [onOpenChange, pendingReopen]);

  const handleSettingsClose = useCallback((isOpen: boolean) => {
    setShowSettings(isOpen);
    if (!isOpen && pendingReopen) {
      setPendingReopen(false);
      setTimeout(() => onOpenChange(true), 150);
    }
  }, [onOpenChange, pendingReopen]);

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] overflow-hidden p-0">
          {/* Fixed Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Megaphone className="h-5 w-5 text-amber-600 shrink-0" />
              <h2 className="font-semibold text-base truncate">Create Advertisement</h2>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Scrollable Form Body */}
          <ScrollArea className="flex-1 overflow-y-auto touch-auto">
            <div className="px-3 py-4 space-y-4 pb-32">
              {/* Business Name */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Business / Product Name *</Label>
                <Input
                  value={formData.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  placeholder="e.g. Amara's Kitchen"
                  className="h-12 text-base touch-manipulation"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => updateField("category", v as AdvertisementCategory)}>
                  <SelectTrigger className="h-12 text-base touch-manipulation">
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

              {/* Custom Category Input (when "Other" is selected) */}
              {formData.category === "other" && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Specify Category *</Label>
                  <Input
                    value={formData.customCategory || ""}
                    onChange={(e) => updateField("customCategory", e.target.value)}
                    placeholder="e.g. Pet Supplies, Sports Equipment..."
                    className="h-12 text-base touch-manipulation"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
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
                  className="h-12 text-base touch-manipulation"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Description * ({formData.description.length}/500)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value.slice(0, 500))}
                  placeholder="Describe your product or service..."
                  className="min-h-[100px] text-base touch-manipulation resize-none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">City / Location *</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="e.g. Lagos, Nigeria"
                  className="h-12 text-base touch-manipulation"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
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
                  className="h-12 text-base touch-manipulation"
                  autoComplete="off"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
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
                  className="h-12 text-base touch-manipulation"
                  autoComplete="off"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
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
                  className="h-12 text-base touch-manipulation"
                  autoComplete="off"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
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
                  className="h-12 text-base touch-manipulation"
                  autoComplete="off"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Media Uploader */}
              <AdvertisementPhotoUploader
                media={formData.media}
                onMediaChange={(media) => updateField("media", media)}
              />
            </div>
          </ScrollArea>

          {/* Fixed Footer - No free option, both paths lead to paid submission */}
          <div className="border-t bg-background p-3 space-y-2 flex-shrink-0">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-11 text-sm font-medium touch-manipulation active:scale-[0.97]"
                onClick={handleOpenPreview}
                disabled={!isFormValid}
              >
                <Eye className="h-4 w-4 mr-1.5" />
                Preview
              </Button>
              <Button
                className="flex-1 h-11 text-sm font-medium touch-manipulation active:scale-[0.97] bg-amber-600 hover:bg-amber-700 text-white"
                onClick={handleOpenSettings}
                disabled={!isFormValid}
              >
                <Settings2 className="h-4 w-4 mr-1.5" />
                Audience & Fees
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              All advertisements require payment via Mobi Wallet
            </p>
          </div>
        </DrawerContent>
      </Drawer>

      <AdvertisementPreviewSheet
        open={showPreview}
        onOpenChange={handlePreviewClose}
        formData={formData}
      />

      <AdvertisementSettingsSheet
        open={showSettings}
        onOpenChange={handleSettingsClose}
        formData={formData}
        onFormDataChange={setFormData}
      />
    </>
  );
}
