import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Calendar, 
  Users, 
  Trophy, 
  CheckCircle, 
  BarChart3,
  MessageCircle,
  X
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { 
  PreviousElectionDetail, 
  PreviousElectionOfficeResult,
  getPreviousElectionDetail 
} from "@/data/previousElectionResultsData";
import { toast } from "@/hooks/use-toast";

interface PreviousElectionDetailSheetProps {
  electionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Candidate result row component
const CandidateResultRow = ({ 
  candidate, 
  index 
}: { 
  candidate: { name: string; votes: number; percentage: number; isWinner: boolean }; 
  index: number;
}) => {
  const colors = [
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-blue-500",
    "bg-purple-500"
  ];
  
  return (
    <div className={`p-3 rounded-lg border ${candidate.isWinner ? 'border-green-500 bg-green-50' : 'border-border'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {candidate.isWinner && (
            <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          )}
          <span className="font-medium text-sm truncate">{candidate.name}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-bold text-sm">{candidate.votes}</span>
          <Badge variant="outline" className="text-xs">
            {candidate.percentage.toFixed(1)}%
          </Badge>
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colors[index % colors.length]}`}
          style={{ width: `${candidate.percentage}%` }}
        />
      </div>
    </div>
  );
};

// Office result card component
const OfficeResultCard = ({ office }: { office: PreviousElectionOfficeResult }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Office Header */}
      <div 
        className="p-3 bg-muted cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-bold">
              {office.shortCode}
            </Badge>
            <span className="font-semibold text-sm">{office.officeName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {office.totalVotes} votes
            </span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Trophy className="w-3.5 h-3.5 text-yellow-500" />
          <span className="text-sm text-green-600 font-medium truncate">
            {office.winner}
          </span>
        </div>
      </div>
      
      {/* Candidates List - Expandable */}
      {isExpanded && (
        <div className="p-3 space-y-2 border-t">
          {office.candidates.map((candidate, index) => (
            <CandidateResultRow key={candidate.id} candidate={candidate} index={index} />
          ))}
        </div>
      )}
      
      {!isExpanded && (
        <div className="px-3 py-2 text-center border-t">
          <span className="text-xs text-muted-foreground">
            Tap to view {office.candidates.length} candidates
          </span>
        </div>
      )}
    </div>
  );
};

export const PreviousElectionDetailSheet = ({
  electionId,
  open,
  onOpenChange,
}: PreviousElectionDetailSheetProps) => {
  const [activeTab, setActiveTab] = useState("results");
  
  const election = electionId ? getPreviousElectionDetail(electionId) : null;
  
  const handleDownload = () => {
    if (!election) return;
    
    // Generate a text summary for download
    let content = `${election.name}\n`;
    content += `${"=".repeat(50)}\n\n`;
    content += `Date: ${format(election.date, "MMMM dd, yyyy")}\n`;
    content += `Type: ${election.type}\n`;
    content += `Total Accredited Voters: ${election.totalAccreditedVoters}\n`;
    content += `Total Votes Cast: ${election.totalVotesCast}\n`;
    content += `Voter Turnout: ${election.turnoutPercentage}%\n\n`;
    content += `ELECTION RESULTS\n`;
    content += `${"-".repeat(50)}\n\n`;
    
    election.offices.forEach((office) => {
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
    link.download = `${election.name.replace(/\s+/g, "_")}_Results.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `${election.name} results are being downloaded.`,
    });
  };
  
  if (!election) return null;
  
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh] touch-auto overflow-hidden">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <DrawerTitle className="text-lg font-bold leading-tight line-clamp-2">
                {election.name}
              </DrawerTitle>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {election.type}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(election.date, "MMM dd, yyyy")}
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="flex-shrink-0"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-2 bg-muted rounded-lg">
              <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <div className="font-bold text-sm">{election.totalAccreditedVoters}</div>
              <div className="text-[10px] text-muted-foreground">Accredited</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <CheckCircle className="w-4 h-4 mx-auto mb-1 text-green-500" />
              <div className="font-bold text-sm">{election.totalVotesCast}</div>
              <div className="text-[10px] text-muted-foreground">Votes Cast</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <BarChart3 className="w-4 h-4 mx-auto mb-1 text-blue-500" />
              <div className="font-bold text-sm">{election.turnoutPercentage}%</div>
              <div className="text-[10px] text-muted-foreground">Turnout</div>
            </div>
          </div>
        </DrawerHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col overflow-hidden min-h-0">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-2" style={{ width: 'calc(100% - 2rem)' }}>
            <TabsTrigger value="results" className="text-xs">
              <Trophy className="w-3.5 h-3.5 mr-1" />
              Results
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs">
              <MessageCircle className="w-3.5 h-3.5 mr-1" />
              Chat ({election.chatMessages.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="results" className="flex-1 overflow-hidden min-h-0 mt-0">
            <ScrollArea className="h-[45vh] touch-auto min-h-0">
              <div className="p-4 space-y-3">
                {election.offices.map((office) => (
                  <OfficeResultCard key={office.id} office={office} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="chat" className="flex-1 overflow-hidden min-h-0 mt-0">
            <ScrollArea className="h-[45vh] touch-auto min-h-0">
              <div className="p-4 space-y-3">
                {election.chatMessages.length > 0 ? (
                  election.chatMessages.map((message) => (
                    <div key={message.id} className="flex gap-3 p-3 bg-muted rounded-lg">
                      <Avatar className="w-9 h-9 flex-shrink-0">
                        <AvatarImage src={message.avatar} alt={message.senderName} />
                        <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span className="font-semibold text-sm truncate">{message.senderName}</span>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">
                            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No chat messages for this election.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        {/* Footer Actions */}
        <div className="p-4 border-t bg-background">
          <Button 
            className="w-full" 
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Full Results
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
