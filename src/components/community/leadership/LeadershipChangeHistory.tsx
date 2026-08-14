import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, UserPlus, UserMinus, RefreshCw, ArrowRightLeft, ChevronDown, Loader2, Vote } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const API = "/api/community";

interface HistoryEntry {
  id: string; user_id: string; member_name: string; profile_photo?: string;
  position_title: string; action: string; effective_date?: string;
  notes?: string; changed_by_name?: string; created_at: string;
}

const actionIcon: Record<string, React.ReactNode> = {
  appointed:   <UserPlus  className="h-5 w-5 text-green-500" />,
  elected:     <Vote      className="h-5 w-5 text-blue-500"  />,
  removed:     <UserMinus className="h-5 w-5 text-red-500"   />,
  resigned:    <UserMinus className="h-5 w-5 text-amber-500" />,
  transferred: <ArrowRightLeft className="h-5 w-5 text-purple-500" />,
};

const actionBadge: Record<string, string> = {
  appointed:   "bg-green-100 text-green-700 border-green-200",
  elected:     "bg-blue-100 text-blue-700 border-blue-200",
  removed:     "bg-red-100 text-red-700 border-red-200",
  resigned:    "bg-amber-100 text-amber-700 border-amber-200",
  transferred: "bg-purple-100 text-purple-700 border-purple-200",
};

function timeAgo(d: string) {
  try { return formatDistanceToNow(new Date(d), { addSuffix: true }); } catch { return d; }
}

interface LeadershipChangeHistoryProps { communityId?: string; }

export function LeadershipChangeHistory({ communityId }: LeadershipChangeHistoryProps) {
  const [history,       setHistory]       = useState<HistoryEntry[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [filter,        setFilter]        = useState("all");
  const [visibleCount,  setVisibleCount]  = useState(10);

  const fetchHistory = useCallback(async () => {
    if (!communityId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/leadership.php?community_id=${communityId}`, { credentials: "include" });
      if (!res.ok) return;
      const d = await res.json();
      setHistory(d.history ?? []);
    } catch {}
    finally { setLoading(false); }
  }, [communityId]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const filtered = filter === "all" ? history : history.filter(h => h.action === filter);
  const visible  = filtered.slice(0, visibleCount);
  const hasMore  = visibleCount < filtered.length;

  // Group by date
  const grouped = visible.reduce<Record<string, HistoryEntry[]>>((acc, h) => {
    const key = h.effective_date
      ? new Date(h.effective_date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
      : new Date(h.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(h);
    return acc;
  }, {});

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-primary" />
        <span className="font-semibold text-base">Change History</span>
        <Badge variant="secondary" className="text-sm">{filtered.length}</Badge>
        <Button size="sm" variant="ghost" className="h-7 px-2 ml-auto" onClick={fetchHistory} disabled={loading}>
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
        </Button>
      </div>

      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-full h-11 text-sm">
          <SelectValue placeholder="Filter by action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Changes</SelectItem>
          <SelectItem value="appointed">Appointments</SelectItem>
          <SelectItem value="elected">Elections</SelectItem>
          <SelectItem value="removed">Removals</SelectItem>
          <SelectItem value="resigned">Resignations</SelectItem>
          <SelectItem value="transferred">Transfers</SelectItem>
        </SelectContent>
      </Select>

      {loading && history.length === 0 ? (
        <div className="flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <History className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No leadership changes recorded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([date, entries]) => (
            <div key={date}>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 px-1">{date}</h4>
              <div className="space-y-3">
                {entries.map(h => (
                  <Card key={h.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarImage src={h.profile_photo} />
                          <AvatarFallback className="text-xs">{(h.member_name || "U")[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm">{h.member_name}</h4>
                            <Badge className={cn("text-[10px] px-1.5 capitalize shrink-0", actionBadge[h.action] || "bg-gray-100 text-gray-600")}>
                              {h.action}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{h.position_title}</p>
                          {h.notes && (
                            <p className="text-xs text-muted-foreground italic mt-1.5 p-2 bg-muted/50 rounded-md">"{h.notes}"</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1.5">
                            By {h.changed_by_name || "Admin"} • {timeAgo(h.created_at)}
                          </p>
                        </div>
                        <div className="shrink-0 mt-0.5">
                          {actionIcon[h.action] || <History className="h-5 w-5 text-muted-foreground" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <Button variant="outline" className="w-full h-11 text-sm" onClick={() => setVisibleCount(v => v + 10)}>
          <ChevronDown className="h-4 w-4 mr-2" /> Load More History
        </Button>
      )}
    </div>
  );
}
