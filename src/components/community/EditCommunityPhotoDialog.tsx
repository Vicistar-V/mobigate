import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageUploader } from "@/components/profile/ImageUploader";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Info } from "lucide-react";

interface EditCommunityPhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImage: string;
  onSave: (newImage: string) => void;
}

export const EditCommunityPhotoDialog = ({
  open,
  onOpenChange,
  currentImage,
  onSave,
}: EditCommunityPhotoDialogProps) => {
  const isMobile = useIsMobile();
  const [image, setImage] = useState<string | undefined>(currentImage);

  useEffect(() => {
    if (open) {
      setImage(currentImage);
    }
  }, [open, currentImage]);

  const handleSave = () => {
    if (image) {
      onSave(image);
      toast.success("Community profile photo updated");
      onOpenChange(false);
    }
  };

  const content = (
    <div className="space-y-4 py-2">
      <Alert className="bg-muted/50 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-xs">
          This photo is used <strong>only in this community</strong>. Your Mobigate profile picture remains unchanged.
        </AlertDescription>
      </Alert>

      <ImageUploader
        value={image}
        onChange={setImage}
        type="avatar"
      />
    </div>
  );

  const footer = (
    <>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button onClick={handleSave} disabled={!image}>
        Save Photo
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Change Community Photo</DrawerTitle>
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
          <DialogTitle>Change Community Photo</DialogTitle>
        </DialogHeader>
        {content}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
