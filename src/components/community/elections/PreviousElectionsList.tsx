import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { PreviousElection } from "@/data/electionData";
import { format } from "date-fns";

interface PreviousElectionsListProps {
  elections: PreviousElection[];
  onSelectElection?: (electionId: string) => void;
}

export const PreviousElectionsList = ({
  elections,
  onSelectElection,
}: PreviousElectionsListProps) => {
  return (
    <Card className="p-4 mb-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Previous Election Results</h3>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Dates
          </Button>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Election List</TabsTrigger>
            <TabsTrigger value="chat">Chat Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-2 mt-4">
            {elections.map((election) => (
              <div
                key={election.id}
                className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                onClick={() => onSelectElection?.(election.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{election.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(election.date, "MMMM dd, yyyy")} • {election.type}
                    </p>
                    {election.winner && (
                      <p className="text-xs text-green-600 mt-1">Winner: {election.winner}</p>
                    )}
                    {election.totalVotes && (
                      <p className="text-xs text-muted-foreground">
                        Total Votes: {election.totalVotes}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {elections.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No previous elections found.
              </div>
            )}

            <div className="flex justify-center gap-2 pt-4">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="flex items-center px-4 text-sm">Page 1 of 1</span>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-4">
            <div className="text-center py-8 text-muted-foreground">
              Select an election to view its chat messages.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
