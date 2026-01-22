import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockLeadershipChanges } from "@/data/leadershipChangeHistory";
import { 
  changeReasonLabels, 
  changeTypeLabels, 
  committeeLabels,
  ChangeType 
} from "@/types/leadershipManagement";
import { format } from "date-fns";
import { 
  History, 
  UserPlus, 
  UserMinus, 
  RefreshCw, 
  ArrowRightLeft,
  ChevronDown
} from "lucide-react";

const changeTypeIcons: Record<ChangeType, React.ReactNode> = {
  add: <UserPlus className="h-5 w-5 text-green-500" />,
  remove: <UserMinus className="h-5 w-5 text-red-500" />,
  update: <RefreshCw className="h-5 w-5 text-blue-500" />,
  transfer: <ArrowRightLeft className="h-5 w-5 text-amber-500" />,
};

const changeTypeBadgeVariants: Record<ChangeType, "default" | "secondary" | "destructive" | "outline"> = {
  add: "default",
  remove: "destructive",
  update: "secondary",
  transfer: "outline",
};

export function LeadershipChangeHistory() {
  const [filter, setFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(5);

  const filteredChanges = filter === "all" 
    ? mockLeadershipChanges 
    : mockLeadershipChanges.filter(c => c.committee === filter);

  const visibleChanges = filteredChanges.slice(0, visibleCount);
  const hasMore = visibleCount < filteredChanges.length;

  const groupedByDate = visibleChanges.reduce((acc, change) => {
    const dateKey = format(change.changedAt, "MMM d, yyyy");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(change);
    return acc;
  }, {} as Record<string, typeof mockLeadershipChanges>);

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-primary" />
        <span className="font-semibold text-base">Change History</span>
        <Badge variant="secondary" className="text-sm">{filteredChanges.length}</Badge>
      </div>

      {/* Filter Dropdown */}
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-full h-11 text-sm">
          <SelectValue placeholder="Filter by committee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Changes</SelectItem>
          <SelectItem value="executive">Executive Committee</SelectItem>
          <SelectItem value="adhoc">Ad-hoc Committees</SelectItem>
          <SelectItem value="staff">Staff & Employees</SelectItem>
        </SelectContent>
      </Select>

      {/* History List */}
      <div className="space-y-4">
        {Object.entries(groupedByDate).map(([date, changes]) => (
          <div key={date}>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              {date}
            </h4>
            <div className="space-y-3">
              {changes.map((change) => (
                <Card key={change.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    {/* Header Row */}
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {changeTypeIcons[change.changeType]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-base leading-tight">{change.memberName}</h4>
                          <Badge 
                            variant={changeTypeBadgeVariants[change.changeType]}
                            className="text-xs shrink-0"
                          >
                            {changeTypeLabels[change.changeType]}
                          </Badge>
                        </div>
                        
                        {/* Position Change */}
                        <p className="text-sm text-muted-foreground mt-1">
                          {change.changeType === "add" && `Added as ${change.newPosition}`}
                          {change.changeType === "remove" && `Removed from ${change.previousPosition}`}
                          {change.changeType === "update" && `${change.previousPosition} → ${change.newPosition}`}
                          {change.changeType === "transfer" && `${change.previousPosition} → ${change.newPosition}`}
                        </p>
                        
                        {/* Committee & Reason */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {committeeLabels[change.committee]}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {changeReasonLabels[change.reason]}
                          </span>
                        </div>

                        {/* Notes */}
                        {change.notes && (
                          <p className="text-sm text-muted-foreground italic mt-2 p-2 bg-muted/50 rounded-md">
                            "{change.notes}"
                          </p>
                        )}

                        {/* Changed By */}
                        <p className="text-sm text-muted-foreground mt-2">
                          By: {change.changedBy} • {format(change.changedAt, "h:mm a")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <Button
          variant="outline"
          className="w-full h-11 text-sm"
          onClick={() => setVisibleCount(prev => prev + 5)}
        >
          <ChevronDown className="h-4 w-4 mr-2" />
          Load More History
        </Button>
      )}
    </div>
  );
}