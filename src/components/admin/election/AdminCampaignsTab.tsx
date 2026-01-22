import { useState } from "react";
import { Plus, Eye, Pause, Play, StopCircle, Edit, Trash2, Search, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAdminCampaigns, AdminCampaign } from "@/data/adminElectionData";
import { useToast } from "@/hooks/use-toast";
import { CampaignFormDialog } from "./CampaignFormDialog";
import { format } from "date-fns";

const getStatusColor = (status: AdminCampaign['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-500 text-white';
    case 'draft':
      return 'bg-gray-500/20 text-gray-600';
    case 'paused':
      return 'bg-amber-500/20 text-amber-600';
    case 'ended':
      return 'bg-red-500/20 text-red-600';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

interface StatCardProps {
  value: number;
  label: string;
  color: string;
}

const StatCard = ({ value, label, color }: StatCardProps) => (
  <div className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg ${color} min-w-0`}>
    <span className="text-lg sm:text-2xl font-bold">{value}</span>
    <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{label}</span>
  </div>
);

export function AdminCampaignsTab() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>(mockAdminCampaigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<AdminCampaign | null>(null);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          campaign.office.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    active: campaigns.filter(c => c.status === 'active').length,
    draft: campaigns.filter(c => c.status === 'draft').length,
    paused: campaigns.filter(c => c.status === 'paused').length,
    ended: campaigns.filter(c => c.status === 'ended').length
  };

  const handleStatusChange = (campaignId: string, newStatus: AdminCampaign['status']) => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId ? { ...c, status: newStatus } : c
    ));
    toast({
      title: "Campaign Updated",
      description: `Campaign status changed to ${newStatus}`
    });
  };

  const handleDelete = (campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    toast({
      title: "Campaign Deleted",
      description: "The campaign has been removed",
      variant: "destructive"
    });
  };

  const handleEdit = (campaign: AdminCampaign) => {
    setEditingCampaign(campaign);
    setShowFormDialog(true);
  };

  const handleCreate = () => {
    setEditingCampaign(null);
    setShowFormDialog(true);
  };

  return (
    <div className="space-y-3 sm:space-y-4 pb-20 overflow-hidden">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        <StatCard value={stats.active} label="Active" color="bg-green-500/10" />
        <StatCard value={stats.draft} label="Draft" color="bg-gray-500/10" />
        <StatCard value={stats.paused} label="Paused" color="bg-amber-500/10" />
        <StatCard value={stats.ended} label="Ended" color="bg-red-500/10" />
      </div>

      {/* Action Bar */}
      <div className="flex gap-2">
        <Button onClick={handleCreate} size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700 flex-1 sm:flex-none">
          <Plus className="h-4 w-4" />
          <span className="hidden xs:inline">Create</span> Campaign
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Calendar</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[100px] sm:w-[130px] h-9 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaign List */}
      <div className="space-y-2 sm:space-y-3">
        {filteredCampaigns.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground text-sm">No campaigns found</p>
              <Button onClick={handleCreate} variant="outline" size="sm" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create First Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              <CardContent className="p-3 sm:p-4">
                {/* Header: Avatar + Name Row */}
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                    <AvatarImage src={campaign.candidateAvatar} alt={campaign.candidateName} />
                    <AvatarFallback className="text-sm">{campaign.candidateName[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0 overflow-hidden">
                    {/* Name + Badge Row */}
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm leading-tight line-clamp-1">
                          {campaign.candidateName}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">{campaign.office}</p>
                      </div>
                      <Badge className={`text-[10px] shrink-0 capitalize ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    {/* Slogan */}
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">
                      "{campaign.slogan}"
                    </p>
                    
                    {/* Date Range */}
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      {format(campaign.startDate, "MMM d")} - {format(campaign.endDate, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-border/50">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{campaign.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>👍</span>
                    <span>{campaign.endorsements}</span>
                  </div>
                </div>
                
                {/* Actions Row */}
                <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2.5 border-t border-border/50">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs gap-1"
                    onClick={() => handleEdit(campaign)}
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  
                  {campaign.status === 'active' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-amber-600 gap-1"
                      onClick={() => handleStatusChange(campaign.id, 'paused')}
                    >
                      <Pause className="h-3 w-3" />
                      Pause
                    </Button>
                  )}
                  
                  {campaign.status === 'paused' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-green-600 gap-1"
                      onClick={() => handleStatusChange(campaign.id, 'active')}
                    >
                      <Play className="h-3 w-3" />
                      Resume
                    </Button>
                  )}
                  
                  {campaign.status === 'draft' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-green-600 gap-1"
                      onClick={() => handleStatusChange(campaign.id, 'active')}
                    >
                      <Play className="h-3 w-3" />
                      Publish
                    </Button>
                  )}
                  
                  {(campaign.status === 'active' || campaign.status === 'paused') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-red-600 gap-1"
                      onClick={() => handleStatusChange(campaign.id, 'ended')}
                    >
                      <StopCircle className="h-3 w-3" />
                      End
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-destructive gap-1 ml-auto"
                    onClick={() => handleDelete(campaign.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CampaignFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        campaign={editingCampaign}
      />
    </div>
  );
}
