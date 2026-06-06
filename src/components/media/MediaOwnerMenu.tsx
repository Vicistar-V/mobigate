import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, Coins, Image as ImageIcon } from "lucide-react";

interface MediaOwnerMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onChangeCover?: () => void;
  onChangeAccessFee?: () => void;
  itemLabel?: string;
  variant?: "overlay" | "inline";
}

/**
 * Reusable 3-dot menu for owner-managed media (albums, wall posts, gallery items, etc.).
 * Surfaces Edit / Change Cover / Set Access Fee / Delete.
 */
export const MediaOwnerMenu = ({
  onEdit,
  onDelete,
  onChangeCover,
  onChangeAccessFee,
  itemLabel = "item",
  variant = "overlay",
}: MediaOwnerMenuProps) => {
  const [confirm, setConfirm] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={
              variant === "overlay"
                ? "h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm"
                : "h-8 w-8 rounded-full"
            }
            aria-label={`${itemLabel} options`}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical
              className={
                variant === "overlay"
                  ? "h-4 w-4 sm:h-5 sm:w-5 text-white"
                  : "h-4 w-4"
              }
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-52"
          onClick={(e) => e.stopPropagation()}
        >
          {onEdit && (
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit {itemLabel}
            </DropdownMenuItem>
          )}
          {onChangeCover && (
            <DropdownMenuItem onClick={onChangeCover} className="cursor-pointer">
              <ImageIcon className="mr-2 h-4 w-4" />
              Change Cover
            </DropdownMenuItem>
          )}
          {onChangeAccessFee && (
            <DropdownMenuItem onClick={onChangeAccessFee} className="cursor-pointer">
              <Coins className="mr-2 h-4 w-4 text-amber-600" />
              Set Access Fee
            </DropdownMenuItem>
          )}
          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setConfirm(true)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete {itemLabel}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {onDelete && (
        <AlertDialog open={confirm} onOpenChange={setConfirm}>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {itemLabel}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove this {itemLabel.toLowerCase()} from
                your Mobiface profile. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onDelete();
                  setConfirm(false);
                }}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
