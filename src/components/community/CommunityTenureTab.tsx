import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, CalendarClock } from "lucide-react";
import { mapApiPositionToTenure, ApiPosition } from "@/lib/leadershipMerge";
import { OfficeTenure } from "@/data/communityExecutivesData";

const API = "/api/community";

interface CommunityTenureTabProps {
  communityId?: string;
}

export const CommunityTenureTab = ({ communityId }: CommunityTenureTabProps) => {
  const [tenures, setTenures] = useState<OfficeTenure[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(() => {
    if (!communityId) return;
    setLoading(true);
    fetch(`${API}/leadership.php?community_id=${communityId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        const positions: ApiPosition[] = d.positions ?? [];
        setTenures(positions.map(mapApiPositionToTenure));
      })
      .catch(() => setTenures([]))
      .finally(() => setLoading(false));
  }, [communityId]);

  useEffect(() => { loadData(); }, [loadData]);

  if (!communityId) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        No community selected.
      </Card>
    );
  }

  if (loading && tenures.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (tenures.length === 0) {
    return (
      <Card className="p-10 text-center">
        <CalendarClock className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
        <p className="font-medium mb-1">No Positions Set Up Yet</p>
        <p className="text-sm text-muted-foreground">
          Office tenure information will appear once positions are created.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="bg-primary text-primary-foreground p-3">
          <h3 className="font-semibold text-sm">Office Tenure Information</h3>
        </div>
        <div className="divide-y">
          {tenures.map((tenure) => (
            <div key={tenure.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{tenure.position}</h4>
                  <p className="text-sm text-muted-foreground">{tenure.currentHolder}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{tenure.termStart} - {tenure.termEnd}</p>
                  <p className="text-primary font-medium mt-1">{tenure.duration}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
