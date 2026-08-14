import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Grid3x3, Loader2, Users } from "lucide-react";
import { FeaturedLeaderCard } from "./FeaturedLeaderCard";
import { ExecutiveMembersCarousel } from "./ExecutiveMembersCarousel";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import { ExecutiveDetailSheet } from "./ExecutiveDetailSheet";
import { mapApiExecutive, ApiExecutive } from "@/lib/leadershipMerge";

const API = "/api/community";

interface CommunityExecutiveTabProps {
  communityId?: string;
}

export const CommunityExecutiveTab = ({ communityId }: CommunityExecutiveTabProps) => {
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [executives, setExecutives] = useState<ExecutiveMember[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(() => {
    if (!communityId) return;
    setLoading(true);
    fetch(`${API}/leadership.php?community_id=${communityId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        const execs: ApiExecutive[] = d.executives ?? [];
        setExecutives(execs.map(mapApiExecutive));
      })
      .catch(() => setExecutives([]))
      .finally(() => setLoading(false));
  }, [communityId]);

  useEffect(() => { loadData(); }, [loadData]);

  const presidentGeneral = executives.find((m) => m.level === "topmost");
  const otherExecutives = executives.filter((m) => m.level !== "topmost");

  const handleMemberClick = (member: ExecutiveMember) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  if (!communityId) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        No community selected.
      </Card>
    );
  }

  if (loading && executives.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (executives.length === 0) {
    return (
      <Card className="p-10 text-center">
        <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
        <p className="font-medium mb-1">No Executive Committee Yet</p>
        <p className="text-sm text-muted-foreground">
          Positions haven't been assigned for this community yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Featured President-General */}
      {presidentGeneral && (
        <div>
          <Card className="overflow-hidden mb-4">
            <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Executive Committee Members</h3>
              <Grid3x3 className="h-4 w-4" />
            </div>
          </Card>
          <FeaturedLeaderCard
            leader={presidentGeneral}
            onClick={() => handleMemberClick(presidentGeneral)}
          />
        </div>
      )}

      {/* Other Executive Members */}
      {otherExecutives.length > 0 && (
        <ExecutiveMembersCarousel
          title="Executive Committee Members"
          members={otherExecutives}
          onMemberClick={handleMemberClick}
        />
      )}

      {/* People You May Know */}
      <PeopleYouMayKnow />

      {/* Executive Detail Sheet */}
      <ExecutiveDetailSheet
        member={selectedMember}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
};
