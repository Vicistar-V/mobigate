import { useState } from "react";
import { CheckCircle, XCircle, Clock, AlertCircle, Search, FileText, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockClearanceRequests, AdminClearanceRequest, ClearanceDocument } from "@/data/adminElectionData";
import { useToast } from "@/hooks/use-toast";
import { ClearanceReviewSheet } from "./ClearanceReviewSheet";
import { format } from "date-fns";

const getStatusColor = (status: AdminClearanceRequest['status']) => {
  switch (status) {
    case 'approved':
      return 'bg-green-500/10 text-green-600';
    case 'pending':
      return 'bg-amber-500/10 text-amber-600';
    case 'rejected':
      return 'bg-red-500/10 text-red-600';
    case 'more_info_needed':
      return 'bg-blue-500/10 text-blue-600';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getDocStatusIcon = (status: ClearanceDocument['status']) => {
  switch (status) {
    case 'verified':
      return <CheckCircle className="h-3 w-3 text-green-600" />;
    case 'submitted':
      return <Clock className="h-3 w-3 text-amber-600" />;
    case 'rejected':
      return <XCircle className="h-3 w-3 text-red-600" />;
    case 'missing':
      return <AlertCircle className="h-3 w-3 text-gray-400" />;
    default:
      return null;
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

export function AdminClearancesTab() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<AdminClearanceRequest[]>(mockClearanceRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<AdminClearanceRequest | null>(null);
  const [showReviewSheet, setShowReviewSheet] = useState(false);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          request.office.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    moreInfo: requests.filter(r => r.status === 'more_info_needed').length
  };

  const handleReview = (request: AdminClearanceRequest) => {
    setSelectedRequest(request);
    setShowReviewSheet(true);
  };

  const handleQuickApprove = (requestId: string) => {
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'approved' as const, reviewedAt: new Date(), reviewedBy: 'Admin' } : r
    ));
    toast({
      title: "Candidate Cleared",
      description: "The candidate has been approved for the election"
    });
  };

  const handleQuickReject = (requestId: string) => {
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' as const, reviewedAt: new Date(), reviewedBy: 'Admin' } : r
    ));
    toast({
      title: "Clearance Rejected",
      description: "The candidate's clearance has been rejected",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        <StatBadge value={stats.pending} label="Pending" icon={Clock} color="bg-amber-500/10" />
        <StatBadge value={stats.approved} label="Approved" icon={CheckCircle} color="bg-green-500/10" />
        <StatBadge value={stats.rejected} label="Rejected" icon={XCircle} color="bg-red-500/10" />
        <StatBadge value={stats.moreInfo} label="More Info" icon={AlertCircle} color="bg-blue-500/10" />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="more_info_needed">More Info Needed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clearance Requests List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No clearance requests found</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.candidateAvatar} alt={request.candidateName} />
                    <AvatarFallback>{request.candidateName[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm truncate">{request.candidateName}</h4>
                        <p className="text-xs text-muted-foreground">{request.office}</p>
                      </div>
                      <Badge className={`text-[10px] shrink-0 ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Documents Checklist */}
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Documents:</p>
                      <div className="grid grid-cols-2 gap-1">
                        {request.documents.map((doc, index) => (
                          <div key={index} className="flex items-center gap-1.5 text-xs">
                            {getDocStatusIcon(doc.status)}
                            <span className={doc.status === 'missing' ? 'text-muted-foreground' : ''}>
                              {doc.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes if any */}
                    {request.notes && (
                      <p className="mt-2 text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/30 p-2 rounded">
                        📝 {request.notes}
                      </p>
                    )}

                    {/* Rejection Reason */}
                    {request.rejectionReason && (
                      <p className="mt-2 text-xs text-red-600 bg-red-50 dark:bg-red-950/30 p-2 rounded">
                        ❌ {request.rejectionReason}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        Submitted: {format(request.submittedAt, "MMM d, yyyy")}
                      </span>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleReview(request)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                        
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs text-green-600"
                              onClick={() => handleQuickApprove(request.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs text-red-600"
                              onClick={() => handleQuickReject(request.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <ClearanceReviewSheet
        open={showReviewSheet}
        onOpenChange={setShowReviewSheet}
        request={selectedRequest}
        onApprove={(id) => {
          handleQuickApprove(id);
          setShowReviewSheet(false);
        }}
        onReject={(id, reason) => {
          setRequests(prev => prev.map(r => 
            r.id === id ? { ...r, status: 'rejected' as const, reviewedAt: new Date(), reviewedBy: 'Admin', rejectionReason: reason } : r
          ));
          toast({
            title: "Clearance Rejected",
            description: "The candidate's clearance has been rejected",
            variant: "destructive"
          });
          setShowReviewSheet(false);
        }}
        onRequestMoreInfo={(id, notes) => {
          setRequests(prev => prev.map(r => 
            r.id === id ? { ...r, status: 'more_info_needed' as const, notes } : r
          ));
          toast({
            title: "More Information Requested",
            description: "The candidate has been notified to provide additional documents"
          });
          setShowReviewSheet(false);
        }}
      />
    </div>
  );
}
