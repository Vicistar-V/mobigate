import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { mockElectionWinners } from "@/data/leadershipChangeHistory";
import { Trophy, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export function ApplyElectionResultsSection() {
  const { toast } = useToast();
  const [winners, setWinners] = useState(mockElectionWinners);
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);

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
    setWinners(prev => prev.map(w => 
      w.id === winnerId ? { ...w, applied: true } : w
    ));
    setSelectedWinners(prev => prev.filter(id => id !== winnerId));
    toast({
      title: "Leadership Updated",
      description: "Position has been updated successfully",
    });
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

    setWinners(prev => prev.map(w => 
      selectedWinners.includes(w.id) ? { ...w, applied: true } : w
    ));
    setSelectedWinners([]);
    toast({
      title: "Leadership Updated",
      description: `${selectedWinners.length} position(s) have been updated`,
    });
  };

  const selectAll = () => {
    setSelectedWinners(pendingWinners.map(w => w.id));
  };

  if (pendingWinners.length === 0 && appliedWinners.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No election results available</p>
          <p className="text-sm text-muted-foreground mt-1">
            Election results will appear here after winners are announced
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Election Header Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base">2024 General Elections</h3>
              <Badge variant="outline" className="mt-1.5 bg-green-500/10 text-green-600 border-green-200">
                Winners Announced
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {pendingWinners.length} position(s) pending, {appliedWinners.length} applied
          </p>
        </CardContent>
      </Card>

      {/* Pending Changes */}
      {pendingWinners.length > 0 && (
        <Card>
          <CardHeader className="pb-2 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Pending Changes</CardTitle>
              <Button variant="ghost" size="sm" onClick={selectAll} className="text-sm">
                Select All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-4">
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-3">
                {pendingWinners.map((winner) => (
                  <div 
                    key={winner.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    {/* Header Row - Checkbox + Position */}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedWinners.includes(winner.id)}
                        onCheckedChange={() => toggleSelection(winner.id)}
                        className="mt-0.5"
                      />
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
                        <span className="font-semibold text-base">{winner.position}</span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleApplySingle(winner.id)}
                        className="ml-auto shrink-0 h-8"
                      >
                        Apply
                      </Button>
                    </div>
                    
                    {/* Current Holder */}
                    <div className="mt-3 ml-7">
                      <span className="text-sm text-muted-foreground">Current:</span>
                      <p className="text-sm font-medium mt-0.5">{winner.currentHolderName || "Vacant"}</p>
                    </div>
                    
                    {/* Winner Info */}
                    <div className="flex items-center gap-2 mt-3 ml-7">
                      <ArrowRight className="h-4 w-4 text-green-600 shrink-0" />
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={winner.winnerImage} />
                        <AvatarFallback className="text-xs">{winner.winnerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-sm text-primary">{winner.winnerName}</span>
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {winner.votePercentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {selectedWinners.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Button onClick={handleApplySelected} className="w-full">
                  Apply {selectedWinners.length} Selected
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Applied Changes */}
      {appliedWinners.length > 0 && (
        <Card>
          <CardHeader className="pb-2 px-4">
            <CardTitle className="text-base font-medium text-muted-foreground">
              Applied Changes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4">
            <div className="space-y-2">
              {appliedWinners.map((winner) => (
                <div 
                  key={winner.id}
                  className="p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="font-medium text-sm">{winner.position}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 ml-6">
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{winner.winnerName}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
