import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";

interface CandidateClearance {
  id: string;
  candidateName: string;
  office: string;
  avatar?: string;
  status: "approved" | "pending" | "rejected";
  submittedAt: Date;
}

interface ElectionClearancesTabProps {
  communityId?: string;
}

export const ElectionClearancesTab = ({ communityId }: ElectionClearancesTabProps) => {
  const [clearances, setClearances] = useState<CandidateClearance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!communityId) return;
    setLoading(true);
    fetch(`/api/community/elections.php?community_id=${communityId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const officesById: Record<string, string> = {};
        (d.offices ?? []).forEach((o: any) => { officesById[o.id] = o.name; });
        const mapped: CandidateClearance[] = (d.candidates ?? []).map((c: any) => ({
          id: c.id,
          candidateName: c.name?.trim() || "Candidate",
          office: officesById[c.office_id] || c.position || "Office",
          avatar: c.profile_photo || undefined,
          status: c.status === "cleared" ? "approved" : c.status === "pending" ? "pending" : "rejected",
          submittedAt: new Date(c.registered_at),
        }));
        setClearances(mapped);
      })
      .catch(() => setClearances([]))
      .finally(() => setLoading(false));
  }, [communityId]);

  const approved = clearances.filter((c) => c.status === "approved").length;
  const pending = clearances.filter((c) => c.status === "pending").length;
  const rejected = clearances.filter((c) => c.status === "rejected").length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Candidate Clearances</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{approved}</div>
          <div className="text-xs text-muted-foreground">Approved</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{pending}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{rejected}</div>
          <div className="text-xs text-muted-foreground">Rejected</div>
        </Card>
      </div>

      {/* Clearances List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : clearances.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">No candidates awaiting clearance.</div>
      ) : (
      <div className="space-y-4">
        {clearances.map((clearance) => (
          <Card key={clearance.id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="mt-1">
                <AvatarImage src={clearance.avatar} alt={clearance.candidateName} />
                <AvatarFallback>{clearance.candidateName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{clearance.candidateName}</h4>
                    <p className="text-sm text-muted-foreground">{clearance.office}</p>
                  </div>
                  <Badge
                    variant={
                      clearance.status === "approved"
                        ? "default"
                        : clearance.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className="flex items-center gap-1"
                  >
                    {clearance.status === "approved" ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : clearance.status === "pending" ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {clearance.status}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Registered: {clearance.submittedAt.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* Ads */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-clearances" />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
