import { useState } from "react";
import { Plus, Vote, Clock, CheckCircle2, XCircle, Calendar, Users, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface DeclaredElection {
  id: string;
  name: string;
  type: 'general' | 'supplementary';
  selectedOffices: string[];
  nominationStartDate: Date;
  electionDate: Date;
  status: 'pending_authorization' | 'active' | 'nominations_open' | 'completed' | 'cancelled';
  authorizationProgress: {
    required: number;
    completed: number;
    signatories: string[];
  };
  vacancyReasons?: Record<string, string>;
  createdAt: Date;
  createdBy: string;
}

// Mock declared elections data
const mockDeclaredElections: DeclaredElection[] = [
  {
    id: "1",
    name: "2025 General Elections",
    type: "general",
    selectedOffices: ["President", "Vice President", "Secretary", "PRO", "Treasurer", "Financial Secretary"],
    nominationStartDate: new Date("2025-02-15"),
    electionDate: new Date("2025-03-20"),
    status: "active",
    authorizationProgress: {
      required: 3,
      completed: 3,
      signatories: ["President", "Secretary", "PRO"]
    },
    createdAt: new Date("2025-01-10"),
    createdBy: "Chief Okonkwo"
  },
  {
    id: "2",
    name: "Supplementary - Treasurer",
    type: "supplementary",
    selectedOffices: ["Treasurer"],
    nominationStartDate: new Date("2025-02-01"),
    electionDate: new Date("2025-02-28"),
    status: "pending_authorization",
    authorizationProgress: {
      required: 3,
      completed: 1,
      signatories: ["Secretary"]
    },
    vacancyReasons: { "Treasurer": "Resignation" },
    createdAt: new Date("2025-01-28"),
    createdBy: "Engr. Adebayo"
  },
  {
    id: "3",
    name: "Supplementary - PRO",
    type: "supplementary",
    selectedOffices: ["PRO"],
    nominationStartDate: new Date("2024-11-01"),
    electionDate: new Date("2024-11-30"),
    status: "completed",
    authorizationProgress: {
      required: 3,
      completed: 3,
      signatories: ["President", "Secretary", "Legal Adviser"]
    },
    vacancyReasons: { "PRO": "Impeachment" },
    createdAt: new Date("2024-10-15"),
    createdBy: "Chief Okonkwo"
  }
];

interface AdminDeclareElectionTabProps {
  onDeclareElection: () => void;
}

export function AdminDeclareElectionTab({ onDeclareElection }: AdminDeclareElectionTabProps) {
  const [elections] = useState<DeclaredElection[]>(mockDeclaredElections);

  const stats = {
    active: elections.filter(e => e.status === 'active' || e.status === 'nominations_open').length,
    pendingAuth: elections.filter(e => e.status === 'pending_authorization').length,
    completed: elections.filter(e => e.status === 'completed').length,
    cancelled: elections.filter(e => e.status === 'cancelled').length
  };

  const getStatusBadge = (status: DeclaredElection['status']) => {
    switch (status) {
      case 'pending_authorization':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">Pending Authorization</Badge>;
      case 'active':
        return <Badge className="bg-green-600 text-white text-xs">Active</Badge>;
      case 'nominations_open':
        return <Badge className="bg-blue-600 text-white text-xs">Nominations Open</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200 text-xs">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">Cancelled</Badge>;
    }
  };

  const getTypeBadge = (type: 'general' | 'supplementary') => {
    if (type === 'general') {
      return <Badge className="bg-blue-600 text-white text-xs">General</Badge>;
    }
    return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">Supplementary</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-2.5 text-center">
            <div className="text-lg font-bold text-green-700">{stats.active}</div>
            <div className="text-xs text-green-600">Active</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-2.5 text-center">
            <div className="text-lg font-bold text-amber-700">{stats.pendingAuth}</div>
            <div className="text-xs text-amber-600">Pending</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-2.5 text-center">
            <div className="text-lg font-bold text-gray-700">{stats.completed}</div>
            <div className="text-xs text-gray-600">Done</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-2.5 text-center">
            <div className="text-lg font-bold text-red-700">{stats.cancelled}</div>
            <div className="text-xs text-red-600">Cancelled</div>
          </CardContent>
        </Card>
      </div>

      {/* Declare New Election Button */}
      <Button 
        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base touch-manipulation"
        onClick={onDeclareElection}
      >
        <Plus className="h-5 w-5 mr-2" />
        + Declare New Election
      </Button>

      {/* Authorization Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs text-blue-700">
              <span className="font-medium">Multi-Signature Required:</span> President + Secretary + (PRO or Director of Socials)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Declared Elections List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground px-1">Declared Elections</h3>
        
        <ScrollArea className="h-[calc(100vh-420px)] touch-auto overscroll-contain">
          <div className="space-y-2.5 pr-2">
            {elections.length === 0 ? (
              <Card className="bg-muted/30">
                <CardContent className="p-6 text-center">
                  <Vote className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No elections declared yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Tap the button above to declare a new election</p>
                </CardContent>
              </Card>
            ) : (
              elections.map((election) => (
                <Card key={election.id} className="touch-manipulation">
                  <CardContent className="p-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap gap-1.5">
                        {getTypeBadge(election.type)}
                        {getStatusBadge(election.status)}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>

                    {/* Election Name */}
                    <h4 className="font-semibold text-sm mb-2">{election.name}</h4>

                    {/* Offices */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground">
                        {election.selectedOffices.length} {election.selectedOffices.length === 1 ? 'Office' : 'Offices'}
                        {election.selectedOffices.length <= 3 && (
                          <span className="text-foreground ml-1">
                            ({election.selectedOffices.join(', ')})
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Vacancy Reason for Supplementary */}
                    {election.type === 'supplementary' && election.vacancyReasons && (
                      <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded mb-2">
                        Reason: {Object.values(election.vacancyReasons)[0]}
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex flex-col gap-1 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          Nominations: {format(election.nominationStartDate, "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Vote className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          Election: {format(election.electionDate, "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    {/* Authorization Progress */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Authorization:</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {election.authorizationProgress.completed >= election.authorizationProgress.required ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-500" />
                        )}
                        <span className={`text-xs font-medium ${
                          election.authorizationProgress.completed >= election.authorizationProgress.required 
                            ? 'text-green-600' 
                            : 'text-amber-600'
                        }`}>
                          {election.authorizationProgress.completed}/{election.authorizationProgress.required}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
