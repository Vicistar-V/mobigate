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
  Megaphone,
  AlertCircle,
  Activity,
  Timer,
  Flag,
  ListChecks
} from "lucide-react";
import { ModuleAuthorizationDrawer } from "../authorization/ModuleAuthorizationDrawer";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  mockMainElection, 
  mockMainElectionOffices,
  getMainElectionStats 
} from "@/data/electionProcessesData";
import { MainElection, MainElectionOffice, MainElectionPhase } from "@/types/electionProcesses";
import { cn } from "@/lib/utils";
import { CandidateVotersListSheet } from "./CandidateVotersListSheet";

const getPhaseStatusColor = (status: MainElectionPhase['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500';
    case 'active':
      return 'bg-blue-500 animate-pulse';
    case 'pending':
      return 'bg-gray-300 dark:bg-gray-600';
    default:
      return 'bg-gray-300';
  }
};

const getOfficeStatusBadge = (status: MainElectionOffice['status']) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-emerald-500 text-white text-[10px]">Completed</Badge>;
    case 'voting':
      return <Badge className="bg-blue-500 text-white text-[10px] animate-pulse">Voting</Badge>;
    case 'pending':
      return <Badge className="bg-gray-500 text-white text-[10px]">Pending</Badge>;
    default:
      return null;
  }
};

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}

const StatCard = ({ icon, value, label, color }: StatCardProps) => (
  <div className={cn("flex flex-col items-center justify-center p-2.5 rounded-lg", color)}>
    <div className="flex items-center gap-1">
      {icon}
      <span className="text-lg font-bold">{value}</span>
    </div>
    <span className="text-[10px] text-muted-foreground text-center">{label}</span>
  </div>
);

