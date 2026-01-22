import { useState } from "react";
import { Menu } from "lucide-react";
import { VotingResultSheet } from "./VotingResultSheet";
import { PreviousElectionsList } from "./PreviousElectionsList";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import {
  mockElection,
  mockVoteRecords,
  mockPreviousElections,
} from "@/data/electionData";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";

export const ElectionResultsTab = () => {
  const [showResultSheet, setShowResultSheet] = useState(true);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Voting Results</h1>
        </div>
      </div>

      {/* Result Sheet */}
      {showResultSheet && (
        <VotingResultSheet
          office={mockElection.offices[0]}
          voteRecords={mockVoteRecords}
          onClose={() => setShowResultSheet(false)}
        />
      )}

      {/* Ads */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-results" />

      {/* People You May Know */}
      <PeopleYouMayKnow />

      {/* Previous Elections */}
      <PreviousElectionsList elections={mockPreviousElections} />
    </div>
  );
};
