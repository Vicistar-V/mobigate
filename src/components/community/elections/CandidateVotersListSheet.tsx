import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Users,
  Calendar,
  Clock,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

import communityPerson1 from "@/assets/community-person-1.jpg";
import communityPerson2 from "@/assets/community-person-2.jpg";
import communityPerson3 from "@/assets/community-person-3.jpg";
import communityPerson4 from "@/assets/community-person-4.jpg";
import communityPerson5 from "@/assets/community-person-5.jpg";
import communityPerson6 from "@/assets/community-person-6.jpg";

interface CandidateVoter {
  id: string;
  name: string;
  avatar: string;
  accreditationNumber: string;
  votedAt: Date;
  remark?: string;
}

// Mock data for candidate voters
const mockCandidateVoters: CandidateVoter[] = [
  {
    id: "cv-1",
    name: "Chukwuemeka Okonkwo",
    avatar: communityPerson4,
    accreditationNumber: "ACC-2025-0147",
    votedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    remark: "Best choice for our community!",
  },
  {
    id: "cv-2",
    name: "Adaeze Nnamdi",
    avatar: communityPerson5,
    accreditationNumber: "ACC-2025-0089",
    votedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    remark: "Strong leadership skills",
  },
  {
    id: "cv-3",
    name: "Chief Obiora Chukwuma",
    avatar: communityPerson1,
    accreditationNumber: "ACC-2025-0003",
    votedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "cv-4",
    name: "Dr. Amaka Eze",
    avatar: communityPerson3,
    accreditationNumber: "ACC-2025-0056",
    votedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    remark: "I trust this candidate",
  },
  {
    id: "cv-5",
    name: "Ifeanyi Ezekwesili",
    avatar: communityPerson6,
    accreditationNumber: "ACC-2025-0201",
    votedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "cv-6",
    name: "Ngozi Okafor",
    avatar: communityPerson2,
    accreditationNumber: "ACC-2025-0178",
    votedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
    remark: "Excellent choice for our future!",
  },
  {
    id: "cv-7",
    name: "Emmanuel Adeyemi",
    avatar: communityPerson4,
    accreditationNumber: "ACC-2025-0234",
    votedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: "cv-8",
    name: "Blessing Okoro",
    avatar: communityPerson5,
    accreditationNumber: "ACC-2025-0112",
    votedAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
    remark: "Best for the community",
  },
];

interface CandidateVotersListSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  candidateColor: string;
  officeName: string;
  totalVotes: number;
}

export const CandidateVotersListSheet = ({
  open,
  onOpenChange,
  candidateName,
  candidateColor,
  officeName,
  totalVotes,
}: CandidateVotersListSheetProps) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");

  // Generate mock voters based on total votes (limit to 20 for performance)
  const voters = mockCandidateVoters.slice(0, Math.min(totalVotes, 20));

  const filteredVoters = voters.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.accreditationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCandidateBgColor = (color: string) => {
    const colorMap: Record<string, string> = {
      green: "bg-green-100",
      purple: "bg-purple-100",
      magenta: "bg-pink-100",
      orange: "bg-orange-100",
      blue: "bg-blue-100",
    };
    return colorMap[color] || "bg-gray-100";
  };

  const getCandidateTextColor = (color: string) => {
    const colorMap: Record<string, string> = {
      green: "text-green-700",
      purple: "text-purple-700",
      magenta: "text-pink-700",
      orange: "text-orange-700",
      blue: "text-blue-700",
    };
    return colorMap[color] || "text-gray-700";
  };

  const Content = () => (
    <div className="space-y-4">
      {/* Summary Header */}
      <Card className={`p-4 ${getCandidateBgColor(candidateColor)} border-0`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-white/60">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Voters for {candidateName}</p>
            <p className={`text-xl font-bold ${getCandidateTextColor(candidateColor)}`}>
              {totalVotes.toLocaleString()} Voters
            </p>
            <p className="text-xs text-muted-foreground">{officeName}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        </div>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or accreditation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Voters List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Users className="h-4 w-4" />
          Voter Records ({filteredVoters.length})
        </h3>

        <div className="space-y-2">
          {filteredVoters.map((voter) => (
            <Card key={voter.id} className="p-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={voter.avatar} />
                  <AvatarFallback className="text-sm">
                    {voter.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-1">
                  {/* Name */}
                  <p className="font-medium text-sm">{voter.name}</p>
                  
                  {/* Accreditation Number */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3 w-3 text-green-600" />
                    <span className="font-mono">{voter.accreditationNumber}</span>
                  </div>
                  
                  {/* Date/Time Voted */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(voter.votedAt, "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{format(voter.votedAt, "h:mm a")}</span>
                    </div>
                  </div>
                  
                  {/* Voter Remark */}
                  {voter.remark && (
                    <div className="flex items-start gap-1.5 mt-2 p-2 bg-muted/50 rounded-lg">
                      <MessageCircle className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                      <span className="text-xs text-muted-foreground italic">
                        "{voter.remark}"
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {filteredVoters.length === 0 && (
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">No Voters Found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search query.
          </p>
        </Card>
      )}

      {voters.length < totalVotes && (
        <p className="text-xs text-center text-muted-foreground py-2">
          Showing {voters.length} of {totalVotes} voters
        </p>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>Voters List</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            <Content />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Voters List</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <Content />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
