import { useState } from "react";
import { Users, CheckCircle, XCircle, Clock, Search, Download, Settings, UserCheck, UserX } from "lucide-react";
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
  <div className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg ${color} min-w-0`}>
    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mb-0.5" />
    <span className="text-lg sm:text-xl font-bold">{value}</span>
    <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate">{label}</span>
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

  const handleBulkAccredit = () => {
    setVoters(prev => prev.map(v => 
      selectedVoters.includes(v.id) ? { ...v, accreditationStatus: 'valid' as const, dateAccredited: new Date() } : v
    ));
    toast({
      title: "Voters Accredited",
      description: `${selectedVoters.length} voters have been accredited`
    });
    setSelectedVoters([]);
  };

  const handleBulkRevoke = () => {
    setVoters(prev => prev.map(v => 
      selectedVoters.includes(v.id) ? { ...v, accreditationStatus: 'revoked' as const } : v
    ));
    toast({
      title: "Accreditation Revoked",
      description: `${selectedVoters.length} voters have had their accreditation revoked`,
      variant: "destructive"
    });
    setSelectedVoters([]);
  };

  const handleAccredit = (voterId: string) => {
    setVoters(prev => prev.map(v => 
      v.id === voterId ? { ...v, accreditationStatus: 'valid' as const, dateAccredited: new Date() } : v
    ));
    toast({
      title: "Voter Accredited",
      description: "The voter has been accredited successfully"
    });
  };

  const handleRevoke = (voterId: string) => {
    setVoters(prev => prev.map(v => 
      v.id === voterId ? { ...v, accreditationStatus: 'revoked' as const } : v
    ));
    toast({
      title: "Accreditation Revoked",
      description: "The voter's accreditation has been revoked",
      variant: "destructive"
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
          className="gap-1.5 bg-green-600 hover:bg-green-700 text-xs h-8"
        >
          <UserCheck className="h-3.5 w-3.5" />
          Accredit ({selectedVoters.length})
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleBulkRevoke}
          disabled={selectedVoters.length === 0}
          className="gap-1.5 text-red-600 text-xs h-8"
        >
          <UserX className="h-3.5 w-3.5" />
          Revoke
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8">
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-1.5 ml-auto text-xs h-8"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader className="py-2.5 px-3">
            <CardTitle className="text-sm">Auto-Accreditation Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium">Auto-accredit clear members</p>
                <p className="text-[10px] text-muted-foreground line-clamp-1">Automatically accredit members with no dues</p>
              </div>
              <Switch
                checked={settings.autoAccredit}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoAccredit: checked }))}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium">Require Financial Clearance</p>
                <p className="text-[10px] text-muted-foreground line-clamp-1">Only accredit members without obligations</p>
              </div>
              <Switch
                checked={settings.requireFinancialClearance}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireFinancialClearance: checked }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
              <div>
                <p className="text-muted-foreground text-[10px]">Accreditation Period</p>
                <p className="font-medium text-[11px]">{format(settings.accreditationStartDate, "MMM d")} - {format(settings.accreditationEndDate, "MMM d")}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px]">Min. Membership</p>
                <p className="font-medium text-[11px]">{settings.minimumMembershipDays} days</p>
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
            className="pl-8 h-9 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 h-8 text-xs">
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
            <SelectTrigger className="flex-1 h-8 text-xs">
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
        <span className="text-xs text-muted-foreground">
          Select all ({filteredVoters.length})
        </span>
      </div>

      {/* Voter List */}
      <div className="space-y-2">
        {filteredVoters.map((voter) => (
          <Card key={voter.id} className="overflow-hidden">
            <CardContent className="p-2.5 sm:p-3">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  checked={selectedVoters.includes(voter.id)}
                  onCheckedChange={(checked) => handleSelectVoter(voter.id, checked as boolean)}
                />
                
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0">
                  <AvatarImage src={voter.avatar} alt={voter.name} />
                  <AvatarFallback className="text-xs">{voter.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0 overflow-hidden">
                  {/* Name + Badge Row */}
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate leading-tight">{voter.name}</h4>
                      <p className="text-[10px] text-muted-foreground truncate">{voter.membershipId}</p>
                    </div>
                    <Badge className={`text-[9px] shrink-0 capitalize ${getStatusColor(voter.accreditationStatus)}`}>
                      {voter.accreditationStatus}
                    </Badge>
                  </div>
                  
                  {/* Financial + Actions Row */}
                  <div className="flex items-center justify-between mt-1.5 gap-2">
                    <span className={`text-[10px] ${getFinancialColor(voter.financialStatus)}`}>
                      {voter.financialStatus === 'owing' ? `Owing: M${voter.amountOwing?.toLocaleString()}` : voter.financialStatus}
                    </span>
                    
                    <div className="flex gap-1 shrink-0">
                      {voter.accreditationStatus !== 'valid' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-[10px] text-green-600"
                          onClick={() => handleAccredit(voter.id)}
                        >
                          Accredit
                        </Button>
                      )}
                      {voter.accreditationStatus === 'valid' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-[10px] text-red-600"
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
    </div>
  );
}
