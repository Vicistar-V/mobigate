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
  type?: "avatar" | "banner";
  title?: string;
}

export const EditProfilePictureDialog = ({ 
  open, 
  onOpenChange, 
  currentImage,
  onSave,
  type = "avatar",
  title = "Change Profile Picture"
}: EditProfilePictureDialogProps) => {
  const [profileImage, setProfileImage] = useState<string | undefined>(currentImage);

  useEffect(() => {
    setProfileImage(currentImage);
  }, [currentImage, open]);

  const handleSave = () => {
    if (profileImage) {
      onSave(profileImage);
      const successMessage = type === "banner" ? "Banner updated successfully" : "Profile picture updated successfully";
      toast.success(successMessage);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <ImageUploader
            value={profileImage}
            onChange={setProfileImage}
            type={type}
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
