import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "./ImageUploader";
import { toast } from "sonner";

interface EditProfilePictureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImage: string;
  onSave: (newImage: string) => void;
}

export const EditProfilePictureDialog = ({ 
  open, 
  onOpenChange, 
  currentImage,
  onSave 
}: EditProfilePictureDialogProps) => {
  const [profileImage, setProfileImage] = useState<string | undefined>(currentImage);

  useEffect(() => {
    setProfileImage(currentImage);
  }, [currentImage, open]);

  const handleSave = () => {
    if (profileImage) {
      onSave(profileImage);
      toast.success("Profile picture updated successfully");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <ImageUploader
            value={profileImage}
            onChange={setProfileImage}
            type="avatar"
          />
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
