import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, ChevronLeft, ChevronRight, Download, Trophy, X } from "lucide-react";
import { PreviousElection } from "@/data/electionData";
import { format, isAfter, isBefore, isEqual, startOfDay, endOfDay } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PreviousElectionDetailSheet } from "./PreviousElectionDetailSheet";
import { getPreviousElectionDetail } from "@/data/previousElectionResultsData";

interface PreviousElectionsListProps {
  elections: PreviousElection[];
  onSelectElection?: (electionId: string) => void;
}

export const PreviousElectionsList = ({
  elections,
  onSelectElection,
}: PreviousElectionsListProps) => {
  const [selectedElectionId, setSelectedElectionId] = useState<string | null>(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [filterMode, setFilterMode] = useState<"start" | "end">("start");

  // Filter elections based on date range
  const filteredElections = useMemo(() => {
    if (!startDate && !endDate) return elections;
    
    return elections.filter((election) => {
      const electionDate = startOfDay(new Date(election.date));
      
      if (startDate && endDate) {
        return (
          (isAfter(electionDate, startOfDay(startDate)) || isEqual(electionDate, startOfDay(startDate))) &&
          (isBefore(electionDate, endOfDay(endDate)) || isEqual(electionDate, startOfDay(endDate)))
        );
      }
      
      if (startDate) {
        return isAfter(electionDate, startOfDay(startDate)) || isEqual(electionDate, startOfDay(startDate));
      }
      
      if (endDate) {
        return isBefore(electionDate, endOfDay(endDate)) || isEqual(electionDate, startOfDay(endDate));
      }
      
      return true;
    });
  }, [elections, startDate, endDate]);

  const handleCardClick = (electionId: string) => {
    setSelectedElectionId(electionId);
    setShowDetailSheet(true);
    onSelectElection?.(electionId);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (filterMode === "start") {
      setStartDate(date);
      if (date) {
        setFilterMode("end");
      }
    } else {
      setEndDate(date);
      if (date) {
        setDateFilterOpen(false);
      }
    }
  };

  const clearDateFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setFilterMode("start");
  };

  const hasActiveFilter = startDate || endDate;

  const handleDownload = (e: React.MouseEvent, electionId: string, electionName: string) => {
    e.stopPropagation(); // Prevent card click
    
    const electionDetail = getPreviousElectionDetail(electionId);
    
    if (!electionDetail) {
      toast({
        title: "Download Unavailable",
        description: "Detailed results for this election are not available.",
        variant: "destructive",
      });
      return;
    }
    
    // Generate download content
    let content = `${electionDetail.name}\n`;
    content += `${"=".repeat(50)}\n\n`;
    content += `Date: ${format(electionDetail.date, "MMMM dd, yyyy")}\n`;
    content += `Type: ${electionDetail.type}\n`;
    content += `Total Accredited Voters: ${electionDetail.totalAccreditedVoters}\n`;
    content += `Total Votes Cast: ${electionDetail.totalVotesCast}\n`;
    content += `Voter Turnout: ${electionDetail.turnoutPercentage}%\n\n`;
    content += `ELECTION RESULTS\n`;
    content += `${"-".repeat(50)}\n\n`;
    
    electionDetail.offices.forEach((office) => {
      content += `${office.officeName} (${office.shortCode})\n`;
      content += `Winner: ${office.winner}\n`;
      content += `Total Votes: ${office.totalVotes}\n\n`;
      content += `Candidates:\n`;
      office.candidates.forEach((candidate, index) => {
        const winnerMarker = candidate.isWinner ? " ✓ WINNER" : "";
        content += `  ${index + 1}. ${candidate.name} - ${candidate.votes} votes (${candidate.percentage.toFixed(1)}%)${winnerMarker}\n`;
      });
      content += `\n`;
    });
    
    // Create and download the file
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${electionName.replace(/\s+/g, "_")}_Results.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `${electionName} results are being downloaded.`,
    });
  };

  return (
    <>
      <Card className="p-4 mb-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">Previous Election Results</h3>
            <Popover open={dateFilterOpen} onOpenChange={setDateFilterOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant={hasActiveFilter ? "default" : "outline"} 
                  size="sm"
                  className={cn(hasActiveFilter && "bg-primary text-primary-foreground")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {hasActiveFilter ? "Filtered" : "Dates"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Filter by Date</span>
                    {hasActiveFilter && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        onClick={clearDateFilter}
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterMode === "start" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 text-xs h-8"
                      onClick={() => setFilterMode("start")}
                    >
                      {startDate ? format(startDate, "MMM dd, yy") : "Start Date"}
                    </Button>
                    <Button
                      variant={filterMode === "end" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 text-xs h-8"
                      onClick={() => setFilterMode("end")}
                    >
                      {endDate ? format(endDate, "MMM dd, yy") : "End Date"}
                    </Button>
                  </div>
                </div>
                <CalendarComponent
                  mode="single"
                  selected={filterMode === "start" ? startDate : endDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    // For end date, disable dates before start date
                    if (filterMode === "end" && startDate) {
                      return isBefore(date, startOfDay(startDate));
                    }
                    // For start date, disable dates after end date
                    if (filterMode === "start" && endDate) {
                      return isAfter(date, endOfDay(endDate));
                    }
                    return false;
                  }}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Active Filter Badge */}
          {hasActiveFilter && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {startDate && endDate ? (
                  <>
                    {format(startDate, "MMM dd, yyyy")} - {format(endDate, "MMM dd, yyyy")}
                  </>
                ) : startDate ? (
                  <>From {format(startDate, "MMM dd, yyyy")}</>
                ) : endDate ? (
                  <>Until {format(endDate, "MMM dd, yyyy")}</>
                ) : null}
              </Badge>
              <span className="text-xs text-muted-foreground">
                ({filteredElections.length} of {elections.length} elections)
              </span>
            </div>
          )}

          <div className="space-y-2">
            {filteredElections.map((election) => (
              <div
                key={election.id}
                className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors active:bg-muted/80"
                onClick={() => handleCardClick(election.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm leading-tight">{election.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(election.date, "MMMM dd, yyyy")} • {election.type}
                    </p>
                    {election.winner && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <Trophy className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-green-600 font-medium">
                          Winner: {election.winner}
                        </span>
                      </div>
                    )}
                    {election.totalVotes && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Total Votes: {election.totalVotes.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-shrink-0 h-8 w-8 p-0"
                    onClick={(e) => handleDownload(e, election.id, election.name)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-[10px] text-muted-foreground mt-2 text-center">
                  Tap to view full results
                </div>
              </div>
            ))}

            {filteredElections.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {hasActiveFilter 
                  ? "No elections found in the selected date range."
                  : "No previous elections found."
                }
              </div>
            )}

            {filteredElections.length > 0 && (
              <div className="flex justify-center gap-2 pt-4">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="flex items-center px-4 text-sm">Page 1 of 1</span>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Election Detail Sheet */}
      <PreviousElectionDetailSheet
        electionId={selectedElectionId}
        open={showDetailSheet}
        onOpenChange={setShowDetailSheet}
      />
    </>
  );
};
