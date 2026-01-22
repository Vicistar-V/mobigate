import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award } from "lucide-react";
import { ElectionWinner } from "@/data/electionData";
import { format } from "date-fns";
import { VoteBoxGroup } from "../shared/VoteBoxGroup";
import { useState } from "react";
import { WinnerProfileSheet } from "./WinnerProfileSheet";

interface WinnersViewProps {
  winners: ElectionWinner[];
}

export const WinnersView = ({ winners }: WinnersViewProps) => {
  const [selectedWinner, setSelectedWinner] = useState<ElectionWinner | null>(null);
  const [showProfileSheet, setShowProfileSheet] = useState(false);

  const handleWinnerClick = (winner: ElectionWinner) => {
    setSelectedWinner(winner);
    setShowProfileSheet(true);
  };

  const getElectionTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'general':
        return 'bg-primary/10 text-primary';
      case 'emergency':
        return 'bg-orange-500/10 text-orange-600';
      case 'by-election':
        return 'bg-purple-500/10 text-purple-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold">Election Winners</h2>
        </div>

        <div className="space-y-3">
          {winners.map((winner) => (
            <Card 
              key={winner.id} 
              className="p-4 hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]"
              onClick={() => handleWinnerClick(winner)}
            >
              <div className="flex gap-4">
                {/* Winner Photo */}
                <div className="relative flex-shrink-0">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-yellow-500 shadow-md">
                    <img
                      src={winner.image}
                      alt={winner.candidateName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* Trophy Badge */}
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center shadow-sm">
                    <Trophy className="h-3 w-3 text-black" />
                  </div>
                </div>

                {/* Winner Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base truncate">{winner.candidateName}</h3>
                      <p className="text-sm text-primary font-medium">{winner.office}</p>
                    </div>
                    <Badge className="bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 flex-shrink-0">
                      <Award className="w-2.5 h-2.5 mr-0.5" />
                      Winner
                    </Badge>
                  </div>

                  {/* Election Info */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-[10px] px-1.5 py-0.5 ${getElectionTypeBadgeStyle(winner.electionType)}`}
                    >
                      {winner.electionType.charAt(0).toUpperCase() + winner.electionType.slice(1).replace('-', ' ')}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {winner.electionName}
                    </span>
                  </div>

                  {/* Vote Stats - Compact */}
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Votes:</span>
                      <span className="font-semibold text-yellow-600">{winner.votes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Share:</span>
                      <span className="font-semibold text-yellow-600">{winner.percentage.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Date */}
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {format(winner.announcedAt, "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {winners.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No winners found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Winner Profile Sheet */}
      <WinnerProfileSheet
        winner={selectedWinner}
        open={showProfileSheet}
        onOpenChange={setShowProfileSheet}
      />
    </>
  );
};
