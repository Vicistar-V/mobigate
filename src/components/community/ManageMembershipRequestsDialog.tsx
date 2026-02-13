import { useState } from "react";
import { 
  X, 
  Search, 
  Eye, 
  Check, 
  XCircle, 
  Clock, 
  UserPlus,
  UserMinus,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Users,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  mockMembershipApplications, 
  mockMembershipManagers,
  mockOnlineMembers,
  MembershipApplication,
  MembershipManager 
} from "@/data/membershipData";

interface ManageMembershipRequestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isOwner?: boolean;
}

export function ManageMembershipRequestsDialog({ 
  open, 
  onOpenChange,
  isOwner = false
}: ManageMembershipRequestsDialogProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<MembershipApplication[]>(mockMembershipApplications);
  const [managers, setManagers] = useState<MembershipManager[]>(mockMembershipManagers);
  const [selectedApplication, setSelectedApplication] = useState<MembershipApplication | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showAssignManagerDialog, setShowAssignManagerDialog] = useState(false);
  const [selectedNewManager, setSelectedNewManager] = useState("");

  const pendingApplications = applications.filter(app => app.status === "pending");
  const underReviewApplications = applications.filter(app => app.status === "under-review");
  const approvedApplications = applications.filter(app => app.status === "approved");
  const rejectedApplications = applications.filter(app => app.status === "rejected");

  const filterApplications = (apps: MembershipApplication[]) => {
    if (!searchQuery) return apps;
    const query = searchQuery.toLowerCase();
    return apps.filter(app => 
      app.fullName.toLowerCase().includes(query) ||
      app.referenceNumber.toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query)
    );
  };

  const handleApprove = (applicationId: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: "approved" as const, 
            reviewedAt: new Date(), 
            reviewedBy: "Membership Manager" 
          }
        : app
    ));
    toast({
      title: "Application Approved",
      description: "The membership application has been approved successfully.",
    });
    setShowDetailDialog(false);
  };

  const handleReject = () => {
    if (!selectedApplication || !rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this application.",
        variant: "destructive"
      });
      return;
    }

    setApplications(prev => prev.map(app => 
      app.id === selectedApplication.id 
        ? { 
            ...app, 
            status: "rejected" as const, 
            reviewedAt: new Date(), 
            reviewedBy: "Membership Manager",
            rejectionReason: rejectionReason
          }
        : app
    ));
    toast({
      title: "Application Rejected",
      description: "The membership application has been rejected.",
    });
    setShowRejectDialog(false);
    setShowDetailDialog(false);
    setRejectionReason("");
  };

  const handleMarkUnderReview = (applicationId: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: "under-review" as const }
        : app
    ));
    toast({
      title: "Marked Under Review",
      description: "The application has been marked for further review.",
    });
  };

  const handleAssignManager = () => {
    if (!selectedNewManager) {
      toast({
        title: "Select a Member",
        description: "Please select a member to assign as manager.",
        variant: "destructive"
      });
      return;
    }

    const member = mockOnlineMembers.find(m => m.id === selectedNewManager);
    if (member) {
      const newManager: MembershipManager = {
        id: `mm-${Date.now()}`,
        name: member.name,
        photo: member.avatar,
        assignedDate: new Date(),
        assignedBy: "Community Owner"
      };
      setManagers(prev => [...prev, newManager]);
      toast({
        title: "Manager Assigned",
        description: `${member.name} has been assigned as a Membership Manager.`,
      });
    }
    setShowAssignManagerDialog(false);
    setSelectedNewManager("");
  };

  const handleRemoveManager = (managerId: string) => {
    setManagers(prev => prev.filter(m => m.id !== managerId));
    toast({
      title: "Manager Removed",
      description: "The Membership Manager has been removed.",
    });
  };

  const getStatusBadge = (status: MembershipApplication["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-amber-500/20 text-amber-600 text-xs">Pending</Badge>;
      case "under-review":
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-600 text-xs">Under Review</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-600 text-xs">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="text-xs">Rejected</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Mobile-optimized Application Card
  const ApplicationCard = ({ application }: { application: MembershipApplication }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header: Avatar + Name + Status */}
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14 border shrink-0">
            <AvatarImage src={application.photo} alt={application.fullName} />
            <AvatarFallback className="text-lg">{application.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base leading-tight">{application.fullName}</h4>
            <p className="text-sm text-muted-foreground font-mono mt-0.5">
              {application.referenceNumber}
            </p>
            <div className="mt-2">
              {getStatusBadge(application.status)}
            </div>
          </div>
        </div>

        {/* Info Row */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Submitted {formatDate(application.submittedAt)}</span>
          </div>
          {application.sponsorName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 shrink-0" />
              <span>Sponsor: {application.sponsorName}</span>
            </div>
          )}
          {application.invitationCode && (
            <Badge variant="outline" className="text-xs">Invited via Code</Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          {/* View Button - Always visible */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full h-10 text-sm"
            onClick={() => {
              setSelectedApplication(application);
              setShowDetailDialog(true);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Full Application
          </Button>
          
          {/* Pending Actions */}
          {application.status === "pending" && (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="default" 
                size="sm" 
                className="h-10 text-sm bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleApprove(application.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="h-10 text-sm"
                onClick={() => {
                  setSelectedApplication(application);
                  setShowRejectDialog(true);
                }}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}

          {application.status === "pending" && (
            <Button 
              variant="secondary" 
              size="sm"
              className="w-full h-10 text-sm"
              onClick={() => handleMarkUnderReview(application.id)}
            >
              <Clock className="h-4 w-4 mr-2" />
              Mark for Review
            </Button>
          )}

          {/* Under Review Actions */}
          {application.status === "under-review" && (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="default" 
                size="sm" 
                className="h-10 text-sm bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleApprove(application.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="h-10 text-sm"
                onClick={() => {
                  setSelectedApplication(application);
                  setShowRejectDialog(true);
                }}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}

          {/* Approved Status */}
          {application.status === "approved" && (
            <Button 
              variant="default" 
              size="sm" 
              className="w-full h-10 text-sm bg-emerald-600 cursor-default pointer-events-none"
              disabled
            >
              <Check className="h-4 w-4 mr-2" />
              Approved
            </Button>
          )}

          {/* Rejected Status */}
          {application.status === "rejected" && (
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full h-10 text-sm cursor-default pointer-events-none"
              disabled
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejected
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Manager Card - Mobile optimized
  const ManagerCard = ({ manager }: { manager: MembershipManager }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14 border shrink-0">
            <AvatarImage src={manager.photo} />
            <AvatarFallback className="text-lg">{manager.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base leading-tight">{manager.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Assigned: {formatDate(manager.assignedDate)}
            </p>
            <p className="text-sm text-muted-foreground">
              By: {manager.assignedBy}
            </p>
          </div>
          {isOwner && (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10 text-destructive hover:text-destructive shrink-0"
              onClick={() => handleRemoveManager(manager.id)}
            >
              <UserMinus className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ApplicationDetailDialog = () => {
    if (!selectedApplication) return null;

    return (
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] p-0 flex flex-col">
          <DialogHeader className="p-4 pb-2 shrink-0">
            <DialogTitle className="text-lg">Application Details</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
            <div className="space-y-4">
              {/* Applicant Header */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-16 w-16 border-2 shrink-0">
                  <AvatarImage src={selectedApplication.photo} />
                  <AvatarFallback className="text-xl">
                    {selectedApplication.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg leading-tight">{selectedApplication.fullName}</h3>
                  <p className="text-sm font-mono text-muted-foreground mt-0.5">
                    {selectedApplication.referenceNumber}
                  </p>
                  <div className="mt-2">
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0 px-4 pb-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{selectedApplication.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{selectedApplication.phone}</span>
                  </div>
                  {selectedApplication.cityOfResidence && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{selectedApplication.cityOfResidence}, {selectedApplication.stateOfOrigin}</span>
                    </div>
                  )}
                  {selectedApplication.occupation && (
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{selectedApplication.occupation}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Application Details */}
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base">Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0 px-4 pb-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Date of Birth</Label>
                    <p className="text-sm font-medium">{selectedApplication.dateOfBirth || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Gender</Label>
                    <p className="text-sm font-medium capitalize">{selectedApplication.gender}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">How they heard about us</Label>
                    <p className="text-sm font-medium capitalize">{selectedApplication.howHeard.replace('-', ' ')}</p>
                  </div>
                  {selectedApplication.sponsorName && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Sponsor/Guarantor</Label>
                      <p className="text-sm font-medium">{selectedApplication.sponsorName}</p>
                    </div>
                  )}
                  {selectedApplication.invitationCode && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Invitation Code</Label>
                      <p className="text-sm font-mono font-medium">{selectedApplication.invitationCode}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm text-muted-foreground">Submitted</Label>
                    <p className="text-sm font-medium">{formatDate(selectedApplication.submittedAt)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Motivation */}
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Motivation Statement
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedApplication.motivation}
                  </p>
                </CardContent>
              </Card>

              {/* Review Information (if reviewed) */}
              {selectedApplication.reviewedAt && (
                <Card>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base">Review Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0 px-4 pb-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Reviewed By</Label>
                      <p className="text-sm font-medium">{selectedApplication.reviewedBy}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Review Date</Label>
                      <p className="text-sm font-medium">{formatDate(selectedApplication.reviewedAt)}</p>
                    </div>
                    {selectedApplication.rejectionReason && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Rejection Reason</Label>
                        <p className="text-sm text-destructive">{selectedApplication.rejectionReason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {(selectedApplication.status === "pending" || selectedApplication.status === "under-review") && (
            <div className="p-4 pt-2 border-t shrink-0">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="default" 
                  className="h-11 text-sm bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleApprove(selectedApplication.id)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button 
                  variant="destructive" 
                  className="h-11 text-sm"
                  onClick={() => setShowRejectDialog(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  const RejectDialog = () => (
    <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Reject Application</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please provide a reason for rejecting this application. This reason is kept internal for admin management.
          </p>
          <div>
            <Label className="text-sm">Reason for Rejection *</Label>
            <Textarea
              placeholder="Enter the reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="h-10">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReject} className="h-10">
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const AssignManagerDialog = () => (
    <Dialog open={showAssignManagerDialog} onOpenChange={setShowAssignManagerDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Assign Membership Manager</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select a community member to assign as a Membership Manager.
          </p>
          <div>
            <Label className="text-sm">Select Member</Label>
            <Select value={selectedNewManager} onValueChange={setSelectedNewManager}>
              <SelectTrigger className="mt-2 h-11">
                <SelectValue placeholder="Choose a member" />
              </SelectTrigger>
              <SelectContent>
                {mockOnlineMembers
                  .filter(m => !managers.find(mgr => mgr.name === m.name))
                  .map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setShowAssignManagerDialog(false)} className="h-10">
            Cancel
          </Button>
          <Button onClick={handleAssignManager} className="h-10">
            Assign Manager
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Manage Membership Requests</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, reference, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="shrink-0 px-4 pt-3 pb-2 bg-background">
          <TabsList className="w-full h-auto p-1 bg-muted/60">
            <div className="grid grid-cols-4 w-full gap-1">
              <TabsTrigger 
                value="pending" 
                className="flex flex-col items-center py-2.5 px-1 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="text-xs font-medium">Pending</span>
                <Badge variant="secondary" className="mt-1 text-xs bg-background/50">{pendingApplications.length + underReviewApplications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="approved" 
                className="flex flex-col items-center py-2.5 px-1 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="text-xs font-medium">Approved</span>
                <Badge variant="secondary" className="mt-1 text-xs bg-background/50">{approvedApplications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="rejected" 
                className="flex flex-col items-center py-2.5 px-1 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="text-xs font-medium">Rejected</span>
                <Badge variant="secondary" className="mt-1 text-xs bg-background/50">{rejectedApplications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="managers" 
                className="flex flex-col items-center py-2.5 px-1 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="text-xs font-medium">Managers</span>
                <Badge variant="secondary" className="mt-1 text-xs bg-background/50">{managers.length}</Badge>
              </TabsTrigger>
            </div>
          </TabsList>
        </div>

        {/* Tab Content - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto touch-auto">
          <div className="p-4 pb-8">
            {/* Pending Tab */}
            <TabsContent value="pending" className="mt-0">
              {filterApplications([...pendingApplications, ...underReviewApplications]).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-base font-medium">No pending applications</p>
                  <p className="text-sm mt-1">New applications will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filterApplications([...pendingApplications, ...underReviewApplications]).map(app => (
                    <ApplicationCard key={app.id} application={app} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Approved Tab */}
            <TabsContent value="approved" className="mt-0">
              {filterApplications(approvedApplications).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Check className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-base font-medium">No approved applications</p>
                  <p className="text-sm mt-1">Approved members will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filterApplications(approvedApplications).map(app => (
                    <ApplicationCard key={app.id} application={app} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Rejected Tab */}
            <TabsContent value="rejected" className="mt-0">
              {filterApplications(rejectedApplications).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <XCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-base font-medium">No rejected applications</p>
                  <p className="text-sm mt-1">Rejected applications will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filterApplications(rejectedApplications).map(app => (
                    <ApplicationCard key={app.id} application={app} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Managers Tab */}
            <TabsContent value="managers" className="mt-0 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-base">Admins</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Users who can approve or reject applications
                  </p>
                </div>
                {isOwner && (
                  <Button 
                    size="sm" 
                    className="h-9 shrink-0"
                    onClick={() => setShowAssignManagerDialog(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Assign
                  </Button>
                )}
              </div>

              <Separator />

              {managers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-base font-medium">No managers assigned</p>
                  {isOwner && (
                    <Button 
                      variant="outline" 
                      className="mt-4 h-10"
                      onClick={() => setShowAssignManagerDialog(true)}
                    >
                      Assign First Manager
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {managers.map(manager => (
                    <ManagerCard key={manager.id} manager={manager} />
                  ))}
                </div>
              )}

              {!isOwner && (
                <p className="text-sm text-center text-muted-foreground italic pt-4">
                  Only the Community Owner can assign or remove Admins
                </p>
              )}
            </TabsContent>
          </div>
        </div>
      </Tabs>

      {/* Sub-dialogs */}
      <ApplicationDetailDialog />
      <RejectDialog />
      <AssignManagerDialog />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] h-[92vh] flex flex-col touch-auto overflow-hidden">
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] h-[85vh] p-0 flex flex-col overflow-hidden">
        {content}
      </DialogContent>
    </Dialog>
  );
}