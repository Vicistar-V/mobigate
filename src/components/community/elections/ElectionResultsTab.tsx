import { useState, useEffect } from "react";
import { Menu, Loader2 } from "lucide-react";
import { VotingResultSheet } from "./VotingResultSheet";
import { PreviousElectionsList } from "./PreviousElectionsList";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { ElectionOffice, PreviousElection } from "@/data/electionData";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";

const API = "/api/community/elections.php";
const CANDIDATE_COLORS: ElectionOffice["candidates"][number]["color"][] = ["green", "purple", "magenta", "orange", "blue"];

interface ElectionResultsTabProps {
  communityId?: string;
}

export const ElectionResultsTab = ({ communityId }: ElectionResultsTabProps) => {
  const [showResultSheet, setShowResultSheet] = useState(true);
  const [office, setOffice] = useState<ElectionOffice | null>(null);
  const [previousElections, setPreviousElections] = useState<PreviousElection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!communityId) return;
    setLoading(true);
    fetch(`${API}?community_id=${communityId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(async (d) => {
        const currentElection = (d.elections ?? []).find((e: any) => ['active','voting','campaign'].includes(e.status));
        if (currentElection) {
          const resultsRes = await fetch(`${API}?action=results&community_id=${communityId}&election_id=${currentElection.id}`, { credentials: "include" }).then((r) => r.json());
          const firstOffice = (resultsRes.offices ?? [])[0];
          if (firstOffice) {
            setOffice({
              id: firstOffice.id,
              name: firstOffice.name,
              shortCode: firstOffice.short_code || firstOffice.name.substring(0, 3).toUpperCase(),
              totalAccreditedVoters: d.stats?.accredited ?? 0,
              votedCount: firstOffice.total_votes_cast ?? 0,
              candidates: (firstOffice.candidates ?? []).map((c: any, idx: number) => ({
                id: c.id, name: c.name?.trim() || "Candidate", avatar: c.profile_photo || undefined,
                officeId: firstOffice.id, votes: parseInt(c.live_votes, 10) || 0, losses: 0,
                vct: parseInt(c.live_votes, 10) || 0, color: CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length],
                manifesto: c.manifesto || undefined,
              })),
            });
          }
        }

        const completedElections = (d.elections ?? []).filter((e: any) => e.status === "completed");
        const winnersRes = await fetch(`${API}?action=winners&community_id=${communityId}`, { credentials: "include" }).then((r) => r.json());
        const mapped: PreviousElection[] = completedElections.map((e: any) => {
          const winner = (winnersRes.winners ?? []).find((w: any) => w.election_id === e.id);
          return {
            id: e.id, name: e.title, date: new Date(e.created_at), type: e.type,
            winner: winner?.name?.trim() || undefined,
            totalVotes: (winnersRes.winners ?? []).filter((w: any) => w.election_id === e.id).reduce((s: number, w: any) => s + (parseInt(w.votes, 10) || 0), 0),
          };
        });
        setPreviousElections(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [communityId]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Voting Results</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : office && showResultSheet ? (
        <VotingResultSheet
          office={office}
          voteRecords={[]}
          onClose={() => setShowResultSheet(false)}
        />
      ) : !office ? (
        <div className="text-center py-8 text-muted-foreground text-sm">No election results to show right now.</div>
      ) : null}

      {/* Ads */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-results" />

      {/* People You May Know */}
      <PeopleYouMayKnow />

      {/* Previous Elections */}
      <PreviousElectionsList elections={previousElections} />
    </div>
  );
};
