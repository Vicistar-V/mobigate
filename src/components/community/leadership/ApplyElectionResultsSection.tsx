import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { mockElectionWinners } from "@/data/leadershipChangeHistory";
import { Trophy, ArrowRight, CheckCircle2, AlertCircle, Shield, Crown } from "lucide-react";
import { ModuleAuthorizationDrawer } from "@/components/admin/authorization/ModuleAuthorizationDrawer";

export function ApplyElectionResultsSection() {
  const { toast } = useToast();
  const [winners, setWinners] = useState(mockElectionWinners);
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);

  // Authorization state
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "single" | "batch";
    winnerId?: string;
    winnerIds?: string[];
  } | null>(null);

  const pendingWinners = winners.filter(w => !w.applied);
  const appliedWinners = winners.filter(w => w.applied);

  const toggleSelection = (winnerId: string) => {
    setSelectedWinners(prev => 
      prev.includes(winnerId) 
        ? prev.filter(id => id !== winnerId)
        : [...prev, winnerId]
    );
  };

  const handleApplySingle = (winnerId: string) => {
    // Open auth drawer instead of directly applying
    setPendingAction({ type: "single", winnerId });
    setAuthDrawerOpen(true);
  };

  const handleApplySelected = () => {
    if (selectedWinners.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one position to apply",
        variant: "destructive",
      });
      return;
    }
    // Open auth drawer for batch action
    setPendingAction({ type: "batch", winnerIds: selectedWinners });
    setAuthDrawerOpen(true);
  };

  const handleAuthorizationComplete = () => {
    if (!pendingAction) return;

    if (pendingAction.type === "single" && pendingAction.winnerId) {
      const winner = winners.find(w => w.id === pendingAction.winnerId);
      setWinners(prev => prev.map(w => 
        w.id === pendingAction.winnerId ? { ...w, applied: true } : w
      ));
      setSelectedWinners(prev => prev.filter(id => id !== pendingAction.winnerId));
      toast({
        title: "Leadership Updated",
        description: `${winner?.winnerName} is now the ${winner?.position}`,
      });
    } else if (pendingAction.type === "batch" && pendingAction.winnerIds) {
      setWinners(prev => prev.map(w => 
        pendingAction.winnerIds!.includes(w.id) ? { ...w, applied: true } : w
      ));
      setSelectedWinners([]);
      toast({
        title: "Leadership Updated",
        description: `${pendingAction.winnerIds.length} position(s) have been updated`,
      });
    }

    setPendingAction(null);
  };

  const getAuthActionDetails = () => {
    if (!pendingAction) return null;

    if (pendingAction.type === "single" && pendingAction.winnerId) {
      const winner = winners.find(w => w.id === pendingAction.winnerId);
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <Crown className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm">{winner?.position}</p>
              <p className="text-xs text-muted-foreground">Leadership Change</p>
            </div>
          </div>
          <div className="p-2.5 bg-muted/50 rounded-lg text-sm space-y-1">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground shrink-0">Current:</span>
              <span className="text-right">{winner?.currentHolderName || "Vacant"}</span>
            </div>
            <div className="flex justify-between gap-2 font-medium text-primary">
              <span className="text-muted-foreground shrink-0">New:</span>
              <span className="text-right">{winner?.winnerName}</span>
            </div>
          </div>
        </div>
      );
    }

    // Batch action
    const selectedCount = pendingAction.winnerIds?.length || 0;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10">
            <Crown className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm">Apply {selectedCount} Leadership Changes</p>
            <p className="text-xs text-muted-foreground">Batch Update from Election Results</p>
          </div>
        </div>
        <div className="p-2.5 bg-muted/50 rounded-lg text-xs space-y-1">
          {pendingAction.winnerIds?.slice(0, 3).map(id => {
            const winner = winners.find(w => w.id === id);
            return (
              <div key={id} className="flex justify-between gap-2">
                <span className="text-muted-foreground truncate">{winner?.position}:</span>
                <span className="font-medium truncate">{winner?.winnerName}</span>
              </div>
            );
          })}
          {selectedCount > 3 && (
            <p className="text-muted-foreground">+{selectedCount - 3} more...</p>
          )}
        </div>
      </div>
    );
  };

  const selectAll = () => {
    setSelectedWinners(pendingWinners.map(w => w.id));
  };

  if (pendingWinners.length === 0 && appliedWinners.length === 0) {
    return (
      <div className="py-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-base text-muted-foreground">No election results available</p>
        <p className="text-sm text-muted-foreground mt-1">
          Election results will appear here after winners are announced
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Authorization Drawer */}
      <ModuleAuthorizationDrawer
        open={authDrawerOpen}
        onOpenChange={setAuthDrawerOpen}
        module="leadership"
        actionTitle={
          pendingAction?.type === "single"
            ? "Apply Leadership Change"
            : `Apply ${pendingAction?.winnerIds?.length || 0} Changes`
        }
        actionDescription="Multi-signature authorization required: President + Secretary + (PRO or Director of Socials)"
        actionDetails={getAuthActionDetails()}
        initiatorRole="secretary"
        onAuthorized={handleAuthorizationComplete}
      />

      <div className="space-y-4 pb-4">
        {/* Election Header Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base leading-tight">2024 General Elections</h3>
                <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-600 border-green-200 text-sm">
                  Winners Announced
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {pendingWinners.length} position(s) pending, {appliedWinners.length} applied
            </p>
          </CardContent>
        </Card>

        {/* Pending Changes Section */}
        {pendingWinners.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-semibold">Pending Changes</h3>
              <Button variant="ghost" size="sm" onClick={selectAll} className="text-sm h-9">
                Select All
              </Button>
            </div>

            <div className="space-y-3">
              {pendingWinners.map((winner) => (
                <Card key={winner.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    {/* Position Title Row */}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedWinners.includes(winner.id)}
                        onCheckedChange={() => toggleSelection(winner.id)}
                        className="mt-1 h-5 w-5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
                          <h4 className="font-semibold text-base leading-tight">{winner.position}</h4>
                        </div>
                      </div>
                    </div>
                    
                    {/* Current Holder */}
                    <div className="mt-4 ml-8">
                      <p className="text-sm text-muted-foreground">Current Holder</p>
                      <p className="text-base font-medium mt-0.5">{winner.currentHolderName || "Vacant"}</p>
                    </div>
                    
                    {/* Winner Info */}
                    <div className="mt-3 ml-8 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="h-4 w-4 text-green-600 shrink-0" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">New Winner</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={winner.winnerImage} />
                          <AvatarFallback className="text-sm">{winner.winnerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-base text-primary leading-tight">{winner.winnerName}</p>
                        </div>
                        <Badge variant="secondary" className="text-sm shrink-0">
                          {winner.votePercentage}%
                        </Badge>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <Button 
                      size="sm" 
                      onClick={() => handleApplySingle(winner.id)}
                      className="w-full mt-4 h-10 text-sm"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Apply Change
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bulk Apply Button */}
            {selectedWinners.length > 0 && (
              <Button onClick={handleApplySelected} className="w-full h-11 text-base">
                <Shield className="h-4 w-4 mr-2" />
                Apply {selectedWinners.length} Selected
              </Button>
            )}
          </div>
        )}

        {/* Applied Changes Section */}
        {appliedWinners.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-medium text-muted-foreground px-1">Applied Changes</h3>
            <div className="space-y-2">
              {appliedWinners.map((winner) => (
                <Card key={winner.id} className="overflow-hidden bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-base">{winner.position}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{winner.winnerName}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Authorization Info */}
        <div className="flex items-start gap-2 pt-3 border-t">
          <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Leadership changes require multi-signature approval: President + Secretary + (PRO or Director of Socials).
            If President/Secretary unavailable, 4 signatories including Legal Adviser required.
          </p>
        </div>
      </div>
    </>
  );
}
