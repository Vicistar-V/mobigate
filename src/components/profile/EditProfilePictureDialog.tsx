/**
 * EditProfilePictureDialog.tsx
 *
 * FIXED: Uploads photo to API via /api/profile/update_photo.php
 * so the new photo is visible to ALL users, not just saved locally.
 */

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
<<<<<<< Updated upstream
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "./ImageUploader";
import { toast } from "sonner";
import { Maximize2, Link as LinkIcon } from "lucide-react";
=======
import { Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";
>>>>>>> Stashed changes

interface EditProfilePictureDialogProps {
  open:          boolean;
  onOpenChange:  (open: boolean) => void;
  currentImage:  string;
  onSave:        (newUrl: string) => void;
  type?:         "profile" | "banner";
  title?:        string;
}

<<<<<<< Updated upstream
type ClickAction = "viewer" | "url";

export const EditProfilePictureDialog = ({
  open,
  onOpenChange,
  currentImage,
  onSave,
  type = "avatar",
  title = "Change Profile Picture",
=======
export const EditProfilePictureDialog = ({
  open, onOpenChange, currentImage, onSave,
  type = "profile", title,
>>>>>>> Stashed changes
}: EditProfilePictureDialogProps) => {
  const { toast }             = useToast();
  const [preview,  setPreview]  = useState<string | null>(null);
  const [file,     setFile]     = useState<File | null>(null);
  const [saving,   setSaving]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

<<<<<<< Updated upstream
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
=======
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5 MB", variant: "destructive" }); return;
    }
    if (!f.type.startsWith("image/")) {
      toast({ title: "Images only", variant: "destructive" }); return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSave = async () => {
    if (!file && !preview) { onOpenChange(false); return; }
    setSaving(true);
    try {
      const form = new FormData();
      if (file) {
        // Upload actual file
        form.append(type === "profile" ? "profile_photo" : "banner_image", file);
      }

      const res  = await fetch(`${API_BASE}/profile/update_photo.php`, {
        method: "POST", credentials: "include", body: form,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const newUrl = type === "profile" ? data.profile_photo : data.banner_image;
        if (newUrl) {
          onSave(newUrl);    // update local state in Profile.tsx
          toast({ title: `${type === "profile" ? "Profile photo" : "Banner"} updated!` });
          onOpenChange(false);
          setFile(null); setPreview(null);
        } else {
          toast({ title: "Error", description: "No URL returned from server", variant: "destructive" });
        }
      } else {
        toast({ title: "Error", description: data.error || "Could not save.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Cannot reach server.", variant: "destructive" });
    } finally {
      setSaving(false);
>>>>>>> Stashed changes
    }

    onSave(profileImage);
    toast.success(type === "banner" ? "Banner updated successfully" : "Profile picture updated successfully");
    onOpenChange(false);
  };

  const handleClose = () => {
    if (!saving) { setFile(null); setPreview(null); onOpenChange(false); }
  };

  return (
<<<<<<< Updated upstream
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[92dvh] overflow-y-auto">
=======
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
>>>>>>> Stashed changes
        <DialogHeader>
          <DialogTitle>{title || (type === "profile" ? "Change Profile Photo" : "Change Banner")}</DialogTitle>
        </DialogHeader>

<<<<<<< Updated upstream
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
=======
        <div className="space-y-4">
          {/* Preview */}
          <div
            className={`relative bg-muted overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ${type === "profile" ? "w-32 h-32 rounded-full mx-auto" : "w-full h-32 rounded-lg"}`}
            onClick={() => fileRef.current?.click()}
          >
            <img
              src={preview || currentImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
              <Upload className="h-6 w-6 text-white" />
            </div>
          </div>

          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

          <Button type="button" variant="outline" className="w-full" onClick={() => fileRef.current?.click()} disabled={saving}>
            <Upload className="h-4 w-4 mr-2" />
            {file ? "Change Selection" : "Choose Photo"}
          </Button>

          {preview && (
            <Button type="button" variant="ghost" size="sm" className="w-full" onClick={() => { setFile(null); setPreview(null); }} disabled={saving}>
              <X className="h-4 w-4 mr-2" />Remove Selection
            </Button>
>>>>>>> Stashed changes
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !file}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
