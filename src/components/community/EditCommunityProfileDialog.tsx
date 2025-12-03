import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { ExecutiveMember, ExecutiveProfile } from "@/data/communityExecutivesData";
import { nigerianStates } from "@/data/communityFormOptions";

interface EditCommunityProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: ExecutiveMember;
  onSave: (updatedProfile: Partial<ExecutiveProfile>) => void;
}

export const EditCommunityProfileDialog = ({
  open,
  onOpenChange,
  member,
  onSave,
}: EditCommunityProfileDialogProps) => {
  const isMobile = useIsMobile();
  const profile = member.profile || {};

  const [bio, setBio] = useState(profile.bio || "");
  const [profession, setProfession] = useState(profile.profession || "");
  const [stateOfOrigin, setStateOfOrigin] = useState(profile.stateOfOrigin || "");
  const [lga, setLga] = useState(profile.lga || "");
  const [hometown, setHometown] = useState(profile.hometown || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [email, setEmail] = useState(profile.email || "");

  useEffect(() => {
    if (open) {
      setBio(profile.bio || "");
      setProfession(profile.profession || "");
      setStateOfOrigin(profile.stateOfOrigin || "");
      setLga(profile.lga || "");
      setHometown(profile.hometown || "");
      setPhone(profile.phone || "");
      setEmail(profile.email || "");
    }
  }, [open, profile]);

  const handleSave = () => {
    onSave({
      bio,
      profession,
      stateOfOrigin,
      lga,
      hometown,
      phone,
      email,
    });
    toast.success("Community profile updated successfully");
    onOpenChange(false);
  };

  const content = (
    <ScrollArea className="max-h-[60vh] px-1">
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="bio">Bio / About</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the community about yourself..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profession">Profession</Label>
          <Input
            id="profession"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            placeholder="e.g. Legal Practitioner"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State of Origin</Label>
          <Select value={stateOfOrigin} onValueChange={setStateOfOrigin}>
            <SelectTrigger id="state">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {nigerianStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lga">LGA</Label>
          <Input
            id="lga"
            value={lga}
            onChange={(e) => setLga(e.target.value)}
            placeholder="Local Government Area"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hometown">Hometown</Label>
          <Input
            id="hometown"
            value={hometown}
            onChange={(e) => setHometown(e.target.value)}
            placeholder="Your hometown"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234-XXX-XXX-XXXX"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
      </div>
    </ScrollArea>
  );

  const footer = (
    <>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button onClick={handleSave}>Save Changes</Button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit Community Profile</DrawerTitle>
          </DrawerHeader>
          <div className="px-4">{content}</div>
          <DrawerFooter className="flex-row gap-2 pt-4">
            {footer}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Community Profile</DialogTitle>
        </DialogHeader>
        {content}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
