import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, Trophy, Crown, Shield } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { ModuleAuthorizationDrawer } from "@/components/admin/authorization/ModuleAuthorizationDrawer";

import communityPerson1 from "@/assets/community-person-1.jpg";
import communityPerson2 from "@/assets/community-person-2.jpg";
import communityPerson3 from "@/assets/community-person-3.jpg";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ElectionResult {
  id: string;
  position: string;
  winnerName: string;
  winnerAvatar: string;
  runnerUpName?: string;
  runnerUpAvatar?: string;
  votes: number;
  totalVotes: number;
  electionDate: Date;
  isApplied: boolean;
}

const mockElectionResults: ElectionResult[] = [
  {
    id: "1",
    position: "President",
    winnerName: "Chief Emeka Obi",
    winnerAvatar: communityPerson1,
    runnerUpName: "Dr. Chukwuemeka Nwosu",
    votes: 245,
    totalVotes: 380,
    electionDate: new Date("2025-01-15"),
    isApplied: true,
  },
  {
    id: "2",
    position: "Vice President",
    winnerName: "Dr. Amaka Eze",
    winnerAvatar: communityPerson2,
    votes: 198,
    totalVotes: 380,
    electionDate: new Date("2025-01-15"),
    isApplied: true,
  },
  {
    id: "3",
    position: "Secretary",
    winnerName: "Barr. Ngozi Okonkwo",
    winnerAvatar: communityPerson3,
    votes: 312,
    totalVotes: 380,
    electionDate: new Date("2025-01-15"),
    isApplied: false,
  },
];

export function ApplyElectionResultsSheet({ open, onOpenChange }: SheetProps) {
  const { toast } = useToast();
  const [results, setResults] = useState(mockElectionResults);

  // Authorization state
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "single" | "all";
    resultId?: string;
  } | null>(null);

  const pendingResults = results.filter(r => !r.isApplied);
  const appliedResults = results.filter(r => r.isApplied);

  const handleApplyResult = (resultId: string) => {
    // Open auth drawer instead of directly applying
    setPendingAction({ type: "single", resultId });
    setAuthDrawerOpen(true);
  };

  const handleApplyAll = () => {
    // Open auth drawer for batch action
    setPendingAction({ type: "all" });
    setAuthDrawerOpen(true);
  };

  const handleAuthorizationComplete = () => {
    if (!pendingAction) return;

    if (pendingAction.type === "single" && pendingAction.resultId) {
      const result = results.find(r => r.id === pendingAction.resultId);
      setResults(prev => 
        prev.map(r => r.id === pendingAction.resultId ? { ...r, isApplied: true } : r)
      );
      toast({
        title: "Result Applied",
        description: `${result?.winnerName} is now the ${result?.position}`,
      });
    } else if (pendingAction.type === "all") {
      setResults(prev => prev.map(r => ({ ...r, isApplied: true })));
      toast({
        title: "All Results Applied",
        description: `${pendingResults.length} leadership positions updated`,
      });
    }

    setPendingAction(null);
  };

  const getAuthActionDetails = () => {
    if (!pendingAction) return null;

    if (pendingAction.type === "single" && pendingAction.resultId) {
      const result = results.find(r => r.id === pendingAction.resultId);
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <Crown className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm">{result?.position}</p>
              <p className="text-xs text-muted-foreground">Leadership Change</p>
            </div>
          </div>
          <div className="p-2.5 bg-muted/50 rounded-lg text-sm space-y-1">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground shrink-0">Winner:</span>
              <span className="text-right font-medium">{result?.winnerName}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground shrink-0">Votes:</span>
              <span className="text-right">
                {result?.votes} / {result?.totalVotes} ({Math.round((result?.votes || 0) / (result?.totalVotes || 1) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Apply all action
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <Crown className="h-5 w-5 text-green-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm">Apply All Pending Results</p>
            <p className="text-xs text-muted-foreground">Batch Update from 2025 Election</p>
          </div>
        </div>
        <div className="p-2.5 bg-muted/50 rounded-lg text-xs space-y-1">
          {pendingResults.slice(0, 3).map(result => (
            <div key={result.id} className="flex justify-between gap-2">
              <span className="text-muted-foreground truncate">{result.position}:</span>
              <span className="font-medium truncate">{result.winnerName}</span>
            </div>
          ))}
          {pendingResults.length > 3 && (
            <p className="text-muted-foreground">+{pendingResults.length - 3} more...</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Authorization Drawer */}
      <ModuleAuthorizationDrawer
        open={authDrawerOpen}
        onOpenChange={setAuthDrawerOpen}
        module="leadership"
        actionTitle={
          pendingAction?.type === "single"
            ? "Apply Election Result"
            : `Apply All Results (${pendingResults.length})`
        }
        actionDescription="Multi-signature authorization required: President + Secretary + (PRO or Dir. of Socials)"
        actionDetails={getAuthActionDetails()}
        initiatorRole="secretary"
        onAuthorized={handleAuthorizationComplete}
      />

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0 flex flex-col overflow-hidden">
          <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Apply Election Results
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain">
            <div className="px-4 py-4 pb-6 space-y-4">
              {/* Summary Card */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-sm text-green-800 dark:text-green-200">
                        2025 General Elections
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date("2025-01-15"), "MMMM d, yyyy")}
                      </p>
                    </div>
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2">
                      <p className="text-lg font-bold text-green-700 dark:text-green-300">{results.length}</p>
                      <p className="text-[10px] text-muted-foreground">Total Offices</p>
                    </div>
                    <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2">
                      <p className="text-lg font-bold text-amber-600">{pendingResults.length}</p>
                      <p className="text-[10px] text-muted-foreground">Pending</p>
                    </div>
                    <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2">
                      <p className="text-lg font-bold text-green-600">{appliedResults.length}</p>
                      <p className="text-[10px] text-muted-foreground">Applied</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Apply All Button */}
              {pendingResults.length > 0 && (
                <Button 
                  onClick={handleApplyAll}
                  className="w-full bg-green-600 hover:bg-green-700 h-11"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Apply All Pending Results ({pendingResults.length})
                </Button>
              )}

              {/* Pending Results */}
              {pendingResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-amber-500" />
                    Pending Application ({pendingResults.length})
                  </h4>
                  {pendingResults.map((result) => (
                    <Card key={result.id} className="border-amber-200 dark:border-amber-800">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12 shrink-0">
                            <AvatarImage src={result.winnerAvatar} alt={result.winnerName} />
                            <AvatarFallback>{result.winnerName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">{result.position}</p>
                            <p className="font-semibold text-sm truncate">{result.winnerName}</p>
                            <p className="text-xs text-muted-foreground">
                              {result.votes} / {result.totalVotes} votes ({Math.round((result.votes / result.totalVotes) * 100)}%)
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleApplyResult(result.id)}
                            className="shrink-0"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Apply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Applied Results */}
              {appliedResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Applied to Leadership ({appliedResults.length})
                  </h4>
                  {appliedResults.map((result) => (
                    <Card key={result.id} className="bg-muted/30">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={result.winnerAvatar} alt={result.winnerName} />
                            <AvatarFallback>{result.winnerName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">{result.position}</p>
                            <p className="font-medium text-sm truncate">{result.winnerName}</p>
                          </div>
                          <Badge variant="secondary" className="shrink-0 text-[10px]">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Applied
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Authorization Note */}
              <div className="flex items-start gap-2 pt-3 border-t">
                <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Leadership changes require multi-signature approval: President + Secretary + (PRO or Dir. of Socials).
                  If President/Secretary unavailable, 4 signatories including Legal Adviser required.
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
