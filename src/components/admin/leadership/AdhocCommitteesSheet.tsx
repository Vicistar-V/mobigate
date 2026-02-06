import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Plus, 
  Calendar, 
  ChevronRight, 
  UserPlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

import communityPerson1 from "@/assets/community-person-1.jpg";
import communityPerson2 from "@/assets/community-person-2.jpg";
import communityPerson3 from "@/assets/community-person-3.jpg";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommitteeMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface AdhocCommittee {
  id: string;
  name: string;
  purpose: string;
  status: "active" | "completed" | "pending";
  createdDate: Date;
  deadline?: Date;
  chairman: CommitteeMember;
  members: CommitteeMember[];
}

const mockCommittees: AdhocCommittee[] = [
  {
    id: "1",
    name: "Constitution Review Committee",
    purpose: "Review and propose amendments to the community constitution",
    status: "active",
    createdDate: new Date("2024-11-01"),
    deadline: new Date("2025-03-31"),
    chairman: { id: "c1", name: "Barr. Ngozi Okonkwo", avatar: communityPerson3, role: "Chairman" },
    members: [
      { id: "m1", name: "Chief Emeka Obi", avatar: communityPerson1, role: "Member" },
      { id: "m2", name: "Dr. Amaka Eze", avatar: communityPerson2, role: "Secretary" },
    ],
  },
  {
    id: "2",
    name: "Fund-Raising Committee",
    purpose: "Organize the 2025 Annual Fundraising Gala",
    status: "active",
    createdDate: new Date("2025-01-10"),
    deadline: new Date("2025-06-15"),
    chairman: { id: "c2", name: "Mr. Chidi Okoro", avatar: communityPerson1, role: "Chairman" },
    members: [
      { id: "m3", name: "Mrs. Ada Nwosu", avatar: communityPerson2, role: "Treasurer" },
    ],
  },
  {
    id: "3",
    name: "Electoral Committee",
    purpose: "Conduct the 2025 general elections",
    status: "completed",
    createdDate: new Date("2024-10-15"),
    deadline: new Date("2025-01-20"),
    chairman: { id: "c3", name: "Dr. Amaka Eze", avatar: communityPerson2, role: "Chairman" },
    members: [
      { id: "m4", name: "Barr. Ngozi Okonkwo", avatar: communityPerson3, role: "Legal Adviser" },
    ],
  },
];

const getStatusBadge = (status: AdhocCommittee["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-700 text-[10px]">Active</Badge>;
    case "completed":
      return <Badge variant="secondary" className="text-[10px]">Completed</Badge>;
    case "pending":
      return <Badge className="bg-amber-100 text-amber-700 text-[10px]">Pending</Badge>;
  }
};

const getStatusIcon = (status: AdhocCommittee["status"]) => {
  switch (status) {
    case "active":
      return <Clock className="h-4 w-4 text-green-600" />;
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-gray-500" />;
    case "pending":
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
  }
};

export function AdhocCommitteesSheet({ open, onOpenChange }: SheetProps) {
  const { toast } = useToast();
  const [committees, setCommittees] = useState(mockCommittees);
  const [selectedCommittee, setSelectedCommittee] = useState<AdhocCommittee | null>(null);

  const activeCount = committees.filter(c => c.status === "active").length;
  const completedCount = committees.filter(c => c.status === "completed").length;

  const handleCreateCommittee = () => {
    toast({
      title: "Create Committee",
      description: "Opening committee creation form...",
    });
  };

  const handleDissolveCommittee = (id: string) => {
    setCommittees(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Committee Dissolved",
      description: "The ad-hoc committee has been dissolved",
    });
  };

  const handleSelectCommittee = (committee: AdhocCommittee) => {
    setSelectedCommittee(committee);
  };

  if (selectedCommittee) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0 flex flex-col">
          <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={() => setSelectedCommittee(null)}
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
              </Button>
              <SheetTitle className="text-base">{selectedCommittee.name}</SheetTitle>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain">
            <div className="px-4 py-4 pb-6 space-y-4">
              {/* Committee Info */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{selectedCommittee.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedCommittee.purpose}
                      </p>
                    </div>
                    {getStatusBadge(selectedCommittee.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Created</span>
                      <p className="font-medium">{format(selectedCommittee.createdDate, "MMM d, yyyy")}</p>
                    </div>
                    {selectedCommittee.deadline && (
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Deadline</span>
                        <p className="font-medium">{format(selectedCommittee.deadline, "MMM d, yyyy")}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Chairman */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Chairman</h4>
                <Card>
                  <CardContent className="p-3 flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedCommittee.chairman.avatar} />
                      <AvatarFallback>{selectedCommittee.chairman.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{selectedCommittee.chairman.name}</p>
                      <p className="text-xs text-muted-foreground">Committee Chairman</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Members */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Members ({selectedCommittee.members.length})</h4>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <UserPlus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
                {selectedCommittee.members.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Actions */}
              {selectedCommittee.status === "active" && (
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    handleDissolveCommittee(selectedCommittee.id);
                    setSelectedCommittee(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Dissolve Committee
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Ad-hoc Committees
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto touch-auto overscroll-contain">
          <div className="px-4 py-4 pb-6 space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2.5 bg-muted/50 rounded-lg">
                <p className="text-lg font-bold">{committees.length}</p>
                <p className="text-[10px] text-muted-foreground">Total</p>
              </div>
              <div className="text-center p-2.5 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <p className="text-lg font-bold text-green-600">{activeCount}</p>
                <p className="text-[10px] text-muted-foreground">Active</p>
              </div>
              <div className="text-center p-2.5 bg-gray-50 dark:bg-gray-950/30 rounded-lg">
                <p className="text-lg font-bold text-gray-600">{completedCount}</p>
                <p className="text-[10px] text-muted-foreground">Completed</p>
              </div>
            </div>

            {/* Create Button */}
            <Button onClick={handleCreateCommittee} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create New Committee
            </Button>

            {/* Committees List */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">All Committees</h4>
              {committees.map((committee) => (
                <Card 
                  key={committee.id} 
                  className="cursor-pointer active:scale-[0.99] transition-transform"
                  onClick={() => handleSelectCommittee(committee)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-muted shrink-0">
                        {getStatusIcon(committee.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm truncate">{committee.name}</h4>
                          {getStatusBadge(committee.status)}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                          {committee.purpose}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            <Avatar className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={committee.chairman.avatar} />
                              <AvatarFallback className="text-[8px]">{committee.chairman.name[0]}</AvatarFallback>
                            </Avatar>
                            {committee.members.slice(0, 2).map((member) => (
                              <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="text-[8px]">{member.name[0]}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {committee.members.length + 1} members
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {committees.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">No committees yet</p>
                <p className="text-xs text-muted-foreground">
                  Create ad-hoc committees for special tasks
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
