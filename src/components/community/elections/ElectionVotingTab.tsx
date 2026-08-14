import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Loader2, Vote } from "lucide-react";
import { ElectionVotingCard } from "./ElectionVotingCard";
import { AnonymousVotingSection } from "./AnonymousVotingSection";
import { ElectionControlBar } from "./ElectionControlBar";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { ElectionOffice } from "@/data/electionData";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";
import { useToast } from "@/hooks/use-toast";

const API = "/api/community/elections.php";
const CANDIDATE_COLORS: ElectionOffice["candidates"][number]["color"][] = ["green", "purple", "magenta", "orange", "blue"];

interface ElectionVotingTabProps {
  communityId?: string;
}

export const ElectionVotingTab = ({ communityId }: ElectionVotingTabProps) => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"offices" | "candidates">("offices");
  const [offices, setOffices] = useState<ElectionOffice[]>([]);
  const [electionId, setElectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(() => {
    if (!communityId) return;
    setLoading(true);
    fetch(`${API}?community_id=${communityId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        const activeElection = (d.elections ?? []).find((e: any) => e.status === "active" || e.status === "voting");
        setElectionId(activeElection?.id ?? null);
        if (!activeElection) { setOffices([]); return; }

        const officesForElection = (d.offices ?? []).filter((o: any) => o.election_id === activeElection.id);
        const mapped: ElectionOffice[] = officesForElection.map((o: any) => {
          const candidates = (d.candidates ?? [])
            .filter((c: any) => c.office_id === o.id && c.status === "cleared" && (c.is_self_nomination || c.nomination_accepted))
            .map((c: any, idx: number) => ({
              id: c.id,
              name: c.name?.trim() || "Candidate",
              avatar: c.profile_photo || undefined,
              officeId: o.id,
              votes: parseInt(c.vote_count, 10) || 0,
              losses: 0,
              vct: parseInt(c.vote_count, 10) || 0,
              color: CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length],
              manifesto: c.manifesto || undefined,
              campaignSlogan: c.campaign_slogan || undefined,
              campaignImage: c.campaign_image || undefined,
              keyPriorities: c.key_priorities ? JSON.parse(c.key_priorities) : undefined,
            }));
          return {
            id: o.id,
            name: o.name,
            shortCode: o.short_code || o.name.substring(0, 3).toUpperCase(),
            totalAccreditedVoters: d.stats?.accredited ?? 0,
            votedCount: candidates.reduce((s: number, c: any) => s + c.votes, 0),
            candidates,
            adminRemark: o.admin_remark || undefined,
          };
        });
        setOffices(mapped);
      })
      .catch(() => setOffices([]))
      .finally(() => setLoading(false));
  }, [communityId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleVote = async (officeId: string, candidateId: string, comment?: string) => {
    if (!communityId || !electionId) return;
    try {
      const res = await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cast_vote", community_id: communityId, election_id: electionId, office_id: officeId, candidate_id: candidateId, comment, stage: "general" }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Failed to cast vote");
      toast({ title: d.changed ? "Vote Changed" : "Vote Cast!", description: "Your vote has been recorded." });
      loadData();
    } catch (e: any) {
      toast({ title: "Couldn't Vote", description: e.message, variant: "destructive" });
    }
  };

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

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : offices.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Vote className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No Active Voting Right Now</p>
          <p className="text-sm">Check back once an election moves to the voting stage.</p>
        </div>
      ) : (
        offices.map((office) => (
          <ElectionVotingCard
            key={office.id}
            office={office}
            onVote={(candidateId, comment) => handleVote(office.id, candidateId, comment)}
          />
        ))
      )}

      {/* Anonymous Voting Section */}
      <AnonymousVotingSection />

      {/* Control Bar */}
      <ElectionControlBar isActive={offices.length > 0} />

      {/* Ads */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-voting" />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
