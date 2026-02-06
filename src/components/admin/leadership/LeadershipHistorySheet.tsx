import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { History, Calendar, ArrowRight, Crown, UserMinus, UserPlus, RefreshCw } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

import communityPerson1 from "@/assets/community-person-1.jpg";
import communityPerson2 from "@/assets/community-person-2.jpg";
import communityPerson3 from "@/assets/community-person-3.jpg";
import communityPerson4 from "@/assets/community-person-4.jpg";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ChangeType = "elected" | "appointed" | "removed" | "resigned" | "term_ended";

interface LeadershipChange {
  id: string;
  type: ChangeType;
  position: string;
  memberName: string;
  memberAvatar: string;
  previousMemberName?: string;
  previousMemberAvatar?: string;
  date: Date;
  reason?: string;
  authorizedBy: string[];
}

const mockLeadershipHistory: LeadershipChange[] = [
  {
    id: "1",
    type: "elected",
    position: "President",
    memberName: "Chief Emeka Obi",
    memberAvatar: communityPerson1,
    previousMemberName: "Dr. Nnamdi Azikiwe",
    date: new Date("2025-01-20"),
    reason: "2025 General Elections",
    authorizedBy: ["Secretary", "Legal Adviser"],
  },
  {
    id: "2",
    type: "elected",
    position: "Vice President",
    memberName: "Dr. Amaka Eze",
    memberAvatar: communityPerson2,
    date: new Date("2025-01-20"),
    reason: "2025 General Elections",
    authorizedBy: ["Secretary", "Legal Adviser"],
  },
  {
    id: "3",
    type: "appointed",
    position: "Welfare Officer",
    memberName: "Engr. Obinna Ibe",
    memberAvatar: communityPerson4,
    date: new Date("2024-11-15"),
    reason: "Executive appointment",
    authorizedBy: ["President", "Secretary"],
  },
  {
    id: "4",
    type: "resigned",
    position: "PRO",
    memberName: "Mr. Chidi Okoro",
    memberAvatar: communityPerson3,
    date: new Date("2024-10-01"),
    reason: "Personal reasons",
    authorizedBy: ["President"],
  },
  {
    id: "5",
    type: "term_ended",
    position: "President",
    memberName: "Dr. Nnamdi Azikiwe",
    memberAvatar: communityPerson4,
    date: new Date("2025-01-15"),
    reason: "Term completed after 4 years",
    authorizedBy: ["Electoral Committee"],
  },
];

const getChangeIcon = (type: ChangeType) => {
  switch (type) {
    case "elected":
      return <Crown className="h-4 w-4 text-green-600" />;
    case "appointed":
      return <UserPlus className="h-4 w-4 text-blue-600" />;
    case "removed":
      return <UserMinus className="h-4 w-4 text-red-600" />;
    case "resigned":
      return <ArrowRight className="h-4 w-4 text-amber-600" />;
    case "term_ended":
      return <RefreshCw className="h-4 w-4 text-gray-600" />;
  }
};

const getChangeBadge = (type: ChangeType) => {
  switch (type) {
    case "elected":
      return <Badge className="bg-green-100 text-green-700 text-[10px]">Elected</Badge>;
    case "appointed":
      return <Badge className="bg-blue-100 text-blue-700 text-[10px]">Appointed</Badge>;
    case "removed":
      return <Badge className="bg-red-100 text-red-700 text-[10px]">Removed</Badge>;
    case "resigned":
      return <Badge className="bg-amber-100 text-amber-700 text-[10px]">Resigned</Badge>;
    case "term_ended":
      return <Badge className="bg-gray-100 text-gray-700 text-[10px]">Term Ended</Badge>;
  }
};

export function LeadershipHistorySheet({ open, onOpenChange }: SheetProps) {
  // Group by year
  const groupedHistory = mockLeadershipHistory.reduce((acc, change) => {
    const year = format(change.date, "yyyy");
    if (!acc[year]) acc[year] = [];
    acc[year].push(change);
    return acc;
  }, {} as Record<string, LeadershipChange[]>);

  const years = Object.keys(groupedHistory).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Leadership Change History
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto touch-auto overscroll-contain">
          <div className="px-4 py-4 pb-6 space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <p className="text-lg font-bold text-green-600">
                  {mockLeadershipHistory.filter(h => h.type === "elected").length}
                </p>
                <p className="text-[10px] text-muted-foreground">Elected</p>
              </div>
              <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <p className="text-lg font-bold text-blue-600">
                  {mockLeadershipHistory.filter(h => h.type === "appointed").length}
                </p>
                <p className="text-[10px] text-muted-foreground">Appointed</p>
              </div>
              <div className="text-center p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                <p className="text-lg font-bold text-amber-600">
                  {mockLeadershipHistory.filter(h => h.type === "resigned").length}
                </p>
                <p className="text-[10px] text-muted-foreground">Resigned</p>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-950/30 rounded-lg">
                <p className="text-lg font-bold text-gray-600">
                  {mockLeadershipHistory.filter(h => h.type === "term_ended").length}
                </p>
                <p className="text-[10px] text-muted-foreground">Ended</p>
              </div>
            </div>

            {/* Timeline by Year */}
            {years.map((year) => (
              <div key={year} className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2 sticky top-0 bg-background py-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  {year}
                </h4>

                <div className="space-y-2 pl-2 border-l-2 border-border ml-2">
                  {groupedHistory[year].map((change) => (
                    <Card key={change.id} className="ml-2">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-muted shrink-0">
                            {getChangeIcon(change.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs text-muted-foreground">
                                {change.position}
                              </span>
                              {getChangeBadge(change.type)}
                            </div>
                            
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={change.memberAvatar} alt={change.memberName} />
                                <AvatarFallback className="text-[10px]">{change.memberName[0]}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-medium text-sm truncate">{change.memberName}</p>
                              </div>
                            </div>

                            {change.reason && (
                              <p className="text-xs text-muted-foreground mb-1">
                                {change.reason}
                              </p>
                            )}

                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                              <span>{format(change.date, "MMM d, yyyy")}</span>
                              <span className="text-right truncate ml-2">
                                By: {change.authorizedBy.join(", ")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {mockLeadershipHistory.length === 0 && (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">No leadership changes recorded</p>
                <p className="text-xs text-muted-foreground">
                  Changes will appear here when leadership positions are updated
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
