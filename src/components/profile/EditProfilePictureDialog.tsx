import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "./ImageUploader";
import { toast } from "sonner";
import { Maximize2, Link as LinkIcon } from "lucide-react";

interface EditProfilePictureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImage: string;
  onSave: (newImage: string) => void;
  type?: "avatar" | "banner";
  title?: string;
}

type ClickAction = "viewer" | "url";

export const EditProfilePictureDialog = ({
  open,
  onOpenChange,
  currentImage,
  onSave,
  type = "avatar",
  title = "Change Profile Picture",
}: EditProfilePictureDialogProps) => {
  const [profileImage, setProfileImage] = useState<string | undefined>(currentImage);

  // Banner-only settings (persisted in localStorage for the UI template)
  const [clickAction, setClickAction] = useState<ClickAction>(() => {
    if (typeof window === "undefined") return "viewer";
    return (localStorage.getItem("bannerClickAction") as ClickAction) || "viewer";
  });
  const [linkedUrl, setLinkedUrl] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("bannerLinkedUrl") || "";
  });
  const [rotateSeconds, setRotateSeconds] = useState<string>(() => {
    if (typeof window === "undefined") return "0";
    return localStorage.getItem("bannerRotateSeconds") || "0";
  });

  useEffect(() => {
    setProfileImage(currentImage);
  }, [currentImage, open]);

  const handleSave = () => {
    if (!profileImage) return;

    if (type === "banner") {
      if (clickAction === "url") {
        const trimmed = linkedUrl.trim();
        if (!trimmed) {
          toast.error("Please enter a link URL or switch to Open in viewer");
          return;
        }
        try {
          // Accept bare domains by adding protocol if missing
          const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
          new URL(candidate);
          localStorage.setItem("bannerLinkedUrl", candidate);
        } catch {
          toast.error("Please enter a valid URL");
          return;
        }
      } else {
        localStorage.removeItem("bannerLinkedUrl");
      }
      localStorage.setItem("bannerClickAction", clickAction);
      localStorage.setItem("bannerRotateSeconds", rotateSeconds);
    }

    onSave(profileImage);
    toast.success(type === "banner" ? "Banner updated successfully" : "Profile picture updated successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[92dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="py-3 space-y-5">
          <ImageUploader value={profileImage} onChange={setProfileImage} type={type} />

          {type === "banner" && (
            <>
              {/* Click action */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">When this banner is tapped</Label>
                <RadioGroup
                  value={clickAction}
                  onValueChange={(v) => setClickAction(v as ClickAction)}
                  className="space-y-2"
                >
                  <label
                    htmlFor="ba-viewer"
                    className="flex items-start gap-3 rounded-md border border-border p-3 cursor-pointer hover:bg-accent/40 touch-manipulation"
                  >
                    <RadioGroupItem id="ba-viewer" value="viewer" className="mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Maximize2 className="h-4 w-4 text-primary" />
                        Open / View / Play media in a bigger window
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        The banner opens in fullscreen viewer.
                      </p>
                    </div>
                  </label>
                  <label
                    htmlFor="ba-url"
                    className="flex items-start gap-3 rounded-md border border-border p-3 cursor-pointer hover:bg-accent/40 touch-manipulation"
                  >
                    <RadioGroupItem id="ba-url" value="url" className="mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <LinkIcon className="h-4 w-4 text-primary" />
                        Open linked Web or Social Media address
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Send viewers to any URL when the banner is tapped.
                      </p>
                    </div>
                  </label>
                </RadioGroup>

                {clickAction === "url" && (
                  <div className="space-y-1.5 pt-1">
                    <Label htmlFor="banner-url" className="text-xs font-semibold">
                      Link URL
                    </Label>
                    <Input
                      id="banner-url"
                      type="url"
                      inputMode="url"
                      placeholder="https://example.com or instagram.com/your-handle"
                      value={linkedUrl}
                      onChange={(e) => setLinkedUrl(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Auto-rotation */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Auto-rotate banner every</Label>
                <Select value={rotateSeconds} onValueChange={setRotateSeconds}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Off (no auto-rotation)</SelectItem>
                    <SelectItem value="5">Every 5 seconds</SelectItem>
                    <SelectItem value="10">Every 10 seconds</SelectItem>
                    <SelectItem value="30">Every 30 seconds</SelectItem>
                    <SelectItem value="60">Every 1 minute</SelectItem>
                    <SelectItem value="300">Every 5 minutes</SelectItem>
                    <SelectItem value="900">Every 15 minutes</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Cycles through your banner history automatically at this interval.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!profileImage}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
