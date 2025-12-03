import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, XCircle, Download, Filter } from "lucide-react";
import { mockAccreditedVoters, AccreditedVoter } from "@/data/electionData";

export const AccreditedVotersTab = () => {
  const [viewType, setViewType] = useState<"valid" | "invalid">("valid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVoters = mockAccreditedVoters.filter((voter) => {
    const matchesStatus = viewType === "valid" ? voter.status === "valid" : voter.status === "invalid";
    const matchesSearch = voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voter.membershipId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const validCount = mockAccreditedVoters.filter(v => v.status === "valid").length;
  const invalidCount = mockAccreditedVoters.filter(v => v.status === "invalid").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">Accredited Voters</h2>
        <p className="text-sm text-muted-foreground">
          View all members who are accredited to vote in community elections
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Valid Voters</span>
          </div>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200 mt-1">{validCount}</p>
        </div>
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">Invalid Voters</span>
          </div>
          <p className="text-2xl font-bold text-red-800 dark:text-red-200 mt-1">{invalidCount}</p>
        </div>
      </div>

      {/* Toggle & Search */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            variant={viewType === "valid" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setViewType("valid")}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Currently Accredited
          </Button>
          <Button
            variant={viewType === "invalid" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setViewType("invalid")}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Previously Accredited
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-1" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" />
          Export List
        </Button>
      </div>

      {/* Voters List */}
      <div className="space-y-2">
        {filteredVoters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No {viewType === "valid" ? "valid" : "invalid"} voters found
          </div>
        ) : (
          filteredVoters.map((voter) => (
            <VoterCard key={voter.id} voter={voter} />
          ))
        )}
      </div>

      {/* Summary */}
      <div className="p-3 bg-muted rounded-lg text-sm text-center">
        Showing {filteredVoters.length} of {viewType === "valid" ? validCount : invalidCount}{" "}
        {viewType === "valid" ? "valid" : "invalid"} voters
      </div>
    </div>
  );
};

const VoterCard = ({ voter }: { voter: AccreditedVoter }) => {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-card">
      <Avatar className="h-10 w-10">
        <AvatarImage src={voter.avatar} alt={voter.name} />
        <AvatarFallback>{voter.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{voter.name}</p>
        <p className="text-xs text-muted-foreground">{voter.membershipId}</p>
        <p className="text-xs text-muted-foreground">
          Accredited: {new Date(voter.dateAccredited).toLocaleDateString()}
        </p>
      </div>
      <Badge variant={voter.status === "valid" ? "default" : "secondary"} className="shrink-0">
        {voter.status === "valid" ? "Valid" : "Expired"}
      </Badge>
    </div>
  );
};
