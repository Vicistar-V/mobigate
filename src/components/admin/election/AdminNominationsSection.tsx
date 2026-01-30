import { useState } from "react";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search,
  UserPlus,
  ChevronRight,
  ThumbsUp,
  AlertCircle,
  Calendar,
  Eye,
  User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  mockNominationPeriods, 
  mockNominations, 
  getNominationStats 
} from "@/data/electionProcessesData";
import { Nomination, NominationPeriod } from "@/types/electionProcesses";
import { cn } from "@/lib/utils";
import { NominateCandidateDrawer } from "./NominateCandidateDrawer";

const getStatusBadge = (status: Nomination['status']) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-emerald-500 text-white text-[10px]">Approved</Badge>;
    case 'pending_approval':
      return <Badge className="bg-amber-500 text-white text-[10px]">Pending</Badge>;
    case 'rejected':
      return <Badge className="bg-red-500 text-white text-[10px]">Rejected</Badge>;
    case 'open':
      return <Badge className="bg-blue-500 text-white text-[10px]">Open</Badge>;
    case 'closed':
      return <Badge className="bg-gray-500 text-white text-[10px]">Closed</Badge>;
    default:
      return null;
  }
};

const getPeriodStatusBadge = (status: NominationPeriod['status']) => {
  switch (status) {
    case 'open':
      return <Badge className="bg-emerald-500 text-white text-[10px]">Open</Badge>;
    case 'closed':
      return <Badge className="bg-gray-500 text-white text-[10px]">Closed</Badge>;
    case 'upcoming':
      return <Badge className="bg-blue-500 text-white text-[10px]">Upcoming</Badge>;
    default:
      return null;
  }
};

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}

const StatCard = ({ icon, value, label, color }: StatCardProps) => (
  <div className={cn("flex flex-col items-center justify-center p-2 rounded-lg", color)}>
    <div className="flex items-center gap-1">
      {icon}
      <span className="text-lg font-bold">{value}</span>
    </div>
    <span className="text-[10px] text-muted-foreground">{label}</span>
  </div>
);

