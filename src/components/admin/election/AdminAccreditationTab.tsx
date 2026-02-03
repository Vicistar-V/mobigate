import { useState } from "react";
import { Users, CheckCircle, XCircle, Clock, Search, Download, Settings, UserCheck, UserX, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { mockAccreditationVoters, mockAccreditationSettings, AdminAccreditationVoter, AdminAccreditationSettings } from "@/data/adminElectionData";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ModuleAuthorizationDrawer } from "@/components/admin/authorization/ModuleAuthorizationDrawer";

const getStatusColor = (status: AdminAccreditationVoter['accreditationStatus']) => {
  switch (status) {
    case 'valid':
      return 'bg-green-500 text-white';
    case 'invalid':
      return 'bg-red-500/20 text-red-600';
    case 'pending':
      return 'bg-amber-500/20 text-amber-600';
    case 'revoked':
      return 'bg-gray-500/20 text-gray-600';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getFinancialColor = (status: AdminAccreditationVoter['financialStatus']) => {
  switch (status) {
    case 'clear':
      return 'text-green-600';
    case 'owing':
      return 'text-red-600';
    case 'pending':
      return 'text-amber-600';
    default:
      return 'text-muted-foreground';
  }
};

interface StatCardProps {
  value: number;
  label: string;
  icon: React.ElementType;
  color: string;
}

const StatCard = ({ value, label, icon: Icon, color }: StatCardProps) => (
  <div className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-lg ${color} min-w-0`}>
    <Icon className="h-4 w-4 mb-0.5" />
    <span className="text-xl font-bold">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

export function AdminAccreditationTab() {
  const { toast } = useToast();
  const [voters, setVoters] = useState<AdminAccreditationVoter[]>(mockAccreditationVoters);
  const [settings, setSettings] = useState<AdminAccreditationSettings>(mockAccreditationSettings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [financialFilter, setFinancialFilter] = useState<string>("all");
  const [selectedVoters, setSelectedVoters] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  
  // Multi-signature authorization state
  const [showAuthDrawer, setShowAuthDrawer] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "accredit" | "revoke";
    voterIds: string[];
    voterNames: string[];
  } | null>(null);

  const filteredVoters = voters.filter(voter => {
    const matchesSearch = voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          voter.membershipId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || voter.accreditationStatus === statusFilter;
    const matchesFinancial = financialFilter === "all" || voter.financialStatus === financialFilter;
    return matchesSearch && matchesStatus && matchesFinancial;
  });

  const stats = {
    total: voters.length,
    valid: voters.filter(v => v.accreditationStatus === 'valid').length,
    invalid: voters.filter(v => v.accreditationStatus === 'invalid').length,
    pending: voters.filter(v => v.accreditationStatus === 'pending').length
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVoters(filteredVoters.map(v => v.id));
    } else {
      setSelectedVoters([]);
    }
  };

  const handleSelectVoter = (voterId: string, checked: boolean) => {
    if (checked) {
      setSelectedVoters(prev => [...prev, voterId]);
    } else {
      setSelectedVoters(prev => prev.filter(id => id !== voterId));
    }
  };

  // Open authorization drawer for bulk accredit
  const handleBulkAccredit = () => {
    const selectedVoterData = voters.filter(v => selectedVoters.includes(v.id));
    setPendingAction({
      type: "accredit",
      voterIds: selectedVoters,
      voterNames: selectedVoterData.map(v => v.name),
    });
    setShowAuthDrawer(true);
  };

  // Open authorization drawer for bulk revoke
  const handleBulkRevoke = () => {
    const selectedVoterData = voters.filter(v => selectedVoters.includes(v.id));
    setPendingAction({
      type: "revoke",
      voterIds: selectedVoters,
      voterNames: selectedVoterData.map(v => v.name),
    });
    setShowAuthDrawer(true);
  };

  // Open authorization drawer for single accredit
  const handleAccredit = (voterId: string) => {
    const voter = voters.find(v => v.id === voterId);
    if (!voter) return;
    
    setPendingAction({
      type: "accredit",
      voterIds: [voterId],
      voterNames: [voter.name],
    });
    setShowAuthDrawer(true);
  };

  // Open authorization drawer for single revoke
  const handleRevoke = (voterId: string) => {
    const voter = voters.find(v => v.id === voterId);
    if (!voter) return;
    
    setPendingAction({
      type: "revoke",
      voterIds: [voterId],
      voterNames: [voter.name],
    });
    setShowAuthDrawer(true);
  };

  // Execute action after multi-signature authorization
  const handleAuthorizationComplete = () => {
    if (!pendingAction) return;
    
    if (pendingAction.type === "accredit") {
      setVoters(prev => prev.map(v => 
        pendingAction.voterIds.includes(v.id) 
          ? { ...v, accreditationStatus: 'valid' as const, dateAccredited: new Date() } 
          : v
      ));
      toast({
        title: "Voters Accredited",
        description: `${pendingAction.voterIds.length} voter(s) have been accredited with multi-signature authorization`
      });
    } else {
      setVoters(prev => prev.map(v => 
        pendingAction.voterIds.includes(v.id) 
          ? { ...v, accreditationStatus: 'revoked' as const } 
          : v
      ));
      toast({
        title: "Accreditation Revoked",
        description: `${pendingAction.voterIds.length} voter(s) have had their accreditation revoked`,
        variant: "destructive"
      });
    }
    
    setSelectedVoters([]);
    setPendingAction(null);
  };

  // Render action details for authorization drawer
  const getAuthActionDetails = () => {
    if (!pendingAction) return null;
    
    const isAccredit = pendingAction.type === "accredit";
    const count = pendingAction.voterIds.length;
    
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isAccredit ? "bg-green-500/10" : "bg-red-500/10"}`}>
            {isAccredit ? (
              <UserCheck className="h-5 w-5 text-green-600" />
            ) : (
              <UserX className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">
              {isAccredit ? "Accredit" : "Revoke"} {count} Voter{count !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              {isAccredit ? "Grant voting rights" : "Remove voting rights"}
            </p>
          </div>
        </div>
        
        {/* Voter names list */}
        <div className="bg-muted/50 rounded-lg p-2 max-h-24 overflow-y-auto touch-auto">
          {pendingAction.voterNames.slice(0, 5).map((name, idx) => (
            <p key={idx} className="text-xs truncate">{name}</p>
          ))}
          {pendingAction.voterNames.length > 5 && (
            <p className="text-xs text-muted-foreground mt-1">
              +{pendingAction.voterNames.length - 5} more
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          <span>Requires 3 admin signatures</span>
        </div>
      </div>
    );
  };

  const handleExport = () => {
    // Generate CSV content from voters
    const headers = ["Name", "Membership ID", "Status", "Financial Status", "Amount Owing", "Date Accredited"];
    const csvRows = [
      headers.join(","),
      ...filteredVoters.map(voter => [
        `"${voter.name}"`,
        voter.membershipId,
        voter.accreditationStatus,
        voter.financialStatus,
        voter.amountOwing || 0,
        voter.dateAccredited ? format(new Date(voter.dateAccredited), "yyyy-MM-dd") : "N/A"
      ].join(","))
    ];
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `accreditation-list-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: `Exported ${filteredVoters.length} voter records to CSV`
    });
  };

  return (
    <div className="space-y-3 sm:space-y-4 pb-20 overflow-hidden">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        <StatCard value={stats.total} label="Total" icon={Users} color="bg-blue-500/10" />
        <StatCard value={stats.valid} label="Valid" icon={CheckCircle} color="bg-green-500/10" />
        <StatCard value={stats.invalid} label="Invalid" icon={XCircle} color="bg-red-500/10" />
        <StatCard value={stats.pending} label="Pending" icon={Clock} color="bg-amber-500/10" />
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        <Button
          size="sm"
          onClick={handleBulkAccredit}
          disabled={selectedVoters.length === 0}
          className="gap-1.5 bg-green-600 hover:bg-green-700 text-xs h-9"
        >
          <UserCheck className="h-4 w-4" />
          Accredit ({selectedVoters.length})
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleBulkRevoke}
          disabled={selectedVoters.length === 0}
          className="gap-1.5 text-red-600 text-xs h-9"
        >
          <UserX className="h-4 w-4" />
          Revoke
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-1.5 text-xs h-9"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-1.5 ml-auto text-xs h-9"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base">Auto-Accreditation Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Auto-accredit clear members</p>
                <p className="text-xs text-muted-foreground">Automatically accredit members with no dues</p>
              </div>
              <Switch
                checked={settings.autoAccredit}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoAccredit: checked }))}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Require Financial Clearance</p>
                <p className="text-xs text-muted-foreground">Only accredit members without obligations</p>
              </div>
              <Switch
                checked={settings.requireFinancialClearance}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireFinancialClearance: checked }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Accreditation Period</p>
                <p className="font-medium text-sm">{format(settings.accreditationStartDate, "MMM d")} - {format(settings.accreditationEndDate, "MMM d")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Min. Membership</p>
                <p className="font-medium text-sm">{settings.minimumMembershipDays} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 h-9 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="valid">Valid</SelectItem>
              <SelectItem value="invalid">Invalid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>
          <Select value={financialFilter} onValueChange={setFinancialFilter}>
            <SelectTrigger className="flex-1 h-9 text-sm">
              <SelectValue placeholder="Financial" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Financial</SelectItem>
              <SelectItem value="clear">Clear</SelectItem>
              <SelectItem value="owing">Owing</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Select All */}
      <div className="flex items-center gap-2 py-2 border-b">
        <Checkbox
          checked={selectedVoters.length === filteredVoters.length && filteredVoters.length > 0}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm text-muted-foreground">
          Select all ({filteredVoters.length})
        </span>
      </div>

      {/* Voter List */}
      <div className="space-y-2">
        {filteredVoters.map((voter) => (
          <Card key={voter.id} className="overflow-hidden">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedVoters.includes(voter.id)}
                  onCheckedChange={(checked) => handleSelectVoter(voter.id, checked as boolean)}
                />
                
                <Avatar className="h-10 w-10 sm:h-11 sm:w-11 shrink-0">
                  <AvatarImage src={voter.avatar} alt={voter.name} />
                  <AvatarFallback className="text-sm">{voter.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0 overflow-hidden">
                  {/* Name + Badge Row */}
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-base truncate leading-tight">{voter.name}</h4>
                      <p className="text-xs text-muted-foreground">{voter.membershipId}</p>
                    </div>
                    <Badge className={`text-xs shrink-0 capitalize ${getStatusColor(voter.accreditationStatus)}`}>
                      {voter.accreditationStatus}
                    </Badge>
                  </div>
                  
                  {/* Financial + Actions Row */}
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <span className={`text-sm font-medium ${getFinancialColor(voter.financialStatus)}`}>
                      {voter.financialStatus === 'owing' ? `Owing: M${voter.amountOwing?.toLocaleString()}` : voter.financialStatus}
                    </span>
                    
                    <div className="flex gap-1.5 shrink-0">
                      {voter.accreditationStatus !== 'valid' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2.5 text-xs text-green-600"
                          onClick={() => handleAccredit(voter.id)}
                        >
                          Accredit
                        </Button>
                      )}
                      {voter.accreditationStatus === 'valid' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2.5 text-xs text-red-600"
                          onClick={() => handleRevoke(voter.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Multi-Signature Authorization Drawer */}
      <ModuleAuthorizationDrawer
        open={showAuthDrawer}
        onOpenChange={(open) => {
          setShowAuthDrawer(open);
          if (!open) setPendingAction(null);
        }}
        module="elections"
        actionTitle={pendingAction?.type === "accredit" ? "Accredit Voters" : "Revoke Accreditation"}
        actionDescription={
          pendingAction?.type === "accredit"
            ? "Multi-signature authorization required to grant voting accreditation"
            : "Multi-signature authorization required to revoke voting accreditation"
        }
        actionDetails={getAuthActionDetails()}
        initiatorRole="secretary"
        onAuthorized={handleAuthorizationComplete}
      />
    </div>
  );
}
