import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Search, CheckCircle, XCircle, Loader2, Users } from "lucide-react";
import { mockAccreditedVoters, AccreditedVoter } from "@/data/electionData";
import { format } from "date-fns";

export const AccreditedVotersSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewType, setViewType] = useState<'current' | 'previous' | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleViewChange = async (type: 'current' | 'previous') => {
    if (viewType === type) return; // Already viewing this type
    setIsLoading(true);
    setViewType(type);
    setSearchQuery(""); // Reset search when switching views
    // Simulate API fetch delay
    await new Promise(resolve => setTimeout(resolve, 600));
    setIsLoading(false);
  };

  const validCount = mockAccreditedVoters.filter(v => v.status === "valid").length;
  const invalidCount = mockAccreditedVoters.filter(v => v.status === "invalid").length;

  const filteredVoters = mockAccreditedVoters.filter((voter) => {
    const matchesStatus = viewType === 'current' 
      ? voter.status === "valid" 
      : voter.status === "invalid";
    const matchesSearch = voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voter.membershipId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalForCurrentView = viewType === 'current' ? validCount : invalidCount;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-3 bg-muted border-2 border-border cursor-pointer hover:bg-muted/80 transition-colors">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="font-bold text-sm">View All Accredited Voters</span>
          </div>
          <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-2 border-t-0 border-border bg-background">
          {/* Menu Options */}
          <Button
            variant="ghost"
            className={`w-full justify-start py-3.5 px-4 rounded-none hover:bg-muted h-auto whitespace-normal text-left text-sm ${
              viewType === 'current' 
                ? 'bg-green-50 dark:bg-green-950/30 border-l-4 border-l-green-600 font-semibold text-green-800 dark:text-green-300' 
                : ''
            }`}
            onClick={() => handleViewChange('current')}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${viewType === 'current' ? 'text-green-600' : 'text-muted-foreground'}`} />
              <span>Currently Accredited [Valid Voters]</span>
              <Badge variant="outline" className="ml-auto bg-green-100 text-green-700 border-green-300">
                {validCount}
              </Badge>
            </div>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start py-3.5 px-4 rounded-none hover:bg-muted h-auto whitespace-normal text-left text-sm border-t ${
              viewType === 'previous' 
                ? 'bg-red-50 dark:bg-red-950/30 border-l-4 border-l-red-600 font-semibold text-red-800 dark:text-red-300' 
                : ''
            }`}
            onClick={() => handleViewChange('previous')}
          >
            <div className="flex items-center gap-2">
              <XCircle className={`h-4 w-4 ${viewType === 'previous' ? 'text-red-600' : 'text-muted-foreground'}`} />
              <span>Previously Accredited [Invalid Voters]</span>
              <Badge variant="outline" className="ml-auto bg-red-100 text-red-700 border-red-300">
                {invalidCount}
              </Badge>
            </div>
          </Button>

          {/* Content Area - Only shows when viewType is selected */}
          {viewType && (
            <div className="p-3 space-y-3 border-t bg-muted/30 animate-in fade-in-0 slide-in-from-top-2 duration-200">
              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2.5 rounded-lg border-2 ${viewType === 'current' ? 'bg-green-50 border-green-200' : 'bg-muted border-border'}`}>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">Valid Voters</span>
                  </div>
                  <p className="text-lg font-bold text-green-800 mt-0.5">{validCount}</p>
                </div>
                <div className={`p-2.5 rounded-lg border-2 ${viewType === 'previous' ? 'bg-red-50 border-red-200' : 'bg-muted border-border'}`}>
                  <div className="flex items-center gap-1.5">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-xs font-medium text-red-700">Invalid Voters</span>
                  </div>
                  <p className="text-lg font-bold text-red-800 mt-0.5">{invalidCount}</p>
                </div>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or membership ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-sm"
                />
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-lg border animate-pulse">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                      <div className="h-6 w-16 bg-muted rounded" />
                    </div>
                  ))}
                  <div className="flex items-center justify-center gap-2 py-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs">Loading voters...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Voter List */}
                  {filteredVoters.length > 0 ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {filteredVoters.map((voter) => (
                        <VoterCard key={voter.id} voter={voter} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Users className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">No voters found</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {searchQuery 
                          ? "Try a different search term" 
                          : `No ${viewType === 'current' ? 'valid' : 'invalid'} voters in this list`
                        }
                      </p>
                    </div>
                  )}

                  {/* Results Summary */}
                  {filteredVoters.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-center text-muted-foreground">
                        Showing <span className="font-semibold">{filteredVoters.length}</span> of{" "}
                        <span className="font-semibold">{totalForCurrentView}</span>{" "}
                        {viewType === 'current' ? 'valid' : 'invalid'} voters
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// Voter Card Component
const VoterCard = ({ voter }: { voter: AccreditedVoter }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
      voter.status === 'valid' 
        ? 'bg-background border-green-200 hover:border-green-300' 
        : 'bg-background border-red-200 hover:border-red-300'
    }`}>
      <Avatar className="h-10 w-10 border-2 border-muted">
        <AvatarImage src={voter.avatar} alt={voter.name} />
        <AvatarFallback className="text-xs font-medium bg-muted">
          {getInitials(voter.name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{voter.name}</p>
        <p className="text-xs text-muted-foreground font-mono">{voter.membershipId}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Accredited: {formatDate(voter.dateAccredited)}
        </p>
      </div>
      
      <Badge 
        variant={voter.status === "valid" ? "default" : "secondary"}
        className={`shrink-0 text-[10px] px-2 ${
          voter.status === "valid" 
            ? "bg-green-600 hover:bg-green-700 text-white" 
            : "bg-red-100 text-red-700 hover:bg-red-200"
        }`}
      >
        {voter.status === "valid" ? (
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Valid
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Expired
          </span>
        )}
      </Badge>
    </div>
  );
};
