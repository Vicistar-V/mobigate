import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModuleAuthorizationPanel } from "./ModuleAuthorizationPanel";
import { AuthorizationModule, ExtendedOfficerRole } from "@/types/adminAuthorization";
import { useToast } from "@/hooks/use-toast";

interface ModuleAuthorizationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: AuthorizationModule;
  actionTitle: string;
  actionDescription: string;
  actionDetails?: React.ReactNode;
  initiatorRole?: ExtendedOfficerRole;
  onAuthorized: () => void;
}

export function ModuleAuthorizationDrawer({
  open,
  onOpenChange,
  module,
  actionTitle,
  actionDescription,
  actionDetails,
  initiatorRole = "secretary", // Default to secretary as initiator
  onAuthorized,
}: ModuleAuthorizationDrawerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { toast } = useToast();

  const handleConfirm = () => {
    toast({
      title: "Authorization Complete",
      description: `${actionTitle} has been successfully authorized.`,
    });
    onAuthorized();
    onOpenChange(false);
  };

  const handleBack = () => {
    onOpenChange(false);
  };

  const handleExpire = () => {
    toast({
      title: "Authorization Expired",
      description: "The 24-hour authorization window has expired.",
      variant: "destructive",
    });
    onOpenChange(false);
  };

  const content = (
    <ModuleAuthorizationPanel
      module={module}
      actionTitle={actionTitle}
      actionDescription={actionDescription}
      actionDetails={actionDetails}
      initiatorRole={initiatorRole}
      onConfirm={handleConfirm}
      onBack={handleBack}
      onExpire={handleExpire}
    />
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="sr-only">{actionTitle}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(85vh-60px)] px-6 pb-6">
            {content}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[92vh] px-4 pb-6">
        <DrawerHeader className="px-0 pt-4 pb-2">
          <DrawerTitle className="sr-only">{actionTitle}</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="flex-1 overflow-y-auto touch-auto">
          {content}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
