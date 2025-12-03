import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  add: <UserPlus className="h-4 w-4 text-green-500" />,
  remove: <UserMinus className="h-4 w-4 text-red-500" />,
  update: <RefreshCw className="h-4 w-4 text-blue-500" />,
  transfer: <ArrowRightLeft className="h-4 w-4 text-amber-500" />,
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <span className="font-medium">Change History</span>
          <Badge variant="secondary">{filteredChanges.length}</Badge>
        </div>
      </div>

      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by committee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Changes</SelectItem>
          <SelectItem value="executive">Executive Committee</SelectItem>
          <SelectItem value="adhoc">Ad-hoc Committees</SelectItem>
          <SelectItem value="staff">Staff & Employees</SelectItem>
        </SelectContent>
      </Select>

      <ScrollArea className="h-[380px]">
        <div className="space-y-4">
          {Object.entries(groupedByDate).map(([date, changes]) => (
            <div key={date}>
              <h4 className="text-xs font-medium text-muted-foreground mb-2 sticky top-0 bg-background py-1">
                {date}
              </h4>
              <div className="space-y-2">
                {changes.map((change) => (
                  <Card key={change.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {changeTypeIcons[change.changeType]}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{change.memberName}</span>
                            <Badge 
                              variant={changeTypeBadgeVariants[change.changeType]}
                              className="text-xs"
                            >
                              {changeTypeLabels[change.changeType]}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {change.changeType === "add" && `as ${change.newPosition}`}
                            {change.changeType === "remove" && `from ${change.previousPosition}`}
                            {change.changeType === "update" && `${change.previousPosition} → ${change.newPosition}`}
                            {change.changeType === "transfer" && `${change.previousPosition} → ${change.newPosition}`}
                          </p>
                          
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <Badge variant="outline" className="text-xs">
                              {committeeLabels[change.committee]}
                            </Badge>
                            <span className="text-muted-foreground">
                              {changeReasonLabels[change.reason]}
                            </span>
                          </div>

                          {change.notes && (
                            <p className="text-xs text-muted-foreground italic mt-1">
                              "{change.notes}"
                            </p>
                          )}

                          <p className="text-xs text-muted-foreground mt-1">
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

        {hasMore && (
          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => setVisibleCount(prev => prev + 5)}
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            Load More History
          </Button>
        )}
      </ScrollArea>
    </div>
  );
}
