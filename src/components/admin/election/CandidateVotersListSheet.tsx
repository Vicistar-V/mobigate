import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Search,
  Calendar,
  Clock,
  MessageSquare,
  Shield,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { MemberPreviewDialog } from "@/components/community/MemberPreviewDialog";
import { ExecutiveMember } from "@/data/communityExecutivesData";

// Voter interface for detailed voter info
export interface CandidateVoter {
  id: string;
  name: string;
  avatar: string;
  accreditationNumber: string;
  votedAt: Date;
  remarks?: string;
}

// Generate mock voters for a candidate
const generateMockVoters = (candidateId: string, voteCount: number): CandidateVoter[] => {
  const firstNames = [
    "Emmanuel", "Grace", "David", "Sarah", "Michael", "Jennifer", "Daniel", "Patricia",
    "James", "Mary", "John", "Elizabeth", "Robert", "Linda", "William", "Barbara",
    "Charles", "Susan", "Joseph", "Jessica", "Thomas", "Margaret", "Christopher", "Dorothy",
    "Chukwuemeka", "Ngozi", "Obiora", "Adaeze", "Uchenna", "Chiamaka", "Nnamdi", "Nneka"
  ];
  
  const lastNames = [
    "Okonkwo", "Adebayo", "Nwosu", "Okafor", "Eze", "Chibueze", "Okoro", "Udoh",
    "Nwachukwu", "Obi", "Ibe", "Udeh", "Smith", "Johnson", "Williams", "Brown",
    "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Anderson", "Taylor"
  ];

  const remarks = [
    "Best candidate for this position!",
    "I believe in your vision for our community.",
    "You have my full support.",
    "Looking forward to your leadership.",
    "Great manifesto and clear priorities.",
    "Your experience speaks for itself.",
    "Time for change and progress!",
    "You've earned my trust.",
    null, null, null, null, null // Many voters don't leave remarks
  ];

  const voterCount = voteCount;
  
  return Array.from({ length: voterCount }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    // Generate accreditation number: ACC-XXXXXX-XXXX
    const accNum = `ACC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    // Generate random vote time within the last 7 days
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 7));
    baseDate.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0);
    
    const remark = remarks[Math.floor(Math.random() * remarks.length)];
    
    return {
      id: `voter-${candidateId}-${i}`,
      name,
      avatar: "/placeholder.svg",
      accreditationNumber: accNum,
      votedAt: baseDate,
      remarks: remark || undefined
    };
  });
};

const PAGE_SIZE = 50;

interface CandidateVotersListSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  voteCount: number;
  officeName: string;
  isWinner?: boolean;
}

export function CandidateVotersListSheet({
  open,
  onOpenChange,
  candidateId,
  candidateName,
  candidateAvatar,
  voteCount,
  officeName,
  isWinner = false
}: CandidateVotersListSheetProps) {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [filterMode, setFilterMode] = useState<"all" | "remarks_only">("all");
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
  const [showMemberPreview, setShowMemberPreview] = useState(false);

  // Generate mock voters
  const voters = generateMockVoters(candidateId, voteCount);
  
  const filteredVoters = voters.filter(voter => {
    const matchesSearch = voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voter.accreditationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterMode === "all" || voter.remarks;
    return matchesSearch && matchesFilter;
  });

  const displayedVoters = filteredVoters.slice(0, displayCount);
  const hasMore = filteredVoters.length > displayCount;
  const remainingCount = filteredVoters.length - displayCount;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setDisplayCount(PAGE_SIZE);
  };

  const handleFilterChange = (mode: "all" | "remarks_only") => {
    setFilterMode(mode);
    setSearchQuery("");
    setDisplayCount(PAGE_SIZE);
  };

  // Map voter to ExecutiveMember for MemberPreviewDialog
  const mapVoterToMember = (voter: CandidateVoter): ExecutiveMember => ({
    id: voter.id,
    name: voter.name,
    position: "Community Member",
    tenure: "",
    imageUrl: voter.avatar,
    level: "officer",
    committee: "executive",
  });

  const handleVoterClick = (voter: CandidateVoter) => {
    setSelectedMember(mapVoterToMember(voter));
    setShowMemberPreview(true);
  };

  // Count remarks
  const remarksCount = voters.filter(v => v.remarks).length;

  const Content = () => (
    <div className="space-y-4">
      {/* Candidate Summary */}
      <Card className={isWinner ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200" : "bg-muted/30"}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarImage src={candidateAvatar} alt={candidateName} />
              <AvatarFallback className="text-lg">
                {candidateName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base">{candidateName}</h3>
              <p className="text-sm text-muted-foreground">{officeName}</p>
              {isWinner && (
                <Badge className="bg-emerald-500 text-white text-[10px] mt-1">
                  Winner
                </Badge>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button 
              className={cn(
                "text-center p-2 bg-background rounded-lg transition-all",
                filterMode === "all" 
                  ? "ring-2 ring-primary/30" 
                  : "active:bg-primary/10"
              )}
              onClick={() => handleFilterChange("all")}
            >
              <p className="text-xl font-bold text-primary">{voteCount}</p>
              <p className="text-xs text-muted-foreground">Total Votes</p>
            </button>
            <button 
              className={cn(
                "text-center p-2 bg-background rounded-lg transition-all",
                filterMode === "remarks_only" 
                  ? "ring-2 ring-orange-500/30" 
                  : "active:bg-orange-500/10"
              )}
              onClick={() => handleFilterChange("remarks_only")}
            >
              <p className="text-xl font-bold text-orange-500">{remarksCount}</p>
              <p className="text-xs text-muted-foreground">With Remarks</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or accreditation..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-8 h-9 text-sm"
        />
      </div>

      {/* Voters List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Voters List
          </h3>
          <div className="flex items-center gap-1.5">
            {filterMode === "remarks_only" && (
              <Badge 
                variant="secondary" 
                className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 cursor-pointer"
                onClick={() => handleFilterChange("all")}
              >
                Remarks only ✕
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {hasMore
                ? `${displayedVoters.length} of ${filteredVoters.length}`
                : `${filteredVoters.length} voters`
              }
            </Badge>
          </div>
        </div>

        {hasMore ? (
          <p className="text-xs text-muted-foreground">
            Showing {displayedVoters.length} of {filteredVoters.length} voters
          </p>
        ) : (searchQuery || filterMode !== "all") ? (
          <p className="text-xs text-muted-foreground">
            {filteredVoters.length} matching voters found
          </p>
        ) : null}

        {filteredVoters.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No voters found matching your search
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {displayedVoters.map((voter) => (
              <Card 
                key={voter.id} 
                className="overflow-hidden cursor-pointer active:bg-muted/50 transition-colors"
                onClick={() => handleVoterClick(voter)}
              >
                <CardContent className="p-3">
                  {/* Voter Header */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={voter.avatar} alt={voter.name} />
                      <AvatarFallback className="text-sm">
                        {voter.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{voter.name}</p>
                      
                      {/* Accreditation Number */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <Shield className="h-3 w-3 text-blue-500" />
                        <code className="text-[11px] bg-muted px-1.5 py-0.5 rounded font-mono">
                          {voter.accreditationNumber}
                        </code>
                      </div>
                      
                      {/* Date/Time Voted */}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(voter.votedAt, "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(voter.votedAt, "h:mm a")}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-3" />
                  </div>

                  {/* Voter Remarks */}
                  {voter.remarks && (
                    <>
                      <Separator className="my-2" />
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-3.5 w-3.5 text-orange-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground italic">
                          "{voter.remarks}"
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <Button
            variant="outline"
            className="w-full h-11 text-sm font-medium"
            onClick={() => setDisplayCount(prev => prev + PAGE_SIZE)}
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            Load More ({remainingCount} remaining)
          </Button>
        )}
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
        <p>Voter information is protected and only visible to authorized election administrators.</p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[92vh]">
            <DrawerHeader className="border-b pb-3">
              <DrawerTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Voters List
              </DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto" style={{ maxHeight: 'calc(92vh - 80px)' }}>
              {Content()}
            </ScrollArea>
          </DrawerContent>
        </Drawer>
        <MemberPreviewDialog
          member={selectedMember}
          open={showMemberPreview}
          onOpenChange={setShowMemberPreview}
        />
      </>
    );
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader className="pb-3">
            <SheetTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Voters List
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-100px)] pr-4">
            {Content()}
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <MemberPreviewDialog
        member={selectedMember}
        open={showMemberPreview}
        onOpenChange={setShowMemberPreview}
      />
    </>
  );
}
