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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreVertical, Edit, Trash2, ScrollText } from "lucide-react";
import { useState } from "react";

interface PostOptionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  publisherName?: string;
  publisherEmail?: string;
}

export const PostOptionsMenu = ({
  onEdit,
  onDelete,
  publisherName,
  publisherEmail,
}: PostOptionsMenuProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLegalDialog, setShowLegalDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm"
            aria-label="Post options"
          >
            <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            Edit Post
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Post
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowLegalDialog(true)}
            className="cursor-pointer"
          >
            <ScrollText className="mr-2 h-4 w-4" />
            Legal / Copyright
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showLegalDialog} onOpenChange={setShowLegalDialog}>
        <DialogContent className="max-w-lg max-h-[88dvh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-primary" />
              Legal / Copyright Notice
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
              <p>
                Mobiface and it's subsidiaries do not guarantee Copyright Ownership of
                any materials, information or expressions shared or published on it's
                platforms; and do not accept responsibility for any violation or
                infringement thereof of any such Rights whether written or otherwise;
                or of any claims that might arise from any such whether legally or
                otherwise from or by any interests whether corporate or individual
                whatsoever! All views, materials and/or information shared on Mobiface
                platforms are entirely the opinions and/or expressions of the Users /
                publishers — those who share or post such contents.
              </p>
              <p>
                The Mobiface User(s) — the publisher accept(s) responsibilities for
                every information, materials and/or opinions shared on Mobiface
                platforms; and do indemnify and exonorate Mobiface Applications Ltd
                and it's subsidiaries, partners and interests worldwide of any
                liabilities, claims or whatsoever that might arise as a result of or
                in connection with any information, materials and/or opinions
                expressed or shared on Mobiface platforms. All publications on
                Mobiface platforms are exclusively those of the individuals and/or
                entities that shared them. Any presentation or assumptions to the
                contrary is a criminal offence!
              </p>

              <div className="rounded-lg border bg-muted/40 p-3 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Content Publisher
                </p>
                <p className="font-semibold">
                  {publisherName || "User's Name"}
                </p>
                <p className="italic font-medium text-primary break-all">
                  *_{publisherEmail || "users-email@email.com"}_
                </p>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setShowLegalDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
