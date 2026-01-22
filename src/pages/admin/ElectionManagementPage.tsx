import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminCampaignsTab } from "@/components/admin/election/AdminCampaignsTab";
import { AdminAccreditationTab } from "@/components/admin/election/AdminAccreditationTab";
import { AdminClearancesTab } from "@/components/admin/election/AdminClearancesTab";
import { AdminWinnersAnnouncementTab } from "@/components/admin/election/AdminWinnersAnnouncementTab";

export default function ElectionManagementPage() {
  const { communityId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/community/${communityId}/admin`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Vote className="h-5 w-5 text-green-600" />
            <h1 className="font-bold text-lg">Election Management</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="campaigns" className="w-full">
        <div className="border-b px-4">
          <ScrollArea className="w-full" style={{ overflowX: 'auto' }}>
            <TabsList className="h-11 bg-transparent w-max">
              <TabsTrigger value="campaigns" className="data-[state=active]:bg-green-500/10">
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="accreditation" className="data-[state=active]:bg-green-500/10">
                Accreditation
              </TabsTrigger>
              <TabsTrigger value="clearances" className="data-[state=active]:bg-green-500/10">
                Clearances
              </TabsTrigger>
              <TabsTrigger value="winners" className="data-[state=active]:bg-green-500/10">
                Announce Winners
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>

        <div className="p-4">
          <TabsContent value="campaigns" className="mt-0">
            <AdminCampaignsTab />
          </TabsContent>
          <TabsContent value="accreditation" className="mt-0">
            <AdminAccreditationTab />
          </TabsContent>
          <TabsContent value="clearances" className="mt-0">
            <AdminClearancesTab />
          </TabsContent>
          <TabsContent value="winners" className="mt-0">
            <AdminWinnersAnnouncementTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
