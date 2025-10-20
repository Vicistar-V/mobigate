import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PremiumAdCard, PremiumAdCardProps } from "@/components/PremiumAdCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AdvertFormData } from "@/types/advert";
import { Monitor, Smartphone, Tablet } from "lucide-react";

interface AdvertPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: AdvertFormData;
}

export const AdvertPreviewDialog = ({ open, onOpenChange, formData }: AdvertPreviewDialogProps) => {
  const [layout, setLayout] = useState<"fullscreen" | "standard" | "compact">("standard");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Convert form data to preview format
  const previewAd: PremiumAdCardProps = {
    id: "preview-ad",
    advertiser: {
      name: "Your Business",
      logo: "/placeholder.svg",
      verified: true,
    },
    content: {
      headline: `${formData.category === "pictorial" ? "📸" : "🎬"} ${formData.type} Display Preview`,
      description: `This is how your ${formData.size} advert will appear to viewers`,
      ctaText: "Learn More",
      ctaUrl: "#",
    },
    media: {
      type: formData.files.length > 1 
        ? ("carousel" as const)
        : formData.category === "video" 
          ? ("video" as const)
          : ("image" as const),
      items: formData.files.map((file, idx) => ({
        url: URL.createObjectURL(file),
        caption: `Display ${idx + 1}`,
      })),
    },
    layout,
    duration: 15,
  };

  const deviceWidths = {
    desktop: "w-full max-w-4xl",
    tablet: "w-full max-w-2xl",
    mobile: "w-full max-w-md",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advert Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Layout Controls */}
          <div className="flex items-center justify-between gap-4 p-4 bg-muted rounded-lg">
            <div className="flex gap-2">
              <span className="text-sm font-medium">Layout:</span>
              <Button
                variant={layout === "compact" ? "default" : "outline"}
                size="sm"
                onClick={() => setLayout("compact")}
              >
                Compact
              </Button>
              <Button
                variant={layout === "standard" ? "default" : "outline"}
                size="sm"
                onClick={() => setLayout("standard")}
              >
                Standard
              </Button>
              <Button
                variant={layout === "fullscreen" ? "default" : "outline"}
                size="sm"
                onClick={() => setLayout("fullscreen")}
              >
                Fullscreen
              </Button>
            </div>

            <div className="flex gap-2">
              <span className="text-sm font-medium">Device:</span>
              <Button
                variant={device === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setDevice("desktop")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={device === "tablet" ? "default" : "outline"}
                size="sm"
                onClick={() => setDevice("tablet")}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={device === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setDevice("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="flex justify-center p-8 bg-accent/10 rounded-lg min-h-[500px]">
            <div className={`${deviceWidths[device]} transition-all duration-300`}>
              <PremiumAdCard {...previewAd} />
            </div>
          </div>

          {/* Info */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
            <p><strong>Size:</strong> {formData.size}</p>
            <p><strong>Type:</strong> {formData.type}</p>
            <p><strong>Category:</strong> {formData.category}</p>
            <p><strong>Files:</strong> {formData.files.length} uploaded</p>
            <p className="text-muted-foreground italic">
              Note: This is a preview. Actual display may vary based on viewer's device and screen size.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
