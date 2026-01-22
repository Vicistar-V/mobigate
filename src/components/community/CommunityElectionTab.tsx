import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu } from "lucide-react";
import { ElectionVotingCard } from "./elections/ElectionVotingCard";
import { AnonymousVotingSection } from "./elections/AnonymousVotingSection";
import { ElectionControlBar } from "./elections/ElectionControlBar";
import { VotingResultSheet } from "./elections/VotingResultSheet";
import { PreviousElectionsList } from "./elections/PreviousElectionsList";
import { CampaignsView } from "./elections/CampaignsView";
import { WinnersView } from "./elections/WinnersView";
import { ElectionOpinionsTab } from "./elections/ElectionOpinionsTab";
import { ElectionAccreditationTab } from "./elections/ElectionAccreditationTab";
import { ElectionClearancesTab } from "./elections/ElectionClearancesTab";
import { ElectionPrimariesTab } from "./elections/ElectionPrimariesTab";
import { AccreditedVotersTab } from "./elections/AccreditedVotersTab";
import { LaunchCampaignDialog } from "./elections/LaunchCampaignDialog";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import {
  mockElection,
  mockVoteRecords,
  mockPreviousElections,
  mockCampaigns,
  mockWinners,
} from "@/data/electionData";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";

export const CommunityElectionTab = () => {
  const [activeView, setActiveView] = useState<string>("campaigns");
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [viewMode, setViewMode] = useState<"offices" | "candidates">("offices");
  const [showLaunchDialog, setShowLaunchDialog] = useState(false);

  const handleNavigationClick = (view: string) => {
    setActiveView(view);
    setShowResultSheet(view === "results");
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Elections & Voting</h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Button
          variant={activeView === "campaigns" ? "default" : "outline"}
          size="sm"
          onClick={() => handleNavigationClick("campaigns")}
        >
          Campaigns
        </Button>
        <Button
          variant={activeView === "voting" ? "default" : "outline"}
          size="sm"
          onClick={() => handleNavigationClick("voting")}
        >
          Start Voting
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={activeView === "results" ? "default" : "outline"}
              size="sm"
            >
              Results
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleNavigationClick("results")}>
              View Result Sheets
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigationClick("results-for")}>
              View Votes For
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigationClick("results-against")}>
              View Votes Against
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigationClick("results-neutral")}>
              View Neutrals
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant={activeView === "winners" ? "default" : "outline"}
          size="sm"
          onClick={() => handleNavigationClick("winners")}
        >
          View Winners
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              ...More
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleNavigationClick("opinions")}>
              Public Opinions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigationClick("accreditation")}>
              Accreditation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigationClick("clearances")}>
              Clearances
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigationClick("primaries")}>
              Nomination Primaries
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigationClick("accredited-voters")}>
              Accredited Voters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {/* Campaigns View */}
        {activeView === "campaigns" && (
          <>
            <CampaignsView 
              campaigns={mockCampaigns} 
              onLaunchCampaign={() => setShowLaunchDialog(true)} 
            />
            <LaunchCampaignDialog 
              open={showLaunchDialog} 
              onOpenChange={setShowLaunchDialog} 
            />
            <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-campaigns" />
            <PeopleYouMayKnow />
          </>
        )}

        {/* Voting View */}
        {activeView === "voting" && (
          <>
            <div className="flex gap-2 mb-4">
              <Button
                variant={viewMode === "offices" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("offices")}
              >
                By Offices
              </Button>
              <Button
                variant={viewMode === "candidates" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("candidates")}
              >
                By Candidates
              </Button>
            </div>

            {mockElection.offices.map((office) => (
              <ElectionVotingCard key={office.id} office={office} />
            ))}

            <AnonymousVotingSection />
            <ElectionControlBar isActive={true} />
            <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-voting" />
            <PeopleYouMayKnow />
          </>
        )}

        {/* Results View */}
        {(activeView === "results" || activeView.startsWith("results-")) && (
          <>
            {showResultSheet && (
              <VotingResultSheet
                office={mockElection.offices[0]}
                voteRecords={mockVoteRecords}
                onClose={() => setShowResultSheet(false)}
              />
            )}
            <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-results" />
            <PeopleYouMayKnow />
            <PreviousElectionsList elections={mockPreviousElections} />
          </>
        )}

        {/* Winners View */}
        {activeView === "winners" && (
          <>
            <WinnersView winners={mockWinners} />
            <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-winners" />
            <PeopleYouMayKnow />
          </>
        )}

        {/* Public Opinions View */}
        {activeView === "opinions" && (
          <>
            <ElectionOpinionsTab />
            <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-opinions" />
            <PeopleYouMayKnow />
          </>
        )}

        {/* Accreditation View */}
        {activeView === "accreditation" && (
          <>
            <ElectionAccreditationTab />
            <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-accreditation" />
            <PeopleYouMayKnow />
          </>
        )}

        {/* Clearances View */}
        {activeView === "clearances" && (
          <>
            <ElectionClearancesTab />
            <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-clearances" />
            <PeopleYouMayKnow />
          </>
        )}

        {/* Primaries View */}
        {activeView === "primaries" && (
          <>
            <ElectionPrimariesTab />
            <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-primaries" />
            <PeopleYouMayKnow />
          </>
        )}

        {/* Accredited Voters View */}
        {activeView === "accredited-voters" && (
          <>
            <AccreditedVotersTab />
            <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-accredited-voters" />
            <PeopleYouMayKnow />
          </>
        )}
      </div>
    </div>
  );
};
