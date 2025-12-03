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
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              2024 General Elections
            </CardTitle>
            <Badge variant="outline" className="bg-green-500/10 text-green-600">
              Winners Announced
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-sm text-muted-foreground">
            {pendingWinners.length} position(s) pending, {appliedWinners.length} applied
          </p>
        </CardContent>
      </Card>

      {pendingWinners.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Pending Changes</CardTitle>
              <Button variant="ghost" size="sm" onClick={selectAll}>
                Select All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-3">
                {pendingWinners.map((winner) => (
                  <div 
                    key={winner.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedWinners.includes(winner.id)}
                      onCheckedChange={() => toggleSelection(winner.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        <span className="font-medium text-sm">{winner.position}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Current:</span>
                        <span>{winner.currentHolderName || "Vacant"}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={winner.winnerImage} />
                            <AvatarFallback>{winner.winnerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm text-primary">{winner.winnerName}</span>
                          <Badge variant="secondary" className="text-xs">
                            {winner.votePercentage}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleApplySingle(winner.id)}
                    >
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {selectedWinners.length > 0 && (
              <div className="mt-4 pt-4 border-t flex justify-end">
                <Button onClick={handleApplySelected}>
                  Apply {selectedWinners.length} Selected
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {appliedWinners.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Applied Changes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {appliedWinners.map((winner) => (
                <div 
                  key={winner.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{winner.position}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-medium">{winner.winnerName}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
