import { useState } from "react";
import {
  Search,
  UserPlus,
  ThumbsUp,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
  User,
  Vote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockNominations, mockNominationPeriods } from "@/data/electionProcessesData";
import { Nomination } from "@/types/electionProcesses";
import { NominateCandidateSheet } from "./NominateCandidateSheet";
import { NominationDetailsSheet } from "./NominationDetailsSheet";

const getStatusBadge = (status: Nomination["status"]) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-emerald-500 text-white text-[10px]">Approved</Badge>
      );
    case "pending_approval":
      return <Badge className="bg-amber-500 text-white text-[10px]">Pending</Badge>;
    case "rejected":
      return <Badge className="bg-red-500 text-white text-[10px]">Rejected</Badge>;
    default:
      return null;
  }
};

export function NominationsListView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [officeFilter, setOfficeFilter] = useState("all");
  const [showNominateSheet, setShowNominateSheet] = useState(false);
  const [selectedNomination, setSelectedNomination] = useState<Nomination | null>(null);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);

  // Only show approved nominations to regular members
  const visibleNominations = mockNominations.filter(
    (n) => n.status === "approved" || n.status === "pending_approval"
  );

  const filteredNominations = visibleNominations.filter((nomination) => {
    const matchesSearch = nomination.nomineeName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesOffice =
      officeFilter === "all" || nomination.officeId === officeFilter;
    return matchesSearch && matchesOffice;
  });

  const uniqueOffices = [
    ...new Map(
      mockNominationPeriods.map((p) => [p.officeId, { id: p.officeId, name: p.officeName }])
    ).values(),
  ];

  const openPeriods = mockNominationPeriods.filter((p) => p.status === "open");

  const handleNominationClick = (nomination: Nomination) => {
    setSelectedNomination(nomination);
    setShowDetailsSheet(true);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header with Nominate Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Community Nominations</h2>
          <p className="text-sm text-muted-foreground">
            {openPeriods.length} open nomination period
            {openPeriods.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => setShowNominateSheet(true)}
          className="bg-gradient-to-r from-primary to-primary/80"
          size="sm"
        >
          <UserPlus className="h-4 w-4 mr-1.5" />
          Nominate
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{visibleNominations.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {visibleNominations.filter((n) => n.status === "approved").length}
            </p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">
              {visibleNominations.filter((n) => n.status === "pending_approval").length}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nominees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <Select value={officeFilter} onValueChange={setOfficeFilter}>
          <SelectTrigger className="w-[120px] h-10">
            <Filter className="h-4 w-4 mr-1.5" />
            <SelectValue placeholder="Office" />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="all">All Offices</SelectItem>
            {uniqueOffices.map((office) => (
              <SelectItem key={office.id} value={office.id}>
                {office.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nominations List */}
      <div className="space-y-2">
        {filteredNominations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No nominations found</p>
              <Button
                variant="outline"
                onClick={() => setShowNominateSheet(true)}
                className="mt-4"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Be the first to nominate
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredNominations.map((nomination) => (
            <Card
              key={nomination.id}
              className="overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
              onClick={() => handleNominationClick(nomination)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-11 w-11 shrink-0">
                    <AvatarImage
                      src={nomination.nomineeAvatar}
                      alt={nomination.nomineeName}
                    />
                    <AvatarFallback className="text-sm">
                      {nomination.nomineeName[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm leading-tight line-clamp-1">
                          {nomination.nomineeName}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Vote className="h-3 w-3 text-primary" />
                          <span className="text-xs text-muted-foreground">
                            {nomination.officeName}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(nomination.status)}
                    </div>

                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      {/* Self-nomination badge */}
                      {nomination.isSelfNomination && (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 border-blue-200 text-blue-600"
                        >
                          <User className="h-2.5 w-2.5 mr-1" />
                          Self
                        </Badge>
                      )}

                      {/* Endorsements */}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        {nomination.endorsementsCount}
                      </span>

                      {/* Acceptance status */}
                      {nomination.acceptedByNominee ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 text-emerald-600 border-emerald-200"
                        >
                          <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                          Accepted
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 text-amber-600 border-amber-200"
                        >
                          <Clock className="h-2.5 w-2.5 mr-1" />
                          Awaiting
                        </Badge>
                      )}
                    </div>

                    {/* Nominated by (only if not self) */}
                    {!nomination.isSelfNomination && (
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        Nominated by: {nomination.nominatedByName.split(" ").slice(0, 2).join(" ")}
                      </p>
                    )}
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Nominate Sheet */}
      <NominateCandidateSheet
        open={showNominateSheet}
        onOpenChange={setShowNominateSheet}
        onNominationComplete={() => setShowNominateSheet(false)}
      />

      {/* Nomination Details Sheet */}
      <NominationDetailsSheet
        open={showDetailsSheet}
        onOpenChange={setShowDetailsSheet}
        nomination={selectedNomination}
      />
    </div>
  );
}
