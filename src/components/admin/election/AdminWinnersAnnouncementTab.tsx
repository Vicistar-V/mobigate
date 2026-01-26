import { useState } from "react";
import { Trophy, Crown, Megaphone, Calendar, Users, CheckCircle, Clock, FileText, Shield, Eye, EyeOff, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { mockCurrentElection, mockWinnerResults, ElectionWinnerResult } from "@/data/adminElectionData";
import { useToast } from "@/hooks/use-toast";
import { WinnerAnnouncementDialog } from "./WinnerAnnouncementDialog";
import { CertificateOfReturnGenerator } from "./CertificateOfReturnGenerator";
import { format } from "date-fns";

interface StatCardProps {
  value: string | number;
  label: string;
  icon: React.ElementType;
}

const StatCard = ({ value, label, icon: Icon }: StatCardProps) => (
  <div className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg bg-muted/50 min-w-0">
    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground mb-0.5" />
    <span className="text-sm sm:text-lg font-bold">{value}</span>
    <span className="text-[9px] sm:text-[10px] text-muted-foreground text-center truncate max-w-full">{label}</span>
  </div>
);

export function AdminWinnersAnnouncementTab() {
  const { toast } = useToast();
  const [results, setResults] = useState<ElectionWinnerResult[]>(mockWinnerResults);
  const [selectedResult, setSelectedResult] = useState<ElectionWinnerResult | null>(null);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [showCertificateGenerator, setShowCertificateGenerator] = useState(false);
  
  // Voter transparency settings
  const [voterTransparency, setVoterTransparency] = useState<'anonymous' | 'identified'>('anonymous');
  const [showAntiIntimidationNotice, setShowAntiIntimidationNotice] = useState(true);

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
    <div className="space-y-3 sm:space-y-4 pb-20 overflow-hidden">
      {/* Current Election Info */}
      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20 overflow-hidden">
        <CardHeader className="pb-2 px-3 sm:px-4 pt-3">
          <CardTitle className="text-sm sm:text-lg flex items-center gap-2">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0" />
            <span className="truncate">{election.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
            <StatCard value={format(election.date, "MMM d")} label="Date" icon={Calendar} />
            <StatCard value={election.totalVotesCast.toLocaleString()} label="Votes" icon={CheckCircle} />
            <StatCard value={election.totalAccredited.toLocaleString()} label="Accredited" icon={Users} />
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="flex justify-between text-xs sm:text-sm mb-1">
              <span>Voter Turnout</span>
              <span className="font-medium">{Math.round((election.totalVotesCast / election.totalAccredited) * 100)}%</span>
            </div>
            <Progress value={(election.totalVotesCast / election.totalAccredited) * 100} className="h-1.5 sm:h-2" />
          </div>
          <Badge className={`mt-2.5 sm:mt-3 text-[10px] sm:text-xs ${
            election.status === 'active' ? 'bg-green-500/10 text-green-600' :
            election.status === 'voting_completed' ? 'bg-blue-500/10 text-blue-600' :
            'bg-gray-500/10 text-gray-600'
          }`}>
            {election.status.replace('_', ' ')}
          </Badge>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        <Button
          size="sm"
          onClick={handleAnnounceAll}
          disabled={pendingCount === 0}
          className="gap-1.5 bg-green-600 hover:bg-green-700 text-xs h-8"
        >
          <Megaphone className="h-3.5 w-3.5" />
          Announce All ({pendingCount})
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1.5 text-xs h-8"
          onClick={() => setShowCertificateGenerator(true)}
        >
          <Award className="h-3.5 w-3.5" />
          Certificates
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
          <FileText className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Generate</span> Report
        </Button>
      </div>

      {/* Voter Transparency Settings */}
      <Card className="bg-muted/30">
        <CardContent className="p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm">Voter Transparency Settings</h4>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {voterTransparency === 'anonymous' ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <Label className="text-sm">Display Voter Identity</Label>
                <p className="text-xs text-muted-foreground">
                  {voterTransparency === 'anonymous' 
                    ? 'Show accreditation numbers only'
                    : 'Show voter names publicly'}
                </p>
              </div>
            </div>
            <Switch
              checked={voterTransparency === 'identified'}
              onCheckedChange={(checked) => {
                setVoterTransparency(checked ? 'identified' : 'anonymous');
                toast({
                  title: checked ? "Voters Identified" : "Voters Anonymous",
                  description: checked 
                    ? "Voter names will be displayed publicly"
                    : "Only accreditation numbers will be shown"
                });
              }}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Anti-Intimidation Notice</Label>
              <p className="text-xs text-muted-foreground">
                Display notice warning against voter intimidation
              </p>
            </div>
            <Switch
              checked={showAntiIntimidationNotice}
              onCheckedChange={setShowAntiIntimidationNotice}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
        <span className="flex items-center gap-1 text-green-600">
          <CheckCircle className="h-3.5 w-3.5" />
          {announcedCount} Announced
        </span>
        <span className="flex items-center gap-1 text-amber-600">
          <Clock className="h-3.5 w-3.5" />
          {pendingCount} Pending
        </span>
      </div>

      {/* Office Results */}
      <div className="space-y-3 sm:space-y-4">
        {results.map((result) => {
          const winner = result.candidates.find(c => c.isWinner);
          
          return (
            <Card key={result.id} className={`overflow-hidden ${result.announced ? 'border-green-500/30 bg-green-500/5' : ''}`}>
              <CardHeader className="pb-2 pt-2.5 sm:pt-3 px-3 sm:px-4">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 min-w-0">
                    {result.announced && <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0" />}
                    <span className="truncate">{result.officeName}</span>
                  </CardTitle>
                  <Badge className={`text-[9px] sm:text-[10px] shrink-0 ${
                    result.announced 
                      ? 'bg-green-500 text-white' 
                      : 'bg-amber-500/20 text-amber-600'
                  }`}>
                    {result.announced ? 'Announced' : 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                {/* Candidates with Votes */}
                <div className="space-y-1.5 sm:space-y-2">
                  {result.candidates.map((candidate, index) => (
                    <div 
                      key={candidate.id}
                      className={`flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg ${
                        candidate.isWinner ? 'bg-green-500/10 border border-green-500/20' : 'bg-muted/50'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold text-muted-foreground w-4 shrink-0">
                        {index + 1}.
                      </span>
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                        <AvatarFallback className="text-xs">{candidate.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="font-medium text-xs sm:text-sm truncate">{candidate.name}</span>
                          {candidate.isWinner && (
                            <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Progress value={candidate.percentage} className="h-1 sm:h-1.5 flex-1" />
                          <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0 tabular-nums">
                            {candidate.votes} ({candidate.percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Announcement Info or Actions */}
                <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t">
                  {result.announced ? (
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {result.announcedAt && format(result.announcedAt, "MMM d, h:mm a")}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 sm:h-7 text-[10px] sm:text-xs text-red-600 shrink-0"
                        onClick={() => handleRevokeAnnouncement(result.id)}
                      >
                        Revoke
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full gap-1.5 bg-green-600 hover:bg-green-700 h-8 text-xs"
                      onClick={() => handleAnnounce(result)}
                    >
                      <Megaphone className="h-3.5 w-3.5" />
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

      <CertificateOfReturnGenerator
        open={showCertificateGenerator}
        onOpenChange={setShowCertificateGenerator}
      />
    </div>
  );
}
