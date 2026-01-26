import { useState } from "react";
import { 
  Vote, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  PlayCircle,
  PauseCircle,
  ChevronRight,
  Trophy,
  BarChart3,
  Settings,
  Plus,
  Info,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  mockPrimaryElections, 
  getPrimaryStats,
  mockElectionProcessSettings
} from "@/data/electionProcessesData";
import { PrimaryElection, PrimaryCandidate } from "@/types/electionProcesses";
import { cn } from "@/lib/utils";
import { 
  calculateAdvancingCandidates, 
  getAdvancementStatusText,
  AdvancementReason,
  DEFAULT_ADVANCEMENT_CONFIG
} from "@/lib/primaryElectionUtils";

const getStatusBadge = (status: PrimaryElection['status']) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-emerald-500 text-white text-[10px]">Completed</Badge>;
    case 'ongoing':
      return <Badge className="bg-blue-500 text-white text-[10px]">Ongoing</Badge>;
    case 'scheduled':
      return <Badge className="bg-amber-500 text-white text-[10px]">Scheduled</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500 text-white text-[10px]">Cancelled</Badge>;
    default:
      return null;
  }
};

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}

const StatCard = ({ icon, value, label, color }: StatCardProps) => (
  <div className={cn("flex flex-col items-center justify-center p-2 rounded-lg", color)}>
    <div className="flex items-center gap-1">
      {icon}
      <span className="text-lg font-bold">{value}</span>
    </div>
    <span className="text-[10px] text-muted-foreground">{label}</span>
  </div>
);

