import { useState } from "react";
import { Plus, Eye, Pause, Play, StopCircle, Edit, Trash2, Search, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    case 'draft':
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    case 'paused':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    case 'ended':
      return 'bg-red-500/10 text-red-600 border-red-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

interface StatBadgeProps {
  value: number;
  label: string;
  color: string;
}

const StatBadge = ({ value, label, color }: StatBadgeProps) => (
  <div className={`flex flex-col items-center p-3 rounded-lg ${color}`}>
    <span className="text-2xl font-bold">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
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
    <div className="space-y-4 pb-20">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        <StatBadge value={stats.active} label="Active" color="bg-green-500/10" />
        <StatBadge value={stats.draft} label="Draft" color="bg-gray-500/10" />
        <StatBadge value={stats.paused} label="Paused" color="bg-amber-500/10" />
        <StatBadge value={stats.ended} label="Ended" color="bg-red-500/10" />
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleCreate} className="gap-2 bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          View Calendar
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaign List */}
      <div className="space-y-3">
        {filteredCampaigns.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No campaigns found</p>
              <Button onClick={handleCreate} variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create First Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredCampaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={campaign.candidateAvatar} alt={campaign.candidateName} />
                    <AvatarFallback>{campaign.candidateName[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm truncate">{campaign.candidateName}</h4>
                        <p className="text-xs text-muted-foreground">{campaign.office}</p>
                      </div>
                      <Badge className={`text-[10px] ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">
                      "{campaign.slogan}"
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{format(campaign.startDate, "MMM d")} - {format(campaign.endDate, "MMM d, yyyy")}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs">
                        <Eye className="h-3 w-3" />
                        <span>{campaign.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span>👍</span>
                        <span>{campaign.endorsements}</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => handleEdit(campaign)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      
                      {campaign.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs text-amber-600"
                          onClick={() => handleStatusChange(campaign.id, 'paused')}
                        >
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                      )}
                      
                      {campaign.status === 'paused' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs text-green-600"
                          onClick={() => handleStatusChange(campaign.id, 'active')}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Resume
                        </Button>
                      )}
                      
                      {campaign.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs text-green-600"
                          onClick={() => handleStatusChange(campaign.id, 'active')}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Publish
                        </Button>
                      )}
                      
                      {(campaign.status === 'active' || campaign.status === 'paused') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs text-red-600"
                          onClick={() => handleStatusChange(campaign.id, 'ended')}
                        >
                          <StopCircle className="h-3 w-3 mr-1" />
                          End
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs text-destructive"
                        onClick={() => handleDelete(campaign.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
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
