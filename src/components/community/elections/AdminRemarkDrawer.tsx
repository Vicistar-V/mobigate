import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
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
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="text-left pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Megaphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <DrawerTitle className="text-lg">
                  Admin Remark
                </DrawerTitle>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerDescription className="mt-1">
              {officeName} Election
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-6">
            {/* Admin Message Card */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-amber-200 dark:bg-amber-800 flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                    {adminName}
                  </p>
                  <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed whitespace-pre-line">
                    {remark}
                  </p>
                </div>
              </div>
            </div>

            {/* Note */}
            <p className="text-xs text-muted-foreground text-center mt-4">
              This is an official message from the community administration regarding this election position.
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
