import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Megaphone } from "lucide-react";

interface AdminRemarkDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  officeName: string;
  remark: string;
  adminName?: string;
}

export const AdminRemarkDrawer = ({
  open,
  onOpenChange,
  officeName,
  remark,
  adminName = "Community Admin"
}: AdminRemarkDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] max-h-[85vh] w-full max-w-[100vw] overflow-hidden overflow-x-hidden touch-auto overscroll-contain">
        <div className="flex min-h-0 flex-col h-full w-full overflow-hidden">
          {/* Fixed Header */}
          <DrawerHeader className="flex-shrink-0 px-4 pb-2 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                  <Megaphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <DrawerTitle className="text-lg">
                  Admin Remark
                </DrawerTitle>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerDescription className="mt-1 text-left">
              {officeName} Election
            </DrawerDescription>
          </DrawerHeader>

          {/* Scrollable Content Area */}
          <ScrollArea className="flex-1 min-h-0 touch-auto w-full">
            <div className="px-4 py-4 w-full">
              {/* Admin Message Card */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-amber-200 dark:bg-amber-800 flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
                      {adminName}
                    </p>
                    <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed whitespace-pre-line break-words">
                      {remark}
                    </p>
                  </div>
                </div>
              </div>

              {/* Note */}
              <p className="text-xs text-muted-foreground text-center mt-4 px-2">
                This is an official message from the community administration regarding this election position.
              </p>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