export function AdminNominationsSection() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [officeFilter, setOfficeFilter] = useState<string>("all");
  const [selectedNomination, setSelectedNomination] = useState<Nomination | null>(null);
  const [showNominationSheet, setShowNominationSheet] = useState(false);
  const [showNominateCandidateDrawer, setShowNominateCandidateDrawer] = useState(false);

  const stats = getNominationStats();

  const filteredNominations = mockNominations.filter((nomination) => {
    const matchesSearch = 
      nomination.nomineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nomination.nominatedByName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || nomination.status === statusFilter;
    const matchesOffice = officeFilter === "all" || nomination.officeId === officeFilter;
    return matchesSearch && matchesStatus && matchesOffice;
  });

  const handleApprove = (nomination: Nomination) => {
    toast({
      title: "Nomination Approved",
      description: `${nomination.nomineeName} has been approved for ${nomination.officeName}`,
    });
    setShowNominationSheet(false);
  };

  const handleReject = (nomination: Nomination) => {
    toast({
      title: "Nomination Rejected",
      description: `${nomination.nomineeName} has been rejected`,
      variant: "destructive",
    });
    setShowNominationSheet(false);
  };

  const openNominationDetail = (nomination: Nomination) => {
    setSelectedNomination(nomination);
    setShowNominationSheet(true);
  };

  const uniqueOffices = [...new Set(mockNominations.map((n) => ({ id: n.officeId, name: n.officeName })))];

  const DetailContent = () => (
    <ScrollArea className="flex-1 overflow-y-auto touch-auto px-4 pb-6">
      {selectedNomination && (
        <div className="space-y-4">
          {/* Nominee Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={selectedNomination.nomineeAvatar} />
                  <AvatarFallback>{selectedNomination.nomineeName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-base">{selectedNomination.nomineeName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedNomination.officeName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(selectedNomination.status)}
                    {selectedNomination.isSelfNomination && (
                      <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-600">
                        <User className="h-2.5 w-2.5 mr-1" />
                        Self-Nominated
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nomination Info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nominated By</span>
                <span className="font-medium">
                  {selectedNomination.isSelfNomination ? "Self" : selectedNomination.nominatedByName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date Nominated</span>
                <span className="font-medium">{format(selectedNomination.nominatedAt, "MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Endorsements</span>
                <span className="font-medium flex items-center gap-1">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {selectedNomination.endorsementsCount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nominee Accepted</span>
                <span className="font-medium">
                  {selectedNomination.acceptedByNominee ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                    </span>
                  ) : (
                    <span className="text-amber-600 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Pending
                    </span>
                  )}
                </span>
              </div>
              {selectedNomination.acceptedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Accepted On</span>
                  <span className="font-medium">{format(selectedNomination.acceptedAt, "MMM d, yyyy")}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Qualification Status */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">Qualification Status</h4>
              {selectedNomination.qualificationStatus === 'qualified' && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Qualified for Election</span>
                </div>
              )}
              {selectedNomination.qualificationStatus === 'pending' && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium">Qualification Pending</span>
                </div>
              )}
              {selectedNomination.qualificationStatus === 'disqualified' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                    <XCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Disqualified</span>
                  </div>
                  {selectedNomination.disqualificationReason && (
                    <p className="text-xs text-muted-foreground p-2 bg-muted rounded-lg">
                      <strong>Reason:</strong> {selectedNomination.disqualificationReason}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {selectedNomination.status === 'pending_approval' && (
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 h-12 text-red-600 border-red-200"
                onClick={() => handleReject(selectedNomination)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button 
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleApprove(selectedNomination)}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          )}
        </div>
      )}
    </ScrollArea>
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Nominate Candidate Button */}
      <Button
        onClick={() => setShowNominateCandidateDrawer(true)}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
      >
        <UserPlus className="h-5 w-5 mr-2" />
        Nominate Candidate
      </Button>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-1.5">
        <StatCard 
          icon={<Users className="h-3.5 w-3.5 text-blue-600" />} 
          value={stats.total} 
          label="Total" 
          color="bg-blue-500/10" 
        />
        <StatCard 
          icon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />} 
          value={stats.approved} 
          label="Approved" 
          color="bg-emerald-500/10" 
        />
        <StatCard 
          icon={<Clock className="h-3.5 w-3.5 text-amber-600" />} 
          value={stats.pending} 
          label="Pending" 
          color="bg-amber-500/10" 
        />
        <StatCard 
          icon={<XCircle className="h-3.5 w-3.5 text-red-600" />} 
          value={stats.rejected} 
          label="Rejected" 
          color="bg-red-500/10" 
        />
      </div>

      {/* Nomination Periods */}
      <Card>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Nomination Periods
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <ScrollArea className="h-[120px]">
            <div className="space-y-2">
              {mockNominationPeriods.map((period) => (
                <div 
                  key={period.id} 
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{period.officeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(period.startDate, "MMM d")} - {format(period.endDate, "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {period.nominationsCount}{period.maxNominations ? `/${period.maxNominations}` : ""}
                    </span>
                    {getPeriodStatusBadge(period.status)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nominees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[90px] h-9 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending_approval">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Nominations List */}
      <div className="space-y-2">
        {filteredNominations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <UserPlus className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">No nominations found</p>
            </CardContent>
          </Card>
        ) : (
          filteredNominations.map((nomination) => (
            <Card 
              key={nomination.id} 
              className="overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
              onClick={() => openNominationDetail(nomination)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2.5">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={nomination.nomineeAvatar} alt={nomination.nomineeName} />
                    <AvatarFallback className="text-sm">{nomination.nomineeName[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm leading-tight line-clamp-1">
                          {nomination.nomineeName}
                        </h4>
                        <p className="text-xs text-muted-foreground">{nomination.officeName}</p>
                      </div>
                      {getStatusBadge(nomination.status)}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {nomination.endorsementsCount}
                      </span>
                      <span>
                        {nomination.isSelfNomination 
                          ? "Self-Nominated" 
                          : `By: ${nomination.nominatedByName.split(' ').slice(0, 2).join(' ')}`}
                      </span>
                    </div>

                    {/* Acceptance Status */}
                    <div className="flex items-center gap-1 mt-1.5">
                      {nomination.acceptedByNominee ? (
                        <Badge variant="outline" className="text-[10px] py-0 text-emerald-600 border-emerald-200">
                          <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                          Accepted
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] py-0 text-amber-600 border-amber-200">
                          <Clock className="h-2.5 w-2.5 mr-1" />
                          Awaiting Response
                        </Badge>
                      )}
                      {nomination.isSelfNomination && (
                        <Badge variant="outline" className="text-[10px] py-0 text-blue-600 border-blue-200">
                          <User className="h-2.5 w-2.5 mr-1" />
                          Self
                        </Badge>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Nomination Detail Sheet - Responsive Drawer/Dialog */}
      {isMobile ? (
        <Drawer open={showNominationSheet} onOpenChange={setShowNominationSheet}>
          <DrawerContent className="max-h-[92vh] flex flex-col">
            <DrawerHeader className="pb-2">
              <DrawerTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Nomination Details
              </DrawerTitle>
            </DrawerHeader>
            <DetailContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showNominationSheet} onOpenChange={setShowNominationSheet}>
          <DialogContent className="max-h-[85vh] max-w-lg overflow-hidden flex flex-col">
            <DialogHeader className="pb-2">
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Nomination Details
              </DialogTitle>
            </DialogHeader>
            <DetailContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Nominate Candidate Drawer */}
      <NominateCandidateDrawer
        open={showNominateCandidateDrawer}
        onOpenChange={setShowNominateCandidateDrawer}
      />
    </div>
  );
}
