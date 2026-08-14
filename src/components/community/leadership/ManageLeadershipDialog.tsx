import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ApplyElectionResultsSection } from "./ApplyElectionResultsSection";
import { ManageExecutivesSection } from "./ManageExecutivesSection";
import { ManageAdhocSection } from "./ManageAdhocSection";
import { ManageStaffSection } from "./ManageStaffSection";
import { ManageTenureSection } from "./ManageTenureSection";
import { LeadershipChangeHistory } from "./LeadershipChangeHistory";
import { Vote, Users, UserCog, History, Briefcase, CalendarClock } from "lucide-react";

interface ManageLeadershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId?: string;
  onActivityLogged?: (action: string, target: string) => void;
}

export function ManageLeadershipDialog({ open, onOpenChange, communityId, onActivityLogged }: ManageLeadershipDialogProps) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("executives");

  const content = (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
      <div className="shrink-0 bg-background pb-2">
        <TabsList className="w-full h-auto p-1 bg-muted/60">
          <div className="grid grid-cols-3 w-full gap-1">
            <TabsTrigger value="executives" className="flex flex-col items-center gap-1 py-2.5 px-1 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-5 w-5" />
              <span className="text-xs font-medium">Executives</span>
            </TabsTrigger>
            <TabsTrigger value="adhoc" className="flex flex-col items-center gap-1 py-2.5 px-1 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UserCog className="h-5 w-5" />
              <span className="text-xs font-medium">Ad-hoc</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex flex-col items-center gap-1 py-2.5 px-1 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Briefcase className="h-5 w-5" />
              <span className="text-xs font-medium">Staff</span>
            </TabsTrigger>
            <TabsTrigger value="tenure" className="flex flex-col items-center gap-1 py-2.5 px-1 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CalendarClock className="h-5 w-5" />
              <span className="text-xs font-medium">Tenure</span>
            </TabsTrigger>
            <TabsTrigger value="election" className="flex flex-col items-center gap-1 py-2.5 px-1 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Vote className="h-5 w-5" />
              <span className="text-xs font-medium">Election</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex flex-col items-center gap-1 py-2.5 px-1 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <History className="h-5 w-5" />
              <span className="text-xs font-medium">History</span>
            </TabsTrigger>
          </div>
        </TabsList>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto touch-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
        <TabsContent value="executives" className="m-0 p-1">
          <ManageExecutivesSection communityId={communityId} onActivityLogged={onActivityLogged} />
        </TabsContent>
        <TabsContent value="adhoc" className="m-0 p-1">
          <ManageAdhocSection communityId={communityId} />
        </TabsContent>
        <TabsContent value="staff" className="m-0 p-1">
          <ManageStaffSection communityId={communityId} onActivityLogged={onActivityLogged} />
        </TabsContent>
        <TabsContent value="tenure" className="m-0 p-1">
          <ManageTenureSection communityId={communityId} onActivityLogged={onActivityLogged} />
        </TabsContent>
        <TabsContent value="election" className="m-0 p-1">
          <ApplyElectionResultsSection communityId={communityId} />
        </TabsContent>
        <TabsContent value="history" className="m-0 p-1">
          <LeadershipChangeHistory communityId={communityId} />
        </TabsContent>
      </div>
    </Tabs>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] h-[92vh] flex flex-col touch-auto overflow-hidden">
          <DrawerHeader className="shrink-0 pb-2">
            <DrawerTitle className="text-lg font-semibold">Manage Leadership</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 min-h-0 overflow-hidden px-4 pb-8">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>Manage Leadership</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-hidden">{content}</div>
      </DialogContent>
    </Dialog>
  );
}
