import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ElectionVotingCard } from "./ElectionVotingCard";
import { AnonymousVotingSection } from "./AnonymousVotingSection";
import { ElectionControlBar } from "./ElectionControlBar";
import { ElectionChatSection } from "./ElectionChatSection";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { mockElection, mockElectionChatMessages } from "@/data/electionData";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";

export const ElectionVotingTab = () => {
  const [viewMode, setViewMode] = useState<"offices" | "candidates">("offices");

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Start Voting</h1>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
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

      {/* Voting Cards */}
      {mockElection.offices.map((office) => (
        <ElectionVotingCard key={office.id} office={office} />
      ))}

      {/* Anonymous Voting Section */}
      <AnonymousVotingSection />

      {/* Control Bar */}
      <ElectionControlBar isActive={true} />

      {/* Ads */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-voting" />

      {/* Chat Section */}
      <ElectionChatSection messages={mockElectionChatMessages} />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
