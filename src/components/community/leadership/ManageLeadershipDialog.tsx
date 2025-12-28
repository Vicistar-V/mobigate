import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { ApplyElectionResultsSection } from "./ApplyElectionResultsSection";
import { ManageExecutivesSection } from "./ManageExecutivesSection";
import { ManageAdhocSection } from "./ManageAdhocSection";
import { LeadershipChangeHistory } from "./LeadershipChangeHistory";
import { Vote, Users, UserCog, History } from "lucide-react";

interface ManageLeadershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageLeadershipDialog({ open, onOpenChange }: ManageLeadershipDialogProps) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("election");

  const content = (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-auto">
        <TabsTrigger value="election" className="flex flex-col gap-1 py-2 text-xs">
          <Vote className="h-4 w-4" />
          <span className="hidden sm:inline">Election</span>
        </TabsTrigger>
        <TabsTrigger value="executives" className="flex flex-col gap-1 py-2 text-xs">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Executives</span>
        </TabsTrigger>
        <TabsTrigger value="adhoc" className="flex flex-col gap-1 py-2 text-xs">
          <UserCog className="h-4 w-4" />
          <span className="hidden sm:inline">Ad-hoc</span>
        </TabsTrigger>
        <TabsTrigger value="history" className="flex flex-col gap-1 py-2 text-xs">
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">History</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <TabsContent value="election" className="m-0">
          <ApplyElectionResultsSection />
        </TabsContent>
        <TabsContent value="executives" className="m-0">
          <ManageExecutivesSection />
        </TabsContent>
        <TabsContent value="adhoc" className="m-0">
          <ManageAdhocSection />
        </TabsContent>
        <TabsContent value="history" className="m-0">
          <LeadershipChangeHistory />
        </TabsContent>
      </div>
    </Tabs>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] flex flex-col touch-auto overflow-hidden">
          <DrawerHeader>
            <DrawerTitle>Manage Leadership</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 px-4 pb-6 overflow-y-auto min-h-0 touch-auto">
            {content}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Leadership</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
