import { useState } from "react";
import { Trophy, Crown, Megaphone, Calendar, Users, CheckCircle, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { mockCurrentElection, mockWinnerResults, ElectionWinnerResult } from "@/data/adminElectionData";
import { useToast } from "@/hooks/use-toast";
import { WinnerAnnouncementDialog } from "./WinnerAnnouncementDialog";
import { format } from "date-fns";

interface StatBadgeProps {
  value: string | number;
  label: string;
  icon: React.ElementType;
}

const StatBadge = ({ value, label, icon: Icon }: StatBadgeProps) => (
  <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
    <Icon className="h-4 w-4 text-muted-foreground mb-1" />
    <span className="text-lg font-bold">{value}</span>
    <span className="text-[10px] text-muted-foreground text-center">{label}</span>
  </div>
);

export function AdminWinnersAnnouncementTab() {
  const { toast } = useToast();
  const [results, setResults] = useState<ElectionWinnerResult[]>(mockWinnerResults);
  const [selectedResult, setSelectedResult] = useState<ElectionWinnerResult | null>(null);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);

  const election = mockCurrentElection;
  const announcedCount = results.filter(r => r.announced).length;
  const pendingCount = results.filter(r => !r.announced).length;

  const handleAnnounce = (result: ElectionWinnerResult) => {
    setSelectedResult(result);
    setShowAnnouncementDialog(true);
  };

  const handleConfirmAnnouncement = (resultId: string, options: { notify: boolean; updateLeadership: boolean; message: string }) => {
    setResults(prev => prev.map(r => 
      r.id === resultId ? { ...r, announced: true, announcedAt: new Date(), announcedBy: 'Admin' } : r
    ));
    toast({
      title: "Winner Announced!",
      description: `The winner for ${results.find(r => r.id === resultId)?.officeName} has been officially announced`
    });
    setShowAnnouncementDialog(false);
  };

  const handleRevokeAnnouncement = (resultId: string) => {
    setResults(prev => prev.map(r => 
      r.id === resultId ? { ...r, announced: false, announcedAt: undefined, announcedBy: undefined } : r
    ));
    toast({
      title: "Announcement Revoked",
      description: "The winner announcement has been revoked",
      variant: "destructive"
    });
  };

  const handleAnnounceAll = () => {
    setResults(prev => prev.map(r => ({ ...r, announced: true, announcedAt: new Date(), announcedBy: 'Admin' })));
    toast({
      title: "All Winners Announced!",
      description: "All election winners have been officially announced"
    });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Current Election Info */}
      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-600" />
            {election.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <StatBadge value={format(election.date, "MMM d")} label="Election Date" icon={Calendar} />
            <StatBadge value={election.totalVotesCast.toLocaleString()} label="Votes Cast" icon={CheckCircle} />
            <StatBadge value={election.totalAccredited.toLocaleString()} label="Accredited" icon={Users} />
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Voter Turnout</span>
              <span className="font-medium">{Math.round((election.totalVotesCast / election.totalAccredited) * 100)}%</span>
            </div>
            <Progress value={(election.totalVotesCast / election.totalAccredited) * 100} className="h-2" />
          </div>
          <Badge className={`mt-3 ${
            election.status === 'active' ? 'bg-green-500/10 text-green-600' :
            election.status === 'voting_completed' ? 'bg-blue-500/10 text-blue-600' :
            'bg-gray-500/10 text-gray-600'
          }`}>
            {election.status.replace('_', ' ')}
          </Badge>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleAnnounceAll}
          disabled={pendingCount === 0}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          <Megaphone className="h-4 w-4" />
          Announce All ({pendingCount})
        </Button>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5 text-green-600">
          <CheckCircle className="h-4 w-4" />
          {announcedCount} Announced
        </span>
        <span className="flex items-center gap-1.5 text-amber-600">
          <Clock className="h-4 w-4" />
          {pendingCount} Pending
        </span>
      </div>

      {/* Office Results */}
      <div className="space-y-4">
        {results.map((result) => {
          const winner = result.candidates.find(c => c.isWinner);
          
          return (
            <Card key={result.id} className={result.announced ? 'border-green-500/30 bg-green-500/5' : ''}>
              <CardHeader className="pb-2 pt-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {result.announced && <Crown className="h-4 w-4 text-amber-500" />}
                    {result.officeName}
                  </CardTitle>
                  {result.announced ? (
                    <Badge className="bg-green-500/10 text-green-600 text-[10px]">
                      Announced
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/10 text-amber-600 text-[10px]">
                      Not Announced
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {/* Candidates with Votes */}
                <div className="space-y-2">
                  {result.candidates.map((candidate, index) => (
                    <div 
                      key={candidate.id}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        candidate.isWinner ? 'bg-green-500/10 border border-green-500/20' : 'bg-muted/50'
                      }`}
                    >
                      <span className="text-sm font-bold text-muted-foreground w-5">
                        {index + 1}.
                      </span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                        <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{candidate.name}</span>
                          {candidate.isWinner && (
                            <Crown className="h-4 w-4 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Progress value={candidate.percentage} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground shrink-0">
                            {candidate.votes} ({candidate.percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Announcement Info or Actions */}
                <div className="mt-3 pt-3 border-t">
                  {result.announced ? (
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Announced {result.announcedAt && format(result.announcedAt, "MMM d 'at' h:mm a")}
                        {result.announcedBy && ` by ${result.announcedBy}`}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs text-red-600"
                        onClick={() => handleRevokeAnnouncement(result.id)}
                      >
                        Revoke
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => handleAnnounce(result)}
                    >
                      <Megaphone className="h-4 w-4" />
                      Announce {winner?.name.split(' ')[0]} as Winner
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <WinnerAnnouncementDialog
        open={showAnnouncementDialog}
        onOpenChange={setShowAnnouncementDialog}
        result={selectedResult}
        onConfirm={handleConfirmAnnouncement}
      />
    </div>
  );
}
