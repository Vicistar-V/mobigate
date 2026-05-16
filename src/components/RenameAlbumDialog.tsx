import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Folder } from "lucide-react";

interface RenameAlbumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onRename: (newName: string) => void;
}

export const RenameAlbumDialog = ({
  open,
  onOpenChange,
  currentName,
  onRename,
}: RenameAlbumDialogProps) => {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (open) setName(currentName);
  }, [open, currentName]);

  const handleSave = () => {
    if (!name.trim() || name.trim() === currentName) {
      onOpenChange(false);
      return;
    }
    onRename(name.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            <DialogTitle>Rename Album</DialogTitle>
          </div>
          <DialogDescription>
            Change the display name of this album. Existing posts inside remain
            untouched.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="rename-album">Album name</Label>
          <Input
            id="rename-album"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Album name"
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
