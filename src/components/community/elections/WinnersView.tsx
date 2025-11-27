import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp } from "lucide-react";
import { ElectionWinner } from "@/data/electionData";
import { format } from "date-fns";

interface WinnersViewProps {
  winners: ElectionWinner[];
}

export const WinnersView = ({ winners }: WinnersViewProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold">Election Winners</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {winners.map((winner) => (
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

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Votes</p>
                  <p className="text-2xl font-bold">{winner.votes}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vote Share</p>
                  <p className="text-2xl font-bold flex items-center">
                    {winner.percentage}%
                    <TrendingUp className="w-5 h-5 ml-2 text-green-500" />
                  </p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Announced: {format(winner.announcedAt, "MMMM dd, yyyy 'at' h:mm a")}
              </div>
            </div>
          </Card>
        ))}

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
