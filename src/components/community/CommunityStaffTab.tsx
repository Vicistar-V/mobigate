import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Briefcase } from "lucide-react";
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
import { mapApiStaff, ApiStaff } from "@/lib/leadershipMerge";

const API = "/api/community";

interface CommunityStaffTabProps {
  communityId?: string;
}

export const CommunityStaffTab = ({ communityId }: CommunityStaffTabProps) => {
  const [staffFilter, setStaffFilter] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [staff, setStaff] = useState<ApiStaff[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(() => {
    if (!communityId) return;
    setLoading(true);
    fetch(`${API}/staff.php?community_id=${communityId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        const rows: ApiStaff[] = (d.staff ?? []).filter((s: ApiStaff) => s.status === "active");
        setStaff(rows);
      })
      .catch(() => setStaff([]))
      .finally(() => setLoading(false));
  }, [communityId]);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredStaff = staffFilter === "all" ? staff : staff.filter((s) => s.department === staffFilter);
  const staffMembers = filteredStaff.map(mapApiStaff);

  const handleMemberClick = (member: ExecutiveMember) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  const filterDropdown = (
    <Select value={staffFilter} onValueChange={setStaffFilter}>
      <SelectTrigger className="h-7 w-[140px] bg-primary-foreground text-primary text-xs">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Staff</SelectItem>
        <SelectItem value="management">Management</SelectItem>
        <SelectItem value="administrative">Administrative</SelectItem>
        <SelectItem value="support">Support</SelectItem>
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

  if (loading && staff.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <Card className="p-10 text-center">
        <Briefcase className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
        <p className="font-medium mb-1">No Staff Recorded Yet</p>
        <p className="text-sm text-muted-foreground">
          This community hasn't added any staff or employees yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ExecutiveMembersCarousel
        title="Staff & Employees"
        members={staffMembers}
        showViewToggle={true}
        onMemberClick={handleMemberClick}
        headerExtra={filterDropdown}
      />

      {staffMembers.length === 0 && (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          No staff found in this department.
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
