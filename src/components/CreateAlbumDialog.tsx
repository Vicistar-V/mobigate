import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Folder } from "lucide-react";

interface CreateAlbumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAlbumCreated: (albumId: string, albumName: string) => void;
}

export const CreateAlbumDialog = ({
  open,
  onOpenChange,
  onAlbumCreated,
}: CreateAlbumDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<"Public" | "Friends" | "Private">("Public");
  const { toast } = useToast();

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrivacy("Public");
  };

  const handleCreate = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Album name is required",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would create the album in the database here
    const newAlbumId = `alb_${Date.now()}`;
    
    toast({
      title: "Success!",
      description: `Album "${name}" has been created.`,
    });

    onAlbumCreated(newAlbumId, name);
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            <DialogTitle>Create New Album</DialogTitle>
          </div>
          <DialogDescription>
            Organize your posts into albums for better management.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="album-name">Album Name *</Label>
            <Input
              id="album-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Travel Adventures, Family Moments"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="album-description">Description</Label>
            <Textarea
              id="album-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for your album"
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="album-privacy">Privacy</Label>
            <Select value={privacy} onValueChange={(value: any) => setPrivacy(value)}>
              <SelectTrigger id="album-privacy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Public">🌍 Public - Anyone can see</SelectItem>
                <SelectItem value="Friends">👥 Friends - Only friends can see</SelectItem>
                <SelectItem value="Private">🔒 Private - Only you can see</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            <Folder className="h-4 w-4 mr-2" />
            Create Album
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
