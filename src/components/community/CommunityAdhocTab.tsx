import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, UserCog } from "lucide-react";
import { ExecutiveMembersCarousel } from "./ExecutiveMembersCarousel";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExecutiveDetailSheet } from "./ExecutiveDetailSheet";
import { mapApiAdhocMembers, ApiAdhocCommittee } from "@/lib/leadershipMerge";

const API = "/api/community";

interface CommunityAdhocTabProps {
  communityId?: string;
}

export const CommunityAdhocTab = ({ communityId }: CommunityAdhocTabProps) => {
  const [adHocFilter, setAdHocFilter] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [committees, setCommittees] = useState<ApiAdhocCommittee[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(() => {
    if (!communityId) return;
    setLoading(true);
    fetch(`${API}/leadership.php?community_id=${communityId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        const adhoc: ApiAdhocCommittee[] = (d.adhoc ?? []).filter((c: ApiAdhocCommittee) => c.status === "active");
        setCommittees(adhoc);
      })
      .catch(() => setCommittees([]))
      .finally(() => setLoading(false));
  }, [communityId]);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredCommittees = adHocFilter === "all" ? committees : committees.filter((c) => c.id === adHocFilter);
  const adHocMembers = mapApiAdhocMembers(filteredCommittees);

  const handleMemberClick = (member: ExecutiveMember) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  const filterDropdown = (
    <Select value={adHocFilter} onValueChange={setAdHocFilter}>
      <SelectTrigger className="h-7 w-[140px] bg-primary-foreground text-primary text-xs">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Committees</SelectItem>
        {committees.map((c) => (
          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  if (!communityId) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        No community selected.
      </Card>
    );
  }

  if (loading && committees.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (committees.length === 0) {
    return (
      <Card className="p-10 text-center">
        <UserCog className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
        <p className="font-medium mb-1">No Active Ad-hoc Committees</p>
        <p className="text-sm text-muted-foreground">
          This community hasn't set up any ad-hoc committees yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ExecutiveMembersCarousel
        title={`Ad-hoc Committee Members${adHocFilter !== "all" ? ` - ${committees.find(c => c.id === adHocFilter)?.name ?? ""}` : ""}`}
        members={adHocMembers}
        showViewToggle={true}
        onMemberClick={handleMemberClick}
        headerExtra={filterDropdown}
      />

      {adHocMembers.length === 0 && (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          No members assigned to {adHocFilter === "all" ? "any committee" : "this committee"} yet.
        </Card>
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
