import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, Trophy, Users, Calendar, ChevronRight, Shield } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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

  const pendingResults = results.filter(r => !r.isApplied);
  const appliedResults = results.filter(r => r.isApplied);

  const handleApplyResult = (resultId: string) => {
    setResults(prev => 
      prev.map(r => r.id === resultId ? { ...r, isApplied: true } : r)
    );
    const result = results.find(r => r.id === resultId);
    toast({
      title: "Result Applied",
      description: `${result?.winnerName} is now the ${result?.position}`,
    });
  };

  const handleApplyAll = () => {
    setResults(prev => prev.map(r => ({ ...r, isApplied: true })));
    toast({
      title: "All Results Applied",
      description: `${pendingResults.length} leadership positions updated`,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0 flex flex-col">
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
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
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
            <div className="flex items-start gap-2 pt-2 border-t">
              <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Applying results requires multi-signature authorization from President + Secretary + Legal Adviser
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
