import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { ElectionWinner } from "@/data/electionData";
import { VoteBoxGroup } from "../shared/VoteBoxGroup";
import { format } from "date-fns";

interface WinnersViewProps {
  winners: ElectionWinner[];
}

const getWinnerColors = (index: number) => {
  const colors = [
    "border-green-600 bg-green-50",
    "border-yellow-500 bg-yellow-50",
    "border-pink-500 bg-pink-50",
  ];
  return colors[index % colors.length];
};

export const WinnersView = ({ winners }: WinnersViewProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold">Election Winners</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {winners.map((winner, index) => {
          // Calculate margin (difference from second place)
          const margin = winner.percentage - 30; // Mock calculation
          const colorClass = getWinnerColors(index);
          
          return (
            <Card key={winner.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge className="bg-yellow-500 text-black mb-2">
                      <Trophy className="w-3 h-3 mr-1" />
                      Winner
                    </Badge>
                    <h3 className="font-bold text-2xl">{winner.candidateName}</h3>
                    <p className="text-muted-foreground">{winner.office}</p>
                  </div>
                </div>

                {/* Vote Statistics with Boxes */}
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3 text-center">Performance Statistics</p>
                  <VoteBoxGroup
                    values={[winner.votes, winner.percentage + '%', margin.toFixed(1) + '%']}
                    labels={['Votes', 'Share', 'Margin']}
                    colorClass={colorClass}
                    isLarge
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  Announced: {format(winner.announcedAt, "MMMM dd, yyyy 'at' h:mm a")}
                </div>
              </div>
            </Card>
          );
        })}

        {winners.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Winners will be announced after the election concludes.</p>
          </div>
        )}
      </div>
    </div>
  );
};