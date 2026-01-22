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
      return 'bg-green-500/10 text-green-600';
    case 'invalid':
      return 'bg-red-500/10 text-red-600';
    case 'pending':
      return 'bg-amber-500/10 text-amber-600';
    case 'revoked':
      return 'bg-gray-500/10 text-gray-600';
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

interface StatBadgeProps {
  value: number;
  label: string;
  icon: React.ElementType;
  color: string;
}

const StatBadge = ({ value, label, icon: Icon, color }: StatBadgeProps) => (
  <div className={`flex flex-col items-center p-3 rounded-lg ${color}`}>
    <Icon className="h-4 w-4 mb-1" />
    <span className="text-xl font-bold">{value}</span>
    <span className="text-[10px] text-muted-foreground">{label}</span>
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
    <div className="space-y-4 pb-20">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        <StatBadge value={stats.total} label="Total" icon={Users} color="bg-blue-500/10" />
        <StatBadge value={stats.valid} label="Valid" icon={CheckCircle} color="bg-green-500/10" />
        <StatBadge value={stats.invalid} label="Invalid" icon={XCircle} color="bg-red-500/10" />
        <StatBadge value={stats.pending} label="Pending" icon={Clock} color="bg-amber-500/10" />
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={handleBulkAccredit}
          disabled={selectedVoters.length === 0}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          <UserCheck className="h-4 w-4" />
          Accredit ({selectedVoters.length})
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleBulkRevoke}
          disabled={selectedVoters.length === 0}
          className="gap-2 text-red-600"
        >
          <UserX className="h-4 w-4" />
          Revoke ({selectedVoters.length})
        </Button>
        <Button size="sm" variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-2 ml-auto"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm">Auto-Accreditation Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto-accredit financially clear members</p>
                <p className="text-xs text-muted-foreground">Automatically accredit members with no outstanding dues</p>
              </div>
              <Switch
                checked={settings.autoAccredit}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoAccredit: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Require Financial Clearance</p>
                <p className="text-xs text-muted-foreground">Only accredit members without financial obligations</p>
              </div>
              <Switch
                checked={settings.requireFinancialClearance}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireFinancialClearance: checked }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Accreditation Period</p>
                <p className="font-medium">{format(settings.accreditationStartDate, "MMM d")} - {format(settings.accreditationEndDate, "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Min. Membership Days</p>
                <p className="font-medium">{settings.minimumMembershipDays} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or membership ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1">
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
            <SelectTrigger className="flex-1">
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
          <Card key={voter.id}>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedVoters.includes(voter.id)}
                  onCheckedChange={(checked) => handleSelectVoter(voter.id, checked as boolean)}
                />
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={voter.avatar} alt={voter.name} />
                  <AvatarFallback>{voter.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium text-sm truncate">{voter.name}</h4>
                      <p className="text-xs text-muted-foreground">{voter.membershipId}</p>
                    </div>
                    <Badge className={`text-[10px] shrink-0 ${getStatusColor(voter.accreditationStatus)}`}>
                      {voter.accreditationStatus}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1.5">
                    <span className={`text-xs ${getFinancialColor(voter.financialStatus)}`}>
                      {voter.financialStatus === 'owing' ? `Owing: M${voter.amountOwing?.toLocaleString()}` : voter.financialStatus}
                    </span>
                    
                    <div className="flex gap-1">
                      {voter.accreditationStatus !== 'valid' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px] text-green-600"
                          onClick={() => handleAccredit(voter.id)}
                        >
                          Accredit
                        </Button>
                      )}
                      {voter.accreditationStatus === 'valid' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px] text-red-600"
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
