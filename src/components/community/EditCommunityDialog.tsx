import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface EditableCommunity {
  id: string;
  name: string;
  description?: string;
  motto?: string;
  category?: string;
  classification?: string;
  location?: string;
  telephone?: string;
  telephone2?: string;
  emailAddress?: string;
  visionStatement?: string;
  logoImage?: string;
  bannerImage?: string;
  coverImage?: string;
}

interface EditCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  community: EditableCommunity;
  onSaved: (updated: Partial<EditableCommunity>) => void;
  onPendingApproval?: () => void;
}

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function EditCommunityDialog({ open, onOpenChange, community, onSaved, onPendingApproval }: EditCommunityDialogProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [motto, setMotto] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [telephone, setTelephone] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [visionStatement, setVisionStatement] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const [bannerPreview, setBannerPreview] = useState<string | undefined>(undefined);
  const [coverPreview, setCoverPreview] = useState<string | undefined>(undefined);
  const [logoData, setLogoData] = useState<string | undefined>(undefined);
  const [bannerData, setBannerData] = useState<string | undefined>(undefined);
  const [coverData, setCoverData] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(community.name || "");
    setDescription(community.description || "");
    setMotto(community.motto || "");
    setCategory(community.category || community.classification || "");
    setLocation(community.location || "");
    setTelephone(community.telephone || "");
    setEmailAddress(community.emailAddress || "");
    setVisionStatement(community.visionStatement || "");
    setLogoPreview(community.logoImage);
    setBannerPreview(community.bannerImage);
    setCoverPreview(community.coverImage);
    setLogoData(undefined);
    setBannerData(undefined);
    setCoverData(undefined);
  }, [open, community]);

  const handleLogoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setLogoPreview(dataUrl);
    setLogoData(dataUrl);
  };

  const handleBannerPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setBannerPreview(dataUrl);
    setBannerData(dataUrl);
  };

  const handleCoverPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setCoverPreview(dataUrl);
    setCoverData(dataUrl);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        action: "update_profile",
        community_id: community.id,
        name, description, motto, category, location,
        telephone, emailAddress, visionStatement,
      };
      if (logoData) payload.logoImage = logoData;
      if (bannerData) payload.bannerImage = bannerData;
      if (coverData) payload.coverImage = coverData;

      const res = await fetch("/api/community/get.php", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok || !d?.success) throw new Error(d?.error || `Failed to save changes (HTTP ${res.status})`);

      if (d.needsApproval) {
        toast({
          title: "Submitted for Approval",
          description: `This community has multiple admins, so ${d.approvalsRequired} admin approval${d.approvalsRequired === 1 ? "" : "s"} are required. ${d.approvalsCollected}/${d.approvalsRequired} collected so far (your submission counts as one).`,
        });
        onPendingApproval?.();
      } else {
        toast({ title: "Community Updated", description: "Your changes have been saved." });
        onSaved({
          name, description, motto, category, location,
          telephone, emailAddress, visionStatement,
          logoImage: logoData || community.logoImage,
          bannerImage: bannerData || community.bannerImage,
          coverImage: coverData || community.coverImage,
        });
      }
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Couldn't Save Changes", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const FormBody = (
    <div className="space-y-5">
      {/* Banner */}
      <div className="space-y-2">
        <Label>Banner Image</Label>
        <div
          className="relative h-28 sm:h-36 rounded-xl bg-muted overflow-hidden cursor-pointer group border"
          onClick={() => bannerInputRef.current?.click()}
        >
          {bannerPreview ? (
            <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerPick} />
      </div>

      {/* Logo */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => logoInputRef.current?.click()}
          className="relative rounded-full group shrink-0"
        >
          <Avatar className="h-20 w-20 border-2 border-background shadow">
            <AvatarImage src={logoPreview} alt="Logo preview" />
            <AvatarFallback className="text-xl">{name ? name.charAt(0) : "C"}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
        <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoPick} />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Community Logo</p>
          <p>Tap to change the logo image.</p>
        </div>
      </div>

      {/* Cover Image */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => coverInputRef.current?.click()}
          className="relative rounded-xl group shrink-0"
        >
          <Avatar className="h-20 w-20 rounded-xl border-2 border-background shadow">
            <AvatarImage src={coverPreview} alt="Cover preview" className="object-cover" />
            <AvatarFallback className="rounded-xl text-xl">
              <ImageIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverPick} />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Cover Photo</p>
          <p>A secondary photo, used as a backup wherever the logo isn't set.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="community-name">Community Name *</Label>
          <Input id="community-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lagos Tech Innovators" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="community-category">Category</Label>
          <Input id="community-category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Professional, Alumni, Town Union" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="community-location">Location</Label>
          <Input id="community-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Lagos, Nigeria" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="community-phone">Phone</Label>
          <Input id="community-phone" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="+234..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="community-email">Email</Label>
          <Input id="community-email" type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} placeholder="community@example.com" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="community-motto">Motto</Label>
          <Input id="community-motto" value={motto} onChange={(e) => setMotto(e.target.value)} placeholder="A short motto or tagline" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="community-description">Description</Label>
          <Textarea id="community-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Tell people what this community is about" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="community-vision">Vision Statement</Label>
          <Textarea id="community-vision" value={visionStatement} onChange={(e) => setVisionStatement(e.target.value)} rows={3} placeholder="The community's long-term vision" />
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] flex flex-col">
          <DrawerHeader className="shrink-0">
            <DrawerTitle>Edit Community Profile</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 flex-1 min-h-0 overflow-y-auto overscroll-contain">
            <div className="pb-4">{FormBody}</div>
          </div>
          <DrawerFooter className="flex-row gap-2 shrink-0">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>Edit Community Profile</DialogTitle>
        </DialogHeader>
        <div className="px-6 flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <div className="pb-2">{FormBody}</div>
        </div>
        <DialogFooter className="px-6 pb-6 pt-2 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
