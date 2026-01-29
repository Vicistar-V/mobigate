import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Vote, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AdminNominationsTab } from "@/components/admin/election/AdminNominationsTab";
import { AdminCampaignsTab } from "@/components/admin/election/AdminCampaignsTab";
import { AdminElectionProcessesTab } from "@/components/admin/election/AdminElectionProcessesTab";
import { AdminAccreditationTab } from "@/components/admin/election/AdminAccreditationTab";
import { AdminClearancesTab } from "@/components/admin/election/AdminClearancesTab";
import { AdminWinnersAnnouncementTab } from "@/components/admin/election/AdminWinnersAnnouncementTab";
import { CampaignFeeDistributionSettings } from "@/components/admin/settings/CampaignFeeDistributionSettings";

export default function ElectionManagementPage() {
  const { communityId } = useParams();
  const navigate = useNavigate();

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
          <div className="flex items-center gap-2 min-w-0">
            <Vote className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0" />
            <h1 className="font-bold text-base sm:text-lg truncate">Election Management</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="nominations" className="w-full">
        <div className="border-b bg-background">
          <ScrollArea className="w-full">
            <TabsList className="h-10 sm:h-11 bg-muted/50 w-max min-w-full px-3 sm:px-4 justify-start gap-1">
              <TabsTrigger 
                value="nominations" 
                className="text-xs sm:text-sm px-3 sm:px-4 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md font-medium whitespace-nowrap"
              >
                Nominations
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

        <div className="p-3 sm:p-4 overflow-hidden">
          <TabsContent value="nominations" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <AdminNominationsTab />
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
          <TabsContent value="settings" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Campaign Settings
              </h2>
              <CampaignFeeDistributionSettings />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
