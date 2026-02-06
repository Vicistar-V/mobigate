import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Vote, Settings, Plus, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AdminNominationsTab } from "@/components/admin/election/AdminNominationsTab";
import { AdminCampaignsTab } from "@/components/admin/election/AdminCampaignsTab";
import { AdminElectionProcessesTab } from "@/components/admin/election/AdminElectionProcessesTab";
import { AdminAccreditationTab } from "@/components/admin/election/AdminAccreditationTab";
import { AdminClearancesTab } from "@/components/admin/election/AdminClearancesTab";
import { AdminWinnersAnnouncementTab } from "@/components/admin/election/AdminWinnersAnnouncementTab";
import { AdminImpeachmentTab } from "@/components/admin/election/AdminImpeachmentTab";
import { ElectionSettingsSection } from "@/components/admin/election/ElectionSettingsSection";
import { DeclareElectionDrawer } from "@/components/admin/election/DeclareElectionDrawer";
import { AdminDeclareElectionTab } from "@/components/admin/election/AdminDeclareElectionTab";

export default function ElectionManagementPage() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [showDeclareElection, setShowDeclareElection] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
            onClick={() => navigate(`/community/${communityId}/admin`)}
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Vote className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0" />
            <h1 className="font-bold text-base sm:text-lg truncate">Election Management</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="declare" className="w-full">
        <div className="border-b bg-background">
          <ScrollArea className="w-full">
            <TabsList className="h-10 sm:h-11 bg-muted/50 w-max min-w-full px-3 sm:px-4 justify-start gap-1">
              <TabsTrigger 
                value="declare" 
                className="text-xs sm:text-sm px-3 sm:px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md font-medium whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                + Declare
              </TabsTrigger>
              <TabsTrigger 
                value="campaigns" 
                className="text-xs sm:text-sm px-3 sm:px-4 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md font-medium whitespace-nowrap"
              >
                Campaigns
              </TabsTrigger>
              <TabsTrigger 
                value="processes" 
                className="text-xs sm:text-sm px-3 sm:px-4 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md font-medium whitespace-nowrap"
              >
                Election Processes
              </TabsTrigger>
              <TabsTrigger 
                value="accreditation" 
                className="text-xs sm:text-sm px-3 sm:px-4 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md font-medium whitespace-nowrap"
              >
                Accreditation
              </TabsTrigger>
              <TabsTrigger 
                value="clearances" 
                className="text-xs sm:text-sm px-3 sm:px-4 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md font-medium whitespace-nowrap"
              >
                Clearances
              </TabsTrigger>
              <TabsTrigger 
                value="winners" 
                className="text-xs sm:text-sm px-3 sm:px-4 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md font-medium whitespace-nowrap"
              >
                Winners
              </TabsTrigger>
              <TabsTrigger 
                value="impeachment" 
                className="text-xs sm:text-sm px-3 sm:px-4 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md font-medium whitespace-nowrap"
              >
                <Gavel className="h-3.5 w-3.5 mr-1" />
                Impeachment
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="text-xs sm:text-sm px-3 sm:px-4 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md font-medium whitespace-nowrap"
              >
                <Settings className="h-3.5 w-3.5 mr-1" />
                Settings
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>

        <div className="px-2 py-3 sm:p-4 overflow-hidden">
          <TabsContent value="declare" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <AdminDeclareElectionTab onDeclareElection={() => setShowDeclareElection(true)} />
          </TabsContent>
          <TabsContent value="campaigns" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <AdminCampaignsTab />
          </TabsContent>
          <TabsContent value="processes" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <AdminElectionProcessesTab />
          </TabsContent>
          <TabsContent value="accreditation" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <AdminAccreditationTab />
          </TabsContent>
          <TabsContent value="clearances" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <AdminClearancesTab />
          </TabsContent>
          <TabsContent value="winners" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <AdminWinnersAnnouncementTab />
          </TabsContent>
          <TabsContent value="impeachment" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <AdminImpeachmentTab />
          </TabsContent>
          <TabsContent value="settings" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <ElectionSettingsSection />
          </TabsContent>
        </div>
      </Tabs>

      {/* Declare Election Drawer */}
      <DeclareElectionDrawer
        open={showDeclareElection}
        onOpenChange={setShowDeclareElection}
      />
    </div>
  );
}