export function AdminPrimaryElectionsSection() {
  const { toast } = useToast();
  const [selectedPrimary, setSelectedPrimary] = useState<PrimaryElection | null>(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);

  const stats = getPrimaryStats();

  const handleStartPrimary = (primary: PrimaryElection) => {
    toast({
      title: "Primary Election Started",
      description: `Primary for ${primary.officeName} is now active`,
    });
  };

  const handleEndPrimary = (primary: PrimaryElection) => {
    toast({
      title: "Primary Election Ended",
      description: `Primary for ${primary.officeName} has been completed`,
    });
  };

  const openPrimaryDetail = (primary: PrimaryElection) => {
    setSelectedPrimary(primary);
    setShowDetailSheet(true);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard 
          icon={<Vote className="h-3.5 w-3.5 text-blue-600" />} 
          value={stats.total} 
          label="Total" 
          color="bg-blue-500/10" 
        />
        <StatCard 
          icon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />} 
          value={stats.completed} 
          label="Completed" 
          color="bg-emerald-500/10" 
        />
        <StatCard 
          icon={<Clock className="h-3.5 w-3.5 text-amber-600" />} 
          value={stats.scheduled} 
          label="Scheduled" 
          color="bg-amber-500/10" 
        />
      </div>

      {/* Action Button */}
      <Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
        <Plus className="h-4 w-4" />
        Schedule New Primary
      </Button>

      {/* Primary Elections List */}
      <div className="space-y-3">
        {mockPrimaryElections.map((primary) => (
          <Card 
            key={primary.id} 
            className="overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
            onClick={() => openPrimaryDetail(primary)}
          >
            <CardContent className="p-3">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{primary.officeName}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3" />
                    {format(primary.scheduledDate, "MMM d, yyyy")}
                    <span className="mx-1">•</span>
                    <Clock className="h-3 w-3" />
                    {primary.startTime} - {primary.endTime}
                  </p>
                </div>
                {getStatusBadge(primary.status)}
              </div>

              {/* Stats */}
              {primary.status !== 'scheduled' && (
                <div className="bg-muted/50 rounded-lg p-2.5 mb-2">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Voter Turnout</span>
                    <span className="font-medium">
                      {Math.round((primary.totalVotesCast / primary.totalEligibleVoters) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(primary.totalVotesCast / primary.totalEligibleVoters) * 100} 
                    className="h-1.5"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>{primary.totalVotesCast} votes</span>
                    <span>{primary.totalEligibleVoters} eligible</span>
                  </div>
                </div>
              )}

            {/* Candidates Preview */}
              {primary.candidates.length > 0 && (() => {
                const config = {
                  autoQualifyThreshold: mockElectionProcessSettings.primaryAdvancementThreshold,
                  minimumAdvancing: mockElectionProcessSettings.primaryAdvancementMinimum,
                  maximumAdvancing: mockElectionProcessSettings.primaryAdvancementMaximum,
                };
                const advancementResult = calculateAdvancingCandidates(primary.candidates, config);
                
                return (
                  <div className="space-y-1.5">
                    {primary.candidates.slice(0, 2).map((candidate, idx) => {
                      const reason = advancementResult.advancementReasons.get(candidate.id);
                      const isAutoQualified = reason === 'auto_qualified';
                      const isTopVotes = reason === 'top_votes';
                      const advances = isAutoQualified || isTopVotes;
                      
                      return (
                        <div 
                          key={candidate.id}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-lg",
                            isAutoQualified ? "bg-emerald-50 dark:bg-emerald-950/20" : 
                            isTopVotes ? "bg-amber-50 dark:bg-amber-950/20" : 
                            "bg-muted/30"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground w-4">
                              {idx + 1}.
                            </span>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback className="text-[10px]">{candidate.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium truncate max-w-[120px]">
                              {candidate.name}
                            </span>
                            {isAutoQualified && (
                              <Star className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                            )}
                            {isTopVotes && (
                              <Trophy className="h-3 w-3 text-amber-500" />
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold">{candidate.percentage}%</span>
                            <p className="text-[10px] text-muted-foreground">{candidate.votes} votes</p>
                          </div>
                        </div>
                      );
                    })}
                    {primary.candidates.length > 2 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{primary.candidates.length - 2} more candidates
                      </p>
                    )}
                  </div>
                );
              })()}

              {primary.status === 'scheduled' && (
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground p-4 bg-muted/30 rounded-lg">
                  <Clock className="h-4 w-4" />
                  Candidates will be shown after screening
                </div>
              )}

              {/* View Details */}
              <div className="flex items-center justify-center gap-1 text-xs text-primary mt-2 pt-2 border-t">
                <span>View Details</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Primary Election Detail Sheet */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              Primary Election Details
            </SheetTitle>
          </SheetHeader>

          {selectedPrimary && (
            <ScrollArea className="h-[calc(90vh-120px)]">
              <div className="space-y-4 px-1">
                {/* Election Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-base">{selectedPrimary.officeName}</h3>
                        <p className="text-sm text-muted-foreground">Primary Election</p>
                      </div>
                      {getStatusBadge(selectedPrimary.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] text-muted-foreground">Date</p>
                          <p className="font-medium text-xs">{format(selectedPrimary.scheduledDate, "MMM d, yyyy")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] text-muted-foreground">Time</p>
                          <p className="font-medium text-xs">{selectedPrimary.startTime} - {selectedPrimary.endTime}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Turnout Stats */}
                {selectedPrimary.status !== 'scheduled' && (
                  <Card>
                    <CardHeader className="pb-2 pt-3 px-4">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        Voter Turnout
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Votes Cast</span>
                          <span className="font-bold">{selectedPrimary.totalVotesCast.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Eligible Voters</span>
                          <span className="font-medium">{selectedPrimary.totalEligibleVoters.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(selectedPrimary.totalVotesCast / selectedPrimary.totalEligibleVoters) * 100} 
                          className="h-2"
                        />
                        <p className="text-center text-sm font-bold text-primary">
                          {Math.round((selectedPrimary.totalVotesCast / selectedPrimary.totalEligibleVoters) * 100)}% Turnout
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Advancement Rules Info */}
                {selectedPrimary.candidates.length > 0 && (
                  <Card className="bg-blue-500/5 border-blue-500/20">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                        <div className="text-xs space-y-1">
                          <p className="font-medium text-blue-700 dark:text-blue-400">Advancement Rules</p>
                          <ul className="text-muted-foreground space-y-0.5">
                            <li className="flex items-center gap-1.5">
                              <Star className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                              <span>≥25% votes = Auto-qualifies</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <Trophy className="h-3 w-3 text-amber-500" />
                              <span>Top votes fill remaining slots</span>
                            </li>
                            <li>• Maximum 4 candidates advance</li>
                            <li>• Minimum 2 candidates required</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Candidates Results */}
                {selectedPrimary.candidates.length > 0 && (() => {
                  const config = {
                    autoQualifyThreshold: mockElectionProcessSettings.primaryAdvancementThreshold,
                    minimumAdvancing: mockElectionProcessSettings.primaryAdvancementMinimum,
                    maximumAdvancing: mockElectionProcessSettings.primaryAdvancementMaximum,
                  };
                  const advancementResult = calculateAdvancingCandidates(selectedPrimary.candidates, config);
                  
                  return (
                    <Card>
                      <CardHeader className="pb-2 pt-3 px-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            Candidates Results
                          </CardTitle>
                          <Badge variant="secondary" className="text-[10px]">
                            {advancementResult.totalAdvancing} advancing
                          </Badge>
                        </div>
                        {advancementResult.autoQualifiedCount > 0 && (
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {advancementResult.autoQualifiedCount} auto-qualified (≥25%)
                            {advancementResult.topVoteFilledCount > 0 && 
                              ` • ${advancementResult.topVoteFilledCount} by top votes`
                            }
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="space-y-3">
                          {selectedPrimary.candidates.map((candidate, idx) => {
                            const reason = advancementResult.advancementReasons.get(candidate.id);
                            const isAutoQualified = reason === 'auto_qualified';
                            const isTopVotes = reason === 'top_votes';
                            const advances = isAutoQualified || isTopVotes;
                            
                            return (
                              <div 
                                key={candidate.id}
                                className={cn(
                                  "p-3 rounded-lg border",
                                  isAutoQualified 
                                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" 
                                    : isTopVotes
                                    ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                                    : "bg-muted/30 border-transparent"
                                )}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-sm font-bold text-muted-foreground w-5">
                                    {idx + 1}.
                                  </span>
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage src={candidate.avatar} />
                                    <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{candidate.name}</p>
                                    {isAutoQualified && (
                                      <Badge className="bg-emerald-500 text-white text-[10px] mt-0.5">
                                        <Star className="h-2.5 w-2.5 mr-1 fill-white" />
                                        Auto-Qualified ({candidate.percentage}%)
                                      </Badge>
                                    )}
                                    {isTopVotes && (
                                      <Badge className="bg-amber-500 text-white text-[10px] mt-0.5">
                                        <Trophy className="h-2.5 w-2.5 mr-1" />
                                        Advances (Top Votes)
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-8">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-muted-foreground">{candidate.votes.toLocaleString()} votes</span>
                                    <span className="font-bold">{candidate.percentage}%</span>
                                  </div>
                                  {/* Progress bar with 25% threshold marker */}
                                  <div className="relative">
                                    <Progress 
                                      value={candidate.percentage} 
                                      className={cn(
                                        "h-2",
                                        isAutoQualified && "[&>div]:bg-emerald-500",
                                        isTopVotes && "[&>div]:bg-amber-500"
                                      )}
                                    />
                                    {/* 25% threshold line */}
                                    <div 
                                      className="absolute top-0 bottom-0 w-0.5 bg-red-500/60"
                                      style={{ left: '25%' }}
                                    />
                                  </div>
                                  <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                                    <span></span>
                                    <span className="text-red-500/80">25% threshold ↑</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}

                {/* Actions */}
                {selectedPrimary.status === 'scheduled' && (
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleStartPrimary(selectedPrimary)}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start Election
                    </Button>
                  </div>
                )}

                {selectedPrimary.status === 'ongoing' && (
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline"
                      className="flex-1"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                    <Button 
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={() => handleEndPrimary(selectedPrimary)}
                    >
                      <PauseCircle className="h-4 w-4 mr-2" />
                      End Election
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