export function AdminMainElectionSection() {
  const { toast } = useToast();
  const [selectedOffice, setSelectedOffice] = useState<MainElectionOffice | null>(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [showAnnounceDialog, setShowAnnounceDialog] = useState(false);
  
  // Authorization state for individual office announcements
  const [showAuthDrawer, setShowAuthDrawer] = useState(false);
  const [officeToAnnounce, setOfficeToAnnounce] = useState<MainElectionOffice | null>(null);
  
  // Voters List Sheet state
  const [votersListOpen, setVotersListOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<{
    id: string;
    name: string;
    avatar: string;
    votes: number;
    isWinner: boolean;
    officeName: string;
  } | null>(null);

  const openVotersList = (candidate: typeof selectedCandidate, officeName: string) => {
    if (candidate) {
      setSelectedCandidate({ ...candidate, officeName });
      setVotersListOpen(true);
    }
  };

  const stats = getMainElectionStats();
  const election = mockMainElection;

  const handleStartVoting = (office: MainElectionOffice) => {
    toast({
      title: "Voting Started",
      description: `Voting for ${office.officeName} is now open`,
    });
  };

  const handleEndVoting = (office: MainElectionOffice) => {
    toast({
      title: "Voting Ended",
      description: `Voting for ${office.officeName} has been closed`,
    });
  };

  const handleAnnounceResults = () => {
    toast({
      title: "Results Announced",
      description: "Election results have been published to all members",
    });
    setShowAnnounceDialog(false);
  };

  const handleAnnounceOfficeResult = (office: MainElectionOffice) => {
    setOfficeToAnnounce(office);
    setShowDetailSheet(false); // Close detail sheet to prevent modal stacking
    setTimeout(() => {
      setShowAuthDrawer(true);
    }, 150); // Slight delay for smooth transition
  };

  const handleAuthComplete = () => {
    if (officeToAnnounce) {
      toast({
        title: "Result Announced",
        description: `Election result for ${officeToAnnounce.officeName} has been published`,
      });
    }
    setOfficeToAnnounce(null);
    setShowAuthDrawer(false);
  };

  const openOfficeDetail = (office: MainElectionOffice) => {
    setSelectedOffice(office);
    setShowDetailSheet(true);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Election Header Card */}
      <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg">{election.name}</h3>
              <p className="text-sm opacity-90 flex items-center gap-1 mt-0.5">
                <Calendar className="h-3.5 w-3.5" />
                {format(election.scheduledDate, "MMMM d, yyyy")}
              </p>
            </div>
            <Badge className="bg-white/20 text-white border-0">
              <Activity className="h-3 w-3 mr-1" />
              {election.status === 'ongoing' ? 'Active' : election.status}
            </Badge>
          </div>

          {/* Phase Timeline */}
          <div className="flex items-center gap-1 mb-4">
            {election.phases.map((phase, idx) => (
              <div key={phase.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={cn("w-full h-1.5 rounded-full", getPhaseStatusColor(phase.status))} />
                  <span className="text-[9px] mt-1 opacity-80">{phase.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-xl font-bold">{stats.turnout}%</p>
              <p className="text-[10px] opacity-80">Turnout</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-xl font-bold">{stats.totalVotes}</p>
              <p className="text-[10px] opacity-80">Votes Cast</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-xl font-bold">{stats.totalAccredited}</p>
              <p className="text-[10px] opacity-80">Accredited</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard 
          icon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />} 
          value={stats.completedOffices} 
          label="Completed" 
          color="bg-emerald-500/10" 
        />
        <StatCard 
          icon={<Vote className="h-3.5 w-3.5 text-blue-600" />} 
          value={stats.votingOffices} 
          label="Voting" 
          color="bg-blue-500/10" 
        />
        <StatCard 
          icon={<Clock className="h-3.5 w-3.5 text-gray-600" />} 
          value={stats.pendingOffices} 
          label="Pending" 
          color="bg-gray-500/10" 
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 gap-2">
          <Settings className="h-4 w-4" />
          Manage
        </Button>
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
          onClick={() => setShowAnnounceDialog(true)}
        >
          <Megaphone className="h-4 w-4" />
          Announce All
        </Button>
      </div>

      {/* Offices List */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Flag className="h-4 w-4 text-primary" />
          Election Offices ({mockMainElectionOffices.length})
        </h4>
        
        {mockMainElectionOffices.map((office) => (
          <Card 
            key={office.id} 
            className={cn(
              "overflow-hidden cursor-pointer active:scale-[0.99] transition-transform",
              office.status === 'voting' && "border-blue-300 dark:border-blue-700"
            )}
            onClick={() => openOfficeDetail(office)}
          >
            <CardContent className="p-3">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm">{office.officeName}</h4>
                {getOfficeStatusBadge(office.status)}
              </div>

              {/* Winner or Leading */}
              {office.status === 'completed' && office.winner && (
                <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg mb-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    Winner: {office.winner}
                  </span>
                </div>
              )}

              {/* Candidates Preview */}
              {office.candidates.length > 0 && office.status !== 'pending' && (
                <div className="space-y-1.5">
                  {office.candidates.slice(0, 2).map((candidate, idx) => (
                    <div 
                      key={candidate.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground w-4">
                          {idx + 1}.
                        </span>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback className="text-[10px]">{candidate.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium truncate max-w-[100px]">
                          {candidate.name.split(' ').slice(0, 2).join(' ')}
                        </span>
                        {candidate.isWinner && (
                          <Trophy className="h-3 w-3 text-amber-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={candidate.percentage} 
                          className="w-16 h-1.5"
                        />
                        <span className="text-xs font-bold w-10 text-right">{candidate.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {office.status === 'pending' && (
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
                  <Timer className="h-4 w-4" />
                  Voting not yet started
                </div>
              )}

              {/* Stats Footer */}
              {office.status !== 'pending' && (
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
                  <span>{office.totalVotes.toLocaleString()} votes cast</span>
                  <span className="flex items-center gap-1">
                    View Details <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Office Detail Sheet */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              {selectedOffice?.officeName}
            </SheetTitle>
          </SheetHeader>

          {selectedOffice && (
            <ScrollArea className="h-[calc(90vh-120px)]">
              <div className="space-y-4 px-1">
                {/* Status Card */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-base">{selectedOffice.officeName}</h3>
                        <p className="text-sm text-muted-foreground">Main Election</p>
                      </div>
                      {getOfficeStatusBadge(selectedOffice.status)}
                    </div>

                    {selectedOffice.votingStartTime && (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-muted/50 rounded-lg">
                          <p className="text-[10px] text-muted-foreground">Start Time</p>
                          <p className="font-medium text-xs">
                            {format(selectedOffice.votingStartTime, "h:mm a")}
                          </p>
                        </div>
                        {selectedOffice.votingEndTime && (
                          <div className="p-2 bg-muted/50 rounded-lg">
                            <p className="text-[10px] text-muted-foreground">End Time</p>
                            <p className="font-medium text-xs">
                              {format(selectedOffice.votingEndTime, "h:mm a")}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Winner Announcement */}
                {selectedOffice.status === 'completed' && selectedOffice.winner && (
                  <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Winner</p>
                          <p className="font-bold text-base">{selectedOffice.winner}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Vote Stats */}
                <Card>
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Voting Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold text-primary">{selectedOffice.totalVotes.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Votes Cast</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Candidates Full Results */}
                <Card>
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Candidates Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-3">
                      {selectedOffice.candidates.map((candidate, idx) => (
                        <div 
                          key={candidate.id}
                          className={cn(
                            "p-3 rounded-lg border",
                            candidate.isWinner 
                              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" 
                              : "bg-muted/30 border-transparent"
                          )}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-bold text-muted-foreground w-5">
                              {idx + 1}.
                            </span>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm">{candidate.name}</p>
                              {candidate.isWinner && (
                                <Badge className="bg-emerald-500 text-white text-[10px] mt-0.5">
                                  <Trophy className="h-2.5 w-2.5 mr-1" />
                                  Winner
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="ml-8">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">{candidate.votes.toLocaleString()} votes</span>
                              <span className="font-bold">{candidate.percentage}%</span>
                            </div>
                            <Progress 
                              value={candidate.percentage} 
                              className={cn(
                                "h-2",
                                candidate.isWinner && "[&>div]:bg-emerald-500"
                              )}
                            />
                            
                            {/* Voters List Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-2 h-7 text-xs gap-1.5"
                              onClick={() => openVotersList({
                                id: candidate.id,
                                name: candidate.name,
                                avatar: candidate.avatar,
                                votes: candidate.votes,
                                isWinner: candidate.isWinner,
                                officeName: selectedOffice.officeName
                              }, selectedOffice.officeName)}
                            >
                              <ListChecks className="h-3.5 w-3.5" />
                              Voters List
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                {selectedOffice.status === 'pending' && (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleStartVoting(selectedOffice)}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Voting
                  </Button>
                )}

                {selectedOffice.status === 'voting' && (
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => handleEndVoting(selectedOffice)}
                  >
                    <PauseCircle className="h-4 w-4 mr-2" />
                    End Voting
                  </Button>
                )}

                {selectedOffice.status === 'completed' && (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleAnnounceOfficeResult(selectedOffice)}
                  >
                    <Megaphone className="h-4 w-4 mr-2" />
                    Announce Result
                  </Button>
                )}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>

      {/* Announce All Dialog */}
      <AlertDialog open={showAnnounceDialog} onOpenChange={setShowAnnounceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Announce All Results
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will publish all completed election results to the community. 
              Members will be notified immediately. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleAnnounceResults}
            >
              Announce Results
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Candidate Voters List Sheet */}
      {selectedCandidate && (
        <CandidateVotersListSheet
          open={votersListOpen}
          onOpenChange={setVotersListOpen}
          candidateId={selectedCandidate.id}
          candidateName={selectedCandidate.name}
          candidateAvatar={selectedCandidate.avatar}
          voteCount={selectedCandidate.votes}
          officeName={selectedCandidate.officeName}
          isWinner={selectedCandidate.isWinner}
        />
      )}

      {/* Office Result Authorization Drawer */}
      <ModuleAuthorizationDrawer
        open={showAuthDrawer}
        onOpenChange={setShowAuthDrawer}
        module="elections"
        actionTitle="Announce Election Result"
        actionDescription="Multi-signature authorization required to publish election result"
        actionDetails={
          officeToAnnounce && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">{officeToAnnounce.officeName}</p>
                  <p className="text-xs text-muted-foreground">
                    Winner: {officeToAnnounce.winner || "To be announced"}
                  </p>
                </div>
              </div>
            </div>
          )
        }
        initiatorRole="secretary"
        onAuthorized={handleAuthComplete}
      />
    </div>
  );
}
