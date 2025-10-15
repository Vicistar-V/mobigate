import { Folder, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockAlbums } from "@/data/posts";

interface AlbumSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  onCreateNew: () => void;
}

export const AlbumSelector = ({ value, onChange, onCreateNew }: AlbumSelectorProps) => {
  const handleValueChange = (newValue: string) => {
    if (newValue === "__create_new__") {
      onCreateNew();
    } else if (newValue === "__no_album__") {
      onChange(null);
    } else {
      onChange(newValue);
    }
  };

  return (
    <Select 
      value={value || "__no_album__"} 
      onValueChange={handleValueChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select an album" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__no_album__">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">No Album</span>
          </div>
        </SelectItem>
        <SelectItem value="__create_new__">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Plus className="h-4 w-4" />
            <span>Create New Album</span>
          </div>
        </SelectItem>
        {mockAlbums.map((album) => (
          <SelectItem key={album.id} value={album.id}>
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              <span>{album.name}</span>
              <span className="text-sm text-muted-foreground">({album.itemCount})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
