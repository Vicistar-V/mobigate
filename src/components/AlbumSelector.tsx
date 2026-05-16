import { useState } from "react";
import { Folder, Plus, Pencil, Trash2, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { mockAlbums } from "@/data/posts";
import { useUserAlbums } from "@/hooks/useWindowData";
import { RenameAlbumDialog } from "@/components/RenameAlbumDialog";
import { cn } from "@/lib/utils";

interface AlbumSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  onCreateNew: () => void;
}

interface AlbumLike {
  id: string;
  name: string;
  itemCount: number;
}

export const AlbumSelector = ({ value, onChange, onCreateNew }: AlbumSelectorProps) => {
  const { toast } = useToast();
  const phpAlbums = useUserAlbums();
  const baseAlbums = (phpAlbums || mockAlbums) as AlbumLike[];

  const [overrides, setOverrides] = useState<Record<string, { name?: string; deleted?: boolean }>>({});
  const [open, setOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<AlbumLike | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AlbumLike | null>(null);

  const albums = baseAlbums
    .filter((a) => !overrides[a.id]?.deleted)
    .map((a) => ({ ...a, name: overrides[a.id]?.name ?? a.name }));

  const selectedAlbum = value ? albums.find((a) => a.id === value) : null;
  const triggerLabel = selectedAlbum ? selectedAlbum.name : "No Album";

  const handleSelect = (id: string | null) => {
    onChange(id);
    setOpen(false);
  };

  const handleRename = (newName: string) => {
    if (!renameTarget) return;
    setOverrides((prev) => ({
      ...prev,
      [renameTarget.id]: { ...prev[renameTarget.id], name: newName },
    }));
    toast({
      title: "Album renamed",
      description: `"${renameTarget.name}" is now "${newName}".`,
    });
    setRenameTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setOverrides((prev) => ({
      ...prev,
      [deleteTarget.id]: { ...prev[deleteTarget.id], deleted: true },
    }));
    if (value === deleteTarget.id) onChange(null);
    toast({
      title: "Album deleted",
      description: `"${deleteTarget.name}" was removed from your profile.`,
    });
    setDeleteTarget(null);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className="w-full justify-between font-normal"
          >
            <span className="flex items-center gap-2 min-w-0">
              {selectedAlbum ? (
                <Folder className="h-4 w-4 shrink-0 text-primary" />
              ) : (
                <span className="text-muted-foreground">No</span>
              )}
              <span className="truncate">{triggerLabel}</span>
            </span>
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <div className="max-h-[60vh] overflow-y-auto py-1">
            {/* No Album */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent touch-manipulation",
                !value && "bg-accent/60"
              )}
            >
              <span className="flex-1 text-muted-foreground">No Album</span>
              {!value && <Check className="h-4 w-4 text-primary" />}
            </button>

            {/* Create New */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onCreateNew();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary text-left hover:bg-accent touch-manipulation border-y"
            >
              <Plus className="h-4 w-4" />
              Create New Album
            </button>

            {/* Existing albums – each row has Select / Rename / Delete */}
            {albums.map((album) => {
              const isSelected = value === album.id;
              return (
                <div
                  key={album.id}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1.5 hover:bg-accent/60",
                    isSelected && "bg-accent/60"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(album.id)}
                    className="flex-1 flex items-center gap-2 min-w-0 text-left text-sm py-1 px-1 rounded touch-manipulation"
                  >
                    <Folder className="h-4 w-4 shrink-0" />
                    <span className="truncate">{album.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({album.itemCount})
                    </span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary ml-auto" />
                    )}
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    aria-label={`Rename ${album.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenameTarget(album);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    aria-label={`Delete ${album.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(album);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      <RenameAlbumDialog
        open={!!renameTarget}
        onOpenChange={(o) => !o && setRenameTarget(null)}
        currentName={renameTarget?.name ?? ""}
        onRename={handleRename}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete album "{deleteTarget?.name}"?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This removes the album from your profile. Posts inside will become
              uncategorised but will not be deleted. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Album
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
