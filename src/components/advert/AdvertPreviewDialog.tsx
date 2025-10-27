import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PremiumAdCard, PremiumAdCardProps } from "@/components/PremiumAdCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AdvertFormData } from "@/types/advert";
import { Maximize, Square, Minimize2, FileText, Image as ImageIcon, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvertPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: AdvertFormData;
  fileUrls?: string[];
}

export const AdvertPreviewDialog = ({ open, onOpenChange, formData, fileUrls }: AdvertPreviewDialogProps) => {
  const [layout, setLayout] = useState<"fullscreen" | "standard" | "compact">("standard");

  // Convert form data to preview format
  const previewAd: PremiumAdCardProps = {
    id: "preview-ad",
    advertiser: {
      name: formData.advertiserName || "Your Business",
      logo: formData.logoUrl || "/placeholder.svg",
      verified: true,
    },
    content: {
      headline: formData.advertHeadline || "Your Headline Here",
      description: formData.advertDescription || "Your description will appear here",
      ctaText: formData.advertCTAText || "Learn More",
      ctaUrl: "#",
    },
    media: {
      type: formData.files.length > 1 
        ? ("carousel" as const)
        : formData.category === "video" 
          ? ("video" as const)
          : ("image" as const),
      items: fileUrls 
        ? fileUrls.map((url, idx) => ({
            url,
            caption: `Display ${idx + 1}`,
          }))
        : formData.files.map((file, idx) => ({
            url: URL.createObjectURL(file),
            caption: `Display ${idx + 1}`,
          })),
    },
    layout,
    duration: 15,
    contactDetails: (formData.contactPhone || formData.contactEmail || formData.websiteUrl || formData.catalogueUrl) ? {
      phone: formData.contactPhone,
      phoneMethod: formData.contactMethod,
      email: formData.contactEmail,
      website: formData.websiteUrl,
      catalogue: formData.catalogueUrl,
    } : undefined,
  };

  const layoutConfig = {
    fullscreen: { icon: Maximize, label: "Full", color: "text-primary" },
    standard: { icon: Square, label: "Standard", color: "text-blue-500" },
    compact: { icon: Minimize2, label: "Compact", color: "text-green-500" },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[95vh] overflow-y-auto p-3 sm:p-4 md:p-6">
        <DialogHeader className="space-y-1 sm:space-y-2">
          <DialogTitle className="text-base sm:text-lg md:text-xl">Advert Preview</DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            View how your advert will appear
          </p>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Preview Container - Mobile Optimized */}
          <div className="flex justify-center p-2 sm:p-4 lg:p-6 bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg border min-h-[300px] sm:min-h-[400px] lg:min-h-[450px]">
            <div className="w-full max-w-full sm:max-w-xl lg:max-w-3xl transition-all duration-300">
              <PremiumAdCard {...previewAd} isPreviewMode={true} />
            </div>
          </div>

          {/* Layout Controls - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 p-2 sm:p-3 bg-muted/50 rounded-lg border">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Layout:</span>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 flex-1">
              {(Object.keys(layoutConfig) as Array<keyof typeof layoutConfig>).map((key) => {
                const config = layoutConfig[key];
                const Icon = config.icon;
                const isSelected = layout === key;
                
                return (
                  <Button
                    key={key}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLayout(key)}
                    className={cn(
                      "h-11 sm:h-10 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all",
                      isSelected && "shadow-sm"
                    )}
                    aria-label={`${config.label} layout`}
                  >
                    <Icon className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                    <span className="text-xs sm:text-sm">{config.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Info Section - Compact Grid on Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg border">
            <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Size</p>
                <p className="text-xs sm:text-sm font-semibold truncate">{formData.size}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Square className="h-4 w-4 text-blue-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Type</p>
                <p className="text-xs sm:text-sm font-semibold truncate">{formData.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                {formData.category === "video" ? (
                  <Video className="h-4 w-4 text-green-500" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Category</p>
                <p className="text-xs sm:text-sm font-semibold truncate capitalize">{formData.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-orange-500">{fileUrls ? fileUrls.length : formData.files.length}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Files</p>
                <p className="text-xs sm:text-sm font-semibold truncate">Uploaded</p>
              </div>
            </div>
          </div>

          {/* Note - Hidden on Mobile, Visible on Desktop */}
          <p className="hidden sm:block text-xs text-center text-muted-foreground italic px-4">
            Note: This is a preview. Actual display may vary based on viewer's device and screen size.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
